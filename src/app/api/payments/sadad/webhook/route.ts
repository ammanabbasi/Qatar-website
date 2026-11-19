/**
 * POST /api/payments/sadad/webhook — SADAD's server-to-server notification
 * (JSON), configured in SADAD panel → Online Payment → Payment Gateway →
 * Webhook. It arrives even when the customer closes the browser, and again
 * when SADAD settles an in-progress payment after midnight.
 *
 * SADAD requires HTTP 200 with {"status":"success"} for EVERY delivery —
 * even an invalid or duplicate one — or it retries. So this route always
 * acknowledges, and only a verified payload for one of our orders changes
 * anything. Replays are harmless: applyPaymentResult ignores an event it
 * already recorded and paid is final.
 */

import { alertUnrecordedPayment, notifyPaymentUpdate } from "@/lib/payments/notify";
import { sadadConfig } from "@/lib/payments/config";
import { applyPaymentResult, isOrderId } from "@/lib/payments/orders";
import { parseSadadWebhook, verifySadadChecksum } from "@/lib/payments/sadad";

export const maxDuration = 30;

function ack() {
  return Response.json({ status: "success" }, { status: 200, headers: { "Cache-Control": "no-store" } });
}

function parseBody(raw: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    // Not JSON — accept a form-encoded body too rather than drop the event.
    const form = Object.fromEntries(new URLSearchParams(raw));
    return Object.keys(form).length > 0 ? form : null;
  }
}

export async function POST(request: Request) {
  const config = sadadConfig();
  const body = parseBody(await request.text().catch(() => ""));
  if (!config || !body) {
    console.warn(`[sadad] webhook ignored: ${!config ? "payments not configured" : "unreadable body"}`);
    return ack();
  }

  const result = parseSadadWebhook(body);
  const verified =
    verifySadadChecksum(body, config.secretKey, config.merchantId) &&
    (!result.merchantId || result.merchantId === config.merchantId);
  console.info(
    `[sadad] webhook ${result.orderId || "(no order id)"} ${result.outcome} verified=${verified} sandbox=${result.sandbox} txn=${result.transactionNumber}`,
  );
  if (!verified) {
    console.warn(`[sadad] webhook NOT verified; fields: ${Object.keys(body).sort().join(",")}`);
    return ack();
  }
  if (!isOrderId(result.orderId)) return ack(); // e.g. a SADAD invoice, not a website order

  try {
    const update = await applyPaymentResult(result, "webhook");
    if (!update) {
      console.warn(`[sadad] webhook for unknown order ${result.orderId}`);
      alertUnrecordedPayment(result, "webhook", "order not found");
    }
    notifyPaymentUpdate(update);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[sadad] webhook ${result.orderId}: ${reason}`);
    // SADAD won't retry (it must always get 200), so staff are told instead.
    alertUnrecordedPayment(result, "webhook", `order store error: ${reason}`);
  }
  return ack();
}
