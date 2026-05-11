import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { routing, type Locale } from "@/i18n/routing";
import {
  fontSans,
  fontDisplay,
  fontArabic,
  fontArabicDisplay,
} from "@/lib/fonts";
import { SITE } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });

  // `alternates` intentionally omitted here — child pages set their own
  // canonical + hreflang via `pageMeta()` in `src/lib/seo.ts`. Setting
  // alternates at the layout level canonicalised every page to the bare
  // `/${locale}` root, collapsing 95+ URLs in Google's index.
  //
  // OG image auto-wires from `opengraph-image.tsx` — no `images` field here.
  //
  // Icons auto-wire from `app/icon.png` + `app/apple-icon.png` conventions.
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t("defaultTitle"),
      template: `%s · ${SITE.shortName}`,
    },
    description: t("defaultDescription"),
    // Secondary keyword signal — deprecated by Google but still consumed by
    // Bing, Yandex, DuckDuckGo and AI answer engines. Zero downside.
    keywords:
      locale === "ar"
        ? [
            "العناية بالسيارات قطر",
            "أفلام حماية الطلاء الدوحة",
            "سيراميك سيارات",
            "تلميع سيارات قطر",
            "شامبو سيارات",
            "تظليل نوافذ قطر",
            "PPF قطر",
            "ABK",
          ]
        : [
            "car care Qatar",
            "car care products Doha",
            "paint protection film Qatar",
            "PPF Doha",
            "ceramic coating Qatar",
            "car detailing Doha",
            "car shampoo Qatar",
            "car polish",
            "window tinting Qatar",
            "auto detailing products",
            "ABK Trading",
          ],
    // NOTE: `openGraph.title` / `openGraph.description` / `openGraph.url`
    // intentionally OMITTED — Next.js auto-maps the page-level `title` and
    // `description` fields to og:title / og:description / twitter:title /
    // twitter:description. Setting them at the layout means every page
    // inherits the DEFAULT site title/description in social previews,
    // collapsing per-product OG cards into a single generic preview.
    // The fields set below (siteName, locale, type) DO make sense at the
    // layout level because they don't vary per page.
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "ar" ? "ar_QA" : "en_QA",
    },
    twitter: {
      card: "summary_large_image",
    },
    // Search engine verification — set via Vercel env vars, no code change needed.
    // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION → Google Search Console
    // NEXT_PUBLIC_BING_SITE_VERIFICATION  → Bing Webmaster Tools
    // ⚠ Paste ONLY the content value (e.g. "abc123"), NOT the full <meta> tag.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          verification: {
            ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
              ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
              : {}),
            ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
              ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
              : {}),
          },
        }
      : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  // Plausible is env-gated — unset on dev/preview so localhost traffic
  // doesn't pollute production stats. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN on
  // Vercel production env only.
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  const skipLabel =
    locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content";

  // Site-wide brand identity schema. Emitted ONCE at the layout (not per page)
  // because the Organization + WebSite entities are global. Google merges
  // multiple JSON-LD blocks across pages by @id, so duplicating these on
  // every page would not strengthen them — only bloat the HTML.
  const orgLd = organizationJsonLd();
  const siteLd = websiteJsonLd(locale as "en" | "ar");

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontArabic.variable} ${fontArabicDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-(--color-bg) text-(--color-text) antialiased">
        {/* Keyboard-first users land here — `sr-only` hides until focus,
            then `focus:not-sr-only` reveals the link as a visible gold pill. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-(--color-gold) focus:text-(--color-bg) focus:font-medium focus:shadow-lg"
        >
          {skipLabel}
        </a>
        <Script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
        />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
          />
        )}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
