import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShieldCheckIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
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
const SPECS = [1, 2, 3, 4] as const;

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

  const low = PRESET_PRICES_QAR["front-end"].sedan;
  const high =
    quotePpf({ body: "large-suv", coverage: "full-body", parts: [], film: "pro-plus" }).priceQar ??
    PRESET_PRICES_QAR["full-body"]["large-suv"];

  const filmSpecRows = [
    {
      name: "Weather Armor PRO",
      slug: "vtek-ppf-weather-armor-pro",
      polymer: ar ? "TPU أليفاتي بصري (خالي من PVC)" : "Optical Aliphatic TPU (100% PVC-Free)",
      thickness: "7.5 mil (190 µm)",
      finish: ar
        ? "لمعان عالي الوضوح (99% GU) · معالجة ذاتية بالحرارة"
        : "High-Clarity Gloss (99% GU) · Heat Self-Healing",
      fullBodyPrice: ar
        ? `سيدان ${qar(3999)} · SUV متوسطة ${qar(4799)} · SUV كبيرة ${qar(5499)}`
        : `Sedan ${qar(3999)} · Mid SUV ${qar(4799)} · Large SUV ${qar(5499)}`,
      warranty: ar ? "١٠ سنوات (ضمان VTEK إلكتروني)" : "10 Years (VTEK NFC e-Warranty)",
    },
    {
      name: "Weather Armor PRO PLUS",
      slug: "vtek-ppf-weather-armor-pro-plus",
      polymer: ar ? "TPU أليفاتي عالي الكثافة" : "High-Density Aliphatic TPU",
      thickness: "8.0 mil (203 µm)",
      finish: ar
        ? "لمعان فائق + طبقة علوية طاردة للماء والأملاح"
        : "Ultra-Gloss + Hydrophobic Anti-Stain Topcoat",
      fullBodyPrice: ar
        ? `سيدان ${qar(4799)} · SUV متوسطة ${qar(5699)} · SUV كبيرة ${qar(6499)}`
        : `Sedan ${qar(4799)} · Mid SUV ${qar(5699)} · Large SUV ${qar(6499)}`,
      warranty: ar ? "١٢ سنة (ضمان VTEK إلكتروني)" : "12 Years (VTEK NFC e-Warranty)",
    },
    {
      name: "Weather Armor MATTE",
      slug: "vtek-ppf-weather-armor-matte",
      polymer: ar ? "TPU أليفاتي بلمسة ساتان مطفية" : "Aliphatic Satin-Matte TPU",
      thickness: "8.0 mil (200 µm)",
      finish: ar
        ? "مظهر ساتان مطفي غير عاكس · معالجة ذاتية"
        : "Non-Reflective Factory Satin Matte · Self-Healing",
      fullBodyPrice: ar
        ? `سيدان ${qar(4799)} · SUV متوسطة ${qar(5699)} · SUV كبيرة ${qar(6499)}`
        : `Sedan ${qar(4799)} · Mid SUV ${qar(5699)} · Large SUV ${qar(6499)}`,
      warranty: ar ? "٥ سنوات (ضمان VTEK إلكتروني)" : "5 Years (VTEK NFC e-Warranty)",
    },
    {
      name: "Weather Armor PRISM",
      slug: "vtek-ppf-weather-armor-prism",
      polymer: ar ? "TPU ملوّن (Polycaprolactone)" : "Polycaprolactone Color-Change TPU",
      thickness: "8.5 mil (215 µm)",
      finish: ar
        ? "تغيير لون السيارة (معدني / لؤلؤي / لامع) مع حماية PPF"
        : "Metallic, Pearl & Gloss Color-Change + Impact Defense",
      fullBodyPrice: ar ? "يُسعَّر حسب السيارة واللون عبر واتساب" : "Custom quote per vehicle & color on WhatsApp",
      warranty: ar ? "٥ سنوات (ضمان VTEK إلكتروني)" : "5 Years (VTEK NFC e-Warranty)",
    },
  ];

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
        <Container className="grid grid-cols-1 items-center gap-10 pt-6 pb-8 sm:pt-10 sm:pb-12 lg:grid-cols-[minmax(0,37rem)_minmax(0,1fr)] lg:gap-16 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 py-1 text-caption font-semibold text-(--color-brand)">
              <span>
                {ar
                  ? "الموزع الحصري لـ VTEK في قطر · أسعار شاملة التركيب والضمان"
                  : "Official Qatar VTEK Distributor · Fixed Installed Prices"}
              </span>
            </div>
            <h1 className="mt-3 max-w-[24ch] text-title font-bold text-balance sm:text-headline">
              {t("heading")}
            </h1>
            <p className="mt-2 max-w-[48ch] text-footnote text-white/75 sm:mt-3 sm:text-body">
              {t("subtitle")}
            </p>

            {/* Crawlable Above-the-Fold Full-Body vs Partial Starting Price Summary */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/15 bg-white/[0.06] p-3 text-caption sm:grid-cols-3">
              <div>
                <span className="block text-[11px] text-white/65">
                  {ar ? "هيكل كامل (سيدان)" : "Full-Body · Sedan"}
                </span>
                <strong className="mt-0.5 block text-footnote font-bold tabular-nums text-(--color-brand)">
                  {qar(3999)}
                </strong>
                <span className="block text-[10px] text-white/60">
                  {ar ? "١٢ منطقة · ضمان ١٠ سنوات" : "All 12 panels · 10-yr TPU"}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-white/65">
                  {ar ? "هيكل كامل (SUV متوسطة)" : "Full-Body · Mid SUV"}
                </span>
                <strong className="mt-0.5 block text-footnote font-bold tabular-nums text-(--color-brand)">
                  {qar(4799)}
                </strong>
                <span className="block text-[10px] text-white/60">
                  {ar ? "أقل من 5,000 ر.ق شامل التركيب" : "Under QAR 5,000 installed"}
                </span>
              </div>
              <div className="col-span-2 border-t border-white/10 pt-2 sm:col-span-1 sm:border-t-0 sm:border-s sm:border-white/10 sm:ps-3 sm:pt-0">
                <span className="block text-[11px] text-white/65">
                  {ar ? "هيكل كامل (SUV كبيرة)" : "Full-Body · Large SUV"}
                </span>
                <strong className="mt-0.5 block text-footnote font-bold tabular-nums text-white">
                  {qar(5499)}
                </strong>
                <span className="block text-[10px] text-white/60">
                  {ar
                    ? `الواجهة تبدأ من ${qar(899)} (جزئي) / ${qar(1599)} (كامل)`
                    : `Front kits: ${qar(899)} partial · ${qar(1599)} full`}
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

      <PpfPriceList locale={l} />

      {/* Qatar Climate Defense & Verified VTEK Film Specifications Table */}
      <section
        id="film-specs"
        className="scroll-mt-16 border-t border-(--color-border) bg-(--color-surface-sunken) py-12 lg:py-16"
      >
        <Container>
          <SectionHeading
            title={t("specsTitle")}
            subtitle={t("specsSubtitle")}
          />
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {SPECS.map((i) => (
              <div key={i} className="border-t border-(--color-border) pt-4">
                <h3 className="text-footnote font-semibold text-(--color-text)">
                  {t(`specs${i}Title`)}
                </h3>
                <p className="mt-1.5 text-caption leading-relaxed text-(--color-text-muted)">
                  {t(`specs${i}Body`)}
                </p>
              </div>
            ))}
          </div>

          {/* Structured Film Specifications & Warranty Comparison Table */}
          <div className="mt-10 overflow-x-auto rounded-tile border border-(--color-border) bg-(--color-surface)">
            <table className="w-full min-w-[44rem] border-collapse text-start text-caption tabular-nums">
              <caption className="px-4 py-3 text-start text-caption text-(--color-text-muted) sm:px-6">
                {ar
                  ? "مواصفات أفلام VTEK Weather Armor المعتمدة للتركيب في قطر — جميعها مصنوعة من البولي يوريثان الحراري الأليفاتي (TPU) الخالي تماماً من PVC أو TPH."
                  : "Verified VTEK Weather Armor TPU film specifications installed in Doha — 100% PVC-free aliphatic polyurethane engineered for Gulf UV and 50°C+ summer heat."}
              </caption>
              <thead>
                <tr className="border-y border-(--color-border) bg-(--color-bg)/60">
                  <th scope="col" className="px-4 py-3 text-start font-semibold sm:px-5">
                    {ar ? "فئة فيلم VTEK" : "VTEK Film Line"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "مادة التصنيع" : "Base Polymer"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "السماكة" : "Thickness"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "اللمسة النهائية والخصائص" : "Finish & Topcoat"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "سعر التركيب الكامل للهيكل" : "Full-Body Installed Price"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "ضمان المصنع المكتوب" : "Written Film Warranty"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border-soft)">
                {filmSpecRows.map((row) => (
                  <tr key={row.slug} className="hover:bg-(--color-bg)/50">
                    <th scope="row" className="px-4 py-3 text-start font-semibold sm:px-5">
                      <Link
                        href={`/b2c/products/${row.slug}`}
                        className="text-(--color-link) hover:underline"
                      >
                        {row.name}
                      </Link>
                    </th>
                    <td className="px-3 py-3 text-(--color-text)">{row.polymer}</td>
                    <td className="px-3 py-3 font-semibold whitespace-nowrap text-(--color-text)">
                      {row.thickness}
                    </td>
                    <td className="px-3 py-3 text-(--color-text-muted)">{row.finish}</td>
                    <td className="px-3 py-3 font-semibold text-(--color-text)">
                      {row.fullBodyPrice}
                    </td>
                    <td className="px-3 py-3 font-semibold text-(--color-brand-deep)">
                      {row.warranty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-caption text-(--color-text-muted)">
            <div>
              <span className="font-semibold text-(--color-text)">{t("specsBarTitle")}: </span>
              <span>{t("specsBarBody")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-caption font-semibold">
              <a
                href="https://www.vtekfilms.com/weather-armor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--color-link) hover:underline"
              >
                {ar ? "مواصفات المصنع الرسمية (vtekfilms.com) ↗" : "Official VTEK Specs (vtekfilms.com) ↗"}
              </a>
              <span>·</span>
              <a
                href="https://nfc.vtekfilms.com/verify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--color-link) hover:underline"
              >
                {ar ? "بوابة التحقق من الضمان الإلكتروني NFC ↗" : "Verify NFC e-Warranty Portal ↗"}
              </a>
            </div>
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

      {/* Verified Credentials, Dual-Role Transparency & Reconciled Dual Warranties */}
      <section id="credentials" className="scroll-mt-16 py-8 lg:py-12">
        <Container>
          <SectionHeading
            title={t("warrantyTitle")}
            subtitle={
              ar
                ? "شفافية كاملة حول دور شركة ABK كموزع رسمي ودور المركز الشريك المعتمد في الدوحة، مع توثيق الضمانين المكتوبين."
                : "Complete clarity on how ABK's official distributor supply chain, VTEK-authorised Doha partner studios, and dual written warranties protect your vehicle."
            }
          />
          <div className="mt-6 grid divide-y divide-(--color-border) overflow-hidden rounded-tile border border-(--color-border) bg-(--color-surface) md:grid-cols-2 md:divide-x md:divide-y-0">
            {(["Film", "Work"] as const).map((k) => (
              <div key={k} className="flex gap-3.5 p-5 sm:p-6">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-brand-deep)" />
                <div>
                  <h3 className="text-body font-semibold">{t(`warranty${k}Title`)}</h3>
                  <p className="mt-1.5 text-footnote leading-relaxed text-(--color-text-muted)">
                    {t(`warranty${k}Body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Role Clarity + Genuine Installation Photo + Manufacturer Proof Links */}
          <div className="mt-6 grid items-center gap-6 rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <h3 className="text-title-sm font-bold text-(--color-text)">
                {ar
                  ? "ماذا يعني «موزع رسمي» و«مركز تركيب شريك معتمد»؟"
                  : "How Our Verified Distributor + Authorised Partner Studio Model Works"}
              </h3>
              <ul className="space-y-3 text-footnote text-(--color-text-muted)">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>
                    <strong className="font-semibold text-(--color-text)">
                      {ar
                        ? "دور ABK للتجارة والخدمات (الموزع الحصري في قطر): "
                        : "ABK Trading & Service's Role (Official Qatar VTEK Distributor): "}
                    </strong>
                    {ar
                      ? "تعمل ABK من معرضها ومستودعها المكيّف في مسيمير (معرض رقم ٢، مبنى ١٣٠٦، شارع ٧٠، منطقة ٥٦، الدوحة). نستورد رولات VTEK Weather Armor الأصلية بأرقام تشغيلات متسلسلة مباشرة من المصنع، ونخصص الرول لسيارتك، وندير موعدك، ونجري فحص الجودة النهائي قبل التسليم، ونصدر ضمان التركيب لمدة ١٢ شهراً."
                      : "Operating from Showroom no. 2, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, ABK is VTEK's official importer and distributor in Qatar. We supply sealed, batch-numbered VTEK rolls directly from our climate-controlled warehouse, manage your booking, inspect the completed car at handover, and issue your 12-month fitting guarantee."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>
                    <strong className="font-semibold text-(--color-text)">
                      {ar
                        ? "دور مركز التركيب الشريك المعتمد في الدوحة: "
                        : "VTEK-Authorised Partner Studio's Role (Clean-Booth Fitting in Doha): "}
                    </strong>
                    {ar
                      ? "يتم التطبيق الفعلي داخل الدوحة بأيدي فنيين مدرّبين ومعتمدين على معايير VTEK في كبائن معزولة عن الغبار ومكيّفة، باستخدام برنامج القص الإلكتروني VTEK VPC 2.0 لتفصيل القوالب بدقة دون ملامسة المشرط لطلاء سيارتك."
                      : "Physical installation is executed in Doha by VTEK-trained technicians inside a dust-filtered, climate-controlled partner clean booth using VTEK VPC 2.0 computer-plotted software templates — ensuring zero blade contact on your paintwork and wrapped edges wherever panel tolerances allow."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>
                    <strong className="font-semibold text-(--color-text)">
                      {ar
                        ? "التحقق من شهادة الضمان الإلكتروني (٥ إلى ١٥ سنة): "
                        : "Verifiable NFC e-Warranty Registration (5 to 15 Years Explained): "}
                    </strong>
                    {ar
                      ? "تغطي منظومة ضمان VTEK العالمية من ٥ إلى ١٥ سنة حسب الفئة: في باقاتنا المعتمدة يحصل فيلم PRO على ١٠ سنوات، وPRO PLUS على ١٢ سنة، وMATTE وPRISM على ٥ سنوات (بينما يتوفر فيلم Weather Armor ULTIMATE بضمان ١٥ سنة بالطلب الخاص أو رولات الجملة). يُسجَّل رقم UID للرول باسم سيارتك على بوابة VTEK السحابية."
                      : "VTEK's global Weather Armor warranty chart spans 5 to 15 years: our 4 installed packages carry written warranties of 10 years (PRO), 12 years (PRO PLUS), and 5 years (MATTE & PRISM), while 15-year Weather Armor ULTIMATE is available by special roll order. Every job's roll UID is registered in VTEK's NFC Auto Tech cloud portal."}
                  </span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-caption font-semibold">
                <a
                  href="https://www.vtekfilms.com/warranty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-(--color-link) hover:border-(--color-brand)"
                >
                  {ar ? "شروط ضمان VTEK الرسمية ↗" : "Official VTEK Warranty Terms ↗"}
                </a>
                <a
                  href="https://nfc.vtekfilms.com/verify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-(--color-link) hover:border-(--color-brand)"
                >
                  {ar ? "التحقق من الضمان عبر nfc.vtekfilms.com ↗" : "Check UID on nfc.vtekfilms.com/verify ↗"}
                </a>
                <a
                  href="https://www.vtekfilms.com/vpc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-(--color-link) hover:border-(--color-brand)"
                >
                  {ar ? "تقنية القص الإلكتروني VTEK VPC 2.0 ↗" : "VTEK VPC 2.0 Precision Cut Software ↗"}
                </a>
              </div>
            </div>

            <figure className="overflow-hidden rounded-tile border border-(--color-border) bg-(--color-bg)">
              <Image
                src="/products/vertek/vertek-landcruiser-installation.webp"
                alt={
                  ar
                    ? "تركيب فيلم حماية الطلاء VTEK Weather Armor على سيارة تويوتا لاند كروزر داخل كابينة نظيفة في الدوحة، قطر"
                    : "VTEK Weather Armor aliphatic TPU paint protection film installation on a Toyota Land Cruiser in a Doha clean booth"
                }
                width={720}
                height={480}
                className="h-64 w-full object-cover sm:h-72"
              />
              <figcaption className="px-4 py-3 text-caption text-(--color-text-muted)">
                {ar
                  ? "تطبيق فيلم حماية الطلاء VTEK Weather Armor على تويوتا لاند كروزر (فئة SUV كبيرة — 5,499 ر.ق للهيكل الكامل بفيلم PRO) داخل كابينة تركيب معزولة."
                  : "Clean-booth VTEK Weather Armor TPU installation on a Toyota Land Cruiser (Large SUV Full-Body PRO package: QAR 5,499 installed)."}
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* Installation Timeline, Aftercare, Additional Charges & Booking Policy */}
      <section
        id="terms-and-aftercare"
        className="scroll-mt-16 border-t border-(--color-border) bg-(--color-surface-sunken) py-10 lg:py-14"
      >
        <Container>
          <SectionHeading
            title={
              ar
                ? "مدة التركيب، العناية بعد التسليم، الرسوم الإضافية وشروط الحجز"
                : "Installation Time, Doha Aftercare, Additional Charges & Booking Terms"
            }
            subtitle={
              ar
                ? "كل ما تحتاج معرفته قبل تسليم سيارتك — بوضوح تام ودون أي رسوم مخفية."
                : "Clear, upfront answers on turnaround time, post-install washing in Qatar, optional prep work, payment, and free 48-hour cancellation."
            }
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
              <h3 className="text-body font-bold text-(--color-text)">
                {ar ? "١. مدة التركيب والتجفيف لكل باقة" : "1. Installation Turnaround & Curing Time"}
              </h3>
              <p className="mt-2 text-footnote leading-relaxed text-(--color-text-muted)">
                {ar
                  ? "تستغرق باقة الواجهة الأساسية الجزئية من ٥ إلى ٧ ساعات (تسليم في نفس اليوم). وتستغرق الواجهة الكاملة يوماً كاملاً (٢٤ ساعة). أما تغليف الهيكل بالكامل (١٢ منطقة) فيستغرق من يومين إلى ٣ أيام شاملةً فترة التثبيت الحراري وفحص الحواف قبل التسليم."
                  : "Front-End Essential partial kits take 5–7 hours (same-day handover). Full Front packages take 1 full day. Full-Body 12-panel wraps take 2 to 3 days, including indoor climate-controlled adhesive curing and ABK's pre-handover edge inspection."}
              </p>
            </div>

            <div className="rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
              <h3 className="text-body font-bold text-(--color-text)">
                {ar ? "٢. إرشادات الغسيل والعناية بعد التركيب في قطر" : "2. Post-Installation Aftercare in Doha's Climate"}
              </h3>
              <p className="mt-2 text-footnote leading-relaxed text-(--color-text-muted)">
                {ar
                  ? "انتظر من ٤٨ إلى ٧٢ ساعة قبل أول غسلة للسيارة حتى يجف محلول التركيب تماماً وتثبت الحواف الملفوفة. بعد ذلك، اغسل السيارة يدوياً بشامبو متعادل الحموضة (pH-neutral) مثل Autotriz Rich Foam، وابتعد بمضخة الماء المضغوط مسافة ٤٠ سم على الأقل عن حواف الفيلم."
                  : "Wait 48 to 72 hours before the first wash so slip solution fully evaporates and wrapped edges bond. Thereafter, hand-wash using a pH-neutral shampoo (such as Autotriz Rich Foam) and keep high-pressure wash nozzles at least 40 cm away from film edges."}
              </p>
            </div>

            <div className="rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
              <h3 className="text-body font-bold text-(--color-text)">
                {ar ? "٣. ما المشمول وما قد يُضاف؟ (لا رسوم مخفية)" : "3. What's Included vs. Additional Charges"}
              </h3>
              <p className="mt-2 text-footnote leading-relaxed text-(--color-text-muted)">
                {ar
                  ? "تشمل جميع الأسعار المعلنة الغسيل التفصيلي، تنظيف الطلاء بالصلصال (Clay Bar)، القص الإلكتروني VPC 2.0، الفيلم الأصلي، التركيب، وضمان ١٢ شهراً. تُضاف رسوم فقط في حال وجود فيلم حماية قديم أو تغليف فينيل يتطلب إزالة آمنة بالبخار وتنظيف الصمغ، أو إذا طلب العميل تلميعاً آلياً متعدد المراحل لمعالجة خدوش عميقة سابقة، وتُحدد تكلفتها مسبقاً قبل تأكيد الحجز."
                  : "All listed prices include decontamination wash, clay prep, VPC 2.0 plotting, genuine VTEK film, fitting, and both warranties. Additional charges apply only if your car has existing old PPF/vinyl wrap that must be steamed off and de-adhesived first, or if heavily swirled paint requires multi-stage machine correction — always quoted and agreed upfront before slot confirmation."}
              </p>
            </div>

            <div className="rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
              <h3 className="text-body font-bold text-(--color-text)">
                {ar ? "٤. سرعة الرد، طريقة الدفع، وسياسة الإلغاء المجاني" : "4. Response Timing, Payment & Free 48h Cancellation"}
              </h3>
              <p className="mt-2 text-footnote leading-relaxed text-(--color-text-muted)">
                {ar
                  ? "يرد فريقنا في الدوحة عبر واتساب (30838355 974+) خلال ساعات العمل (السبت–الخميس ١٠:٠٠–١٣:٠٠ و١٦:٠٠–٢٢:٠٠) لتأكيد توفر الفيلم والموعد. يتم الدفع بتحويل بنكي محلي أو فوران (Fawran) أو نقداً بعد تأكيد الموعد. يمكنك الإلغاء واسترداد المبلغ كاملاً ١٠٠٪ أو تغيير الموعد مجاناً حتى ٤٨ ساعة قبل موعد التسليم."
                  : "Our Doha desk replies on WhatsApp (+974 30838355) during opening hours (Sat–Thu 10:00–13:00 & 16:00–22:00) to confirm film stock and your studio slot. You pay by Qatar bank transfer / Fawran or cash only after your slot is confirmed. Cancel up to 48 hours before your appointment for a 100% refund, or reschedule once free of charge."}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Local Doha Service Area & Installation Partner Network */}
      <section className="border-t border-(--color-border) py-10 lg:py-14">
        <Container>
          <div className="rounded-hero border border-(--color-border) bg-(--color-surface) p-6 sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <h2 className="text-title font-bold text-(--color-text) sm:text-headline">
                {t("serviceAreaTitle")}
              </h2>
              <p className="mt-2 text-footnote text-(--color-text-muted) sm:text-body">
                {t("serviceAreaSubtitle")}
              </p>
            </div>

            <p className="mt-4 text-caption leading-relaxed text-(--color-text-muted)">
              {t("serviceAreaGuarantee")}
            </p>

            {/* Related Internal Links for Crawlers & Shoppers */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--color-border-soft) pt-4 text-caption">
              <span className="font-semibold text-(--color-text)">
                {ar ? "روابط وأدلة ذات صلة:" : "Explore related VTEK & Qatar PPF resources:"}
              </span>
              <Link href="/b2c/brands/vtek" className="text-(--color-link) hover:underline">
                {ar ? "كتالوج علامة VTEK الرسمي" : "VTEK Official Brand Hub"}
              </Link>
              <span>·</span>
              <Link href="/b2c/categories/film" className="text-(--color-link) hover:underline">
                {ar ? "أفلام الحماية وتظليل النوافذ" : "PPF & Window Tint Films"}
              </Link>
              <span>·</span>
              <Link href="/b2c/blog/ppf-cost-qatar" className="text-(--color-link) hover:underline">
                {ar ? "دليل أسعار PPF في قطر ٢٠٢٦" : "2026 Qatar PPF Price Guide"}
              </Link>
              <span>·</span>
              <Link
                href="/b2c/blog/best-ppf-installers-doha-qatar-guide"
                className="text-(--color-link) hover:underline"
              >
                {ar ? "كيف تختار أفضل مركز تركيب PPF بالدوحة" : "How to Compare Doha PPF Installers"}
              </Link>
              <span>·</span>
              <Link
                href="/b2c/blog/ppf-vs-ceramic-coating-qatar"
                className="text-(--color-link) hover:underline"
              >
                {ar ? "مقارنة PPF مع السيراميك في قطر" : "PPF vs Ceramic Coating in Qatar"}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-(--color-border) pt-6">
              <Link
                href="#quote"
                className={buttonClasses("primary", "md")}
              >
                {ar ? "احسب سعر سيارتك الآن" : "Build Your Instant Quote"}
              </Link>
              <a
                href={buildPpfEnquiryWhatsAppUrl(l)}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="service_area_cta"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "md")}`}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {ar ? "محادثة فورية على واتساب" : "Chat on WhatsApp"}
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

