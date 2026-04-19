import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Services" });
  return {
    title: t("title"),
    description: t("subtitle"),
    ...pageMeta(locale as Locale, "/b2c/services"),
  };
}

const SERVICES = [
  { key: "ppf", image: "/products/vertek/vertek-landcruiser-installation.webp" },
  { key: "tint", image: "/products/vertek/vertek-ppf-premium-protection.webp" },
  { key: "ceramic", image: "/products/autotriz/autotriz-ultimate-polish-302.webp" },
  { key: "detailing", image: "/products/briller/briller-wash-and-wax.webp" },
] as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale });

  return (
    <Shell audience="b2c" locale={l}>
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${t("Eyebrows.workshop")}`}
            title={t("Services.title")}
            subtitle={t("Services.subtitle")}
          />
          <div className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2">
            {SERVICES.map((s) => (
              <article
                key={s.key}
                className="rounded-3xl overflow-hidden border border-(--color-border) bg-(--color-surface) card-gold-hover"
              >
                <div className="relative aspect-[5/3]">
                  <Image
                    src={s.image}
                    alt={t(`Services.${s.key}Title`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  <h3 className="font-display text-2xl">
                    {t(`Services.${s.key}Title`)}
                  </h3>
                  <p className="text-sm text-(--color-text-muted) leading-relaxed">
                    {t(`Services.${s.key}Desc`)}
                  </p>
                  <WhatsAppButton
                    audience="b2c"
                    locale={l}
                    productName={t(`Services.${s.key}Title`)}
                    label={t("Services.cta")}
                    emailFallbackLabel={t("Cta.preferEmail")}
                    showEmailFallback={false}
                  />
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </Shell>
  );
}
