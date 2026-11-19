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
import {
  attributionEventParams,
  captureSessionAttribution,
  markAiVisitReported,
} from "@/lib/attribution";

type GtagArgs = IArguments | unknown[];
type WindowWithGtag = Window & {
  dataLayer?: GtagArgs[];
  gtag?: (...args: unknown[]) => void;
  plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
};

const TAG_SCRIPT_ID = "gtag-js";
let scriptScheduled = false;

function loadGtagScript(): void {
  if (typeof document === "undefined" || document.getElementById(TAG_SCRIPT_ID)) return;
  const primaryId = GA_MEASUREMENT_ID || ADS_CONVERSION_ID;
  if (!primaryId) return;
  const el = document.createElement("script");
  el.id = TAG_SCRIPT_ID;
  el.async = true;
  el.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(el);
}

/**
 * Google's canonical bootstrap, run synchronously before the click listener is
 * attached. Because `js` and `config` are queued here first, any later event is
 * guaranteed to sit behind them in `dataLayer` — and gtag.js processes that
 * queue strictly in order, dropping events that arrive before their target's
 * config. Ordering is therefore structural; no buffering is needed.
 *
 * Network download/execution of the ~240 KiB gtag.js container bundle is
 * deferred until after `window.load` (plus idle or first user interaction) so
 * initial mobile LCP and React hydration are not blocked for 1,000+ ms, while
 * `dataLayer` captures the initial `page_view`, `gclid`/`gbraid`/`wbraid`, and
 * any early CTA click synchronously from millisecond zero.
 */
function bootstrapGtag(): boolean {
  const w = window as WindowWithGtag;
  if (document.getElementById(TAG_SCRIPT_ID) || scriptScheduled) return true;
  scriptScheduled = true;

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

  // Google Tag Assistant expects immediate load when debugging.
  if (isDebug) {
    loadGtagScript();
    return true;
  }

  const triggerOnce = () => {
    window.removeEventListener("pointerdown", triggerOnce);
    window.removeEventListener("keydown", triggerOnce);
    window.removeEventListener("touchstart", triggerOnce);
    window.removeEventListener("scroll", triggerOnce);
    loadGtagScript();
  };

  window.addEventListener("pointerdown", triggerOnce, { once: true, passive: true });
  window.addEventListener("keydown", triggerOnce, { once: true, passive: true });
  window.addEventListener("touchstart", triggerOnce, { once: true, passive: true });
  window.addEventListener("scroll", triggerOnce, { once: true, passive: true });

  const scheduleIdle = () => {
    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === "function") {
      ric(triggerOnce, { timeout: 1800 });
    } else {
      window.setTimeout(triggerOnce, 1200);
    }
  };

  if (document.readyState === "complete") {
    scheduleIdle();
  } else {
    window.addEventListener("load", scheduleIdle, { once: true });
  }

  return true;
}

type TrackParams = Record<string, string | number>;

function track(key: ConversionKey, params: TrackParams) {
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag !== "function") return; // tag gated off; nothing to report to
  // Ensure gtag.js starts downloading immediately if a CTA is tapped before idle.
  loadGtagScript();

  const enriched: TrackParams = {
    ...attributionEventParams(),
    ...params,
  };

  // Always emit the named event, so the interaction is measurable even before
  // the conversion labels have been issued in the Google Ads UI.
  gtag("event", CONVERSION_EVENT_NAMES[key], enriched);

  const target = sendTo(key);
  if (target) {
    // A cart's order reference doubles as the Ads transaction_id, so a
    // shopper who taps "Send" twice for the same order is counted once.
    const orderRef = enriched.order_ref;
    gtag("event", "conversion", {
      send_to: target,
      ...enriched,
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
  let key = classify(href);
  if (!key) return;

  // A paid order's "send on WhatsApp" follows a purchase that trackPurchase
  // already reported: a GA4 event, never a second Ads conversion.
  if (anchor.dataset.placement === "order_paid") {
    (window as WindowWithGtag).gtag?.("event", "paid_order_whatsapp", {
      ...attributionEventParams(),
      page_path: window.location.pathname,
      ...orderParams(anchor),
    });
    return;
  }

  // The PPF booking hand-off IS the booking whenever the Sheet save failed, so
  // it reports as ppf_booking, not a generic WhatsApp click. Its order_ref is
  // the same booking ref trackPpfBooking sends as transaction_id, so a booking
  // that was saved AND sent still counts once.
  if (key === "whatsapp" && anchor.dataset.placement === "ppf_booking") {
    key = "ppf_booking";
  } else if (
    key === "whatsapp" &&
    (anchor.dataset.placement === "cart" || anchor.dataset.placement === "quote-tray")
  ) {
    key = "cart_order";
  } else if (key === "whatsapp" && anchor.dataset.placement === "dealer_enquiry") {
    key = "dealer_enquiry";
  }

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

if (typeof window !== "undefined") {
  // Always capture landing UTM / AI-referrer / organic-search session attribution
  // immediately on arrival so internal Next.js navigations never lose the entry source.
  const sessionAttr = captureSessionAttribution();

  if (isProductionHost(window.location.hostname)) {
    bootstrapGtag();
    if (sessionAttr.trafficChannel === "ai_referral" && !sessionAttr.aiVisitReported) {
      markAiVisitReported();
      const locale = window.location.pathname.split("/")[1];
      const aiProps: Record<string, string> = {
        ai_platform: sessionAttr.aiPlatform,
        landing_page: sessionAttr.landingPage.slice(0, 160),
        ...(sessionAttr.referrerHost ? { referrer_host: sessionAttr.referrerHost } : {}),
        ...(locale === "en" || locale === "ar" ? { locale } : {}),
      };
      (window as WindowWithGtag).gtag?.("event", "ai_referral_visit", aiProps);
      (window as WindowWithGtag).plausible?.("ai_referral_visit", { props: aiProps });
    }
    // Capture phase: the event is observed even if a handler further down stops
    // propagation. Passive: this listener never calls preventDefault.
    document.addEventListener("click", onClick, { capture: true, passive: true });
  }
}
