/**
 * Google Ads conversion configuration.
 *
 * The site had the AW-18200382552 tag installed but only ever called
 * gtag('config', …) — meaning zero conversions were ever reported. Every
 * campaign in marketing/google-ads/ uses a Smart Bidding strategy
 * ("Maximize conversions"), and Smart Bidding cannot function without
 * conversion signal, so these events are a hard prerequisite for the ads.
 *
 * There is no checkout on this site: prices are quoted per enquiry on WhatsApp.
 * So the "conversion" is a qualified enquiry — a WhatsApp click, a phone tap, an
 * email click, or a trade catalogue download.
 */

import { SITE } from "@/lib/constants";

export const ADS_CONVERSION_ID = "AW-18200382552";

/**
 * Localhost and Vercel preview deployments must never report into the live Ads
 * account. Preview traffic is developers and crawlers, and polluting conversion
 * data corrupts the Smart Bidding every campaign depends on.
 *
 * This mirrors the existing Plausible gate in layout.tsx, which is env-gated for
 * exactly this reason ("so localhost traffic doesn't pollute production stats").
 * The Ads tag was the one tracker without such a gate.
 *
 * Vercel exposes NEXT_PUBLIC_VERCEL_ENV as "production" | "preview" |
 * "development". When it is absent (self-hosted, or a Vercel change), the
 * fallback is NODE_ENV — deliberately preserving today's behaviour rather than
 * risking tracking silently switching off in production.
 */
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
export const ADS_TAG_ENABLED = vercelEnv
  ? vercelEnv === "production"
  : process.env.NODE_ENV === "production";

/**
 * Second, independent gate on the conversion events themselves — a hostname
 * check cannot be fooled by a mis-set environment variable.
 *
 * Set NEXT_PUBLIC_ADS_FORCE_TRACKING=1 to exercise tracking locally.
 */
export function isProductionHost(hostname: string): boolean {
  if (process.env.NEXT_PUBLIC_ADS_FORCE_TRACKING === "1") return true;
  return hostname === SITE.domain || hostname === `www.${SITE.domain}`;
}

export type ConversionKey = "whatsapp" | "phone" | "email" | "catalogue";

/**
 * Conversion LABELS are issued by Google Ads, one per conversion action
 * (Goals → Conversions → New conversion action → Website). Each looks like
 * `AbC-D_efGhIjKlMnOpQ`. Fill them in via the environment (Vercel → Settings →
 * Environment Variables), or paste them directly as the fallback string.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so a change needs a redeploy.
 *
 * Deliberate design: when a label is still empty the click STILL fires a named
 * `dataLayer` event, so no measurement is lost while the labels are being
 * created — only the Google Ads conversion itself is skipped. That keeps the
 * site shippable before the ads account is finished.
 */
export const CONVERSION_LABELS: Record<ConversionKey, string> = {
  whatsapp: process.env.NEXT_PUBLIC_ADS_LABEL_WHATSAPP ?? "",
  phone: process.env.NEXT_PUBLIC_ADS_LABEL_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_ADS_LABEL_EMAIL ?? "",
  catalogue: process.env.NEXT_PUBLIC_ADS_LABEL_CATALOGUE ?? "",
};

/** Event name reported to gtag/GA4 alongside the Ads conversion. */
export const CONVERSION_EVENT_NAMES: Record<ConversionKey, string> = {
  whatsapp: "whatsapp_enquiry",
  phone: "phone_enquiry",
  email: "email_enquiry",
  catalogue: "catalogue_download",
};

/** `send_to` value for gtag, or null when the label has not been issued yet. */
export function sendTo(key: ConversionKey): string | null {
  const label = CONVERSION_LABELS[key];
  return label ? `${ADS_CONVERSION_ID}/${label}` : null;
}
