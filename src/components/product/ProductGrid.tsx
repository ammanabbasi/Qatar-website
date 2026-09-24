"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BRANDS,
  CATEGORIES,
  getBrandsFor,
  getCategoriesFor,
  getProductsFor,
  type BrandKey,
  type CategoryKey,
  type Product,
} from "@/data/products";
import { buildSearchDoc, queryTokens, scoreDoc } from "@/lib/search";
import { ProductGridView, SORT_KEYS, type SortKey } from "./ProductGridView";
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
function asSort(v: string | null): SortKey {
  return v && (SORT_KEYS as readonly string[]).includes(v) ? (v as SortKey) : "recommended";
}

/** Writes URL params without a navigation; `null` removes a param. */
function updateUrl(patch: Record<string, string | null>) {
  const next = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
  }
  const qs = next.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  if (url !== `${window.location.pathname}${window.location.search}`) {
    window.history.replaceState(null, "", url);
  }
}

/** Price sort keeps price-on-request products last, in their catalogue order. */
function byPrice(products: Product[], direction: 1 | -1): Product[] {
  const priced = products.filter((p) => p.priceQar !== undefined);
  const unpriced = products.filter((p) => p.priceQar === undefined);
  priced.sort((a, b) => direction * ((a.priceQar ?? 0) - (b.priceQar ?? 0)));
  return [...priced, ...unpriced];
}

/**
 * Interactive catalogue. The URL is the single source of truth for the
 * filters (`?brand=Vertek&category=ppf`, and on retail `&q=wax&sort=price-asc
 * &priced=1`) so category links from the home page and footer deep-link
 * straight into a filtered grid, and chip clicks update the address bar via
 * `history.replaceState` — which Next.js folds into `useSearchParams` without
 * a server round-trip.
 *
 * The search box is the one exception: it filters from local state on every
 * keystroke and writes `?q=` to the URL a moment later.
 */
export function ProductGrid({ audience, locale }: Props) {
  const t = useTranslations();
  const params = useSearchParams();
  const retail = audience === "b2c";
  const brand = asBrand(params.get("brand"));
  const category = asCategory(params.get("category"));
  const sort = retail ? asSort(params.get("sort")) : "recommended";
  const pricedOnly = retail && params.get("priced") === "1";
  const [query, setQuery] = useState(() => (retail ? (params.get("q") ?? "") : ""));

  useEffect(() => {
    if (!retail) return;
    const id = window.setTimeout(() => updateUrl({ q: query.trim() || null }), 300);
    return () => window.clearTimeout(id);
  }, [query, retail]);

  const brands = useMemo(() => getBrandsFor(audience), [audience]);
  const categories = useMemo(() => getCategoriesFor(audience), [audience]);
  const baseProducts = useMemo(() => getProductsFor(audience), [audience]);

  // Both languages are indexed, so an English brand name typed on the Arabic
  // page (or an Arabic word on the English page) still finds the product.
  const searchDocs = useMemo(
    () =>
      new Map(
        baseProducts.map((p) => [
          p.slug,
          buildSearchDoc({
            names: [p.name.en, p.name.ar],
            meta: [
              p.brand,
              t(`Brands.${p.brand}`),
              p.category,
              t(`Categories.${p.category}`),
              p.slug.replace(/-/g, " "),
            ],
            body: [p.shortDesc.en, p.shortDesc.ar],
          }),
        ]),
      ),
    [baseProducts, t],
  );

  const products = useMemo(() => {
    let list = baseProducts.filter((p) => {
      if (brand !== "all" && p.brand !== brand) return false;
      if (category !== "all" && p.category !== category) return false;
      if (pricedOnly && p.priceQar === undefined) return false;
      return true;
    });

    const tokens = queryTokens(query);
    if (tokens.length > 0) {
      const scored = list
        .map((p) => ({ p, score: scoreDoc(searchDocs.get(p.slug)!, tokens) }))
        .filter((s) => s.score > 0);
      // Most relevant first when no explicit sort is chosen (stable sort keeps
      // catalogue order among equal scores).
      if (sort === "recommended") scored.sort((a, b) => b.score - a.score);
      list = scored.map((s) => s.p);
    }

    if (sort === "price-asc") return byPrice(list, 1);
    if (sort === "price-desc") return byPrice(list, -1);
    return list;
  }, [baseProducts, brand, category, pricedOnly, query, searchDocs, sort]);

  return (
    <ProductGridView
      audience={audience}
      locale={locale}
      products={products}
      brands={brands}
      categories={categories}
      filters={{ brand, category }}
      onBrand={(b) => updateUrl({ brand: b === "all" ? null : b })}
      onCategory={(c) => updateUrl({ category: c === "all" ? null : c })}
      onClear={() => {
        setQuery("");
        updateUrl({ brand: null, category: null, q: null, priced: null });
      }}
      retailTools={
        retail
          ? {
              query,
              sort,
              pricedOnly,
              onQuery: setQuery,
              onSort: (s) => updateUrl({ sort: s === "recommended" ? null : s }),
              onPricedOnly: (v) => updateUrl({ priced: v ? "1" : null }),
            }
          : undefined
      }
    />
  );
}
