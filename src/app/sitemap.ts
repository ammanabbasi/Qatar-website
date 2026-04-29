import type { MetadataRoute } from "next";
import { PRODUCTS, PRODUCT_DEFAULT_UPDATED_AT } from "@/data/products";
import { SITE } from "@/lib/constants";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  // NOTE: `""` (bare locale root like `/en`) intentionally excluded —
  // it's a redirect target, not a canonical page. Listing redirects in
  // sitemap confuses Google's canonical consolidation.
  const staticPaths = [
    "/b2c",
    "/b2c/products",
    "/b2c/services",
    "/b2b",
    "/b2b/products",
    "/b2b/become-a-dealer",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority:
          path === "/b2c"
            ? 1.0
            : path === "/privacy" || path === "/terms"
              ? 0.3
              : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${base}/${l}${path}`]),
          ),
        },
      });
    }
    for (const p of PRODUCTS) {
      // Per-product lastmod: stable when the product hasn't changed,
      // bumps when `updatedAt` is updated in the data. Sitemaps that
      // claim `lastmod=now` on every URL get downgraded by Google.
      const productLastMod = new Date(
        p.updatedAt ?? PRODUCT_DEFAULT_UPDATED_AT,
      );
      // Audience scope — only emit a URL for an audience if the product is
      // visible to that audience. Listing UI + ItemList JSON-LD apply the
      // same rule. Without this filter Google sees URLs that have no
      // inbound link from any listing page, which dilutes crawl budget.
      const audiences =
        p.audience === "both"
          ? (["b2c", "b2b"] as const)
          : ([p.audience] as const);
      for (const aud of audiences) {
        entries.push({
          url: `${base}/${locale}/${aud}/products/${p.slug}`,
          lastModified: productLastMod,
          changeFrequency: "monthly",
          priority: p.featured ? 0.8 : 0.6,
          alternates: {
            languages: Object.fromEntries(
              routing.locales.map((l) => [
                l,
                `${base}/${l}/${aud}/products/${p.slug}`,
              ]),
            ),
          },
        });
      }
    }
  }

  return entries;
}
