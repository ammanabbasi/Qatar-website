import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { LegalSection } from "@/components/legal/LegalSection";
import { clampDescription, fitTitle, pageMeta } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/constants";
import {
  DELIVERY,
  DISCOUNT_ENTRY,
  DISCOUNT_TOP,
  formatPercent,
  formatQar,
} from "@/lib/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const l = locale === "ar" ? "ar" : "en";
  return {
    title: fitTitle(
      l === "ar"
        ? "شروط الاستخدام والضمان — التجزئة والجملة وتركيب PPF في قطر"
        : "Terms of Use & Warranty — Retail, Wholesale & PPF in Qatar",
    ),
    description: clampDescription(
      l === "ar"
        ? "شروط الاستخدام والطلب عبر واتساب وضمان تركيب أفلام الحماية VTEK PPF لمدة 12 شهراً لدى ABK للتجارة والخدمات في مسيمير، الدوحة، قطر."
        : "Terms of Use for ABK Trading & Service in Doha, Qatar — covering retail orders, wholesale trade accounts, VTEK PPF installation bookings, and warranties.",
    ),
    ...pageMeta(locale as Locale, "/terms"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const store = await cookies();
  const audience = store.get("abk_audience")?.value === "b2b" ? "b2b" : "b2c";
  const t = await getTranslations({ locale, namespace: "Terms" });
  const eyebrows = await getTranslations({ locale, namespace: "Eyebrows" });

  // Section 9 (retail orders) came later; it reads best after product
  // information, and renumbering would move the PPF terms' anchor.
  const sections = [1, 2, 9, 3, 4, 5, 6, 7, 8] as const;
  const offer = {
    freeAmount: formatQar(DELIVERY.freeThresholdQar, l),
    fee: formatQar(DELIVERY.feeQar, l),
    low: formatPercent(DISCOUNT_ENTRY.percent, l),
    lowAmount: formatQar(DISCOUNT_ENTRY.minSubtotalQar, l),
    high: formatPercent(DISCOUNT_TOP.percent, l),
    highAmount: formatQar(DISCOUNT_TOP.minSubtotalQar, l),
  };

  const crumbLd = breadcrumbJsonLd([
    { name: l === "ar" ? "الرئيسية" : "Home", url: `${SITE.url}/${l}` },
    { name: t("title"), url: `${SITE.url}/${l}/terms` },
  ]);

  return (
    <Shell audience={audience} locale={l}>
      <JsonLd id="ld-terms-crumb" data={crumbLd} />
      <PageHero eyebrow={eyebrows("legal")} title={t("title")} subtitle={t("subtitle")}>
        <p className="mt-4 text-caption text-white/50">{t("lastUpdated")}</p>
      </PageHero>
      <section className="pb-16 pt-10 sm:pt-12">
        <Container>
          <article className="flex max-w-3xl flex-col gap-8">
            <p className="text-body text-(--color-text-muted)">{t("intro")}</p>
            {sections.map((i) => (
              <LegalSection
                key={i}
                // Section 4 is the PPF installation terms; the PPF page links here.
                id={i === 4 ? "ppf-bookings" : i === 9 ? "retail-orders" : undefined}
                title={t(`section${i}Title`)}
                body={t(`section${i}Body`, offer)}
              />
            ))}
          </article>
        </Container>
      </section>
    </Shell>
  );
}
