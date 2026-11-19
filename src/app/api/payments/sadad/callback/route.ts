/**
 * POST /api/payments/sadad/callback — where SADAD sends the customer's
 * browser after the hosted payment page (a form POST, not JSON).
 *
 * A verified result updates the order and the browser is redirected (303,
 * so a refresh never re-posts) to the order page, whose link is signed so
 * only this customer can open it. An unverified result changes nothing and
 * gets a neutral "we're confirming your payment" notice instead: handing out
 * the signed link for any posted ORDERID would open any customer's order page.
 */

import { alertUnrecordedPayment, notifyPaymentUpdate } from "@/lib/payments/notify";
import { callbackOrigin, orderPagePath, sadadConfig } from "@/lib/payments/config";
import { applyPaymentResult, isOrderId, readOrder, type Order } from "@/lib/payments/orders";
import { parseSadadCallback, verifySadadChecksum } from "@/lib/payments/sadad";

export const maxDuration = 30;

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

export async function POST(request: Request) {
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
  if (isOrderId(result.orderId)) {
    try {
      if (verified) {
        const update = await applyPaymentResult(result, "callback");
        notifyPaymentUpdate(update);
        order = update?.order ?? null;
        if (!update) alertUnrecordedPayment(result, "callback", "order not found");
      } else {
        order = (await readOrder(result.orderId))?.order ?? null;
      }
    } catch (err) {
      storeFailed = true;
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[sadad] callback ${result.orderId}: ${reason}`);
      if (verified) alertUnrecordedPayment(result, "callback", `order store error: ${reason}`);
    }
  } else if (verified) {
    alertUnrecordedPayment(result, "callback", "not a website order id");
  }

  const locale = order?.locale ?? "en";
  const target =
    order && verified
      ? orderPagePath(order.locale, order.id)
      : order || storeFailed
        ? `/${locale}/b2c/cart?payment=checking`
        : "/en/b2c/cart?payment=unknown";
  // Back onto the canonical site (the domain registered with SADAD), whatever
  // host or proxy the POST came in through.
  return Response.redirect(new URL(target, callbackOrigin(request)), 303);
}

/** Someone opening the URL directly: nothing to show here. */
export function GET(request: Request) {
  return Response.redirect(new URL("/en/b2c/cart", request.url), 303);
}
