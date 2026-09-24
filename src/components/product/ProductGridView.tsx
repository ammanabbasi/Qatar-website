import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";
import { AudienceCrossBanner } from "./AudienceCrossBanner";
import type { BrandKey, CategoryKey, Product } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

export type GridFilters = {
  brand: BrandKey | "all";
  category: CategoryKey | "all";
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
};

type Props = {
  audience: Audience;
  locale: "en" | "ar";
  /** Already filtered. */
  products: Product[];
  brands: BrandKey[];
  categories: CategoryKey[];
  filters: GridFilters;
  /** Omit for the static (server) render — chips are then purely presentational. */
  onBrand?: (b: BrandKey | "all") => void;
  onCategory?: (c: CategoryKey | "all") => void;
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
  brands,
  categories,
  filters,
  onBrand,
  onCategory,
  onClear,
  retailTools,
}: Props) {
  const t = useTranslations();
  const query = retailTools?.query.trim() ?? "";
  const filtered =
    filters.brand !== "all" ||
    filters.category !== "all" ||
    query !== "" ||
    Boolean(retailTools?.pricedOnly);
  // In the server-rendered fallback no handlers exist, and React Server
  // Components refuse event-handler props on DOM elements — so only attach
  // onClick when a handler was actually supplied.
  const pick =
    (fn?: (v: string) => void) =>
    (value: string) =>
      fn ? () => fn(value) : undefined;
  const pickCategory = pick(onCategory as ((v: string) => void) | undefined);
  const pickBrand = pick(onBrand as ((v: string) => void) | undefined);

  return (
    <div className="flex flex-col gap-8">
      {/* Audience Cross-Navigation Banner */}
      <AudienceCrossBanner audience={audience} />

      <div className="flex flex-col gap-4">
        {retailTools ? <RetailToolbar tools={retailTools} /> : null}
        <ChipRow label={t("Products.filterCategory")}>
          <Chip active={filters.category === "all"} onClick={pickCategory("all")}>
            {t("Products.filterAll")}
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={filters.category === c} onClick={pickCategory(c)}>
              {t(`Categories.${c}`)}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label={t("Products.filterBrand")}>
          <Chip active={filters.brand === "all"} onClick={pickBrand("all")}>
            {t("Products.filterAll")}
          </Chip>
          {brands.map((b) => (
            <Chip key={b} active={filters.brand === b} onClick={pickBrand(b)}>
              {t(`Brands.${b}`)}
            </Chip>
          ))}
        </ChipRow>
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
      </div>

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
            {query ? t("Products.noResultsQueryHint") : t("Products.noResults")}
          </p>
          <Button variant="secondary" size="sm" onClick={onClear} className="mt-2">
            {t("Products.clearFilters")}
          </Button>
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
            onClick={() => tools.onQuery?.("")}
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

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption font-semibold text-(--color-text-muted)">{label}</span>
      {/* Scrolls sideways on phones, wraps from sm up. */}
      <div className="hide-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {children}
      </div>
    </div>
  );
}
