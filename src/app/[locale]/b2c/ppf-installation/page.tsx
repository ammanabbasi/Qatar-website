import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckIcon, ShieldCheckIcon, PinIcon, PhoneIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/Button";
import { FaqSection } from "@/components/home/FaqSection";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import { PpfConfigurator } from "@/components/ppf/PpfConfigurator";
import { CarBlueprint } from "@/components/ppf/CarDiagram";
import { PpfPriceList } from "@/components/ppf/PpfPriceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { PPF_INSTALL_FAQ } from "@/data/faq";
import { PRESET_PRICES_QAR, presetPriceList, quotePpf } from "@/data/ppfInstall";
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd, serviceJsonLd } from "@/lib/jsonld";
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
const SPECS = [1, 2, 3, 4] as const;
const CITIES = [
  "Doha",
  "Mesaimeer",
  "Al Rayyan",
  "Lusail",
  "West Bay",
  "The Pearl",
  "Al Wakrah",
  "Al Khor",
] as const;

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
    quotePpf({ body: "large-suv", coverage: "full-body", parts: [], film: "pro-plus" }).priceQar ??
    PRESET_PRICES_QAR["full-body"]["large-suv"];

  return (
    // The site-wide bubble would send a generic "car care products" message;
    // this page gets its own, asking about installation.
    <Shell audience="b2c" locale={l} floatingWhatsApp={false}>
      <JsonLd id="ld-business" data={localBusinessJsonLd(l)} />
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

      <section
        id="quote"
        className="relative isolate scroll-mt-12 overflow-hidden bg-(--color-hero-dark) text-white"
      >
        {/* Blueprint grid, fading out toward the edges. */}
        <div
          aria-hidden
          className="ppf-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(90%_100%_at_75%_30%,black,transparent_75%)]"
        />
        <Container className="grid grid-cols-1 items-center gap-10 pt-6 pb-8 sm:pt-10 sm:pb-12 lg:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] lg:gap-16 lg:py-16">
          <div>
            <p className="flex items-center gap-2.5 ppf-mono text-caption uppercase tracking-[0.14em] text-(--color-brand)">
              <span aria-hidden className="h-px w-5 bg-(--color-brand)" />
              {t("eyebrow")}
            </p>
            <h1 className="mt-2.5 max-w-[22ch] text-title font-bold text-balance sm:text-headline">
              {t("heading")}
            </h1>
            <p className="mt-2 max-w-[44ch] text-footnote text-white/70 sm:mt-3 sm:text-body">
              {t("subtitle")}
            </p>
            <div className="mt-5 sm:mt-7">
              <PpfConfigurator />
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
              {(["launchTrust1", "launchTrust2", "launchTrust3"] as const).map((k) => (
                <li key={k} className="flex items-start gap-1.5 text-caption leading-snug text-white/65">
                  <CheckIcon className="mt-px h-3.5 w-3.5 shrink-0 text-(--color-brand)" />
                  {t(k)}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop only: the plan view that the quote sheet works on. */}
          <div aria-hidden className="hidden justify-self-end lg:block">
            <div className="ppf-grid relative flex h-[34rem] w-[24rem] items-center justify-center overflow-hidden rounded-hero border border-white/10 bg-white/[0.02]">
              <span className="ppf-crop start-4 top-4 border-s-2 border-t-2 rtl:border-e-2 rtl:border-s-0" />
              <span className="ppf-crop end-4 top-4 border-e-2 border-t-2 rtl:border-s-2 rtl:border-e-0" />
              <span className="ppf-crop start-4 bottom-4 border-b-2 border-s-2 rtl:border-e-2 rtl:border-s-0" />
              <span className="ppf-crop end-4 bottom-4 border-b-2 border-e-2 rtl:border-s-2 rtl:border-e-0" />
              <span className="ppf-ruler ppf-ruler-l" />
              <span className="ppf-ruler ppf-ruler-r" />
              <span className="absolute inset-x-0 top-5 text-center ppf-mono text-caption uppercase tracking-[0.14em] text-white/45">
                {t("front")}
              </span>
              <CarBlueprint className="h-[27rem]" />
              <span className="absolute inset-x-0 bottom-5 text-center ppf-mono text-caption uppercase tracking-[0.14em] text-white/45">
                {t("rear")}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <PpfPriceList locale={l} />

      {/* Qatar Climate Defense & Technical Specs */}
      <section className="border-t border-(--color-border) bg-(--color-surface-sunken) py-12 lg:py-16">
        <Container>
          <SectionHeading
            title={t("specsTitle")}
            subtitle={t("specsSubtitle")}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SPECS.map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-tile border border-(--color-border) bg-(--color-surface) p-5 shadow-tile transition-all duration-200 hover:shadow-card"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-brand)/10 text-(--color-brand-deep)">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-footnote font-semibold text-(--color-text)">
                  {t(`specs${i}Title`)}
                </h3>
                <p className="mt-1.5 text-caption leading-relaxed text-(--color-text-muted)">
                  {t(`specs${i}Body`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-caption text-(--color-text-muted)">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-(--color-brand)" />
              <span className="font-medium text-(--color-text)">
                {l === "ar"
                  ? "معايير VTEK TPU الأليفاتية الأصلية (100% خالية من PVC)"
                  : "Genuine VTEK Aliphatic TPU Standard (100% PVC-Free)"}
              </span>
            </div>
            <p className="text-caption">
              {l === "ar"
                ? "سماكة من 7.5 إلى 8.0 مل · لمعان فائق 99% · مقاومة للحرارة حتى 105°م · لا يصفر ولا يتشقق"
                : "7.5–8.0 mil thickness · 99% optical gloss · Heat stable to 105°C · Non-yellowing formula"}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8 lg:py-12">
        <Container>
          <SectionHeading title={t("howTitle")} />
          <ol className="mt-6 border-y border-(--color-border) lg:grid lg:grid-cols-6 lg:border-b-0">
            {HOW.map((i) => (
              <li
                key={i}
                className="flex gap-3 border-b border-(--color-border) py-3 last:border-b-0 lg:flex-col lg:gap-1.5 lg:border-b-0 lg:border-s lg:border-(--color-border) lg:px-4 lg:py-1 lg:first:border-s-0 lg:first:ps-0"
              >
                <span className="w-6 shrink-0 ppf-mono text-footnote font-semibold tabular-nums text-(--color-brand-deep)">
                  {String(i).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-footnote font-semibold">{t(`how${i}Title`)}</h3>
                  <p className="mt-0.5 text-caption text-(--color-text-muted)">{t(`how${i}Body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-8 lg:py-12">
        <Container>
          <SectionHeading title={t("warrantyTitle")} />
          <div className="mt-6 grid divide-y divide-(--color-border) overflow-hidden rounded-tile border border-(--color-border) bg-(--color-surface) md:grid-cols-2 md:divide-x md:divide-y-0">
            {(["Film", "Work"] as const).map((k) => (
              <div key={k} className="flex gap-3.5 p-5">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-brand-deep)" />
                <div>
                  <h3 className="text-body font-semibold">{t(`warranty${k}Title`)}</h3>
                  <p className="mt-1 text-footnote text-(--color-text-muted)">{t(`warranty${k}Body`)}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Local Doha Service Area & Installation Partner Network */}
      <section className="border-t border-(--color-border) py-10 lg:py-14">
        <Container>
          <div className="rounded-hero border border-(--color-border) bg-(--color-surface) p-6 sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-(--color-brand-deep)">
                <PinIcon className="h-4 w-4" />
                {l === "ar" ? "نطاق الخدمة في قطر" : "Service Area in Qatar"}
              </p>
              <h2 className="mt-2 text-title font-bold text-(--color-text) sm:text-headline">
                {t("serviceAreaTitle")}
              </h2>
              <p className="mt-2 text-footnote text-(--color-text-muted) sm:text-body">
                {t("serviceAreaSubtitle")}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-sunken) px-3 py-1.5 text-caption font-medium text-(--color-text)"
                >
                  <PinIcon className="h-3 w-3 text-(--color-brand-deep)" />
                  {c}
                </span>
              ))}
            </div>

            <p className="mt-4 text-caption leading-relaxed text-(--color-text-muted)">
              {t("serviceAreaGuarantee")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-(--color-border) pt-6">
              <Link
                href="#quote"
                className={buttonClasses("primary", "md")}
              >
                {l === "ar" ? "احسب سعر سيارتك الآن" : "Build Your Instant Quote"}
              </Link>
              <a
                href={buildPpfEnquiryWhatsAppUrl(l)}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="service_area_cta"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "md")}`}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {l === "ar" ? "محادثة فورية على واتساب" : "Chat on WhatsApp"}
              </a>
              <a
                href={`tel:${SITE.phoneE164}`}
                className={buttonClasses("secondary", "md")}
              >
                <PhoneIcon className="h-4 w-4" />
                <span>{SITE.phone}</span>
              </a>
            </div>
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
