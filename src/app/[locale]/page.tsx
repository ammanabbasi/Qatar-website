import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { HomeHero } from "@/components/home/HomeHero";
import { StoreHeader } from "@/components/home/StoreHeader";
import { CategoryShelf } from "@/components/home/CategoryShelf";
import { StarProducts } from "@/components/home/StarProducts";
import { WhyQatar } from "@/components/home/WhyQatar";
import { BrandStrip } from "@/components/home/BrandStrip";
import { TrustBadges } from "@/components/home/TrustBadges";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";

/**
 * The B2C home renders directly at the locale root (`/en`, `/ar`).
 *
 * It previously lived at `/{locale}/b2c` with this route 307-redirecting to
 * it, which made the homepage a DOUBLE temporary-redirect chain from `/`
 * (`/` -> 307 -> `/en` -> 307 -> `/en/b2c`). Temporary redirects tell Google
 * the target is NOT canonical, so the most-linked URL on the domain never
 * consolidated ranking signals. `/{locale}/b2c` now 308s here (next.config.ts).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: { absolute: t("homeB2cTitle") },
    description: t("homeB2cDescription"),
    ...pageMeta(locale as Locale, ""),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const jsonLd = localBusinessJsonLd(l);

  return (
    <Shell audience="b2c" locale={l} headerTone="dark">
      <JsonLd id="ld-localbusiness-b2c" data={jsonLd} />
      <HomeHero audience="b2c" locale={l} />
      <StoreHeader audience="b2c" locale={l} />
      <CategoryShelf audience="b2c" />
      <StarProducts audience="b2c" locale={l} />
      <WhyQatar />
      <BrandStrip audience="b2c" />
      <TrustBadges />
      <AboutSnippet />
    </Shell>
  );
}
