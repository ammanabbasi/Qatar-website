/**
 * GET /api/orders/open?l=…&id=…&t=… — the order page sends a signed link here
 * (the receipt email's "view your order" link carries the key as `?t=`). A
 * valid key becomes the order's private cookie and the browser lands on the
 * order page's plain address, so the key never stays in the address bar.
 */

import { callbackOrigin, isValidOrderToken, redirectToOrderPage } from "@/lib/payments/config";
import { isOrderId } from "@/lib/payments/orders";

export function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("l") === "ar" ? "ar" : "en";
  const id = url.searchParams.get("id") ?? "";
  const origin = callbackOrigin(request);
  if (!isOrderId(id) || !isValidOrderToken(id, url.searchParams.get("t"))) {
    return Response.redirect(new URL(`/${locale}/b2c/cart`, origin), 303);
  }
  return redirectToOrderPage(origin, locale, id);
}
