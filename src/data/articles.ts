import {
  BODY_TYPES,
  COVERAGES,
  CUSTOM_MINIMUM_QAR,
  FILMS,
  FILM_PRESET_PRICES_QAR,
  PRESET_PRICES_QAR,
  PRICES_UPDATED_AT,
  fromPrice,
  quotePpf,
} from "./ppfInstall";
import {
  DELIVERY,
  DISCOUNT_ENTRY,
  DISCOUNT_TOP,
  formatNumber,
  formatQar,
} from "@/lib/pricing";
import type { CategoryKey } from "./products";

/**
 * Blog article data — SEO-targeted content hub.
 * Each article targets a high-value keyword cluster that ABK isn't ranking for.
 * Articles render as full pages with their own meta, JSON-LD (Article schema),
 * and internal links back to products/services.
 */

/** A crawlable comparison table rendered under a section's paragraph. */
export type ArticleTable = {
  caption: { en: string; ar: string };
  head: Array<{ en: string; ar: string }>;
  /** One row per item; each cell is localised text. */
  rows: Array<Array<{ en: string; ar: string }>>;
  /** Where the figures come from, e.g. "Official brand pages, checked 20 Oct 2026". */
  source?: { en: string; ar: string };
};

export type Article = {
  slug: string;
  title: { en: string; ar: string };
  /**
   * `<title>` / og:title when the on-page H1 is too long for a SERP. Google
   * shows ~60 characters, so the keyword-bearing part must fit in that.
   */
  seoTitle?: { en: string; ar: string };
  description: { en: string; ar: string };
  date: string; // ISO date
  readingTime: number; // minutes
  category: string;
  /**
   * Catalogue categories the guide is genuinely useful for. Drives the
   * "Guides" strip on category, brand and product pages (see `relatedGuides`),
   * which is how each guide earns internal links beyond the blog index.
   */
  topics: CategoryKey[];
  keywords: { en: string[]; ar: string[] };
  sections: Array<{
    heading: { en: string; ar: string };
    body: { en: string; ar: string };
    table?: ArticleTable;
  }>;
  /** Product slugs to cross-link at the bottom */
  relatedProducts: string[];
  /** Last meaningful edit — feeds dateModified and the sitemap lastmod. */
  updated?: string;
  /** Call to action rendered after the body (e.g. the installed-PPF page). */
  cta?: {
    href: string;
    title: { en: string; ar: string };
    body: { en: string; ar: string };
    action: { en: string; ar: string };
  };
  /** Contextual mid-article conversion module rendered after section 2. */
  inlineCta?: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    body: { en: string; ar: string };
    primaryHref: string;
    primaryLabel: { en: string; ar: string };
    primaryExternal?: boolean;
    secondaryHref?: string;
    secondaryLabel?: { en: string; ar: string };
  };
  /** Structured FAQ pairs rendered visibly at the bottom and emitted as FAQPage JSON-LD. */
  faqs: Array<{
    q: { en: string; ar: string };
    a: { en: string; ar: string };
  }>;
};

// Prices in the PPF articles are read from ppfInstall.ts, so the guide can
// never quote a figure the quote builder no longer shows.
const q = (n: number, l: "en" | "ar") => formatQar(n, l);
const P = PRESET_PRICES_QAR;
const pro = FILMS.find((f) => f.key === "pro")!;
const proPlus = FILMS.find((f) => f.key === "pro-plus")!;
const matte = FILMS.find((f) => f.key === "matte")!;
const prism = FILMS.find((f) => f.key === "prism")!;
const M = FILM_PRESET_PRICES_QAR.matte;
const proPlusFullBodySedan = quotePpf({
  body: "sedan",
  coverage: "full-body",
  parts: [],
  film: "pro-plus",
}).priceQar!;
const proPlusFullBodySuv = quotePpf({
  body: "suv",
  coverage: "full-body",
  parts: [],
  film: "pro-plus",
}).priceQar!;
const proPlusFullBodyLargeSuv = quotePpf({
  body: "large-suv",
  coverage: "full-body",
  parts: [],
  film: "pro-plus",
}).priceQar!;
const pricesAsOf = (l: "en" | "ar") =>
  new Date(PRICES_UPDATED_AT).toLocaleDateString(l === "ar" ? "ar-QA" : "en-QA", {
    year: "numeric",
    month: "long",
  });

/** Shared by every article that talks about having PPF fitted. */
const PPF_INSTALL_CTA: NonNullable<Article["cta"]> = {
  href: "/b2c/ppf-installation",
  title: {
    en: "Want PPF fitted? See the installed prices.",
    ar: "تريد تركيب PPF؟ اطّلع على أسعار التركيب.",
  },
  body: {
    en: `Genuine VTEK film from ABK, fitted at a VTEK-authorised centre in Doha with a 12-month workmanship cover — from ${q(fromPrice("front-end"), "en")} for a front-end kit and ${q(fromPrice("full-body"), "en")} for a full body.`,
    ar: `فيلم VTEK أصلي من ABK يُركَّب في مركز معتمد من VTEK في الدوحة مع ضمان تركيب لمدة 12 شهراً — من ${q(fromPrice("front-end"), "ar")} للواجهة الأساسية و${q(fromPrice("full-body"), "ar")} للهيكل بالكامل.`,
  },
  action: { en: "Build your quote", ar: "احسب السعر" },
};

export const ARTICLES: Article[] = [
  {
    slug: "ppf-cost-qatar",
    title: {
      en: "How Much Does PPF Cost in Qatar? (2026 Price Guide)",
      ar: "كم تكلفة فيلم حماية الطلاء PPF في قطر؟ (دليل الأسعار 2026)",
    },
    description: {
      en: `PPF prices in Qatar for 2026: installed VTEK film from ${q(fromPrice("front-end"), "en")} (front-end), ${q(fromPrice("full-front"), "en")} (full front) and ${q(fromPrice("full-body"), "en")} (full body) — what drives the cost and how to compare quotes in Doha.`,
      ar: `أسعار فيلم حماية الطلاء في قطر لعام 2026: تركيب فيلم VTEK من ${q(fromPrice("front-end"), "ar")} للواجهة الأساسية و${q(fromPrice("full-front"), "ar")} للواجهة الكاملة و${q(fromPrice("full-body"), "ar")} للهيكل بالكامل — ما الذي يحدد التكلفة وكيف تقارن العروض في الدوحة.`,
    },
    date: "2026-10-02",
    updated: "2026-10-20",
    readingTime: 5,
    category: "buying-guide",
    topics: ["film"],
    keywords: {
      en: ["PPF price Qatar", "PPF cost Doha", "paint protection film price Qatar", "full body PPF price Qatar", "VTEK PPF price", "PPF installation Doha"],
      ar: ["سعر PPF قطر", "تكلفة فيلم حماية الطلاء الدوحة", "سعر حماية الطلاء للسيارات قطر", "سعر تركيب PPF الدوحة"],
    },
    sections: [
      {
        heading: {
          en: "PPF Prices in Qatar at a Glance",
          ar: "أسعار PPF في قطر باختصار",
        },
        body: {
          en: `These are ABK's fixed installed prices for genuine VTEK Weather Armor PRO film (${pro.warrantyYears}-year warranty), as of ${pricesAsOf("en")}. Front-end kit: ${q(P["front-end"].sedan, "en")} for a sedan or coupe, ${q(P["front-end"].suv, "en")} for an SUV and ${q(P["front-end"]["large-suv"], "en")} for a large SUV or pickup. Full front: ${q(P["full-front"].sedan, "en")}, ${q(P["full-front"].suv, "en")} and ${q(P["full-front"]["large-suv"], "en")}. Full body: ${q(P["full-body"].sedan, "en")}, ${q(P["full-body"].suv, "en")} and ${q(P["full-body"]["large-suv"], "en")}. PRO PLUS film (${proPlus.warrantyYears}-year warranty) and MATTE film (5-year warranty) have fixed full-body prices of ${q(proPlusFullBodySedan, "en")} (sedan), ${q(proPlusFullBodySuv, "en")} (Mid SUV), and ${q(proPlusFullBodyLargeSuv, "en")} (Large SUV). PRISM colour film is priced per car. Every price includes the film, fitting at a VTEK-authorised centre in Doha, VTEK NFC e-Warranty registration and a 12-month ABK workmanship cover.`,
          ar: `هذه أسعار التركيب الثابتة لدى ABK لفيلم VTEK Weather Armor PRO الأصلي (ضمان ${pro.warrantyYears} سنوات)، حتى ${pricesAsOf("ar")}. الواجهة الأساسية: ${q(P["front-end"].sedan, "ar")} للسيدان أو الكوبيه، و${q(P["front-end"].suv, "ar")} لسيارات SUV، و${q(P["front-end"]["large-suv"], "ar")} لسيارات SUV الكبيرة أو البيك أب. الواجهة الكاملة: ${q(P["full-front"].sedan, "ar")} و${q(P["full-front"].suv, "ar")} و${q(P["full-front"]["large-suv"], "ar")}. الهيكل بالكامل: ${q(P["full-body"].sedan, "ar")} و${q(P["full-body"].suv, "ar")} و${q(P["full-body"]["large-suv"], "ar")}. وتبلغ أسعار الهيكل الكامل الثابتة لفيلمي PRO PLUS (ضمان ${proPlus.warrantyYears} ${proPlus.warrantyYears <= 10 ? "سنوات" : "سنة"}) وMATTE (ضمان 5 سنوات): ${q(proPlusFullBodySedan, "ar")} للسيدان، و${q(proPlusFullBodySuv, "ar")} لـ SUV المتوسطة، و${q(proPlusFullBodyLargeSuv, "ar")} لـ SUV الكبيرة. ويُسعَّر فيلم PRISM الملوّن لكل سيارة. يشمل كل سعر الفيلم والتركيب في مركز معتمد من VTEK في الدوحة وتسجيل الضمان الإلكتروني NFC وضمان تركيب من ABK لمدة 12 شهراً.`,
        },
      },
      {
        heading: {
          en: "What Drives the Price of PPF",
          ar: "ما الذي يحدد سعر PPF",
        },
        body: {
          en: "Four things set the price of a PPF job. Coverage matters most: a front-end kit protects the bumper and the leading edges, a full front adds the whole bonnet and fenders, and a full body wraps every painted panel. Vehicle size comes next — a Land Cruiser or Patrol simply needs more film and more hours than a Camry. Then the film grade: thicker, glossier films with longer warranties cost more per metre. Finally the car's condition: old film or a wrap has to be removed first, and paint with heavy swirls or etching should be corrected before film goes on, because PPF seals in whatever is underneath it.",
          ar: "أربعة عوامل تحدد سعر أي عملية تركيب PPF. التغطية هي الأهم: الواجهة الأساسية تحمي الصدام والحواف الأمامية، والواجهة الكاملة تضيف الكبوت والرفارف بالكامل، والهيكل بالكامل يغطي كل لوح مطلي. ثم حجم السيارة — فلاندكروزر أو باترول تحتاج ببساطة فيلماً أكثر وساعات عمل أطول من كامري. ثم فئة الفيلم: الأفلام الأسمك والأكثر لمعاناً بضمان أطول أغلى للمتر. وأخيراً حالة السيارة: يجب إزالة الفيلم أو التغليف القديم أولاً، والطلاء الذي فيه دوائر أو حفر واضحة يُفضَّل تصحيحه قبل التركيب، لأن PPF يثبّت ما تحته كما هو.",
        },
      },
      {
        heading: {
          en: "Front-End, Full Front or Full Body?",
          ar: "واجهة أساسية أم واجهة كاملة أم هيكل كامل؟",
        },
        body: {
          en: `A front-end kit (from ${q(fromPrice("front-end"), "en")}) is the entry point: it takes the first hit from stones on the bumper, mirrors and headlights. A full front (from ${q(fromPrice("full-front"), "en")}) suits highway commuters because it covers the whole bonnet with no visible film line. A full body (from ${q(fromPrice("full-body"), "en")}) adds the doors, sides, roof and rear against sand abrasion, parking scuffs and wash swirls — the choice for a new or high-value car you plan to keep. If you only want certain panels, they can be priced individually from ${q(CUSTOM_MINIMUM_QAR, "en")}.`,
          ar: `الواجهة الأساسية (من ${q(fromPrice("front-end"), "ar")}) هي نقطة البداية: تتلقى الضربة الأولى من الحصى على الصدام والمرايا والمصابيح. والواجهة الكاملة (من ${q(fromPrice("full-front"), "ar")}) تناسب من يقود كثيراً على الطرق السريعة لأنها تغطي الكبوت كاملاً دون خط ظاهر للفيلم. أما الهيكل بالكامل (من ${q(fromPrice("full-body"), "ar")}) فيضيف الأبواب والجوانب والسقف والخلفية لحمايتها من احتكاك الرمل وخدوش المواقف ودوائر الغسيل — وهو خيار السيارة الجديدة أو عالية القيمة التي تنوي الاحتفاظ بها. وإن أردت قطعاً محددة فقط، يمكن تسعيرها منفردة بدءاً من ${q(CUSTOM_MINIMUM_QAR, "ar")}.`,
        },
      },
      {
        heading: {
          en: "How to Compare PPF Quotes in Doha",
          ar: "كيف تقارن عروض أسعار PPF في الدوحة",
        },
        body: {
          en: "Two quotes are only comparable when they describe the same job. Ask every installer five things: which brand and which film line they will use (and to see the roll label); whether they are authorised by that brand, since film warranties usually depend on it; whether the warranty is registered to your car; how long they guarantee their own workmanship and what that covers; and exactly which panels and edges are included. A price that does not name the film, or a warranty that exists only verbally, is a warning sign — cheap unbranded film is what yellows, cracks and lifts in Qatar's summer.",
          ar: "لا يمكن مقارنة عرضين إلا إذا وصفا العمل نفسه. اسأل أي مُركّب خمسة أسئلة: ما العلامة التجارية وما خط الفيلم الذي سيستخدمه (واطلب رؤية ملصق الرول)؛ وهل هو معتمد من تلك العلامة، إذ يعتمد ضمان الفيلم عادةً على ذلك؛ وهل يُسجَّل الضمان باسم سيارتك؛ وكم مدة ضمانه لجودة التركيب وماذا يغطي؛ وما القطع والحواف المشمولة بالضبط. السعر الذي لا يذكر اسم الفيلم، أو الضمان الشفهي فقط، علامة تحذير — فالأفلام الرخيصة مجهولة المصدر هي التي تصفرّ وتتشقق وتنفصل في صيف قطر.",
        },
      },
      {
        heading: {
          en: "Why ABK Publishes Fixed Prices",
          ar: "لماذا تعلن ABK أسعاراً ثابتة",
        },
        body: {
          en: "ABK is the authorised VTEK distributor in Qatar, so the film on your car comes straight from our stock rather than through a reseller, and the installed price is set before you book: for a preset package on a car with factory paint, the price in the quote builder is the price you pay. Every job is fitted by a VTEK-authorised installer, photographed at drop-off, inspected by ABK before handover and covered twice — by VTEK's film warranty and by ABK's own 12-month workmanship cover. You deal with one contact from quote to handover.",
          ar: "ABK هي الموزع المعتمد لأفلام VTEK في قطر، لذا يأتي الفيلم على سيارتك من مخزوننا مباشرة لا عبر وسيط، ويُحدَّد سعر التركيب قبل الحجز: للباقات الجاهزة على سيارة بطلاء المصنع، السعر في أداة التسعير هو السعر الذي تدفعه. يُركَّب كل فيلم لدى مُركّب معتمد من VTEK، وتُصوَّر السيارة عند الاستلام، وتفحصها ABK قبل التسليم، وتحظى بضمانين — ضمان VTEK للفيلم وضمان ABK للتركيب لمدة 12 شهراً. وتتعامل مع جهة تواصل واحدة من عرض السعر حتى التسليم.",
        },
      },
      {
        heading: {
          en: "Get the Exact Price for Your Car",
          ar: "احصل على السعر الدقيق لسيارتك",
        },
        body: {
          en: "Use the quote builder on the PPF installation page: choose your car, the coverage and the film and the installed price appears instantly. Send it to us on WhatsApp (+974 3083 8355) and we confirm the slot. Payment is in full by bank transfer or cash once the slot is confirmed, with a full refund if you cancel at least 48 hours before.",
          ar: "استخدم أداة التسعير في صفحة تركيب أفلام الحماية: اختر سيارتك والتغطية والفيلم ليظهر سعر التركيب فوراً. أرسله إلينا عبر واتساب (+974 3083 8355) ونؤكد لك الموعد. يتم الدفع كاملاً بتحويل بنكي أو نقداً بعد تأكيد الموعد، مع استرداد كامل عند الإلغاء قبل 48 ساعة على الأقل.",
        },
      },
    ],
    relatedProducts: [
      "vtek-ppf-weather-armor-pro",
      "vtek-ppf-weather-armor-pro-plus",
      "vtek-ppf-weather-armor-matte",
      "vtek-ppf-weather-armor-prism",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Instant Online Calculator", ar: "حاسبة الأسعار الفورية" },
      title: {
        en: "Calculate Your Exact Installed VTEK PPF Price in 30 Seconds",
        ar: "احسب سعر تركيب فيلم VTEK الأصلي لسيارتك خلال 30 ثانية",
      },
      body: {
        en: "Select your vehicle body type (Sedan, SUV, or Large 4x4), coverage tier, and VTEK film grade to see your fixed installed price in Doha with a 5–15 year film warranty.",
        ar: "اختر حجم سيارتك (سيدان، SUV، أو دفع رباعي كبير) ومستوى التغطية وفئة فيلم VTEK لمعرفة سعر التركيب الثابت في الدوحة مع ضمان للفيلم من 5 إلى 15 سنة.",
      },
      primaryHref: "/b2c/ppf-installation",
      primaryLabel: { en: "Open PPF Price Calculator", ar: "افتح حاسبة أسعار PPF" },
      secondaryHref: "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20would%20like%20a%20VTEK%20PPF%20quote%20for%20my%20car.",
      secondaryLabel: { en: "Ask on WhatsApp (+974 3083 8355)", ar: "استفسر عبر واتساب" },
    },
    faqs: [
      {
        q: {
          en: "How much does full body PPF cost in Qatar in 2026?",
          ar: "كم سعر تركيب PPF للهيكل الكامل في قطر لعام 2026؟",
        },
        a: {
          en: `At ABK Trading & Service in Doha, installed full-body VTEK Weather Armor PRO PPF (10-year warranty) costs ${q(P["full-body"].sedan, "en")} for a sedan/coupe, ${q(P["full-body"].suv, "en")} for a medium SUV, and ${q(P["full-body"]["large-suv"], "en")} for a large SUV or pickup. Front-end packages start from ${q(fromPrice("front-end"), "en")} and full-front packages start from ${q(fromPrice("full-front"), "en")}.`,
          ar: `في شركة ABK للتجارة والخدمات بالدوحة، يبلغ سعر تركيب فيلم VTEK Weather Armor PRO للهيكل الكامل (ضمان 10 سنوات) ${q(P["full-body"].sedan, "ar")} للسيدان والكوبيه، و${q(P["full-body"].suv, "ar")} لسيارات SUV المتوسطة، و${q(P["full-body"]["large-suv"], "ar")} لسيارات الدفع الرباعي الكبيرة والبيك أب. وتبدأ باقات الواجهة الأساسية من ${q(fromPrice("front-end"), "ar")} والواجهة الكاملة من ${q(fromPrice("full-front"), "ar")}.`,
        },
      },
      {
        q: {
          en: "What is included in ABK's installed PPF price?",
          ar: "ماذا يشمل سعر تركيب PPF لدى ABK؟",
        },
        a: {
          en: "Every published price includes genuine VTEK Weather Armor film from ABK's own stock, installation by a VTEK-authorised installer in Doha, VTEK NFC e-Warranty registered to your car (10 years on PRO and PRO PLUS, 5 on MATTE and PRISM), and ABK's 12-month fitting guarantee against edge lifting or bubbling.",
          ar: "يشمل كل سعر معلن فيلم VTEK Weather Armor الأصلي من مخزون ABK، والتركيب لدى مُركّب معتمد من VTEK في الدوحة، وتسجيل ضمان VTEK الإلكتروني NFC باسم سيارتك (10 سنوات لـ PRO وPRO PLUS و5 لـ MATTE وPRISM)، بالإضافة إلى ضمان ABK لجودة التركيب لمدة 12 شهراً.",
        },
      },
      {
        q: {
          en: "Can I buy VTEK or Grizzly PPF rolls directly without installation?",
          ar: "هل يمكنني شراء رولات PPF مباشرة بدون تركيب؟",
        },
        a: {
          en: "Yes. ABK is the authorized Qatar distributor and supplies 1.52m × 15m master rolls of VTEK Weather Armor and Grizzly TPU PPF starting from QAR 1,200 directly from our Mesaimeer showroom.",
          ar: "نعم، ABK هي الموزع المعتمد في قطر وتوفر رولات 1.52×15 متر من أفلام VTEK Weather Armor وGrizzly TPU PPF ابتداءً من 1,200 ر.ق مباشرة من معرضنا في مسيمير.",
        },
      },
    ],
  },
  {
    slug: "window-tinting-rules-qatar-guide",
    title: {
      en: "Window Tinting in Qatar: Rules, Metrash Permits & Choosing the Right Film (2026 Guide)",
      ar: "تظليل النوافذ في قطر: القوانين وتصاريح مطراش واختيار الفيلم المناسب (دليل 2026)",
    },
    seoTitle: {
      en: "Car Window Tinting Rules in Qatar (2026): Limits & Permits",
      ar: "قوانين تظليل السيارات في قطر 2026: النسب المسموحة والتصاريح",
    },
    description: {
      en: "What tint percentage is legal in Qatar? A practical 2026 guide to MOI tint limits (20% front side windows), how to apply for a tint permit in Metrash, QR 1,000 fines, Fahes inspection, and VTEK ceramic tint.",
      ar: "ما نسبة التظليل القانونية في قطر؟ دليل عملي 2026 لقوانين وزارة الداخلية وتصاريح التظليل عبر مطراش والغرامات وفحص فاحص وأفلام VTEK العازلة للحرارة.",
    },
    date: "2026-06-12",
    updated: "2026-10-17",
    readingTime: 7,
    category: "guide",
    topics: ["film", "interior"],
    keywords: {
      en: [
        "window tinting Qatar",
        "car tint law Qatar",
        "tint percentage Qatar",
        "tint allowed in Qatar",
        "car tinting Qatar limits",
        "how to apply car tint in Metrash Qatar",
        "Qatar window tint fine penalty",
        "window tint Doha",
      ],
      ar: [
        "تظليل النوافذ قطر",
        "قانون تظليل السيارات قطر",
        "نسبة التظليل المسموحة قطر",
        "تصريح تظليل مطراش قطر",
        "غرامة التظليل في قطر",
        "تظليل سيارات الدوحة",
      ],
    },
    sections: [
      {
        heading: {
          en: "Why Window Tint is Essential in Qatar",
          ar: "لماذا يعد تظليل النوافذ ضرورياً في قطر",
        },
        body: {
          en: "In a country where summer cabin temperatures can exceed 70°C in direct sun, window tint is not cosmetic — it is functional protection. A quality film rejects a large share of solar heat before it enters the cabin, which means cooler seats and steering wheel, less strain on your air conditioning, lower fuel consumption, and slower fading of leather and dashboard plastics. Tint also blocks more than 99% of UV radiation, protecting both your skin on long commutes and your car's interior trim. The difference between a cheap dyed film and a quality ceramic or carbon film is dramatic in Qatar: cheap films fade to purple, bubble in the heat, and reject far less infrared energy.",
          ar: "في بلد تتجاوز فيه حرارة مقصورة السيارة 70 درجة مئوية تحت الشمس المباشرة صيفاً، ليس تظليل النوافذ أمراً تجميلياً — بل حماية وظيفية. يحجب الفيلم عالي الجودة نسبة كبيرة من الحرارة الشمسية قبل دخولها المقصورة، ما يعني مقاعد ومقود أبرد، وضغطاً أقل على المكيف، واستهلاكاً أقل للوقود، وبهتاناً أبطأ للجلد والبلاستيك الداخلي. كما يحجب التظليل أكثر من 99% من الأشعة فوق البنفسجية، فيحمي بشرتك في الرحلات الطويلة والتجهيزات الداخلية لسيارتك. الفرق بين الفيلم المصبوغ الرخيص والفيلم السيراميكي أو الكربوني عالي الجودة هائل في قطر: الأفلام الرخيصة يتحول لونها إلى البنفسجي وتتكون فيها فقاعات بفعل الحرارة وتعزل حرارة أقل بكثير.",
        },
      },
      {
        heading: {
          en: "What Tint Levels Does Qatar Allow?",
          ar: "ما درجات التظليل المسموحة في قطر؟",
        },
        body: {
          en: "Qatar's Ministry of Interior (General Directorate of Traffic) regulates how dark vehicle glass may be. Under the rules in force in 2026, private family and sedan/SUV vehicles are generally permitted up to 20% tint darkness (80% VLT) on the front driver and passenger side windows, only a light top sun-strip on the front windshield (no full-windshield dark tint), and darker privacy shading on the rear passenger side windows and rear screen provided both side mirrors offer clear visibility. Sports cars and two-door coupes face stricter limits where dark rear or side tinting is restricted without a special permit. Reflective, mirrored, or metallic-finish films are strictly prohibited on all windows. At ABK we stock VTEK Solar Armor nano-ceramic films in VLT grades engineered to comply with Qatar's traffic regulations while blocking up to 95% of infrared heat.",
          ar: "تنظم وزارة الداخلية القطرية (الإدارة العامة للمرور) درجة قتامة زجاج المركبات. وفق القواعد السارية في 2026، يُسمح للمركبات الخاصة العائلية والسيدان والدفع الرباعي عموماً بنسبة تظليل تصل إلى 20% قتامة (80% نفاذية ضوء VLT) على النوافذ الجانبية الأمامية للسائق والراكب، وشريط علوي خفيف فقط على الزجاج الأمامي، ودرجة أغمق للنوافذ الجانبية الخلفية والزجاج الخلفي بشرط وضوح الرؤية عبر المرايا الجانبية. وتخضع السيارات الرياضية وذات البابين لقيود أشد تمنع التظليل الغامق دون تصريح خاص، كما يُمنع التظليل العاكس أو المعدني كلياً. في ABK نوفر أفلام VTEK Solar Armor السيراميكية بدرجات نفاذية ضوء متوافقة مع اللوائح القطرية وتعزل حتى 95% من الأشعة تحت الحمراء.",
        },
      },
      {
        heading: {
          en: "How to Apply for a Car Tint Permit in Metrash (Step-by-Step)",
          ar: "كيفية التقديم على تصريح تظليل السيارة عبر تطبيق مطراش (خطوة بخطوة)",
        },
        body: {
          en: "Drivers who require darker window tinting than the standard 20% front-side limit — most commonly for documented medical conditions such as lupus, severe photosensitivity, or ophthalmic disorders — must obtain an official MOI Window Tinting Permit before fitting dark film. To apply and pay in the Metrash app: (1) Obtain an official medical report from Hamad Medical Corporation (HMC) or an approved Ministry of Public Health clinic stating the medical necessity for UV/light protection; (2) Open the Metrash app and log in with your QID; (3) Navigate to Traffic → Vehicle Services → Issue/Renew Window Tinting Permit; (4) Enter the vehicle plate number, verify Istimara (registration) ownership, and upload the medical report; (5) Once reviewed and approved by the General Directorate of Traffic, pay the applicable permit fee directly inside Metrash using a debit or credit card. The electronic permit links to your vehicle plate so traffic patrols and Fahes inspectors can verify it automatically.",
          ar: "يمكن للسائقين الذين يحتاجون نسبة تظليل أعلى من الحد القياسي (20% للنوافذ الأمامية) — وغالباً لأسباب طبية موثقة مثل الحساسية الضوئية الشديدة أو أمراض العيون والجلد — استخراج تصريح تظليل رسمي من وزارة الداخلية قبل تركيب الفيلم الغامق. للتقديم والدفع عبر تطبيق مطراش: (1) استخرج تقريراً طبياً معتمداً من مؤسسة حمد الطبية أو جهة صحية معتمدة من وزارة الصحة العامة يثبت الحاجة الطبية للوقاية من أشعة الشمس؛ (2) افتح تطبيق مطراش وسجّل الدخول بالبطاقة الشخصية؛ (3) انتقل إلى المرور ← خدمات المركبات ← إصدار/تجديد تصريح تظليل؛ (4) أدخل رقم لوحة المركبة وتأكد من سريان الاستمارة ثم أرفق التقرير الطبي؛ (5) بعد مراجعة الطلب والموافقة عليه من الإدارة العامة للمرور، سدد رسوم التصريح إلكترونياً داخل التطبيق ليُربط التصريح برقم المركبة تلقائياً لدى الدوريات وفحص فاحص.",
        },
      },
      {
        heading: {
          en: "Illegal Tint Fines, Penalties and Fahes Inspection",
          ar: "غرامات التظليل المخالف والعقوبات وفحص فاحص السنوي",
        },
        body: {
          en: "Driving with non-compliant window tint in Qatar without a valid Metrash permit carries strict penalties under the Qatar Traffic Law: traffic violations for illegal window tinting typically result in a fine of QR 1,000 to QR 3,000 depending on the violation severity, mandatory removal of the non-compliant film, and potential vehicle impoundment. In addition, any vehicle with excessive front-side or windshield tint will automatically fail its annual Fahes (Woqod) technical inspection until the film is stripped and adhesive residue is cleaned. The smart alternative is installing legal-VLT nano-ceramic film from day one: because ceramic particles block invisible infrared heat rather than visible light, a legal 70%–80% VLT ceramic film keeps your cabin cooler than an illegal 5% dyed film without ever risking a traffic fine.",
          ar: "القيادة بتظليل مخالف للحدود القانونية في قطر دون تصريح ساري المفعول عبر مطراش تعرض السائق لعقوبات مشددة وفق قانون المرور القطري؛ حيث تتراوح غرامة مخالفة التظليل عادةً بين 1,000 و3,000 ريال قطري بحسب نوع المخالفة، مع إلزامية إزالة الفيلم المخالف واحتمال حجز المركبة. وعلاوة على ذلك، ترسب أي مركبة تحمل تظليلاً زائداً على النوافذ الأمامية أو الزجاج الأمامي تلقائياً في الفحص الفني السنوي (فاحص / وقود) حتى يُزال الفيلم وتُنظف بقايا الصمغ. البديل الذكي هو تركيب فيلم نانو سيراميك بنفاذية ضوء قانونية من البداية؛ فحبيبات السيراميك تعزل الأشعة تحت الحمراء غير المرئية المسببة للحرارة، ما يمنحك مقصورة باردة واجتيازاً مضموناً لفحص فاحص دون أي غرامة.",
        },
      },
      {
        heading: {
          en: "VLT, IR Rejection and Other Numbers Explained",
          ar: "شرح نفاذية الضوء وعزل الأشعة تحت الحمراء وبقية الأرقام",
        },
        body: {
          en: "Tint shopping comes with jargon. VLT (visible light transmission) is the percentage of visible light that passes through — a 70%–80% VLT film is nearly clear and legal on front windows, whereas a 5% VLT film is limousine-dark. Heat rejection numbers split into TSER (total solar energy rejected) and IR rejection (the infrared portion you feel as burning skin heat). VTEK Solar Armor window films — available at ABK in three tiers: Solar Armor VUE, Solar Armor APEX, and flagship Solar Armor ICONIC — deliver 99%+ UV protection and up to 95% infrared heat rejection even in high-VLT legal shades.",
          ar: "يأتي شراء التظليل مصحوباً بمصطلحات تقنية. نفاذية الضوء المرئي (VLT) هي نسبة الضوء المرئي الذي يمر عبر الفيلم — فيلم بنفاذية 70%–80% يكاد يكون شفافاً ومتوافقاً مع القانون للنوافذ الأمامية، بينما فيلم 5% غامق كزجاج الليموزين. أما أرقام العزل الحراري فتنقسم إلى إجمالي الطاقة الشمسية المرفوضة (TSER) وعزل الأشعة تحت الحمراء (IRR). توفر أفلام تظليل VTEK Solar Armor المتوفرة لدى ABK بثلاث فئات (Solar Armor VUE وSolar Armor APEX والفئة الرائدة Solar Armor ICONIC) حجباً للأشعة فوق البنفسجية بنسبة +99% وعزلاً للأشعة تحت الحمراء يصل إلى 95% حتى في الدرجات الفاتحة القانونية.",
        },
      },
      {
        heading: {
          en: "Film and Fitting Supplies in Mesaimeer, Doha",
          ar: "أفلام ومستلزمات تركيب في مسيمير، الدوحة",
        },
        body: {
          en: "A film is only as good as its installation. Dust trapped under the film, stretched edges, and bubbling are the marks of rushed work — and in Qatar's heat, poor installations fail fast. At ABK Trading and Service in Mesaimeer we supply VTEK Solar Armor window tints along with PPF installation gels, glass cleaners, and application tools for workshops and car owners across Qatar. Message us on WhatsApp at +974 30838355 for VTEK Solar Armor roll specifications and VLT recommendations for your car model.",
          ar: "جودة الفيلم من جودة تركيبه. الغبار المحتجز تحت الفيلم والحواف المشدودة والفقاعات علامات على عمل متسرّع — وفي حرارة قطر تفشل التركيبات الرديئة سريعاً. في ABK للتجارة والخدمات بمسيمير نوفر أفلام تظليل VTEK Solar Armor مع محاليل التركيب ومنظفات الزجاج وأدوات التطبيق للمراكز وملاك السيارات في قطر. راسلنا على واتساب +974 30838355 لمعرفة مواصفات رولات VTEK Solar Armor ودرجات النفاذية المناسبة لسيارتك.",
        },
      },
    ],
    relatedProducts: [
      "vtek-window-tints",
      "vtek-solar-armor-apex",
      "vtek-solar-armor-iconic",
      "briller-glass-cleaner",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Qatar Legal-VLT Nano-Ceramic Tint", ar: "عازل حراري نانو سيراميك مطابق للمرور" },
      title: {
        en: "Block 95% of Qatar's Infrared Heat Without Risking a Traffic Fine",
        ar: "اعزل 95% من حرارة شمس قطر بدرجات قانونية تجتاز فحص فاحص",
      },
      body: {
        en: "ABK stocks genuine VTEK Solar Armor (VUE, APEX & ICONIC) nano-ceramic window tint rolls in Mesaimeer, Doha — engineered for high IR heat rejection in legal 70%–80% VLT front-window shades.",
        ar: "توفر ABK أفلام تظليل النانو سيراميك الأصلية VTEK Solar Armor (VUE وAPEX وICONIC) في معرض مسيمير بالدوحة — عزل حراري فائق للأشعة تحت الحمراء بدرجات نفاذية قانونية (70%–80% VLT).",
      },
      primaryHref: "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20want%20to%20enquire%20about%20legal-VLT%20VTEK%20Solar%20Armor%20window%20tint%20in%20Qatar.",
      primaryLabel: { en: "Enquire on WhatsApp (+974 3083 8355)", ar: "اطلب عبر واتساب (+974 3083 8355)" },
      primaryExternal: true,
      secondaryHref: "/b2c/categories/film",
      secondaryLabel: { en: "Browse VTEK Window Tint & PPF", ar: "تصفح أفلام التظليل والحماية VTEK" },
    },
    faqs: [
      {
        q: {
          en: "What percentage of car window tint is allowed in Qatar?",
          ar: "ما هي نسبة تظليل السيارات المسموح بها في قطر؟",
        },
        a: {
          en: "Under Qatar's Ministry of Interior (MOI) traffic rules, private sedans and SUVs are permitted up to 20% tint darkness (80% VLT) on the front driver and passenger side windows and a top sun-strip on the windshield. Rear passenger windows and the rear windshield can carry darker privacy shading on family vehicles provided side mirrors offer clear visibility. Reflective or metallic mirror tint is prohibited on all windows.",
          ar: "وفق لوائح الإدارة العامة للمرور بوزارة الداخلية القطرية، يُسمح للسيارات الخاصة العائلية والسيدان والدفع الرباعي بنسبة تظليل تصل إلى 20% قتامة (80% نفاذية ضوء VLT) على النوافذ الأمامية الجانبية للسائق والراكب وشريط علوي خفيف على الزجاج الأمامي، مع السماح بدرجة أغمق للنوافذ الخلفية بشرط وضوح الرؤية عبر المرايا الجانبية، ويُمنع التظليل العاكس أو المعدني نهائياً.",
        },
      },
      {
        q: {
          en: "How do I apply for and pay for a car window tint permit in Metrash?",
          ar: "كيف أقدم على تصريح تظليل السيارة وأسدد الرسوم في تطبيق مطراش؟",
        },
        a: {
          en: "Obtain an official medical report from Hamad Medical Corporation (HMC) or an MOPH-approved clinic confirming medical need for UV protection. Open the Metrash app, go to Traffic → Vehicle Services → Issue/Renew Window Tinting Permit, enter your plate number, upload the medical report, and once approved by the Traffic Department, pay the permit fee directly inside Metrash by card.",
          ar: "استخرج تقريراً طبياً معتمداً من مؤسسة حمد الطبية أو جهة صحية معتمدة من وزارة الصحة العامة، ثم افتح تطبيق مطراش وانتقل إلى المرور ← خدمات المركبات ← إصدار/تجديد تصريح تظليل، وأدخل رقم اللوحة وأرفق التقرير الطبي، وبعد الموافقة سدد رسوم التصريح إلكترونياً داخل تطبيق مطراش.",
        },
      },
      {
        q: {
          en: "What is the fine for illegal car window tinting in Qatar?",
          ar: "كم مخالفة وغرامة التظليل غير القانوني في قطر؟",
        },
        a: {
          en: "Driving with illegal window tinting in Qatar without an approved Metrash permit carries a traffic fine typically ranging from QR 1,000 to QR 3,000, mandatory removal of the non-compliant film, potential vehicle impoundment, and automatic failure at the annual Fahes (Woqod) inspection.",
          ar: "تتراوح غرامة مخالفة تظليل النوافذ بدون تصريح مطراش في قطر عادةً بين 1,000 و3,000 ريال قطري مع إلزامية إزالة الفيلم المخالف واحتمال حجز المركبة والرسوب في الفحص الفني السنوي (فاحص).",
        },
      },
    ],
  },
  {
    slug: "ceramic-coating-cost-qatar",
    title: {
      en: "How Much Does Ceramic Coating Cost in Qatar? (2026 Price Guide for Sedans & SUVs)",
      ar: "كم تكلفة الطلاء السيراميكي في قطر؟ (دليل أسعار 2026 للسيدان والدفع الرباعي)",
    },
    seoTitle: {
      en: "How Much Does Ceramic Coating Cost in Qatar? (2026)",
      ar: "كم تكلفة الطلاء السيراميكي في قطر؟ (دليل أسعار 2026)",
    },
    description: {
      en: "2026 ceramic coating prices in Qatar for sedans, medium SUVs and large 4x4s — Doha studio ranges (QAR 800–3,200), Autotriz 9H kit prices (QAR 250–280), and how to compare quotes.",
      ar: "أسعار الطلاء السيراميكي في قطر لعام 2026 للسيدان وسيارات SUV المتوسطة والكبيرة — نطاقات الأسعار في الدوحة وأسعار أطقم Autotriz 9H الأصلية.",
    },
    date: "2026-06-11",
    updated: "2026-10-17",
    readingTime: 6,
    category: "buying-guide",
    topics: ["ceramic", "polish"],
    keywords: {
      en: [
        "ceramic coating price Qatar",
        "ceramic coating cost Doha",
        "ceramic coating price in Qatar for SUV medium size",
        "car ceramic Qatar",
        "nano ceramic Doha price",
        "Autotriz ceramic coating Qatar",
      ],
      ar: [
        "سعر السيراميك للسيارات قطر",
        "تكلفة طلاء سيراميك الدوحة",
        "سعر نانو سيراميك للدفع الرباعي قطر",
        "نانو سيراميك قطر",
      ],
    },
    sections: [
      {
        heading: {
          en: "What Actually Determines the Price",
          ar: "ما الذي يحدد السعر فعلياً",
        },
        body: {
          en: "Ceramic coating quotes in Doha vary widely because the work behind them varies widely. The main cost drivers are: vehicle size (a Land Cruiser or Patrol takes far more product and labour than a sedan or compact crossover), paint condition (a brand-new car may need only a single-stage gloss enhancement polish, while a sun-damaged daily driver needs multi-stage paint correction with cutting compounds before any coating can bond), the coating chemistry itself (true German 9H SiO2/3D-matrix professional ceramics with multi-year durability cost more than consumer spray sealants), the number of cured layers, and whether wheel faces, glass, and leather trim are included.",
          ar: "تتفاوت عروض أسعار السيراميك في الدوحة بشدة لأن العمل وراءها يتفاوت بشدة. أبرز محددات التكلفة: حجم المركبة (لاند كروزر أو باترول يستهلك منتجاً وجهداً أكبر بكثير من السيدان أو الكروس أوفر)، وحالة الطلاء (سيارة جديدة قد تكتفي بتلميع خفيف بمرحلة واحدة، بينما تحتاج سيارة متضررة من الشمس إلى تصحيح طلاء متعدد المراحل قبل أي طلاء)، وكيمياء منتج السيراميك نفسه (السيراميك الألماني الاحترافي الحقيقي بصلابة 9H ومتانة لسنوات أغلى من البخاخات الاستهلاكية)، وعدد الطبقات، وما إذا كانت الباقة تشمل الجنوط والزجاج والجلد الداخلي.",
        },
      },
      {
        heading: {
          en: "Typical Ceramic Coating Prices in Doha by Vehicle Size (Sedan, Medium SUV & Large 4x4)",
          ar: "متوسط أسعار الطلاء السيراميكي في الدوحة حسب حجم السيارة (سيدان، SUV متوسطة، دفع رباعي كبير)",
        },
        body: {
          en: "Across reputable detailing studios in Doha, full ceramic coating packages (including decontamination wash, machine polish, and 9H nano-ceramic application) typically fall into three vehicle-size brackets: (1) Sedans, Hatchbacks & Coupes: QAR 800 to QAR 1,800 depending on single-stage vs two-stage paint correction and 1-year vs 3–5-year coating durability; (2) Medium SUVs & Crossovers (e.g., Toyota Prado, Jetour T2, Porsche Cayenne, Nissan X-Trail, Range Rover Sport): QAR 1,200 to QAR 2,500 for a full exterior 9H multi-layer package with single- or two-stage polish; (3) Large SUVs & Pickups (e.g., Toyota Land Cruiser 300, Nissan Patrol, Lexus LX, GMC Yukon, Ford F-150): QAR 1,600 to QAR 3,200+ due to the larger surface area and roof/panel prep time. If you are buying the genuine German ceramic coating kit directly to supply your detailer or apply yourself, ABK stocks Autotriz REVO +15 Ceramic Coating (50ml) at QAR 250, Autotriz ION+ +15 Ceramic Coating (50ml) at QAR 250, Autotriz 3D Matrix Hybrid (50ml kit) at QAR 280, and flagship Autotriz 3D Matrix Ultra (50ml kit) at QAR 280, plus Autotriz Leather & Vinyl Coating (50ml) at QAR 280.",
          ar: "في مراكز التلميع المعتمدة في الدوحة، تنقسم أسعار باقات الطلاء السيراميكي الكاملة (شاملة الغسيل التفصيلي، والتلميع الآلي لتصحيح الطلاء، وتطبيق النانو سيراميك 9H) عادةً إلى ثلاث فئات حسب حجم المركبة: (1) سيارات السيدان والكوبيه والهاتشباك: من 800 إلى 1,800 ريال قطري بحسب مراحل تصحيح الطلاء ومدة ضمان السيراميك؛ (2) سيارات الدفع الرباعي المتوسطة والكروس أوفر (مثل تويوتا برادو، جيتور T2، بورش كايين، نيسان إكس تريل، رينج روفر سبورت): من 1,200 إلى 2,500 ريال قطري لباقة سيراميك 9H متعددة الطبقات مع تلميع؛ (3) سيارات الدفع الرباعي الكبيرة والبيك أب (مثل لاند كروزر، نيسان باترول، لكزس LX، جمسي يوكون): من 1,600 إلى 3,200+ ريال قطري نظراً لكبر المساحة السطحية. أما إذا رغبت بشراء أطقم السيراميك الألماني الأصلي مباشرة من الموزع لتزويد مركز التلميع أو للتطبيق الشخصي، فتوفر ABK في معرض مسيمير: Autotriz REVO +15 (عبوة 50 مل) بسعر 250 ر.ق، وAutotriz ION+ +15 (عبوة 50 مل) بسعر 250 ر.ق، وAutotriz 3D Matrix Hybrid (طقم 50 مل) بسعر 280 ر.ق، والفئة الرائدة Autotriz 3D Matrix Ultra (طقم 50 مل) بسعر 280 ر.ق.",
        },
      },
      {
        heading: {
          en: "Professional Application vs Buying Ceramic Kits Direct",
          ar: "التطبيق الاحترافي مقابل شراء أطقم السيراميك مباشرة",
        },
        body: {
          en: "Consumer and professional ceramic kits can deliver outstanding results when paint is properly prepped with a dual-action polisher (using compounds like Autotriz Extreme Cut 801 or Power Cut 701 followed by Autotriz Ultimate Polish 302). Because ceramic coating locks in whatever is underneath, any swirl marks or hard-water etching must be levelled before coating. Many smart car owners in Qatar buy their genuine Autotriz 3D Matrix Ultra or REVO kit directly from ABK in Mesaimeer (QAR 250–280) so they know 100% authentic German 9H chemistry is going onto their paint, or pair it with installed VTEK PPF (from QAR 899 front-end / QAR 3,999 full body).",
          ar: "تحقق أطقم السيراميك الاحترافية نتائج مذهلة عند تحضير الطلاء جيداً بآلة تلميع مزدوجة الحركة (باستخدام مركبات مثل Autotriz Extreme Cut 801 أو Power Cut 701 ثم ملمع التشطيب Autotriz Ultimate Polish 302). ولأن السيراميك يثبّت ما تحته، يجب إزالة دوائر الغسيل وبقع الماء قبل تطبيق الطبقة. يفضّل كثير من ملاك السيارات في قطر شراء طقم Autotriz 3D Matrix Ultra أو REVO الأصلي مباشرة من معرض ABK في مسيمير (250–280 ر.ق) لضمان استخدام منتج ألماني أصلي 100% بصلابة 9H، أو جمعه مع تركيب أفلام الحماية VTEK PPF (ابتداءً من 899 ر.ق للواجهة و3,999 ر.ق للهيكل الكامل).",
        },
      },
      {
        heading: {
          en: "Is Ceramic Coating Worth It in Qatar?",
          ar: "هل يستحق السيراميك تكلفته في قطر؟",
        },
        body: {
          en: "Run the numbers over three years. An unprotected daily driver in Doha needs frequent washing to fight dust, suffers hard-water etching from every careless rinse, and loses gloss to UV oxidation — costs that show up at resale time. A ceramic-coated car sheds dust and water, cuts washing time and frequency roughly in half, resists water-spot etching, and keeps showroom gloss years longer. For most owners keeping a car more than two years in Qatar's climate, the coating pays for itself in reduced maintenance and preserved resale value — and that is before counting the time saved every single wash.",
          ar: "احسبها على ثلاث سنوات. السيارة اليومية غير المحمية في الدوحة تحتاج غسيلاً متكرراً لمقاومة الغبار، وتعاني حفر الماء العسر بعد كل شطف مهمل، وتفقد لمعانها بأكسدة الأشعة فوق البنفسجية — وكلها تكاليف تظهر عند إعادة البيع. أما السيارة المطلية بالسيراميك فتطرد الغبار والماء، وتختصر وقت الغسيل وتكراره إلى النصف تقريباً، وتقاوم حفر بقع الماء، وتحافظ على لمعان المعرض سنوات أطول. لمعظم الملاك الذين يحتفظون بسياراتهم أكثر من سنتين في مناخ قطر، يسترد السيراميك تكلفته من الصيانة الأقل وقيمة إعادة البيع المحفوظة — قبل حتى حساب الوقت الموفَّر في كل غسلة.",
        },
      },
      {
        heading: {
          en: "Buy Genuine Autotriz Ceramic Coatings in Mesaimeer, Doha",
          ar: "اشترِ أطقم سيراميك Autotriz الأصلية في مسيمير، الدوحة",
        },
        body: {
          en: "ABK Trading & Service in Mesaimeer, Doha is the authorized Qatar distributor for Autotriz German nano-ceramic coatings, polishing compounds, and GrünesAuto pads. Order online or message us on WhatsApp at +974 30838355 with your vehicle model and year — we will recommend the right Autotriz ceramic kit (QAR 250–280) or quote an installed VTEK PPF package for your car. Visit our showroom Saturday to Thursday, 10:00–13:00 and 16:00–22:00.",
          ar: "شركة ABK للتجارة والخدمات في مسيمير، الدوحة هي الموزع المعتمد في قطر لطلاءات النانو سيراميك الألمانية Autotriz ومركبات التلميع وإسفنجات GrünesAuto. اطلب عبر الموقع أو راسلنا على واتساب +974 30838355 بطراز سيارتك وسنوصيك بطقم السيراميك المناسب (250–280 ر.ق) أو بعرض سعر تركيب أفلام الحماية VTEK PPF. تفضل بزيارة معرضنا من السبت إلى الخميس، 10:00–13:00 و16:00–22:00.",
        },
      },
    ],
    relatedProducts: [
      "autotriz-revo-ceramic-coating",
      "autotriz-ion-plus-ceramic-coating",
      "autotriz-3d-matrix-ultra",
      "autotriz-3d-matrix-hybrid",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Genuine German 9H Ceramic Kits", ar: "أطقم سيراميك ألمانية أصلية 9H" },
      title: {
        en: "Buy Autotriz 9H Nano-Ceramic Kits Direct in Doha (QAR 250–280)",
        ar: "اشترِ أطقم النانو سيراميك الألمانية Autotriz 9H مباشرة في الدوحة (250–280 ر.ق)",
      },
      body: {
        en: "Whether you supply your own detailer or run a studio, get 100% genuine German Autotriz REVO +15 (QAR 250), ION+ +15 (QAR 250), or 3D Matrix Ultra/Hybrid (QAR 280) from ABK's Mesaimeer showroom.",
        ar: "سواء كنت تزود مركز التلميع أو تطبق بنفسك، احصل على أطقم السيراميك الألمانية الأصلية Autotriz REVO +15 (250 ر.ق) و3D Matrix Ultra/Hybrid (280 ر.ق) مباشرة من معرض ABK في مسيمير.",
      },
      primaryHref: "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20would%20like%20to%20order%20an%20Autotriz%209H%20Ceramic%20Coating%20kit%20in%20Qatar.",
      primaryLabel: { en: "Order Kit on WhatsApp (+974 3083 8355)", ar: "اطلب الطقم عبر واتساب" },
      primaryExternal: true,
      secondaryHref: "/b2c/categories/ceramic",
      secondaryLabel: { en: "Browse All Ceramic Coatings", ar: "تصفح جميع أطقم السيراميك" },
    },
    faqs: [
      {
        q: {
          en: "How much does ceramic coating cost in Qatar for a medium-size SUV?",
          ar: "كم تكلفة الطلاء السيراميكي في قطر لسيارات الدفع الرباعي المتوسطة (SUV)؟",
        },
        a: {
          en: "In Doha detailing studios, a full 9H ceramic coating package (including decontamination wash, machine polish, and multi-layer coating) for a medium SUV (such as a Toyota Prado, Jetour T2, Porsche Cayenne, or Range Rover Sport) typically costs QAR 1,200 to QAR 2,500. Sedans range from QAR 800 to QAR 1,800, and large 4x4s (Land Cruiser, Patrol, Yukon) range from QAR 1,600 to QAR 3,200+. If you buy the genuine German Autotriz 9H ceramic kit directly from ABK in Mesaimeer, 50ml kits cost QAR 250 to QAR 280.",
          ar: "في مراكز التلميع بالدوحة، تتراوح تكلفة باقة النانو سيراميك 9H الكاملة (شاملة الغسيل التفصيلي والتلميع الآلي) لسيارة SUV متوسطة (مثل تويوتا برادو، جيتور T2، بورش كايين، أو رينج روفر سبورت) بين 1,200 و2,500 ريال قطري. وتتراوح للسيدان بين 800 و1,800 ر.ق، وللدفع الرباعي الكبير (لاند كروزر وباترول) بين 1,600 و3,200+ ر.ق. وعند شراء طقم السيراميك الألماني الأصلي Autotriz مباشرة من معرض ABK في مسيمير يبلغ سعر الطقم (50 مل) من 250 إلى 280 ر.ق.",
        },
      },
      {
        q: {
          en: "Which Autotriz ceramic coating kit is best for Qatar's climate?",
          ar: "أي طقم سيراميك من Autotriz هو الأفضل لمناخ قطر؟",
        },
        a: {
          en: "Autotriz 3D Matrix Ultra (50ml kit: QAR 280) and Autotriz 3D Matrix Hybrid (50ml kit: QAR 280) offer the highest crosslinking density and chemical/UV resistance for 50°C Gulf summers, while Autotriz REVO +15 (50ml: QAR 250) and ION+ +15 (50ml: QAR 250) provide extreme hydrophobic water-beading to prevent hard-water mineral spots.",
          ar: "يوفر كل من Autotriz 3D Matrix Ultra (طقم 50 مل: 280 ر.ق) وAutotriz 3D Matrix Hybrid (طقم 50 مل: 280 ر.ق) أعلى كثافة ترابط ومقاومة للأشعة فوق البنفسجية والحرارة، بينما يمنح Autotriz REVO +15 وION+ +15 (بسعر 250 ر.ق) عزلاً مائياً فائقاً يمنع تكون بقع الماء الكلسية.",
        },
      },
      {
        q: {
          en: "How long does 9H ceramic coating last in Doha?",
          ar: "كم يدوم الطلاء السيراميكي 9H في الدوحة؟",
        },
        a: {
          en: "Genuine German 9H ceramic coatings like Autotriz last 2 to 5 years in Qatar when washed with pH-balanced car shampoo (such as Autotriz Rich Foam Shampoo) rather than harsh alkaline degreasers.",
          ar: "يدوم الطلاء السيراميكي الألماني الأصلي بصلابة 9H مثل Autotriz من سنتين إلى 5 سنوات في قطر عند غسل السيارة بشامبو متوازن الحموضة (مثل Autotriz Rich Foam) وتجنب المواد الكيميائية القلوية الحارقة.",
        },
      },
    ],
  },
  {
    slug: "remove-hard-water-spots-car-qatar",
    title: {
      en: "Hard Water Spots on Your Car in Qatar: How to Remove & Prevent Them (2026 Guide)",
      ar: "بقع الماء العسر على سيارتك في قطر: كيف تزيلها وتمنعها (دليل 2026)",
    },
    seoTitle: {
      en: "Remove Hard Water Spots from Your Car in Qatar (2026)",
      ar: "إزالة بقع الماء العسر من سيارتك في قطر (دليل 2026)",
    },
    description: {
      en: "Why Doha's desalinated water leaves white mineral spots on car paint and glass, how to remove fresh and etched water spots in Qatar, and how ceramic coating stops them.",
      ar: "لماذا يترك ماء الدوحة بقعاً كلسية بيضاء على طلاء السيارة وزجاجها، وكيف تزيل البقع الجديدة والمحفورة بأمان في قطر، وكيف تمنع عودتها.",
    },
    date: "2026-06-10",
    updated: "2026-10-17",
    readingTime: 5,
    category: "car-care",
    topics: ["shampoo", "polish", "ceramic", "interior"],
    keywords: {
      en: [
        "water spots car Qatar",
        "water spot remover car Qatar",
        "remove water spots car paint",
        "hard water marks Doha",
        "water spot remover Qatar",
      ],
      ar: ["بقع الماء على السيارة", "إزالة بقع الماء من طلاء السيارة قطر", "علامات الماء العسر الدوحة"],
    },
    sections: [
      {
        heading: {
          en: "Why Qatar's Water Spots Your Paint",
          ar: "لماذا يبقّع ماء قطر طلاء سيارتك",
        },
        body: {
          en: "Most of Qatar's municipal water comes from desalinated seawater and carries dissolved minerals. When a wet car dries in the sun — which in Doha can happen in minutes — the water evaporates but the minerals stay behind as white rings. Caught early, these deposits sit on top of the paint and wipe away with the right product. Left baking in 45°C sun through repeated wet-dry cycles, the minerals etch into the clear coat itself, leaving craters that no shampoo can remove. Sprinkler overspray and careless hose rinses that are left to air-dry are the most common causes we see in the workshop.",
          ar: "يأتي معظم ماء قطر البلدي من تحلية مياه البحر ويحمل أملاحاً ومعادن ذائبة. عندما تجف سيارة مبتلة تحت الشمس — وهو ما قد يحدث في الدوحة خلال دقائق — يتبخر الماء وتبقى المعادن على شكل حلقات بيضاء. إذا عولجت مبكراً، تكون هذه الرواسب فوق الطلاء وتُمسح بالمنتج المناسب. أما إن تُركت تُخبز تحت شمس 45 درجة عبر دورات بلل وجفاف متكررة، فإن المعادن تحفر في طبقة الكلير نفسها تاركةً فوهات لا يزيلها أي شامبو. رذاذ مرشات الري والشطف المهمل بالخرطوم المتروك ليجف بالهواء هما أكثر سببين نراهما في الورشة.",
        },
      },
      {
        heading: {
          en: "Removing Fresh Water Spots",
          ar: "إزالة بقع الماء الحديثة",
        },
        body: {
          en: "For spots that appeared in the last days or weeks, start gentle. Wash the car in shade with a pH-balanced shampoo such as Autotriz Rich Foam Shampoo, using plenty of foam to lubricate the surface. Dry immediately with a clean microfibre towel — never let the car air-dry. If white rings survive the wash, a dedicated detailing spray or a wash-and-wax product like Briller Wash and Wax applied with light pressure will dissolve mineral deposits that have not yet bonded. On glass, Briller Glass Cleaner cuts mineral film and restores clarity — important for night driving, where water-spotted windshields scatter oncoming headlights.",
          ar: "للبقع التي ظهرت خلال الأيام أو الأسابيع الأخيرة، ابدأ بلطف. اغسل السيارة في الظل بشامبو متوازن الحموضة مثل Autotriz Rich Foam مع رغوة وفيرة لتزليق السطح. وجفف فوراً بمنشفة مايكروفايبر نظيفة — لا تدع السيارة تجف بالهواء أبداً. إن بقيت الحلقات البيضاء بعد الغسيل، فإن بخاخ تلميع مخصصاً أو منتج غسيل وتشميع مثل Briller Wash and Wax مع ضغط خفيف سيذيب الرواسب المعدنية التي لم ترتبط بعد. وعلى الزجاج، يزيل Briller Glass Cleaner الطبقة المعدنية ويعيد الوضوح — وهو أمر مهم للقيادة الليلية حيث يشتت الزجاج المبقّع أضواء السيارات المقابلة.",
        },
      },
      {
        heading: {
          en: "Removing Etched Spots: When You Need Polish",
          ar: "إزالة البقع المحفورة: متى تحتاج إلى التلميع",
        },
        body: {
          en: "If a spot remains after chemical cleaning, the mineral has etched a physical crater into the clear coat, and the only fix is mechanical: polishing levels the surrounding clear coat down to the depth of the etching. Light etching responds to a finishing polish like Autotriz Ultimate Polish 302 (QAR 135) on a GrünesAuto German foam pad (QAR 30). Deeper mineral craters need a cutting compound such as Autotriz Extreme Cut 801 (1L: QAR 160) or Power Cut 701 (4L: QAR 280) followed by a finishing pass. ABK's Mesaimeer showroom stocks the full range of German compounds, polishes, and pads in ready stock.",
          ar: "إذا بقيت البقعة بعد التنظيف الكيميائي، فقد حفرت المعادن فوهة فعلية في طبقة الكلير، والحل الوحيد ميكانيكي: التلميع الذي يسوّي الكلير المحيط حتى عمق الحفر. الحفر الخفيف يستجيب لملمع تشطيب مثل Autotriz Ultimate Polish 302 (بسعر 135 ر.ق) مع إسفنجة تلميع ألمانية GrünesAuto (بسعر 30 ر.ق). أما الضرر الأعمق فيحتاج مركب قطع مثل Autotriz Extreme Cut 801 (1 لتر: 160 ر.ق) أو Power Cut 701 (4 لتر: 280 ر.ق) تتبعه مرحلة تشطيب. يوفر معرض ABK في مسيمير كافة المركبات والملمعات والإسفنجات الألمانية للتسليم الفوري.",
        },
      },
      {
        heading: {
          en: "Prevention: Stop the Spots Coming Back",
          ar: "الوقاية: امنع عودة البقع",
        },
        body: {
          en: "Three habits eliminate most water spotting in Qatar. First, never let water dry on the car — towel-dry after every wash and avoid parking near irrigation sprinklers. Second, wash in the early morning or evening, in shade, so water does not flash-evaporate mid-wash. Third — and most effective — give the paint a sacrificial hydrophobic layer. A ceramic coating such as Autotriz REVO +15 (QAR 250) makes water bead and roll off before it can evaporate in place, and the slick surface releases any deposits that do form with a gentle wash. Owners who combine a ceramic coating or VTEK PPF with proper drying habits almost never see etched spots again.",
          ar: "ثلاث عادات تقضي على معظم بقع الماء في قطر. أولاً، لا تدع الماء يجف على السيارة أبداً — جففها بالمنشفة بعد كل غسيل وتجنب الوقوف قرب مرشات الري. ثانياً، اغسل في الصباح الباكر أو المساء وفي الظل، حتى لا يتبخر الماء فوراً أثناء الغسيل. ثالثاً — وهو الأكثر فاعلية — امنح الطلاء طبقة حماية طاردة للماء. الطلاء السيراميكي مثل Autotriz REVO +15 (بسعر 250 ر.ق) يجعل الماء يتكوّر وينزلق قبل أن يتبخر مكانه، والسطح الأملس يتخلى عن أي رواسب تتكون بغسلة لطيفة.",
        },
      },
      {
        heading: {
          en: "Everything You Need, In One Place in Doha",
          ar: "كل ما تحتاجه في مكان واحد في الدوحة",
        },
        body: {
          en: "ABK Trading and Service in Mesaimeer stocks the full chain of water-spot solutions: pH-balanced shampoos, glass cleaners, finishing polishes, cutting compounds, PVA drying towels (QAR 18), and professional ceramic coatings. Message us on WhatsApp at +974 30838355 with a photo of your paint and we will recommend the exact product from our Doha stock.",
          ar: "يوفر ABK للتجارة والخدمات في مسيمير سلسلة الحلول الكاملة لبقع الماء: شامبوهات متوازنة الحموضة، ومنظفات زجاج، وملمعات تشطيب، ومركبات قطع، ومناشف تجفيف PVA (بسعر 18 ر.ق)، وطلاءات سيراميكية احترافية. راسلنا على واتساب +974 30838355 مع صورة لطلاء سيارتك وسنوصيك بالمنتج المناسب فوراً.",
        },
      },
    ],
    relatedProducts: [
      "autotriz-rich-foam-shampoo",
      "briller-glass-cleaner",
      "autotriz-ultimate-polish-302",
      "autotriz-revo-ceramic-coating",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Water Spot Removal & Prevention", ar: "إزالة ومنع بقع الماء الكلسية" },
      title: {
        en: "Remove Mineral Rings & Seal Your Paint Against Doha's Hard Water",
        ar: "أزل البقع الكلسية واحمِ طلاء سيارتك من ماء الدوحة العسر",
      },
      body: {
        en: "Send us a photo of your water spots on WhatsApp — we will recommend the exact Autotriz polish (from QAR 135), GrünesAuto pad (QAR 30), or REVO 9H ceramic kit (QAR 250) in stock in Mesaimeer.",
        ar: "أرسل صورة لبقع الماء على سيارتك عبر واتساب — وسنوصيك بملمع Autotriz المناسب (من 135 ر.ق) أو طقم سيراميك REVO 9H (بسعر 250 ر.ق) المتوفر في مسيمير.",
      },
      primaryHref: "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20need%20a%20water%20spot%20remover%20or%20polish%20recommendation%20for%20my%20car%20in%20Qatar.",
      primaryLabel: { en: "Message Us on WhatsApp (+974 3083 8355)", ar: "تواصل عبر واتساب (+974 3083 8355)" },
      primaryExternal: true,
      secondaryHref: "/b2c/categories/polish",
      secondaryLabel: { en: "Browse Polishes & Compounds", ar: "تصفح المركبات والملمعات" },
    },
    faqs: [
      {
        q: {
          en: "How do I remove baked-on hard water spots from car paint in Qatar?",
          ar: "كيف أزيل بقع الماء العسر المطبوعة على طلاء السيارة في قطر؟",
        },
        a: {
          en: "Fresh mineral rings wash off with pH-balanced shampoo (Autotriz Rich Foam) or Briller Glass Cleaner on windows. If Qatar's sun has baked the minerals into the clear coat, level the etching mechanically using Autotriz Ultimate Polish 302 (QAR 135) with a GrünesAuto foam pad (QAR 30), or Autotriz Extreme Cut 801 (QAR 160) for deeper craters.",
          ar: "البقع الحديثة تُزال بشامبو متوازن الحموضة (Autotriz Rich Foam) أو منظف الزجاج Briller للنوافذ. أما البقع المحفورة بفعل الشمس فتُعالج بالتلميع الآلي باستخدام Autotriz Ultimate Polish 302 (بسعر 135 ر.ق) مع إسفنجة GrünesAuto (بسعر 30 ر.ق)، أو مركب القطع Extreme Cut 801 (بسعر 160 ر.ق) للبقع العميقة.",
        },
      },
      {
        q: {
          en: "Does ceramic coating prevent water spots in Doha?",
          ar: "هل يمنع الطلاء السيراميكي تكون بقع الماء في الدوحة؟",
        },
        a: {
          en: "Yes. Applying a hydrophobic 9H ceramic coating like Autotriz REVO +15 (QAR 250) causes rinse water to bead and roll off before evaporating, preventing mineral rings from bonding to the clear coat.",
          ar: "نعم، تطبيق طبقة نانو سيراميك طاردة للماء بصلابة 9H مثل Autotriz REVO +15 (بسعر 250 ر.ق) يجعل قطرات الماء تتكوّر وتنزلق قبل تبخرها، مما يمنع التصاق الأملاح بطبقة الكلير.",
        },
      },
      {
        q: {
          en: "What is the best towel for drying a car in Qatar without streaks?",
          ar: "ما أفضل منشفة لتجفيف السيارة في قطر بدون ترك أثر؟",
        },
        a: {
          en: "ABK stocks high-absorbency PVA Synthetic Chamois Drying Towels (QAR 18) and 40×40cm / 40×60cm 380 GSM microfibre towels (QAR 8–10) in Mesaimeer, Doha to absorb rinse water before it flash-dries.",
          ar: "توفر ABK مناشف التجفيف فائقة الامتصاص PVA Chamois (بسعر 18 ر.ق) ومناشف المايكروفايبر الاحترافية 380 GSM (بسعر 8–10 ر.ق) في معرض مسيمير لتجفيف الماء فوراً قبل تبخره.",
        },
      },
    ],
  },
  {
    slug: "how-to-protect-car-from-qatar-heat",
    title: {
      en: "How to Protect Your Car from Qatar's Extreme Heat",
      ar: "كيف تحمي سيارتك من حرارة قطر الشديدة",
    },
    description: {
      en: "Practical tips for protecting your car's paint, interior and tyres from Doha's 50°C summers. Covers PPF, ceramic coating, window tinting and daily care routines.",
      ar: "نصائح عملية لحماية طلاء سيارتك والمقصورة الداخلية والإطارات من صيف الدوحة بدرجات حرارة تصل إلى 50 درجة مئوية.",
    },
    date: "2026-05-10",
    readingTime: 6,
    category: "car-care",
    topics: ["film", "ceramic", "dressing", "interior"],
    keywords: {
      en: ["car protection Qatar", "protect car from heat Doha", "car care tips Qatar", "sun damage car Qatar"],
      ar: ["حماية السيارة قطر", "حماية السيارة من الحرارة", "نصائح العناية بالسيارات"],
    },
    sections: [
      {
        heading: {
          en: "Why Qatar's Climate is Uniquely Harsh on Cars",
          ar: "لماذا مناخ قطر قاسٍ بشكل فريد على السيارات",
        },
        body: {
          en: "Qatar's summer temperatures regularly exceed 50°C, with intense UV radiation that breaks down automotive paint, rubber seals, and dashboard plastics. The combination of extreme heat, sand-laden winds, high humidity, and salt-laden coastal air near areas like Lusail and the Corniche creates one of the harshest environments for vehicles anywhere in the world. Without proper protection, a new car in Doha can show visible paint degradation — fading, oxidation, and swirl marks — within 12 to 18 months of daily driving.",
          ar: "تتجاوز درجات الحرارة في قطر صيفاً 50 درجة مئوية بانتظام، مع إشعاع فوق بنفسجي شديد يُتلف طلاء السيارات والأختام المطاطية والبلاستيك الداخلي. مزيج الحرارة الشديدة والرياح المحملة بالرمال والرطوبة العالية والهواء الساحلي المالح بالقرب من مناطق مثل لوسيل والكورنيش يخلق واحدة من أقسى البيئات للسيارات في العالم. بدون حماية مناسبة، يمكن أن تظهر على سيارة جديدة في الدوحة علامات تدهور واضحة في الطلاء — بهتان وأكسدة وعلامات دوائر — خلال 12 إلى 18 شهراً من القيادة اليومية.",
        },
      },
      {
        heading: {
          en: "Paint Protection Film (PPF): Your First Line of Defence",
          ar: "فيلم حماية الطلاء (PPF): خط الدفاع الأول",
        },
        body: {
          en: "Paint protection film is a transparent urethane layer applied over your car's factory paint. Premium films like VTEK PPF Weather Armor feature self-healing technology — light scratches from sand and dust disappear with heat from the sun. Unlike wax or sealant, PPF physically blocks rock chips, key scratches, and abrasion from desert sand. A full-body PPF installation protects the entire vehicle, while front-end packages cover the hood, bumper, fenders and mirrors — the areas most exposed to road debris on Qatar's highways. Quality PPF lasts from 5 to 15 years depending on the film grade, with proper care, making it one of the most cost-effective long-term investments for car owners in Doha.",
          ar: "فيلم حماية الطلاء هو طبقة يوريثان شفافة تُطبق فوق طلاء المصنع. تتميز الأفلام الفاخرة مثل VTEK PPF Weather Armor بتقنية الإصلاح الذاتي — تختفي الخدوش الخفيفة من الرمل والغبار بحرارة الشمس. على عكس الشمع أو مانع التسرب، يحجب PPF فعلياً رقائق الحصى وخدوش المفاتيح وتآكل الرمل الصحراوي. تركيب PPF الكامل يحمي السيارة بالكامل، بينما تغطي باقات المقدمة غطاء المحرك والمصد والرفارف والمرايا — وهي المناطق الأكثر تعرضاً لحطام الطريق على طرق قطر السريعة. يدوم PPF عالي الجودة من 5 إلى 15 سنة حسب فئة الفيلم مع العناية المناسبة، مما يجعله من أكثر الاستثمارات فعالية لأصحاب السيارات في الدوحة.",
        },
      },
      {
        heading: {
          en: "Ceramic Coating: Hydrophobic Protection Against Dust and Water Spots",
          ar: "الطلاء السيراميكي: حماية طاردة للماء ضد الغبار وبقع الماء",
        },
        body: {
          en: "Ceramic coatings create a chemical bond with your car's paint, forming a hard, hydrophobic layer rated at 9H hardness. In Qatar, the primary benefit is water-spot prevention — Doha's hard tap water leaves white mineral deposits when it evaporates on paint. A ceramic-coated car sheds water droplets before they can etch, reducing wash frequency significantly. Products like Autotriz 3D Matrix Ultra and Autotriz Ion Plus Ceramic Coating are formulated for Gulf climates and resist UV-driven yellowing that cheaper coatings suffer from. Many car owners in Qatar apply ceramic coating on top of PPF for maximum protection — the PPF handles physical damage while the ceramic adds gloss and easy cleaning.",
          ar: "تُنشئ الطلاءات السيراميكية رابطاً كيميائياً مع طلاء سيارتك، مكوّنةً طبقة صلبة طاردة للماء بصلابة 9H. في قطر، الفائدة الأساسية هي منع بقع الماء — ماء الصنبور العسر في الدوحة يترك رواسب معدنية بيضاء عند تبخره على الطلاء. السيارة المطلية بالسيراميك تطرد قطرات الماء قبل أن تتمكن من الحفر، مما يقلل من تكرار الغسيل بشكل كبير. منتجات مثل Autotriz 3D Matrix Ultra وAutotriz Ion Plus Ceramic Coating مصممة لمناخ الخليج وتقاوم الاصفرار الناجم عن الأشعة فوق البنفسجية الذي تعاني منه الطلاءات الرخيصة. كثير من أصحاب السيارات في قطر يطبقون الطلاء السيراميكي فوق PPF للحصول على حماية قصوى — يتعامل PPF مع الأضرار الفيزيائية بينما يضيف السيراميك اللمعان وسهولة التنظيف.",
        },
      },
      {
        heading: {
          en: "Window Tinting: Heat Rejection and UV Blocking",
          ar: "تظليل النوافذ: رفض الحرارة وحجب الأشعة فوق البنفسجية",
        },
        body: {
          en: "Quality window tint films reject up to 60% of solar heat, keeping your car's interior significantly cooler and reducing air conditioning load. In Qatar, this means your leather seats and dashboard last longer, and your fuel consumption decreases. VTEK Solar Armor window tints are available in multiple VLT (visible light transmission) grades that comply with Qatar's vehicle regulations. Fitted well by a professional, a quality film gives a bubble-free, precision-cut finish that lasts the life of the vehicle — ABK supplies the film and the tools to do it properly.",
          ar: "ترفض أفلام تظليل النوافذ عالية الجودة ما يصل إلى 60% من الحرارة الشمسية، مما يبقي مقصورة سيارتك أبرد بكثير ويقلل حمل التكييف. في قطر، هذا يعني أن مقاعدك الجلدية ولوحة القيادة تدوم أطول واستهلاك الوقود ينخفض. تتوفر أفلام تظليل VTEK Solar Armor بدرجات متعددة من نفاذية الضوء المرئي (VLT) متوافقة مع قوانين المركبات في قطر. التركيب الاحترافي لفيلم عالي الجودة — من الأفلام التي تورّدها ABK — يضمن تطبيقاً دقيقاً بدون فقاعات يدوم طوال عمر السيارة.",
        },
      },
      {
        heading: {
          en: "Daily Car Care Tips for Doha Drivers",
          ar: "نصائح يومية للعناية بالسيارة لسائقي الدوحة",
        },
        body: {
          en: "Park in shade whenever possible — covered parking reduces interior temperatures by up to 15°C. Use a pH-balanced car shampoo like Autotriz Rich Foam Shampoo or Briller Wash and Wax to avoid stripping protective coatings. Wash every 7 to 10 days to prevent sand accumulation from scratching paint. Apply tyre dressing like Briller Quick Tyre Shine to prevent UV cracking of sidewalls. Use a quality glass cleaner to keep windshield clarity in dusty conditions. Consider a car fragrance like ABK Mashmom to keep the interior fresh despite the heat.",
          ar: "اركن في الظل كلما أمكن — الوقوف المظلل يقلل حرارة المقصورة الداخلية حتى 15 درجة مئوية. استخدم شامبو سيارات متوازن الحموضة مثل Autotriz Rich Foam أو Briller Wash and Wax لتجنب إزالة الطلاءات الحماية. اغسل كل 7 إلى 10 أيام لمنع تراكم الرمل من خدش الطلاء. ضع ملمع إطارات مثل Briller Quick Tyre Shine لمنع تشقق الجوانب بالأشعة فوق البنفسجية. استخدم منظف زجاج عالي الجودة للحفاظ على وضوح الزجاج الأمامي في ظروف الغبار. فكر في معطر سيارة مثل ABK مشموم للحفاظ على انتعاش المقصورة رغم الحرارة.",
        },
      },
    ],
    relatedProducts: [
      "vtek-ppf-weather-armor-ultimate",
      "autotriz-3d-matrix-ultra",
      "vtek-window-tints",
      "briller-wash-and-wax",
    ],
    updated: "2026-10-02",
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Gulf Summer Protection Bundle", ar: "باقة الحماية الكاملة لصيف قطر" },
      title: {
        en: "Shield Your Car Against 50°C Heat, UV & Desert Sand in Doha",
        ar: "احمِ سيارتك من حرارة 50°م والأشعة فوق البنفسجية ورمل الطرق في الدوحة",
      },
      body: {
        en: "Combine installed VTEK self-healing PPF (from QAR 899), legal-VLT VTEK Solar Armor window tint, and Autotriz 9H ceramic coating (from QAR 250) at ABK Trading & Service.",
        ar: "اجمع بين تركيب أفلام الحماية VTEK PPF ذاتية المعالجة (من 899 ر.ق) وتظليل VTEK Solar Armor القانوني وأطقم سيراميك Autotriz 9H (من 250 ر.ق) لدى ABK.",
      },
      primaryHref: "/b2c/ppf-installation",
      primaryLabel: { en: "Get Installed PPF Quote", ar: "احسب سعر تركيب PPF" },
      secondaryHref: "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20want%20recommendations%20to%20protect%20my%20car%20from%20Qatar%20summer%20heat.",
      secondaryLabel: { en: "Ask on WhatsApp (+974 3083 8355)", ar: "تواصل عبر واتساب" },
    },
    faqs: [
      {
        q: {
          en: "What is the best way to protect a new car from Qatar's 50°C summer heat?",
          ar: "ما أفضل طريقة لحماية سيارة جديدة من حرارة صيف قطر التي تتجاوز 50°م؟",
        },
        a: {
          en: "A three-layer defence works best in Doha: (1) VTEK Weather Armor aliphatic TPU PPF on the front end (from QAR 899) or full body (from QAR 3,999) to stop highway stone chips and sand abrasion; (2) Autotriz 9H nano-ceramic coating (kits from QAR 250) to prevent hard-water spots and UV oxidation; and (3) legal-VLT VTEK Solar Armor nano-ceramic window tint to block up to 95% of infrared cabin heat.",
          ar: "أفضل حماية في الدوحة تعتمد على ثلاث طبقات: (1) تركيب فيلم VTEK PPF الأليفاتي على الواجهة (من 899 ر.ق) أو الهيكل الكامل (من 3,999 ر.ق) لمنع ضربات الحصى وسافي الرمل؛ (2) تطبيق النانو سيراميك الألماني Autotriz 9H (من 250 ر.ق للطقم) لمنع بقع الماء الكلسية؛ (3) تظليل النوافذ بفيلم VTEK Solar Armor القانوني لعزل 95% من الأشعة تحت الحمراء.",
        },
      },
      {
        q: {
          en: "How often should I wash my car in Doha during summer?",
          ar: "كل كم يوم يجب غسل السيارة في الدوحة خلال الصيف؟",
        },
        a: {
          en: "Wash every 7 to 10 days in the shade during early morning or evening hours using a pH-balanced snow foam like Autotriz Rich Foam Shampoo, and towel-dry immediately with a PVA or 380 GSM microfibre towel so desalinated tap water never evaporates on hot paint.",
          ar: "يُنصح بغسل السيارة كل 7 إلى 10 أيام في الظل صباحاً أو مساءً باستخدام شامبو متوازن الحموضة مثل Autotriz Rich Foam، مع التجفيف الفوري بمنشفة مايكروفايبر 380 GSM أو PVA لمنع تبخر الماء المالح على الطلاء الساخن.",
        },
      },
      {
        q: {
          en: "How do I stop my tyres and plastic trim from fading in Qatar?",
          ar: "كيف أمنع تشقق الإطارات وبهتان البلاستيك الخارجي في قطر؟",
        },
        a: {
          en: "Apply a UV-blocking dressing like Briller Quick Tyre Shine after washing to keep rubber sidewalls supple, and use ABK Rejuvenate Plastic Restorer (Made in France, from QAR 40) to restore and seal faded exterior bumpers and trims.",
          ar: "استخدم ملمع الإطارات الواقي من الأشعة فوق البنفسجية Briller Quick Tyre Shine بعد الغسيل لحماية المطاط من التشقق، واستخدم مجدد البلاستيك الفرنسي ABK Rejuvenate (ابتداءً من 40 ر.ق) لاستعادة وحماية الصدامات والأجزاء البلاستيكية.",
        },
      },
    ],
  },
  {
    slug: "ppf-vs-ceramic-coating-qatar",
    title: {
      en: "PPF vs Ceramic Coating: Which is Right for Your Car in Qatar?",
      ar: "PPF مقابل الطلاء السيراميكي: أيهما يناسب سيارتك في قطر؟",
    },
    seoTitle: {
      en: "PPF vs Ceramic Coating in Qatar: Which Is Better?",
      ar: "PPF مقابل الطلاء السيراميكي: أيهما يناسب سيارتك في قطر؟",
    },
    description: {
      en: "A detailed comparison of paint protection film and ceramic coating for cars in Qatar. Learn which option protects best against sand, UV, and water spots in Doha's climate.",
      ar: "مقارنة تفصيلية بين فيلم حماية الطلاء PPF والطلاء السيراميكي في قطر: أيهما يحمي أفضل من الرمل والأشعة فوق البنفسجية وبقع الماء في مناخ الدوحة، وكم يكلف كل منهما.",
    },
    date: "2026-05-08",
    readingTime: 5,
    category: "comparison",
    topics: ["film", "ceramic"],
    keywords: {
      en: ["PPF vs ceramic coating", "PPF Doha", "ceramic coating Qatar", "paint protection Qatar"],
      ar: ["PPF مقابل سيراميك", "حماية الطلاء قطر", "سيراميك سيارات قطر"],
    },
    sections: [
      {
        heading: { en: "Understanding the Basics", ar: "فهم الأساسيات" },
        body: {
          en: "Paint protection film (PPF) and ceramic coating are both designed to protect your car's paint, but they work in fundamentally different ways. PPF is a physical barrier — a thick, transparent urethane film that absorbs impacts, rock chips, and scratches. Ceramic coating is a chemical barrier — a thin liquid polymer that bonds to paint and creates a hard, slick, hydrophobic surface. Think of PPF as armour and ceramic as a shield. In Qatar's harsh climate, understanding these differences helps you make the right investment for your vehicle.",
          ar: "فيلم حماية الطلاء (PPF) والطلاء السيراميكي مصممان لحماية طلاء سيارتك، لكنهما يعملان بطرق مختلفة جذرياً. PPF حاجز فيزيائي — فيلم يوريثان سميك وشفاف يمتص الصدمات ورقائق الحصى والخدوش. الطلاء السيراميكي حاجز كيميائي — بوليمر سائل رقيق يرتبط بالطلاء ويُنشئ سطحاً صلباً أملساً وطارداً للماء. فكر في PPF كدرع والسيراميك كحامي. في مناخ قطر القاسي، فهم هذه الاختلافات يساعدك على اتخاذ القرار الاستثماري الصحيح لسيارتك.",
        },
      },
      {
        heading: { en: "PPF: Best for Physical Protection", ar: "PPF: الأفضل للحماية الفيزيائية" },
        body: {
          en: "PPF excels at preventing physical damage that ceramic coating simply cannot stop. Rock chips from highway driving between Doha and Al Khor, door dings in tight parking lots, key scratches, and the constant micro-abrasion from sand particles — PPF handles all of these. Premium films like VTEK PPF Weather Armor feature self-healing top coats that repair light scratches when exposed to heat (which Qatar has in abundance). PPF typically lasts from 5 to 15 years depending on the film grade and can be removed cleanly without damaging the original paint. The downside is cost — full-body PPF installation is a significant investment, though front-end packages offer excellent protection at a lower price point.",
          ar: "يتفوق PPF في منع الضرر الفيزيائي الذي لا يستطيع الطلاء السيراميكي إيقافه ببساطة. رقائق الحصى من القيادة على الطريق السريع بين الدوحة والخور، خدوش الأبواب في المواقف الضيقة، خدوش المفاتيح، والتآكل المستمر من جزيئات الرمل — PPF يتعامل مع كل هذا. أفلام فاخرة مثل VTEK PPF Weather Armor تتميز بطبقات علوية ذاتية الإصلاح تُرمم الخدوش الخفيفة عند تعرضها للحرارة (وهو ما تمتلكه قطر بوفرة). يدوم PPF عادةً من 5 إلى 15 سنة حسب فئة الفيلم ويمكن إزالته بنظافة دون إتلاف الطلاء الأصلي. الجانب السلبي هو التكلفة — تركيب PPF للهيكل الكامل استثمار كبير، لكن باقات المقدمة توفر حماية ممتازة بسعر أقل.",
        },
      },
      {
        heading: { en: "Ceramic Coating: Best for Easy Maintenance", ar: "السيراميك: الأفضل لسهولة الصيانة" },
        body: {
          en: "Ceramic coating shines (literally) when it comes to everyday maintenance. The hydrophobic surface means water, dust, and dirt slide off instead of sticking — a major advantage in dusty Doha where cars get dirty within days of washing. Hard water spots from Doha's mineral-rich tap water are dramatically reduced because water beads and rolls off before evaporating. A ceramic-coated car is faster to wash, needs fewer washes, and maintains a deeper gloss. Products like Autotriz 3D Matrix Ultra provide 9H hardness and UV resistance formulated specifically for Gulf climates. Ceramic coatings typically last 2 to 5 years depending on the product and maintenance.",
          ar: "يتألق الطلاء السيراميكي (حرفياً) في الصيانة اليومية. السطح الطارد للماء يعني أن الماء والغبار والأوساخ تنزلق بدلاً من التمسك — ميزة كبيرة في الدوحة المتربة حيث تتسخ السيارات خلال أيام من الغسيل. تُقلل بقع الماء العسر من ماء الدوحة الغني بالمعادن بشكل كبير لأن الماء يتكور وينزلق قبل أن يتبخر. السيارة المطلية بالسيراميك أسرع في الغسيل، وتحتاج غسيلاً أقل، وتحافظ على لمعان أعمق. منتجات مثل Autotriz 3D Matrix Ultra توفر صلابة 9H ومقاومة للأشعة فوق البنفسجية مصممة خصيصاً لمناخ الخليج. تدوم الطلاءات السيراميكية عادةً من سنتين إلى 5 سنوات حسب المنتج والصيانة.",
        },
      },
      {
        heading: { en: "The Best of Both Worlds: PPF + Ceramic", ar: "الأفضل من العالمين: PPF + سيراميك" },
        body: {
          en: "Many car owners in Qatar choose both — applying ceramic coating on top of PPF. This combination gives you physical impact protection from the PPF layer plus the easy-clean, hydrophobic, glossy finish from the ceramic layer. It is the gold standard of car protection in the Gulf. At ABK Trading and Service in Mesaimeer, we stock both products and can advise on the right combination for your vehicle, driving habits, and budget. Whether you choose PPF, ceramic, or both — professional installation makes the difference between protection that lasts years and protection that fails in months.",
          ar: "يختار كثير من أصحاب السيارات في قطر كليهما — تطبيق الطلاء السيراميكي فوق PPF. هذا المزيج يمنحك حماية فيزيائية من الصدمات من طبقة PPF بالإضافة إلى لمسة نهائية لامعة طاردة للماء وسهلة التنظيف من طبقة السيراميك. هذا هو المعيار الذهبي لحماية السيارات في الخليج. في ABK للتجارة والخدمات بمسيمير، نوفر كلا المنتجين ويمكننا تقديم المشورة حول المزيج المناسب لسيارتك وعاداتك في القيادة وميزانيتك. سواء اخترت PPF أو السيراميك أو كليهما — التركيب الاحترافي هو ما يصنع الفارق بين حماية تدوم سنوات وحماية تفشل خلال أشهر.",
        },
      },
    ],
    relatedProducts: [
      "vtek-ppf-weather-armor-ultimate",
      "autotriz-3d-matrix-ultra",
      "autotriz-3d-matrix-hybrid",
      "autotriz-ion-plus-ceramic-coating",
    ],
    updated: "2026-10-02",
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Compare Installed PPF & German Ceramic", ar: "قارن بين تركيب PPF وأطقم السيراميك الألماني" },
      title: {
        en: "Get Front-End VTEK PPF (from QAR 899) + Autotriz 9H Ceramic (QAR 250)",
        ar: "احصل على حماية مقدمة VTEK PPF (من 899 ر.ق) + سيراميك Autotriz 9H (250 ر.ق)",
      },
      body: {
        en: "Can't decide between PPF and ceramic coating? The smartest value combo in Doha is installing VTEK PPF on high-impact front panels and coating the rest of the body with Autotriz 9H ceramic.",
        ar: "محتار بين PPF والسيراميك؟ الخيار الأذكى في الدوحة هو تركيب VTEK PPF على الواجهة الأمامية المعرضة للحصى وتطبيق سيراميك Autotriz 9H على باقي الهيكل.",
      },
      primaryHref: "/b2c/ppf-installation",
      primaryLabel: { en: "Build Installed PPF Quote", ar: "احسب سعر تركيب PPF" },
      secondaryHref: "/b2c/categories/ceramic",
      secondaryLabel: { en: "Shop Autotriz Ceramic Kits (QAR 250–280)", ar: "تصفح أطقم سيراميك Autotriz" },
    },
    faqs: [
      {
        q: {
          en: "Is PPF or ceramic coating better for Qatar highways?",
          ar: "أيهما أفضل لطرق قطر السريعة: PPF أم الطلاء السيراميكي؟",
        },
        a: {
          en: "For physical protection against rock chips and blowing sand on highways like Al Shamal Road and Salwa Road, only Paint Protection Film (PPF) absorbs physical impacts. Ceramic coating does not stop stone chips, but it excels at preventing hard-water mineral spots, UV fading, and dust adhesion.",
          ar: "للحماية الفيزيائية من ضربات الحصى وسافي الرمل على الطرق السريعة مثل طريق الشمال وطريق سلوى، وحده فيلم الحماية (PPF) يمتص الصدمات الفيزيائية. أما الطلاء السيراميكي فلا يمنع ضربات الحصى، لكنه يتفوق في منع بقع الماء الكلسية والأكسدة والتصاق الغبار.",
        },
      },
      {
        q: {
          en: "Can you apply ceramic coating on top of PPF?",
          ar: "هل يمكن تطبيق الطلاء السيراميكي فوق فيلم PPF؟",
        },
        a: {
          en: "Yes. Applying an Autotriz 9H ceramic coating over VTEK PPF — or installing front-end PPF (from QAR 899) and ceramic-coating the remaining panels — gives you both self-healing impact resistance and ultra-hydrophobic water-spot protection.",
          ar: "نعم، تطبيق سيراميك Autotriz 9H فوق فيلم VTEK PPF — أو تركيب PPF على الواجهة الأمامية (من 899 ر.ق) وطلاء باقي الهيكل بالسيراميك — يمنحك مقاومة الصدمات مع سهولة التنظيف ومنع بقع الماء.",
        },
      },
      {
        q: {
          en: "How does the price of PPF compare to ceramic coating in Doha?",
          ar: "كيف يقارن سعر PPF بسعر الطلاء السيراميكي في الدوحة؟",
        },
        a: {
          en: "Installed VTEK PPF at ABK starts at QAR 899 for a front-end kit, QAR 1,599 for full front, and QAR 3,999 for full body (10-year warranty). Studio ceramic coating in Doha typically costs QAR 800–2,500, while genuine Autotriz 9H ceramic kits sold directly at ABK's Mesaimeer showroom cost QAR 250–280.",
          ar: "يبدأ تركيب فيلم VTEK PPF لدى ABK من 899 ر.ق للواجهة الأساسية و1,599 ر.ق للواجهة الكاملة و3,999 ر.ق للهيكل الكامل (ضمان 10 سنوات). بينما يتراوح تطبيق السيراميك في المراكز بين 800 و2,500 ر.ق، وتُباع أطقم السيراميك الألماني الأصلي Autotriz مباشرة في معرض ABK بمسيمير بسعر 250–280 ر.ق.",
        },
      },
    ],
  },
  {
    slug: "complete-guide-car-care-products-qatar",
    title: {
      en: "The Complete Guide to Car Care & Detailing Products in Qatar (Retail & Wholesale)",
      ar: "الدليل الشامل لمنتجات ومواد العناية وتلميع السيارات في قطر (تجزئة وجملة)",
    },
    seoTitle: {
      en: "Car Care & Detailing Products in Qatar: 2026 Guide",
      ar: "دليل منتجات العناية بالسيارات والتلميع في قطر 2026",
    },
    description: {
      en: "Where to buy car care and detailing materials in Qatar — from pH-balanced 20L car wash drums and German polishing compounds to VTEK PPF and Autotriz 9H ceramic coatings in Doha.",
      ar: "كل ما تحتاج معرفته عن منتجات ومواد العناية وتلميع السيارات في قطر — من شامبوهات الغسيل وبراميل 20 لتر للمغاسل إلى أفلام VTEK PPF وسيراميك Autotriz في الدوحة.",
    },
    date: "2026-05-05",
    updated: "2026-10-21",
    readingTime: 7,
    category: "buying-guide",
    topics: ["shampoo", "polish", "tyre", "tools", "cleaners", "dressing"],
    keywords: {
      en: [
        "car care products Qatar",
        "car detailing material suppliers in Qatar",
        "car shampoo Doha",
        "car polish Qatar",
        "auto detailing products Qatar",
        "wholesale car wash supplies Qatar",
      ],
      ar: [
        "منتجات العناية بالسيارات قطر",
        "موردي مواد تلميع السيارات في قطر",
        "شامبو سيارات الدوحة",
        "ملمع سيارات قطر",
        "مواد غسيل السيارات بالجملة قطر",
      ],
    },
    sections: [
      {
        heading: { en: "Car Shampoos: The Foundation of Car Care", ar: "شامبوهات السيارات: أساس العناية الآمنة" },
        body: {
          en: "A quality car shampoo is the most-used product in any detailing kit. In Qatar, you need a pH-balanced formula that cleans effectively without stripping wax, sealant, or ceramic coating protection. Autotriz Rich Foam Shampoo (20L drum: QAR 450 promo) produces thick, lubricating snow foam that lifts sand and dirt safely — critical in a country where airborne sand can scratch paint during washing. Briller Wash and Wax (20L drum: QAR 350 promo) combines cleaning and protection in one step, depositing a gloss-enhancing wax layer as you wash. For high-volume touchless car washes, Grizzly Touchless Car Wash Powder (20 kg sack) cuts desert road film rapidly. All are stocked in Mesaimeer, Doha.",
          ar: "شامبو السيارات عالي الجودة هو المنتج الأكثر استخداماً في أي مجموعة عناية أو مغسلة سيارات. في قطر، تحتاج إلى تركيبة متوازنة الحموضة (pH-neutral) تنظف بفعالية دون إزالة الشمع أو طبقة النانو سيراميك. ينتج شامبو Autotriz Rich Foam (برميل 20 لتر بسعر ترويجي 450 ر.ق) رغوة كثيفة ترفع الرمل والأتربة بأمان تام دون خدش الطلاء. ويجمع شامبو Briller Wash and Wax (برميل 20 لتر بسعر 350 ر.ق) بين التنظيف والتشميع في خطوة واحدة، كما يتوفر مسحوق الغسيل اللاتلامسي Grizzly بعبوة 20 كجم للمغاسل التجارية في معرض ABK بمسيمير.",
        },
      },
      {
        heading: { en: "Polishing Compounds: Restoring Paint to Showroom Condition", ar: "مركبات التلميع وإسفنجات القص: استعادة الطلاء لحالة المعرض" },
        body: {
          en: "Qatar's sand and dust cause micro-scratches and swirl marks that dull paint over time. Polishing compounds remove these imperfections by levelling the clear coat. Autotriz Heavy Cut 901 and Extreme Cut 801 (1L: QAR 160) are professional German cutting compounds that remove deep scratches, sanding marks, and severe oxidation. Autotriz Power Cut 701 (4L: QAR 280) and One Step Polish (4L: QAR 265) handle medium defects, while Autotriz Ultimate Polish 302 (QAR 135) restores mirror-like clarity. Pair them with GrünesAuto 6-inch German foam pads (DA or Rotary Step 1, 2, 3 at QAR 30 each) or the Autotriz 8-inch Double-Sided Wool Pad (QAR 75).",
          ar: "يتسبب رمل وغبار قطر في خدوش دقيقة ودوائر غسيل تُبهت لمعة الطلاء بمرور الوقت، وتزيل مركبات التلميع الاحترافية هذه العيوب عبر تسوية طبقة الكلير. يُعد Autotriz Heavy Cut 901 وExtreme Cut 801 (عبوة 1 لتر: 160 ر.ق) من أقوى مركبات القطع الألمانية لإزالة الخدوش العميقة والأكسدة، بينما يعالج Power Cut 701 (عبوة 4 لتر: 280 ر.ق) وOne Step Polish (عبوة 4 لتر: 265 ر.ق) العيوب المتوسطة، ويمنح ملمع التشطيب Autotriz Ultimate Polish 302 (بسعر 135 ر.ق) لمعاناً كالمرآة عند استخدامه مع إسفنجات GrünesAuto الألمانية مقاس 6 بوصة (30 ر.ق) أو صوف التلميع المزدوج من Autotriz (75 ر.ق).",
        },
      },
      {
        heading: { en: "Tyre, Wheel, Trim and Interior Care", ar: "العناية بالإطارات والجنوط والبلاستيك والمقصورة" },
        body: {
          en: "Qatar's intense UV radiation degrades tyre rubber and exterior plastic trim, causing grey fading and sidewall cracking. Regular application of Briller Quick Tyre Shine (20L: QAR 280) or Smart Car Tyre Foam protects rubber against UV damage, while ABK Rejuvenate Plastic Restorer (Made in France, from QAR 40 for 60ml up to QAR 280 for 500ml) permanently revives sun-bleached bumpers and trims. For wheels and engine bays, Briller Alloy Rim Cleaner (20L: QAR 250), Briller Heavy Duty Degreaser (20L: QAR 300), and Sitrett MX5 Heavy-Duty Degreaser dissolve baked-on brake dust and grease.",
          ar: "تُتلف الأشعة فوق البنفسجية الشديدة في قطر مطاط الإطارات والأجزاء البلاستيكية الخارجية. يحمي ملمع الإطارات Briller Quick Tyre Shine (برميل 20 لتر: 280 ر.ق) الجوانب المطاطية من التشقق ويعيد اللون الأسود العميق، بينما يعيد مجدد البلاستيك الفرنسي ABK Rejuvenate (من 40 ر.ق لعبوة 60 مل حتى 280 ر.ق لعبوة 500 مل) اللون الأصلي للصدامات الباهتة. ولتنظيف الجنوط والمحركات، يزيل منظف الجنوط Briller Alloy Rim Cleaner (برميل 20 لتر: 250 ر.ق) ومزيل الشحوم Sitrett MX5 أصعب تراكمات غبار الفرامل والزيوت.",
        },
      },
      {
        heading: {
          en: "Car Detailing Material Suppliers in Qatar (Wholesale & Retail in Doha)",
          ar: "موردو مواد ومستلزمات تلميع وغسيل السيارات في قطر (تجزئة وجملة)",
        },
        body: {
          en: "Whether you are searching for car detailing material suppliers in Qatar to equip a commercial car wash, a detailing studio, or your own garage, ABK Trading & Service in Mesaimeer, Doha supplies 58 active SKUs directly from authorized brand supply chains. Commercial workshops can order 20L chemical drums (Briller and Autotriz shampoos, APCs, degreasers, glass cleaners, and dressings from QAR 250–450), 1.52m × 15m PPF master rolls (VTEK Weather Armor and Grizzly TPU PPF from QAR 1,200), high-pressure foam guns (QAR 180), microfibre towels (QAR 8–10), and masking tapes (QAR 2.5–3.5) with same-day dispatch across Doha, Al Rayyan, Lusail, Al Wakrah, and Al Khor. Visit our Mesaimeer showroom Saturday to Thursday (10:00–13:00 and 16:00–22:00) or message +974 3083 8355 on WhatsApp.",
          ar: "سواء كنت تبحث عن موردي مواد تلميع وغسيل السيارات في قطر لتجهيز مغسلة سيارات تجارية أو مركز عناية وتلميع أو كراجك الخاص، توفر شركة ABK للتجارة والخدمات في مسيمير، الدوحة 58 صنفاً أصلياً مباشرة من المصانع العالمية. يمكن للمراكز والمغاسل طلب براميل 20 لتر الاقتصادية (شامبوهات ومنظفات ومزيلات شحوم وملمعات Briller وAutotriz من 250 إلى 450 ر.ق)، ورولات أفلام الحماية الكاملة 1.52×15 متر (VTEK وGrizzly TPU PPF ابتداءً من 1,200 ر.ق)، ومسدسات الرغوة (180 ر.ق)، ومناشف المايكروفايبر (8–10 ر.ق) مع توصيل في نفس اليوم لجميع مناطق الدوحة والريان ولوسيل والوكرة والخور. تفضل بزيارة معرضنا في مسيمير أو تواصل عبر واتساب 30838355 974+.",
        },
      },
    ],
    relatedProducts: [
      "autotriz-rich-foam-shampoo",
      "briller-wash-and-wax",
      "autotriz-heavy-cut-901",
      "briller-quick-tyre-shine",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Retail & Wholesale Supply in Doha", ar: "توريد تجزئة وجملة في الدوحة" },
      title: {
        en: "Order 20L Car Wash Drums, German Compounds & Detailing Supplies Direct",
        ar: "اطلب براميل غسيل 20 لتر ومركبات التلميع الألمانية مباشرة من الموزع",
      },
      body: {
        en: "Visit ABK's Mesaimeer showroom or order online with same-day dispatch across Doha — 58 active SKUs from VTEK, Autotriz, Briller, Grizzly, GrünesAuto, and Sitrett.",
        ar: "تفضل بزيارة معرض ABK في مسيمير أو اطلب عبر الموقع مع توصيل في نفس اليوم بالدوحة — 58 منتجاً أصلياً من VTEK وAutotriz وBriller وGrizzly وGrünesAuto وSitrett.",
      },
      primaryHref: "/b2c/products",
      primaryLabel: { en: "Browse 58 Detailing Products", ar: "تصفح 58 منتج عناية وتلميع" },
      secondaryHref: "/b2b/become-a-dealer",
      secondaryLabel: { en: "Apply for B2B Wholesale Account", ar: "تقدم بطلب حساب جملة B2B" },
    },
    faqs: [
      {
        q: {
          en: "Where can I buy wholesale car detailing and car wash materials in Qatar?",
          ar: "أين يمكنني شراء مواد تلميع وغسيل السيارات بالجملة في قطر؟",
        },
        a: {
          en: "ABK Trading & Service in Mesaimeer, Doha (Barwa Commercial Avenue / Al Wataniya Petrol Station, +974 3083 8355) is a direct distributor supplying 58 retail and wholesale car care SKUs — including 20L Briller and Autotriz chemical drums (QAR 250–450), German polishing compounds, GrünesAuto foam pads, and VTEK/Grizzly PPF rolls.",
          ar: "تُعد شركة ABK للتجارة والخدمات في مسيمير، الدوحة (قرب محطة بترول الوطنية، +974 3083 8355) موزعاً مباشراً يوفر 58 منتجاً للتجزئة والجملة — تشمل براميل 20 لتر من Briller وAutotriz (بسعر 250–450 ر.ق)، ومركبات التلميع الألمانية، وإسفنجات GrünesAuto، ورولات أفلام الحماية VTEK وGrizzly.",
        },
      },
      {
        q: {
          en: "Do you deliver car care products across Doha and Qatar?",
          ar: "هل يتوفر توصيل لمنتجات العناية بالسيارات في الدوحة وقطر؟",
        },
        a: {
          en: `Yes. Retail orders of ${formatQar(DELIVERY.freeThresholdQar, "en")} or more get free delivery across Doha, Al Rayyan, Lusail, Al Wakrah and Al Khor (a flat ${formatQar(DELIVERY.feeQar, "en")} below that). Orders of ${formatQar(DISCOUNT_ENTRY.minSubtotalQar, "en")} or more get ${DISCOUNT_ENTRY.percent}% off and orders of ${formatQar(DISCOUNT_TOP.minSubtotalQar, "en")} or more get ${DISCOUNT_TOP.percent}% off, applied automatically in the website cart. You can also collect for free from our Mesaimeer showroom Saturday to Thursday.`,
          ar: `نعم، تحصل طلبات التجزئة بقيمة ${formatNumber(DELIVERY.freeThresholdQar, "en")} ر.ق فأكثر على توصيل مجاني في الدوحة والريان ولوسيل والوكرة والخور (ورسوم توصيل ثابتة ${formatNumber(DELIVERY.feeQar, "en")} ر.ق لما دون ذلك). وتحصل الطلبات بقيمة ${formatNumber(DISCOUNT_ENTRY.minSubtotalQar, "en")} ر.ق فأكثر على خصم ${DISCOUNT_ENTRY.percent}% والطلبات بقيمة ${formatNumber(DISCOUNT_TOP.minSubtotalQar, "en")} ر.ق فأكثر على خصم ${DISCOUNT_TOP.percent}%، ويُطبَّق الخصم تلقائياً في سلة الموقع. كما يتوفر الاستلام المجاني من معرضنا في مسيمير من السبت إلى الخميس.`,
        },
      },
      {
        q: {
          en: "What 20L bulk chemical drums are in stock for Qatar car washes?",
          ar: "ما هي براميل 20 لتر المتوفرة للمغاسل ومراكز التلميع في قطر؟",
        },
        a: {
          en: "ABK stocks 20L drums of Autotriz Rich Foam Shampoo (QAR 450 promo), Briller Wash & Wax (QAR 350 promo), Briller Multi Purpose Cleaner APC (QAR 250), Briller Heavy Duty Degreaser (QAR 300), Briller Alloy Rim Cleaner (QAR 250), Briller Glass Cleaner (QAR 250), Briller Quick Tyre Shine (QAR 280), and Briller All-In-One Interior Dressing (QAR 350).",
          ar: "توفر ABK براميل 20 لتر من شامبو الرغوة Autotriz Rich Foam (بسعر 450 ر.ق)، وشامبو Briller Wash & Wax (بسعر 350 ر.ق)، ومنظف متعدد الاستخدامات APC (بسعر 250 ر.ق)، ومزيل الشحوم القوي (300 ر.ق)، ومنظف الجنوط (250 ر.ق)، ومنظف الزجاج (250 ر.ق)، وملمع الإطارات (280 ر.ق)، وملمع المقصورة الداخلية (350 ر.ق).",
        },
      },
    ],
  },
  {
    slug: "best-ppf-installers-doha-qatar-guide",
    title: {
      en: "Choosing the Best PPF Installer in Doha, Qatar: 2026 Standards & Price Guide",
      ar: "دليل اختيار أفضل مركز تركيب أفلام حماية PPF في الدوحة، قطر: المعايير والأسعار 2026",
    },
    seoTitle: {
      en: "How to Choose the Best PPF Installer in Doha (2026)",
      ar: "كيف تختار أفضل مركز تركيب PPF في الدوحة (دليل 2026)",
    },
    description: {
      en: "How to evaluate PPF installers in Doha: dust-controlled clean booths, edge-wrapping vs pre-cut, genuine aliphatic TPU warranties, and 2026 price comparisons in Qatar.",
      ar: "كيف تقيّم مراكز تركيب أفلام الحماية في الدوحة: كبائن العمل المعزولة، لف الحواف، ضمان مادة TPU الأليفاتية، ومقارنة أسعار التركيب في قطر لعام 2026.",
    },
    date: "2026-10-04",
    updated: "2026-10-20",
    readingTime: 6,
    category: "buying-guide",
    topics: ["film"],
    keywords: {
      en: ["best PPF installer Doha", "PPF Qatar", "paint protection film Doha", "VTEK PPF price Qatar", "car PPF installation Qatar", "edge wrapping PPF Doha"],
      ar: ["أفضل تركيب حماية سيارات الدوحة", "مركز حماية سيارات قطر", "سعر تركيب PPF قطر", "أفلام حماية الطلاء الدوحة"],
    },
    sections: [
      {
        heading: {
          en: "Clean-Room Environment: Why Shop Conditions Matter in Qatar",
          ar: "بيئة العمل المعزولة: لماذا تعد ظروف المركز حاسمة في قطر",
        },
        body: {
          en: "In Qatar's desert climate, airborne sand and fine dust are constant. Applying paint protection film in an open bay or a semi-sealed workshop inevitably traps microscopic dust specks under the clear urethane, creating permanent bubbles and unsightly blemishes that ruin optical clarity. The best PPF installers in Doha operate sealed, climate-controlled, positive-pressure clean booths with medical-grade air filtration and multi-angle LED inspection lighting. This controlled environment ensures the mounting slip solution dries crystal clear, with zero dust contamination between your factory clear coat and the film.",
          ar: "في مناخ قطر الصحراوي، يتطاير الغبار الناعم والرمل في الهواء باستمرار. تركيب فيلم حماية الطلاء في كبائن مفتوحة أو ورش غير محكمة الإغلاق يؤدي حتماً إلى احتجاز ذرات غبار مجهرية تحت طبقة اليوريثان الشفافة، مما يخلق فقاعات وبقعاً تشوّه نقاء الطلاء. أفضل مراكز تركيب PPF في الدوحة تعمل داخل كبائن معزولة ومكيفة بنظام ضغط هواء إيجابي وفلاتر ترشيح دقيقة وإضاءة LED فحصية متعددة الزوايا. تضمن هذه البيئة المحكومة جفاف محلول التثبيت بنقاء تام دون أي تلوث غباري بين طلاء الوكالة والفيلم.",
        },
      },
      {
        heading: {
          en: "Cutting Technology & Edge Wrapping: Protecting Panel Seams",
          ar: "تقنية القص ولف الحواف: حماية فواصل الألواح",
        },
        body: {
          en: "There are two fundamental installation techniques in Doha: standard pre-cut kits and custom edge-wrapped installations. Low-cost shops often use generic plotter templates that stop 2–3 mm short of each panel's edge. Over time, these exposed borders accumulate dirt, turn dark, and become vulnerable to lifting when hit by high-pressure car wash sprays. Superior installers use advanced software (such as VTEK's computerized design suite) configured with extended borders, allowing technicians to wrap the film around bonnet seams, fender lips, and door edges. Furthermore, computer-plotted templates ensure no razor blades ever touch your vehicle's factory paint.",
          ar: "هناك أسلوبان أساسيان للتركيب في الدوحة: القوالب الجاهزة القياسية والتركيب الاحترافي بلف الحواف. الورش منخفضة التكلفة تستخدم قوالب تقف قبل حافة اللوح بنحو 2 إلى 3 ملم، مما يترك خطاً مكشوفاً يجمع الأوساخ بمرور الوقت ويكون عرضة للانفصال عند غسيل السيارة بضغط ماء عالٍ. أما المراكز المتقدمة فتعتمد برمجيات قص متطورة (مثل منظومة VTEK الرقمية) مبرمجة بزيادات خاصة تتيح للفنيين لف الفيلم حول حواف الكبوت وفواصل الرفارف والأبواب بالكامل. والأهم من ذلك أن القوالب المقصوصة بالكمبيوتر تضمن عدم اقتراب شفرات القطع اليدوية من طلاء المصنع إطلاقاً.",
        },
      },
      {
        heading: {
          en: "Material Chemistry: Aliphatic TPU vs Cheap TPH & PVC",
          ar: "كيمياء المواد: بوليمر TPU الأليفاتي مقابل TPH وPVC الرخيص",
        },
        body: {
          en: "Not all paint protection films survive a Gulf summer. Cheap films made from PVC (polyvinyl chloride) or TPH (hybridized PVC) use volatile plasticizers that degrade rapidly when exposed to Doha's 45°C+ temperatures and UV Index 11+. Within 6 to 12 months, PVC films turn yellow, lose their elasticity, become brittle, and can cause catastrophic paint damage when their low-grade adhesive bakes onto your clear coat. Genuine premium PPF, such as VTEK Weather Armor, is made from thermoplastic polyurethane (TPU), and VTEK backs it with a written warranty against bubbling, cracking, peeling and fading. TPU is built to absorb gravel impacts on highways like Salwa Road and Al Shamal Road, and VTEK describes a self-healing top layer that closes light swirl marks.",
          ar: "ليست كل أفلام حماية الطلاء قادرة على الصمود أمام صيف الخليج. الأفلام الرخيصة المصنوعة من PVC أو TPH تستخدم ملدنات كيميائية تتطاير وتتحلل سريعاً تحت حرارة صيف الدوحة التي تتجاوز 45°م ومؤشر الأشعة فوق البنفسجية 11+. وخلال 6 إلى 12 شهراً تصفرّ هذه الأفلام وتفقد مرونتها وتتصلب، وقد تسبب ضرراً جسيماً لطلاء السيارة عند إزالتها بسبب تفاعل المادة اللاصقة الرديئة مع اللك. في المقابل، يُصنع فيلم VTEK Weather Armor من مادة TPU (البولي يوريثان الحراري) وتدعمه VTEK بضمان مكتوب ضد الفقاعات والتشقق والتقشّر وبهتان اللون. وصُممت مادة TPU لامتصاص ضربات الحصى على طرق قطر السريعة مثل سلوى والشمال، وتصف VTEK طبقة علوية ذاتية الإصلاح تعالج الخدوش الخفيفة.",
        },
      },
      {
        heading: {
          en: "Pricing & Direct-Distributor Value in Doha",
          ar: "الأسعار وقيمة التوريد المباشر من الموزع في الدوحة",
        },
        body: {
          en: "PPF quotes in Doha vary dramatically, typically ranging from QAR 4,000 to QAR 7,500+ for full-body coverage, often with opaque 'call for price' policies. Much of this variance comes from middlemen markups: independent workshops buy rolls from local importers with added distributor margins. ABK Trading & Service operates on a transparent, distributor-direct model. As the authorized Qatar distributor of VTEK, ABK provides fixed, published pricing from its own central stock: front-end kits from QAR 899, full front from QAR 1,599, and full body from QAR 3,999 for sedans, fitted by authorized partner studios. Vehicle owners get genuine top-tier American-standard TPU film at honest, published rates with no hidden surcharges.",
          ar: "تتفاوت عروض أسعار PPF في الدوحة بشدة؛ حيث تتراوح عادةً بين 4,000 و7,500+ ريال قطري للهيكل الكامل، وتكتفي معظم الورش بسياسة «اتصل لمعرفة السعر». يعود جزء كبير من هذا الفارق إلى هوامش الوسطاء حيث تشتري الورش الرولات من الموزعين بأسعار مضافة. تعمل ABK للتجارة والخدمات بنموذج التوريد المباشر من الموزع المعتمد؛ وبصفتها الموزع المعتمد لأفلام VTEK في قطر، تعلن ABK أسعاراً ثابتة وشفافة من مخزونها المركزي: باقة الواجهة من 899 ر.ق، والواجهة الكاملة من 1,599 ر.ق، والهيكل كاملاً من 3,999 ر.ق للسيدان، وتُركَّب في استوديوهات شريكة معتمدة دون أي تكاليف خفية.",
        },
      },
      {
        heading: {
          en: "Warranties in Writing: Film Guarantee vs Workmanship Cover",
          ar: "الضمانات المكتوبة: ضمان خامة الفيلم مقابل ضمان جودة التركيب",
        },
        body: {
          en: "A verbal warranty in the car care industry is unenforceable. When comparing installers, demand two separate written guarantees. First, the manufacturer film warranty: VTEK provides an NFC e-Warranty registered to your car (10 years on Weather Armor PRO and PRO PLUS, 5 on MATTE and PRISM) against defects such as bubbling, cracking, peeling and fading. Second, an explicit installer workmanship guarantee. ABK backs every installation with its own 12-month workmanship cover: if an edge lifts, a corner peels, or a bubble develops from slip-solution trapping, ABK corrects it at zero cost. Every drop-off includes photographic intake documentation and an exhaustive handover inspection.",
          ar: "الضمان الشفهي في قطاع العناية بالسيارات لا قيمة له عند حدوث مشكلة. عند مقارنة المراكز، اطلب ضمانين كتابيين منفصلين: الأول هو ضمان المصنع لخامة الفيلم؛ وتوفر VTEK ضماناً إلكترونياً NFC مسجلاً باسم سيارتك (10 سنوات لفيلمي PRO وPRO PLUS و5 لـ MATTE وPRISM) ضد عيوب مثل الفقاعات والتشقق والتقشّر وبهتان اللون. والضمان الثاني هو ضمان جودة التركيب؛ حيث تدعم ABK كل عملية تركيب بضمان تركيب خاص لمدة 12 شهراً: إذا ارتفعت أي حافة أو ظهرت فقاعة يعالجها المركز مجاناً. وتتضمن كل عملية تسليم توثيقاً فوتوغرافياً شاملاً لحالة السيارة عند الاستلام والتسليم.",
        },
      },
    ],
    relatedProducts: [
      "vtek-ppf-weather-armor-pro",
      "vtek-ppf-weather-armor-pro-plus",
      "vtek-ppf-weather-armor-matte",
      "vtek-ppf-weather-armor-prism",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Authorized VTEK Installation in Doha", ar: "تركيب VTEK معتمد في الدوحة" },
      title: {
        en: "Book Fixed-Price VTEK PPF Installation (From QAR 899)",
        ar: "احجز تركيب VTEK PPF بسعر ثابت (من 899 ر.ق)",
      },
      body: {
        en: "Every ABK installation uses genuine VTEK Weather Armor film from our own distributor stock, backed by a 5–15 year VTEK NFC e-Warranty (by film) and a 12-month fitting guarantee.",
        ar: "يتم كل تركيب لدى ABK بفيلم VTEK Weather Armor الأصلي من مخزوننا المباشر، مع ضمان VTEK الإلكتروني NFC من 5 إلى 15 سنة حسب الفيلم وضمان تركيب لمدة 12 شهراً.",
      },
      primaryHref: "/b2c/ppf-installation",
      primaryLabel: { en: "See Fixed Prices & Book Online", ar: "اعرف السعر الثابت واحجز أونلاين" },
      secondaryHref: "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20would%20like%20to%20book%20VTEK%20PPF%20installation%20in%20Doha.",
      secondaryLabel: { en: "Book via WhatsApp (+974 3083 8355)", ar: "احجز عبر واتساب" },
    },
    faqs: [
      {
        q: {
          en: "How can I tell if a Doha PPF installer is using genuine TPU instead of cheap PVC/TPH?",
          ar: "كيف أتأكد أن مركز تركيب PPF في الدوحة يستخدم TPU أصلي وليس PVC أو TPH رخيص؟",
        },
        a: {
          en: "Ask to see the physical roll box and lot number before installation, verify that the shop is an authorized installer for the brand, and ensure the manufacturer warranty (5 to 15 years depending on the film) is registered to your car. At ABK Trading & Service, the VTEK Weather Armor film comes directly from our own stock as VTEK's authorised Qatar distributor.",
          ar: "اطلب رؤية صندوق الرول ورقم التشغيلة قبل التركيب، وتأكد من اعتماد المركز لدى العلامة التجارية وتسجيل الضمان المصنعي (من 5 إلى 15 سنة حسب الفيلم) باسم سيارتك. في ABK يأتي فيلم VTEK Weather Armor مباشرة من مخزوننا بصفتنا الموزع المعتمد في قطر.",
        },
      },
      {
        q: {
          en: "Does ABK wrap PPF edges around panels?",
          ar: "هل يتم لف حواف فيلم PPF للداخل عند التركيب لدى ABK؟",
        },
        a: {
          en: "Yes. Where panel tolerances allow (such as bonnet seams, fender lips, and door edges), our VTEK-authorized installers extend and wrap edges so dust cannot collect along visible borders and high-pressure washes cannot lift the film.",
          ar: "نعم، في جميع الحواف التي تسمح هندسياً بذلك (مثل حواف الكبوت والرفارف والأبواب)، يقوم الفنيون المعتمدون بلف حواف الفيلم للداخل لمنع تجمع الغبار أو ارتفاع الأطراف مع الغسيل بالضغط العالي.",
        },
      },
      {
        q: {
          en: "What happens if an edge lifts after PPF installation?",
          ar: "ماذا يحدث إذا ارتفعت حافة الفيلم بعد التركيب؟",
        },
        a: {
          en: "Every ABK PPF installation includes an ABK inspection at handover and a written 12-month ABK fitting guarantee on top of VTEK's 5 to 15-year film warranty (by film). Any edge lifting or slip-solution bubble is rectified free of charge.",
          ar: "يشمل كل تركيب لدى ABK فحصاً من ABK عند التسليم وضمان تركيب كتابي لمدة 12 شهراً بالإضافة إلى ضمان المصنع (من 5 إلى 15 سنة حسب الفيلم)، وتُعالج أي ملاحظة في الحواف مجاناً.",
        },
      },
    ],
  },
  {
    slug: "matte-colored-ppf-qatar",
    title: {
      en: "Matte & Colored PPF in Qatar: Prices, Finishes and Care (2026 Guide)",
      ar: "فيلم PPF المطفي والملوّن في قطر: الأسعار والتشطيبات والعناية (دليل 2026)",
    },
    seoTitle: {
      en: "Matte & Colored PPF in Qatar: Prices & Finishes (2026)",
      ar: "PPF مطفي وملوّن في قطر: الأسعار والتشطيبات (2026)",
    },
    description: {
      en: `Matte (satin) and colored PPF in Qatar: installed VTEK MATTE from ${q(M["front-end"].sedan, "en")} (front end) to ${q(M["full-body"].sedan, "en")} (full-body sedan), PRISM colour film priced per car, care and warranty.`,
      ar: `فيلم حماية الطلاء المطفي والملوّن في قطر: تركيب VTEK MATTE من ${q(M["front-end"].sedan, "ar")} للواجهة الأساسية إلى ${q(M["full-body"].sedan, "ar")} للهيكل بالكامل (سيدان)، وفيلم PRISM الملوّن بسعر لكل سيارة، مع العناية والضمان.`,
    },
    date: "2026-10-20",
    readingTime: 5,
    category: "buying-guide",
    topics: ["film"],
    keywords: {
      en: ["matte PPF Qatar", "colored PPF Qatar", "satin PPF Doha", "matte paint protection film price Qatar", "VTEK MATTE", "VTEK PRISM", "color PPF Doha"],
      ar: ["PPF مطفي قطر", "PPF ملون قطر", "سعر حماية الطلاء المطفي الدوحة", "فيلم ساتان للسيارات قطر"],
    },
    sections: [
      {
        heading: {
          en: "Matte and Colored PPF Prices in Qatar at a Glance",
          ar: "أسعار PPF المطفي والملوّن في قطر باختصار",
        },
        body: {
          en: `These are ABK's fixed installed prices for genuine VTEK Weather Armor MATTE (satin TPU, ${matte.warrantyYears}-year warranty), as of ${pricesAsOf("en")}: front-end kit from ${q(M["front-end"].sedan, "en")}, full front from ${q(M["full-front"].sedan, "en")} and full body from ${q(M["full-body"].sedan, "en")} for a sedan or coupe. Mid SUVs, large SUVs and pickups cost more (table below). Colour film — Weather Armor PRISM, ${prism.warrantyYears}-year warranty — is priced per car because colour, coverage and panel count vary: send the car and the colour on WhatsApp for a fixed quote. Every price includes the film, fitting at a VTEK-authorised centre in Doha, NFC e-Warranty registration and ABK's 12-month workmanship cover.`,
          ar: `هذه أسعار التركيب الثابتة لدى ABK لفيلم VTEK Weather Armor MATTE الأصلي (TPU ساتان، ضمان ${matte.warrantyYears} سنوات)، حتى ${pricesAsOf("ar")}: الواجهة الأساسية من ${q(M["front-end"].sedan, "ar")} والواجهة الكاملة من ${q(M["full-front"].sedan, "ar")} والهيكل بالكامل من ${q(M["full-body"].sedan, "ar")} للسيدان والكوبيه، وتزيد الأسعار لسيارات SUV المتوسطة والكبيرة والبيك أب (انظر الجدول). أما الفيلم الملوّن Weather Armor PRISM (ضمان ${prism.warrantyYears} سنوات) فيُسعَّر لكل سيارة لأن اللون وحجم التغطية وعدد القطع تختلف — أرسل سيارتك واللون المطلوب عبر واتساب لتحصل على سعر ثابت. يشمل كل سعر الفيلم والتركيب في مركز معتمد من VTEK في الدوحة وتسجيل الضمان الإلكتروني NFC وضمان ABK للتركيب لمدة 12 شهراً.`,
        },
        table: {
          caption: {
            en: "Installed VTEK Weather Armor MATTE prices (QAR).",
            ar: "أسعار تركيب فيلم VTEK Weather Armor MATTE (بالريال القطري).",
          },
          head: [
            { en: "Coverage", ar: "التغطية" },
            ...BODY_TYPES.map((b) => b.name),
          ],
          rows: (["front-end", "full-front", "full-body"] as const).map((cov) => [
            COVERAGES.find((c) => c.key === cov)!.name,
            ...BODY_TYPES.map((b) => ({
              en: q(M[cov][b.key], "en"),
              ar: q(M[cov][b.key], "ar"),
            })),
          ]),
          source: {
            en: `Source: ABK fixed price list, updated ${pricesAsOf("en")}.`,
            ar: `المصدر: قائمة أسعار ABK الثابتة، آخر تحديث ${pricesAsOf("ar")}.`,
          },
        },
      },
      {
        heading: {
          en: "What Matte PPF Does (and Doesn't Do)",
          ar: "ماذا يفعل PPF المطفي وما حدوده",
        },
        body: {
          en: `Matte PPF is a clear urethane film with a satin finish that sits over your paint. On gloss paint it turns the look satin without repainting or wrapping the car in vinyl, and it can be removed later to bring back the original gloss. On factory matte or frozen paint — which cannot be polished or corrected — it protects against the same stone chips, sand abrasion and wash marks that gloss film stops on gloss paint. VTEK MATTE has a self-healing satin top-coat that clears light scratches with heat, resists grime and keeps an even sheen. The limits are worth knowing: a matte surface cannot be polished or waxed for shine, it needs a matte-safe shampoo, and its ${matte.warrantyYears}-year warranty is shorter than the ${pro.warrantyYears}-year warranty on gloss PRO.`,
          ar: `فيلم PPF المطفي طبقة يوريثان شفافة بتشطيب ساتان تُركَّب فوق طلاء السيارة. على الطلاء اللامع يحوّل المظهر إلى ساتان دون إعادة طلاء السيارة أو تغليفها بفينيل، ويمكن إزالته لاحقاً لاستعادة اللمعان الأصلي. وعلى الطلاء المطفي من المصنع — الذي لا يمكن تلميعه أو تصحيحه — يحميه من الحصى وخدوش الرمل وآثار الغسيل كما يفعل الفيلم اللامع للطلاء اللامع. يتميز VTEK MATTE بطبقة ساتان ذاتية الالتئام تعالج الخدوش الخفيفة بالحرارة وتقاوم الأوساخ وتحافظ على لمعان موحّد. وحدوده واضحة: لا يُلمَّع السطح المطفي ولا يُشمَّع لزيادة اللمعان، ويحتاج شامبو مناسباً للأسطح المطفية، وضمانه (${matte.warrantyYears} سنوات) أقصر من ضمان PRO اللامع (${pro.warrantyYears} سنوات).`,
        },
      },
      {
        heading: {
          en: "Colored PPF (PRISM): Protection Plus a New Colour",
          ar: "الفيلم الملوّن (PRISM): حماية ولون جديد",
        },
        body: {
          en: "PRISM is a coloured TPU film (polycaprolactone-based) that protects the paint like clear PPF while changing the colour. The range ABK lists is Gloss Piano Black, Matte Black, Nardo Grey, Metallic Blue, Pearl White and Satin Metals. Because it is a film and not paint, the factory finish stays underneath and the colour can be removed later. A colour change can affect the car's registration details, so check the Traffic Department's current rules (through Metrash) before you book — ABK cannot give legal advice. Clear film does not change the car's colour.",
          ar: "PRISM فيلم TPU ملوّن (أساسه البوليكابرولاكتون) يحمي الطلاء مثل الفيلم الشفاف ويغيّر اللون في الوقت نفسه. الألوان المعروضة لدى ABK: أسود بيانو لامع، أسود مطفي، رمادي ناردو، أزرق ميتاليك، أبيض لؤلؤي ومعادن ساتان. وبما أنه فيلم وليس طلاءً، يبقى طلاء المصنع تحته ويمكن إزالة اللون لاحقاً. قد يؤثر تغيير لون السيارة على بيانات تسجيلها، فتأكد من أنظمة إدارة المرور الحالية (عبر مطراش) قبل الحجز، علماً أن ABK لا تقدم استشارات قانونية. أما الفيلم الشفاف فلا يغيّر لون السيارة.",
        },
      },
      {
        heading: {
          en: "Caring for Matte PPF in Qatar's Heat and Dust",
          ar: "العناية بالفيلم المطفي في حرارة قطر وغبارها",
        },
        body: {
          en: "Hand-wash with a pH-neutral, wax-free shampoo and a clean microfibre mitt, in the shade and on a cool panel rather than in direct sun. Rinse sand off before the mitt touches the surface. Avoid brush car washes, abrasive compounds, wax and gloss sprays — they leave shiny patches on a matte film. Remove bird droppings and fuel splashes quickly with water and a soft cloth. With a pressure washer, keep the nozzle away from the film edges. Follow the care sheet you receive at handover.",
          ar: "اغسل السيارة يدوياً بشامبو متعادل الحموضة وخالٍ من الشمع ومنشفة مايكروفايبر نظيفة، في الظل وعلى سطح بارد وليس تحت الشمس المباشرة. اشطف الرمل عن السطح قبل أن تلمسه المنشفة. تجنّب مغاسل الفرش الآلية والمعاجين الكاشطة والشمع وبخاخات اللمعان لأنها تترك بقعاً لامعة على الفيلم المطفي. أزل فضلات الطيور وتناثر الوقود سريعاً بالماء وقطعة قماش ناعمة. وعند الغسيل بالضغط العالي ابقَ بالفوهة بعيداً عن حواف الفيلم. واتبع ورقة العناية التي تُسلَّم لك عند الاستلام.",
        },
      },
      {
        heading: {
          en: "Matte, Gloss or Colour: Which Film Should You Choose?",
          ar: "مطفي أم لامع أم ملوّن: أي فيلم تختار؟",
        },
        body: {
          en: `Choose gloss PRO (${pro.warrantyYears}-year warranty) or PRO PLUS when you want the paint to look exactly as it does now, only better protected — the gloss films carry the longer warranties of the installed range. Choose MATTE when you want a satin look or your car has factory matte paint. Choose PRISM only when you want a new colour. On a tighter budget, start with a front-end or full-front kit: the front of the car takes most of the stone chips on Qatar's highways.`,
          ar: `اختر PRO اللامع (ضمان ${pro.warrantyYears} سنوات) أو PRO PLUS إذا أردت أن يبدو الطلاء كما هو الآن لكن بحماية أفضل — فالأفلام اللامعة هي الأطول ضماناً بين الأفلام المركَّبة. واختر MATTE إذا أردت مظهر الساتان أو كان طلاء سيارتك مطفياً من المصنع. واختر PRISM فقط إذا أردت لوناً جديداً. وإن كانت ميزانيتك محدودة فابدأ بالواجهة الأساسية أو الكاملة، إذ تتلقى مقدمة السيارة معظم ضربات الحصى على طرق قطر السريعة.`,
        },
      },
      {
        heading: {
          en: "Get a Fixed Matte PPF Price for Your Car",
          ar: "احصل على سعر ثابت للفيلم المطفي لسيارتك",
        },
        body: {
          en: "Use the quote builder on the PPF installation page, choose the MATTE film and your car size, and the installed price appears instantly. Or send the car and the finish you want on WhatsApp (+974 3083 8355). Payment is in full by bank transfer or cash once the slot is confirmed, with a full refund if you cancel at least 48 hours before.",
          ar: "استخدم أداة التسعير في صفحة تركيب أفلام الحماية، واختر فيلم MATTE وحجم سيارتك ليظهر سعر التركيب فوراً. أو أرسل سيارتك والتشطيب المطلوب عبر واتساب (+974 3083 8355). يتم الدفع كاملاً بتحويل بنكي أو نقداً بعد تأكيد الموعد، مع استرداد كامل عند الإلغاء قبل 48 ساعة على الأقل.",
        },
      },
    ],
    relatedProducts: [
      "vtek-ppf-weather-armor-matte",
      "vtek-ppf-weather-armor-prism",
      "vtek-ppf-weather-armor-pro",
      "vtek-ppf-weather-armor-pro-plus",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Matte PPF Price Calculator", ar: "حاسبة أسعار PPF المطفي" },
      title: {
        en: "See the Installed Price of VTEK MATTE for Your Car",
        ar: "اعرف سعر تركيب VTEK MATTE لسيارتك",
      },
      body: {
        en: "Pick your car size and coverage and the fixed installed price for the matte film appears instantly — no waiting for a callback.",
        ar: "اختر حجم سيارتك ومستوى التغطية ليظهر سعر التركيب الثابت للفيلم المطفي فوراً — دون انتظار اتصال.",
      },
      primaryHref: "/b2c/ppf-installation?film=matte#quote",
      primaryLabel: { en: "Open the Matte PPF Calculator", ar: "افتح حاسبة PPF المطفي" },
      secondaryHref:
        "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20would%20like%20a%20matte%20or%20colour%20PPF%20quote%20for%20my%20car.",
      secondaryLabel: { en: "Ask on WhatsApp (+974 3083 8355)", ar: "استفسر عبر واتساب" },
    },
    faqs: [
      {
        q: {
          en: "How much does matte PPF cost in Qatar?",
          ar: "كم سعر PPF المطفي في قطر؟",
        },
        a: {
          en: `At ABK, installed VTEK Weather Armor MATTE costs ${q(M["full-body"].sedan, "en")} for a full-body sedan or coupe, ${q(M["full-body"].suv, "en")} for a mid SUV and ${q(M["full-body"]["large-suv"], "en")} for a large SUV or pickup. Full-front kits start at ${q(M["full-front"].sedan, "en")} and front-end kits at ${q(M["front-end"].sedan, "en")}.`,
          ar: `لدى ABK يبلغ سعر تركيب VTEK Weather Armor MATTE للهيكل بالكامل ${q(M["full-body"].sedan, "ar")} للسيدان والكوبيه، و${q(M["full-body"].suv, "ar")} لسيارات SUV المتوسطة، و${q(M["full-body"]["large-suv"], "ar")} لسيارات SUV الكبيرة والبيك أب. وتبدأ الواجهة الكاملة من ${q(M["full-front"].sedan, "ar")} والواجهة الأساسية من ${q(M["front-end"].sedan, "ar")}.`,
        },
      },
      {
        q: {
          en: "Is matte PPF the same as a matte vinyl wrap?",
          ar: "هل PPF المطفي هو نفسه تغليف الفينيل المطفي؟",
        },
        a: {
          en: "No. A vinyl wrap is mainly cosmetic. Matte PPF is a thicker, self-healing urethane film built to take stone chips, sand abrasion and light scratches while giving a satin finish.",
          ar: "لا. تغليف الفينيل تجميلي في الأساس، أما PPF المطفي فهو فيلم يوريثان أسمك وذاتي الالتئام صُمم لتحمّل الحصى وخدوش الرمل والخدوش الخفيفة مع منحك تشطيب ساتان.",
        },
      },
      {
        q: {
          en: "How long does matte PPF last in Qatar?",
          ar: "كم يدوم PPF المطفي في قطر؟",
        },
        a: {
          en: `VTEK MATTE carries a ${matte.warrantyYears}-year NFC e-Warranty against defects such as bubbling, cracking, peeling and fading (see vtekfilms.com/warranty) when fitted by an authorised installer. Gloss PRO carries ${pro.warrantyYears} years.`,
          ar: `يحمل VTEK MATTE ضماناً إلكترونياً NFC لمدة ${matte.warrantyYears} سنوات ضد عيوب مثل الفقاعات والتشقق والتقشّر وبهتان اللون (راجع vtekfilms.com/warranty) عند تركيبه لدى مركز معتمد، بينما يحمل PRO اللامع ${pro.warrantyYears} سنوات.`,
        },
      },
      {
        q: {
          en: "Can I put matte PPF on a gloss car and remove it later?",
          ar: "هل يمكن تركيب PPF مطفي على سيارة لامعة ثم إزالته لاحقاً؟",
        },
        a: {
          en: "Yes. Fitted over sound factory paint, the film can be removed by a professional to bring back the original gloss. Repainted panels or paint with a weak bond can lift when film is removed, so tell the installer if any panel has been resprayed.",
          ar: "نعم. عند تركيبه على طلاء المصنع السليم يمكن إزالته على يد مختص لاستعادة اللمعان الأصلي. أما الألواح المعاد طلاؤها أو الطلاء ضعيف الالتصاق فقد يرتفع عند إزالة الفيلم، لذا أخبر الفني إن كان أي لوح قد أُعيد رشّه.",
        },
      },
      {
        q: {
          en: "How do I wash a car with matte PPF?",
          ar: "كيف أغسل سيارة عليها PPF مطفي؟",
        },
        a: {
          en: "Hand-wash in the shade with a pH-neutral, wax-free shampoo and a clean microfibre mitt, rinse sand off first, and avoid wax, polish, gloss sprays, abrasive compounds and brush washes, which leave shiny patches on a matte finish.",
          ar: "اغسلها يدوياً في الظل بشامبو متعادل الحموضة وخالٍ من الشمع ومنشفة مايكروفايبر نظيفة، واشطف الرمل أولاً، وتجنّب الشمع والملمّعات وبخاخات اللمعان والمعاجين الكاشطة ومغاسل الفرش لأنها تترك بقعاً لامعة على التشطيب المطفي.",
        },
      },
      {
        q: {
          en: "Can I get colored PPF in Qatar and what does it cost?",
          ar: "هل يتوفر PPF ملوّن في قطر وكم سعره؟",
        },
        a: {
          en: "Yes — ABK installs VTEK Weather Armor PRISM colour film. It is priced per car, so send the car and the colour you want on WhatsApp (+974 3083 8355) for a fixed quote. Check the Traffic Department's rules on colour changes before booking.",
          ar: "نعم — تركّب ABK فيلم VTEK Weather Armor PRISM الملوّن. ويُسعَّر لكل سيارة، فأرسل سيارتك واللون المطلوب عبر واتساب (+974 3083 8355) لتحصل على سعر ثابت. وتأكد من أنظمة إدارة المرور بشأن تغيير اللون قبل الحجز.",
        },
      },
    ],
  },
  {
    slug: "best-ppf-brands-qatar",
    title: {
      en: "Best PPF Brands in Qatar (2026): XPEL, 3M, STEK, SunTek, LLumar and VTEK Compared",
      ar: "أفضل علامات PPF في قطر (2026): مقارنة XPEL و3M وSTEK وSunTek وLLumar وVTEK",
    },
    seoTitle: {
      en: "Best PPF Brands in Qatar (2026): XPEL, 3M, STEK & More",
      ar: "أفضل علامات PPF في قطر 2026: XPEL و3M وSTEK وVTEK",
    },
    description: {
      en: "How the leading PPF brands compare for buyers in Qatar: warranty terms, installer requirements and what to ask — XPEL, 3M, STEK, SunTek, LLumar and VTEK, sourced from each manufacturer.",
      ar: "كيف تقارن أبرز علامات فيلم حماية الطلاء لمشتري قطر: شروط الضمان واشتراطات المُركّب وما تسأل عنه — XPEL و3M وSTEK وSunTek وLLumar وVTEK، بالاستناد إلى كل شركة مصنِّعة.",
    },
    date: "2026-10-20",
    readingTime: 6,
    category: "buying-guide",
    topics: ["film"],
    keywords: {
      en: ["best PPF brands Qatar", "XPEL PPF Qatar", "3M PPF Qatar", "STEK PPF Qatar", "SunTek PPF Qatar", "LLumar PPF Qatar", "VTEK PPF", "PPF warranty comparison"],
      ar: ["أفضل علامات PPF قطر", "XPEL قطر", "3M PPF قطر", "STEK قطر", "مقارنة ضمان فيلم حماية الطلاء"],
    },
    sections: [
      {
        heading: {
          en: "How to Compare PPF Brands in Qatar",
          ar: "كيف تقارن علامات PPF في قطر",
        },
        body: {
          en: "Six brands dominate the conversation when Qatar car owners ask about paint protection film: XPEL, 3M, STEK, SunTek, LLumar and VTEK. A brand name alone does not tell you what you are buying. Compare four things in writing: the exact film line (each brand sells several), the warranty terms and what they cover, whether the warranty requires an authorised installer, and who will physically fit the film — installer skill decides edges, seams and cleanliness as much as the roll does. ABK distributes VTEK in Qatar, so we have an interest in this comparison; every figure below is taken from the manufacturer's own pages, with the source shown in the table.",
          ar: "تتصدّر ستّ علامات حديث أصحاب السيارات في قطر عن فيلم حماية الطلاء: XPEL و3M وSTEK وSunTek وLLumar وVTEK. واسم العلامة وحده لا يخبرك بما تشتريه. قارن أربعة أمور كتابةً: خط الفيلم بدقة (فلكل علامة عدة خطوط)، وشروط الضمان وما يغطيه، وهل يشترط الضمان مُركّباً معتمداً، ومن سيركّب الفيلم فعلياً — فمهارة المُركّب تحدد جودة الحواف والوصلات والنظافة بقدر ما يحددها الفيلم نفسه. تُوزّع ABK علامة VTEK في قطر، لذا فلنا مصلحة في هذه المقارنة؛ وكل رقم أدناه مأخوذ من صفحات الشركة المصنِّعة نفسها مع ذكر المصدر في الجدول.",
        },
      },
      {
        heading: {
          en: "Published Warranty Terms, Brand by Brand",
          ar: "شروط الضمان المنشورة، علامةً بعلامة",
        },
        body: {
          en: "The table lists the flagship gloss and matte lines as each manufacturer describes them on its own website, read on 20 October 2026. Manufacturers change terms and some publish different terms by region, so confirm the current wording with the installer before you pay.",
          ar: "يعرض الجدول الخطوط الرئيسية اللامعة والمطفية كما تصفها كل شركة على موقعها، وقد قُرئت بتاريخ 20 أكتوبر 2026. تغيّر الشركات شروطها وبعضها ينشر شروطاً مختلفة حسب المنطقة، لذا تأكد من الصياغة الحالية مع المُركّب قبل الدفع.",
        },
        table: {
          caption: {
            en: "Manufacturer-published PPF warranty terms, read 20 October 2026.",
            ar: "شروط ضمان PPF كما نشرتها الشركات المصنِّعة، قُرئت بتاريخ 20 أكتوبر 2026.",
          },
          head: [
            { en: "Brand and film", ar: "العلامة والفيلم" },
            { en: "Published warranty", ar: "الضمان المنشور" },
            { en: "Installer requirement", ar: "اشتراط المُركّب" },
            { en: "Source", ar: "المصدر" },
          ],
          rows: [
            [
              { en: "XPEL ULTIMATE PLUS (gloss), STEALTH (satin)", ar: "XPEL ULTIMATE PLUS (لامع) وSTEALTH (ساتان)" },
              { en: "10 years — yellowing, cracking, blistering and delaminating", ar: "10 سنوات — الاصفرار والتشقق والانتفاخ والانفصال" },
              { en: "Only on professionally installed film; claims go through the authorised installer", ar: "فقط على الفيلم المُركَّب باحتراف؛ وتمر المطالبات عبر المُركّب المعتمد" },
              { en: "xpel.com/warranty-information", ar: "xpel.com/warranty-information" },
            ],
            [
              { en: "3M Scotchgard Pro Series 200 (gloss and matte)", ar: "3M Scotchgard Pro Series 200 (لامع ومطفي)" },
              { en: "10 years — yellowing, bubbling and cracking", ar: "10 سنوات — الاصفرار والفقاعات والتشقق" },
              { en: "Qatar product page: professionally installed by 3M authorised installers", ar: "صفحة المنتج في قطر: تركيب احترافي لدى مُركّبين معتمدين من 3M" },
              { en: "3M Pro Series 200 brochure; 3m.com.qa product page", ar: "كتيّب 3M Pro Series 200؛ صفحة المنتج على 3m.com.qa" },
            ],
            [
              { en: "STEK DYNOshield, DYNOmatte", ar: "STEK DYNOshield وDYNOmatte" },
              { en: "10 years on the US site; 12 years, with conditions, on the global site", ar: "10 سنوات على الموقع الأمريكي؛ و12 سنة بشروط على الموقع العالمي" },
              { en: "Not stated; the global page says terms may vary by region", ar: "غير مذكور؛ وتذكر الصفحة العالمية أن الشروط قد تختلف حسب المنطقة" },
              { en: "stek-usa.com; stekautomotive.com", ar: "stek-usa.com؛ stekautomotive.com" },
            ],
            [
              { en: "SunTek Ultra, Ultra Matte; Reaction", ar: "SunTek Ultra وUltra Matte؛ وReaction" },
              { en: "Ultra: 10 years against cracking, bubbling or yellowing. Reaction: 12-year limited warranty", ar: "Ultra: 10 سنوات ضد التشقق والفقاعات والاصفرار. Reaction: ضمان محدود 12 سنة" },
              { en: "Sold and installed by professionals; “see dealer”", ar: "تُباع وتُركَّب عبر محترفين؛ «راجع الوكيل»" },
              { en: "suntekfilms.com", ar: "suntekfilms.com" },
            ],
            [
              { en: "LLumar Platinum; Valor", ar: "LLumar Platinum وValor" },
              { en: "Platinum: 10 years. Valor: limited 12-year warranty", ar: "Platinum: 10 سنوات. Valor: ضمان محدود 12 سنة" },
              { en: "“See dealer”", ar: "«راجع الوكيل»" },
              { en: "llumar.com", ar: "llumar.com" },
            ],
            [
              { en: "VTEK Weather Armor", ar: "VTEK Weather Armor" },
              { en: "ULTIMATE 15 years, PRO 10, MATTE 5, PRISM 5", ar: "ULTIMATE: 15 سنة، PRO: 10، MATTE: 5، PRISM: 5" },
              { en: "Film professionally installed by authorised installers; roll checked through the NFC e-Warranty portal", ar: "فيلم يُركَّب باحتراف لدى مُركّبين معتمدين؛ ويُتحقق من الرول عبر بوابة الضمان الإلكتروني NFC" },
              { en: "vtekfilms.com/warranty", ar: "vtekfilms.com/warranty" },
            ],
          ],
        },
      },
      {
        heading: {
          en: "What the Warranty Numbers Do and Don't Tell You",
          ar: "ماذا تخبرك أرقام الضمان وماذا لا تخبرك",
        },
        body: {
          en: "Ten years is the common flagship warranty: it is what XPEL, 3M, SunTek Ultra, LLumar Platinum and STEK's US site publish. A few lines go to 12 years (SunTek Reaction, LLumar Valor, STEK's global site with conditions). VTEK's ULTIMATE line, at 15 years, is the longest warranty any of the six publishes for a standard film line, while VTEK PRO's 10 years matches the flagship tier of the others. A warranty is a promise about defects in the film, not a forecast of how long it will look new: manufacturer warranties typically exclude impact damage, accidents and improper care, and SunTek notes that its warranty is void over repainted or aftermarket paint. Only some brands publish a thickness — XPEL and STEK quote 8 mil on their product pages and STEK's DYNOmight is 10 mil — so do not choose on a thickness number alone.",
          ar: "عشر سنوات هي الضمان الشائع للخطوط الرئيسية: وهذا ما تنشره XPEL و3M وSunTek Ultra وLLumar Platinum وموقع STEK الأمريكي. وتصل بعض الخطوط إلى 12 سنة (SunTek Reaction وLLumar Valor وموقع STEK العالمي بشروط). أما خط VTEK ULTIMATE فبضمان 15 سنة هو الأطول بين ما تنشره العلامات الست لخط أفلام قياسي، بينما يطابق ضمان VTEK PRO البالغ 10 سنوات الفئة الرئيسية لدى الأخريات. والضمان وعدٌ بشأن عيوب في الفيلم لا توقّع لمدة بقائه جديداً: فضمانات الشركات المصنِّعة تستثني عادةً أضرار الصدمات والحوادث وسوء العناية، وتذكر SunTek أن ضمانها يسقط على الطلاء المعاد رشّه أو المعدَّل. ولا تنشر كل العلامات سماكة الفيلم — فـ XPEL وSTEK تذكران 8 مل في صفحات منتجاتهما وSTEK DYNOmight بسماكة 10 مل — لذا لا تختر بناءً على رقم السماكة وحده.",
        },
      },
      {
        heading: {
          en: "Where to Find Authorised Installers in Qatar",
          ar: "أين تجد مُركّبين معتمدين في قطر",
        },
        body: {
          en: "XPEL publishes an installer locator that lists nine Doha shops (xpel.com/installers/Qatar/All/All, read 20 October 2026). 3M, STEK, SunTek and LLumar each run their own locator or distributor map on their websites. For VTEK, ABK is the Qatar distributor — VTEK's contact page lists ABK's Mesaimeer showroom (vtekfilms.com/contact-us) — and ABK arranges the fitting at a VTEK-authorised centre in Doha; any roll's e-Warranty can be checked on nfc.vtekfilms.com/verify.",
          ar: "تنشر XPEL دليلاً للمُركّبين يضم تسعة مراكز في الدوحة (xpel.com/installers/Qatar/All/All، قُرئ بتاريخ 20 أكتوبر 2026). وتوفّر 3M وSTEK وSunTek وLLumar دليلاً أو خريطة موزعين على مواقعها. وبالنسبة إلى VTEK فإن ABK هي الموزع في قطر — وتُدرج صفحة التواصل لدى VTEK معرض ABK في مسيمير (vtekfilms.com/contact-us) — وترتّب ABK التركيب لدى مركز معتمد من VTEK في الدوحة؛ ويمكن التحقق من الضمان الإلكتروني لأي رول عبر nfc.vtekfilms.com/verify.",
        },
      },
      {
        heading: {
          en: "Comparing Quotes Like for Like",
          ar: "مقارنة العروض على أساس متكافئ",
        },
        body: {
          en: `When you hold two quotes, line up the brand and exact film line, gloss or matte, the coverage (front end, full front or full body) and which edges are wrapped, the written warranty and who issues it, the installer's own workmanship guarantee, and whether film removal or paint preparation is included. A cheaper quote that names no film line is not comparable. ABK's fixed installed prices for genuine VTEK Weather Armor PRO start at ${q(fromPrice("front-end"), "en")} for a front-end kit and ${q(P["full-body"].sedan, "en")} for a full-body sedan, with a 12-month ABK workmanship cover on top of the film warranty.`,
          ar: `عندما تحمل عرضين، قابِل بين العلامة وخط الفيلم بدقة، واللامع أو المطفي، والتغطية (واجهة أساسية أو كاملة أو هيكل كامل) وأي الحواف تُلَفّ، والضمان المكتوب ومن يُصدره، وضمان المُركّب لجودة عمله، وهل تُشمل إزالة الفيلم أو تجهيز الطلاء. والعرض الأرخص الذي لا يذكر خط الفيلم لا يصلح للمقارنة. تبدأ أسعار التركيب الثابتة لدى ABK لفيلم VTEK Weather Armor PRO الأصلي من ${q(fromPrice("front-end"), "ar")} للواجهة الأساسية و${q(P["full-body"].sedan, "ar")} للهيكل بالكامل (سيدان)، مع ضمان تركيب من ABK لمدة 12 شهراً فوق ضمان الفيلم.`,
        },
      },
    ],
    relatedProducts: [
      "vtek-ppf-weather-armor-ultimate",
      "vtek-ppf-weather-armor-pro",
      "vtek-ppf-weather-armor-matte",
      "vtek-ppf-weather-armor-prism",
    ],
    cta: PPF_INSTALL_CTA,
    inlineCta: {
      badge: { en: "Installed VTEK PPF", ar: "تركيب VTEK PPF" },
      title: {
        en: "See ABK's Fixed Installed Prices Before You Compare Quotes",
        ar: "اطّلع على أسعار ABK الثابتة قبل مقارنة العروض",
      },
      body: {
        en: "Pick your car size, coverage and film in the quote builder to see the exact installed price, then compare it with any other written quote.",
        ar: "اختر حجم سيارتك والتغطية والفيلم في أداة التسعير لتعرف سعر التركيب بدقة، ثم قارنه بأي عرض مكتوب آخر.",
      },
      primaryHref: "/b2c/ppf-installation#quote",
      primaryLabel: { en: "Open the PPF Price Calculator", ar: "افتح حاسبة أسعار PPF" },
      secondaryHref:
        "https://wa.me/97430838355?text=Hi%20ABK%2C%20I%20am%20comparing%20PPF%20brands%20and%20would%20like%20a%20VTEK%20quote%20for%20my%20car.",
      secondaryLabel: { en: "Ask on WhatsApp (+974 3083 8355)", ar: "استفسر عبر واتساب" },
    },
    faqs: [
      {
        q: {
          en: "Which PPF brand is best in Qatar?",
          ar: "ما أفضل علامة PPF في قطر؟",
        },
        a: {
          en: "There is no single best brand. XPEL, 3M, STEK, SunTek, LLumar and VTEK all publish a 10-year warranty on a flagship film. What separates one quote from another is the exact film line, the warranty conditions, who installs it and the installer's own guarantee, so compare those in writing. ABK sells and arranges installation of VTEK.",
          ar: "لا توجد علامة واحدة هي الأفضل. فـ XPEL و3M وSTEK وSunTek وLLumar وVTEK تنشر جميعها ضمان 10 سنوات لفيلم رئيسي. وما يفرّق بين عرض وآخر هو خط الفيلم بدقة وشروط الضمان ومن يُركّب وضمان المُركّب نفسه، لذا قارن ذلك كتابةً. وتبيع ABK علامة VTEK وترتّب تركيبها.",
        },
      },
      {
        q: {
          en: "How long does 3M PPF last?",
          ar: "كم يدوم PPF من 3M؟",
        },
        a: {
          en: "3M's published warranty for Scotchgard Pro Series 200 gloss and matte is 10 years against yellowing, bubbling and cracking when professionally installed (3M Pro Series 200 brochure, read 20 October 2026); 3M's terms can differ by market, so ask for the Qatar warranty card. How long the film actually looks new depends on care, parking and Qatar's heat and sand.",
          ar: "ضمان 3M المنشور لفيلمي Scotchgard Pro Series 200 اللامع والمطفي هو 10 سنوات ضد الاصفرار والفقاعات والتشقق عند التركيب باحتراف (كتيّب 3M Pro Series 200، قُرئ بتاريخ 20 أكتوبر 2026)، وقد تختلف شروط 3M من سوق إلى آخر فاطلب بطاقة الضمان الخاصة بقطر. أما مدة بقاء الفيلم جديداً فعلياً فتعتمد على العناية ومكان الوقوف وحرارة قطر ورملها.",
        },
      },
      {
        q: {
          en: "How long does XPEL ULTIMATE PLUS last?",
          ar: "كم يدوم XPEL ULTIMATE PLUS؟",
        },
        a: {
          en: "XPEL publishes a 10-year warranty on ULTIMATE PLUS covering yellowing, cracking, blistering and delaminating, valid only on professionally installed film (xpel.com/warranty-information, read 20 October 2026).",
          ar: "تنشر XPEL ضمان 10 سنوات على ULTIMATE PLUS يغطي الاصفرار والتشقق والانتفاخ والانفصال، ويسري فقط على الفيلم المُركَّب باحتراف (xpel.com/warranty-information، قُرئ بتاريخ 20 أكتوبر 2026).",
        },
      },
      {
        q: {
          en: "Is XPEL better than 3M?",
          ar: "هل XPEL أفضل من 3M؟",
        },
        a: {
          en: "Both publish a 10-year warranty on their flagship gloss film. A warranty number does not show which film will last longer on your car; installer skill and aftercare matter as much. Compare the written terms and the installer's workmanship guarantee rather than the brand name.",
          ar: "تنشر الشركتان ضمان 10 سنوات على فيلمهما اللامع الرئيسي. ورقم الضمان لا يبيّن أي الفيلمين سيدوم أطول على سيارتك؛ فمهارة المُركّب والعناية اللاحقة لا تقلان أهمية. قارن الشروط المكتوبة وضمان المُركّب لجودة عمله بدل اسم العلامة.",
        },
      },
      {
        q: {
          en: "What does a PPF warranty cover?",
          ar: "ماذا يغطي ضمان PPF؟",
        },
        a: {
          en: "Manufacturer warranties cover defects in the film itself, for example yellowing, cracking, bubbling, peeling or blistering, and the list differs by brand. They normally require professional installation and typically exclude impact damage, accidents and improper care. Workmanship, such as lifting edges, is covered separately by the installer's own guarantee.",
          ar: "تغطي ضمانات الشركات المصنِّعة عيوباً في الفيلم نفسه، مثل الاصفرار والتشقق والفقاعات والتقشّر والانتفاخ، وتختلف القائمة من علامة إلى أخرى. وتشترط عادةً التركيب الاحترافي وتستثني غالباً أضرار الصدمات والحوادث وسوء العناية. أما جودة التركيب، كارتفاع الحواف، فيغطيها ضمان المُركّب نفسه بشكل منفصل.",
        },
      },
      {
        q: {
          en: "Where can I find XPEL installers in Qatar?",
          ar: "أين أجد مُركّبي XPEL في قطر؟",
        },
        a: {
          en: "XPEL's installer locator lists nine Doha shops at xpel.com/installers/Qatar/All/All (read 20 October 2026). ABK does not sell XPEL; ABK distributes VTEK and arranges VTEK installation at an authorised centre in Doha.",
          ar: "يضم دليل مُركّبي XPEL تسعة مراكز في الدوحة على xpel.com/installers/Qatar/All/All (قُرئ بتاريخ 20 أكتوبر 2026). ولا تبيع ABK علامة XPEL؛ فهي توزّع VTEK وترتّب تركيبها لدى مركز معتمد في الدوحة.",
        },
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/**
 * Guides for a page, most relevant first. A guide that names one of the
 * page's products outranks one that only shares a category (2 points per
 * product, 1 per category); ties go to the most recently updated guide.
 * Guides with no overlap are left out: an unrelated link earns no click and
 * tells crawlers nothing.
 */
export function relatedGuides(opts: {
  products?: readonly string[];
  categories?: readonly CategoryKey[];
  excludeSlug?: string;
  limit?: number;
}): Article[] {
  const products = new Set(opts.products ?? []);
  const categories = new Set(opts.categories ?? []);
  return ARTICLES.filter((a) => a.slug !== opts.excludeSlug)
    .map((a) => ({
      a,
      score:
        2 * a.relatedProducts.filter((s) => products.has(s)).length +
        a.topics.filter((c) => categories.has(c)).length,
    }))
    .filter((x) => x.score > 0)
    .sort(
      (x, y) =>
        y.score - x.score ||
        (y.a.updated ?? y.a.date).localeCompare(x.a.updated ?? x.a.date),
    )
    .slice(0, opts.limit ?? 3)
    .map((x) => x.a);
}
