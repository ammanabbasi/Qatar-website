/**
 * Server-side payment settings, read from environment variables.
 *
 *   SADAD_MERCHANT_ID   SADAD merchant ID (MID) — shown at the top of the SADAD panel.
 *   SADAD_SECRET_KEY    Test or Live secret key from SADAD panel → Online Payment →
 *                       Payment Gateway → Configure API. The key decides whether
 *                       SADAD opens its sandbox or live checkout. Never commit it.
 *   SADAD_WEBSITE       Domain registered next to that key (default abktradingservice.com).
 *   PAYMENTS_PUBLIC     "1" shows online payment to every visitor. Unset, it is only
 *                       shown on a device that opened any page with ?pay=preview
 *                       (for the go-live check); ?pay=off clears that again.
 *   PAYMENTS_CALLBACK_ORIGIN  Optional origin for SADAD's return URL (local tunnel tests).
 *
 * Pages that render the checkout are static, so a change here reaches them on
 * the next deployment (Vercel redeploys on every env change anyway).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE } from "@/lib/constants";

export type PaymentsVisibility = "off" | "preview" | "public";

export type SadadConfig = { merchantId: string; secretKey: string; website: string };

export function sadadConfig(): SadadConfig | null {
  const merchantId = process.env.SADAD_MERCHANT_ID?.trim() ?? "";
  const secretKey = process.env.SADAD_SECRET_KEY?.trim() ?? "";
  if (!/^\d{4,12}$/.test(merchantId) || secretKey.length < 8) return null;
  const website = process.env.SADAD_WEBSITE?.trim() || SITE.domain;
  return { merchantId, secretKey, website };
}

export function paymentsVisibility(): PaymentsVisibility {
  if (!sadadConfig()) return "off";
  return process.env.PAYMENTS_PUBLIC?.trim() === "1" ? "public" : "preview";
}

/**
 * Origin for SADAD's return URL. Production always answers on the canonical
 * domain (the one registered with SADAD), whatever host the request came in on.
 */
export function callbackOrigin(request: Request): string {
  const override = process.env.PAYMENTS_CALLBACK_ORIGIN?.trim();
  if (override) return override.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return SITE.url;
  return new URL(request.url).origin;
}

/**
 * The order page link carries an HMAC of the order id, so order ids (which
 * appear in WhatsApp messages and emails) can't be used to open someone
 * else's order page. Without a secret there is no valid token at all.
 *
 * Keyed on a value that outlives SADAD key changes (moving from the test key
 * to the live key must not break links already emailed): ORDER_LINK_SECRET if
 * set, else the order store's own token, else the SADAD key.
 */
function linkKey(): string | null {
  const secret =
    process.env.ORDER_LINK_SECRET?.trim() ||
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.SADAD_SECRET_KEY?.trim();
  return secret ? `abk-order-link:v1:${secret}` : null;
}

export function orderToken(orderId: string): string {
  const key = linkKey();
  if (!key) return "";
  return createHmac("sha256", key).update(orderId).digest("base64url").slice(0, 32);
}

export function isValidOrderToken(orderId: string, token: unknown): boolean {
  if (typeof token !== "string" || token.length !== 32) return false;
  const expected = orderToken(orderId);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The order page's plain address (no key in it). */
export function orderPagePath(locale: "en" | "ar", orderId: string): string {
  return `/${locale}/b2c/order/${encodeURIComponent(orderId)}`;
}

/** The signed link for emails: /api/orders/open hands the key over as the cookie (see redirectToOrderPage). */
export function orderLinkPath(locale: "en" | "ar", orderId: string): string {
  return `/api/orders/open?l=${locale}&id=${encodeURIComponent(orderId)}&t=${orderToken(orderId)}`;
}

/** Holds one order page's key in the customer's browser (HttpOnly, never seen by scripts). */
export function orderCookieName(orderId: string): string {
  return `abk_order_${orderId}`;
}

const ORDER_COOKIE_MAX_AGE_S = 90 * 24 * 60 * 60;

/**
 * Hands the order page's key over as a private cookie, then sends the browser
 * to the order page with the key in the address plus `c=1` ("the cookie was
 * offered"). A browser that kept the cookie is redirected at once to the
 * page's plain address, so the key leaves the address bar: not in analytics
 * page or referrer URLs (Google tracks the previous address itself), the
 * browser history, a screenshot or a shared link. A browser that blocks
 * cookies still gets its order page, with the key left in the address.
 */
export function redirectToOrderPage(origin: string, locale: "en" | "ar", orderId: string): Response {
  const location = new URL(`${orderPagePath(locale, orderId)}?t=${orderToken(orderId)}&c=1`, origin);
  const cookie = [
    `${orderCookieName(orderId)}=${orderToken(orderId)}`,
    "Path=/",
    `Max-Age=${ORDER_COOKIE_MAX_AGE_S}`,
    "HttpOnly",
    "SameSite=Lax",
    ...(location.protocol === "https:" ? ["Secure"] : []),
  ].join("; ");
  return new Response(null, {
    status: 303,
    headers: { Location: location.toString(), "Set-Cookie": cookie, "Cache-Control": "no-store" },
  });
}
