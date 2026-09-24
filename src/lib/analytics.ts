import type { CartProduct } from "@/data/cartCatalogue";

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
