import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
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
    image: "/products/vertek/vertek-window-tint.webp",
    serviceType: "Window Tinting",
  },
  {
    key: "ceramic",
    image: "/products/autotriz/autotriz-ion-plus-ceramic-coating.webp",
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
        <JsonLd key={i} id={`ld-service-${i}`} data={ld} />
      ))}
      <JsonLd id="ld-faq" data={faqLd} />

      <section className="pb-8 pt-10 sm:pt-14 lg:pt-20">
        <Container>
          <SectionHeading
            as="h1"
            size="display"
            title={t("Services.heading")}
            subtitle={t("Services.subtitle")}
          />
          {/* The footer deep-links to #ppf / #tint / #ceramic / #detailing —
              the ids and the scroll offset below the sticky header must stay. */}
          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2">
            {SERVICES.map((s, i) => {
              const title = t(`Services.${s.key}Title`);
              return (
                <article
                  key={s.key}
                  id={s.key}
                  className="tile flex scroll-mt-20 flex-col overflow-hidden"
                >
                  <div className="relative m-4 mb-0 aspect-[16/10] overflow-hidden rounded-[12px] bg-(--color-tile-dark)">
                    <Image
                      src={s.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading={i < 2 ? "eager" : undefined}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-text-muted)">
                      {t("Eyebrows.workshop")}
                    </p>
                    <h2 className="mt-1.5 text-title font-semibold text-balance">
                      {title}
                    </h2>
                    <p className="mt-2 text-footnote text-(--color-text-muted)">
                      {t(`Services.${s.key}Desc`)}
                    </p>
                    <div className="mt-auto pt-5">
                      <WhatsAppButton
                        audience="b2c"
                        locale={l}
                        productName={title}
                        label={t("Services.book")}
                        emailFallbackLabel={t("Cta.preferEmail")}
                        showEmailFallback={false}
                        size="md"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-6 lg:py-8">
        <Container>
          <div className="rounded-hero bg-(--color-ink) p-8 text-white shadow-tile sm:p-10 lg:p-14">
            <h2 className="text-title font-semibold text-balance lg:text-headline">
              {t("Services.closingTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-body text-white/70">
              {t("Services.closingBody")}
            </p>
            <div className="mt-6">
              <WhatsAppButton
                audience="b2c"
                locale={l}
                label={t("Cta.inquireWhatsApp")}
                emailFallbackLabel={t("Cta.preferEmail")}
                showEmailFallback={false}
                size="lg"
                variant="light"
              />
            </div>
          </div>
        </Container>
      </section>

      <FaqSection locale={l} title={t("Faq.title")} subtitle={t("Faq.subtitle")} />
    </Shell>
  );
}
