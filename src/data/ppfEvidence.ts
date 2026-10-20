/**
 * Evidence behind the trust claims on /[locale]/b2c/ppf-installation.
 *
 * Every statement here is either (a) something a third party publishes and the
 * visitor can open — VTEK's own pages and ABK's Google listing, each with the
 * URL and the date it was read — or (b) a commitment ABK makes in its own
 * booking terms (src/app/[locale]/terms, messages Terms.section4Body). The
 * page, the FAQ and public/llms*.txt all read this file, so a claim cannot say
 * one thing on the page and another to an AI crawler.
 *
 * Do NOT add a claim that has no source: no film thickness or "aliphatic"
 * wording (VTEK publishes neither for its current films), no description of
 * the partner centre's premises or tooling, no "exclusive" or "official"
 * wording that VTEK's pages do not use. The partner centres stay unnamed
 * (owner decision 2026-10-02); the installer is shown to the customer on
 * their VTEK e-warranty record instead.
 *
 * To refresh: open each URL below, compare it with the copy, bump
 * EVIDENCE_CHECKED_AT. A page that no longer says it means the copy must go.
 */

import type { LocalizedText } from "./products";
import { SITE } from "@/lib/constants";
import { formatNumber } from "@/lib/pricing";

/** Date the VTEK pages and the Google listing below were last read. */
export const EVIDENCE_CHECKED_AT = "2026-10-20";

export const VTEK_URLS = {
  /** Warranty period per film, coverage wording, claim process. */
  warranty: "https://www.vtekfilms.com/warranty",
  /** Regional contacts — the Qatar entry is ABK's showroom address and phone. */
  contact: "https://www.vtekfilms.com/contact-us",
  /** Weather Armor film descriptions. */
  films: "https://www.vtekfilms.com/weather-armor",
  /** Aftercare, thickness, paint-cure and transfer answers. */
  faq: "https://www.vtekfilms.com/faq",
  /** NFC e-Warranty check: asks for the vehicle plate number and a phone number. */
  eWarrantyCheck: "https://nfc.vtekfilms.com/verify",
} as const;

/**
 * Rating on ABK's Google Business Profile, read from the Maps listing on
 * EVIDENCE_CHECKED_AT. It is the showroom's overall rating, not a PPF-only
 * one. Shown as text with a link; deliberately NOT emitted as schema.org
 * review markup (Google ignores self-served ratings for local businesses).
 */
export const GOOGLE_REVIEWS = { rating: 4.9, count: 11, url: SITE.mapsUrl } as const;

/**
 * "10 years" / "١٠ سنوات". Arabic counted nouns follow the number: 3-10 take
 * the plural (سنوات), 11 and up the singular (سنة). Digits match formatQar().
 */
export function yearsPhrase(n: number, locale: "en" | "ar"): string {
  if (locale === "en") return n === 1 ? "1 year" : `${formatNumber(n, "en")} years`;
  if (n === 1) return "سنة واحدة";
  if (n === 2) return "سنتان";
  return `${formatNumber(n, "ar")} ${n >= 3 && n <= 10 ? "سنوات" : "سنة"}`;
}

/** Stable anchor on /terms for the PPF booking terms (Terms section 4). */
export const TERMS_PPF_PATH = "/terms#ppf-bookings";

export type Proof = {
  label: LocalizedText;
  href: string;
  /** In-site path (rendered with the locale-aware Link) instead of an outside URL. */
  internal?: boolean;
};

export type TrustProof = {
  key: "listed" | "registered" | "manufacturer" | "fitting" | "reviews";
  title: LocalizedText;
  body: LocalizedText;
  proof: Proof;
};

const rating = (l: "en" | "ar") => (l === "ar" ? formatNumber(GOOGLE_REVIEWS.rating, "ar") : String(GOOGLE_REVIEWS.rating));
const count = (l: "en" | "ar") => formatNumber(GOOGLE_REVIEWS.count, l);

/** The five checkable proofs shown directly under the hero. */
export const TRUST_PROOFS: TrustProof[] = [
  {
    key: "listed",
    title: { en: "Listed by VTEK in Qatar", ar: "مُدرَجون لدى VTEK في قطر" },
    body: {
      en: "VTEK's own contact page lists our Mesaimeer showroom address and phone number as its Qatar contact.",
      ar: "تُدرج صفحة التواصل لدى VTEK عنوان معرضنا في مسيمير ورقم هاتفنا كجهة التواصل الخاصة بها في قطر.",
    },
    proof: {
      label: { en: "Open vtekfilms.com/contact-us", ar: "افتح vtekfilms.com/contact-us" },
      href: VTEK_URLS.contact,
    },
  },
  {
    key: "registered",
    title: { en: "Registered in VTEK's system", ar: "مسجَّل في نظام VTEK" },
    body: {
      en: "Every job is registered on VTEK's NFC e-Warranty, which shows the film, the date and the installer. Check it with your plate and phone number.",
      ar: "يُسجَّل كل عمل في الضمان الإلكتروني NFC لدى VTEK، ويعرض الفيلم والتاريخ والمُركّب. تحقق منه برقم لوحة سيارتك ورقم هاتفك.",
    },
    proof: {
      label: { en: "Check an e-warranty", ar: "تحقق من الضمان الإلكتروني" },
      href: VTEK_URLS.eWarrantyCheck,
    },
  },
  {
    key: "manufacturer",
    title: { en: "VTEK film warranty, 5–15 years", ar: "ضمان VTEK للفيلم من 5 إلى 15 سنة" },
    body: {
      en: "VTEK covers film fitted by an authorised installer against manufacturing defects such as bubbling, cracking, peeling and fading.",
      ar: "تضمن VTEK الفيلم المركّب لدى مُركّب معتمد ضد عيوب التصنيع مثل الفقاعات والتشقق والتقشّر وبهتان اللون.",
    },
    proof: {
      label: { en: "Read VTEK's warranty terms", ar: "اقرأ شروط ضمان VTEK" },
      href: VTEK_URLS.warranty,
    },
  },
  {
    key: "fitting",
    title: { en: "12-month ABK fitting guarantee", ar: "ضمان تركيب من ABK لمدة 12 شهراً" },
    body: {
      en: "ABK puts right lifting edges, bubbles and edge failure for 12 months from handover. You deal with ABK, not the installer.",
      ar: "تعالج ABK ارتفاع الحواف والفقاعات وانفصال الحواف لمدة 12 شهراً من التسليم. تتعامل معنا مباشرة لا مع المُركّب.",
    },
    proof: {
      label: { en: "Read the booking terms", ar: "اقرأ شروط الحجز" },
      href: TERMS_PPF_PATH,
      internal: true,
    },
  },
  {
    key: "reviews",
    title: {
      en: `${rating("en")} on Google · ${count("en")} reviews`,
      ar: `تقييم ${rating("ar")} على Google · ${count("ar")} مراجعة`,
    },
    body: {
      en: "Rating of ABK's Mesaimeer showroom on Google Maps.",
      ar: "تقييم معرض ABK في مسيمير على خرائط Google.",
    },
    proof: {
      label: { en: "See the reviews on Google", ar: "اطّلع على المراجعات في Google" },
      href: GOOGLE_REVIEWS.url,
    },
  },
];

/** How a customer checks the film on VTEK's own portal (field labels read on the live page). */
export const VERIFY_STEPS: LocalizedText[] = [
  { en: "Open nfc.vtekfilms.com/verify.", ar: "افتح nfc.vtekfilms.com/verify." },
  {
    en: "Enter your car's plate number and your phone number.",
    ar: "أدخل رقم لوحة سيارتك ورقم هاتفك.",
  },
  {
    en: "Choose Verify Coverage. VTEK's digital warranty shows the product installed, the installation date, the installer's details and the warranty terms and status.",
    ar: "اختر Verify Coverage. يعرض الضمان الرقمي لدى VTEK المنتج المركّب وتاريخ التركيب وبيانات المُركّب وشروط الضمان وحالته.",
  },
];

/** What happens if something goes wrong, in the order VTEK's own claim process runs. */
export const CLAIM_STEPS: LocalizedText[] = [
  {
    en: "Message ABK on WhatsApp with photos of the problem.",
    ar: "راسل ABK على واتساب مع صور للمشكلة.",
  },
  {
    en: "We inspect it and arrange the repair with the installer. Covered fitting problems in the first 12 months are put right at no cost.",
    ar: "نفحصها ونرتّب الإصلاح مع المُركّب. مشكلات التركيب المشمولة خلال أول 12 شهراً تُعالج دون أي تكلفة.",
  },
  {
    en: "For a film defect we take the claim to VTEK. VTEK's terms start every claim with the original installer, and VTEK makes the final decision on whether it is a manufacturing defect.",
    ar: "في حال عيب في الفيلم نرفع المطالبة إلى VTEK. تبدأ شروط VTEK كل مطالبة بالمُركّب الأصلي، وتقرر VTEK بشكل نهائي ما إذا كان العيب عيب تصنيع.",
  },
];

/** Who fits the car — the claims ABK can stand behind without naming the centre. */
export const INSTALLER_POINTS: LocalizedText[] = [
  {
    en: "A VTEK-authorised installer in Doha, booked and managed by ABK. VTEK's warranty only covers film professionally installed by authorised installers, so that is the only kind of fitting we sell.",
    ar: "مُركّب معتمد من VTEK في الدوحة تحجزه وتديره ABK. لا يشمل ضمان VTEK إلا الفيلم المركّب باحتراف لدى مُركّبين معتمدين، ولذلك هذا هو النوع الوحيد من التركيب الذي نبيعه.",
  },
  {
    en: "The installer's details are recorded on your VTEK e-warranty, so you can see who fitted the film.",
    ar: "تُسجَّل بيانات المُركّب في ضمان VTEK الإلكتروني الخاص بك، فتعرف من ركّب الفيلم.",
  },
  {
    en: "Photos of the car at drop-off, an ABK inspection of the finish at handover, and your warranty registered before the car leaves.",
    ar: "صور للسيارة عند التسليم، وفحص من ABK لجودة التركيب عند الاستلام، وتسجيل ضمانك قبل مغادرة السيارة.",
  },
];

/**
 * What VTEK itself says about each film it sells to ABK (vtekfilms.com/weather-armor,
 * read 2026-10-20), paraphrased. PRO PLUS has no page of its own on VTEK's site —
 * VTEK's list shows a single PRO / "PRO+" gloss film — so no feature is claimed for it.
 */
export const FILM_FACTS: Record<
  "pro" | "pro-plus" | "matte" | "prism",
  { finish: LocalizedText; vtek: LocalizedText }
> = {
  pro: {
    finish: { en: "Gloss", ar: "لامع" },
    vtek: {
      en: "VTEK describes PRO as a balance of protection, gloss and flexibility, with excellent optical clarity.",
      ar: "تصف VTEK فيلم PRO بأنه توازن بين الحماية واللمعان والمرونة، مع شفافية بصرية ممتازة.",
    },
  },
  "pro-plus": {
    finish: { en: "Gloss, step-up grade", ar: "لامع، فئة أعلى" },
    vtek: {
      en: "The step-up gloss grade above PRO, priced higher. Ask us on WhatsApp what it adds for your car.",
      ar: "فئة اللمعان الأعلى من PRO وبسعر أعلى. اسألنا عبر واتساب عمّا تضيفه لسيارتك.",
    },
  },
  matte: {
    finish: { en: "Satin matte", ar: "ساتان مطفي" },
    vtek: {
      en: "VTEK describes a bold, non-reflective satin finish that resists UV, road salt and grime.",
      ar: "تصفه VTEK بلمسة ساتان مطفية غير عاكسة تقاوم الأشعة فوق البنفسجية وملح الطرق والأوساخ.",
    },
  },
  prism: {
    finish: { en: "Colour change", ar: "تغيير اللون" },
    vtek: {
      en: "VTEK describes colour options that restyle the car while protecting it from scratches, chips and stains.",
      ar: "تصفه VTEK بخيارات ألوان تغيّر مظهر السيارة مع حمايتها من الخدوش والحصى والبقع.",
    },
  },
};
