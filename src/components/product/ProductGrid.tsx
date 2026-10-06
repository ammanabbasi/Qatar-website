"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BRANDS,
  CATEGORIES,
  CATEGORY_USES,
  LEGACY_CATEGORY_ALIASES,
  PACKS,
  SEARCH_ALIASES,
  getCategoriesFor,
  getProductsFor,
  isTradePack,
  type BrandKey,
  type CategoryKey,
  type PackKey,
  type Product,
  type UseKey,
} from "@/data/products";
import { buildSearchDoc, queryTokens, scoreDoc } from "@/lib/search";
import {
  ProductGridView,
  SORT_KEYS,
  type FacetOption,
  type GridFilters,
  type SortKey,
} from "./ProductGridView";
import type { Audience } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: "en" | "ar";
};

function asBrand(v: string | null): BrandKey | "all" {
  return v && (BRANDS as string[]).includes(v) ? (v as BrandKey) : "all";
}
function asPack(v: string | null): PackKey | "all" {
  return v && (PACKS as string[]).includes(v) ? (v as PackKey) : "all";
}
function asSort(v: string | null): SortKey {
  return v && (SORT_KEYS as readonly string[]).includes(v) ? (v as SortKey) : "recommended";
}

/**
 * `?category=` and `?use=` -> the filters to apply. A current category key
 * always wins (so `polish` is the whole Polishing category, not just the old
 * compounds list); any other key is looked up in LEGACY_CATEGORY_ALIASES, which
 * carries old ads, bookmarks and shared links to their category (+ use). A
 * valid `use` beats an alias's use and, with no category, names its own.
 */
function resolveCategoryUse(
  rawCategory: string | null,
  rawUse: string | null,
): Pick<GridFilters, "category" | "use"> {
  let category: CategoryKey | "all" = "all";
  let aliasUse: UseKey | undefined;
  if (rawCategory && (CATEGORIES as string[]).includes(rawCategory)) {
    category = rawCategory as CategoryKey;
  } else if (rawCategory && Object.hasOwn(LEGACY_CATEGORY_ALIASES, rawCategory)) {
    const alias = LEGACY_CATEGORY_ALIASES[rawCategory];
    category = alias.category;
    aliasUse = alias.use;
  }

  const owner = rawUse
    ? CATEGORIES.find((c) => (CATEGORY_USES[c] as readonly string[]).includes(rawUse))
    : undefined;
  if (rawUse && owner && (category === "all" || category === owner)) {
    return { category: owner, use: rawUse as UseKey };
  }
  return { category, use: aliasUse ?? "all" };
}

type ActiveFilters = GridFilters & { pricedOnly: boolean };
type FacetKey = "category" | "use" | "brand" | "pack";

function packOf(p: Product): PackKey {
  return isTradePack(p) ? "trade" : "retail";
}

/**
 * Whether `p` passes every active filter except the `skip` facet's own. Picking
 * a category resets the use, so the category facet ignores `use` as well.
 */
function passes(p: Product, f: ActiveFilters, skip?: FacetKey): boolean {
  if (skip !== "category" && f.category !== "all" && p.category !== f.category) return false;
  if (skip !== "category" && skip !== "use" && f.use !== "all" && p.use !== f.use) return false;
  if (skip !== "brand" && f.brand !== "all" && p.brand !== f.brand) return false;
  if (skip !== "pack" && f.pack !== "all" && packOf(p) !== f.pack) return false;
  if (f.pricedOnly && p.priceQar === undefined) return false;
  return true;
}

/**
 * One chip per key with the number of `pool` products it would show under
 * every other active filter; zero-count chips come back disabled, except the
 * selected one.
 */
function facetOptions<K extends string>(
  pool: Product[],
  filters: ActiveFilters,
  facet: FacetKey,
  keys: readonly K[],
  selected: K | "all",
  keyOf: (p: Product) => K | undefined,
): Required<FacetOption<K>>[] {
  const counts = new Map<K, number>();
  for (const p of pool) {
    const key = keyOf(p);
    if (key === undefined || !passes(p, filters, facet)) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return keys.map((key) => {
    const count = counts.get(key) ?? 0;
    return { key, count, disabled: count === 0 && key !== selected };
  });
}

/**
 * The filter rows. `pool` is what the search matched; `catalogue` is every
 * product the audience can see. A row with nothing to choose between is
 * returned empty (the view then hides it) unless one of its chips is already
 * selected, which must stay visible so it can be cleared.
 */
function buildFacets(
  pool: Product[],
  catalogue: Product[],
  f: ActiveFilters,
  categories: CategoryKey[],
) {
  const uses =
    f.category === "all"
      ? []
      : facetOptions(pool, f, "use", CATEGORY_USES[f.category], f.use, (p) => p.use);
  // Brands of the chosen category, so the list does not change under the other
  // filters; a selected brand always keeps its chip so it can be cleared.
  const brandKeys = BRANDS.filter(
    (b) =>
      b === f.brand ||
      catalogue.some((p) => p.brand === b && (f.category === "all" || p.category === f.category)),
  );
  const packs = facetOptions(pool, f, "pack", PACKS, f.pack, packOf);
  return {
    categories: facetOptions(pool, f, "category", categories, f.category, (p) => p.category),
    uses: uses.filter((o) => o.count > 0).length >= 2 || f.use !== "all" ? uses : [],
    brands:
      brandKeys.length >= 2 || f.brand !== "all"
        ? facetOptions(pool, f, "brand", brandKeys, f.brand, (p) => p.brand)
        : [],
    packs: packs.every((o) => o.count > 0) || f.pack !== "all" ? packs : [],
  };
}

/** Extra search words for a brand, category or use key; most keys have none. */
function aliasesFor(key: string): readonly string[] {
  return SEARCH_ALIASES[key] ?? [];
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
 * filters (`?category=film&use=window-tint&brand=VTEK&pack=trade`, and on
 * retail `&q=wax&sort=price-asc&priced=1`) so category links from the home
 * page and footer deep-link straight into a filtered grid, and chip clicks
 * update the address bar via `history.replaceState` — which Next.js folds into
 * `useSearchParams` without a server round-trip. Old `?category=` keys are
 * rewritten to the current category (+ use) the same way.
 *
 * The search box is the one exception: it filters from local state on every
 * keystroke and writes `?q=` to the URL a moment later.
 */
export function ProductGrid({ audience, locale }: Props) {
  const t = useTranslations();
  const params = useSearchParams();
  const retail = true;
  const brand = asBrand(params.get("brand"));
  const pack = asPack(params.get("pack"));
  const rawCategory = params.get("category");
  const rawUse = params.get("use");
  const { category, use } = resolveCategoryUse(rawCategory, rawUse);
  const sort = retail ? asSort(params.get("sort")) : "recommended";
  const pricedOnly = retail && params.get("priced") === "1";
  const [query, setQuery] = useState(() => (retail ? (params.get("q") ?? "") : ""));

  useEffect(() => {
    if (!retail) return;
    const id = window.setTimeout(() => updateUrl({ q: query.trim() || null }), 300);
    return () => window.clearTimeout(id);
  }, [query, retail]);

  // Old or invalid `category` / `use` values are rewritten once to the current
  // ones, so the address bar always shows the URL contract and can be shared.
  useEffect(() => {
    const canonicalCategory = category === "all" ? null : category;
    const canonicalUse = use === "all" ? null : use;
    if ((rawCategory || null) !== canonicalCategory || (rawUse || null) !== canonicalUse) {
      updateUrl({ category: canonicalCategory, use: canonicalUse });
    }
  }, [rawCategory, rawUse, category, use]);

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
              ...aliasesFor(p.brand),
              p.category,
              t(`Categories.${p.category}`),
              ...aliasesFor(p.category),
              ...(p.use ? [t(`Uses.${p.use}`), ...aliasesFor(p.use)] : []),
              p.slug.replace(/-/g, " "),
            ],
            body: [p.shortDesc.en, p.shortDesc.ar],
          }),
        ]),
      ),
    [baseProducts, t],
  );

  // What the search text matches; the filter rows count from this pool.
  const searched = useMemo(() => {
    const tokens = queryTokens(query);
    if (tokens.length === 0) return baseProducts;
    const scored = baseProducts
      .map((p) => ({ p, score: scoreDoc(searchDocs.get(p.slug)!, tokens) }))
      .filter((s) => s.score > 0);
    // Most relevant first when no explicit sort is chosen (stable sort keeps
    // catalogue order among equal scores).
    if (sort === "recommended") scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.p);
  }, [baseProducts, query, searchDocs, sort]);

  const active = useMemo<ActiveFilters>(
    () => ({ brand, category, use, pack, pricedOnly }),
    [brand, category, use, pack, pricedOnly],
  );
  const facets = useMemo(
    () => buildFacets(searched, baseProducts, active, categories),
    [searched, baseProducts, active, categories],
  );

  const products = useMemo(() => {
    const list = searched.filter((p) => passes(p, active));
    if (sort === "price-asc") return byPrice(list, 1);
    if (sort === "price-desc") return byPrice(list, -1);
    return list;
  }, [searched, active, sort]);

  return (
    <ProductGridView
      audience={audience}
      locale={locale}
      products={products}
      categories={facets.categories}
      uses={facets.uses}
      brands={facets.brands}
      packs={facets.packs}
      filters={{ brand, category, use, pack }}
      onBrand={(b) => updateUrl({ brand: b === "all" ? null : b })}
      onCategory={(c) => updateUrl({ category: c === "all" ? null : c, use: null })}
      onUse={(u) => updateUrl({ use: u === "all" ? null : u })}
      onPack={(k) => updateUrl({ pack: k === "all" ? null : k })}
      onClear={() => {
        setQuery("");
        updateUrl({
          brand: null,
          category: null,
          use: null,
          pack: null,
          q: null,
          priced: null,
        });
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
              onSearchAll: () =>
                updateUrl({ brand: null, category: null, use: null, pack: null, priced: null }),
            }
          : undefined
      }
    />
  );
}
