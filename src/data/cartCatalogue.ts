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
export type CartVariantOption = {
  id: string;
  size: LocalizedText;
  priceQar: number;
  price: LocalizedText;
  originalPriceQar?: number;
  originalPrice?: LocalizedText;
  slug: string;
  badge?: LocalizedText;
};

export type CartProduct = {
  slug: string;
  parentSlug?: string;
  brand: BrandKey;
  category: CategoryKey;
  name: LocalizedText;
  priceQar?: number;
  originalPriceQar?: number;
  /** The catalogue's own price text — "From QAR 50" for multi-size products. */
  priceLabel?: LocalizedText;
  originalPriceLabel?: LocalizedText;
  image: string;
  audience: AudienceScope;
  variantSize?: LocalizedText;
  variants?: CartVariantOption[];
};

export type CartCatalogue = Record<string, CartProduct>;

let cached: CartCatalogue | null = null;

export function getCartCatalogue(): CartCatalogue {
  if (cached) return cached;
  const catalogue: CartCatalogue = {};
  for (const p of PRODUCTS) {
    const hasVariants = Boolean(p.variants && p.variants.length > 0);
    const defaultVariant = hasVariants ? p.variants![0] : undefined;
    const variantOptions: CartVariantOption[] | undefined = p.variants?.map((v) => ({
      id: v.id,
      size: v.size,
      priceQar: v.priceQar,
      price: v.price,
      originalPriceQar: v.originalPriceQar,
      originalPrice: v.originalPrice,
      slug: v.slug,
      badge: v.badge,
    }));

    catalogue[p.slug] = {
      slug: p.slug,
      brand: p.brand,
      category: p.category,
      name: p.name,
      ...(defaultVariant
        ? {
            priceQar: defaultVariant.priceQar,
            priceLabel: defaultVariant.price,
            originalPriceQar: defaultVariant.originalPriceQar,
            originalPriceLabel: defaultVariant.originalPrice,
          }
        : {
            ...(p.priceQar !== undefined ? { priceQar: p.priceQar } : {}),
            ...(p.price ? { priceLabel: p.price } : {}),
            ...(p.originalPriceQar !== undefined ? { originalPriceQar: p.originalPriceQar } : {}),
            ...(p.originalPrice ? { originalPriceLabel: p.originalPrice } : {}),
          }),
      image: p.images[0],
      audience: p.audience,
      ...(defaultVariant ? { variantSize: defaultVariant.size } : {}),
      variants: variantOptions,
    };

    if (p.variants) {
      for (const v of p.variants) {
        if (v.slug !== p.slug) {
          catalogue[v.slug] = {
            slug: v.slug,
            parentSlug: p.slug,
            brand: p.brand,
            category: p.category,
            name: p.name,
            priceQar: v.priceQar,
            priceLabel: v.price,
            originalPriceQar: v.originalPriceQar,
            originalPriceLabel: v.originalPrice,
            image: p.images[0],
            audience: p.audience,
            variantSize: v.size,
            variants: variantOptions,
          };
        }
      }
    }
  }
  cached = catalogue;
  return catalogue;
}
