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

/**
 * Funnel Stage 1 — Quote started (user opens the PPF quote sheet or selects a
 * vehicle / package). Tracked separately from confirmed bookings (`ppf_booking_request`).
 */
export function trackPpfQuoteStart(opts: {
  body: string;
  coverage: string;
  film: string;
  entryPoint?: string;
}) {
  if (typeof window === "undefined") return;
  const locale = window.location.pathname.split("/")[1] || "";
  const params = {
    body_type: opts.body,
    coverage: opts.coverage,
    film: opts.film,
    entry_point: opts.entryPoint ?? "hero_launcher",
    locale,
  };
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag === "function") {
    gtag("event", "ppf_quote_start", params);
  }
  (window as WindowWithPlausible).plausible?.("ppf_quote_start", {
    props: {
      body_type: opts.body,
      coverage: opts.coverage,
      film: opts.film,
      entry_point: opts.entryPoint ?? "hero_launcher",
    },
  });
}

/**
 * Funnel Stage 2 — Quote completed (user reaches Step 3 with a configured
 * vehicle, coverage, film, and calculated price). Tracked separately from
 * WhatsApp clicks and confirmed booking requests.
 */
export function trackPpfQuoteComplete(opts: {
  body: string;
  coverage: string;
  film: string;
  priceQar: number | null;
  isEstimate: boolean;
}) {
  if (typeof window === "undefined") return;
  const locale = window.location.pathname.split("/")[1] || "";
  const params = {
    body_type: opts.body,
    coverage: opts.coverage,
    film: opts.film,
    quote_type: opts.isEstimate ? "estimate" : "fixed",
    locale,
    ...(opts.priceQar !== null ? { value: opts.priceQar, currency: "QAR" } : {}),
  };
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag === "function") {
    gtag("event", "ppf_quote_complete", params);
  }
  (window as WindowWithPlausible).plausible?.("ppf_quote_complete", {
    props: {
      body_type: opts.body,
      coverage: opts.coverage,
      film: opts.film,
      price_qar: opts.priceQar !== null ? String(opts.priceQar) : "custom",
    },
  });
}

/**
 * Funnel Stage 3 — WhatsApp quote handoff clicked inside the PPF configurator
 * (fast quote handoff or post-booking WhatsApp send). Tracked as a distinct
 * funnel event (`ppf_whatsapp_handoff`) so we can separate quote handoff clicks
 * from saved booking requests (`ppf_booking_request`).
 */
export function trackPpfWhatsAppHandoff(opts: {
  body: string;
  coverage: string;
  film: string;
  priceQar: number | null;
  placement: string;
  ref?: string;
}) {
  if (typeof window === "undefined") return;
  const locale = window.location.pathname.split("/")[1] || "";
  const params = {
    body_type: opts.body,
    coverage: opts.coverage,
    film: opts.film,
    placement: opts.placement,
    ...(opts.ref ? { booking_ref: opts.ref } : {}),
    locale,
    ...(opts.priceQar !== null ? { value: opts.priceQar, currency: "QAR" } : {}),
  };
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag === "function") {
    gtag("event", "ppf_whatsapp_handoff", params);
  }
  (window as WindowWithPlausible).plausible?.("ppf_whatsapp_handoff", {
    props: {
      body_type: opts.body,
      coverage: opts.coverage,
      film: opts.film,
      placement: opts.placement,
    },
  });
}


/**
 * Wholesale dealer application submitted on /[locale]/b2b/dealer-application.
 * Reports `dealer_enquiry` to GA4, the primary Google Ads conversion action
 * (`ABK — Wholesale Dealer Application`), and Plausible.
 */
export function trackDealerEnquiry(opts: {
  companyName: string;
  businessType: string;
  location: string;
  estimatedVolume: string;
  priorityBrands: string[];
  locale: string;
}) {
  if (typeof window === "undefined") return;
  const params = {
    company_name: opts.companyName.slice(0, 100),
    business_type: opts.businessType,
    location: opts.location.slice(0, 80),
    estimated_volume: opts.estimatedVolume,
    brands: opts.priorityBrands.join(", ").slice(0, 120),
    audience: "b2b",
    locale: opts.locale,
    value: 200,
    currency: "QAR",
  };
  const gtag = (window as WindowWithGtag).gtag;
  if (typeof gtag === "function") {
    gtag("event", CONVERSION_EVENT_NAMES.dealer_enquiry, params);
    const target = sendTo("dealer_enquiry");
    if (target) {
      gtag("event", "conversion", {
        send_to: target,
        ...params,
      });
    }
  }
  (window as WindowWithPlausible).plausible?.("dealer_enquiry", {
    props: {
      business_type: opts.businessType,
      estimated_volume: opts.estimatedVolume,
      locale: opts.locale,
    },
  });
}

