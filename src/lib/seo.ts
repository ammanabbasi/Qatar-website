import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

/**
 * Per-page canonical + hreflang alternates.
 *
 * `pathWithoutLocale` is the route path *after* the locale segment —
 * e.g. `/b2c/products`, `/about`, `/b2b/products/vertek-ppf-weather-armor`.
 * Leading slash required, no trailing slash.
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
  return {
    alternates: {
      canonical: `/${locale}${pathWithoutLocale}`,
      languages: {
        en: `/en${pathWithoutLocale}`,
        ar: `/ar${pathWithoutLocale}`,
        "x-default": `/en${pathWithoutLocale}`,
      },
    },
  };
}
