import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LegalSection } from "@/components/legal/LegalSection";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Terms" });
  return {
    title: t("title"),
    description: t("subtitle"),
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
  const e = await getTranslations({ locale, namespace: "Eyebrows" });

  const sections = [1, 2, 3, 4, 5, 6, 7, 8] as const;

  return (
    <Shell audience={audience} locale={l}>
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${e("legal")}`}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-(--color-text-muted)">
            {t("lastUpdated")}
          </p>

          <article className="mt-10 max-w-3xl text-(--color-text-muted) leading-relaxed space-y-10">
            <p className="text-base">{t("intro")}</p>
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
