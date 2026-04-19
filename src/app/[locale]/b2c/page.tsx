import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Hero } from "@/components/home/Hero";
import { StarProducts } from "@/components/home/StarProducts";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { TestimonialsPlaceholder } from "@/components/home/TestimonialsPlaceholder";
import { TrustBadges } from "@/components/home/TrustBadges";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: { absolute: t("defaultTitle") },
    description: t("defaultDescription"),
    ...pageMeta(locale as Locale, "/b2c"),
  };
}

export default async function B2CHome({
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
      <Script
        id="ld-localbusiness-b2c"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero audience="b2c" locale={l} />
      <StarProducts audience="b2c" locale={l} />
      <BrandStrip />
      <ServicesTeaser />
      <TestimonialsPlaceholder />
      <TrustBadges />
    </Shell>
  );
}
