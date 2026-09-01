/**
 * Client instrumentation — Google Ads conversion tracking.
 *
 * Next 16 runs this file before any of the app's frontend code. Per
 * node_modules/next/dist/docs/01-app/02-guides/analytics.md: "Next.js provides a
 * `instrumentation-client.js|ts` file that runs before your application's
 * frontend code starts executing. This is ideal for setting up global
 * analytics." With a `src/` directory Next resolves `src/instrumentation-client`
 * first (see next/dist/build/create-compiler-aliases.js).
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

/**
 * Ensure a gtag queue exists before gtag.js has executed.
 *
 * The layout loads gtag.js with strategy="afterInteractive", but the floating
 * WhatsApp bubble is visible and clickable before that resolves. Defining the
 * standard shim here means an early click is queued on `dataLayer` and replayed
 * once gtag.js loads, instead of being dropped. The layout's own snippet uses
 * `window.dataLayer = window.dataLayer || []`, so it adopts this queue rather
 * than clearing it.
 */
function ensureGtag(w: WindowWithGtag) {
  if (typeof w.gtag === "function") return w.gtag;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself, which is why this is a
    // function expression and not a rest-parameter arrow.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  return w.gtag;
}

function track(key: ConversionKey, params: Record<string, string>) {
  const w = window as WindowWithGtag;
  const gtag = ensureGtag(w);

  // Always emit the named event, so the interaction is measurable even before
  // the conversion labels have been issued in the Google Ads UI.
  gtag("event", CONVERSION_EVENT_NAMES[key], params);

  const target = sendTo(key);
  if (target) gtag("event", "conversion", { send_to: target, ...params });
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

if (typeof window !== "undefined" && isProductionHost(window.location.hostname)) {
  document.addEventListener(
    "click",
    (event) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      // Read the literal attribute: anchor.href would resolve tel:/mailto:
      // inconsistently across browsers.
      const href = anchor.getAttribute("href") || "";
      const key = classify(href);
      if (!key) return;

      const params: Record<string, string> = {
        link_url: href.slice(0, 500),
        page_path: window.location.pathname,
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
    },
    // Capture phase: the event is observed even if a handler further down stops
    // propagation. Passive: this listener never calls preventDefault.
    { capture: true, passive: true },
  );
}
