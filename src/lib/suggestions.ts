import { ADD_ONS_BY_CATEGORY, ADD_ONS_BY_SLUG } from "@/data/addOns";
import type { CartCatalogue, CartProduct } from "@/data/cartCatalogue";
import { DELIVERY, findProduct, type ResolvedLine } from "./pricing";

export type AddOnSuggestion = {
  product: CartProduct;
  /** Adding one of these takes the priced subtotal to free delivery. */
  unlocksFreeDelivery: boolean;
};

/**
 * "Complete your kit" suggestions for the retail cart.
 *
 * Candidates come from the explicit pairings, then category pairings, then the
 * caller's fallback (popular products) — never something already in the cart
 * or a wholesale-only product. While the priced subtotal is under the free-
 * delivery threshold, priced products rank first (only they count toward it),
 * led by the cheapest one that closes the gap on its own.
 */
export function suggestAddOns(
  lines: readonly ResolvedLine[],
  catalogue: CartCatalogue,
  pricedSubtotal: number,
  fallbackSlugs: readonly string[] = [],
  limit = 4,
): AddOnSuggestion[] {
  const inCart = new Set(lines.map((l) => l.slug));
  const ordered: string[] = [];
  const push = (slug: string) => {
    if (!inCart.has(slug) && !ordered.includes(slug)) ordered.push(slug);
  };
  for (const l of lines) ADD_ONS_BY_SLUG[l.slug]?.forEach(push);
  for (const l of lines) ADD_ONS_BY_CATEGORY[l.product.category]?.forEach(push);
  fallbackSlugs.forEach(push);

  const candidates = ordered
    .map((slug) => findProduct(catalogue, slug))
    .filter((p): p is CartProduct => p !== undefined && p.audience !== "b2b");

  const gap = DELIVERY.freeThresholdQar - pricedSubtotal;
  const unlocks = (p: CartProduct) =>
    gap > 0 && p.priceQar !== undefined && p.priceQar >= gap;

  const ranked =
    gap > 0
      ? [
          ...candidates
            .filter(unlocks)
            .sort((a, b) => (a.priceQar ?? 0) - (b.priceQar ?? 0)),
          ...candidates.filter((p) => p.priceQar !== undefined && !unlocks(p)),
          ...candidates.filter((p) => p.priceQar === undefined),
        ]
      : candidates;

  return ranked
    .slice(0, limit)
    .map((product) => ({ product, unlocksFreeDelivery: unlocks(product) }));
}
