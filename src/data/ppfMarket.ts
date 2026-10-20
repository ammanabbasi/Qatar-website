/**
 * Doha PPF market comparison — ONLY figures a provider publishes itself.
 *
 * Earlier versions of the comparison table and of public/llms*.txt carried
 * estimated ranges per vehicle size, "public rate card" labels and rows for
 * businesses whose sites publish no PPF price at all. None of it was
 * checkable, the two files disagreed with each other, and AI answer engines
 * quote this kind of table. Every row below is a price statement taken from
 * the provider's own page, with the URL it was read at and the date.
 * Nothing is estimated, rounded or inferred, and providers that publish no
 * price are simply not listed.
 *
 * To refresh: open each `sourceUrl`, compare the statement, bump
 * `PPF_MARKET_CHECKED_AT`. Remove a row whose page no longer shows a price.
 * Never add a figure that is not on the page.
 */

import type { LocalizedText } from "./products";

/** Date every row below was last read from the provider's own page. */
export const PPF_MARKET_CHECKED_AT = "2026-10-20";

export type MarketRow = {
  provider: string;
  /** Where the statement was read. */
  sourceUrl: string;
  /** The provider's own statement of price, close to verbatim. */
  published: LocalizedText;
  /** What changes how the price should be read (bundles, stock, missing specs). */
  caveat: LocalizedText;
};

export const PPF_MARKET: MarketRow[] = [
  {
    provider: "White Crown Care",
    sourceUrl: "https://whitecrowncare.com/en/services/protection-film/",
    published: {
      en: "PPF prices at White Crown start from QAR 2,500 for front-end protection and QAR 6,999 for full-car protection.",
      ar: "تبدأ أسعار PPF لدى White Crown من 2,500 ر.ق للحماية الأمامية ومن 6,999 ر.ق لحماية السيارة بالكامل.",
    },
    caveat: {
      en: "Its packages also bundle other services (ceramic coating, window tint, windscreen film). The two prices list a 10-year warranty and name no film brand; a QAR 8,999 full-body XPEL package is listed with a lifetime warranty.",
      ar: "تشمل باقاتها خدمات أخرى (طلاء سيراميك وتظليل وفيلم للزجاج الأمامي). ويذكر السعران ضمان 10 سنوات دون ذكر علامة الفيلم، وتُعرض باقة هيكل كامل بفيلم XPEL بسعر 8,999 ر.ق مع ضمان مدى الحياة.",
    },
  },
  {
    provider: "ProDip",
    sourceUrl: "https://prodip.qa/en/services/ppf",
    published: {
      en: "Pricing starts from QAR 5,500 and depends on coverage (partial front or full body) and body size.",
      ar: "تبدأ الأسعار من 5,500 ر.ق وتعتمد على التغطية (واجهة جزئية أو هيكل كامل) وحجم السيارة.",
    },
    caveat: {
      en: "No film brand, thickness or warranty term is published; the page says a quality PPF installation lasts 5–7 years with proper care.",
      ar: "لا تُنشر علامة الفيلم ولا سماكته ولا مدة الضمان؛ وتذكر الصفحة أن التركيب الجيد يدوم من 5 إلى 7 سنوات مع العناية الصحيحة.",
    },
  },
  {
    provider: "EV Care Qatar",
    sourceUrl: "https://evcare.qa/product/14425/ppf-installation-advanced",
    published: {
      en: "PPF INSTALLATION BASIC: QAR 5,999 (was 7,990). PPF INSTALLATION ADVANCED: QAR 6,999 (was 8,999). The installation only includes the outside body.",
      ar: "PPF INSTALLATION BASIC: ‏5,999 ر.ق (كان 7,990). PPF INSTALLATION ADVANCED: ‏6,999 ر.ق (كان 8,999). يشمل التركيب الجزء الخارجي من الهيكل فقط.",
    },
    caveat: {
      en: "Both products showed “Out of stock” when read; no film brand, thickness, warranty or vehicle size is published.",
      ar: "ظهر المنتجان بحالة «نفد من المخزون» عند القراءة؛ ولا تُنشر علامة الفيلم ولا السماكة ولا الضمان ولا حجم السيارة.",
    },
  },
];
