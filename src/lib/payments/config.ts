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

export function orderPagePath(locale: "en" | "ar", orderId: string): string {
  return `/${locale}/b2c/order/${encodeURIComponent(orderId)}?t=${orderToken(orderId)}`;
}
