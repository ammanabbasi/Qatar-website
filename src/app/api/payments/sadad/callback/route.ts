/**
 * POST /api/payments/sadad/callback — where SADAD sends the customer's
 * browser after the hosted payment page (a form POST, not JSON).
 *
 * A verified result updates the order and the browser is redirected (303,
 * so a refresh never re-posts) to the order page, with that page's key as a
 * private cookie so only this customer can open it. An unverified result
 * changes nothing and gets a neutral "we're confirming your payment" notice
 * instead: handing out the key for any posted ORDERID would open any
 * customer's order page.
 */

import { alertUnrecordedPayment, alertUnverifiedPaid, notifyPaymentUpdate } from "@/lib/payments/notify";
import { callbackOrigin, redirectToOrderPage, sadadConfig } from "@/lib/payments/config";
import { applyPaymentResult, hasPaymentEvent, isOrderId, readOrder, type Order } from "@/lib/payments/orders";
import { parseSadadCallback, verifySadadChecksum } from "@/lib/payments/sadad";

// Room for the emails sent after the response (SMTP retries, the unverified-result grace period).
export const maxDuration = 60;

async function readFields(request: Request): Promise<Record<string, string>> {
  const fields: Record<string, string> = {};
  try {
    if ((request.headers.get("content-type") ?? "").includes("application/json")) {
      const body = (await request.json()) as Record<string, unknown>;
      for (const [k, v] of Object.entries(body ?? {})) fields[k] = v == null ? "" : String(v);
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) if (typeof v === "string") fields[k] = v;
    }
  } catch {
    // An unreadable body is treated like an unverified one.
  }
  return fields;
}

/**
 * Whatever goes wrong in here, the customer must not land on a bare error
 * page with no way forward (they may just have paid): the cart's "confirming
 * your payment" notice, with its WhatsApp link carrying the cart, instead.
 * The webhook records the payment on its own.
 */
export async function POST(request: Request) {
  try {
    return await handleCallback(request);
  } catch (err) {
    console.error(`[sadad] callback crashed: ${err instanceof Error ? (err.stack ?? err.message) : err}`);
    let origin = "";
    try {
      origin = callbackOrigin(request);
    } catch {
      origin = new URL(request.url).origin;
    }
    return Response.redirect(new URL("/en/b2c/cart?payment=checking", origin), 303);
  }
}

async function handleCallback(request: Request): Promise<Response> {
  const config = sadadConfig();
  const fields = await readFields(request);
  const result = parseSadadCallback(fields);
  // A genuine result names a status. (A request form we signed ourselves also
  // carries a valid checksum, but no status — it must not count as SADAD's.)
  const hasStatus = Boolean(fields.transaction_status || fields.STATUS);
  const verified = Boolean(
    config &&
      hasStatus &&
      verifySadadChecksum(fields, config.secretKey, config.merchantId) &&
      (!result.merchantId || result.merchantId === config.merchantId),
  );
  console.info(
    `[sadad] callback ${result.orderId || "(no order id)"} ${result.outcome} verified=${verified} sandbox=${result.sandbox} txn=${result.transactionNumber} msg="${result.message}"`,
  );
  if (!verified) {
    console.warn(`[sadad] callback NOT verified; fields: ${Object.keys(fields).sort().join(",")}`);
  }

  let order: Order | null = null;
  let storeFailed = false;
  let locale: Order["locale"] = "en";
  if (isOrderId(result.orderId)) {
    try {
      if (verified) {
        const update = await applyPaymentResult(result, "callback");
        notifyPaymentUpdate(update);
        order = update?.order ?? null;
        if (!update) alertUnrecordedPayment(result, "callback", "order not found");
      } else {
        order = (await readOrder(result.orderId))?.order ?? null;
        if (order) alertUnverifiedPaid(result, "callback");
      }
    } catch (err) {
      storeFailed = true;
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[sadad] callback ${result.orderId}: ${reason}`);
      if (verified) {
        const current = (await readOrder(result.orderId).catch(() => null))?.order ?? null;
        if (current) locale = current.locale;
        // Recorded meanwhile (by the webhook, or by this call's own write whose
        // reply was lost): the order page shows the payment. Not recorded: no
        // order page — it could offer "Try again" to someone just charged — but
        // the "confirming your payment, don't pay again" notice.
        if (current && hasPaymentEvent(current, result)) order = current;
        // Staff stand down only when the webhook recorded it: its caller holds
        // the email claim. A landed write of our own sent no emails.
        if (!current || !hasPaymentEvent(current, result, "webhook")) {
          alertUnrecordedPayment(result, "callback", `order store error: ${reason}`);
        }
      }
    }
  } else if (verified) {
    alertUnrecordedPayment(result, "callback", "not a website order id");
  }

  // Back onto the canonical site (the domain registered with SADAD), whatever
  // host or proxy the POST came in through.
  const origin = callbackOrigin(request);
  if (order && verified) return redirectToOrderPage(origin, order.locale, order.id);
  const target =
    order || storeFailed ? `/${order?.locale ?? locale}/b2c/cart?payment=checking` : "/en/b2c/cart?payment=unknown";
  return Response.redirect(new URL(target, origin), 303);
}

/** Someone opening the URL directly: nothing to show here. */
export function GET(request: Request) {
  return Response.redirect(new URL("/en/b2c/cart", request.url), 303);
}
