"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  PRODUCTS,
  BRANDS,
  CATEGORIES,
  getBrandsFor,
  getCategoriesFor,
  type BrandKey,
  type CategoryKey,
} from "@/data/products";
import { ProductGridView } from "./ProductGridView";
import type { Audience } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: "en" | "ar";
};

function asBrand(v: string | null): BrandKey | "all" {
  return v && (BRANDS as string[]).includes(v) ? (v as BrandKey) : "all";
}
function asCategory(v: string | null): CategoryKey | "all" {
  return v && (CATEGORIES as string[]).includes(v) ? (v as CategoryKey) : "all";
}

/**
 * Interactive catalogue. The URL is the single source of truth for the
 * filters (`?brand=Vertek&category=ppf`) so category links from the home
 * page and footer deep-link straight into a filtered grid, and chip clicks
 * update the address bar via `history.replaceState` — which Next.js folds
 * into `useSearchParams` without a server round-trip.
 */
export function ProductGrid({ audience, locale }: Props) {
  const params = useSearchParams();
  const brand = asBrand(params.get("brand"));
  const category = asCategory(params.get("category"));

  const brands = useMemo(() => getBrandsFor(audience), [audience]);
  const categories = useMemo(() => getCategoriesFor(audience), [audience]);

  const products = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        // Audience scope — products tagged b2c-only or b2b-only must not leak
        // into the other audience's listing. `both` shows everywhere. The
        // sitemap + ItemList JSON-LD apply the same rule, so UI and crawler
        // surfaces stay consistent.
        if (p.audience !== "both" && p.audience !== audience) return false;
        if (brand !== "all" && p.brand !== brand) return false;
        if (category !== "all" && p.category !== category) return false;
        return true;
      }),
    [audience, brand, category],
  );

  const setParam = (key: "brand" | "category", value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}`,
    );
  };

  return (
    <ProductGridView
      audience={audience}
      locale={locale}
      products={products}
      brands={brands}
      categories={categories}
      filters={{ brand, category }}
      onBrand={(b) => setParam("brand", b)}
      onCategory={(c) => setParam("category", c)}
      onClear={() =>
        window.history.replaceState(null, "", window.location.pathname)
      }
    />
  );
}
