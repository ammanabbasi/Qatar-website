import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Disclosure } from "@/components/ui/Disclosure";
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
  type BodyType,
  type PresetCoverage,
} from "@/data/ppfInstall";
import { yearsPhrase } from "@/data/ppfEvidence";
import { PPF_MARKET, PPF_MARKET_CHECKED_AT } from "@/data/ppfMarket";
import { formatQar } from "@/lib/pricing";
import { buildPpfCustomOfferWhatsAppUrl } from "@/lib/whatsapp";

const INCLUDED = ["included1", "included2", "included3"] as const;

/** Show Full Body first in the price table so buyers and AI crawlers see full-body pricing immediately, followed by Full Front and Front-End Essential. */
const TABLE_COVERAGES: PresetCoverage[] = ["full-body", "full-front", "front-end"];

const SHORT_BODY: Record<BodyType, { en: string; ar: string }> = {
  sedan: { en: "Sedan", ar: "سيدان" },
  suv: { en: "Mid SUV", ar: "SUV متوسطة" },
  "large-suv": { en: "Large SUV", ar: "SUV كبيرة" },
};

/**
 * The whole fixed-price list, package panel breakdown, and Doha market comparison
 * as plain server-rendered HTML. Crawlers and AI answer engines see every fixed
 * price by vehicle size, coverage, and film grade without needing to run client JS.
 * On phones the table fits the screen without sideways scrolling and the two
 * secondary blocks (package breakdown, market comparison) start folded.
 */
export async function PpfPriceList({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const ar = locale === "ar";
  const qar = (n: number) => formatQar(n, locale);
  const prices = presetPriceList();
  const price = (coverage: string, body: string, film: string) =>
    prices.find((p) => p.coverage === coverage && p.body === body && p.film === film)?.priceQar;
  const years = (key: string) => FILMS.find((f) => f.key === key)!.warrantyYears;
  const yrs = (key: string) => yearsPhrase(years(key), locale);

  // PRO, PRO PLUS and MATTE sit in separate columns so finishes and warranty
  // terms are never conflated. Terms are VTEK's published ones (ppfInstall.ts).
  const columns: Array<{ key: "pro" | "pro-plus" | "matte"; title: string; finish: string }> = [
    { key: "pro", title: "PRO", finish: ar ? "لامع" : "Gloss" },
    { key: "pro-plus", title: "PRO PLUS", finish: ar ? "لامع، فئة أعلى" : "Step-up gloss" },
    { key: "matte", title: "MATTE", finish: ar ? "ساتان مطفي" : "Satin matte" },
  ];

  const updated = new Date(PRICES_UPDATED_AT).toLocaleDateString(
    ar ? "ar-QA" : "en-QA",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );

  const sizeLine = (coverage: PresetCoverage) =>
    BODY_TYPES.map((b) => `${SHORT_BODY[b.key][locale]}: ${qar(PRESET_PRICES_QAR[coverage][b.key])}`).join(" · ");

  const fullBody = PRESET_PRICES_QAR["full-body"];

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
      badge: ar ? "أفضل قيمة · حماية شاملة" : "Best Value · Complete Coverage",
      highlight: true,
      title: ar ? "الهيكل بالكامل (Full Body — ١٢ منطقة)" : "Full Body (All 12 Painted Zones)",
      startingText: sizeLine("full-body"),
      duration: ar ? "٢ إلى ٣ أيام (شاملة التثبيت والفحص)" : "2–3 days (incl. curing & handover inspection)",
      panelsCount: ar ? "جميع الألواح المطلية (١٢ منطقة)" : "All 12 painted exterior zones",
      panelsList: ar
        ? "الصدام الأمامي، الكبوت بالكامل، الرفرفان الأماميان، المصابيح الأمامية، المرايا الجانبية، الأبواب الأربعة، العتبات الجانبية، السقف والأعمدة، الرفارف الخلفية، الشنطة/الباب الخلفي، والصدام الخلفي."
        : "Front bumper, full bonnet, both front fenders, headlights, side mirrors, all 4 doors, rocker panels/side skirts, roof & A/B/C pillars, rear quarter panels, boot/tailgate, and rear bumper.",
      prepAndFinish: ar
        ? "تجهيز السطح وقص الفيلم على شكل كل قطعة، ولف الحواف حيث تسمح القطعة، وفحص من ABK عند التسليم."
        : "Surface preparation, film cut to each panel, wrapped edges where the panel allows, and an ABK inspection at handover.",
      bestFor: ar
        ? "السيارات الجديدة ومركبات الدفع الرباعي والسيارات الفاخرة لحمايتها من الرمل والحصى وخدوش الغسيل والحفاظ على سعر إعادة البيع."
        : "New cars, daily highway drivers, and SUVs (Land Cruiser, Patrol, Jetour T2, Cayenne) seeking zero visible seam lines and maximum resale value.",
    },
    {
      key: "full-front",
      badge: ar ? "الأكثر طلباً للطرق السريعة" : "Popular Highway Shield",
      highlight: false,
      title: ar ? "الواجهة الكاملة (Full Front — ٥ مناطق كاملة)" : "Full Front (5 Complete Front Zones)",
      startingText: sizeLine("full-front"),
      duration: ar ? "يوم واحد (تثبيت كامل)" : "1 full day",
      panelsCount: ar ? "٥ مناطق أمامية بالكامل دون خط فاصل" : "5 full front impact zones (zero seam line)",
      panelsList: ar
        ? "الكبوت بالكامل، الصدام الأمامي بالكامل، الرفرفان الأماميان بالكامل، المرايا الجانبية، والمصابيح الأمامية."
        : "100% of the bonnet, full front bumper, both full front fenders, side mirrors, and headlights — no visible film line across the bonnet.",
      prepAndFinish: ar
        ? "تجهيز سطح الواجهة وقص الفيلم، مع لف الحواف على الكبوت والرفارف."
        : "Front surface preparation and film cut to each panel, with wrapped edges on the bonnet and fenders.",
      bestFor: ar
        ? "الحماية من حصى وسافي طريق الشمال وطريق سلوى وممرات لوسيل دون خط فيلم ظاهر."
        : "High-speed stone-chip defense on Al Shamal Highway, Salwa Road, and Lusail Expressway with no mid-bonnet line.",
    },
    {
      key: "front-end",
      badge: ar ? "باقة اقتصادية جزئية" : "Entry Partial Kit",
      highlight: false,
      title: ar ? "الواجهة الأساسية الجزئية (Front-End Essential)" : "Front-End Essential (Partial Kit)",
      startingText: sizeLine("front-end"),
      duration: ar ? "في اليوم نفسه (٥–٧ ساعات)" : "Same day (5–7 hours)",
      panelsCount: ar ? "صدام كامل + مقدمة الكبوت والرفارف (~٤٠ سم)" : "Full bumper + leading ~40 cm of bonnet & fenders",
      panelsList: ar
        ? "الصدام الأمامي بالكامل، أول ٤٠ سم تقريباً من الكبوت والرفارف الأمامية، المرايا الجانبية، والمصابيح الأمامية (يظهر خط الفيلم عبر الكبوت)."
        : "Full front bumper, leading ~40 cm edge of bonnet and front fenders, side mirrors, and headlights (leaves a visible horizontal film edge across the bonnet).",
      prepAndFinish: ar
        ? "تجهيز سطح مناطق الاصطدام الأمامية وقص الفيلم على شكل كل قطعة."
        : "Surface preparation of the forward impact zones and film cut to each panel.",
      bestFor: ar
        ? "حماية اقتصادية سريعة لمناطق ارتطام الحصى المباشر."
        : "Budget-conscious stone-chip protection on the leading impact edge.",
    },
  ];

  // ABK's own row is read from ppfInstall.ts; every other row is a statement the
  // provider publishes itself (src/data/ppfMarket.ts). Nothing here is estimated.
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
      ? `فيلم VTEK Weather Armor الأصلي بتركيب لدى مُركّب معتمد من VTEK في الدوحة. ضمان VTEK للفيلم: PRO لمدة ${yrs("pro")}، وPRO PLUS لمدة ${yrs("pro-plus")}، وMATTE وPRISM لمدة ${yrs("matte")}؛ إضافة إلى ضمان تركيب من ABK لمدة ${WORKMANSHIP_COVER_MONTHS} شهراً. يشمل السعر الفيلم والتركيب.`
      : `Genuine VTEK Weather Armor, fitted by a VTEK-authorised installer in Doha. VTEK film warranty: PRO ${yrs("pro")}, PRO PLUS ${yrs("pro-plus")}, MATTE and PRISM ${yrs("matte")}; plus a ${WORKMANSHIP_COVER_MONTHS}-month ABK fitting guarantee. Prices include the film and fitting.`,
  };

  return (
    <section id="prices" className="scroll-mt-16 py-8 lg:py-12">
      <Container>
        <SectionHeading title={t("pricesTitle")} subtitle={t("pricesSubtitle")} />

        {/* Direct answer for "full-body PPF under QAR 5,000 in Qatar" */}
        <div className="mt-6 max-w-4xl rounded-tile border border-s-4 border-(--color-brand)/45 border-s-(--color-brand) bg-(--color-surface) p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-caption font-bold tracking-wide text-(--color-brand-deep) uppercase">
                {ar
                  ? `الهيكل بالكامل من ${qar(fullBody.sedan)} — فيلم VTEK أصلي، تركيب وضمان`
                  : `Full body from ${qar(fullBody.sedan)} — genuine VTEK film, fitted and guaranteed`}
              </p>
              <p className="mt-1 text-footnote leading-relaxed text-(--color-text)">
                {ar
                  ? `ABK هي الموزع المعتمد لأفلام VTEK في قطر، لذلك يأتي الفيلم من مخزوننا. الهيكل بالكامل بفيلم PRO (جميع المناطق المطلية الـ١٢، وضمان VTEK للفيلم ${yrs("pro")}) بسعر ${qar(fullBody.sedan)} للسيدان و${qar(fullBody.suv)} لـ SUV المتوسطة — وكلاهما أقل من ${qar(5000)} — و${qar(fullBody["large-suv"])} لـ SUV الكبيرة. يتم التركيب لدى مُركّب معتمد من VTEK في الدوحة.`
                  : `ABK is VTEK's authorised distributor in Qatar, so the film comes from our own stock. Full-body PRO (all 12 painted zones, ${yrs("pro")} VTEK film warranty) is ${qar(fullBody.sedan)} on a sedan and ${qar(fullBody.suv)} on a mid-size SUV, both under ${qar(5000)}, and ${qar(fullBody["large-suv"])} on a large SUV. A VTEK-authorised installer in Doha does the fitting.`}
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

        {/* Complete fixed-price table, one column per film. No fixed min-width: it fits a phone. */}
        <div className="mt-6 max-w-4xl overflow-x-auto rounded-tile border border-(--color-border) bg-(--color-surface)">
          <table className="w-full border-collapse text-start text-footnote tabular-nums sm:min-w-[34rem]">
            <caption className="px-4 py-3 text-start text-caption text-(--color-text-muted) sm:px-6">
              {t("pricesCaption", {
                pro: yrs("pro"),
                proPlus: yrs("pro-plus"),
                matte: yrs("matte"),
              })}
            </caption>
            <thead>
              <tr className="border-y border-(--color-border) bg-(--color-bg)/50">
                <th scope="col" className="px-3 py-3 text-start font-semibold sm:px-6">
                  {t("pricesCar")}
                </th>
                {columns.map((col) => (
                  <th key={col.key} scope="col" className="px-1.5 py-3 text-end font-semibold sm:px-5">
                    <span className="block text-footnote font-bold text-(--color-text)">{col.title}</span>
                    <span className="mt-0.5 block text-[11px] font-normal text-(--color-text-muted)">
                      {col.finish}
                    </span>
                    <span className="block text-[11px] font-normal text-(--color-text-muted)">
                      {yrs(col.key)}
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
                      className="px-3 py-2.5 text-start text-footnote font-semibold sm:px-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <span className="flex items-center gap-2">
                          <span>{cov.name[locale]}</span>
                          {isFullBody ? (
                            <span className="rounded-pill bg-(--color-brand) px-2 py-0.5 text-[10px] font-bold text-(--color-ink)">
                              {ar ? "أفضل قيمة · ١٢ منطقة كاملة" : "Best Value · All 12 Panels"}
                            </span>
                          ) : c === "front-end" ? (
                            <span className="rounded-pill bg-(--color-fill) px-2 py-0.5 text-[10px] font-medium text-(--color-text)">
                              {ar ? "تغطية جزئية للواجهة" : "Partial front kit"}
                            </span>
                          ) : (
                            <span className="rounded-pill bg-(--color-brand)/20 px-2 py-0.5 text-[10px] font-semibold text-(--color-ink)">
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
                      <th scope="row" className="px-3 py-2.5 text-start font-normal sm:px-6">
                        <a
                          href="#quote"
                          data-ppf-body={b.key}
                          data-ppf-coverage={c}
                          className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep)"
                        >
                          <span className="block font-medium text-(--color-text) group-hover:text-(--color-brand-deep)">
                            {b.name[locale]}
                          </span>
                          <span className="mt-0.5 hidden text-caption text-(--color-text-muted) sm:block">
                            {b.examples[locale]}
                          </span>
                        </a>
                      </th>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-1 py-2.5 text-end text-[13px] font-semibold whitespace-nowrap text-(--color-text) sm:px-5 sm:text-footnote"
                        >
                          <a
                            href="#quote"
                            data-ppf-body={b.key}
                            data-ppf-coverage={c}
                            data-ppf-film={col.key}
                            className="-mx-1 -my-1 inline-flex min-h-11 items-center rounded-lg px-1 font-semibold text-(--color-text) transition-colors hover:bg-(--color-brand)/15 hover:text-(--color-brand-deep) active:bg-(--color-brand)/25 sm:-mx-2 sm:px-2"
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
        <p className="mt-2 text-caption text-(--color-text-muted)">
          {t("pricesUpdated", { date: updated })}
        </p>

        <div className="mt-8 grid max-w-4xl gap-3">
          {/* Package & panel breakdown (Full Body vs Full Front vs Front-End Essential) */}
          <Disclosure
            id="packages"
            title={
              ar
                ? "ما الذي تشمله كل باقة؟ مقارنة الألواح والتجهيز"
                : "What does each package cover? Panels and preparation compared"
            }
            hint={
              ar
                ? "الهيكل الكامل (١٢ منطقة) والواجهة الكاملة (٥ مناطق) والواجهة الجزئية"
                : "Full body (12 zones), full front (5 zones) and the partial front kit"
            }
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {packageDetails.map((pkg) => (
                <div
                  key={pkg.key}
                  className={`flex flex-col justify-between rounded-tile border p-4 sm:p-5 ${
                    pkg.highlight
                      ? "border-(--color-brand) bg-(--color-brand)/[0.05] shadow-[inset_0_0_0_1px_var(--color-brand)]"
                      : "border-(--color-border) bg-(--color-surface)"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
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

                    <h3 className="mt-3 text-body font-bold text-(--color-text)">{pkg.title}</h3>
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
                          {ar ? "التجهيز وطريقة التركيب:" : "Preparation and fitting:"}
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
          </Disclosure>

          {/* Doha PPF — published starting prices. Provider-published statements only. */}
          <Disclosure
            id="market-comparison"
            title={
              ar
                ? `كيف تقارن أسعارنا بالأسعار المعلنة في الدوحة (قُرئت في ${checkedOn})`
                : `How our prices compare with published Doha prices (read ${checkedOn})`
            }
            hint={
              ar
                ? "كل رقم هو ما تنشره الجهة نفسها؛ ولا تقدّر ABK أسعار غيرها."
                : "Each figure is the provider's own published statement; ABK does not estimate anyone else's prices."
            }
          >
            <p className="text-caption text-(--color-text-muted)">
              {ar
                ? `المصدر: الموقع الإلكتروني لكل جهة، قُرئ في ${checkedOn}. الجهات التي لا تنشر سعراً لـ PPF لا تُدرج هنا. تُسعّر الجهات حسب السيارة والفيلم ونطاق العمل، فقارن خط الفيلم والضمان وما يشمله السعر وليس الرقم الأول فقط. نصوص الجهات الأخرى مترجمة من الإنجليزية.`
                : `Source: each provider's own website, read ${checkedOn}. Providers that publish no PPF price are not listed. Providers price by vehicle, film and scope, so compare the film line, warranty and what is included, not only the headline number.`}
            </p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              <li className="rounded-tile border border-(--color-brand)/45 bg-(--color-brand)/[0.09] p-4">
                <h3 className="text-footnote font-semibold text-(--color-text)">{abkRow.provider}</h3>
                <p className="mt-1.5 text-footnote font-medium text-(--color-text)">{abkRow.published}</p>
                <p className="mt-1.5 text-caption text-(--color-text-muted)">{abkRow.caveat}</p>
                <a href="#prices" className="mt-2 inline-block text-caption font-semibold text-(--color-link) hover:underline">
                  {ar ? "هذه الصفحة" : "This page"}
                </a>
              </li>
              {PPF_MARKET.map((row) => (
                <li key={row.provider} className="rounded-tile border border-(--color-border) bg-(--color-surface) p-4">
                  <h3 className="text-footnote font-semibold text-(--color-text)">{row.provider}</h3>
                  <p className="mt-1.5 text-footnote font-medium text-(--color-text)">{row.published[locale]}</p>
                  <p className="mt-1.5 text-caption text-(--color-text-muted)">{row.caveat[locale]}</p>
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-2 inline-block break-all text-caption font-semibold text-(--color-link) hover:underline"
                  >
                    {new URL(row.sourceUrl).host} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>
      </Container>
    </section>
  );
}
