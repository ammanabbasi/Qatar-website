import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Hero } from "@/components/home/Hero";
import { StarProducts } from "@/components/home/StarProducts";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { TestimonialsPlaceholder } from "@/components/home/TestimonialsPlaceholder";
import { TrustBadges } from "@/components/home/TrustBadges";
import { WhyQatar } from "@/components/home/WhyQatar";
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
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-localbusiness-b2c" data={jsonLd} />
      <Hero audience="b2c" locale={l} />
      <StarProducts audience="b2c" locale={l} />
      <AboutSnippet />
      <BrandStrip />
      <WhyQatar />
      <ServicesTeaser />
      <TestimonialsPlaceholder />
      <TrustBadges />
    </Shell>
  );
}
