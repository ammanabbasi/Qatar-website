import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
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
      for (const aud of ["b2c", "b2b"]) {
        entries.push({
          url: `${base}/${locale}/${aud}/products/${p.slug}`,
          lastModified: now,
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
