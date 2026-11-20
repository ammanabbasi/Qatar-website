/**
 * Background order sweep, run inside the long-lived Railway server every
 * 15 minutes (started from src/instrumentation.ts):
 *
 *  1. Paid emails still owed (the send failed after both SADAD notifications,
 *     or the server restarted mid-send) are claimed and sent again, up to the
 *     attempt cap in orders.ts. Before this sweep they waited for a SADAD
 *     event that usually never came.
 *  2. An online cart checkout left unpaid — awaiting payment or failed, with
 *     no other attempt of the same cart paid or under a check — for 45
 *     minutes gets ONE staff email so someone can follow up on WhatsApp.
 *     (2026-11-19: a QAR 624.75 checkout was abandoned and nobody knew.)
 *     PPF pay-now bookings already alert staff when booked, so they're skipped.
 *  3. A PPF booking whose staff alert never went out (SMTP down when it was
 *     booked) is alerted now, so no saved booking goes unseen. Five minutes'
 *     grace first: the booking request sends its own alert just after replying.
 *
 * All steps are idempotent (email claims, the "unpaid_alerted" flag), so an
 * overlapping run or a restart never sends an email twice.
 */

import { sendOrderEmails } from "./email";
import {
  bookedAlertMissing,
  claimBookedAlert,
  claimPaidEmails,
  flagOrder,
  listRecentOrders,
  paidEmailsMissing,
  unflagOrder,
  type Order,
} from "./orders";

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const UNPAID_FLAG = "unpaid_alerted";

/** A positive number of milliseconds from the environment (tests shorten the waits), else the default. */
function envMs(name: string, fallback: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export type SweepResult = { emailRetries: number; unpaidAlerts: number; bookingAlerts: number };

export async function runOrderSweep(
  options: { now?: number; unpaidAfterMs?: number; bookedGraceMs?: number } = {},
): Promise<SweepResult> {
  const now = options.now ?? Date.now();
  const unpaidAfterMs = options.unpaidAfterMs ?? envMs("ORDER_SWEEP_UNPAID_AFTER_MS", 45 * MINUTE_MS);
  const bookedGraceMs = options.bookedGraceMs ?? envMs("ORDER_SWEEP_BOOKED_GRACE_MS", 5 * MINUTE_MS);
  const orders = await listRecentOrders(now - 7 * DAY_MS);
  const result: SweepResult = { emailRetries: 0, unpaidAlerts: 0, bookingAlerts: 0 };

  // 1. Paid emails still owed.
  for (const o of orders) {
    if (!paidEmailsMissing(o)) continue;
    const claimed = await claimPaidEmails(o.id); // null: a fresh claim stands, or the tries are used up
    if (!claimed) continue;
    result.emailRetries++;
    await sendOrderEmails(claimed, "paid");
  }

  // 2. Online cart checkouts left unpaid, one alert per cart reference.
  for (const latest of unpaidCheckoutsToAlert(orders, now, unpaidAfterMs)) {
    if (!(await flagOrder(latest.id, UNPAID_FLAG))) continue;
    if (await sendOrderEmails(latest, "unpaid")) result.unpaidAlerts++;
    else await unflagOrder(latest.id, UNPAID_FLAG); // not sent: the next sweep tries again
  }

  // 3. PPF bookings staff never heard about.
  for (const o of orders) {
    if (!bookedAlertMissing(o) || now - Date.parse(o.createdAt) < bookedGraceMs) continue;
    const claimed = await claimBookedAlert(o.id); // null: a fresh claim stands, or the tries are used up
    if (!claimed) continue;
    if (await sendOrderEmails(claimed, "booked")) result.bookingAlerts++;
  }
  return result;
}

/**
 * The latest attempt of each online cart checkout that has been left unpaid
 * for `unpaidAfterMs` (but under 3 days), when no attempt of that cart is
 * paid, under a payment check or already alerted.
 */
export function unpaidCheckoutsToAlert(orders: Order[], now: number, unpaidAfterMs: number): Order[] {
  const carts = new Map<string, Order[]>();
  for (const o of orders) if (o.kind === "shop") carts.set(o.ref, [...(carts.get(o.ref) ?? []), o]);
  const due: Order[] = [];
  for (const attempts of carts.values()) {
    if (attempts.some((a) => a.status === "paid" || a.status === "review" || a.flags.includes(UNPAID_FLAG))) continue;
    const latest = attempts.reduce((x, y) => (Date.parse(y.createdAt) > Date.parse(x.createdAt) ? y : x));
    if (latest.pay !== "online" || (latest.status !== "awaiting_payment" && latest.status !== "failed")) continue;
    // The customer may still be on SADAD's page; and an old one is history, not a lead.
    const age = now - Date.parse(latest.createdAt);
    if (age < unpaidAfterMs || age > 3 * DAY_MS) continue;
    due.push(latest);
  }
  return due;
}

let started = false;
let running = false;

/** Runs the sweep a minute after start, then every ORDER_SWEEP_INTERVAL_MS (15 minutes). */
export function startOrderSweep(): void {
  if (started) return;
  started = true;
  const every = envMs("ORDER_SWEEP_INTERVAL_MS", 15 * MINUTE_MS);
  const tick = () => {
    if (running) return;
    running = true;
    runOrderSweep()
      .then((r) => {
        if (r.emailRetries || r.unpaidAlerts || r.bookingAlerts) {
          console.info(
            `[sweep] paid-email retries: ${r.emailRetries}, unpaid-order alerts: ${r.unpaidAlerts}, booking alerts: ${r.bookingAlerts}`,
          );
        }
      })
      .catch((err: unknown) => console.error(`[sweep] failed: ${err instanceof Error ? err.message : err}`))
      .finally(() => {
        running = false;
      });
  };
  setTimeout(tick, Math.min(every, MINUTE_MS)).unref?.();
  setInterval(tick, every).unref?.();
  console.info(`[sweep] order sweep every ${Math.round(every / 1000)} s`);
}
