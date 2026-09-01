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
 * Buffer events until gtag.js has bootstrapped, then replay them in order.
 *
 * This file runs before the app's frontend code, but the layout loads gtag.js
 * with strategy="afterInteractive" — and the floating WhatsApp bubble is
 * server-rendered, so it is visible and clickable during that gap.
 *
 * An earlier version defined its own `dataLayer` shim so early clicks were
 * queued. That was subtly wrong: gtag.js processes `dataLayer` strictly in
 * order, so an `event` pushed ahead of the `config` command for its target is
 * processed when no config exists for that ID and is dropped. Buffering locally
 * and flushing only once `window.gtag` is real guarantees every conversion
 * lands after `config`, which is the only ordering gtag accepts.
 */
const pending: unknown[][] = [];
let flushTimer: ReturnType<typeof setInterval> | undefined;

function flush(): boolean {
  const w = window as WindowWithGtag;
  if (typeof w.gtag !== "function") return false;
  while (pending.length) w.gtag(...pending.shift()!);
  if (flushTimer) { clearInterval(flushTimer); flushTimer = undefined; }
  return true;
}

function send(...args: unknown[]) {
  pending.push(args);
  if (flush() || flushTimer) return;
  // gtag.js is still loading. Poll briefly, then give up rather than leak a
  // timer — if the tag never arrives, the events were never going anywhere.
  let tries = 0;
  flushTimer = setInterval(() => {
    if (flush() || ++tries > 40) {
      clearInterval(flushTimer);
      flushTimer = undefined;
    }
  }, 250);
}

function track(key: ConversionKey, params: Record<string, string>) {
  // Always emit the named event, so the interaction is measurable even before
  // the conversion labels have been issued in the Google Ads UI.
  send("event", CONVERSION_EVENT_NAMES[key], params);

  const target = sendTo(key);
  if (target) send("event", "conversion", { send_to: target, ...params });
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
