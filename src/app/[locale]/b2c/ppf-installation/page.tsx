import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Disclosure } from "@/components/ui/Disclosure";
import { PhoneIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/Button";
import { FaqSection } from "@/components/home/FaqSection";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import { PpfConfigurator } from "@/components/ppf/PpfConfigurator";
import { CarBlueprint } from "@/components/ppf/CarDiagram";
import { PpfPriceList } from "@/components/ppf/PpfPriceList";
import { PpfTrustStrip } from "@/components/ppf/PpfTrustStrip";
import { PpfFilmChoice } from "@/components/ppf/PpfFilmChoice";
import { PpfWarranty } from "@/components/ppf/PpfWarranty";
import { JsonLd } from "@/components/seo/JsonLd";
import { PPF_INSTALL_FAQ } from "@/data/faq";
import {
  FILMS,
  PRESET_PRICES_QAR,
  PRICES_UPDATED_AT,
  presetPriceList,
  quotePpf,
} from "@/data/ppfInstall";
import { EVIDENCE_CHECKED_AT, yearsPhrase } from "@/data/ppfEvidence";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/jsonld";
import { clampDescription, fitTitle, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { formatNumber, formatQar } from "@/lib/pricing";
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
    title: fitTitle(meta("ppfInstallTitle")),
    description: clampDescription(meta("ppfInstallDescription")),
    ...pageMeta(locale as Locale, PATH),
  };
}

const HOW = [1, 2, 3, 4, 5, 6] as const;
const PRACTICAL = ["time", "care", "extras", "pay"] as const;

export default async function PpfInstallationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const ar = l === "ar";
  const qar = (n: number) => formatQar(n, l);
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  const fullBody = PRESET_PRICES_QAR["full-body"];
  const fullFront = PRESET_PRICES_QAR["full-front"];
  const low = PRESET_PRICES_QAR["front-end"].sedan;
  const high =
    quotePpf({ body: "large-suv", coverage: "full-body", parts: [], film: "pro-plus" }).priceQar ??
    fullBody["large-suv"];
  const proYears = yearsPhrase(FILMS.find((f) => f.key === "pro")!.warrantyYears, l);
  const pageUrl = `${SITE.url}/${l}${PATH}`;
  const modified = [PRICES_UPDATED_AT, EVIDENCE_CHECKED_AT].sort().at(-1)!;
  const hours = { morning: SITE.hours.weekdaysMorning, evening: SITE.hours.weekdaysEvening };

  return (
    // The site-wide bubble would send a generic "car care products" message;
    // this page gets its own, asking about installation.
    <Shell audience="b2c" locale={l} floatingWhatsApp={false}>
      <JsonLd id="ld-business" data={localBusinessJsonLd(l)} />
      <JsonLd
        id="ld-webpage"
        data={webPageJsonLd({
          name: meta("ppfInstallTitle"),
          description: meta("ppfInstallDescription"),
          url: pageUrl,
          locale: l,
          dateModified: modified,
          lastReviewed: EVIDENCE_CHECKED_AT,
        })}
      />
      <JsonLd
        id="ld-service"
        data={serviceJsonLd({
          name: meta("ppfInstallTitle"),
          description: meta("ppfInstallDescription"),
          url: pageUrl,
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
          { name: nav("ppfInstall"), url: pageUrl },
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
        <Container className="grid grid-cols-1 items-center gap-10 pt-6 pb-8 sm:pt-10 sm:pb-12 lg:grid-cols-[minmax(0,37rem)_minmax(0,1fr)] lg:gap-16 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 py-1 text-caption font-semibold text-(--color-brand)">
              <span>
                {ar
                  ? "الموزع المعتمد لـ VTEK في قطر · أسعار ثابتة شاملة التركيب"
                  : "Authorised VTEK distributor · Fixed installed prices"}
              </span>
            </div>
            <h1 className="mt-3 max-w-[24ch] text-title font-bold text-balance sm:text-headline">
              {t("heading")}
            </h1>
            <p className="mt-2 max-w-[48ch] text-footnote text-white/75 sm:mt-3 sm:text-body">
              {t("subtitle")}
            </p>

            {/* Crawlable above-the-fold full-body starting prices */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/15 bg-white/[0.06] p-3 text-caption sm:grid-cols-3">
              <div>
                <span className="block text-[11px] text-white/65">
                  {ar ? "هيكل كامل (سيدان)" : "Full-Body · Sedan"}
                </span>
                <strong className="mt-0.5 block text-footnote font-bold tabular-nums text-(--color-brand)">
                  {qar(fullBody.sedan)}
                </strong>
                <span className="block text-[10px] text-white/60">
                  {ar
                    ? `${formatNumber(12, l)} منطقة · ضمان VTEK ${proYears}`
                    : `All 12 panels · ${proYears} VTEK warranty`}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-white/65">
                  {ar ? "هيكل كامل (SUV متوسطة)" : "Full-Body · Mid SUV"}
                </span>
                <strong className="mt-0.5 block text-footnote font-bold tabular-nums text-(--color-brand)">
                  {qar(fullBody.suv)}
                </strong>
                <span className="block text-[10px] text-white/60">
                  {ar ? `أقل من ${qar(5000)} شامل التركيب` : `Under ${qar(5000)} installed`}
                </span>
              </div>
              <div className="col-span-2 border-t border-white/10 pt-2 sm:col-span-1 sm:border-t-0 sm:border-s sm:border-white/10 sm:ps-3 sm:pt-0">
                <span className="block text-[11px] text-white/65">
                  {ar ? "هيكل كامل (SUV كبيرة)" : "Full-Body · Large SUV"}
                </span>
                <strong className="mt-0.5 block text-footnote font-bold tabular-nums text-white">
                  {qar(fullBody["large-suv"])}
                </strong>
                <span className="block text-[10px] text-white/60">
                  {ar
                    ? `الواجهة تبدأ من ${qar(low)} (جزئي) / ${qar(fullFront.sedan)} (كامل)`
                    : `Front kits: ${qar(low)} partial · ${qar(fullFront.sedan)} full`}
                </span>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <PpfConfigurator />
            </div>
            <p className="mt-4 border-t border-white/10 pt-3.5 text-caption text-white/70">
              {(["launchTrust1", "launchTrust2", "launchTrust3"] as const).map((k) => t(k)).join(" · ")}
            </p>
          </div>

          {/* Desktop only: the plan view that the quote sheet works on. */}
          <div aria-hidden className="hidden justify-self-end lg:block">
            <CarBlueprint className="h-[30rem]" />
          </div>
        </Container>
      </section>

      <PpfTrustStrip locale={l} />

      <PpfPriceList locale={l} />

      <PpfFilmChoice locale={l} />

      <section className="border-t border-(--color-border) py-8 lg:py-12">
        <Container>
          <SectionHeading title={t("howTitle")} />
          <ol className="mt-6 border-y border-(--color-border) lg:grid lg:grid-cols-6 lg:border-b-0">
            {HOW.map((i) => (
              <li
                key={i}
                className="flex gap-3 border-b border-(--color-border) py-3 last:border-b-0 lg:flex-col lg:gap-1.5 lg:border-b-0 lg:border-s lg:border-(--color-border) lg:px-4 lg:py-1 lg:first:border-s-0 lg:first:ps-0"
              >
                <span className="w-6 shrink-0 text-footnote font-semibold tabular-nums text-(--color-brand-deep)">
                  {formatNumber(i, l)}
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

      <PpfWarranty locale={l} />

      {/* Timing, care, inclusions and payment — folded so a phone scrolls past them. */}
      <section
        id="terms-and-aftercare"
        className="scroll-mt-16 border-t border-(--color-border) py-10 lg:py-14"
      >
        <Container>
          <SectionHeading title={t("practicalTitle")} subtitle={t("practicalSubtitle")} />
          <div className="mt-6 grid max-w-4xl gap-3">
            {PRACTICAL.map((k) => (
              <Disclosure key={k} title={t(`${k}Title`)}>
                <p className="text-footnote leading-relaxed text-(--color-text-muted) sm:text-body">
                  {t(`${k}Body`, hours)}
                </p>
              </Disclosure>
            ))}
          </div>
        </Container>
      </section>

      {/* Final call to action + where the car goes */}
      <section className="border-t border-(--color-border) py-10 lg:py-14">
        <Container>
          <div className="rounded-hero border border-(--color-border) bg-(--color-surface) p-6 sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <h2 className="text-title font-bold text-(--color-text) sm:text-headline">
                {t("ctaTitle")}
              </h2>
              <p className="mt-2 text-footnote text-(--color-text-muted) sm:text-body">
                {t("ctaBody")}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="#quote" className={buttonClasses("primary", "lg")}>
                {ar ? "احسب سعر سيارتك الآن" : "Build Your Instant Quote"}
              </Link>
              <a
                href={buildPpfEnquiryWhatsAppUrl(l)}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="service_area_cta"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "lg")}`}
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                {ar ? "محادثة فورية على واتساب" : "Chat on WhatsApp"}
              </a>
              <a href={`tel:${SITE.phoneE164}`} className={buttonClasses("secondary", "lg")}>
                <PhoneIcon className="h-4 w-4" />
                <span dir="ltr">{SITE.phone}</span>
              </a>
            </div>

            <div className="mt-8 border-t border-(--color-border) pt-6">
              <h3 className="text-body font-semibold text-(--color-text)">{t("areaTitle")}</h3>
              <p className="mt-1.5 max-w-3xl text-footnote leading-relaxed text-(--color-text-muted)">
                {t("areaBody")}
              </p>
              <p className="mt-2 max-w-3xl text-footnote leading-relaxed text-(--color-text-muted)">
                {t("areaGuarantee")}
              </p>
            </div>

            {/* Related internal links for crawlers and shoppers */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--color-border-soft) pt-4 text-caption">
              <span className="font-semibold text-(--color-text)">
                {ar ? "روابط وأدلة ذات صلة:" : "Related VTEK and Qatar PPF resources:"}
              </span>
              <Link href="/b2c/brands/vtek" className="text-(--color-link) hover:underline">
                {ar ? "كتالوج علامة VTEK" : "VTEK brand hub"}
              </Link>
              <Link href="/b2c/categories/film" className="text-(--color-link) hover:underline">
                {ar ? "أفلام الحماية وتظليل النوافذ" : "PPF & window tint films"}
              </Link>
              <Link href="/b2c/blog/ppf-cost-qatar" className="text-(--color-link) hover:underline">
                {ar ? "دليل أسعار PPF في قطر ٢٠٢٦" : "2026 Qatar PPF price guide"}
              </Link>
              <Link
                href="/b2c/blog/best-ppf-installers-doha-qatar-guide"
                className="text-(--color-link) hover:underline"
              >
                {ar ? "كيف تختار أفضل مركز تركيب PPF بالدوحة" : "How to compare Doha PPF installers"}
              </Link>
              <Link
                href="/b2c/blog/ppf-vs-ceramic-coating-qatar"
                className="text-(--color-link) hover:underline"
              >
                {ar ? "مقارنة PPF مع السيراميك في قطر" : "PPF vs ceramic coating in Qatar"}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <FaqSection locale={l} title={t("faqTitle")} items={PPF_INSTALL_FAQ} compact />

      <FloatingWhatsApp
        audience="b2c"
        locale={l}
        label={t("floatingLabel")}
        href={buildPpfEnquiryWhatsAppUrl(l)}
      />
    </Shell>
  );
}
