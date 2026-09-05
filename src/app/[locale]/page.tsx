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
import { TrustBadges } from "@/components/home/TrustBadges";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { BestSellerCard } from "@/components/home/BestSellerCard";
import { getStoreShelfProducts } from "@/data/products";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
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
  const bestSellers = getStoreShelfProducts("b2c", 4);

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-localbusiness-b2c" data={jsonLd} />
      <HomeHero audience="b2c" locale={l} />
      <BestSellerCard products={bestSellers} audience="b2c" locale={l} />
      <WhyQatar />
      <TrustBadges />
      <AboutSnippet />
      <StoreHeader audience="b2c" locale={l} />
      <CategoryShelf audience="b2c" />
      <StarProducts audience="b2c" locale={l} />
    </Shell>
  );
}
