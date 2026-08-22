import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";
import type { BrandKey, CategoryKey, Product } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

export type GridFilters = {
  brand: BrandKey | "all";
  category: CategoryKey | "all";
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
}: Props) {
  const t = useTranslations();
  const filtered = filters.brand !== "all" || filters.category !== "all";
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
      <div className="flex flex-col gap-4">
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
        <div className="flex items-center gap-4 text-footnote text-(--color-text-muted)" aria-live="polite">
          <span>{t("Products.count", { count: products.length })}</span>
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
          <h3 className="text-title-sm font-semibold">{t("Products.noResultsTitle")}</h3>
          <p className="max-w-sm text-footnote text-(--color-text-muted)">{t("Products.noResults")}</p>
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
