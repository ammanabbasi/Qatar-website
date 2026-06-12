import type { MetadataRoute } from "next";
import { PRODUCTS, PRODUCT_DEFAULT_UPDATED_AT } from "@/data/products";
import { ARTICLES } from "@/data/articles";
import { SITE } from "@/lib/constants";
import { routing } from "@/i18n/routing";

// Bump when static-page content meaningfully changes. Pinned (not `new Date()`)
// because sitemaps claiming lastmod=now on every URL at every build get their
// lastmod signals ignored by Google — same principle as product lastmods below.
// 2026-06-12: homepage moved from /{locale}/b2c to the locale root.
const STATIC_PAGES_UPDATED_AT = "2026-06-12";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticLastMod = new Date(STATIC_PAGES_UPDATED_AT);

  // `""` is the locale root (`/en`, `/ar`) — the B2C homepage renders there
  // directly (it previously lived at `/b2c`, which now 308s to the root).
  const staticPaths = [
    "",
    "/b2c/products",
    "/b2c/services",
    "/b2c/blog",
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
        lastModified: staticLastMod,
        changeFrequency: "weekly",
        priority:
          path === ""
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
      // Canonical-only URLs. Products visible to BOTH audiences render at
      // /b2c/... and /b2b/... with near-identical content; the b2b copy
      // canonicalises to the b2c URL (see b2b/products/[slug]/page.tsx), so
      // only the b2c URL belongs in the sitemap — listing non-canonical URLs
      // makes Google flag "Duplicate, submitted URL not selected as canonical".
      const audiences =
        p.audience === "both" ? (["b2c"] as const) : ([p.audience] as const);
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
    // Blog articles
    for (const article of ARTICLES) {
      entries.push({
        url: `${base}/${locale}/b2c/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${base}/${l}/b2c/blog/${article.slug}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
