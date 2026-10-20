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
        ? "سياسة الخصوصية وحماية البيانات الشخصية في قطر"
        : "Privacy Policy — Data Protection in Doha, Qatar",
    ),
    description: clampDescription(
      l === "ar"
        ? "كيف تتعامل ABK للتجارة والخدمات في مسيمير، الدوحة مع بياناتك الشخصية وطلبات واتساب وحجوزات تركيب أفلام الحماية وفق قانون حماية خصوصية البيانات القطري."
        : "How ABK Trading & Service in Mesaimeer, Doha handles customer data, WhatsApp orders, and PPF booking requests under Qatar's Personal Data Privacy Law.",
    ),
    ...pageMeta(locale as Locale, "/privacy"),
  };
}

export default async function PrivacyPage({
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
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const eyebrows = await getTranslations({ locale, namespace: "Eyebrows" });

  const sections = [1, 2, 3, 4, 5, 6, 7] as const;

  const crumbLd = breadcrumbJsonLd([
    { name: l === "ar" ? "الرئيسية" : "Home", url: `${SITE.url}/${l}` },
    { name: t("title"), url: `${SITE.url}/${l}/privacy` },
  ]);

  return (
    <Shell audience={audience} locale={l}>
      <JsonLd id="ld-privacy-crumb" data={crumbLd} />
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
                title={t(`section${i}Title`)}
                body={t(`section${i}Body`)}
              />
            ))}
          </article>
        </Container>
      </section>
    </Shell>
  );
}
