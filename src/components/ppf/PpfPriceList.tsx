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
  PRESET_PRICES_QAR,
  PRICES_UPDATED_AT,
  WORKMANSHIP_COVER_MONTHS,
  presetPriceList,
  type PresetCoverage,
} from "@/data/ppfInstall";
import { PPF_MARKET, PPF_MARKET_CHECKED_AT } from "@/data/ppfMarket";
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

  // ABK's own row is read from ppfInstall.ts; every other row is a statement the
  // provider publishes itself (src/data/ppfMarket.ts). Nothing here is estimated.
  const proFilm = FILMS.find((f) => f.key === "pro")!;
  const matteFilm = FILMS.find((f) => f.key === "matte")!;
  const sizes = (coverage: PresetCoverage) =>
    BODY_TYPES.map((b) => qar(PRESET_PRICES_QAR[coverage][b.key])).join(" · ");
  const checkedOn = new Date(PPF_MARKET_CHECKED_AT).toLocaleDateString(
    ar ? "ar-QA" : "en-QA",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
  const abkRow = {
    provider: "ABK Trading & Service",
    published: ar
      ? `أسعار تركيب ثابتة حسب حجم السيارة (سيدان · SUV متوسطة · SUV كبيرة)، فيلم PRO: الواجهة الأساسية ${sizes("front-end")}؛ الواجهة الكاملة ${sizes("full-front")}؛ الهيكل بالكامل ${sizes("full-body")}.`
      : `Fixed installed prices by car size (sedan · mid SUV · large SUV), PRO film: front end ${sizes("front-end")}; full front ${sizes("full-front")}; full body ${sizes("full-body")}.`,
    caveat: ar
      ? `فيلم VTEK Weather Armor الأصلي بتركيب في مركز معتمد من VTEK في الدوحة. الضمان الإلكتروني NFC من VTEK: PRO ${proFilm.warrantyYears} سنوات، وMATTE وPRISM ${matteFilm.warrantyYears} سنوات؛ إضافة إلى ضمان تركيب من ABK لمدة ${WORKMANSHIP_COVER_MONTHS} شهراً. يشمل السعر الفيلم والتركيب.`
      : `Genuine VTEK Weather Armor, fitted at a VTEK-authorised centre in Doha. VTEK NFC e-Warranty: PRO ${proFilm.warrantyYears} years, MATTE and PRISM ${matteFilm.warrantyYears} years; plus a ${WORKMANSHIP_COVER_MONTHS}-month ABK workmanship guarantee. Prices include the film and fitting.`,
  };

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

        {/* Doha PPF — published starting prices. Provider-published statements only. */}
        <div id="market-comparison" className="mt-12 scroll-mt-16 border-t border-(--color-border) pt-10">
          <SectionHeading
            title={
              ar
                ? `أسعار PPF المعلنة في الدوحة، قطر (قُرئت في ${checkedOn})`
                : `Doha PPF: Published Starting Prices (read ${checkedOn})`
            }
            subtitle={
              ar
                ? "كل رقم هو ما تنشره الجهة نفسها؛ ولا تقدّر ABK أسعار غيرها."
                : "Each figure is the provider's own published statement; ABK does not estimate anyone else's prices."
            }
          />

          <div className="mt-6 overflow-x-auto rounded-tile border border-(--color-border) bg-(--color-surface)">
            <table className="w-full min-w-[40rem] border-collapse text-start text-caption">
              <caption className="px-4 py-3 text-start text-caption text-(--color-text-muted) sm:px-6">
                {ar
                  ? `المصدر: الموقع الإلكتروني لكل جهة، قُرئ في ${checkedOn}. الجهات التي لا تنشر سعراً لـ PPF لا تُدرج هنا. تُسعّر الجهات حسب السيارة والفيلم ونطاق العمل، فقارن خط الفيلم والضمان وما يشمله السعر وليس الرقم الأول فقط. نصوص الجهات الأخرى مترجمة من الإنجليزية.`
                  : `Source: each provider's own website, read ${checkedOn}. Providers that publish no PPF price are not listed. Providers price by vehicle, film and scope, so compare the film line, warranty and what is included, not only the headline number.`}
              </caption>
              <thead>
                <tr className="border-y border-(--color-border) bg-(--color-bg)/60">
                  <th scope="col" className="px-4 py-3 text-start font-semibold sm:px-5">
                    {ar ? "الجهة" : "Provider"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "السعر المنشور" : "Published price"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "الفيلم والضمان وملاحظات" : "Film, warranty and notes"}
                  </th>
                  <th scope="col" className="px-3 py-3 text-start font-semibold">
                    {ar ? "المصدر" : "Source"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border-soft)">
                <tr className="bg-(--color-brand)/[0.09]">
                  <th scope="row" className="px-4 py-3 text-start font-semibold text-(--color-text) sm:px-5">
                    {abkRow.provider}
                  </th>
                  <td className="px-3 py-3 text-start font-medium text-(--color-text)">{abkRow.published}</td>
                  <td className="px-3 py-3 text-start text-(--color-text-muted)">{abkRow.caveat}</td>
                  <td className="px-3 py-3 text-start text-(--color-text-muted)">
                    <a href="#prices" className="text-(--color-link) hover:underline">
                      {ar ? "هذه الصفحة" : "This page"}
                    </a>
                  </td>
                </tr>
                {PPF_MARKET.map((row) => (
                  <tr key={row.provider} className="hover:bg-(--color-bg)/50">
                    <th scope="row" className="px-4 py-3 text-start font-semibold text-(--color-text) sm:px-5">
                      {row.provider}
                    </th>
                    <td className="px-3 py-3 text-start font-medium text-(--color-text)">{row.published[locale]}</td>
                    <td className="px-3 py-3 text-start text-(--color-text-muted)">{row.caveat[locale]}</td>
                    <td className="px-3 py-3 text-start">
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="break-all text-(--color-link) hover:underline"
                      >
                        {new URL(row.sourceUrl).host} ↗
                      </a>
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

