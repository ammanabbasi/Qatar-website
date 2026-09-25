"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CartProduct } from "@/data/cartCatalogue";
import { unitPriceLabel, type PriceLocale } from "@/lib/pricing";
import { AddToCartButton } from "./AddToCartButton";

/** Small product card for cart add-ons and the empty-cart "Popular" row. */
export function CartSuggestionCard({
  product,
  locale,
  badge,
  className = "",
}: {
  product: CartProduct;
  locale: PriceLocale;
  badge?: string;
  className?: string;
}) {
  const t = useTranslations("Cart");
  const name = product.name[locale];
  const href = `/b2c/products/${product.parentSlug ?? product.slug}`;

  return (
    <div className={`tile flex min-w-0 flex-col gap-2.5 p-3 ${className}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-square overflow-hidden rounded-xl bg-(--color-surface)"
      >
        <Image src={product.image} alt="" fill sizes="160px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={href}
          className="line-clamp-2 text-caption font-semibold leading-snug text-(--color-text) underline-offset-2 hover:underline"
        >
          {name}
        </Link>
        <p
          className={`text-caption ${
            product.priceQar !== undefined
              ? "font-semibold text-(--color-text)"
              : "font-medium text-(--color-text-muted)"
          }`}
        >
          {unitPriceLabel(product, locale) ?? t("priceOnRequest")}
        </p>
        {badge ? (
          <p className="w-fit rounded-md bg-(--color-brand)/15 px-1.5 py-0.5 text-[11px] font-semibold text-(--color-brand-deep)">
            {badge}
          </p>
        ) : null}
      </div>
      <AddToCartButton slug={product.slug} variant="compact" className="w-full" />
    </div>
  );
}
