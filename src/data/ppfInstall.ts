/**
 * Installed VTEK PPF packages — the retail "installed by a partner centre"
 * offer on /[locale]/b2c/ppf-installation.
 *
 * ABK sells the job and stands behind it; a VTEK-authorised partner centre in
 * Doha does the fitting. Partner centres are deliberately not named anywhere
 * on the site (owner decision 2026-10-02).
 *
 * Pure data + pure functions: the configurator (client) shows these prices
 * live, and the booking route (server) recomputes them from the same table so
 * a tampered request can never change the quoted price.
 *
 * Selling prices only. This repo is public — costs, installer fees and
 * margins must never be added here.
 */

import type { LocalizedText } from "./products";

export type BodyType = "sedan" | "suv" | "large-suv";
export type CoverageKey = "front-end" | "full-front" | "full-body" | "custom";
export type FilmKey = "pro" | "pro-plus" | "matte" | "prism";
export type PartKey =
  | "front-bumper"
  | "bonnet"
  | "front-fenders"
  | "headlights"
  | "mirrors"
  | "front-doors"
  | "rear-doors"
  | "rockers"
  | "roof"
  | "rear-quarters"
  | "boot"
  | "rear-bumper";

export const BODY_TYPES: Array<{ key: BodyType; name: LocalizedText; examples: LocalizedText }> = [
  {
    key: "sedan",
    name: { en: "Sedan / Coupe", ar: "سيدان / كوبيه" },
    examples: { en: "Camry, Accord, BMW 5 Series, Mustang", ar: "كامري، أكورد، بي إم دبليو الفئة 5، موستانج" },
  },
  {
    key: "suv",
    name: { en: "SUV / Crossover", ar: "SUV / كروس أوفر" },
    examples: { en: "RAV4, Prado, X5, Range Rover Sport", ar: "راف 4، برادو، X5، رينج روفر سبورت" },
  },
  {
    key: "large-suv",
    name: { en: "Large SUV / Pickup", ar: "SUV كبيرة / بيك أب" },
    examples: { en: "Land Cruiser, Patrol, Tahoe, G-Class", ar: "لاندكروزر، باترول، تاهو، جي كلاس" },
  },
];

/** Weather Armor PRO prices (QAR), updated 2026-10-04. */
export const PRESET_PRICES_QAR: Record<Exclude<CoverageKey, "custom">, Record<BodyType, number>> = {
  "front-end": { sedan: 899, suv: 1049, "large-suv": 1199 },
  "full-front": { sedan: 1599, suv: 1899, "large-suv": 2199 },
  "full-body": { sedan: 3999, suv: 4799, "large-suv": 5499 },
};

/** Weather Armor PRO PLUS and MATTE fixed package prices (QAR). */
export const FILM_PRESET_PRICES_QAR: Record<
  "pro-plus" | "matte",
  Record<Exclude<CoverageKey, "custom">, Record<BodyType, number>>
> = {
  "pro-plus": {
    "front-end": { sedan: 1099, suv: 1249, "large-suv": 1399 },
    "full-front": { sedan: 1899, suv: 2299, "large-suv": 2599 },
    "full-body": { sedan: 4799, suv: 5699, "large-suv": 6499 },
  },
  matte: {
    "front-end": { sedan: 1099, suv: 1249, "large-suv": 1399 },
    "full-front": { sedan: 1899, suv: 2299, "large-suv": 2599 },
    "full-body": { sedan: 4799, suv: 5699, "large-suv": 6499 },
  },
};

/** A single-part job still carries a booking, film delivery and a centre slot. */
export const CUSTOM_MINIMUM_QAR = 500;

export const COVERAGES: Array<{
  key: CoverageKey;
  name: LocalizedText;
  desc: LocalizedText;
}> = [
  {
    key: "front-end",
    name: { en: "Front-end Essential", ar: "الواجهة الأساسية" },
    desc: {
      en: "Front bumper, the leading edge of the bonnet and fenders, mirrors and headlights — where stone chips hit first.",
      ar: "الصدام الأمامي، الجزء الأمامي من الكبوت والرفارف، المرايا والمصابيح — حيث تصيب الحصى أولاً.",
    },
  },
  {
    key: "full-front",
    name: { en: "Full Front", ar: "الواجهة الكاملة" },
    desc: {
      en: "The whole bonnet, front bumper, both front fenders, mirrors and headlights — no visible film line on the bonnet.",
      ar: "الكبوت بالكامل، الصدام الأمامي، الرفرفان الأماميان، المرايا والمصابيح — دون خط ظاهر للفيلم على الكبوت.",
    },
  },
  {
    key: "full-body",
    name: { en: "Full Body", ar: "الهيكل بالكامل" },
    desc: {
      en: "Every painted panel, wrapped edge to edge — the complete shield against sand, chips and swirl marks.",
      ar: "جميع الألواح المطلية من الحافة إلى الحافة — حماية كاملة من الرمل والحصى وخدوش الغسيل.",
    },
  },
  {
    key: "custom",
    name: { en: "Choose parts", ar: "اختر القطع" },
    desc: {
      en: "Pick exactly the panels you want on the car diagram. Live estimate, confirmed on WhatsApp.",
      ar: "اختر القطع التي تريدها على مخطط السيارة. سعر تقديري فوري يُؤكَّد عبر واتساب.",
    },
  },
];

/**
 * Each part's share of the full-body price. The full-front parts add up to
 * exactly 0.40, so choosing them one by one costs the same as the preset;
 * the whole list slightly exceeds 1 and is capped at the full-body price.
 */
export const PARTS: Array<{ key: PartKey; name: LocalizedText; share: number }> = [
  { key: "front-bumper", name: { en: "Front bumper", ar: "الصدام الأمامي" }, share: 0.13 },
  { key: "bonnet", name: { en: "Bonnet (full)", ar: "الكبوت (كامل)" }, share: 0.13 },
  { key: "front-fenders", name: { en: "Front fenders", ar: "الرفارف الأمامية" }, share: 0.08 },
  { key: "headlights", name: { en: "Headlights", ar: "المصابيح الأمامية" }, share: 0.03 },
  { key: "mirrors", name: { en: "Side mirrors", ar: "المرايا الجانبية" }, share: 0.03 },
  { key: "front-doors", name: { en: "Front doors", ar: "الأبواب الأمامية" }, share: 0.1 },
  { key: "rear-doors", name: { en: "Rear doors", ar: "الأبواب الخلفية" }, share: 0.1 },
  { key: "rockers", name: { en: "Side skirts / rockers", ar: "العتبات الجانبية" }, share: 0.04 },
  { key: "roof", name: { en: "Roof & pillars", ar: "السقف والأعمدة" }, share: 0.1 },
  { key: "rear-quarters", name: { en: "Rear quarter panels", ar: "الرفارف الخلفية" }, share: 0.1 },
  { key: "boot", name: { en: "Boot / tailgate", ar: "الشنطة / الباب الخلفي" }, share: 0.07 },
  { key: "rear-bumper", name: { en: "Rear bumper", ar: "الصدام الخلفي" }, share: 0.1 },
];

export const PART_KEYS = PARTS.map((p) => p.key);

/** Parts each preset covers — drives the diagram highlight. */
export const PRESET_PARTS: Record<Exclude<CoverageKey, "custom">, PartKey[]> = {
  "front-end": ["front-bumper", "headlights", "mirrors"],
  "full-front": ["front-bumper", "bonnet", "front-fenders", "headlights", "mirrors"],
  "full-body": PART_KEYS,
};

/**
 * Films offered for installation. `uplift` is the price increase over PRO;
 * `null` means the job is quoted individually (PRISM colour change).
 * Warranty years follow the official VTEK e-warranty chart.
 */
export const FILMS: Array<{
  key: FilmKey;
  productSlug: string;
  name: LocalizedText;
  desc: LocalizedText;
  warrantyYears: number;
  uplift: number | null;
}> = [
  {
    key: "pro",
    productSlug: "vtek-ppf-weather-armor-pro",
    name: { en: "Weather Armor PRO", ar: "Weather Armor PRO" },
    desc: {
      en: "High-clarity gloss, heat-activated self-healing. The best value for daily drivers.",
      ar: "لمعان عالي الوضوح مع معالجة ذاتية بالحرارة. أفضل قيمة للاستخدام اليومي.",
    },
    warrantyYears: 10,
    uplift: 0,
  },
  {
    key: "pro-plus",
    productSlug: "vtek-ppf-weather-armor-pro-plus",
    name: { en: "Weather Armor PRO PLUS", ar: "Weather Armor PRO PLUS" },
    desc: {
      en: "Advanced high-density aliphatic TPU with extreme optical clarity, resilient self-healing and 12-year warranty.",
      ar: "فيلم TPU أليفاتي متطور عالي الكثافة بنقاء بصري فائق ومعالجة ذاتية مرنة وضمان ١٢ سنة.",
    },
    warrantyYears: 12,
    uplift: 0.18,
  },
  {
    key: "matte",
    productSlug: "vtek-ppf-weather-armor-matte",
    name: { en: "Weather Armor MATTE", ar: "Weather Armor MATTE" },
    desc: {
      en: "Satin, non-reflective finish — turns gloss paint matte, or protects factory matte paint.",
      ar: "لمسة ساتان غير لامعة — تحوّل الطلاء اللامع إلى مطفي أو تحمي الطلاء المطفي الأصلي.",
    },
    warrantyYears: 5,
    uplift: 0.18,
  },
  {
    key: "prism",
    productSlug: "vtek-ppf-weather-armor-prism",
    name: { en: "Weather Armor PRISM (colour)", ar: "Weather Armor PRISM (ملوّن)" },
    desc: {
      en: "Change your car's colour and protect it at the same time. Priced per car on WhatsApp.",
      ar: "غيّر لون سيارتك واحمِها في الوقت نفسه. يُسعَّر لكل سيارة عبر واتساب.",
    },
    warrantyYears: 5,
    uplift: null,
  },
];

/** ABK's own cover on the fitting (lifting, bubbles, edges) — separate from the film warranty. */
export const WORKMANSHIP_COVER_MONTHS = 12;

export type PpfSelection = {
  body: BodyType;
  coverage: CoverageKey;
  parts: PartKey[];
  film: FilmKey;
};

export type PpfQuote = {
  /** null when the job is priced individually (PRISM, or no parts chosen). */
  priceQar: number | null;
  /** Custom-parts totals are estimates; presets are fixed prices. */
  isEstimate: boolean;
};

const roundUp50 = (n: number) => Math.ceil(n / 50) * 50;

export function isBodyType(v: unknown): v is BodyType {
  return BODY_TYPES.some((b) => b.key === v);
}
export function isCoverage(v: unknown): v is CoverageKey {
  return COVERAGES.some((c) => c.key === v);
}
export function isFilm(v: unknown): v is FilmKey {
  return FILMS.some((f) => f.key === v) || v === "ultimate";
}
export function isPart(v: unknown): v is PartKey {
  return PARTS.some((p) => p.key === v);
}

/** Price of a PRO job before any film upgrade. */
function proPrice(sel: PpfSelection): number | null {
  if (sel.coverage !== "custom") return PRESET_PRICES_QAR[sel.coverage][sel.body];
  if (sel.parts.length === 0) return null;
  const fullBody = PRESET_PRICES_QAR["full-body"][sel.body];
  const share = PARTS.filter((p) => sel.parts.includes(p.key)).reduce((s, p) => s + p.share, 0);
  return Math.min(fullBody, Math.max(CUSTOM_MINIMUM_QAR, roundUp50(fullBody * share)));
}

export function quotePpf(sel: PpfSelection): PpfQuote {
  const filmKey = ((sel.film as string) === "ultimate" ? "pro-plus" : sel.film) as FilmKey;
  const film = FILMS.find((f) => f.key === filmKey);
  const isEstimate = sel.coverage === "custom";
  if (!film || film.uplift === null) return { priceQar: null, isEstimate };

  if (sel.coverage !== "custom") {
    if (filmKey === "pro") {
      return { priceQar: PRESET_PRICES_QAR[sel.coverage][sel.body], isEstimate: false };
    }
    if (filmKey === "pro-plus" || filmKey === "matte") {
      return { priceQar: FILM_PRESET_PRICES_QAR[filmKey][sel.coverage][sel.body], isEstimate: false };
    }
  }

  const base = proPrice(sel);
  if (base === null) return { priceQar: null, isEstimate };
  return {
    priceQar: film.uplift === 0 ? base : roundUp50(base * (1 + film.uplift)),
    isEstimate,
  };
}

/** Lowest PRO price per coverage — the "From QAR …" on each card. */
export function fromPrice(coverage: Exclude<CoverageKey, "custom">): number {
  return Math.min(...Object.values(PRESET_PRICES_QAR[coverage]));
}

/**
 * Shown as "Prices updated …" next to the price list. Bump it whenever
 * PRESET_PRICES_QAR or a film uplift changes — and update the same figures in
 * public/llms.txt and public/llms-full.txt, which are static files.
 */
export const PRICES_UPDATED_AT = "2026-10-04";

export type PresetCoverage = Exclude<CoverageKey, "custom">;
export const PRESET_COVERAGES: PresetCoverage[] = ["front-end", "full-front", "full-body"];

/**
 * Every fixed price, film by film — the server-rendered price list, the
 * Service offer catalogue and the cost guide all read from here, so a crawler
 * that never runs the configurator still sees the same numbers it would.
 * PRISM is left out: it is priced per car.
 */
export type PresetPrice = {
  coverage: PresetCoverage;
  body: BodyType;
  film: FilmKey;
  priceQar: number;
};

export function presetPriceList(): PresetPrice[] {
  const out: PresetPrice[] = [];
  for (const film of FILMS) {
    for (const coverage of PRESET_COVERAGES) {
      for (const { key: body } of BODY_TYPES) {
        const { priceQar } = quotePpf({ body, coverage, parts: [], film: film.key });
        if (priceQar !== null) out.push({ coverage, body, film: film.key, priceQar });
      }
    }
  }
  return out;
}

// Same alphabet as makeOrderRef in src/lib/cart.ts (no 0/O or 1/I/L — the
// reference gets read aloud and retyped). Kept here because cart.ts is a
// client module and the booking route generates references on the server.
const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function makeBookingRef(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  let code = "";
  for (const b of bytes) code += REF_ALPHABET[b % REF_ALPHABET.length];
  return `PPF-${code}`;
}
