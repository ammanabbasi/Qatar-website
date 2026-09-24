"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon, PlusIcon } from "@/components/ui/Icons";
import { useCartUi } from "./CartProvider";

type Variant = "card" | "compact" | "primary";

const SHAPE: Record<Variant, string> = {
  card: "h-11 w-full px-4 text-footnote",
  compact: "h-10 px-4 text-footnote",
  primary: "h-11 px-[22px] text-body",
};

// The grid uses the neutral fill: 53 amber buttons in one catalogue would
// drown the page. Amber is kept for single, primary placements.
const IDLE: Record<Variant, string> = {
  card: "bg-(--color-fill) text-(--color-text) hover:bg-(--color-fill-hover) active:bg-(--color-border)",
  compact:
    "bg-(--color-fill) text-(--color-text) hover:bg-(--color-fill-hover) active:bg-(--color-border)",
  primary:
    "bg-(--color-brand) text-(--color-ink) hover:bg-(--color-brand-hover) active:bg-(--color-brand-deep) active:text-white",
};

const ADDED = "bg-(--color-brand)/15 text-(--color-brand-deep)";

/**
 * Quick "Add to cart" for retail cards and shelves — a small client island so
 * the card around it stays server-rendered. Adding shows the site-wide toast;
 * the button itself flips to "Added ✓" for a moment.
 */
export function AddToCartButton({
  slug,
  qty = 1,
  variant = "card",
  className = "",
}: {
  slug: string;
  qty?: number;
  variant?: Variant;
  className?: string;
}) {
  const t = useTranslations("Cart");
  const { catalogue, locale, add } = useCartUi();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(id);
  }, [added]);

  const product = catalogue[slug];
  if (!product) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (add(slug, qty)) setAdded(true);
      }}
      // `relative` anchors the sr-only name below. Without it the absolutely
      // positioned span escapes horizontal scroll rows (cart add-ons, popular
      // items) and stretches the page on phones.
      className={`relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-pill font-semibold transition-colors duration-150 ease-soft ${SHAPE[variant]} ${
        added && variant !== "primary" ? ADDED : IDLE[variant]
      } ${className}`}
    >
      {added ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      <span>{added ? t("addedShort") : t("addToCart")}</span>
      {/* Visible label first, product second — keeps "label in name" intact
          for voice control while telling screen readers which card this is. */}
      <span className="sr-only"> — {product.name[locale]}</span>
    </button>
  );
}
