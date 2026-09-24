/**
 * Client instrumentation — Google Ads tag + conversion tracking.
 *
 * Next 16 runs this file before any of the app's frontend code. Per
 * node_modules/next/dist/docs/01-app/02-guides/analytics.md: "Next.js provides a
 * `instrumentation-client.js|ts` file that runs before your application's
 * frontend code starts executing. This is ideal for setting up global
 * analytics." With a `src/` directory Next resolves `src/instrumentation-client`
 * first (see next/dist/build/create-compiler-aliases.js).
 *
 * WHY THE TAG LOADS HERE RATHER THAN FROM THE LAYOUT:
 * the tag must not report from preview deployments or localhost — that data
 * drives Smart Bidding on live campaigns. Gating it in the layout meant reading
 * NEXT_PUBLIC_VERCEL_ENV, which only exists when "Enable access to System
 * Environment Variables" is on, and whose effect could not be verified from
 * outside a preview deploy. `window.location.hostname` is always present and
 * always correct, needs no Vercel setting, and makes the gate testable locally.
 * One file now owns every Google Ads decision.
 *
 * WHY A DELEGATED LISTENER RATHER THAN onClick HANDLERS:
 * every CTA in this repo is a Server Component — WhatsAppButton, FloatingWhatsApp,
 * ButtonLink, Footer and Shell all render on the server with no "use client".
 * Attaching onClick would mean converting each of them to a Client Component,
 * shipping their JS to the browser and losing the server-rendering benefit, for
 * the sake of an analytics ping. One capture-phase listener on `document`
 * instruments every current and future CTA with zero changes to any component.
 *
 * This never calls preventDefault and never blocks navigation.
 */

import {
  ADS_CONVERSION_ID,
  GA_MEASUREMENT_ID,
  GA_MEASUREMENT_IDS,
  CONVERSION_EVENT_NAMES,
  isProductionHost,
  sendTo,
  type ConversionKey,
} from "@/lib/ads-conversions";

type GtagArgs = IArguments | unknown[];
type WindowWithGtag = Window & {
  dataLayer?: GtagArgs[];
  gtag?: (...args: unknown[]) => void;
};

const TAG_SCRIPT_ID = "gtag-js";

/**
 * Google's canonical bootstrap, run synchronously before the click listener is
 * attached. Because `js` and `config` are queued here first, any later event is
 * guaranteed to sit behind them in `dataLayer` — and gtag.js processes that
 * queue strictly in order, dropping events that arrive before their target's
 * config. Ordering is therefore structural; no buffering is needed.
 */
function bootstrapGtag(): boolean {
  const w = window as WindowWithGtag;
  if (document.getElementById(TAG_SCRIPT_ID)) return true;

  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself, which is why this is a
    // function expression and not a rest-parameter arrow.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());

  const isDebug =
    typeof window !== "undefined" &&
    Boolean(
      window.location.search &&
        (window.location.search.includes("gtm_debug") ||
          window.location.search.includes("debug_mode"))
    );

  for (const gaId of GA_MEASUREMENT_IDS) {
    w.gtag("config", gaId, {
      send_page_view: true,
      ...(isDebug ? { debug_mode: true } : {}),
    });
  }

  if (ADS_CONVERSION_ID) {
    w.gtag("config", ADS_CONVERSION_ID);
  }

  const el = document.createElement("script");
  el.id = TAG_SCRIPT_ID;
  el.async = true;
  const primaryId = GA_MEASUREMENT_ID || ADS_CONVERSION_ID;
  el.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(el);
  return true;
}

type TrackParams = Record<string, string | number>;

function track(key: ConversionKey, params: TrackParams) {
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag !== "function") return; // tag gated off; nothing to report to

  // Always emit the named event, so the interaction is measurable even before
  // the conversion labels have been issued in the Google Ads UI.
  gtag("event", CONVERSION_EVENT_NAMES[key], params);

  const target = sendTo(key);
  if (target) {
    // A cart's order reference doubles as the Ads transaction_id, so a
    // shopper who taps "Send" twice for the same order is counted once.
    const orderRef = params.order_ref;
    gtag("event", "conversion", {
      send_to: target,
      ...params,
      ...(typeof orderRef === "string" ? { transaction_id: orderRef } : {}),
    });
  }
}

/**
 * Cart hand-offs describe the order on data-* attributes: the priced subtotal
 * as the conversion value (so Ads can learn basket size), the unit count, the
 * order reference and where the send happened (cart page vs quote tray).
 */
function orderParams(anchor: HTMLAnchorElement): TrackParams {
  const d = anchor.dataset;
  const out: TrackParams = {};
  const value = Number(d.conversionValue);
  if (d.conversionValue && Number.isFinite(value)) {
    out.value = value;
    out.currency = d.conversionCurrency || "QAR";
  }
  const items = Number(d.itemCount);
  if (d.itemCount && Number.isFinite(items)) out.item_count = items;
  if (d.orderRef) out.order_ref = d.orderRef;
  if (d.placement) out.placement = d.placement;
  return out;
}

/**
 * The existing Plausible integration tags goals via CLASS NAMES
 * (`plausible-event-audience=b2b`). Reusing those classes keeps a single source
 * of truth for the audience/product dimensions across both analytics tools.
 */
function plausibleProp(el: Element, prop: string): string | undefined {
  for (const cls of el.classList) {
    const prefix = `plausible-event-${prop}=`;
    if (cls.startsWith(prefix)) return cls.slice(prefix.length).replace(/\+/g, " ");
  }
  return undefined;
}

function classify(href: string): ConversionKey | null {
  if (href.startsWith("https://wa.me/") || href.startsWith("https://api.whatsapp.com/")) return "whatsapp";
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (href.includes("/catalogues/") && href.endsWith(".pdf")) return "catalogue";
  return null;
}

function onClick(event: MouseEvent) {
  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!anchor) return;

  // Read the literal attribute: anchor.href would resolve tel:/mailto:
  // inconsistently across browsers.
  const href = anchor.getAttribute("href") || "";
  const key = classify(href);
  if (!key) return;

  const params: TrackParams = {
    link_url: href.slice(0, 500),
    page_path: window.location.pathname,
    ...orderParams(anchor),
  };

  const audience = plausibleProp(anchor, "audience");
  if (audience) params.audience = audience;
  const product = plausibleProp(anchor, "product");
  if (product) params.product = product;

  // /en/… or /ar/… — worth splitting, since the two locales get separate
  // campaigns and need separately readable conversion counts.
  const locale = window.location.pathname.split("/")[1];
  if (locale === "en" || locale === "ar") params.locale = locale;

  // The floating bubble converts very differently from an in-page CTA on a
  // product detail page; keep them distinguishable in reporting.
  if (anchor.classList.contains("plausible-event-name=whatsapp_floating_click")) {
    params.placement = "floating";
  }

  track(key, params);
}

if (typeof window !== "undefined" && isProductionHost(window.location.hostname)) {
  bootstrapGtag();
  // Capture phase: the event is observed even if a handler further down stops
  // propagation. Passive: this listener never calls preventDefault.
  document.addEventListener("click", onClick, { capture: true, passive: true });
}
