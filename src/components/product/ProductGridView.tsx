import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { ChipRow } from "@/components/ui/ChipRow";
import { Button } from "@/components/ui/Button";
import { ChevronIcon, CloseIcon, SearchIcon, SortIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";
import { FilterSheet } from "./FilterSheet";
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
  /** The filter sheet's "Reset": brand, pack and priced back to all. */
  onResetRefine?: () => void;
  /** The filter sheet has closed. */
  onSheetClose?: () => void;
  retailTools?: RetailTools;
};

/**
 * Presentational catalogue grid. Rendered twice: once on the server without
 * handlers as the Suspense fallback (so the full product list is in the
 * static HTML), then on the client with handlers wired to the URL.
 *
 * Phones (< 640px): one stuck bar (Filters pill + category shelf) under the
 * site header, a Use sub-shelf, the applied brand / pack / priced chips, then
 * the count and sort. Brand, pack and "priced only" live in the Filters sheet.
 * From sm up the same controls are the labelled, wrapping rows they always were.
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
  onResetRefine,
  onSheetClose,
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
  // Filters that live behind the "Filters" pill on phones.
  const refineCount =
    Number(filters.brand !== "all") +
    Number(filters.pack !== "all") +
    Number(Boolean(retailTools?.pricedOnly));
  // The static fallback has no handlers: its phone-only controls render inert.
  const interactive = Boolean(retailTools?.onSort);
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
  const showStrip =
    !query &&
    (filters.category === "all" ||
      (filters.category === "film" && filters.use !== "window-tint"));

  return (
    <div className="flex flex-col sm:gap-8">
      {/* On phones this group is `display: contents`, so the sticky bar's
          containing block is the whole grid column and it stays stuck all the
          way down the catalogue. Keep it a direct child of this tall root, and
          keep `overflow` off every ancestor. */}
      <div className="contents sm:flex sm:flex-col sm:gap-4">
        {retailTools ? <RetailToolbar tools={retailTools} /> : null}
        <div
          id="catalogue-bar"
          className="sticky top-(--header-h) z-30 -mx-6 flex items-center bg-(--color-bg)/95 px-6 py-2 shadow-[0_1px_0_var(--color-border-soft)] backdrop-blur-xl sm:static sm:z-auto sm:mx-0 sm:block sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none"
        >
          {brands.length > 0 || packs.length > 0 || retailTools ? (
            <FilterSheet
              label={t("Products.filtersToggle")}
              activeCount={refineCount}
              resultCount={products.length}
              disabled={!interactive}
              onReset={onResetRefine}
              onClosed={onSheetClose}
            >
              {/* Price first: it is one 56px row, so on a short phone it can
                  never be the section left under the footer. */}
              {retailTools ? (
                <SheetSection id="sheet-price" title={t("Products.filterPrice")} stack>
                  <SwitchRow
                    label={t("Products.pricedOnly")}
                    on={retailTools.pricedOnly}
                    onToggle={retailTools.onPricedOnly}
                  />
                </SheetSection>
              ) : null}
              {brands.length > 0 ? (
                <SheetSection id="sheet-brand" title={t("Products.filterBrand")}>
                  <FacetChips
                    options={brands}
                    selected={filters.brand}
                    label={(b) => t(`Brands.${b}`)}
                    onPick={pickBrand}
                    locale={locale}
                    showCounts
                  />
                </SheetSection>
              ) : null}
              {packs.length > 0 ? (
                <SheetSection id="sheet-pack" title={t("Products.filterPack")}>
                  <FacetChips
                    options={packs}
                    selected={filters.pack}
                    label={(k) => t(`Packs.${k}`)}
                    onPick={pickPack}
                    locale={locale}
                    showCounts
                  />
                </SheetSection>
              ) : null}
            </FilterSheet>
          ) : null}
          {/* ms-1: a scrolled shelf is clipped 4px short of the Filters pill, not
              flush against its border. Phones under 390px keep every pixel for
              the next chip's peek (it is only ~20px wide at 375). */}
          <ChipRow
            variant="bar"
            className="min-w-0 flex-1 ms-1 max-[390px]:ms-0 sm:ms-0"
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
        </div>
        {uses.length > 0 ? (
          <ChipRow
            labelHiddenOnPhone
            className="max-sm:pt-2 max-sm:pb-1"
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
        {/* From sm up brand and pack are always-visible labelled rows; on
            phones they live in the Filters sheet. */}
        {brands.length > 0 || packs.length > 0 ? (
          <div className="hidden sm:flex sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4">
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
          </div>
        ) : null}
        {refineCount > 0 ? (
          <AppliedFilters
            filters={filters}
            pricedOnly={Boolean(retailTools?.pricedOnly)}
            onBrand={onBrand}
            onPack={onPack}
            onPricedOnly={retailTools?.onPricedOnly}
            onClear={onClear}
          />
        ) : null}
        <div
          id="catalogue-results"
          className="flex items-center gap-x-3 text-footnote text-(--color-text-muted) max-sm:h-11 sm:flex-wrap sm:gap-x-4 sm:gap-y-2"
        >
          <span aria-live="polite" aria-atomic="true" className="whitespace-nowrap">
            {t("Products.count", { count: products.length })}
          </span>
          {retailTools ? (
            <Chip
              className="max-sm:hidden"
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
              className="text-link text-footnote font-medium max-sm:hidden"
            >
              {t("Products.clearFilters")}
            </button>
          )}
          {retailTools ? <SortPill tools={retailTools} /> : null}
        </div>
        {filters.pack === "trade" ? (
          <p className="text-footnote text-(--color-text-muted) max-sm:mt-1">
            {t("Products.tradeNote")}
          </p>
        ) : null}
      </div>

      {/* Below the filters, not above them, so a filter that removes the strip
          never moves the chip rows under the cursor. Shown to shoppers browsing
          everything or the film category (but not the window tints); a search
          stays clean. */}
      {showStrip ? (
        <div className="max-sm:mt-1">
          <PpfInstallStrip locale={locale} />
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="tile flex flex-col items-center gap-3 px-6 py-10 text-center max-sm:mt-3 sm:py-16">
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
              <Button
                variant="primary"
                size="sm"
                onClick={retailTools?.onSearchAll}
                className="max-sm:h-11"
              >
                {t("Products.searchAll")}
              </Button>
              <button
                type="button"
                onClick={onClear}
                className="text-link text-footnote font-medium max-sm:inline-flex max-sm:h-11 max-sm:items-center"
              >
                {t("Products.clearFilters")}
              </button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={query ? clearSearch : onClear}
              className="mt-2 max-sm:h-11"
            >
              {query ? t("Products.searchClear") : t("Products.clearFilters")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 max-sm:mt-3 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
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
        {/* 16px on phones: iOS Safari zooms the page into any smaller field on
            focus. The placeholder stays 14px, and the end padding grows only
            when the clear button is showing. */}
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
          className="h-11 w-full text-ellipsis rounded-pill bg-(--color-surface) ps-11 pe-4 text-footnote text-(--color-text) shadow-[0_0_0_1px_var(--color-border)] placeholder:text-footnote placeholder:text-(--color-text-subtle) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep) max-sm:text-[16px] max-sm:focus-visible:-outline-offset-2 [&:not(:placeholder-shown)]:pe-12 [&::-webkit-search-cancel-button]:appearance-none"
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
      {/* Desktop sort. Phones get the SortPill in the results row instead. */}
      <div className="flex items-center gap-2 max-sm:hidden">
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
 * Phone sort control in the results row: a pill showing the current order,
 * with the real <select> laid invisibly over it so a tap opens the OS picker
 * and the hit area is 44px. A non-default order gets an ink outline, so it is
 * never a hidden state. Disabled (not dimmed) in the static fallback.
 */
function SortPill({ tools }: { tools: RetailTools }) {
  const t = useTranslations("Products");
  const sortText =
    tools.sort === "price-asc"
      ? t("sortPriceAsc")
      : tools.sort === "price-desc"
        ? t("sortPriceDesc")
        : t("sortRecommended");
  return (
    <div
      className={`relative ms-auto inline-flex h-9 max-w-[65%] items-center gap-1.5 rounded-pill bg-(--color-surface) ps-3 pe-2.5 text-footnote font-medium text-(--color-text) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--color-brand-deep) sm:hidden ${
        tools.sort === "recommended"
          ? "shadow-[0_0_0_1px_var(--color-border-soft)]"
          : "shadow-[0_0_0_1.5px_var(--color-ink)]"
      }`}
    >
      <SortIcon className="h-4 w-4 shrink-0 text-(--color-text-muted)" />
      <span aria-hidden className="min-w-0 truncate">
        {sortText}
      </span>
      <ChevronIcon className="h-2.5 w-2.5 shrink-0 rotate-90 text-(--color-text-muted)" />
      <select
        id="catalogue-sort-m"
        aria-label={t("sortLabel")}
        {...(tools.onSort
          ? {
              value: tools.sort,
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                tools.onSort?.(e.target.value as SortKey),
            }
          : { defaultValue: tools.sort, disabled: true })}
        className="absolute inset-x-0 -top-1 h-11 w-full cursor-pointer appearance-none text-[16px] opacity-0"
      >
        <option value="recommended">{t("sortRecommended")}</option>
        <option value="price-asc">{t("sortPriceAsc")}</option>
        <option value="price-desc">{t("sortPriceDesc")}</option>
      </select>
    </div>
  );
}

/** One titled group of controls inside the Filters sheet. `stack` = full-width rows, not wrapping chips. */
function SheetSection({
  id,
  title,
  stack = false,
  children,
}: {
  id: string;
  title: string;
  stack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div role="group" aria-labelledby={id}>
      <h3 id={id} className="mb-3 text-caption font-semibold text-(--color-text-muted)">
        {title}
      </h3>
      <div className={stack ? "flex flex-col" : "flex flex-wrap gap-2"}>{children}</div>
    </div>
  );
}

/** Full-width on/off row: a 56px tap target with an iOS-style switch. */
function SwitchRow({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle?: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle ? () => onToggle(!on) : undefined}
      className="flex h-14 w-full items-center justify-between gap-4 rounded-tile bg-(--color-surface) px-4 text-start text-footnote font-medium text-(--color-text) shadow-[0_0_0_1px_var(--color-border-soft)]"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ease-soft ${
          on ? "bg-(--color-ink)" : "bg-(--color-fill-hover)"
        }`}
      >
        <span
          className={`absolute start-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-soft ${
            on ? "translate-x-5 rtl:-translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}

/**
 * Phone-only row of the brand / pack / priced filters in force, each removable
 * in one tap, plus "Clear filters" (everything). Focus moves to the Filters
 * pill after a removal, because the chip that had it is gone.
 */
function AppliedFilters({
  filters,
  pricedOnly,
  onBrand,
  onPack,
  onPricedOnly,
  onClear,
}: {
  filters: GridFilters;
  pricedOnly: boolean;
  onBrand?: (b: BrandKey | "all") => void;
  onPack?: (p: PackKey | "all") => void;
  onPricedOnly?: (on: boolean) => void;
  onClear?: () => void;
}) {
  const t = useTranslations();
  const items: { key: string; label: string; remove?: () => void }[] = [];
  if (filters.brand !== "all") {
    items.push({
      key: "brand",
      label: t(`Brands.${filters.brand}`),
      remove: onBrand ? () => onBrand("all") : undefined,
    });
  }
  if (filters.pack !== "all") {
    items.push({
      key: "pack",
      label: t(`Packs.${filters.pack}`),
      remove: onPack ? () => onPack("all") : undefined,
    });
  }
  if (pricedOnly) {
    items.push({
      key: "priced",
      label: t("Products.pricedOnly"),
      remove: onPricedOnly ? () => onPricedOnly(false) : undefined,
    });
  }
  return (
    <ul
      aria-label={t("Products.activeFilters")}
      className="flex flex-wrap items-center gap-1.5 pb-1 pt-2 sm:hidden"
    >
      {items.map((item) => {
        const remove = item.remove;
        return (
          <li key={item.key}>
            <button
              type="button"
              aria-label={t("Products.removeFilter", { label: item.label })}
              onClick={
                remove
                  ? () => {
                      remove();
                      document.getElementById("catalogue-filters-btn")?.focus();
                    }
                  : undefined
              }
              className="relative inline-flex h-9 items-center gap-1 rounded-pill bg-(--color-ink) ps-3 pe-2 text-footnote font-medium text-white before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']"
            >
              {item.label}
              <CloseIcon className="h-3.5 w-3.5 text-white/70" />
            </button>
          </li>
        );
      })}
      <li>
        <button
          type="button"
          onClick={onClear}
          className="relative inline-flex h-9 items-center ps-1 text-link text-footnote font-medium before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']"
        >
          {t("Products.clearFilters")}
        </button>
      </li>
    </ul>
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
