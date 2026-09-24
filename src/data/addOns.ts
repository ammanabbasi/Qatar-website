import type { CategoryKey } from "./products";

/**
 * Cart add-on suggestions ("Complete your kit").
 *
 * ⚑ OWNER REVIEW: these pairings were proposed from the catalogue on
 * 2026-09-24 — adjust them to what customers actually buy together. Every slug
 * must exist in `products.ts`; the cart page checks this at build time and
 * fails the build on a typo.
 *
 * Lookup order: explicit product pairings first, then the category fallback.
 * Only the 12 priced products count toward the QAR 200 free-delivery
 * threshold, so the cart ranks priced suggestions that close the gap first.
 */

/** Product → the products that go with it, best first. */
export const ADD_ONS_BY_SLUG: Readonly<Record<string, readonly string[]>> = {
  "insta-finish-wash-and-wax": [
    "insta-finish-spray-wax",
    "getsun-tire-shine",
    "premium-microfiber-towel-60x40",
    "car-washing-sponge-large",
  ],
  "insta-finish-spray-wax": [
    "insta-finish-wash-and-wax",
    "edgeless-microfiber-towel",
    "insta-finish-premium-dress-all",
  ],
  "insta-finish-premium-blue-guard": [
    "edgeless-microfiber-towel",
    "getsun-multi-purpose-foam-cleaner",
    "abk-rejuvenate-plastic-restorer",
  ],
  "insta-finish-premium-dress-all": [
    "edgeless-microfiber-towel",
    "getsun-multi-purpose-foam-cleaner",
    "abk-rejuvenate-plastic-restorer",
  ],
  "abk-rejuvenate-plastic-restorer": [
    "getsun-multi-purpose-foam-cleaner",
    "insta-finish-premium-dress-all",
    "edgeless-microfiber-towel",
  ],
  "getsun-multi-purpose-foam-cleaner": [
    "abk-rejuvenate-plastic-restorer",
    "insta-finish-premium-blue-guard",
    "premium-microfiber-towel-60x40",
  ],
  "getsun-tire-shine": ["tire-polish-sponge", "smart-car-tyre-foam", "insta-finish-wash-and-wax"],
  "smart-car-tyre-foam": ["tire-polish-sponge", "getsun-tire-shine", "insta-finish-wash-and-wax"],
  "getsun-foam-out-engine-degreaser": [
    "premium-microfiber-towel-60x40",
    "getsun-multi-purpose-foam-cleaner",
  ],
  "detainer-sticker-remover": ["edgeless-microfiber-towel", "insta-finish-spray-wax"],
  "abk-mashmom-home-fragrance": ["abk-secret-home-fragrance"],
  "abk-secret-home-fragrance": ["abk-mashmom-home-fragrance"],
};

/** Category fallback when a product has no explicit pairing. */
export const ADD_ONS_BY_CATEGORY: Readonly<Partial<Record<CategoryKey, readonly string[]>>> = {
  shampoo: ["insta-finish-spray-wax", "getsun-tire-shine", "car-washing-sponge-large"],
  wax: ["edgeless-microfiber-towel", "insta-finish-wash-and-wax"],
  polish: [
    "grunes-auto-pad-step1-da-6in",
    "grunes-auto-pad-step2-da-6in",
    "grunes-auto-pad-step3-da-6in",
    "edgeless-microfiber-towel",
  ],
  ceramic: ["edgeless-microfiber-towel", "insta-finish-wash-and-wax"],
  tyre: ["tire-polish-sponge", "getsun-tire-shine"],
  interior: ["abk-rejuvenate-plastic-restorer", "premium-microfiber-towel-60x40"],
  glass: ["premium-microfiber-towel-60x40", "edgeless-microfiber-towel"],
  dressing: ["edgeless-microfiber-towel", "getsun-multi-purpose-foam-cleaner"],
  degreaser: ["premium-microfiber-towel-60x40", "getsun-foam-out-engine-degreaser"],
  ppf: ["autotriz-ppf-refresh-1l", "edgeless-microfiber-towel"],
  tint: ["detainer-sticker-remover", "premium-microfiber-towel-60x40"],
  fragrance: ["abk-secret-home-fragrance", "abk-mashmom-home-fragrance"],
  accessories: ["insta-finish-wash-and-wax", "insta-finish-spray-wax"],
  "heavy-duty": ["edgeless-microfiber-towel", "insta-finish-spray-wax"],
};

/** Every slug the add-on config references — used by the build-time check. */
export function allAddOnSlugs(): string[] {
  const all = new Set<string>();
  for (const [slug, list] of Object.entries(ADD_ONS_BY_SLUG)) {
    all.add(slug);
    list.forEach((s) => all.add(s));
  }
  for (const list of Object.values(ADD_ONS_BY_CATEGORY)) list?.forEach((s) => all.add(s));
  return [...all];
}
