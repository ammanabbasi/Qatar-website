import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DealerPitch } from "@/components/home/DealerPitch";
import { TrustBadges } from "@/components/home/TrustBadges";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: meta("becomeDealerTitle"),
    description: meta("becomeDealerDescription"),
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
  const t = await getTranslations({ locale, namespace: "Nav" });
  const e = await getTranslations({ locale, namespace: "Eyebrows" });

  return (
    <Shell audience="b2b" locale={l}>
      <section className="pt-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${e("partnership")}`}
            title={t("becomeDealer")}
          />
        </Container>
      </section>
      <DealerPitch locale={l} />
      <TrustBadges />
    </Shell>
  );
}
