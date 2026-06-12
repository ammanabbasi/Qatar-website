import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/constants";

/**
 * Per-page canonical + hreflang alternates.
 *
 * `pathWithoutLocale` is the route path *after* the locale segment —
 * e.g. `/b2c/products`, `/about`, `/b2b/products/vertek-ppf-weather-armor`.
 * Leading slash required, no trailing slash. Pass `""` for the locale root
 * (the homepage) — canonical resolves to e.g. `https://…/en`.
 *
 * URLs are ABSOLUTE (prefixed with SITE.url) because:
 *   - Google strongly prefers absolute canonicals over relative.
 *   - Relative hreflang can mis-resolve under certain CDN/proxy setups.
 *   - metadataBase handles OG images but does NOT apply to alternates.languages.
 *
 * Scope note on og:url:
 *   An earlier version of this helper also returned `openGraph: { url }` so
 *   every page would emit its own og:url. That broke social share previews:
 *   Next.js metadata merge is SHALLOW on `openGraph` — any child setting
 *   any openGraph field replaces the whole object, including the images
 *   wired from `opengraph-image.tsx`. Dropping og:url here lets scrapers
 *   fall back to the request URL (which matches canonical) while
 *   preserving Satori-generated social previews. Net: fewer tags, same SEO
 *   semantics, correct Facebook/LinkedIn dedup via canonical.
 */
export function pageMeta(
  locale: Locale,
  pathWithoutLocale: string,
): Pick<Metadata, "alternates"> {
  const base = SITE.url;
  return {
    alternates: {
      canonical: `${base}/${locale}${pathWithoutLocale}`,
      languages: {
        en: `${base}/en${pathWithoutLocale}`,
        ar: `${base}/ar${pathWithoutLocale}`,
        "x-default": `${base}/en${pathWithoutLocale}`,
      },
    },
  };
}
