import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/constants";

/**
 * Every social card is 1200×630 (1.91:1) — the size Facebook, WhatsApp,
 * LinkedIn and X all render as a full-width preview instead of a thumbnail.
 */
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export type SocialImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Site-wide brand card, one per locale — `public/og/abk-og-{en,ar}.jpg`,
 * screenshots of `scripts/og/brand-card.html` (README → "Social cards").
 */
export function defaultSocialImage(locale: Locale): SocialImage {
  return {
    url: `${SITE.url}/og/abk-og-${locale}.jpg`,
    ...SOCIAL_IMAGE_SIZE,
    alt:
      locale === "ar"
        ? "ABK للتجارة والخدمات — العناية بالسيارات وأفلام حماية الطلاء في الدوحة، قطر"
        : "ABK Trading & Service — car care, PPF and detailing in Doha, Qatar",
  };
}

/** Per-product card from `npm run og:products` — `public/og/products/<slug>.jpg`. */
export function productSocialImage(slug: string, alt: string): SocialImage {
  return { url: `${SITE.url}/og/products/${slug}.jpg`, ...SOCIAL_IMAGE_SIZE, alt };
}

type PageMetaOptions = {
  /** Page-specific card; defaults to the locale's brand card. */
  image?: SocialImage;
  /** Blog posts: `og:type=article` plus article:published_time / modified_time. */
  article?: { publishedTime: string; modifiedTime?: string };
};

/**
 * Per-page canonical + hreflang + social tags.
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
 * `openGraph` / `twitter` are returned WHOLE (type, url, siteName, locale,
 * images) rather than relying on the layout for the shared fields: Next.js
 * merges `openGraph` shallowly, so a page that set only `images` would wipe
 * the layout's siteName/locale. Building the complete object here means every
 * page gets a consistent card and og:url always equals its canonical. Titles
 * and descriptions are left out on purpose — Next.js copies the page-level
 * `title`/`description` into og:* and twitter:* automatically.
 */
export function pageMeta(
  locale: Locale,
  pathWithoutLocale: string,
  opts: PageMetaOptions = {},
): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  const base = SITE.url;
  const canonical = `${base}/${locale}${pathWithoutLocale}`;
  const image = opts.image ?? defaultSocialImage(locale);
  const shared = {
    url: canonical,
    siteName: SITE.name,
    locale: locale === "ar" ? "ar_QA" : "en_QA",
    alternateLocale: locale === "ar" ? "en_QA" : "ar_QA",
    images: [image],
  };
  return {
    alternates: {
      canonical,
      languages: {
        en: `${base}/en${pathWithoutLocale}`,
        "en-QA": `${base}/en${pathWithoutLocale}`,
        ar: `${base}/ar${pathWithoutLocale}`,
        "ar-QA": `${base}/ar${pathWithoutLocale}`,
        "x-default": `${base}/en${pathWithoutLocale}`,
      },
    },
    openGraph: opts.article
      ? {
          ...shared,
          type: "article",
          publishedTime: opts.article.publishedTime,
          modifiedTime: opts.article.modifiedTime ?? opts.article.publishedTime,
          authors: [SITE.name],
        }
      : { ...shared, type: "website" },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

/**
 * Join a page-specific description with its local-intent tail, clamped to
 * `max` characters at a word boundary. Google trims snippets at roughly
 * 155–160 characters; a deliberate cut keeps the "…ABK, Doha. WhatsApp…" tail
 * visible instead of letting the SERP chop it off.
 */
export function metaDescription(body: string, tail: string, max = 158): string {
  const joined = `${body} ${tail}`;
  if (joined.length <= max) return joined;
  const room = max - tail.length - 2; // "… " between body and tail
  const head = body.slice(0, room);
  const cut = head
    .slice(0, Math.max(head.lastIndexOf(" "), 0))
    .replace(/[\s.,;:—–-]+$/u, "");
  return `${cut}… ${tail}`;
}

/**
 * Google shows roughly the first 60 characters of a title (about 600px) and
 * rewrites the rest away, usually dropping the brand first. Titles that run
 * past that were being cut mid-phrase in the SERP, so every title below is
 * built to fit: the keyword-bearing part comes first and the brand suffix is
 * only appended while the whole thing still fits.
 */
export const TITLE_MAX = 62;
const BRAND_SUFFIX = " | ABK Trading";

/**
 * Full `<title>` for a page, as `{ absolute }` so the layout template never
 * adds a second suffix. The brand is appended only when the result still fits
 * `TITLE_MAX`; the domain and the WebSite name already identify ABK in the SERP.
 * Stems that already carry the brand ("… | ABK") are left alone.
 */
export function fitTitle(stem: string, max = TITLE_MAX): { absolute: string } {
  if (/ABK/i.test(stem)) return { absolute: stem };
  const withBrand = `${stem}${BRAND_SUFFIX}`;
  return { absolute: withBrand.length <= max ? withBrand : stem };
}

/**
 * Meta description clamped at a word boundary. Google's desktop snippet is
 * ~155–160 characters and mobile ~120, so anything longer gets cut mid-sentence.
 */
export function clampDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max - 1);
  const cut = head.slice(0, Math.max(head.lastIndexOf(" "), 0));
  return `${cut.replace(/[\s.,;:—–-]+$/u, "")}…`;
}

/**
 * Search-intent `<title>` for product pages. Tries the richest local-intent
 * tail first (category + Doha, then "Buy in Doha", then "in Qatar") and takes
 * the first one that still leaves room for the brand suffix; failing that, the
 * richest tail that fits on its own. Product names are never truncated.
 */
export function productMetaTitle(
  name: string,
  categoryLabel: string,
  locale: "en" | "ar",
): { absolute: string } {
  const ar = locale === "ar";
  const lower = name.toLowerCase();
  const hasPlace = ar
    ? name.includes("قطر") || name.includes("الدوحة")
    : lower.includes("qatar") || lower.includes("doha");
  const tails = hasPlace
    ? [""]
    : ar
      ? [` — ${categoryLabel} في الدوحة، قطر`, " — متوفر في الدوحة، قطر", " في قطر", ""]
      : [` — ${categoryLabel} in Doha, Qatar`, " — Buy in Doha, Qatar", " in Qatar", ""];
  for (const tail of tails) {
    const stem = `${name}${tail}`;
    if (`${stem}${BRAND_SUFFIX}`.length <= TITLE_MAX) return { absolute: `${stem}${BRAND_SUFFIX}` };
  }
  for (const tail of tails) {
    const stem = `${name}${tail}`;
    if (stem.length <= TITLE_MAX) return { absolute: stem };
  }
  return { absolute: name };
}

