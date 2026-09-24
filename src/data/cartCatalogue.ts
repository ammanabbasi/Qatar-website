import {
  PRODUCTS,
  type AudienceScope,
  type BrandKey,
  type CategoryKey,
  type LocalizedText,
} from "./products";

/**
 * The slice of a product the cart needs to draw a line, price it and report it.
 *
 * The cart mounts on every page, but `products.ts` is ~155 KB (long bilingual
 * descriptions and specs). Importing it into a client component would ship all
 * of that on every route, so the Shell (a Server Component) builds this slim
 * projection and hands it to the CartProvider instead. Client code must only
 * `import type` from this module.
 */
export type CartProduct = {
  slug: string;
  brand: BrandKey;
  category: CategoryKey;
  name: LocalizedText;
  priceQar?: number;
  /** The catalogue's own price text — "From QAR 50" for multi-size products. */
  priceLabel?: LocalizedText;
  image: string;
  audience: AudienceScope;
};

export type CartCatalogue = Record<string, CartProduct>;

let cached: CartCatalogue | null = null;

export function getCartCatalogue(): CartCatalogue {
  if (cached) return cached;
  const catalogue: CartCatalogue = {};
  for (const p of PRODUCTS) {
    catalogue[p.slug] = {
      slug: p.slug,
      brand: p.brand,
      category: p.category,
      name: p.name,
      ...(p.priceQar !== undefined ? { priceQar: p.priceQar } : {}),
      ...(p.price ? { priceLabel: p.price } : {}),
      image: p.images[0],
      audience: p.audience,
    };
  }
  cached = catalogue;
  return catalogue;
}
