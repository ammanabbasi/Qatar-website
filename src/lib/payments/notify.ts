import { after } from "next/server";
import { sendOrderEmails, sendUnmatchedPaymentAlert, sendUnverifiedResultAlert } from "./email";
import {
  findOtherPaidAttempt,
  findOtherPaidPpfBooking,
  flagOrder,
  hasPaymentEvent,
  readOrder,
  type Order,
  type PaymentUpdate,
} from "./orders";
import type { SadadResult } from "./sadad";

/**
 * Emails go out after the response, so neither the customer's redirect nor
 * SADAD's webhook waits on SMTP. Only the caller holding the email claim
 * (see applyPaymentResult) sends the paid emails, so each goes out once — and
 * a later SADAD event retries whichever never went out. A payment to check
 * alerts staff on its own, even when the paid emails are also due.
 */
export function notifyPaymentUpdate(update: PaymentUpdate | null): void {
  if (!update) return;
  const { order, review } = update;
  if (update.sendPaidEmails) after(() => sendOrderEmails(order, "paid"));
  if (review) after(() => sendOrderEmails(order, "review", review));
  if (update.newlyPaid) after(() => checkOtherAttempts(order));
}

/**
 * Each retry of a payment is its own order id, so a customer who paid an
 * attempt that looked failed or pending (SADAD can settle it later) and then
 * paid again is only caught by looking at the other attempts: the same cart
 * reference and mobile, or for PPF the same package and mobile this week.
 */
async function checkOtherAttempts(order: Order): Promise<void> {
  try {
    const other =
      order.kind === "ppf"
        ? await findOtherPaidPpfBooking(order)
        : await findOtherPaidAttempt(order.ref, order.customer.mobile, order.id);
    if (!other) return;
    console.error(`[orders] ${order.id} paid while attempt ${other.id} is ${other.status}: possible double charge`);
    await sendOrderEmails(order, "review", "paid_other_attempt");
  } catch (err) {
    console.error(`[orders] could not check other attempts of ${order.ref}: ${err instanceof Error ? err.message : err}`);
  }
}

/**
 * SADAD verified a successful payment we could not record (order unknown or
 * the store failed). Staff must hear about it: the customer has paid.
 */
export function alertUnrecordedPayment(result: SadadResult, source: "callback" | "webhook", reason: string): void {
  if (result.outcome !== "paid") return;
  console.error(
    `[sadad] PAID BUT NOT RECORDED via ${source}: order=${result.orderId} txn=${result.transactionNumber} amount=${result.amountQar} (${reason})`,
  );
  after(() => sendUnmatchedPaymentAlert(result, source, reason));
}

/** How long the other channel gets to deliver a verified copy before staff are told. */
const UNVERIFIED_GRACE_MS = 15_000;

/**
 * A "paid" result for one of our orders whose signature does not verify:
 * forged, or SADAD changed how it signs (then every payment would silently
 * stop being recorded). The order is never changed by it. Unless the other
 * channel delivers a verified copy within a few seconds, staff are told once
 * per order to check the SADAD panel.
 */
export function alertUnverifiedPaid(result: SadadResult, source: "callback" | "webhook"): void {
  if (result.outcome !== "paid") return;
  // Unknown or already-flagged orders return at once, so a stream of forged
  // results can't keep functions waiting out the grace period.
  const needsLook = (o: Order | undefined) =>
    Boolean(o) && !o!.flags.includes("unverified_result") && !hasPaymentEvent(o!, result);
  after(async () => {
    try {
      if (!needsLook((await readOrder(result.orderId))?.order)) return;
      await new Promise((r) => setTimeout(r, UNVERIFIED_GRACE_MS));
      if (!needsLook((await readOrder(result.orderId))?.order)) return;
      if (!(await flagOrder(result.orderId, "unverified_result"))) return;
      await sendUnverifiedResultAlert(result, source);
    } catch (err) {
      console.error(`[sadad] unverified-result check for ${result.orderId} failed: ${err instanceof Error ? err.message : err}`);
    }
  });
}
