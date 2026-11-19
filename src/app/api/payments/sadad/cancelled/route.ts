/**
 * GET /api/payments/sadad/cancelled?order_id=… — a customer who presses
 * "Back" → "Confirm" on SADAD's payment page is NOT sent to CALLBACK_URL:
 * SADAD redirects the browser to the website root with ?order_id=<ORDER_ID>
 * (seen on the live gateway, 2026-11-19; no callback or webhook follows).
 * next.config.ts routes those root URLs here, and this sends the customer
 * back to where they were paying, in their language, with a notice.
 *
 * Nothing is verified here, so nothing changes: the order simply stays
 * "awaiting payment" (a PPF booking is still a saved booking request).
 */

import { callbackOrigin } from "@/lib/payments/config";
import { isOrderId, readOrder } from "@/lib/payments/orders";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("order_id") ?? "";
  let locale: "en" | "ar" = "en";
  let kind: "shop" | "ppf" = id.startsWith("PPF-") ? "ppf" : "shop";
  if (isOrderId(id)) {
    try {
      const found = await readOrder(id);
      if (found) {
        locale = found.order.locale;
        kind = found.order.kind;
      }
    } catch {
      // The store is only consulted for the language; English is fine without it.
    }
  }
  console.info(`[sadad] payment cancelled on SADAD's page: ${isOrderId(id) ? id : "(no order id)"}`);
  const target =
    kind === "ppf" ? `/${locale}/b2c/ppf-installation?payment=cancelled` : `/${locale}/b2c/cart?payment=cancelled`;
  return Response.redirect(new URL(target, callbackOrigin(request)), 303);
}
