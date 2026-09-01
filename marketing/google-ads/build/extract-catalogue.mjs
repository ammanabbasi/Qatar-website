// Deterministic catalogue extraction for Google Ads build.
// Node 24 strips TS types natively, so products.ts imports directly — no
// hand-transcribed product list to drift out of sync with the site.
import { PRODUCTS, BRANDS, CATEGORIES, UNPROMOTED_BRANDS } from "./products.live.ts";
import { writeFileSync } from "node:fs";

const SITE = "https://abktradingservice.com";
const promotable = PRODUCTS.filter((p) => !UNPROMOTED_BRANDS.includes(p.brand));

const rows = promotable.map((p) => ({
  slug: p.slug,
  brand: p.brand,
  category: p.category,
  audience: p.audience,
  featured: Boolean(p.featured),
  name_en: p.name.en,
  name_ar: p.name.ar,
  short_en: p.shortDesc.en,
  short_ar: p.shortDesc.ar,
  specs: (p.specs ?? []).map((s) => `${s.label.en}=${s.value.en}`).join(" | "),
  url_b2c_en: p.audience === "b2b" ? null : `${SITE}/en/b2c/products/${p.slug}`,
  url_b2b_en: p.audience === "b2c" ? null : `${SITE}/en/b2b/products/${p.slug}`,
  url_b2c_ar: p.audience === "b2b" ? null : `${SITE}/ar/b2c/products/${p.slug}`,
  url_b2b_ar: p.audience === "b2c" ? null : `${SITE}/ar/b2b/products/${p.slug}`,
}));

const byCategory = {};
for (const r of rows) (byCategory[r.category] ??= []).push(r.slug);
const byBrand = {};
for (const r of rows) (byBrand[r.brand] ??= []).push(r.slug);

const out = {
  site: SITE,
  generatedFrom: "git show HEAD:src/data/products.ts (what is actually deployed)",
  totalProducts: PRODUCTS.length,
  promotableProducts: rows.length,
  excludedBrands: [...UNPROMOTED_BRANDS],
  excludedSlugs: PRODUCTS.filter((p) => UNPROMOTED_BRANDS.includes(p.brand)).map((p) => p.slug),
  brands: BRANDS, categories: CATEGORIES, byBrand, byCategory, products: rows,
};
writeFileSync(new URL("./catalogue.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(`total=${PRODUCTS.length} promotable=${rows.length} excluded=${out.excludedSlugs.length}`);
console.log("brands:", Object.entries(byBrand).map(([b, s]) => `${b}:${s.length}`).join(" "));
console.log("cats:  ", Object.entries(byCategory).map(([c, s]) => `${c}:${s.length}`).join(" "));
