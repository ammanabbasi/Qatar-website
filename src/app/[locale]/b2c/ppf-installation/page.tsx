import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { FaqSection } from "@/components/home/FaqSection";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import { PpfConfigurator } from "@/components/ppf/PpfConfigurator";
import { PpfPriceList } from "@/components/ppf/PpfPriceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { PPF_INSTALL_FAQ } from "@/data/faq";
import { PRESET_PRICES_QAR, presetPriceList, quotePpf } from "@/data/ppfInstall";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { formatQar } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { buildPpfEnquiryWhatsAppUrl } from "@/lib/whatsapp";

const PATH = "/b2c/ppf-installation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: meta("ppfInstallTitle"),
    description: meta("ppfInstallDescription"),
    ...pageMeta(locale as Locale, PATH),
  };
}

const HOW = [1, 2, 3, 4, 5, 6] as const;

export default async function PpfInstallationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  const low = PRESET_PRICES_QAR["front-end"].sedan;
  const high =
    quotePpf({ body: "large-suv", coverage: "full-body", parts: [], film: "ultimate" }).priceQar ??
    PRESET_PRICES_QAR["full-body"]["large-suv"];

  return (
    // The site-wide bubble would send a generic "car care products" message;
    // this page gets its own, asking about installation.
    <Shell audience="b2c" locale={l} floatingWhatsApp={false}>
      <JsonLd
        id="ld-service"
        data={serviceJsonLd({
          name: meta("ppfInstallTitle"),
          description: meta("ppfInstallDescription"),
          url: `${SITE.url}/${l}${PATH}`,
          serviceType: "Paint protection film installation",
          lowPriceQar: low,
          highPriceQar: high,
          prices: presetPriceList(),
          locale: l,
          termsUrl: `${SITE.url}/${l}/terms`,
        })}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbJsonLd([
          { name: nav("home"), url: `${SITE.url}/${l}` },
          { name: nav("ppfInstall"), url: `${SITE.url}/${l}${PATH}` },
        ])}
      />
      {/* FAQPage schema must sit on the same page as the rendered Q/A. */}
      <JsonLd
        id="ld-faq"
        data={faqJsonLd(PPF_INSTALL_FAQ.map((e) => ({ question: e.q[l], answer: e.a[l] })))}
      />

      <PageHero eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")}>
        <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {(["heroPoint1", "heroPoint2", "heroPoint3", "heroPoint4"] as const).map((k) => (
            <li key={k} className="flex items-center gap-2 text-footnote text-white/80">
              <CheckIcon className="h-4 w-4 shrink-0 text-(--color-brand)" />
              {t(k, { price: formatQar(low, l) })}
            </li>
          ))}
        </ul>
        <a
          href="#quote"
          className="mt-8 inline-flex h-12 items-center rounded-pill bg-(--color-brand) px-7 text-body font-medium text-(--color-ink) transition-colors duration-200 hover:bg-(--color-brand-hover)"
        >
          {t("heroCta")}
        </a>
      </PageHero>

      <section id="quote" className="scroll-mt-20 py-10 lg:py-14">
        <Container>
          <SectionHeading title={t("configTitle")} subtitle={t("configSubtitle")} />
          <div className="mt-8">
            <PpfConfigurator />
          </div>
        </Container>
      </section>

      <PpfPriceList locale={l} />

      <section className="py-10 lg:py-14">
        <Container>
          <SectionHeading title={t("howTitle")} subtitle={t("howSubtitle")} />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOW.map((i) => (
              <li key={i} className="tile flex gap-4 p-5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-brand)/15 text-footnote font-bold text-(--color-brand-deep)">
                  {i}
                </span>
                <div className="min-w-0">
                  <h3 className="text-body font-semibold">{t(`how${i}Title`)}</h3>
                  <p className="mt-1 text-footnote text-(--color-text-muted)">{t(`how${i}Body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <SectionHeading title={t("warrantyTitle")} />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {(["Film", "Work"] as const).map((k) => (
              <div key={k} className="tile flex gap-4 p-6">
                <ShieldCheckIcon className="h-7 w-7 shrink-0 text-(--color-brand-deep)" />
                <div>
                  <h3 className="text-body-lg font-semibold">{t(`warranty${k}Title`)}</h3>
                  <p className="mt-2 text-footnote text-(--color-text-muted)">{t(`warranty${k}Body`)}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FaqSection locale={l} title={t("faqTitle")} items={PPF_INSTALL_FAQ} />

      <FloatingWhatsApp
        audience="b2c"
        locale={l}
        label={t("floatingLabel")}
        href={buildPpfEnquiryWhatsAppUrl(l)}
      />
    </Shell>
  );
}
