import type { CartProduct } from "@/data/cartCatalogue";
import { CONVERSION_EVENT_NAMES, sendTo } from "@/lib/ads-conversions";

/**
 * GA4 ecommerce events for the retail cart.
 *
 * `gtag` only exists on the production host (see src/instrumentation-client.ts),
 * so on localhost and preview deployments every call here is a no-op — the
 * same gate that keeps test traffic out of Smart Bidding.
 *
 * The WhatsApp hand-off itself is NOT reported from here: the send button is a
 * real wa.me anchor and the delegated click listener in instrumentation-client
 * reports it as `whatsapp_enquiry` (+ the Ads conversion), reading the order
 * value from the anchor's data-* attributes.
 */

export type CartEventName =
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout";

export type GaItem = {
  item_id: string;
  /** English name, so reports don't split one product across two locales. */
  item_name: string;
  item_brand: string;
  item_category: string;
  price?: number;
  quantity: number;
};

type WindowWithGtag = Window & { gtag?: (...args: unknown[]) => void };

export function gaItem(product: CartProduct, quantity: number): GaItem {
  return {
    item_id: product.slug,
    item_name: product.name.en,
    item_brand: product.brand,
    item_category: product.category,
    ...(product.priceQar !== undefined ? { price: product.priceQar } : {}),
    quantity,
  };
}

export function trackCartEvent(name: CartEventName, items: GaItem[]) {
  if (typeof window === "undefined" || items.length === 0) return;
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag !== "function") return;
  const value = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
  gtag("event", name, { currency: "QAR", value, items });
}

type WindowWithPlausible = Window & {
  plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
};

/**
 * Installed-PPF booking saved — reported once the server confirms the save,
 * not on click, because the saved record IS the lead (the customer may never
 * press send in WhatsApp). The booking reference doubles as the Ads
 * transaction_id, so a retry of the same booking is counted once.
 *
 * Same production-host gate as everything else here: `gtag` only exists on
 * the real domain.
 */
export function trackPpfBooking(opts: {
  ref: string;
  priceQar: number | null;
  coverage: string;
  film: string;
  body: string;
}) {
  if (typeof window === "undefined") return;
  const params = {
    booking_ref: opts.ref,
    coverage: opts.coverage,
    film: opts.film,
    body_type: opts.body,
    locale: window.location.pathname.split("/")[1] || "",
    ...(opts.priceQar !== null ? { value: opts.priceQar, currency: "QAR" } : {}),
  };
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag === "function") {
    gtag("event", CONVERSION_EVENT_NAMES.ppf_booking, params);
    const target = sendTo("ppf_booking");
    if (target) gtag("event", "conversion", { send_to: target, ...params, transaction_id: opts.ref });
  }
  (window as WindowWithPlausible).plausible?.("ppf_booking_request", {
    props: { coverage: opts.coverage, film: opts.film, body_type: opts.body },
  });
}
