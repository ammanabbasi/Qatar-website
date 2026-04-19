"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import {
  PRODUCTS,
  BRANDS,
  CATEGORIES,
  type Product,
  type BrandKey,
  type CategoryKey,
} from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: "en" | "ar";
};

export function ProductGrid({ audience, locale }: Props) {
  const t = useTranslations();
  const [brand, setBrand] = useState<BrandKey | "all">("all");
  const [category, setCategory] = useState<CategoryKey | "all">("all");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p: Product) => {
      if (brand !== "all" && p.brand !== brand) return false;
      if (category !== "all" && p.category !== category) return false;
      return true;
    });
  }, [brand, category]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Chips
            label={t("Products.filterBrand")}
            value={brand}
            onChange={(v) => setBrand(v as BrandKey | "all")}
            options={[
              { value: "all", label: t("Products.filterAll") },
              ...BRANDS.map((b) => ({ value: b, label: t(`Brands.${b}`) })),
            ]}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Chips
            label={t("Products.filterCategory")}
            value={category}
            onChange={(v) => setCategory(v as CategoryKey | "all")}
            options={[
              { value: "all", label: t("Products.filterAll") },
              ...CATEGORIES.map((c) => ({ value: c, label: t(`Categories.${c}`) })),
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-(--color-text-muted) py-16">
          {t("Products.noResults")}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {filtered.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              locale={locale}
              audience={audience}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Chips({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.22em] text-(--color-text-muted)">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`px-3.5 h-8 rounded-full border text-xs transition-all ${
                active
                  ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                  : "border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) hover:border-(--color-text-muted)"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
