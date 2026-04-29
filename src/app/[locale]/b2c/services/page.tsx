import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqSection } from "@/components/home/FaqSection";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { serviceJsonLd, faqJsonLd } from "@/lib/jsonld";
import { FAQ } from "@/data/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: meta("servicesTitle"),
    description: meta("servicesDescription"),
    ...pageMeta(locale as Locale, "/b2c/services"),
  };
}

const SERVICES = [
  {
    key: "ppf",
    image: "/products/vertek/vertek-landcruiser-installation.webp",
    serviceType: "Paint Protection Film Installation",
  },
  {
    key: "tint",
    image: "/products/vertek/vertek-ppf-premium-protection.webp",
    serviceType: "Window Tinting",
  },
  {
    key: "ceramic",
    image: "/products/autotriz/autotriz-ultimate-polish-302.webp",
    serviceType: "Ceramic Coating Application",
  },
  {
    key: "detailing",
    image: "/products/briller/briller-wash-and-wax.webp",
    serviceType: "Auto Detailing",
  },
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

  // One Service JSON-LD per service. `provider: { @id }` points back to the
  // AutomotiveBusiness emitted on the home + contact pages — Google reconciles
  // them across the entity graph. Service JSON-LD is the strongest signal we
  // can give for "PPF installation Doha" / "ceramic coating Qatar" intents.
  const servicesUrl = `${SITE.url}/${l}/b2c/services`;
  const servicesLd = SERVICES.map((s) =>
    serviceJsonLd({
      name: t(`Services.${s.key}Title`),
      description: t(`Services.${s.key}Desc`),
      url: servicesUrl,
      serviceType: s.serviceType,
      image: `${SITE.url}${s.image}`,
    }),
  );
  const faqLd = faqJsonLd(
    FAQ.map((f) => ({ question: f.q[l], answer: f.a[l] })),
  );

  return (
    <Shell audience="b2c" locale={l}>
      {servicesLd.map((ld, i) => (
        <Script
          key={i}
          id={`ld-service-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
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
      <FaqSection
        locale={l}
        eyebrow={t("Eyebrows.faq")}
        title={t("Faq.title")}
        subtitle={t("Faq.subtitle")}
      />
    </Shell>
  );
}
