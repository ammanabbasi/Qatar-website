import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { ChipRow } from "@/components/ui/ChipRow";
import { Button } from "@/components/ui/Button";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";
import { FilterDisclosure } from "./FilterDisclosure";
import { PpfInstallStrip } from "@/components/ppf/PpfInstallStrip";
import { formatNumber } from "@/lib/pricing";
import type { BrandKey, CategoryKey, PackKey, Product, UseKey } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

export type GridFilters = {
  brand: BrandKey | "all";
  category: CategoryKey | "all";
  use: UseKey | "all";
  pack: PackKey | "all";
};

/** One chip of a filter row. Without a count (the static fallback) it is a plain chip. */
export type FacetOption<K extends string> = {
  key: K;
  count?: number;
  /** Nothing would match: stays in the row, dimmed, so the row never reflows. */
  disabled?: boolean;
};

export const SORT_KEYS = ["recommended", "price-asc", "price-desc"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

/** Retail-only search / sort / "priced items" controls. */
export type RetailTools = {
  query: string;
  sort: SortKey;
  pricedOnly: boolean;
  /** Omitted in the static fallback, where the controls render inert. */
  onQuery?: (query: string) => void;
  onSort?: (sort: SortKey) => void;
  onPricedOnly?: (on: boolean) => void;
  /** Keep the search, drop brand / category / priced — the "no results" escape hatch. */
  onSearchAll?: () => void;
};

type Props = {
  audience: Audience;
  locale: "en" | "ar";
  /** Already filtered. */
  products: Product[];
  categories: FacetOption<CategoryKey>[];
  /** Empty hides the row: no category chosen, or fewer than two uses to pick from. */
  uses: FacetOption<UseKey>[];
  /** Empty hides the row. */
  brands: FacetOption<BrandKey>[];
  /** Empty hides the row. */
  packs: FacetOption<PackKey>[];
  filters: GridFilters;
  /** Omit for the static (server) render — chips are then purely presentational. */
  onBrand?: (b: BrandKey | "all") => void;
  onCategory?: (c: CategoryKey | "all") => void;
  onUse?: (u: UseKey | "all") => void;
  onPack?: (p: PackKey | "all") => void;
  onClear?: () => void;
  retailTools?: RetailTools;
};

/**
 * Presentational catalogue grid. Rendered twice: once on the server without
 * handlers as the Suspense fallback (so the full product list is in the
 * static HTML), then on the client with handlers wired to the URL.
 */
export function ProductGridView({
  audience,
  locale,
  products,
  categories,
  uses,
  brands,
  packs,
  filters,
  onBrand,
  onCategory,
  onUse,
  onPack,
  onClear,
  retailTools,
}: Props) {
  const t = useTranslations();
  const query = retailTools?.query.trim() ?? "";
  const chipsActive =
    filters.brand !== "all" ||
    filters.category !== "all" ||
    filters.use !== "all" ||
    filters.pack !== "all" ||
    Boolean(retailTools?.pricedOnly);
  const filtered = chipsActive || query !== "";
  // Brand and pack live behind the "Filters" pill on phones.
  const disclosureActive = Number(filters.brand !== "all") + Number(filters.pack !== "all");
  const onQuery = retailTools?.onQuery;
  const clearSearch = onQuery ? () => onQuery("") : undefined;
  // In the server-rendered fallback no handlers exist, and React Server
  // Components refuse event-handler props on DOM elements — so only attach
  // onClick when a handler was actually supplied.
  const pick =
    (fn?: (v: string) => void) =>
    (value: string) =>
      fn ? () => fn(value) : undefined;
  const pickCategory = pick(onCategory as ((v: string) => void) | undefined);
  const pickUse = pick(onUse as ((v: string) => void) | undefined);
  const pickBrand = pick(onBrand as ((v: string) => void) | undefined);
  const pickPack = pick(onPack as ((v: string) => void) | undefined);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {retailTools ? <RetailToolbar tools={retailTools} /> : null}
        <ChipRow
          label={t("Products.filterCategory")}
          activeKey={filters.category === "all" ? undefined : filters.category}
        >
          <FacetChips
            options={categories}
            selected={filters.category}
            label={(c) => t(`Categories.${c}`)}
            onPick={pickCategory}
            locale={locale}
          />
        </ChipRow>
        {uses.length > 0 ? (
          <ChipRow
            label={t("Products.filterUse")}
            activeKey={filters.use === "all" ? undefined : filters.use}
          >
            <FacetChips
              options={uses}
              selected={filters.use}
              label={(u) => t(`Uses.${u}`)}
              onPick={pickUse}
              locale={locale}
              showCounts
            />
          </ChipRow>
        ) : null}
        {brands.length > 0 || packs.length > 0 ? (
          <FilterDisclosure label={t("Products.filtersToggle")} activeCount={disclosureActive}>
            {brands.length > 0 ? (
              <ChipRow
                label={t("Products.filterBrand")}
                activeKey={filters.brand === "all" ? undefined : filters.brand}
              >
                <FacetChips
                  options={brands}
                  selected={filters.brand}
                  label={(b) => t(`Brands.${b}`)}
                  onPick={pickBrand}
                  locale={locale}
                  showCounts
                />
              </ChipRow>
            ) : null}
            {packs.length > 0 ? (
              <ChipRow
                label={t("Products.filterPack")}
                activeKey={filters.pack === "all" ? undefined : filters.pack}
              >
                <FacetChips
                  options={packs}
                  selected={filters.pack}
                  label={(k) => t(`Packs.${k}`)}
                  onPick={pickPack}
                  locale={locale}
                  showCounts
                />
              </ChipRow>
            ) : null}
          </FilterDisclosure>
        ) : null}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-footnote text-(--color-text-muted)"
          aria-live="polite"
        >
          <span>{t("Products.count", { count: products.length })}</span>
          {retailTools ? (
            <Chip
              active={retailTools.pricedOnly}
              onClick={
                retailTools.onPricedOnly
                  ? () => retailTools.onPricedOnly?.(!retailTools.pricedOnly)
                  : undefined
              }
            >
              {t("Products.pricedOnly")}
            </Chip>
          ) : null}
          {filtered && (
            <button
              type="button"
              onClick={onClear}
              className="text-link text-footnote font-medium"
            >
              {t("Products.clearFilters")}
            </button>
          )}
        </div>
        {filters.pack === "trade" ? (
          <p className="text-footnote text-(--color-text-muted)">{t("Products.tradeNote")}</p>
        ) : null}
      </div>

      {/* Below the filters, not above them, so a filter that removes the strip
          never moves the chip rows under the cursor. Shown to shoppers browsing
          everything or the film category (but not the window tints); a search
          stays clean. */}
      {!query &&
      (filters.category === "all" ||
        (filters.category === "film" && filters.use !== "window-tint")) ? (
        <PpfInstallStrip locale={locale} />
      ) : null}

      {products.length === 0 ? (
        <div className="tile flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text-muted)">
            <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4M8.5 11h5" />
            </svg>
          </span>
          <h3 className="text-title-sm font-semibold">
            {query ? t("Products.noResultsQuery", { query }) : t("Products.noResultsTitle")}
          </h3>
          <p className="max-w-sm text-footnote text-(--color-text-muted)">
            {!query
              ? t("Products.noResults")
              : chipsActive
                ? t("Products.noResultsQueryFilteredHint")
                : t("Products.noResultsQueryHint")}
          </p>
          {/* A search that finds nothing inside a filter usually exists outside
              it — offer the whole catalogue before wiping the search too. */}
          {query && chipsActive ? (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Button variant="primary" size="sm" onClick={retailTools?.onSearchAll}>
                {t("Products.searchAll")}
              </Button>
              <button type="button" onClick={onClear} className="text-link text-footnote font-medium">
                {t("Products.clearFilters")}
              </button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={query ? clearSearch : onClear}
              className="mt-2"
            >
              {query ? t("Products.searchClear") : t("Products.clearFilters")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              locale={locale}
              audience={audience}
              eager={i < 4}
              as="h2"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RetailToolbar({ tools }: { tools: RetailTools }) {
  const t = useTranslations("Products");
  const interactive = Boolean(tools.onQuery);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div role="search" className="relative flex-1">
        <label htmlFor="catalogue-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-(--color-text-muted)" />
        <input
          id="catalogue-search"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder={t("searchPlaceholder")}
          {...(interactive
            ? {
                value: tools.query,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  tools.onQuery?.(e.target.value),
              }
            : { defaultValue: tools.query, readOnly: true })}
          className="h-11 w-full rounded-pill bg-(--color-surface) ps-11 pe-12 text-footnote text-(--color-text) shadow-[0_0_0_1px_var(--color-border)] placeholder:text-(--color-text-subtle) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep) [&::-webkit-search-cancel-button]:appearance-none"
        />
        {interactive && tools.query ? (
          <button
            type="button"
            onClick={() => {
              tools.onQuery?.("");
              // This button unmounts with the query — keep focus in the box.
              document.getElementById("catalogue-search")?.focus();
            }}
            aria-label={t("searchClear")}
            className="absolute end-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-(--color-text-muted) transition-colors duration-150 ease-soft hover:bg-(--color-fill) hover:text-(--color-text)"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor="catalogue-sort"
          className="whitespace-nowrap text-caption font-semibold text-(--color-text-muted)"
        >
          {t("sortLabel")}
        </label>
        <select
          id="catalogue-sort"
          {...(tools.onSort
            ? {
                value: tools.sort,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  tools.onSort?.(e.target.value as SortKey),
              }
            : { defaultValue: tools.sort, disabled: true })}
          className="h-11 flex-1 rounded-pill bg-(--color-surface) px-4 text-footnote text-(--color-text) shadow-[0_0_0_1px_var(--color-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep) disabled:opacity-60 sm:flex-none"
        >
          <option value="recommended">{t("sortRecommended")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
        </select>
      </div>
    </div>
  );
}

/**
 * "All" plus one chip per option. A disabled option keeps its place but is
 * dimmed and inert (aria-disabled rather than `disabled`, so it stays
 * focusable and announced). A zero count is left off: the Arabic-Indic zero is
 * a lone dot, and a dimmed chip already says "none".
 */
function FacetChips<K extends string>({
  options,
  selected,
  label,
  onPick,
  locale,
  showCounts = false,
}: {
  options: FacetOption<K>[];
  selected: K | "all";
  label: (key: K) => string;
  onPick: (value: string) => (() => void) | undefined;
  locale: "en" | "ar";
  showCounts?: boolean;
}) {
  const t = useTranslations("Products");
  return (
    <>
      <Chip active={selected === "all"} onClick={onPick("all")}>
        {t("filterAll")}
      </Chip>
      {options.map((o) => (
        <Chip
          key={o.key}
          active={selected === o.key}
          onClick={o.disabled ? undefined : onPick(o.key)}
          aria-disabled={o.disabled || undefined}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          {label(o.key)}
          {showCounts && o.count ? (
            <span className="ms-1.5 text-caption tabular-nums opacity-70">
              {formatNumber(o.count, locale)}
            </span>
          ) : null}
        </Chip>
      ))}
    </>
  );
}
