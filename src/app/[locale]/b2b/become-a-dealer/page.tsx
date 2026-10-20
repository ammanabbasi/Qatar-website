import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { PageHero } from "@/components/ui/PageHero";
import { DealerPartnershipTiers } from "@/components/dealer/DealerPartnershipTiers";
import { DealerLogistics } from "@/components/dealer/DealerLogistics";
import { DealerApplicationForm } from "@/components/dealer/DealerApplicationForm";
import { TrustBadges } from "@/components/home/TrustBadges";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { clampDescription, fitTitle, pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: fitTitle(meta("becomeDealerTitle")),
    description: clampDescription(meta("becomeDealerDescription")),
    ...pageMeta(locale as Locale, "/b2b/become-a-dealer"),
  };
}

export default async function BecomeDealer({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const home = await getTranslations({ locale, namespace: "Home" });
  const eyebrows = await getTranslations({ locale, namespace: "Eyebrows" });
  const crumbLd = breadcrumbJsonLd([
    { name: l === "ar" ? "الرئيسية" : "Home", url: `${SITE.url}/${l}` },
    {
      name: home("becomeDealerHeading"),
      url: `${SITE.url}/${l}/b2b/become-a-dealer`,
    },
  ]);

  return (
    <Shell audience="b2b" locale={l}>
      <JsonLd id="ld-dealer-crumb" data={crumbLd} />
      <PageHero
        eyebrow={eyebrows("partner")}
        title={home("becomeDealerHeading")}
        subtitle={home("becomeDealerTagline")}
      />
      <DealerPartnershipTiers />
      <DealerLogistics />
      <DealerApplicationForm locale={l} />
      <TrustBadges />
    </Shell>
  );
}
