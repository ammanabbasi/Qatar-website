import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import {
  BODY_TYPES,
  COVERAGES,
  CUSTOM_MINIMUM_QAR,
  FILMS,
  PRICES_UPDATED_AT,
  WORKMANSHIP_COVER_MONTHS,
  presetPriceList,
  type PresetCoverage,
} from "@/data/ppfInstall";
import { formatQar } from "@/lib/pricing";
import { buildPpfCustomOfferWhatsAppUrl } from "@/lib/whatsapp";

const INCLUDED = ["included1", "included2", "included3"] as const;

/** Show Full Body first in the price table so buyers and AI crawlers see full-body pricing immediately, followed by Full Front and Front-End Essential. */
const TABLE_COVERAGES: PresetCoverage[] = ["full-body", "full-front", "front-end"];

/**
 * The whole fixed-price list, package panel breakdown, and Doha market comparison
 * as plain server-rendered HTML. Crawlers and AI answer engines see every fixed
 * price by vehicle size, coverage, and film grade without needing to run client JS.
 */
export async function PpfPriceList({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const ar = locale === "ar";
  const qar = (n: number) => formatQar(n, locale);
  const prices = presetPriceList();
  const price = (coverage: string, body: string, film: string) =>
    prices.find((p) => p.coverage === coverage && p.body === body && p.film === film)?.priceQar;
  const years = (key: string) => FILMS.find((f) => f.key === key)!.warrantyYears;

  // Separate PRO (10-yr Gloss), PRO PLUS (12-yr Ultra-Gloss), and MATTE (5-yr Satin)
  // into distinct columns so warranty durations and finishes are never conflated.
  const columns: Array<{ key: "pro" | "pro-plus" | "matte"; title: string; sub: string }> = [
    {
      key: "pro",
      title: "PRO",
      sub: ar ? "لمعان · ضمان ١٠ سنوات (7.5 mil)" : "Gloss · 10-Yr (7.5 mil)",
    },
    {
      key: "pro-plus",
      title: "PRO PLUS",
      sub: ar ? "لمعان فائق · ضمان ١٢ سنة (8.0 mil)" : "Ultra-Gloss · 12-Yr (8.0 mil)",
    },
    {
      key: "matte",
      title: "MATTE",
      sub: ar ? "ساتان مطفي · ضمان ٥ سنوات (8.0 mil)" : "Satin Matte · 5-Yr (8.0 mil)",
    },
  ];

  const updated = new Date(PRICES_UPDATED_AT).toLocaleDateString(
    ar ? "ar-QA" : "en-QA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const packageDetails: Array<{
    key: PresetCoverage;
    badge: string;
    highlight: boolean;
    title: string;
    startingText: string;
    duration: string;
    panelsCount: string;
    panelsList: string;
    prepAndFinish: string;
    bestFor: string;
  }> = [
    {
      key: "full-body",
      badge: ar ? "أفضل قيمة · حماية شاملة ١٠٠٪" : "Best Value · 100% Paint Coverage",
      highlight: true,
      title: ar ? "الهيكل بالكامل (Full Body — ١٢ منطقة)" : "Full Body (All 12 Painted Zones)",
      startingText: ar
        ? `سيدان: ${qar(3999)} · SUV متوسطة: ${qar(4799)} · SUV كبيرة: ${qar(5499)}`
        : `Sedan: ${qar(3999)} · Mid SUV: ${qar(4799)} · Large SUV: ${qar(5499)}`,
      duration: ar ? "٢ إلى ٣ أيام (شاملة التثبيت والفحص)" : "2–3 days (incl. curing & handover inspection)",
      panelsCount: ar ? "جميع الألواح المطلية (١٢ منطقة)" : "All 12 painted exterior zones",
      panelsList: ar
        ? "الصدام الأمامي، الكبوت بالكامل، الرفرفان الأماميان، المصابيح الأمامية، المرايا الجانبية، الأبواب الأربعة، العتبات الجانبية، السقف والأعمدة، الرفارف الخلفية، الشنطة/الباب الخلفي، والصدام الخلفي."
        : "Front bumper, full bonnet, both front fenders, headlights, side mirrors, all 4 doors, rocker panels/side skirts, roof & A/B/C pillars, rear quarter panels, boot/tailgate, and rear bumper.",
      prepAndFinish: ar
        ? "غسيل تفصيلي وإزالة شوائب الطلاء بالصلصال، قص إلكتروني عبر برنامج VTEK VPC 2.0 دون مشرط على الطلاء، لف الحواف الممكنة، وفحص تثبيت بعد ٤٨ ساعة."
        : "Multi-stage wash & clay decontamination, VTEK VPC 2.0 computer-plotted templates (zero blade on paint), wrapped edges where panel tolerances allow, and 48-hr cure check.",
      bestFor: ar
        ? "السيارات الجديدة ومركبات الدفع الرباعي والسيارات الفاخرة لحمايتها من الرمل والحصى وخدوش الغسيل والحفاظ على سعر إعادة البيع."
        : "New cars, daily highway drivers, and SUVs (Land Cruiser, Patrol, Jetour T2, Cayenne) seeking zero visible seam lines and maximum resale value.",
    },
    {
      key: "full-front",
      badge: ar ? "الأكثر طلباً للطرق السريعة" : "Popular Highway Shield",
      highlight: false,
      title: ar ? "الواجهة الكاملة (Full Front — ٥ مناطق كاملة)" : "Full Front (5 Complete Front Zones)",
      startingText: ar
        ? `سيدان: ${qar(1599)} · SUV متوسطة: ${qar(1899)} · SUV كبيرة: ${qar(2199)}`
        : `Sedan: ${qar(1599)} · Mid SUV: ${qar(1899)} · Large SUV: ${qar(2199)}`,
      duration: ar ? "يوم واحد (تثبيت كامل)" : "1 full day",
      panelsCount: ar ? "٥ مناطق أمامية بالكامل دون خط فاصل" : "5 full front impact zones (zero seam line)",
      panelsList: ar
        ? "الكبوت بالكامل، الصدام الأمامي بالكامل، الرفرفان الأماميان بالكامل، المرايا الجانبية، والمصابيح الأمامية."
        : "100% of the bonnet, full front bumper, both full front fenders, side mirrors, and headlights — no visible film line across the bonnet.",
      prepAndFinish: ar
        ? "تجهيز وتنظيف عميق للواجهة، قص VPC 2.0، وحواف ملفوفة على الكبوت والرفارف."
        : "Full front decontamination, VPC 2.0 precision cut, and wrapped edges on the bonnet and fenders.",
      bestFor: ar
        ? "الحماية من حصى وسافي طريق الشمال وطريق سلوى وممرات لوسيل دون خط فيلم ظاهر."
        : "High-speed stone-chip defense on Al Shamal Highway, Salwa Road, and Lusail Expressway with no mid-bonnet line.",
    },
    {
      key: "front-end",
      badge: ar ? "باقة اقتصادية جزئية" : "Entry Partial Kit",
      highlight: false,
      title: ar ? "الواجهة الأساسية الجزئية (Front-End Essential)" : "Front-End Essential (Partial Bikini Kit)",
      startingText: ar
        ? `سيدان: ${qar(899)} · SUV متوسطة: ${qar(1049)} · SUV كبيرة: ${qar(1199)}`
        : `Sedan: ${qar(899)} · Mid SUV: ${qar(1049)} · Large SUV: ${qar(1199)}`,
      duration: ar ? "في اليوم نفسه (٥–٧ ساعات)" : "Same day (5–7 hours)",
      panelsCount: ar ? "صدام كامل + مقدمة الكبوت والرفارف (~٤٠ سم)" : "Full bumper + leading ~40 cm of bonnet & fenders",
      panelsList: ar
        ? "الصدام الأمامي بالكامل، أول ٤٠ سم تقريباً من الكبوت والرفارف الأمامية، المرايا الجانبية، والمصابيح الأمامية (يظهر خط الفيلم عبر الكبوت)."
        : "Full front bumper, leading ~40 cm edge of bonnet and front fenders, side mirrors, and headlights (leaves a visible horizontal film edge across the bonnet).",
      prepAndFinish: ar
        ? "تنظيف وتجهيز مناطق الاصطدام الأمامية وتركيب بقص إلكتروني دقيق."
        : "Surface prep on forward impact zones with computer-plotted pattern fitting.",
      bestFor: ar
        ? "حماية اقتصادية سريعة لمناطق ارتطام الحصى المباشر."
        : "Budget-conscious stone-chip protection on the leading impact edge.",
    },
  ];

  const competitors = [
    {
      provider: ar
        ? "ABK للتجارة والخدمات (توريد مباشر من الموزع المعتمد لـ VTEK + تركيب في مركز شريك معتمد بالدوحة)"
        : "ABK Trading & Service (Official Qatar VTEK Distributor + Authorised Doha Partner Studio)",
      sedanFull: ar ? `${qar(3999)} (PRO) · ${qar(4799)} (PRO+)` : `${qar(3999)} (PRO) · ${qar(4799)} (PRO+)`,
      suvFull: ar ? `${qar(4799)} (PRO) · ${qar(5699)} (PRO+)` : `${qar(4799)} (PRO) · ${qar(5699)} (PRO+)`,
      largeSuvFull: ar ? `${qar(5499)} (PRO) · ${qar(6499)} (PRO+)` : `${qar(5499)} (PRO) · ${qar(6499)} (PRO+)`,
      frontRange: ar ? `${qar(899)} – ${qar(2199)}` : `${qar(899)} – ${qar(2199)}`,
      filmSpecs: ar
        ? "VTEK Weather Armor أصلي (7.5–8.0 mil TPU أليفاتي معالج ذاتياً)"
        : "Genuine VTEK Weather Armor (7.5–8.0 mil Aliphatic TPU, self-healing)",
      warranty: ar
        ? "١٠–١٢ سنة ضمان إلكتروني NFC + ١٢ شهراً ضمان تركيب من ABK"
        : "10–12 Yr VTEK NFC e-Warranty + 12-Mo ABK Fitting Guarantee",
      highlight: true,
    },
    {
      provider: ar
        ? "ProDip Car Care (الدوحة — قائمة الأسعار المعلنة أكتوبر ٢٠٢٦)"
        : "ProDip Car Care (prodip.qa, Doha — public rate card Oct 2026)",
      sedanFull: ar ? "من 5,500 ر.ق" : "From QAR 5,500",
      suvFull: ar ? "5,500 – 6,500 ر.ق" : "QAR 5,500 – 6,500",
      largeSuvFull: ar ? "6,500+ ر.ق" : "QAR 6,500+",
      frontRange: ar ? "1,800 – 2,800 ر.ق" : "QAR 1,800 – 2,800",
      filmSpecs: ar ? "TPU معالج ذاتياً بالحرارة" : "Self-healing gloss TPU",
      warranty: ar ? "٥–١٠ سنوات" : "5–10 years",
      highlight: false,
    },
    {
      provider: ar
        ? "Daman Protect / استوديوهات الفئة المتوسطة في الدوحة (أكتوبر ٢٠٢٦)"
        : "Daman Protect / Mid-Tier Doha Studios (damanprotect.com — Oct 2026)",
      sedanFull: ar ? "4,500 – 5,500 ر.ق" : "QAR 4,500 – 5,500",
      suvFull: ar ? "5,500 – 6,500 ر.ق" : "QAR 5,500 – 6,500",
      largeSuvFull: ar ? "6,500 – 7,500+ ر.ق" : "QAR 6,500 – 7,500+",
      frontRange: ar ? "1,800 – 3,000 ر.ق" : "QAR 1,800 – 3,000",
      filmSpecs: ar ? "TPU قياسي (يُسعَّر حسب الفئة بالاستفسار)" : "Standard TPU (quote-gated by vehicle)",
      warranty: ar ? "٥–١٠ سنوات" : "5–10 years",
      highlight: false,
    },
    {
      provider: ar
        ? "White Crown Car Care (اللقطة / الصناعية — باقات XPEL المعلنة أكتوبر ٢٠٢٦)"
        : "White Crown Car Care (whitecrowncare.com, Doha — XPEL rates Oct 2026)",
      sedanFull: ar ? "من 6,999+ ر.ق" : "From QAR 6,999+",
      suvFull: ar ? "7,500 – 8,500+ ر.ق" : "QAR 7,500 – 8,500+",
      largeSuvFull: ar ? "8,500 – 10,500+ ر.ق" : "QAR 8,500 – 10,500+",
      frontRange: ar ? "من 2,500 ر.ق" : "From QAR 2,500",
      filmSpecs: ar ? "XPEL TPU (7.5–8.0 mil)" : "XPEL Aliphatic TPU (7.5–8.0 mil)",
      warranty: ar ? "١٠ سنوات" : "10 years",
      highlight: false,
    },
    {
      provider: ar
        ? "الوكالات والمراكز الفاخرة (Ozone LLumar / Topaz / Al Fardan XPEL — أكتوبر ٢٠٢٦)"
        : "Franchise & Luxury Studios (Ozone LLumar / Topaz / Al Fardan — Oct 2026)",
      sedanFull: ar ? "8,000 – 11,000+ ر.ق" : "QAR 8,000 – 11,000+",
      suvFull: ar ? "9,500 – 13,000+ ر.ق" : "QAR 9,500 – 13,000+",
      largeSuvFull: ar ? "11,000 – 15,000+ ر.ق" : "QAR 11,000 – 15,000+",
      frontRange: ar ? "3,500 – 5,500+ ر.ق" : "QAR 3,500 – 5,500+",
      filmSpecs: ar ? "LLumar / XPEL / تفصيل خاص (تتطلب زيارة للتسعير)" : "LLumar / XPEL / bespoke (in-person quote only)",
      warranty: ar ? "١٠–١٢ سنة" : "10–12 years",
      highlight: false,
    },
  ];

  return (
    <section id="prices" className="scroll-mt-16 py-8 lg:py-12">
      <Container>
        <SectionHeading title={t("pricesTitle")} subtitle={t("pricesSubtitle")} />

        {/* Direct Answer Banner for "Full-Body PPF Under QAR 5,000 in Qatar" */}
        <div className="mt-6 max-w-4xl rounded-tile border border-(--color-brand)/45 bg-(--color-brand)/[0.08] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-caption font-bold tracking-wide text-(--color-brand-deep) uppercase">
                {ar
                  ? "لماذا أسعار الهيكل الكامل لدى ABK تبدأ من 3,999 ر.ق فقط؟"
                  : "Full-Body VTEK TPU from QAR 3,999 — Direct from Qatar's Official Distributor"}
              </p>
              <p className="mt-1 text-footnote leading-relaxed text-(--color-text)">
                {ar
                  ? "بصفتنا الموزع الرسمي والحصري لأفلام VTEK في قطر (معرض مسيمير)، نوفر رولات الفيلم الأصلية مباشرة من مستودعنا المكيّف دون وسطاء. تحصل على تغليف كامل للهيكل (١٢ منطقة) بفيلم PRO بضمان ١٠ سنوات بسعر 3,999 ر.ق للسيدان و4,799 ر.ق لـ SUV المتوسطة (كلاهما أقل من 5,000 ر.ق) و5,499 ر.ق لـ SUV الكبيرة."
                  : "Because ABK Trading & Service is the official Qatar distributor for VTEK Films in Mesaimeer, we supply sealed master rolls directly from our warehouse without middleman studio markups. Full-Body PRO (10-yr warranty, all 12 painted panels) is QAR 3,999 for Sedans and QAR 4,799 for Midsize SUVs — both under QAR 5,000 — and QAR 5,499 for Large SUVs."}
              </p>
            </div>
            <a
              href="#quote"
              data-ppf-coverage="full-body"
              className={`shrink-0 ${buttonClasses("primary", "sm")}`}
            >
              {ar ? "احجز الهيكل الكامل" : "Quote Full-Body Now"}
            </a>
          </div>
        </div>

        {/* Complete Fixed-Price Table with 3 Distinct Film Columns */}
        <div className="mt-6 max-w-4xl overflow-x-auto rounded-tile border border-(--color-border) bg-(--color-surface)">
          <table className="w-full min-w-[34rem] border-collapse text-start text-footnote tabular-nums">
            <caption className="px-4 py-3 text-start text-caption text-(--color-text-muted) sm:px-6">
              {t("pricesCaption", {
                pro: years("pro"),
                proPlus: years("pro-plus"),
                matte: years("matte"),
              })}
            </caption>
            <thead>
              <tr className="border-y border-(--color-border) bg-(--color-bg)/50">
                <th scope="col" className="px-4 py-3 text-start font-semibold sm:px-6">
                  {t("pricesCar")}
                </th>
                {columns.map((col) => (
                  <th key={col.key} scope="col" className="px-3 py-3 text-end font-semibold sm:px-5">
                    <span className="block text-footnote font-bold text-(--color-text)">{col.title}</span>
                    <span className="mt-0.5 block text-[11px] font-normal text-(--color-text-muted)">
                      {col.sub}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {TABLE_COVERAGES.map((c) => {
              const cov = COVERAGES.find((x) => x.key === c)!;
              const isFullBody = c === "full-body";
              return (
                <tbody key={c}>
                  <tr className="border-t border-(--color-border-soft) bg-(--color-bg)">
                    <th
                      colSpan={columns.length + 1}
                      scope="colgroup"
                      className="px-4 py-2.5 text-start text-footnote font-semibold sm:px-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <span>{cov.name[locale]}</span>
                          {isFullBody ? (
                            <span className="rounded-pill bg-(--color-brand) px-2 py-0.5 text-[10px] font-bold text-(--color-ink)">
                              {ar ? "أفضل قيمة · ١٢ منطقة كاملة" : "Best Value · All 12 Panels"}
                            </span>
                          ) : c === "front-end" ? (
                            <span className="rounded-pill bg-(--color-fill) px-2 py-0.5 text-[10px] font-medium text-(--color-text-muted)">
                              {ar ? "تغطية جزئية للواجهة" : "Partial Front Bikini Kit"}
                            </span>
                          ) : (
                            <span className="rounded-pill bg-(--color-brand)/15 px-2 py-0.5 text-[10px] font-semibold text-(--color-brand-deep)">
                              {ar ? "٥ مناطق أمامية كاملة" : "5 Full Front Panels"}
                            </span>
                          )}
                        </span>
                        <span className="text-caption font-normal text-(--color-text-muted)">
                          {c === "full-body"
                            ? ar
                              ? "مدة التركيب: ٢–٣ أيام"
                              : "Fitting time: 2–3 days"
                            : c === "full-front"
                              ? ar
                                ? "مدة التركيب: يوم واحد"
                                : "Fitting time: 1 day"
                              : ar
                                ? "مدة التركيب: نفس اليوم"
                                : "Fitting time: same day"}
                        </span>
                      </div>
                    </th>
                  </tr>
                  {BODY_TYPES.map((b) => (
                    <tr
                      key={b.key}
                      className="border-t border-(--color-border-soft) transition-colors hover:bg-(--color-bg)/60"
                    >
                      <th scope="row" className="px-4 py-2.5 text-start font-normal sm:px-6">
                        <a
                          href="#quote"
                          data-ppf-body={b.key}
                          data-ppf-coverage={c}
                          className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep)"
                        >
                          <span className="block font-medium text-(--color-text) group-hover:text-(--color-brand-deep)">
                            {b.name[locale]}
                          </span>
                          <span className="mt-0.5 block text-caption text-(--color-text-muted)">
                            {b.examples[locale]}
                          </span>
                        </a>
                      </th>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 text-end font-semibold whitespace-nowrap text-(--color-text) sm:px-5"
                        >
                          <a
                            href="#quote"
                            data-ppf-body={b.key}
                            data-ppf-coverage={c}
                            data-ppf-film={col.key}
                            className="-mx-2 -my-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-(--color-text) transition-colors hover:bg-(--color-brand)/15 hover:text-(--color-brand-deep) active:bg-(--color-brand)/25"
                          >
                            {qar(price(c, b.key, col.key)!)}
                          </a>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </div>

        {/* Callout for customers unsure which category their vehicle falls under */}
        <div className="mt-5 flex max-w-4xl flex-col justify-between gap-4 rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-body font-semibold text-(--color-text)">
              {t("pricesUnsureTitle")}
            </h3>
            <p className="mt-1 text-footnote text-(--color-text-muted)">
              {t("pricesUnsureBody")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href="#quote-custom"
              className={buttonClasses("primary", "sm")}
            >
              {t("pricesUnsureCtaQuote")}
            </a>
            <a
              href={buildPpfCustomOfferWhatsAppUrl({ locale })}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="prices_unsure_whatsapp"
              className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "sm")}`}
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {t("pricesUnsureCtaWhatsApp")}
            </a>
          </div>
        </div>

        <ul className="mt-5 grid max-w-4xl gap-x-6 gap-y-2 sm:grid-cols-3">
          {INCLUDED.map((k) => (
            <li key={k} className="flex items-start gap-2 text-footnote text-(--color-text)">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
              {t(k, { months: WORKMANSHIP_COVER_MONTHS })}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-4xl text-footnote text-(--color-text-muted)">
          {t("pricesNotes", { minimum: qar(CUSTOM_MINIMUM_QAR) })}
        </p>
        <p className="mt-2 text-caption text-(--color-text-subtle)">
          {t("pricesUpdated", { date: updated })}
        </p>

        {/* Detailed Package & Panel Breakdown (Full Body vs Full Front vs Front-End Essential) */}
        <div id="packages" className="mt-12 scroll-mt-16 border-t border-(--color-border) pt-10">
          <SectionHeading
            title={
              ar
                ? "مقارنة تفصيلية للباقات: أي الألواح والخدمات تشملها كل باقة؟"
                : "Package & Panel Breakdown: Exactly What Each Tier Covers"
            }
            subtitle={
              ar
                ? "مقارنة واضحة بين التغطية الكاملة للهيكل (١٢ منطقة) والواجهة الكاملة (٥ مناطق) والواجهة الجزئية الاقتصادية."
                : "Distinguishing full-body 12-panel wraps from full-front and partial front-end kits so you can compare quotes apples-to-apples."
            }
          />

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {packageDetails.map((pkg) => (
              <div
                key={pkg.key}
                className={`flex flex-col justify-between rounded-tile border p-5 sm:p-6 ${
                  pkg.highlight
                    ? "border-(--color-brand) bg-(--color-brand)/[0.05] shadow-[inset_0_0_0_1px_var(--color-brand)]"
                    : "border-(--color-border) bg-(--color-surface)"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-pill px-2.5 py-0.5 text-caption font-bold ${
                        pkg.highlight
                          ? "bg-(--color-brand) text-(--color-ink)"
                          : "bg-(--color-fill) text-(--color-text-muted)"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                    <span className="text-caption font-medium text-(--color-text-muted)">
                      {pkg.duration}
                    </span>
                  </div>

                  <h3 className="mt-3 text-title-sm font-bold text-(--color-text)">
                    {pkg.title}
                  </h3>
                  <p className="mt-1.5 text-footnote font-bold tabular-nums text-(--color-brand-deep)">
                    {pkg.startingText}
                  </p>

                  <dl className="mt-4 space-y-3 border-t border-(--color-border-soft) pt-4 text-caption">
                    <div>
                      <dt className="font-semibold text-(--color-text)">
                        {ar ? "الألواح المشمولة:" : "Panels included:"} ({pkg.panelsCount})
                      </dt>
                      <dd className="mt-0.5 leading-relaxed text-(--color-text-muted)">
                        {pkg.panelsList}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-(--color-text)">
                        {ar ? "التجهيز وطريقة التركيب:" : "Prep & fitting standard:"}
                      </dt>
                      <dd className="mt-0.5 leading-relaxed text-(--color-text-muted)">
                        {pkg.prepAndFinish}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-(--color-text)">
                        {ar ? "الأنسب لـ:" : "Recommended for:"}
                      </dt>
                      <dd className="mt-0.5 leading-relaxed text-(--color-text-muted)">
                        {pkg.bestFor}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-5 border-t border-(--color-border-soft) pt-4">
                  <a
                    href="#quote"
                    data-ppf-coverage={pkg.key}
                    className={`w-full ${buttonClasses(pkg.highlight ? "primary" : "secondary", "sm")}`}
                  >
                    {ar ? `اختر ${pkg.title.split(" (")[0]}` : `Configure ${pkg.title.split(" (")[0]}`}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Substantiated Doha PPF Market Comparison Table */}
        <div id="market-comparison" className="mt-12 scroll-mt-16 border-t border-(--color-border) pt-10">
          <SectionHeading
            title={
              ar
                ? "مقارنة أسعار تركيب PPF للهيكل الكامل في الدوحة، قطر (أكتوبر ٢٠٢٦)"
                : "Doha Full-Body PPF Price & Specification Comparison (October 2026)"
            }
            subtitle={
              ar
                ? "مقارنة موثقة لنفس فئات حجم السيارات وتغطية الهيكل الكامل بفيلم TPU أليفاتي معالج ذاتياً."
                : "Apples-to-apples comparison across vehicle sizes, full-body coverage, aliphatic TPU specifications, and warranties in Qatar."
            }
          />

          <div className="mt-6 overflow-x-auto rounded-tile border border-(--color-border) bg-(--color-surface)">
            <table className="w-full min-w-[46rem] border-collapse text-start text-caption tabular-nums">
              <caption className="px-4 py-3 text-start text-caption text-(--color-text-muted) sm:px-6">
                {ar
                  ? "المصادر وتاريخ التوثيق: قوائم الأسعار والعروض المعلنة لمراكز العناية بالسيارات في الدوحة كما في أكتوبر ٢٠٢٦. جميع المقارنات لأفلام TPU الأليفاتية (7.5–8.0 mil) مع التركيب الكامل."
                  : "Recorded sources & verification date: Publicly listed rate cards and published Doha installer packages verified October 2026 for equivalent 7.5–8.0 mil self-healing aliphatic TPU."}
              </caption>
              <thead>
                <tr className="border-y border-(--color-border) bg-(--color-bg)/60">
                  <th scope="col" className="px-4 py-3 text-start font-semibold sm:px-5">
                    {ar ? "مزود الخدمة في الدوحة" : "Doha Provider / Tier"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-end font-semibold">
                    {ar ? "هيكل كامل: سيدان" : "Full-Body: Sedan"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-end font-semibold">
                    {ar ? "هيكل كامل: SUV متوسطة" : "Full-Body: Mid SUV"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-end font-semibold">
                    {ar ? "هيكل كامل: SUV كبيرة" : "Full-Body: Large SUV"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-end font-semibold">
                    {ar ? "الواجهة (جزئي / كامل)" : "Front Packages"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "نوع الفيلم والضمان" : "Film Spec & Warranty"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border-soft)">
                {competitors.map((row) => (
                  <tr
                    key={row.provider}
                    className={
                      row.highlight
                        ? "bg-(--color-brand)/[0.09] font-medium"
                        : "hover:bg-(--color-bg)/50"
                    }
                  >
                    <th scope="row" className="px-4 py-3 text-start font-semibold text-(--color-text) sm:px-5">
                      {row.provider}
                    </th>
                    <td className="px-3 py-3 text-end font-bold whitespace-nowrap text-(--color-text)">
                      {row.sedanFull}
                    </td>
                    <td className="px-3 py-3 text-end font-bold whitespace-nowrap text-(--color-text)">
                      {row.suvFull}
                    </td>
                    <td className="px-3 py-3 text-end font-bold whitespace-nowrap text-(--color-text)">
                      {row.largeSuvFull}
                    </td>
                    <td className="px-3 py-3 text-end whitespace-nowrap text-(--color-text-muted)">
                      {row.frontRange}
                    </td>
                    <td className="px-3 py-3 text-start text-(--color-text-muted)">
                      <span className="block font-medium text-(--color-text)">{row.filmSpecs}</span>
                      <span className="mt-0.5 block text-[11px]">{row.warranty}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}

