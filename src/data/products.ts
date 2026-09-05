/**
 * Typed product catalogue for ABK Trading & Service.
 *
 * Add/remove products by editing this file. Schema intentionally mirrors a CMS
 * document shape so migration to Sanity (or similar) later is copy-paste.
 *
 * Image paths are relative to /public and optimized at runtime by Next.js Image.
 */

export type BrandKey =
  | "VTEK"
  | "Vertek"
  | "Autotriz"
  | "Briller"
  | "Grizzly"
  | "InstaFinish"
  | "Getsun"
  | "ABK"
  | "SmartCar"
  | "Other";

export type CategoryKey =
  | "ppf"
  | "tint"
  | "shampoo"
  | "polish"
  | "tyre"
  | "glass"
  | "dressing"
  | "wax"
  | "interior"
  | "degreaser"
  | "heavy-duty"
  | "fragrance"
  | "accessories"
  | "ceramic";

export type AudienceScope = "b2c" | "b2b" | "both";

export type LocalizedText = { en: string; ar: string };

export type Product = {
  slug: string;
  brand: BrandKey;
  category: CategoryKey;
  name: LocalizedText;
  shortDesc: LocalizedText;
  longDesc: LocalizedText;
  images: string[];
  specs?: Array<{ label: LocalizedText; value: LocalizedText }>;
  audience: AudienceScope;
  featured?: boolean; // star products
  highlight?: "briller-color" | "vertek-premium"; // special visual treatment hints
  // ISO date (YYYY-MM-DD). Bump when product copy/images change so the sitemap
  // signals a real update to crawlers. Sites that lie with `lastmod=now` on
  // every URL get demoted by Google's freshness heuristic.
  updatedAt?: string;
};

// Initial product data publication date. Used as the fallback `updatedAt`
// when individual products don't set one. Bump per-product as catalogue
// entries are revised.
export const PRODUCT_DEFAULT_UPDATED_AT = "2026-04-22";

export const PRODUCTS: Product[] = [
  // ───── VTEK (formerly Vertek) — Paint Protection Film (STAR)
  {
    slug: "vtek-ppf-weather-armor-ultimate",
    brand: "VTEK",
    category: "ppf",
    name: {
      en: "VTEK PPF — Weather Armor ULTIMATE",
      ar: "VTEK — فيلم حماية الطلاء Weather Armor ULTIMATE",
    },
    shortDesc: {
      en: "Flagship Polycarbonate TPU paint protection film with ultra-gloss clarity, instant self-healing, 7.5 mil thickness and 15-year warranty. Made in USA.",
      ar: "فيلم حماية الطلاء الرائد من بولي كربونات TPU بسماكة 7.5 مل، لمعان فائق، إصلاح ذاتي فوري وضمان 15 سنة. صُنع في الولايات المتحدة الأمريكية (USA).",
    },
    longDesc: {
      en: "VTEK® Weather Armor™ ULTIMATE represents the pinnacle of paint protection film technology. Engineered in the USA with Advanced Polycarbonate TPU at 7.5 mil thickness, it delivers exceptional optical clarity, superior stretchability, and extreme resistance against yellowing, chemical stains, desert sand abrasion, and rock chip impact. Designed for long-term durability under harsh Middle Eastern climate conditions, Ultimate offers an instant self-healing, ultra-gloss finish backed by a 15-year manufacturer warranty. Made in USA.",
      ar: "يمثل فيلم VTEK® Weather Armor™ ULTIMATE قمة تكنولوجيا أفلام حماية الطلاء. صُنع في الولايات المتحدة الأمريكية من بولي كربونات TPU المتطورة بسماكة 7.5 مل ليمنح نقاءً بصرياً استثنائياً ومرونة فائقة ومقاومة قصوى للاصفرار والبقع الكيميائية وتآكل الرمال الصحراوية وأضرار الحصى. صُمم لتحمل أقسى الظروف المناخية في قطر، مع طبقة ذاتية الالتئام الفوري ولمعان فائق يبرز عمق ولون طلاء السيارة الأصلي، مع ضمان شامل لمدة 15 سنة.",
    },
    images: [
      "/products/vtek/vtek-weather-armor-ultimate-v2.webp",
    ],
    specs: [
      {
        label: { en: "Material", ar: "المادة" },
        value: { en: "Advanced Polycarbonate TPU", ar: "بولي كربونات TPU متطور" },
      },
      {
        label: { en: "Thickness", ar: "السماكة" },
        value: { en: "7.5 mil (190 µm)", ar: "٧.٥ مل (١٩٠ ميكرون)" },
      },
      {
        label: { en: "Finish", ar: "التشطيب" },
        value: { en: "Ultra-Gloss High Depth", ar: "لمعان فائق عالي العمق" },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: {
          en: "Instant Heat Self-Healing & Hydrophobic Top-Coat",
          ar: "إصلاح ذاتي فوري بالحرارة وطارد فائق للسوائل",
        },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "15-Year Manufacturer Warranty", ar: "ضمان المصنع لمدة ١٥ سنة" },
      },
      {
        label: { en: "Resistance", ar: "المقاومة" },
        value: {
          en: "Extreme UV, Desert Sand, Road Salts & Chemicals",
          ar: "مقاومة قصوى للأشعة فوق البنفسجية والرمال والأملاح والمواد الكيميائية",
        },
      },
      {
        label: { en: "Origin", ar: "بلد المنشأ" },
        value: { en: "Made in USA", ar: "صُنع في الولايات المتحدة الأمريكية (USA)" },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  {
    slug: "vtek-ppf-weather-armor-pro",
    brand: "VTEK",
    category: "ppf",
    name: {
      en: "VTEK PPF — Weather Armor PRO",
      ar: "VTEK — فيلم حماية الطلاء Weather Armor PRO",
    },
    shortDesc: {
      en: "Proven performance paint protection film with robust scratch resistance, high optical gloss and 10-year warranty.",
      ar: "فيلم حماية طلاء عالي الأداء والموثوقية بمقاومة قوية للخدوش ولمعان بصري نقي وضمان 10 سنوات.",
    },
    longDesc: {
      en: "VTEK® Weather Armor™ PRO offers an excellent balance of protection, gloss, and flexibility. It provides robust resistance to scratches, stains, and weathering while maintaining outstanding optical transparency. Designed for professional installers seeking reliability and easy handling, PRO ensures long-lasting protection for both daily drivers and premium vehicles across Qatar. Backed by a 10-year warranty.",
      ar: "يوفر فيلم VTEK® Weather Armor™ PRO توازناً ممتازاً بين الحماية واللمعان والمرونة العالية. يمنح مقاومة قوية للخدوش والبقع والعوامل الجوية مع الحفاظ على شفافية بصرية نقية. صُمم لتسهيل عملية التركيب الاحترافي وضمان حماية موثوقة طويلة الأمد للسيارات اليومية والفاخرة في قطر، مع ضمان لمدة 10 سنوات.",
    },
    images: [
      "/products/vtek/vtek-weather-armor-pro.webp",
    ],
    specs: [
      {
        label: { en: "Material", ar: "المادة" },
        value: { en: "High-Grade Aliphatic TPU", ar: "مادة TPU أليفاتية عالية الجودة" },
      },
      {
        label: { en: "Thickness", ar: "السماكة" },
        value: { en: "7.5 mil (190 µm)", ar: "٧.٥ مل (١٩٠ ميكرون)" },
      },
      {
        label: { en: "Finish", ar: "التشطيب" },
        value: { en: "High Optical Clarity Gloss", ar: "لمعان عالي الشفافية والنقاء" },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: {
          en: "Heat-Activated Self-Healing Nano-Coat",
          ar: "طلاء نانو ذاتي الإصلاح بالحرارة",
        },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "10-Year Warranty", ar: "ضمان ١٠ سنوات" },
      },
      {
        label: { en: "Handling", ar: "التركيب" },
        value: {
          en: "Smooth installation with balanced flexibility",
          ar: "تركيب سلس بمرونة متوازنة ومطواعية عالية",
        },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  {
    slug: "vtek-ppf-weather-armor-pro-plus",
    brand: "VTEK",
    category: "ppf",
    name: {
      en: "VTEK PPF — Weather Armor PRO PLUS",
      ar: "VTEK — فيلم حماية الطلاء Weather Armor PRO PLUS",
    },
    shortDesc: {
      en: "Advanced aliphatic TPU paint protection film with high-durability hydrophobic topcoat, extreme clarity and 12-year warranty.",
      ar: "فيلم حماية طلاء متطور من TPU الأليفاتي مع طبقة نانوية طاردة للماء، لمعان فائق وضمان ١٢ سنة.",
    },
    longDesc: {
      en: "VTEK® Weather Armor™ PRO PLUS takes paint defense to the next tier. Engineered with high-density aliphatic TPU and a resilient heat-activated nano topcoat, PRO PLUS delivers superior stone chip resistance, enhanced chemical tolerance against road film and bird droppings, and an ultra-gloss finish that deepens factory paint color. Ideal for high-mileage luxury vehicles and daily drivers in Qatar, backed by a comprehensive 12-year warranty.",
      ar: "يرتقي فيلم VTEK® Weather Armor™ PRO PLUS بمستوى حماية الطلاء إلى درجات متقدمة. صُنع من مادة TPU الأليفاتية عالية الكثافة مع طبقة نانوية فائقة تنشط بالحرارة للإصلاح الذاتي، ليمنح مقاومة استثنائية لضربات الحصى والتأثيرات البيئية والمواد الكيميائية مع لمعان بصري عميق يعزز نقاء لون طلاء الوكالة، ومدعوم بضمان رسمي شامل لمدة ١٢ سنة.",
    },
    images: [
      "/products/vtek/vtek-weather-armor-pro-plus.webp",
    ],
    specs: [
      {
        label: { en: "Material", ar: "المادة" },
        value: { en: "High-Grade Aliphatic TPU", ar: "مادة TPU أليفاتية عالية الجودة" },
      },
      {
        label: { en: "Thickness", ar: "السماكة" },
        value: { en: "8.0 mil (203 µm)", ar: "٨.٠ مل (٢٠٣ ميكرون)" },
      },
      {
        label: { en: "Finish", ar: "التشطيب" },
        value: { en: "High Optical Clarity Gloss", ar: "لمعان عالي الشفافية والنقاء" },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: {
          en: "Heat-Activated Self-Healing Nano-Coat",
          ar: "طلاء نانو ذاتي الإصلاح بالحرارة",
        },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "12-Year Warranty", ar: "ضمان ١٢ سنة" },
      },
      {
        label: { en: "Resistance", ar: "المقاومة" },
        value: {
          en: "Extreme UV, Desert Sand & Chemical Stains",
          ar: "مقاومة قصوى للأشعة والرمال والبقع",
        },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  {
    slug: "vtek-ppf-weather-armor-matte",
    brand: "VTEK",
    category: "ppf",
    name: {
      en: "VTEK PPF — Weather Armor MATTE",
      ar: "VTEK — فيلم حماية الطلاء Weather Armor MATTE (مطفي)",
    },
    shortDesc: {
      en: "Stealth satin matte paint protection film for a bold non-reflective finish with a 5-year warranty.",
      ar: "فيلم حماية طلاء مطفي ساتان لمظهر جريء غير عاكس مع حماية فائقة وضمان 5 سنوات.",
    },
    longDesc: {
      en: "For a bold, non-reflective look, VTEK® Weather Armor™ MATTE provides stealthy protection without sacrificing durability. Its satin matte finish resists UV rays, desert sand abrasion, road salt, and environmental grime, keeping your vehicle looking pristine with minimal upkeep. MATTE transforms factory gloss finishes into a sleek satin surface while defending against rock chips and scratches. Backed by a 5-year warranty.",
      ar: "لإطلالة رياضية جريئة وغير عاكسة، يمنح فيلم VTEK® Weather Armor™ MATTE حماية خفية فائقة دون المساس بالمتانة. يقاوم تشطيبه المطفي الساتاني الأشعة فوق البنفسجية وتآكل الرمال الصحراوية والأملاح والأوساخ، مما يحافظ على مظهر سيارتك المتجدد بأقل قدر من العناية. يحول الطلاء اللامع إلى مظهر ساتان مطفي فاخر مع حماية تامة وضمان 5 سنوات.",
    },
    images: [
      "/products/vtek/vtek-weather-armor-matte.webp",
    ],
    specs: [
      {
        label: { en: "Finish", ar: "التشطيب" },
        value: { en: "Satin Matte Non-Reflective", ar: "ساتان مطفي غير عاكس" },
      },
      {
        label: { en: "Material", ar: "المادة" },
        value: { en: "Aliphatic Matte TPU", ar: "مادة TPU أليفاتية مطفية" },
      },
      {
        label: { en: "Thickness", ar: "السماكة" },
        value: { en: "8 mil (200 µm)", ar: "٨ مل (٢٠٠ ميكرون)" },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: {
          en: "Self-Healing Satin Top-Coat & Grime Shield",
          ar: "طبقة ساتان ذاتية الالتئام وطاردة للأوساخ",
        },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "5-Year Warranty", ar: "ضمان ٥ سنوات" },
      },
      {
        label: { en: "Maintenance", ar: "العناية" },
        value: { en: "Low maintenance, easy wash", ar: "صيانة سهلة وغسيل يسير" },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  {
    slug: "vtek-ppf-weather-armor-prism",
    brand: "VTEK",
    category: "ppf",
    name: {
      en: "VTEK PPF — Weather Armor PRISM (Color PPF)",
      ar: "VTEK — فيلم حماية الطلاء الملون Weather Armor PRISM",
    },
    shortDesc: {
      en: "Premium colored paint protection film combining dynamic restyling with rock chip defense and color stability.",
      ar: "فيلم حماية طلاء ملون يجمع بين تغيير لون السيارة الرياضي وحماية الطلاء الأصلية من الصدمات وثبات اللون.",
    },
    longDesc: {
      en: "VTEK® Weather Armor™ PRISM is a premium-grade colored paint protection film that offers top-notch defense against scratches, chips, and stains while adding dynamic color to your vehicle. Engineered with advanced Polycaprolactone Color TPU and high-performance adhesives, PRISM stays securely bonded without edge lifting even in extreme Middle Eastern heat. Choose from gloss and satin colors to customize your vehicle while preserving factory paint underneath. Backed by a 5-year warranty.",
      ar: "يعد فيلم VTEK® Weather Armor™ PRISM فيلماً ملوناً فائق الجودة لحماية الطلاء، يمنح حماية متكاملة ضد الخدوش وضربات الحصى والبقع مع إمكانية تغيير لون سيارتك بأسلوب عصري. صُمم بتقنية Polycaprolactone Color TPU ومواد لاصقة فائقة الثبات تمنع رفع الحواف حتى في حرارة الصيف ورطوبة الخليج، مع الحفاظ على طلاء المصنع وضمان 5 سنوات.",
    },
    images: [
      "/products/vtek/vtek-weather-armor-prism.webp",
    ],
    specs: [
      {
        label: { en: "Material", ar: "المادة" },
        value: {
          en: "Polycaprolactone-based Color TPU",
          ar: "مادة TPU ملونة مبنية على البوليكابرولاكتون",
        },
      },
      {
        label: { en: "Thickness", ar: "السماكة" },
        value: { en: "8.5 mil (215 µm)", ar: "٨.٥ مل (٢١٥ ميكرون)" },
      },
      {
        label: { en: "Colors Available", ar: "الألوان المتوفرة" },
        value: {
          en: "Gloss Piano Black, Matte Black, Nardo Grey, Metallic Blue, Pearl White, Satin Metals",
          ar: "أسود بيانو لامع، أسود مطفي، رمادي ناردو، أزرق ميتاليك، أبيض لؤلؤي، معادن ساتان",
        },
      },
      {
        label: { en: "Adhesion", ar: "الالتصاق" },
        value: {
          en: "High-Stability Extreme Weather Adhesive",
          ar: "مادة لاصقة فائقة الثبات للظروف المناخية القاسية",
        },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "5-Year Warranty", ar: "ضمان ٥ سنوات" },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  // ───── VTEK — Solar Armor Window Tints (STAR)
  {
    slug: "vtek-window-tints",
    brand: "VTEK",
    category: "tint",
    name: {
      en: "VTEK Solar Armor VUE — Nano-Ceramic Window Tint",
      ar: "VTEK Solar Armor VUE — فيلم تظليل النوافذ نانو سيراميك",
    },
    shortDesc: {
      en: "High-definition clarity and thermal shielding with denser GRX®-infused nano-ceramic particles. Cuts burning solar heat while maintaining razor-sharp optical visibility. 10-year e-warranty.",
      ar: "توازن مثالي بين وضوح الرؤية عالي الدقة والعزل الحراري بجزيئات GRX® النانو سيراميكية الكثيفة. يقلل حرارة الشمس الشديدة مع رؤية نقية تماماً وضمان إلكتروني 10 سنوات.",
    },
    longDesc: {
      en: "The perfect balance of high-definition clarity and thermal shielding. Engineered with a higher density of GRX®-infused nano-ceramic particles, VUE targets the intense wavelengths of solar heat. It dramatically cuts down the burning sensation on your skin while maintaining a pristine, razor-sharp view from the inside looking out.\n\nKey Features:\n• Advanced GRX® Layer: Denser nano-particles for a major step up in heat relief.\n• Pristine Optical View: Eliminates the \"milky\" haze common in lower-tier tints.\n• Blinding Glare Defense: Drastically cuts down harsh sunlight and oncoming headlights.\n• Premium Style: Adds a sleek, factory-tinted aesthetic with enhanced cabin privacy.",
      ar: "التوازن المثالي بين الوضوح فائق الدقة والعزل الحراري الفائق. صُمم فيلم VUE بكثافة أعلى من جزيئات النانو سيراميك المشبعة بتقنية GRX® لاستهداف أطوال موجات الحرارة الشمسية الشديدة، مما يقلل الإحساس بحرارة الشمس على البشرة مع الحفاظ على رؤية نقية وحادة من الداخل.\n\nالمميزات الرئيسية:\n• طبقة GRX® المتقدمة: جزيئات نانوية أكثر كثافة لتخفيف حراري مضاعف.\n• رؤية بصرية نقية: تقضي على الغباش والضبابية الشائعة في أفلام التظليل العادية.\n• مقاومة الوهج الشديد: تقلل بشكل كبير من سطوع أشعة الشمس وأضواء السيارات المقابلة.\n• مظهر فاخر وأنيق: تمنح السيارة مظهراً أنيقاً يشبه تظليل المصنع مع تعزيز الخصوصية داخل المقصورة.",
    },
    images: [
      "/products/vtek/vtek-solar-armor-window-tint.webp",
      "/products/vtek/vtek-solar-armor-tints-lineup.webp",
    ],
    specs: [
      {
        label: { en: "Series", ar: "السلسلة" },
        value: { en: "VUE Series (Solar Armor)", ar: "سلسلة VUE (Solar Armor)" },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: { en: "Advanced GRX® Nano-Ceramic", ar: "تقنية النانو سيراميك GRX® المتقدمة" },
      },
      {
        label: { en: "Optical Clarity", ar: "الوضوح البصري" },
        value: { en: "High-Definition Clarity & Anti-Glare", ar: "وضوح فائق الدقة ومقاومة الوهج" },
      },
      {
        label: { en: "Compliance", ar: "المطابقة" },
        value: { en: "Qatar Traffic Law & MOI Compliant Grades", ar: "درجات مطابقة لقانون المرور ووزارة الداخلية في قطر" },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "10-Year e-Warranty", ar: "ضمان إلكتروني لمدة ١٠ سنوات" },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  {
    slug: "vtek-solar-armor-apex",
    brand: "VTEK",
    category: "tint",
    name: {
      en: "VTEK Solar Armor APEX — Ultra Nano-Ceramic Window Tint",
      ar: "VTEK Solar Armor APEX — فيلم تظليل النوافذ الترا نانو سيراميك",
    },
    shortDesc: {
      en: "Flagship multi-layer ceramic solar film delivering industry-leading 98% infrared heat rejection, maximum UV block, and 15-year e-warranty.",
      ar: "فيلم تظليل النوافذ السيراميكي الرائد متعدد الطبقات بعزل حراري استثنائي 98% للأشعة تحت الحمراء، حماية قصوى من الأشعة فوق البنفسجية وضمان إلكتروني 15 سنة.",
    },
    longDesc: {
      en: "VTEK® Solar Armor™ APEX is the ultimate high-performance window film engineered specifically for extreme Middle Eastern summers. Utilizing proprietary multi-layer ceramic sputtering technology, APEX repels up to 98% of infrared heat without interfering with GPS, cell signals, or keyless entry. Its optical-grade crystal matrix maintains pure clarity day and night while protecting occupants and vehicle interiors from damaging solar radiation. Backed by a comprehensive 15-year e-warranty.",
      ar: "يمثل VTEK® Solar Armor™ APEX قمة الأداء في أفلام تظليل النوافذ المصممة خصيصاً لمواجهة صيف الخليج القاسي. بفضل تقنية الرش السيراميكي متعدد الطبقات الحصرية، يعزل APEX ما يصل إلى 98% من الأشعة تحت الحمراء المسببة للحرارة دون أي تأثير على إشارات الملاحة أو الهواتف. تضمن طبقته الكريستالية رؤية ليلية ونهارية نقية مع حماية داخلية مقصورة السيارة، ومدعوم بضمان إلكتروني لمدة 15 سنة.",
    },
    images: [
      "/products/vtek/vtek-solar-armor-apex.webp",
      "/products/vtek/vtek-solar-armor-tints-lineup.webp",
    ],
    specs: [
      {
        label: { en: "Series", ar: "السلسلة" },
        value: { en: "APEX Flagship Series (Solar Armor)", ar: "سلسلة APEX الرائدة (Solar Armor)" },
      },
      {
        label: { en: "Heat Rejection", ar: "العزل الحراري" },
        value: { en: "Up to 98% Infrared Rejection (IRR)", ar: "عزل حراري يصل إلى ٩٨٪ للأشعة تحت الحمراء" },
      },
      {
        label: { en: "UV Defense", ar: "حماية الأشعة" },
        value: { en: "99.9% Ultraviolet (UV) Block", ar: "حجب ٩٩.٩٪ من الأشعة فوق البنفسجية" },
      },
      {
        label: { en: "Signal Friendly", ar: "الإشارات اللاسلكية" },
        value: { en: "100% Non-Metallic / Zero Signal Interference", ar: "غير معدني ١٠٠٪ / بدون أي تشويش على الإشارات" },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "15-Year e-Warranty", ar: "ضمان إلكتروني لمدة ١٥ سنة" },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },
  {
    slug: "vtek-solar-armor-iconic",
    brand: "VTEK",
    category: "tint",
    name: {
      en: "VTEK Solar Armor ICONIC — Carbon Ceramic Window Tint",
      ar: "VTEK Solar Armor ICONIC — فيلم تظليل النوافذ كربون سيراميك",
    },
    shortDesc: {
      en: "High-performance carbon-ceramic hybrid window film engineered for deep fade-resistant color, superior heat reduction, and 10-year e-warranty.",
      ar: "فيلم تظليل نوافذ هجين من الكربون والسيراميك عالي الأداء بلون عميق مقاوم للبهتان، عزل حراري متميز وضمان إلكتروني 10 سنوات.",
    },
    longDesc: {
      en: "VTEK® Solar Armor™ ICONIC combines advanced carbon particles with nano-ceramic technology to produce a rich, non-fading charcoal finish that never turns purple. Engineered to handle intense Gulf solar exposure, ICONIC provides substantial heat dissipation, glare minimization, and passenger privacy while maintaining pristine interior clarity. Compliant with Qatar Traffic Law standards, backed by a 10-year e-warranty.",
      ar: "يجمع VTEK® Solar Armor™ ICONIC بين جزيئات الكربون المتقدمة وتقنية النانو سيراميك لمنح لون فحمي عميق وثابت لا يتغير لونه أبداً مع مرور السنين. صُمم لمقاومة أشعة الشمس الشديدة في الخليج مع توفير عزل حراري ممتاز وتخفيف للوهج وتعزيز الخصوصية مع وضوح الرؤية من الداخل. متوافق مع معايير المرور في قطر ومدعوم بضمان إلكتروني لمدة 10 سنوات.",
    },
    images: [
      "/products/vtek/vtek-solar-armor-iconic.webp",
      "/products/vtek/vtek-solar-armor-tints-lineup.webp",
    ],
    specs: [
      {
        label: { en: "Series", ar: "السلسلة" },
        value: { en: "ICONIC Hybrid Series (Solar Armor)", ar: "سلسلة ICONIC الهجينة (Solar Armor)" },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: { en: "Carbon-Ceramic Hybrid Matrix", ar: "مصفوفة هجينة من الكربون والسيراميك" },
      },
      {
        label: { en: "Color Stability", ar: "ثبات اللون" },
        value: { en: "Fade-Resistant Deep Charcoal / Never Turns Purple", ar: "لون فحمي فاخر مقاوم للبهتان ولا يتحول للبنفسجي" },
      },
      {
        label: { en: "Compliance", ar: "المطابقة" },
        value: { en: "Qatar Traffic Law & MOI Compliant", ar: "مطابق لقانون المرور ووزارة الداخلية في قطر" },
      },
      {
        label: { en: "Warranty", ar: "الضمان" },
        value: { en: "10-Year e-Warranty", ar: "ضمان إلكتروني لمدة ١٠ سنوات" },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
    updatedAt: "2026-09-03",
  },

  // ───── Briller Car Care (STAR — line of colored car-wash products)
  {
    slug: "briller-wash-and-wax",
    brand: "Briller",
    category: "shampoo",
    name: {
      en: "Briller Wash & Wax — All-in-One",
      ar: "Briller — شامبو وشمع في خطوة واحدة",
    },
    shortDesc: {
      en: "Concentrated wash + wax car shampoo with All-in-One CA Tech™. High gloss, water-beading finish.",
      ar: "شامبو مركّز للغسيل والتشميع في خطوة واحدة بتقنية CA Tech™. لمعان عالي وطرد للماء.",
    },
    longDesc: {
      en: "Briller's All-in-One CA Tech™ formula cleans and waxes in a single wash. Produces thick, safe suds that lift dirt without scratching, then leaves a durable hydrophobic layer for a water-beading high-gloss finish. Available in 20L bulk — ideal for car washes and detailing shops.",
      ar: "تركيبة Briller CA Tech™ تنظف وتشمع في غسلة واحدة. رغوة كثيفة وآمنة ترفع الأوساخ دون خدش، وتترك طبقة طاردة للماء تعطي لمعاناً عالياً. متوفر في عبوات 20 لتر — مثالي لمحطات الغسيل وورش التلميع.",
    },
    images: ["/products/briller/briller-wash-and-wax.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B505", ar: "B505" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:50", ar: "١:٥٠" } },
      { label: { en: "Features", ar: "المميزات" }, value: { en: "With wax", ar: "مع شمع" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Canada", ar: "صُنع في كندا" } },
    ],
    audience: "both",
    featured: true,
    highlight: "briller-color",
    updatedAt: "2026-08-30",
  },
  {
    slug: "briller-multipurpose-cleaner",
    brand: "Briller",
    category: "interior",
    name: {
      en: "Briller Multipurpose Cleaner",
      ar: "Briller — منظف متعدد الأغراض",
    },
    shortDesc: {
      en: "Interior-safe foaming cleaner. All-in-One CA Tech™.",
      ar: "منظف رغوي آمن للداخلية بتقنية CA Tech™.",
    },
    longDesc: {
      en: "Briller Multipurpose Cleaner lifts dirt from every interior surface — fabric, plastic, leather, carpet. Foaming action penetrates deep, elevates luxury feel with enhanced fabric softener results.",
      ar: "منظف Briller يرفع الأوساخ من جميع أسطح السيارة الداخلية — قماش، بلاستيك، جلد، موكيت. رغوة عميقة تنظف بفعالية مع ملمس فاخر.",
    },
    images: ["/products/briller/briller-multipurpose-cleaner.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B502", ar: "B502" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:5", ar: "١:٥" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Canada", ar: "صُنع في كندا" } },
    ],
    audience: "both",
    highlight: "briller-color",
    updatedAt: "2026-09-05",
  },
  {
    slug: "briller-quick-tyre-shine",
    brand: "Briller",
    category: "tyre",
    name: {
      en: "Briller Quick Tyre Shine",
      ar: "Briller — ملمع الإطارات السريع",
    },
    shortDesc: {
      en: "Aqua-based tyre shine with peak shine, inside and out.",
      ar: "ملمع إطارات مائي لقمة اللمعان من الداخل والخارج.",
    },
    longDesc: {
      en: "Aqua-Based Blend. Peak shine — inside and out. Long-lasting protection without sling-off.",
      ar: "تركيبة مائية. لمعان فائق داخلياً وخارجياً. حماية طويلة الأمد دون تطاير.",
    },
    images: ["/products/briller/briller-quick-tyre-shine.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B503", ar: "B503" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Canada", ar: "صُنع في كندا" } },
    ],
    audience: "both",
    highlight: "briller-color",
    updatedAt: "2026-08-30",
  },
  {
    slug: "briller-glass-cleaner",
    brand: "Briller",
    category: "glass",
    name: {
      en: "Briller Glass Cleaner",
      ar: "Briller — منظف الزجاج",
    },
    shortDesc: {
      en: "Streak-free glass cleaner with All-in-One CA Tech™.",
      ar: "منظف زجاج بدون أثر شطب، بتقنية CA Tech™.",
    },
    longDesc: {
      en: "Professional streak-free glass cleaner. Lifts film, road grime and bug residue from windshields and side glass.",
      ar: "منظف زجاج احترافي بدون شطب. يُزيل الأفلام والأوساخ من الزجاج الأمامي والجانبي.",
    },
    images: ["/products/briller/briller-glass-cleaner.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "D508", ar: "D508" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "Direct / 1:1", ar: "مباشر / ١:١" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Canada", ar: "صُنع في كندا" } },
    ],
    audience: "both",
    highlight: "briller-color",
    updatedAt: "2026-09-05",
  },
  {
    slug: "briller-heavy-duty-degreaser",
    brand: "Briller",
    category: "degreaser",
    name: {
      en: "Briller Heavy Duty Degreaser (20L)",
      ar: "Briller — مزيل الشحوم عالي الفعالية (٢٠ لتر)",
    },
    shortDesc: {
      en: "Professional heavy-duty degreaser with All-in-One CA Tech™. Formulated for tough stains, heavy grease, engine oil and rust. 1:5 dilution ratio. Made in Canada.",
      ar: "مزيل شحوم احترافي عالي الفعالية بتقنية CA Tech™. مصمم للبقع الصعبة والشحوم وزيوت المحركات والصدأ. نسبة تخفيف ١:٥. صُنع في كندا.",
    },
    longDesc: {
      en: "Briller Heavy Duty Degreaser is an industrial-strength, Canadian-engineered degreaser powered by All-in-One CA Tech™. Formulated for commercial detail shops, car washes, and fleet maintenance facilities. Available in a 20 L bulk drum.\n\nEngineered specifically to dissolve and lift the toughest contaminants — including baked-on grease, engine oil buildup, heavy road grime, industrial stains, and rust residue. Highly concentrated formula dilutes 1:5 with water for maximum cleaning efficiency and cost savings.",
      ar: "مزيل الشحوم فائق القوة Briller Heavy Duty Degreaser تركيبة كندية صناعية متطورة تعمل بتقنية All-in-One CA Tech™. مصمم لمراكز العناية بالسيارات والورش ومحطات الغسيل. متوفر ببرميل سعة ٢٠ لتر.\n\nمصمم خصيصاً لإذابة وإزالة أصعب الملوثات والترسبات — بما في ذلك الشحوم المستعصية، تراكمات زيوت المحركات، أوساخ الطريق الثقيلة، البقع الصناعية، وبقايا الصدأ. تركيبة مركزة تُخفف بنسبة ١:٥ مع الماء لأقصى كفاءة تنظيف وتوفير اقتصادي.",
    },
    images: ["/products/briller/briller-heavy-duty-degreaser.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B507", ar: "B507" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:5 with water", ar: "١:٥ مع الماء" } },
      { label: { en: "Targets", ar: "الاستخدام" }, value: { en: "Tough stains · Grease · Engine oil · Rust", ar: "البقع الصعبة · الشحوم · زيت المحرك · الصدأ" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "All-in-One CA Tech™", ar: "تقنية All-in-One CA Tech™" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Canada", ar: "صُنع في كندا" } },
    ],
    audience: "both",
    highlight: "briller-color",
    updatedAt: "2026-09-02",
  },

  // ───── Autotriz — Detailing Chemicals
  {
    slug: "autotriz-rich-foam-shampoo",
    brand: "Autotriz",
    category: "shampoo",
    name: {
      en: "Autotriz Nano Rich Foam Shampoo (20L)",
      ar: "Autotriz — شامبو نانو رغوي غني (٢٠ لتر)",
    },
    shortDesc: {
      en: "Nano coating shampoo for PPF and coated cars — renews PPF top coat, pH-balanced thick foam with 1:80 dilution ratio in 20L bulk drum. Made in Germany.",
      ar: "شامبو نانو لأفلام الحماية والسيارات المطلية بالسيراميك — يجدد الطبقة العلوية للـ PPF، رغوة كثيفة متوازنة الحموضة بتخفيف ١:٨٠ ببرميل ٢٠ لتر. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "AUTOTRIZ Nano Rich Foam Shampoo is a German-engineered, professional nano-coating shampoo designed for PPF-wrapped and ceramic-coated vehicles. Formulated with advanced nano technology, it actively cleans while renewing and revitalizing the PPF top coat and hydrophobic ceramic layers.\n\nProduces thick, lubricating foam that safely lifts dirt and road grime without scratching or swirling. Features a highly economical 1:80 dilution ratio for foam cannons and wash buckets in high-volume detailing centers and car washes.",
      ar: "شامبو AUTOTRIZ نانو رغوي غني تركيبة ألمانية احترافية معززة بتقنية النانو ومخصصة للسيارات المحمية بأفلام PPF وطلاءات السيراميك. ينظف بعمق ويعمل على تجديد وإنعاش الطبقة العلوية لأفلام الحماية وطبقات الحماية الكارهة للماء.\n\nينتج رغوة كثيفة تزيل الأوساخ ورواسب الطريق بأمان تام ودون إحداث دوامات أو خدوش. نسبة تخفيف اقتصادية ١:٨٠ للاستخدام في مدافع الرغوة ودلاء الغسيل بمراكز التلميع ومحطات الغسيل.",
    },
    images: ["/products/autotriz/autotriz-rich-foam-shampoo-20l.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "AT-CC-RFS-20", ar: "AT-CC-RFS-20" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Nano Coating & PPF Top Coat Renewer", ar: "تقنية النانو وتجديد طبقة الـ PPF" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:80 with water", ar: "١:٨٠ مع الماء" } },
      { label: { en: "Application", ar: "الاستخدام" }, value: { en: "Best for PPF & Ceramic Coated Cars", ar: "مثالي لسيارات أفلام الحماية والسيراميك" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-heavy-cut-901",
    brand: "Autotriz",
    category: "polish",
    name: {
      en: "Autotriz Heavy Cut 901",
      ar: "Autotriz Heavy Cut 901 — مركّب قطع ثقيل",
    },
    shortDesc: {
      en: "Heavy-cut compound. Effectively removes P1500 sanding marks, restores high gloss, hologram-free.",
      ar: "مركّب قطع ثقيل. يُزيل علامات السنفرة P1500، يعيد اللمعان العالي، خالٍ من الهالات.",
    },
    longDesc: {
      en: "Recommended for use on finish paint. Effectively removes P1500 sanding marks. Restores a high gloss finish. Hologram-free — delivers a clean cut without compensation passes.",
      ar: "يُستخدم على الطلاء النهائي. يُزيل علامات السنفرة P1500 بفعالية. يعيد اللمعان العالي. خالٍ من الهالات.",
    },
    images: ["/products/autotriz/autotriz-heavy-cut-901.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "901", ar: "901" } },
      {
        label: { en: "Cut Power", ar: "قوة القطع" },
        value: { en: "High Cut (Removes P1500 Sanding Marks)", ar: "قطع عالي (إزالة سنفرة P1500)" },
      },
      {
        label: { en: "Finish", ar: "التشطيب" },
        value: { en: "High Gloss & Hologram-Free", ar: "لمعان عالي وخالٍ من الهالات" },
      },
      {
        label: { en: "Formulation", ar: "التركيبة" },
        value: { en: "Silicone-Free, No Fillers, Body Shop Safe", ar: "خالٍ من السيليكون وبدون حشوات، آمن لورش الصبغ" },
      },
      {
        label: { en: "Origin", ar: "المنشأ" },
        value: { en: "Made in Germany", ar: "صُنع في ألمانيا" },
      },
    ],
    audience: "both",
    updatedAt: "2026-09-04",
  },
  {
    slug: "autotriz-ultimate-polish-302",
    brand: "Autotriz",
    category: "polish",
    name: {
      en: "Autotriz Ultimate Polish 302",
      ar: "Autotriz Ultimate Polish 302 — ملمّع نهائي",
    },
    shortDesc: {
      en: "Finishing polish — deep rich wet look, excellent for dark paint, hologram-free, body-shop safe.",
      ar: "ملمّع نهائي — مظهر رطب غني، ممتاز للسيارات الداكنة، خالٍ من الهالات، آمن لورش السمكرة.",
    },
    longDesc: {
      en: "Made from finest polishing oils. Adds a deep, rich, wet look to paint. Excellent for dark-coloured cars. Incredible gloss, hologram-free finish. Body-shop safe.",
      ar: "مصنوع من أفضل زيوت التلميع. يضيف مظهراً رطباً غنياً للطلاء. ممتاز للسيارات الداكنة. لمعان مذهل، خالٍ من الهالات. آمن لورش السمكرة.",
    },
    images: ["/products/autotriz/autotriz-ultimate-polish-302.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "302", ar: "302" } },
      { label: { en: "Cut / Gloss", ar: "القطع واللمعان" }, value: { en: "Cut 2/10 · Gloss 10/10", ar: "قطع ٢/١٠ · لمعان ١٠/١٠" } },
      { label: { en: "Finish", ar: "التشطيب" }, value: { en: "Hologram-Free Mirror Finish", ar: "لمعان مرآة خالٍ من الهالات" } },
      { label: { en: "Safety", ar: "الأمان" }, value: { en: "Body Shop Safe", ar: "آمن لورش السمكرة" } },
    ],
    audience: "both",
    updatedAt: "2026-09-05",
  },

  {
    slug: "autotriz-power-cut-701",
    brand: "Autotriz",
    category: "polish",
    name: {
      en: "Autotriz Power Cut 701 — 2-in-1 Polishing Compound (4L)",
      ar: "Autotriz Power Cut 701 — مركّب تلميع ٢ في ١ (٤ لتر)",
    },
    shortDesc: {
      en: "2-in-1 polishing compound — heavy cutting performance with a brilliant high-gloss finish in 4L bulk jug. Made in Germany.",
      ar: "مركّب تلميع ٢ في ١ — أداء قطع قوي مع لمعان فائق بعبوة ٤ لتر. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "AUTOTRIZ Power Cut 701 is a premium 2-in-1 polishing compound engineered to deliver an extraordinary level of cutting performance while ensuring a superior gloss finish on automotive clear coats. Ideal for removing deep scratches, P1500–P2000 sanding marks, and heavy swirls in one efficient process. Body-shop safe, silicone-free formula. Works seamlessly with rotary and dual-action polishers.",
      ar: "AUTOTRIZ Power Cut 701 مركّب تلميع متطور ٢ في ١ مصمم لتقديم أداء قطع استثنائي مع ضمان لمعان فائق على الطلاء الشفاف للسيارات. مثالي لإزالة الخدوش العميقة وعلامات السنفرة والدوامات في خطوة فعالة. تركيبة آمنة لورش السمكرة وخالية من السيليكون. متوافق مع الملمعات الدوارة ومزدوجة الحركة.",
    },
    images: ["/products/autotriz/autotriz-power-cut-701-4l.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "AT-PC-701", ar: "AT-PC-701" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "4 L", ar: "٤ لتر" } },
      { label: { en: "Type", ar: "النوع" }, value: { en: "2-in-1 Cut & Polish Compound", ar: "مركّب ٢ في ١ قطع وتلميع" } },
      { label: { en: "Compatibility", ar: "التوافق" }, value: { en: "Rotary · Dual Action", ar: "روتاري · دوال أكشن" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-3d-matrix-ultra",
    brand: "Autotriz",
    category: "ceramic",
    name: {
      en: "Autotriz 3D Matrix Ultra — Ceramic Coating",
      ar: "Autotriz 3D Matrix Ultra — طلاء سيراميك",
    },
    shortDesc: {
      en: "Professional nano-technology ceramic coating. Enhanced gloss and long-term paint protection.",
      ar: "طلاء سيراميك احترافي بتقنية النانو. لمعان معزّز وحماية طويلة الأمد للطلاء.",
    },
    longDesc: {
      en: "Autotriz 3D Matrix Ultra is a professional ceramic coating applied by trained detailers to protect and enhance automotive paint. Available from our Mesaimeer store. 50 ml kit. Full specifications available on request.",
      ar: "Autotriz 3D Matrix Ultra طلاء سيراميك احترافي يُطبّق بواسطة فنيين مدربين لحماية وتعميق طلاء السيارة. متوفر في متجرنا بمسيمير. عبوة 50 مل. المواصفات الكاملة متاحة عند الطلب.",
    },
    images: [
      "/products/autotriz/autotriz-3d-matrix-ultra.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "50 ml / 1.7 oz", ar: "٥٠ مل" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Nano-technology ceramic", ar: "سيراميك نانو" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-3d-matrix-hybrid",
    brand: "Autotriz",
    category: "ceramic",
    name: {
      en: "Autotriz 3D Matrix Hybrid — Ceramic Coating",
      ar: "Autotriz 3D Matrix Hybrid — طلاء سيراميك",
    },
    shortDesc: {
      en: "Professional nano-technology ceramic coating. Enhanced gloss and long-term paint protection.",
      ar: "طلاء سيراميك احترافي بتقنية النانو. لمعان معزّز وحماية طويلة الأمد للطلاء.",
    },
    longDesc: {
      en: "Autotriz 3D Matrix Hybrid is a professional ceramic coating applied by trained detailers to protect and enhance automotive paint. Available from our Mesaimeer store. 50 ml kit. Full specifications available on request.",
      ar: "Autotriz 3D Matrix Hybrid طلاء سيراميك احترافي يُطبّق بواسطة فنيين مدربين لحماية وتعميق طلاء السيارة. متوفر في متجرنا بمسيمير. عبوة 50 مل. المواصفات الكاملة متاحة عند الطلب.",
    },
    images: [
      "/products/autotriz/autotriz-3d-matrix-hybrid.webp",
      "/products/autotriz/autotriz-3d-matrix-hybrid-box.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "50 ml / 1.7 oz", ar: "٥٠ مل" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Nano-technology ceramic", ar: "سيراميك نانو" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-fabric-textile-coating",
    brand: "Autotriz",
    category: "interior",
    name: {
      en: "Autotriz Fabric & Textile Coating",
      ar: "Autotriz — طلاء حماية الأقمشة والمفروشات",
    },
    shortDesc: {
      en: "Nano-technology fabric protector for upholstery, carpet and soft tops.",
      ar: "حماية أقمشة بتقنية النانو — للمفروشات والسجاد والأسقف القماشية.",
    },
    longDesc: {
      en: "Autotriz Fabric & Textile is a nano-technology fabric protector designed to help keep interior upholstery, carpet and soft tops looking fresh. 300 ml spray. Full specifications available on request.",
      ar: "Autotriz Fabric & Textile حماية أقمشة بتقنية النانو تساعد على الحفاظ على مظهر المفروشات الداخلية والسجاد والأسقف القماشية. بخاخ 300 مل. المواصفات الكاملة متاحة عند الطلب.",
    },
    images: [
      "/products/autotriz/autotriz-fabric-and-textile.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "300 ml / 10.1 oz", ar: "٣٠٠ مل" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Nano-technology fabric protector", ar: "حماية نانو للأقمشة" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-ppf-gel",
    brand: "Autotriz",
    category: "ppf",
    name: {
      en: "Autotriz PPF Gel — Installation Aid (4L & 20L)",
      ar: "Autotriz PPF Gel — مساعد تركيب أفلام الحماية والتظليل (٤ لتر و ٢٠ لتر)",
    },
    shortDesc: {
      en: "Professional PPF & window tint installation gel in 4L and 20L sizes. 1:1 dilution ratio, thick viscous formula — prevents dripping, leaves zero residue. Made in Germany.",
      ar: "جل احترافي لتركيب أفلام حماية الطلاء والتظليل بحجمين ٤ لتر و ٢٠ لتر. تخفيف ١:١، تركيبة كثيفة تمنع التقطير وسهلة التنظيف. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "AUTOTRIZ PPF Gel is a premium German-engineered installation aid designed for both paint protection film (PPF) and window tint applications. Available in 4 L (bottle) and 20 L (bulk drum) sizes. Engineered for a 1:1 dilution ratio with water, its thick viscous consistency allows smooth spraying without dripping off or evaporating quickly, ensuring optimal slip, tack, and precise film positioning. Easily cleans off with water with zero residue, even when fully dried.\n\nKey Highlights:\n• Sizes Available: 4 L bottle & 20 L bulk drum\n• Dilution: 1:1 with water\n• Dual Application: Suitable for both window tints & PPF installation\n• Origin: Made in Germany",
      ar: "جل AUTOTRIZ PPF مساعد تركيب ألماني متطور مخصص لتطبيقات أفلام حماية الطلاء (PPF) وتظليل النوافذ. متوفر بعبوة ٤ لتر وبرميل ٢٠ لتر لورش العمل ومراكز العناية. يُخفف بنسبة ١:١ مع الماء، وتمنحه تركيبته اللزجة الكثيفة ثباتاً على السطح دون تقطير أو جفاف سريع، مما يتيح انزلاقاً وتحكماً دقيقاً أثناء التثبيت مع تنظيف سهل وخالٍ من الرواسب.\n\nأبرز المواصفات:\n• الأحجام المتوفرة: عبوة ٤ لتر وبرميل ٢٠ لتر\n• نسبة التخفيف: ١:١ مع الماء\n• الاستخدام: مناسب لأفلام حماية الطلاء وتظليل النوافذ\n• المنشأ: صُنع في ألمانيا",
    },
    images: [
      "/products/autotriz/autotriz-ppf-gel-4l.webp",
      "/products/autotriz/autotriz-ppf-gel-20l.webp",
    ],
    specs: [
      { label: { en: "Sizes", ar: "الأحجام" }, value: { en: "4 L (Bottle) · 20 L (Drum)", ar: "٤ لتر (عبوة) · ٢٠ لتر (برميل)" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:1 with water", ar: "١:١ مع الماء" } },
      { label: { en: "Application", ar: "الاستخدام" }, value: { en: "Suitable for tints & PPF application", ar: "مناسب لتركيب التظليل وأفلام الحماية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-01",
  },
  {
    slug: "autotriz-hyper-wheel-cleaner",
    brand: "Autotriz",
    category: "tyre",
    name: {
      en: "Autotriz Hyper Wheel Cleaner (20L)",
      ar: "Autotriz Hyper Wheel Cleaner — منظف العجلات والجنوط (٢٠ لتر)",
    },
    shortDesc: {
      en: "Professional heavy-duty wheel cleaner in 20L bulk drum. Safe for chrome, clear-coated, and factory painted wheels. 1:1 dilution ratio. Made in Germany.",
      ar: "منظف عجلات احترافي عالي الفعالية ببرميل ٢٠ لتر. آمن على الكروم والجنوط المطلية والمحمية. نسبة تخفيف ١:١. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "AUTOTRIZ Hyper Wheel Cleaner is a professional-grade, German-engineered wheel cleaner formulated for detailing centers, workshops, and high-volume car washes. Available in a 20 L bulk drum.\n\nSafe and effective on clear-coated, factory painted, and chrome wheels. Quickly dissolves and lifts stubborn brake dust, road grime, and iron deposits with little to no scrubbing required. Features a non-caustic, body shop safe formula with built-in rust inhibitors. Concentrated formulation can be diluted 1:1 with water for economical daily use.\n\nKey Highlights:\n• Safe for Chrome, Clear-Coated & Painted Wheels\n• Dilution: 1:1 with water (Economical concentrate)\n• Volume: 20 L Bulk Drum (SKU: AT-CC-HWC-20)\n• Non-caustic, body shop safe formula with rust inhibitors\n• Origin: Made in Germany",
      ar: "منظف العجلات AUTOTRIZ Hyper Wheel Cleaner تركيبة ألمانية احترافية مصممة لمراكز العناية بالسيارات والورش ومحطات الغسيل. متوفر ببرميل اقتصادي سعة ٢٠ لتر.\n\nآمن وفعال على الكروم والجنوط المطلية والمحمية بطبقة شفافة. يذيب غبار الفرامل العنيد والأوساخ ورواسب الطريق بسرعة وبأقل مجهود فرك. تركيبة غير كاوية وآمنة لورش الطلاء تحتوي على مانع للصدأ. يُخفف بنسبة ١:١ مع الماء للاستخدام الاقتصادي اليومي.\n\nأبرز المواصفات:\n• آمن تماماً على الكروم والجنوط المطلية\n• نسبة التخفيف: ١:١ مع الماء (مركز اقتصادي)\n• الحجم: برميل ٢٠ لتر (SKU: AT-CC-HWC-20)\n• تركيبة غير كاوية مع مانع للصدأ\n• بلد المنشأ: صُنع في ألمانيا",
    },
    images: [
      "/products/autotriz/autotriz-hyper-wheel-cleaner-20l.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L (Drum)", ar: "٢٠ لتر (برميل)" } },
      { label: { en: "Compatibility", ar: "التوافق" }, value: { en: "Safe for Chrome, Painted & Clear-Coated Wheels", ar: "آمن على الكروم والجنوط المطلية والمحمية" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:1 with water", ar: "١:١ مع الماء" } },
      { label: { en: "Formula", ar: "التركيبة" }, value: { en: "Non-caustic with rust inhibitors", ar: "غير كاوي مع مانع للصدأ" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "autotriz-one-step-finish",
    brand: "Autotriz",
    category: "polish",
    name: {
      en: "Autotriz One Step Finish (4L)",
      ar: "Autotriz One Step Finish — ملمّع خطوة واحدة (٤ لتر)",
    },
    shortDesc: {
      en: "All-in-one polish — removes swirls and scratches while delivering a deep, glossy finish in a single step.",
      ar: "ملمّع شامل — يزيل الدوامات والخدوش ويمنح لمعاناً عميقاً ولامعاً في خطوة واحدة.",
    },
    longDesc: {
      en: "Autotriz One Step Finish removes light to moderate swirls, scratches, and surface defects. Delivers a deep, glossy finish in a single step. Combines cutting power with fine polishing for flawless results. Easy to apply and remove, suitable for all paint finishes. Works effectively by hand or with a machine polisher.",
      ar: "Autotriz One Step Finish يزيل الدوامات والخدوش الخفيفة إلى المتوسطة وعيوب السطح. يمنح لمعاناً عميقاً ولامعاً في خطوة واحدة. يجمع بين قوة القطع والتلميع الدقيق لنتائج خالية من العيوب. سهل التطبيق والإزالة، ومناسب لجميع أنواع الطلاء. يعمل بفعالية يدوياً أو بالمكينة.",
    },
    images: ["/products/autotriz/autotriz-one-step-finish-4l.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "4 L", ar: "٤ لتر" } },
      { label: { en: "Step", ar: "الخطوة" }, value: { en: "Second step (one-step finish)", ar: "الخطوة الثانية (تلميع بخطوة واحدة)" } },
      { label: { en: "Compatibility", ar: "التوافق" }, value: { en: "Rotary · DA · Hand", ar: "روتاري · DA · يدوي" } },
      { label: { en: "Price", ar: "السعر" }, value: { en: "QAR 280 (Box rate: QAR 250 each)", ar: "٢٨٠ ر.ق (سعر الكرتون: ٢٥٠ ر.ق للواحدة)" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-revo-ceramic-coating",
    brand: "Autotriz",
    category: "ceramic",
    name: {
      en: "Autotriz REVO +15 — Ceramic Coating",
      ar: "Autotriz REVO +15 — طلاء سيراميك",
    },
    shortDesc: {
      en: "Cutting-edge nano ceramic coating with next-level durability and stability. Made in Germany.",
      ar: "طلاء سيراميك نانو متطور بمتانة واستقرار من المستوى التالي. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "AUTOTRIZ REVO is a cutting-edge nano ceramic coating that amplifies the latest improvement in nano technology. Proven to stand out against the typical elements that deal harm to paintwork. It fills nanopores and establishes great molecular bonds to achieve next-level durability and stability. Professional application recommended.",
      ar: "AUTOTRIZ REVO طلاء سيراميك نانو متطور يستخدم أحدث التطورات في تقنية النانو. أثبت تفوقه في مواجهة العوامل النموذجية التي تضر بالطلاء. يملأ المسام النانوية ويُنشئ روابط جزيئية قوية لتحقيق متانة واستقرار من المستوى التالي. يُوصى بالتطبيق الاحترافي.",
    },
    images: [
      "/products/autotriz/autotriz-revo-ceramic-coating.webp",
      "/products/autotriz/autotriz-revo-ceramic-coating-box.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "50 ml / 1.7 oz", ar: "٥٠ مل" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Nano ceramic coating", ar: "سيراميك نانو" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-leather-and-vinyl",
    brand: "Autotriz",
    category: "ceramic",
    name: {
      en: "Autotriz Leather & Vinyl — Ceramic Coating",
      ar: "Autotriz Leather & Vinyl — طلاء سيراميك للجلد والفينيل",
    },
    shortDesc: {
      en: "Ceramic coating for leather, synthetic leather, vinyl and plastic. Long-lasting barrier, non-oily finish.",
      ar: "طلاء سيراميك للجلد والجلد الصناعي والفينيل والبلاستيك. حاجز طويل الأمد، ملمس غير دهني.",
    },
    longDesc: {
      en: "Auto-triz Leather & Vinyl is suitable for all types of leather, synthetic leather/vinyl and plastic parts. It leaves a long-lasting barrier to protect the surface against permanent stains from dye of blue jeans, pen or marker. Unlike oil based or water-based leather dressings on the market that only leave a temporary dressing, Autotriz Leather & Vinyl preserves the natural feel of leather with its non-oily and non-slippery finish.",
      ar: "Autotriz Leather & Vinyl مناسب لجميع أنواع الجلد والجلد الصناعي والفينيل والأجزاء البلاستيكية. يترك حاجزاً طويل الأمد لحماية السطح من البقع الدائمة من صبغ الجينز والأقلام والماركر. على عكس ملمعات الجلد الزيتية أو المائية التي تترك طبقة مؤقتة فقط، يحافظ على الملمس الطبيعي للجلد بلمسة غير دهنية وغير زلقة.",
    },
    images: [
      "/products/autotriz/autotriz-leather-and-vinyl.webp",
      "/products/autotriz/autotriz-leather-and-vinyl-box.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "50 ml / 1.7 oz", ar: "٥٠ مل" } },
      { label: { en: "Surfaces", ar: "الأسطح" }, value: { en: "Leather · Synthetic leather · Vinyl · Plastic", ar: "جلد · جلد صناعي · فينيل · بلاستيك" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Ceramic coating", ar: "طلاء سيراميك" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-ion-plus-ceramic-coating",
    brand: "Autotriz",
    category: "ceramic",
    name: {
      en: "Autotriz ION+ +15 — Ceramic Coating",
      ar: "Autotriz ION+ +15 — طلاء سيراميك",
    },
    shortDesc: {
      en: "Advanced nano ceramic coating with surface ionized technology. Supreme smoothness and slickness.",
      ar: "طلاء سيراميك نانو متقدم بتقنية التأين السطحي. نعومة وانزلاق فائقين.",
    },
    longDesc: {
      en: "AUTOTRIZ ION+ is a scientifically advanced nano ceramic coating with surface ionized technology that brings a high level of smoothness and slickness. Its surface ionized technology enkindles nano particles that are determined to bond perfectly on any surface such as paint, lacquer, and base coat. Professional application recommended.",
      ar: "AUTOTRIZ ION+ طلاء سيراميك نانو متقدم علمياً بتقنية التأين السطحي يمنح مستوى عالياً من النعومة والانزلاق. تقنية التأين السطحي تُنشّط جزيئات النانو التي ترتبط بإتقان على أي سطح مثل الطلاء والورنيش والطبقة الأساسية. يُوصى بالتطبيق الاحترافي.",
    },
    images: [
      "/products/autotriz/autotriz-ion-plus-ceramic-coating.webp",
      "/products/autotriz/autotriz-ion-plus-ceramic-coating-box.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "50 ml / 1.7 oz", ar: "٥٠ مل" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Surface ionized nano ceramic", ar: "سيراميك نانو بتأين سطحي" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
  },
  {
    slug: "autotriz-spray-bottle",
    brand: "Autotriz",
    category: "accessories",
    name: {
      en: "Premium Autotriz Spray Bottle (Empty)",
      ar: "Autotriz — بخاخ كيميائي احترافي (فارغ)",
    },
    shortDesc: {
      en: "Professional-grade chemical-resistant empty spray bottle. Heavy-duty adjustable trigger sprayer, dilution markings. Made in Germany.",
      ar: "بخاخ كيميائي احترافي فارغ مقاوم للمواد الكيميائية. رأس رشاش متين قابل للتعديل مع تدريج لتحديد نسب التخفيف. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "Premium German-engineered heavy-duty empty spray bottle designed specifically for automotive detailing chemicals, shampoos, wheel cleaners, degreasers, and surface preps. Features an industrial chemical-resistant adjustable trigger sprayer that transitions smoothly from a fine atomized mist to a powerful concentrated stream. High-density polyethylene (HDPE) bottle features printed dilution and volume fill guides with professional labeling space.\n\nKey Highlights:\n• Chemical-Resistant Construction: Safe for harsh detailing chemicals, wheel cleaners, and degreasers\n• Adjustable Spray Nozzle: Fine mist to concentrated stream\n• Dilution Markings: Accurate mixing ratios on bottle body\n• Ergonomic Trigger: Comfortable grip for extended detailing sessions\n• Origin: Made in Germany",
      ar: "بخاخ احترافي عالي المتانة فارغ بصناعة ألمانية متطورة، مصمم خصيصاً لتحمل المواد الكيميائية ومحاليل التلميع والشامبو ومنظفات العجلات ومزيلات الشحوم. يتميز برأس رشاش كيميائي متين قابل للتعديل يمنحك رذاذاً ناعماً فائق الانتشار أو تياراً مركزاً قوياً. عبوة مصنوعة من بلاستيك HDPE عالي الكثافة مع تدريج دقيق لنسب التخفيف ومساحة مخصصة لكتابة اسم المحلول.\n\nأبرز المواصفات:\n• مقاوم للمواد الكيميائية: يتحمل المنظفات القوية ومزيلات الشحوم وغسيل الجنوط\n• فوهة رش قابلة للتعديل: من الرذاذ الناعم إلى التيار المباشر\n• تدريج نسب التخفيف: خلط دقيق للمحاليل المركزة\n• مقبض رشاش مريح: مصمم للاستخدام المستمر في مراكز التلميع\n• بلد المنشأ: صُنع في ألمانيا",
    },
    images: ["/products/autotriz/autotriz-spray-bottle.webp"],
    specs: [
      { label: { en: "Type", ar: "النوع" }, value: { en: "Chemical-Resistant Empty Spray Bottle", ar: "بخاخ فارغ مقاوم للمواد الكيميائية" } },
      { label: { en: "Trigger", ar: "الرشاش" }, value: { en: "Adjustable Nozzle (Mist to Stream)", ar: "فوهة قابلة للتعديل (رذاذ إلى تيار مباشر)" } },
      { label: { en: "Material", ar: "المادة" }, value: { en: "High-Density Polyethylene (HDPE)", ar: "بولي إيثيلين عالي الكثافة (HDPE)" } },
      { label: { en: "Compatibility", ar: "التوافق" }, value: { en: "Suitable for all detailing chemicals", ar: "مناسب لجميع المواد والمحاليل الكيميائية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "autotriz-foam-gun",
    brand: "Autotriz",
    category: "accessories",
    name: {
      en: "Autotriz High-Pressure Foam Gun",
      ar: "Autotriz — مدفع رغوة عالي الضغط",
    },
    shortDesc: {
      en: "Heavy-duty high-pressure foam cannon with all-around stainless steel body. Produces ultra-thick clinging snow foam. Made in Germany.",
      ar: "مدفع رغوة احترافي عالي الضغط بهيكل صلب من الفولاذ المقاوم للصدأ بالكامل. يمنحك رغوة ثلجية كثيفة وملتصقة. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "The Autotriz High-Pressure Foam Gun is a professional-grade snow foam cannon engineered with a solid stainless steel internal body core and heavy-duty components for long-lasting commercial detailing performance.\n\nKey Highlights:\n• High-Pressure Compatibility: Handles extreme pressure washer psi for intense foaming\n• Ultra-Thick Clinging Snow Foam: Generates rich shaving-cream consistency foam that clings to paintwork to lift road grime before contact washing\n• Solid All-Steel Body: Heavy-duty stainless steel valve core resists chemical corrosion and wear\n• Precision Control: Top adjustable foam density dial and front fan spray nozzle angle adjustment\n• Wide-Base Anti-Tip Bottle: 1-liter bottle with molded wide rubber base prevents tipping on wet shop floors\n• Quick-Connect Fitting: Standard 1/4\" stainless steel quick-connect inlet for instant pressure washer attachment\n• Origin: Made in Germany",
      ar: "مدفع الرغوة عالي الضغط Autotriz Foam Gun أداة احترافية فائقة الجودة مصممة بهيكل داخلي من الفولاذ المقاوم للصدأ (Stainless Steel) ومكونات متينة لتحمل الاستخدام التجاري المكثف في مراكز العناية بالسيارات ومحطات الغسيل.\n\nأبرز المواصفات:\n• توافق مع الضغط العالي: يتحمل ضغط أجهزة الغسيل القوية لتوليد رغوة فائقة الكثافة\n• رغوة ثلجية كثيفة وثابتة: رغوة ثقيلة تلتصق بالطلاء لإذابة ورفع الأوساخ قبل الغسيل اليدوي\n• هيكل صلب من الفولاذ بالكامل: صمام فولاذي مقاوم للتآكل والمواد الكيميائية\n• تحكم دقيق بالرغوة: قرص علوي لضبط كثافة الرغوة وفوهة أمامية لتعديل زاوية الرش\n• قاعدة عريضة مانعة للانقلاب: قارورة سعة ١ لتر بقاعدة مطاطية عريضة تمنع السقوط على الأرضيات المبللة\n• وصلة سريعة (Quick Connect): وصلة استانلس ستيل مقاس ١/٤ بوصة للتركيب المباشر\n• بلد المنشأ: صُنع في ألمانيا",
    },
    images: [
      "/products/autotriz/autotriz-foam-gun.webp",
    ],
    specs: [
      { label: { en: "Type", ar: "النوع" }, value: { en: "High-Pressure Snow Foam Cannon", ar: "مدفع رغوة ثلجية عالي الضغط" } },
      { label: { en: "Body Core", ar: "الهيكل الداخلي" }, value: { en: "All-Around Solid Stainless Steel", ar: "فولاذ مقاوم للصدأ صلب بالكامل" } },
      { label: { en: "Foam Density", ar: "كثافة الرغوة" }, value: { en: "Adjustable Ultra-Thick Clinging Foam", ar: "رغوة ثلجية كثيفة وملتصقة قابلة للتعديل" } },
      { label: { en: "Connection", ar: "الموصل" }, value: { en: "1/4\" Quick-Connect Stainless Steel", ar: "وصلة سريعة ١/٤ بوصة استانلس ستيل" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "autotriz-wax-and-polish-bottle",
    brand: "Autotriz",
    category: "accessories",
    name: {
      en: "Autotriz Wax & Polish Dispenser Bottle",
      ar: "Autotriz — عبوة توزيع البولش والشمع",
    },
    shortDesc: {
      en: "Professional detailing squeeze bottle for compounds, polishes and waxes. Precision pull-push dispensing spout with product identification checkboxes. Made in Germany.",
      ar: "عبوة ضغط احترافية لتوزيع وتعبئة مركبات التلميع والبولش والشمع. فوهة توزيع دقيقة مع مربعات تحديد نوع المنتج. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "The Autotriz Wax & Polish Dispenser Bottle is a dedicated auto detailing squeeze bottle engineered for professional paint correction and finishing workflows. Made from flexible, durable chemical-resistant polyethylene that allows precise dosage control onto polishing pads without drips or waste.\n\nKey Highlights:\n• Precision Dispensing Spout: Controlled application directly onto foam, wool, or microfiber polishing pads\n• Content Identification Grid: Pre-printed checkboxes for [ ] CUT, [ ] POLISH, and [ ] WAX plus custom labeling area for product name and dilution date\n• Leak-Proof Screw Cap: Heavy-duty ribbed cap seals tightly to prevent drying or clogging\n• Ergonomic Squeeze Body: Comfortable in-hand grip for fast panel-by-panel correction\n• Origin: Made in Germany (AUTOTRIZ Innovative Surface Creation)",
      ar: "عبوة توزيع البولش والشمع Autotriz Wax & Polish Dispenser Bottle عبوة ضغط مخصصة لمراكز التلميع والعناية بالطلاء المحترفة. مصنعة من بلاستيك مرن ومقاوم للمواد الكيميائية يتيح لك التحكم الدقيق بكمية المنتج على وسادات التلميع دون إهدار أو تقطير.\n\nأبرز المواصفات:\n• فوهة توزيع دقيقة: سكب دقيق ومتحكم به مباشرة على إسفنج ووسادات التلميع والصوف\n• خانات تحديد المحتوى: مربعات مطبوعة لاختيار نوع المحلول [ ] CUT و [ ] POLISH و [ ] WAX مع مساحة لكتابة اسم المنتج\n• غطاء لولبي محكم مانع للتسريب: غطاء مسنن متين يمنع جفاف أو انسداد فوهة المعجون\n• هيكل ضغط مريح: ملمس مرن ومريح أثناء تصحيح وتلميع ألواح السيارة\n• بلد المنشأ: صُنع في ألمانيا",
    },
    images: ["/products/autotriz/autotriz-wax-and-polish-bottle.webp"],
    specs: [
      { label: { en: "Type", ar: "النوع" }, value: { en: "Squeeze Dispenser Bottle", ar: "عبوة ضغط لتوزيع السوائل" } },
      { label: { en: "Spout", ar: "الفوهة" }, value: { en: "Precision Pull-Push Dispensing Tip", ar: "فوهة سحب ودفع دقيقة" } },
      { label: { en: "Checkboxes", ar: "خيارات التحديد" }, value: { en: "[ ] Cut · [ ] Polish · [ ] Wax", ar: "قطع · بولش وتلميع · شمع" } },
      { label: { en: "Material", ar: "المادة" }, value: { en: "Chemical-Resistant Polyethylene", ar: "بولي إيثيلين مقاوم للمواد الكيميائية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "autotriz-ppf-refresh-1l",
    brand: "Autotriz",
    category: "ppf",
    name: {
      en: "Autotriz PPF Refresh (1L)",
      ar: "Autotriz — ملمع ومجدد أفلام الحماية PPF (١ لتر)",
    },
    shortDesc: {
      en: "Professional 1L PPF & vinyl film restoration polish. Refreshes top coat, eliminates minor scratches, fading, water spots and restores high-gloss clarity. Made in Germany.",
      ar: "ملمع ومجدد احترافي لأفلام حماية الطلاء (PPF) وتغليف الفينيل (١ لتر). يجدد الطبقة العلوية ويزيل الخدوش الدقيقة والبهتان وبقع الماء ويعيد اللمعان العالي. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "Autotriz PPF Refresh (1L) is a specialized paint protection film polish and surface restorer engineered in Germany for all types of gloss PPF and vinyl wraps. Formulated with ultra-fine precision micro-abrasives and advanced polymer conditioners to safely revive, clarify, and protect transparent films in one easy step.\n\nKey Highlights:\n• PPF & Vinyl Safe: Specifically formulated for polyurethane (TPU) and vinyl wrap top coats without causing yellowing, cloudiness, or swelling\n• Restores Top Coat Clarity: Eliminates fine swirl marks, light scratches, oxidation, and weather fading\n• Removes Tough Contaminants: Dissolves stubborn water spots, mineral stains, bird droppings, and insect etchings\n• High-Gloss Finish: Leaves an ultra-slick, high-gloss protective barrier that enhances optical depth\n• Body Shop Safe: Silicon-free formulation suitable for professional detailing and wrap installation bays\n• Volume: 1 Liter (1000 ml) dispenser bottle\n• Origin: Made in Germany (Autotriz Worldwide, Saarbrücken, Germany)",
      ar: "مجدد وملمع أفلام الحماية Autotriz PPF Refresh (١ لتر) تركيبة ألمانية متطورة مخصصة لجميع أنواع أفلام حماية الطلاء الشفافة (PPF) وتغليف الفينيل. معزز بجزيئات مجهرية دقيقة ومكثفات بوليمرية متطورة لتجديد الطبقة العلوية وإعادة النقاء واللمعان الفائق في خطوة واحدة سهلة.\n\nأبرز المواصفات:\n• آمن ١٠٠٪ على PPF والفينيل: مصمم خصيصاً لأفلام البولي يوريثان (TPU) دون التسبب في الاصفرار أو التعتيم\n• تجديد الطبقة العلوية: يزيل الدوامات الدقيقة والخدوش الخفيفة وآثار البهتان الناتجة عن الشمس والعوامل الجوية\n• إزالة البقع الصعبة: ينظف ويزيل بقع الماء والتكلسات الكلسية وفضلات الطيور\n• لمعان فائق ونعومة حريرية: يمنح الفيلم ملمساً ناعماً ولمعاناً زجاجياً فائق النقاء\n• آمن لورش ومراكز العناية (Body Shop Safe): تركيبة احترافية خالية من الملوثات الضارة\n• الحجم: ١ لتر (١٠٠٠ مل)\n• بلد المنشأ: صُنع في ألمانيا",
    },
    images: [
      "/products/autotriz/autotriz-ppf-refresh-1l.webp",
    ],
    specs: [
      { label: { en: "Volume", ar: "الحجم" }, value: { en: "1 Liter (1000 ml)", ar: "١ لتر (١٠٠٠ مل)" } },
      { label: { en: "Application", ar: "الاستخدام" }, value: { en: "Paint Protection Film (PPF) & Vinyl Wraps", ar: "أفلام حماية الطلاء (PPF) وتغليف الفينيل" } },
      { label: { en: "Function", ar: "الوظيفة" }, value: { en: "Refreshes Top Coat · Removes Scratches & Fading", ar: "تجديد الطبقة العلوية · إزالة الخدوش والبهتان" } },
      { label: { en: "Safety", ar: "الأمان" }, value: { en: "Body Shop Safe · Non-Yellowing", ar: "آمن للورش · غير مسبب للاصفرار" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },

  // ───── Insta Finish — USA
  {
    slug: "insta-finish-wash-and-wax",
    brand: "InstaFinish",
    category: "shampoo",
    name: {
      en: "Insta Finish Wash & Wax",
      ar: "Insta Finish — شامبو وشمع",
    },
    shortDesc: {
      en: "Super-concentrate shampoo — produces durable high gloss, water-beading shine.",
      ar: "شامبو مركّز فائق — يُنتج لمعاناً متيناً وطارداً للماء.",
    },
    longDesc: {
      en: "Produces a durable high gloss shine. Performance liquid concentrate that washes away heavy dirt and road film. New-millennium technology produces a water-beading shine. Los Angeles, USA.",
      ar: "يُنتج لمعاناً متيناً وعالي الجودة. تركيبة سائلة مركزة عالية الأداء تُزيل الأوساخ الثقيلة. تقنية حديثة تعطي طرداً للماء. صُنع في لوس أنجلوس، الولايات المتحدة.",
    },
    images: ["/products/instafinish/insta-finish-wash-and-wax.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "16 fl oz (473 ml)", ar: "٤٧٣ مل" } },
    ],
    audience: "both",
  },
  {
    slug: "insta-finish-premium-dress-all",
    brand: "InstaFinish",
    category: "dressing",
    name: {
      en: "Insta Finish Premium Dress All",
      ar: "Insta Finish — ملمّع الشامل الفاخر",
    },
    shortDesc: {
      en: "Premium concentrated dressing for interior & exterior — leather, plastic, vinyl, rubber, wood.",
      ar: "ملمّع مركّز فاخر للداخل والخارج — جلد، بلاستيك، فينيل، مطاط، خشب.",
    },
    longDesc: {
      en: "Premium concentrated interior/exterior silicone dressing that protects and beautifies leather, plastic, vinyl, rubber and wood. Long-lasting oil-based silicone emulsion. Produces a durable deep shine.",
      ar: "ملمّع سيليكون مركّز فاخر للداخل والخارج، يحمي ويجمّل الجلد والبلاستيك والفينيل والمطاط والخشب. مستحلب سيليكون زيتي طويل الأمد.",
    },
    images: ["/products/instafinish/insta-finish-premium-dress-all.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "16 fl oz (473 ml)", ar: "٤٧٣ مل" } },
    ],
    audience: "both",
  },
  {
    slug: "insta-finish-premium-blue-guard",
    brand: "InstaFinish",
    category: "dressing",
    name: {
      en: "Insta Finish Premium Blue Guard",
      ar: "Insta Finish Blue Guard — حماية زرقاء فاخرة",
    },
    shortDesc: {
      en: "Premium interior/exterior silicone dressing — deep shine for leather, plastic, vinyl, rubber, wood.",
      ar: "ملمّع سيليكون فاخر للداخل والخارج — لمعان عميق للجلد والبلاستيك والفينيل والمطاط والخشب.",
    },
    longDesc: {
      en: "Premium interior/exterior silicone dressing that protects and beautifies leather, plastic, vinyl, rubber and wood. Long-lasting oil-based silicone formula. Produces a durable deep shine.",
      ar: "ملمّع سيليكون فاخر للداخل والخارج، يحمي ويجمّل الأسطح كافة. تركيبة سيليكون زيتي طويلة الأمد.",
    },
    images: ["/products/instafinish/insta-finish-premium-blue-guard.webp"],
    audience: "both",
  },
  {
    slug: "insta-finish-spray-wax",
    brand: "InstaFinish",
    category: "wax",
    name: {
      en: "Insta Finish Spray Wax",
      ar: "Insta Finish — شمع بخاخ",
    },
    shortDesc: {
      en: "High-gloss detail spray — easy to use, leaves a wet-shine look.",
      ar: "بخاخ لمعان عالي — سهل الاستخدام، يترك مظهراً رطباً.",
    },
    longDesc: {
      en: "Easy to use. High gloss. Leaves a wet-shine look. Ideal for quick detail between full washes.",
      ar: "سهل الاستخدام. لمعان عالي. يترك مظهراً رطباً. مثالي للتلميع السريع بين الغسلات.",
    },
    images: ["/products/instafinish/insta-finish-spray-wax.webp"],
    audience: "both",
  },

  // ───── Getsun
  {
    slug: "getsun-foam-out-engine-degreaser",
    brand: "Getsun",
    category: "degreaser",
    name: {
      en: "Getsun Foam Out — Engine Degreaser",
      ar: "Getsun Foam Out — منظف محرك رغوي",
    },
    shortDesc: {
      en: "Engine surface foam degreaser. Cleans your engine fast.",
      ar: "رغوة منظّفة لسطح المحرك. تنظيف سريع.",
    },
    longDesc: {
      en: "Foam Out is a powerful engine-bay degreaser. Spray, let it foam, rinse — lifts grease and grime in minutes without damaging components.",
      ar: "Foam Out منظّف قوي لمقصورة المحرك. رش، اترك الرغوة، اشطف — يرفع الشحوم والأوساخ دون الإضرار بالمكونات.",
    },
    images: ["/products/getsun/getsun-foam-out-engine-degreaser.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "500 ml", ar: "٥٠٠ مل" } },
    ],
    audience: "both",
  },
  {
    slug: "getsun-tire-shine",
    brand: "Getsun",
    category: "tyre",
    name: {
      en: "Getsun Tire Shine",
      ar: "Getsun — ملمع الإطارات",
    },
    shortDesc: {
      en: "No-wiping tyre shine aerosol. Long-lasting, no run-off.",
      ar: "بخاخ ملمع للإطارات بدون مسح. يدوم طويلاً، بدون تسرّب.",
    },
    longDesc: {
      en: "Spray-on tyre dressing — no wiping, no run-off, long-lasting gloss. Protects and restores tyre appearance.",
      ar: "بخاخ ملمع للإطارات — بدون مسح أو تسرّب، لمعان طويل الأمد. يحمي ويُجدد مظهر الإطار.",
    },
    images: ["/products/getsun/getsun-tire-shine.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "500 ml", ar: "٥٠٠ مل" } },
    ],
    audience: "both",
  },

  {
    slug: "getsun-multi-purpose-foam-cleaner",
    brand: "Getsun",
    category: "interior",
    name: {
      en: "Getsun Multi-Purpose Foam Cleaner",
      ar: "Getsun — منظف رغوي متعدد الأغراض",
    },
    shortDesc: {
      en: "Strong foam cleaner for leather, fabric, carpets and vinyl. Deep cleaning in one step.",
      ar: "منظّف رغوي قوي للجلد والقماش والسجاد والفينيل. تنظيف عميق في خطوة واحدة.",
    },
    longDesc: {
      en: "Getsun Multi-Purpose Foam Cleaner lifts dirt and stains from every cabin surface — leather, fabric, carpet and vinyl. Built-in brush head agitates the foam into deep fibres, dissolving grime without harsh scrubbing. Strong effect, deep cleaning, safe on trim.",
      ar: "Getsun Multi-Purpose Foam Cleaner يرفع الأوساخ والبقع من جميع أسطح المقصورة — جلد، قماش، سجاد، فينيل. فرشاة مدمجة في الغطاء تدفع الرغوة في عمق الألياف وتُذيب الأوساخ دون فرك عنيف. تأثير قوي، تنظيف عميق، آمن على الأسطح.",
    },
    images: ["/products/getsun/getsun-multi-purpose-foam-cleaner.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "650 ml / 22 fl oz", ar: "٦٥٠ مل" } },
      { label: { en: "Surfaces", ar: "الأسطح" }, value: { en: "Leather · Fabric · Carpet · Vinyl", ar: "جلد · قماش · سجاد · فينيل" } },
    ],
    audience: "both",
  },


  {
    slug: "briller-quick-dressing",
    brand: "Briller",
    category: "dressing",
    name: {
      en: "Briller Quick Dressing",
      ar: "Briller — ملمّع سريع",
    },
    shortDesc: {
      en: "Aqua-based all-in-one dressing — peak shine for interior, engine and tyres. Ratio 1:1.",
      ar: "ملمّع مائي شامل — لمعان فائق للداخل والمحرك والإطارات. بنسبة تخفيف ١:١.",
    },
    longDesc: {
      en: "Briller Quick Dressing is an aqua-based all-in-one dressing for interior trim, engine bays and tyres. Peak shine inside and out, safe on plastic, rubber and vinyl. Dilutes 1:1 for economical bulk detailing work. Available in 20 L — ideal for car washes and detail shops.",
      ar: "Briller Quick Dressing ملمّع مائي شامل للداخلية ومقصورة المحرك والإطارات. لمعان فائق داخلياً وخارجياً، آمن على البلاستيك والمطاط والفينيل. يخفّف بنسبة ١:١ للاستخدام الاقتصادي. متوفر بعبوة 20 لتر — مثالي لمحطات الغسيل وورش التلميع.",
    },
    images: ["/products/briller/briller-quick-dressing.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B511", ar: "B511" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Dilution", ar: "نسبة التخفيف" }, value: { en: "1:1", ar: "١:١" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Canada", ar: "صُنع في كندا" } },
    ],
    audience: "both",
    highlight: "briller-color",
    updatedAt: "2026-09-05",
  },

  // ───── ABK — white-label fragrances (own brand)
  {
    slug: "abk-mashmom-home-fragrance",
    brand: "ABK",
    category: "fragrance",
    name: {
      en: "ABK Mashmom — Home Fragrance",
      ar: "ABK مشموم — معطر المنزل",
    },
    shortDesc: {
      en: "ABK signature home fragrance — Mashmom blend. Long-lasting premium scent.",
      ar: "معطر ABK الحصري — خلطة مشموم. عطر فاخر يدوم طويلاً.",
    },
    longDesc: {
      en: "ABK's signature 'Mashmom' home fragrance — a carefully crafted scent sold under our own label. Spray on fabrics, upholstery and in rooms for a long-lasting premium finish.",
      ar: "معطر ABK الحصري 'مشموم' — خلطة مميزة تُباع تحت علامتنا الخاصة. استخدمه على الأقمشة والمفروشات وداخل الغرف للحصول على رائحة فاخرة تدوم طويلاً.",
    },
    images: [
      "/products/abk/abk-mashmom-home-fragrance.webp",
      "/products/abk/abk-fragrance-pair.webp",
    ],
    audience: "both",
    featured: true,
  },
  {
    slug: "abk-secret-home-fragrance",
    brand: "ABK",
    category: "fragrance",
    name: {
      en: "ABK Secret — Home Fragrance",
      ar: "ABK Secret — معطر المنزل",
    },
    shortDesc: {
      en: "ABK signature home fragrance — Secret blend. Sophisticated, long-lasting scent.",
      ar: "معطر ABK الحصري — خلطة Secret. عطر راقٍ يدوم طويلاً.",
    },
    longDesc: {
      en: "ABK 'Secret' — a sophisticated home fragrance in our signature black-and-gold bottle. Designed to linger in fabrics and rooms for a luxurious premium feel.",
      ar: "ABK 'Secret' — معطر منزلي راقٍ في عبوتنا الذهبية السوداء المميزة. مصمم ليبقى في الأقمشة والغرف لإحساس فاخر ومميز.",
    },
    images: [
      "/products/abk/abk-secret-home-fragrance.webp",
      "/products/abk/abk-fragrance-pair.webp",
    ],
    audience: "both",
  },

  // ───── Misc
  {
    slug: "smart-car-tyre-foam",
    brand: "SmartCar",
    category: "tyre",
    name: {
      en: "Smart Car Tyre Foam",
      ar: "Smart Car — رغوة الإطارات",
    },
    shortDesc: {
      en: "Hands-free tyre cleaner. Cleans, shines and protects. Spray and walk away.",
      ar: "منظّف إطارات بدون لمس. يُنظف، يُلمّع، يحمي. رُش واتركه.",
    },
    longDesc: {
      en: "Spray and walk away — Smart Car Tyre Foam cleans, shines and protects in one step. 650 ml aerosol.",
      ar: "Smart Car Tyre Foam — رُش واتركه. يُنظّف، يُلمّع، يحمي في خطوة واحدة. علبة 650 مل.",
    },
    images: ["/products/misc/smart-car-tyre-foam.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "650 ml", ar: "٦٥٠ مل" } },
    ],
    audience: "both",
  },
  {
    slug: "detainer-sticker-remover",
    brand: "Other",
    category: "heavy-duty",
    name: {
      en: "Detainer Sticker Remover",
      ar: "Detainer — مزيل الملصقات",
    },
    shortDesc: {
      en: "Aerosol sticker and adhesive remover. Penetrates fast, emulsifies glue, wipes clean.",
      ar: "بخاخ مزيل للملصقات والمواد اللاصقة. تغلغل سريع يُذيب الصمغ ويُنظّف بسهولة.",
    },
    longDesc: {
      en: "Detainer Sticker Remover is a pressurised aerosol that dissolves adhesives behind stickers, decals, tape and glue residue. Penetrates the film, emulsifies the bond and wipes away cleanly. Always test on an inconspicuous area first — solvent-based removers can affect sensitive finishes.",
      ar: "Detainer Sticker Remover بخاخ ضاغط يُذيب المواد اللاصقة خلف الملصقات والأشرطة والصمغ. يخترق الفيلم، يستحلب الرابط، ويُمسح بسهولة. يُنصح بالتجربة على منطقة صغيرة أولاً — المذيبات قد تؤثر على التشطيبات الحساسة.",
    },
    images: ["/products/misc/detainer-sticker-remover.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "C1016", ar: "C1016" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "450 ml", ar: "٤٥٠ مل" } },
    ],
    audience: "both",
  },
  {
    slug: "protectguard-wf-premium",
    brand: "Other",
    category: "heavy-duty",
    name: {
      en: "ProtectGuard WF Premium — Wet Finish Sealer",
      ar: "ProtectGuard WF Premium — عازل تشطيب رطب",
    },
    shortDesc: {
      en: "Professional multi-surface sealer — intensifies colour, repels water and oil. Works on stone, concrete, and as an automotive paint protection layer.",
      ar: "عازل احترافي متعدد الأسطح — يُبرز اللون ويطرد الماء والزيت. يعمل على الحجر والخرسانة، ويُستخدم كذلك كطبقة حماية لطلاء السيارات.",
    },
    longDesc: {
      en: "ProtectGuard WF Premium (Wet Finish) by Guard Industry is a long-lasting water and oil repellent. On stone, concrete, pavers and tile it delivers a deep, saturated 'wet look' with anti-stain protection. ABK also applies this formula as a protective coat on automotive paint — a use case developed from our detailing practice. Suitable for all types of materials indoors and outdoors. Economical coverage: 5 kg ≈ 100 m².",
      ar: "ProtectGuard WF Premium من Guard Industry عازل طويل الأمد طارد للماء والزيت. على الحجر والخرسانة والبلاط يمنح مظهراً رطباً غنياً مع حماية مضادة للبقع. كما تُطبّق ABK هذه التركيبة كطبقة حماية على طلاء السيارات — استخدام تطور من خبرتنا في التلميع. مناسب لجميع أنواع المواد داخلياً وخارجياً. تغطية اقتصادية: 5 كغم ≈ 100 م².",
    },
    images: ["/products/misc/protectguard-wf-premium.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "5 kg", ar: "٥ كغم" } },
      { label: { en: "Coverage", ar: "التغطية" }, value: { en: "~100 m² per 5 kg", ar: "~١٠٠ م² لكل ٥ كغم" } },
      { label: { en: "Use", ar: "الاستخدام" }, value: { en: "Indoor & outdoor · all materials", ar: "داخلي وخارجي · جميع المواد" } },
    ],
    audience: "b2b",
  },
  {
    slug: "fast-masking-tape",
    brand: "Other",
    category: "accessories",
    name: {
      en: "Masking Tape — PPF / Paint Prep",
      ar: "شريط لاصق — لتركيب PPF والطلاء",
    },
    shortDesc: {
      en: "Professional-grade yellow masking tape for PPF installation, paint prep and detailing.",
      ar: "شريط لاصق أصفر احترافي لتركيب PPF وإعداد الطلاء والتلميع.",
    },
    longDesc: {
      en: "Clean-edge yellow masking tape used for PPF installation, paint prep and detailing work. Peels cleanly without residue.",
      ar: "شريط لاصق أصفر بحواف نظيفة يُستخدم في تركيب PPF والطلاء والتلميع. يُنزع بسهولة دون أثر.",
    },
    images: ["/products/misc/fast-masking-tape.webp"],
    audience: "both",
  },
  {
    slug: "edgeless-microfiber-towel",
    brand: "Other",
    category: "accessories",
    name: {
      en: "Edgeless Microfibre Towel (40×40 cm)",
      ar: "منشفة مايكروفايبر بدون حواف — ٤٠×٤٠ سم",
    },
    shortDesc: {
      en: "Ultra-plush edgeless microfibre towel (40×40 cm). Leaves zero marks or swirl marks. Ideal for polishing, ceramic coatings, drying & glass. Made in Germany.",
      ar: "منشفة مايكروفايبر فائقة النعومة بدون حواف (٤٠×٤٠ سم). لا تترك أي علامات أو دوامات. مثالية للتلميع وطلاء السيراميك والتجفيف وتنظيف الزجاج. صُنعت في ألمانيا.",
    },
    longDesc: {
      en: "Professional German-engineered edgeless microfibre car cleaning towel (40×40 cm). Designed with an ultra-plush, borderless laser-cut construction that guarantees zero swirl marks, scratches, or lint residue on sensitive clear coats, ceramic coatings, and delicate glass surfaces.\n\nMulti-Purpose Applications:\n• Polishing & Compound Residue Removal: Buffs off paste, liquid waxes, and polish without marring paint.\n• Ceramic Coating Leveling: Essential tool for spreading and buffing ceramic, graphene, and sealant coatings.\n• High-Absorption Drying: Absorbs water quickly without streaks.\n• Crystal-Clear Glass Cleaning: Wipes glass and mirrors lint-free.\n\nKey Highlights:\n• Size: 40 × 40 cm\n• Edgeless Laser-Cut Design: 100% scratch-free & swirl-free\n• Origin: Made in Germany (GrünesAuto)\n• Reusable & Machine Washable",
      ar: "منشفة تنظيف سيارات مايكروفايبر احترافية بدون حواف بصناعة ألمانية متطورة (٤٠×٤٠ سم). صُممت بحواف مقصوصة بالليزر بدون خياطة لتضمن حماية كاملة بنسبة ١٠٠٪ من الخدوش أو الدوامات أو بقايا الوبر على أسطح الطلاء الحساسة وطلاءات السيراميك والزجاج.\n\nاستخدامات متعددة:\n• إزالة بقايا التلميع والبولش: مسح الشموع والملمعات بنعومة فائقة.\n• مسح وتثبيت طلاء السيراميك: أداة أساسية لتوزيع ومسح طبقات السيراميك والجرافين.\n• تجفيف عالي الامتصاص: يمتص الماء بسرعة دون ترك خطوط.\n• تنظيف الزجاج: يمنح الزجاج والمرايا وضوحاً تاماً بدون وبر.\n\nأبرز المواصفات:\n• المقاس: ٤٠ × ٤٠ سم\n• تصميم بدون حواف (Edgeless): آمن ١٠٠٪ ضد الخدش والدوامات\n• بلد المنشأ: صُنع في ألمانيا (GrünesAuto)\n• قابلة للغسيل وإعادة الاستخدام لمرات عديدة",
    },
    images: [
      "/products/misc/edgeless-microfiber-towel.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "المقاس" }, value: { en: "40 × 40 cm", ar: "٤٠ × ٤٠ سم" } },
      { label: { en: "Design", ar: "التصميم" }, value: { en: "Edgeless (Laser-Cut, Scratch-Free)", ar: "بدون حواف (قص ليزر آمن ضد الخدش)" } },
      { label: { en: "Applications", ar: "الاستخدامات" }, value: { en: "Polishing · Ceramic coating · Drying · Glass", ar: "التلميع · طلاء السيراميك · التجفيف · الزجاج" } },
      { label: { en: "Features", ar: "المميزات" }, value: { en: "Leaves no marks or swirls · Ultra-absorbent", ar: "لا يترك علامات أو دوامات · فائق الامتصاص" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "premium-microfiber-towel-60x40",
    brand: "Other",
    category: "accessories",
    name: {
      en: "Premium Microfibre Towel (60×40 cm)",
      ar: "منشفة مايكروفايبر فاخرة — ٦٠×٤٠ سم",
    },
    shortDesc: {
      en: "Premium multi-purpose microfibre towel (60×40 cm). Specially crafted for car washing, crystal-clear glass, and interior detailing.",
      ar: "منشفة مايكروفايبر فاخرة متعددة الاستخدامات (٦٠×٤٠ سم). مخصصة لغسيل السيارات وتنظيف الزجاج والعناية بالمقصورة الداخلية.",
    },
    longDesc: {
      en: "Premium quality purple microfibre detailing towel (60×40 cm) with reinforced stitched edges for long-lasting durability. Ultra-soft and highly absorbent fibers safely capture dirt, dust, and moisture without scratching delicate paint or interior surfaces.\n\nKey Use Cases:\n• Car Washing & Exterior Detailing: Safely lifts road dirt with rich suds and protects against swirl marks.\n• Glass & Windshield Cleaning: Leaves a crystal-clear, streak-free, and lint-free finish.\n• Interior Leather & Trim Care: Perfect for wiping down dashboard, leather seats, vinyl, and console screens.\n\nKey Highlights:\n• Size: 60 × 40 cm\n• Premium stitched borders: Prevents fraying across hundreds of wash cycles\n• Multi-surface safe: Exterior, glass, and interior upholstery\n• Reusable & Machine Washable",
      ar: "منشفة مايكروفايبر بنفسجية فاخرة للعناية بالسيارات (٦٠×٤٠ سم) بحواف مخيطة ومدعمة لمتانة تدوم طويلاً. ألياف ناعمة وفائقة الامتصاص تلتقط الأوساخ والغبار والرطوبة بأمان دون خدش الطلاء أو الأسطح الداخلية.\n\nالاستخدامات الرئيسية:\n• غسيل السيارات والتنظيف الخارجي: رفع الأوساخ بأمان مع الرغوة وحماية الطلاء من الدوامات.\n• تنظيف الزجاج والواجهات: يمنح الزجاج والزجاج الأمامي نظافة ولمعاناً فائقاً بدون خطوط أو وبر.\n• العناية بالمقصورة الداخلية: مثالية لتنظيف الطبلون والمقاعد الجلدية والفينيل وشاشات الكونسول.\n\nأبرز المواصفات:\n• المقاس: ٦٠ × ٤٠ سم\n• حواف مدعمة بالخياطة: مقاومة للتلف مع الاستخدام والغسيل المتكرر\n• آمنة على جميع الأسطح: الطلاء الخارجي، الزجاج، والفرش الداخلي\n• قابلة للغسيل وإعادة الاستخدام لمرات عديدة",
    },
    images: [
      "/products/misc/premium-microfiber-towel-60x40.webp",
      "/products/misc/premium-microfiber-towel-60x40-folded.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "المقاس" }, value: { en: "60 × 40 cm", ar: "٦٠ × ٤٠ سم" } },
      { label: { en: "Color", ar: "اللون" }, value: { en: "Purple", ar: "بنفسجي" } },
      { label: { en: "Applications", ar: "الاستخدامات" }, value: { en: "Car washing · Glass · Interior detailing", ar: "غسيل السيارات · الزجاج · العناية بالداخلية" } },
      { label: { en: "Edge Type", ar: "نوع الحواف" }, value: { en: "Reinforced Stitched Border", ar: "حواف مخيطة ومدعمة" } },
      { label: { en: "Features", ar: "المميزات" }, value: { en: "High absorption · Lint-free · Scratch-free", ar: "امتصاص عالي · خالية من الوبر · آمنة ضد الخدش" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "premium-chamois-leather-towel",
    brand: "Other",
    category: "accessories",
    name: {
      en: "Premium Chamois & Leather Towel (64×43 cm)",
      ar: "منشفة شامواه وجلد فاخرة — ٦٤×٤٣ سم",
    },
    shortDesc: {
      en: "High-tech synthetic chamois leather drying towel (64×43 cm). 3D concave-convex design for resistance-free gliding. Leaves zero watermarks or dust.",
      ar: "منشفة تجفيف شامواه صناعية عالية التقنية (٦٤×٤٣ سم). تصميم ثلاثي الأبعاد مقعر ومحدب لانزلاق سلس وبدون مقاومة. لا تترك أي علامات مائية أو غبار.",
    },
    longDesc: {
      en: "Premium 3D Chamois & Synthetic Leather Drying Towel (64×43 cm) engineered with advanced high-tech PVA material and a specialized concave-convex texture for effortless, resistance-free cleaning and rapid drying.\n\nKey Highlights:\n• 3D Concave-Convex Texture: Eliminates surface friction and drag during drying\n• Streak-Free & Lint-Free: Leaves zero watermarks, lint, or dust on paintwork and glass\n• Rapid Water Absorption: Instantly soaks up standing water with exceptional capillary action\n• Protective Storage Tube: Comes in a reusable cylindrical hard case to keep the chamois moist, soft, and ready to use\n• Multi-Surface Use: Ideal for automotive paint, windshields, mirrors, marine vessels, and household surfaces",
      ar: "منشفة تجفيف شامواه وجلد صناعي ثلاثية الأبعاد فاخرة (٦٤×٤٣ سم) مصنعة من مواد PVA عالية التقنية مع سطح مقعر ومحدب يمنحك تجفيفاً فائق السرعة وانزلاقاً سلساً بدون مقاومة أو احتكاك.\n\nأبرز المواصفات:\n• تصميم ثلاثي الأبعاد مقعر ومحدب: يمنع الاحتكاك ومقاومة السحب أثناء تجفيف الأسطح\n• خالية تماماً من العلامات والوبر: لا تترك أي آثار ماء أو بقع أو وبر على الطلاء والزجاج\n• امتصاص فائق وسريع للمياه: قدرة عالية على سحب وتجفيف قطرات الماء والأسطح المبللة\n• أنبوب حفظ أسطواني واقٍ: تأتي في علبة أسطوانية مخصصة للحفاظ على ليونة ورطوبة الشامواه للاستخدام الفوري\n• متعددة الاستخدامات: مثالية لطلاء السيارات، الزجاج الأمامي، المرايا، القوارب، والأسطح المنزلية",
    },
    images: ["/products/misc/chamois-leather-towel-64x43.webp"],
    specs: [
      { label: { en: "Size", ar: "المقاس" }, value: { en: "64 × 43 cm", ar: "٦٤ × ٤٣ سم" } },
      { label: { en: "Material", ar: "المادة" }, value: { en: "High-Tech Synthetic PVA Chamois", ar: "شامواه جلد صناعي PVA عالي التقنية" } },
      { label: { en: "Design", ar: "التصميم" }, value: { en: "3D Concave-Convex Resistance-Free", ar: "تصميم ثلاثي الأبعاد مقعر ومحدب مانع للمقاومة" } },
      { label: { en: "Packaging", ar: "التغليف" }, value: { en: "Reusable Storage Cylinder Tube", ar: "أنبوب أسطواني مخصص للحفظ" } },
      { label: { en: "Features", ar: "المميزات" }, value: { en: "Zero watermarks · Super dust cleaning · Ultra-absorbent", ar: "بدون علامات مائية · إزالة فائقة للغبار · امتصاص فائق" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "car-washing-sponge-large",
    brand: "Other",
    category: "accessories",
    name: {
      en: "Car Washing Sponge (Large Size)",
      ar: "إسفنجة غسيل سيارات كبيرة الحجم",
    },
    shortDesc: {
      en: "Extra-large high-density honeycomb car washing sponge. Ergonomic grip bone design holds massive suds and traps dirt safely.",
      ar: "إسفنجة غسيل سيارات كبيرة الحجم بكثافة عالية وتصميم خلايا النحل. مسكة مريحة تحتفظ برغوة وفيرة وتحمي الطلاء من الخدش.",
    },
    longDesc: {
      en: "Extra-large premium honeycomb foam car washing sponge engineered for fast, efficient, and scratch-free vehicle washing. Designed with an ergonomic contoured waist for a secure, fatigue-free hand grip when wet.\n\nKey Highlights:\n• High Suds Retention: Open-cell honeycomb structure absorbs and holds maximum shampoo water and rich foam\n• Paint-Safe Dirt Trapping: Traps and pulls abrasive dirt and grit into deep internal pores away from paint surface\n• Large Coverage Area: Jumbo sizing covers large panels, roofs, and hoods quickly\n• Extra Durable: High-elastic polyurethane foam resists tearing and deformation across heavy daily car wash use\n• Reusable & Easy to Rinse: Rinses clean effortlessly in wash buckets",
      ar: "إسفنجة غسيل سيارات كبيرة الحجم مصنعة من فوم عالي المرونة بخلايا مفتوحة لغسيل فائق السرعة وحماية كاملة لطلاء السيارة من الخدوش والدوامات. تتميز بتصميم مريح مع انحناءات جانبية لسهولة الإمساك بها والتحكم حتى مع الرغوة الكثيفة.\n\nأبرز المواصفات:\n• احتفاظ هائل بالرغوة: هيكل خلايا مسامية يمتص ويحتفظ بكمية وفيرة من شامبو الغسيل والرغوة\n• حماية الطلاء من الخدش: تسحب جزيئات الغبار والأوساخ إلى داخل المسام بعيداً عن احتكاك الطلاء\n• تغطية واسعة وسريعة: حجم كبير يغطي مساحات الأبواب والكبوت والأسطح بسرعة وسهولة\n• متانة عالية وعمر طويل: إسفنج بولي يوريثان عالي المرونة يقاوم التمزق والتآكل مع الاستخدام اليومي\n• سهلة الشطف وإعادة الاستخدام: تنظف بسرعة بمجرد شطفها بالماء",
    },
    images: [
      "/products/misc/car-washing-sponge-large.webp",
      "/products/misc/car-washing-sponge-large-side.webp",
    ],
    specs: [
      { label: { en: "Size", ar: "المقاس" }, value: { en: "Extra Large Jumbo Size", ar: "حجم كبير جداً (جامبو)" } },
      { label: { en: "Foam Structure", ar: "هيكل الإسفنج" }, value: { en: "High-Density Honeycomb Foam", ar: "فوم عالي الكثافة بخلايا مسامية" } },
      { label: { en: "Shape", ar: "الشكل" }, value: { en: "Ergonomic Easy-Grip Bone Design", ar: "تصميم مريح مع انحناء جانبي للمسكة" } },
      { label: { en: "Applications", ar: "الاستخدامات" }, value: { en: "Car washing · Trucks · SUVs · Commercial Fleets", ar: "غسيل السيارات · الشاحنات · مركبات الدفع الرباعي" } },
      { label: { en: "Features", ar: "المميزات" }, value: { en: "High suds retention · Scratch-free · Tear resistant", ar: "احتفاظ عالي بالرغوة · آمن ضد الخدش · مقاوم للتمزق" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "tire-polish-sponge",
    brand: "Other",
    category: "tyre",
    name: {
      en: "Tire Polish & Dressing Applicator Sponge",
      ar: "إسفنجة تلميع وتوزيع ملمع الإطارات",
    },
    shortDesc: {
      en: "Ergonomic contoured foam sponge for even application of tyre shine, dressings and gels without mess or sling.",
      ar: "إسفنجة فوم منحنية مصممة لتوزيع ملمعات وجل الإطارات بتساوٍ وبدون فوضى أو تلطيخ.",
    },
    longDesc: {
      en: "Ergonomically contoured high-density foam applicator sponge designed specifically for applying tire shine, tire gels, and protective dressings along curved rubber tire sidewalls.\n\nKey Highlights:\n• Curved Sidewall Contour: Conforms naturally to the curve of automotive tires for complete edge-to-edge coverage\n• Ergonomic Hourglass Grip: Keeps hands and fingertips clean and clear of tire dressings\n• Dense Micro-Cell Foam: Spreads tire dressings smoothly and evenly without absorbing excess product\n• Eliminates Dressing Sling: Ensures a uniform, non-greasy coat that stays on the rubber\n• Reusable & Easy to Clean: Washable with degreaser and water for long-term use",
      ar: "إسفنجة تطبيق فوم عالية الكثافة مصممة بانحناءات مخصصة لتوزيع وتطبيق ملمعات وجل وحماية الإطارات على جوانب الكفرات بسهولة ودقة.\n\nأبرز المواصفات:\n• انحناء متطابق مع جوانب الإطار: يتطابق مع منحنى الإطار ليضمن تغطية متساوية وكاملة من الحافة للحافة\n• مسكة مريحة بشكل ساعة رملية: تحافظ على نظافة اليدين والأصابع بعيداً عن مواد التلميع\n• فوم مسامي دقيق وعالي الكثافة: يوزع الملمع بنعومة دون امتصاص أو إهدار كميات زائدة\n• يمنع تطاير الملمع: يمنح الإطار طبقة متناسقة وغير زيتية تثبت على المطاط\n• قابلة للغسيل وإعادة الاستخدام: تنظف بسهولة بالماء ومزيل الشحوم للاستخدام المتكرر",
    },
    images: [
      "/products/misc/tire-polish-sponge.webp",
    ],
    specs: [
      { label: { en: "Type", ar: "النوع" }, value: { en: "Contoured Tire Dressing Applicator", ar: "إسفنجة منحنية لتطبيق ملمع الإطارات" } },
      { label: { en: "Shape", ar: "الشكل" }, value: { en: "Curved Sidewall Profile & Hourglass Grip", ar: "تصميم مقعر لجوانب الإطار مع مسكة ساعة رملية" } },
      { label: { en: "Material", ar: "المادة" }, value: { en: "High-Density Micro-Cell Polyurethane Foam", ar: "فوم بولي يوريثان دقيق عالي الكثافة" } },
      { label: { en: "Applications", ar: "الاستخدامات" }, value: { en: "Tire Shines · Rubber Dressings · Trim Conditioners", ar: "ملمع الإطارات · معالجة المطاط · مرطبات البلاستيك" } },
      { label: { en: "Features", ar: "المميزات" }, value: { en: "Even coverage · Mess-free hand grip · Reusable", ar: "توزيع متساوٍ · مسكة نظيفة لليد · قابلة لإعادة الاستخدام" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "grunes-auto-pad-step2-da-6in",
    brand: "Other",
    category: "accessories",
    name: {
      en: "GrünesAuto 2nd Step Dual Action Polishing Pad (6 Inch)",
      ar: "GrünesAuto — وسادة تلميع الخطوة الثانية لأجهزة DA (٦ إنش)",
    },
    shortDesc: {
      en: "Premium 6-inch Dual Action medium cut and polishing foam pad. True German engineering for swirl removal, paint leveling and high-gloss finishing. Made in Germany.",
      ar: "وسادة تلميع فوم احترافية ٦ إنش للخطوة الثانية لأجهزة التلميع المزدوج (DA). هندسة ألمانية لإزالة الدوامات وتنعيم الطلاء وإبراز اللمعان الفائق. صُنعت في ألمانيا.",
    },
    longDesc: {
      en: "The GrünesAuto 2nd Step Dual Action Polishing Pad (6 Inch) is a professional German-manufactured medium-cut and polishing foam pad engineered specifically for Dual Action (DA) orbital polishers. Ideal for the second step of paint correction to eliminate moderate swirl marks, compounding haze, and holograms while restoring deep optical clarity.\n\nKey Highlights:\n• Step 2 Correction & Polishing: Perfect balance of cutting and finishing capability to refine paint surfaces after heavy cutting\n• 6-Inch Dual Action Fit: Sized for 5\" and 6\" DA backing plates with precision center cooling/alignment hole\n• Hook & Loop Backing: Heavy-duty Velcro backing withstands high RPM and orbital heat without delaminating\n• Open-Cell Foam Technology: Disperses heat evenly and prevents compound clogging for extended pad life\n• Origin: Made in Germany (GrünesAuto — True German Product)",
      ar: "وسادة تلميع الخطوة الثانية GrünesAuto 2nd Step DA Polishing Pad (٦ إنش) وسادة فوم ألمانية احترافية مخصصة لأجهزة التلميع المزدوج (Dual Action Polishers). مصممة خصيصاً للمرحلة الثانية من تصحيح الطلاء لإزالة الدوامات المتوسطة وآثار التلميع الخشن (Haze) والهولوجرام واستعادة نقاء ولمعان الطلاء العالي.\n\nأبرز المواصفات:\n• تصحيح وتلميع الخطوة الثانية: توازن مثالي بين القدرة على الإزالة وتنعيم السطح بعد مرحلة القص الأولي\n• مقاس ٦ إنش لأجهزة DA: متوافقة مع قواعد أجهزة التلميع مقاس ٥ و ٦ إنش مع فتحة تهوية ومحاذاة مركزية\n• ظهر فلكرو (Hook & Loop) قوي: تثبيت محكم يتحمل سرعات الدوران والحرارة العالية دون انفصال\n• تقنية الفوم ذو الخلايا المفتوحة: تشتيت فعال للحرارة ومنع تكتل المعجون لعمر افتراضي أطول\n• بلد المنشأ: صُنع في ألمانيا (GrünesAuto — منتج ألماني أصلي)",
    },
    images: ["/products/misc/grunes-auto-pad-step2-da-6in.webp"],
    specs: [
      { label: { en: "Step / Grade", ar: "المرحلة / الدرجة" }, value: { en: "Step 2 — Medium Cut & Polish", ar: "الخطوة ٢ — قص وتلميع متوسط" } },
      { label: { en: "Size", ar: "المقاس" }, value: { en: "6 Inch (150 mm)", ar: "٦ إنش (١٥٠ مم)" } },
      { label: { en: "Machine Type", ar: "نوع الجهاز" }, value: { en: "Dual Action (DA) & Orbital Polishers", ar: "أجهزة التلميع المزدوج (DA) والمدارية" } },
      { label: { en: "Backing", ar: "قاعدة التثبيت" }, value: { en: "Hook & Loop with Center Cooling Hole", ar: "فلكرو مع فتحة تبريد ومحاذاة مركزية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany (GrünesAuto)", ar: "صُنع في ألمانيا (GrünesAuto)" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "grunes-auto-pad-step1-da-6in",
    brand: "Other",
    category: "accessories",
    name: {
      en: "GrünesAuto 1st Step Dual Action Cutting Pad (6 Inch)",
      ar: "GrünesAuto — وسادة قص وتلميع خشن الخطوة الأولى لأجهزة DA (٦ إنش)",
    },
    shortDesc: {
      en: "Heavy-cut 6-inch Dual Action foam polishing pad. Engineered in Germany for fast defect removal, deep scratch correction and oxidation leveling. Made in Germany.",
      ar: "وسادة فوم احترافية ٦ إنش للقص وإزالة الخدوش العميقة (الخطوة الأولى) لأجهزة التلميع المزدوج (DA). هندسة ألمانية لإزالة العيوب والأكسدة بسرعة وأمان. صُنعت في ألمانيا.",
    },
    longDesc: {
      en: "The GrünesAuto 1st Step Dual Action Cutting Pad (6 Inch) is a heavy-duty German-engineered cutting foam pad designed specifically for Dual Action (DA) orbital polishers. Engineered as the aggressive first step in multi-stage paint correction to rapidly level severe clear-coat defects, heavy swirls, sanding marks, water spots, and severe oxidation without scouring the paint.\n\nKey Highlights:\n• Step 1 Heavy Cut: High-density firm maroon foam provides powerful cutting power when paired with compounds\n• 6-Inch Dual Action Fit: Sized for 5\" and 6\" DA backing plates with precision center cooling/alignment hole\n• Hook & Loop Backing: Industrial-grade Velcro backing withstands high friction, heat, and lateral shear forces\n• Thermally Stable Open-Cell Foam: Retains firm cutting density across extended compounding passes without softening\n• Origin: Made in Germany (GrünesAuto — True German Product)",
      ar: "وسادة القص والتلميع الخشن الخطوة الأولى GrünesAuto 1st Step DA Cutting Pad (٦ إنش) وسادة فوم ألمانية فائقة المتانة مخصصة لأجهزة التلميع المزدوج (Dual Action Polishers). مصممة للمرحلة الأولى الأساسية في تصحيح الطلاء لإزالة الخدوش العميقة والدوامات الشديدة وعلامات الصنفرة والأكسدة بسرعة ودقة دون الإضرار بطبقة اللقلق (Clear Coat).\n\nأبرز المواصفات:\n• قص وتصحيح مكثف (الخطوة ١): فوم مارون عالي الكثافة والصلابة يمنحك قوة قص هائلة عند دمجه مع مركبات التلميع الخشن\n• مقاس ٦ إنش لأجهزة DA: متوافقة مع قواعد أجهزة التلميع مقاس ٥ و ٦ إنش مع فتحة تهوية ومحاذاة مركزية\n• ظهر فلكرو (Hook & Loop) صناعي: مقاوم للحرارة العالية وقوى القص الجانبية أثناء العمل المتواصل\n• فوم ذو خلايا مفتوحة ومقاوم للحرارة: يحافظ على صلابته وكفاءته في القص دون أن يلين مع ارتفاع الحرارة\n• بلد المنشأ: صُنع في ألمانيا (GrünesAuto — منتج ألماني أصلي)",
    },
    images: ["/products/misc/grunes-auto-pad-step1-da-6in.webp"],
    specs: [
      { label: { en: "Step / Grade", ar: "المرحلة / الدرجة" }, value: { en: "Step 1 — Heavy Cut & Defect Removal", ar: "الخطوة ١ — قص خشن وإزالة العيوب" } },
      { label: { en: "Size", ar: "المقاس" }, value: { en: "6 Inch (150 mm)", ar: "٦ إنش (١٥٠ مم)" } },
      { label: { en: "Machine Type", ar: "نوع الجهاز" }, value: { en: "Dual Action (DA) & Orbital Polishers", ar: "أجهزة التلميع المزدوج (DA) والمدارية" } },
      { label: { en: "Backing", ar: "قاعدة التثبيت" }, value: { en: "Hook & Loop with Center Cooling Hole", ar: "فلكرو مع فتحة تبريد ومحاذاة مركزية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany (GrünesAuto)", ar: "صُنع في ألمانيا (GrünesAuto)" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "grunes-auto-pad-step3-da-6in",
    brand: "Other",
    category: "accessories",
    name: {
      en: "GrünesAuto 3rd Step Dual Action Finishing Pad (6 Inch)",
      ar: "GrünesAuto — وسادة التلميع النهائي والفينش الخطوة الثالثة لأجهزة DA (٦ إنش)",
    },
    shortDesc: {
      en: "Ultra-soft 6-inch Dual Action finishing foam pad. Engineered in Germany for maximum gloss reflection, hologram elimination, and wax/sealant application. Made in Germany.",
      ar: "وسادة فوم فائقة النعومة ٦ إنش للخطوة الثالثة والفينش النهائي لأجهزة التلميع المزدوج (DA). هندسة ألمانية للمعان المرآة وإزالة الهولوجرام وتطبيق الشمع والسيلانت. صُنعت في ألمانيا.",
    },
    longDesc: {
      en: "The GrünesAuto 3rd Step Dual Action Finishing Pad (6 Inch) is an ultra-fine, open-cell German finishing foam pad engineered specifically for Dual Action (DA) orbital polishers. Designed as the ultimate final step in paint correction and gloss enhancement to eliminate micro-marring, ultrafine holograms, and buffer trails while leaving an ultra-deep, mirror-like wet reflection.\n\nKey Highlights:\n• Step 3 Ultra-Gloss Finishing: Ultra-soft black foam creates zero cut and maximum gloss depth across all paint types\n• Wax & Sealant Application: Ideal vehicle for machine application of synthetic sealants, liquid carnauba waxes, and glaze coats\n• 6-Inch Dual Action Fit: Sized for 5\" and 6\" DA backing plates with precision center cooling/alignment hole\n• Hook & Loop Backing: Heavy-duty Velcro backing with reinforced bonding to prevent delamination during high-speed finishing\n• Origin: Made in Germany (GrünesAuto — True German Product)",
      ar: "وسادة التلميع النهائي والفينش الخطوة الثالثة GrünesAuto 3rd Step DA Finishing Pad (٦ إنش) وسادة فوم ألمانية فائقة النعومة ومصممة خصيصاً لأجهزة التلميع المزدوج (Dual Action Polishers). تمثل المرحلة النهائية الحاسمة في العناية بالطلاء لإبراز أقصى درجات اللمعان وعكس الضوء مثل المرآة، مع إزالة أدق آثار الهولوجرام والدوامات المجهرية.\n\nأبرز المواصفات:\n• لمعان وفينش فائق (الخطوة ٣): فوم أسود ناعم جداً بدون أي قوة كشط ليمنحك عمقاً زجاجياً رطباً في اللمعان\n• تطبيق الشمع والسيلانت: مثالية لتوزيع طبقات واكس الكارنوبا السائل والسيلانت ومثبتات اللمعان آلياً\n• مقاس ٦ إنش لأجهزة DA: متوافقة مع قواعد أجهزة التلميع مقاس ٥ و ٦ إنش مع فتحة تهوية ومحاذاة مركزية\n• ظهر فلكرو (Hook & Loop) متين: تثبيت عالي الجودة يتحمل السرعات العالية دون تفكك\n• بلد المنشأ: صُنع في ألمانيا (GrünesAuto — منتج ألماني أصلي)",
    },
    images: ["/products/misc/grunes-auto-pad-step3-da-6in.webp"],
    specs: [
      { label: { en: "Step / Grade", ar: "المرحلة / الدرجة" }, value: { en: "Step 3 — Ultra-Fine Finishing & Waxing", ar: "الخطوة ٣ — فينش نهائي فائق وتطبيق واكس" } },
      { label: { en: "Size", ar: "المقاس" }, value: { en: "6 Inch (150 mm)", ar: "٦ إنش (١٥٠ مم)" } },
      { label: { en: "Machine Type", ar: "نوع الجهاز" }, value: { en: "Dual Action (DA) & Orbital Polishers", ar: "أجهزة التلميع المزدوج (DA) والمدارية" } },
      { label: { en: "Backing", ar: "قاعدة التثبيت" }, value: { en: "Hook & Loop with Center Cooling Hole", ar: "فلكرو مع فتحة تبريد ومحاذاة مركزية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany (GrünesAuto)", ar: "صُنع في ألمانيا (GrünesAuto)" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
  {
    slug: "grunes-auto-pad-step2-rotary-6in",
    brand: "Other",
    category: "accessories",
    name: {
      en: "GrünesAuto 2nd Step Rotary Polishing Pad (6 Inch)",
      ar: "GrünesAuto — وسادة تلميع الخطوة الثانية لأجهزة الروتاري (٦ إنش)",
    },
    shortDesc: {
      en: "Professional 6-inch rotary medium cut and polishing foam pad. Engineered in Germany for high-speed swirl removal, paint leveling and brilliant gloss. Made in Germany.",
      ar: "وسادة تلميع فوم احترافية ٦ إنش للخطوة الثانية لأجهزة التلميع الدائري (الروتاري). هندسة ألمانية لإزالة الدوامات وتنعيم الطلاء واللمعان العالي. صُنعت في ألمانيا.",
    },
    longDesc: {
      en: "The GrünesAuto 2nd Step Rotary Polishing Pad (6 Inch) is a professional German-engineered medium-cut polishing foam pad purpose-built for direct-drive Rotary polishers. Designed for fast, efficient second-step paint correction to eliminate buffer trails, medium swirls, and light compounding marks while building deep, high-gloss surface reflection.\n\nKey Highlights:\n• Step 2 Rotary Polishing: Medium-cut yellow foam balances defect correction and high-gloss finishing under rotary torque\n• Solid Rotary Hook & Loop Backing: Continuous solid Velcro backing engineered for direct-drive rotary backing plates (no center hole needed)\n• Beveled Edge Design: Tapered foam edge protects adjacent body panels and emblems from backing plate contact\n• Thermal Resistance: Dense open-cell foam structure dissipates rotary friction heat rapidly\n• Origin: Made in Germany (GrünesAuto — True German Product)",
      ar: "وسادة تلميع الخطوة الثانية لأجهزة الروتاري GrünesAuto 2nd Step Rotary Polishing Pad (٦ إنش) وسادة فوم ألمانية احترافية مخصصة لأجهزة التلميع الدائري المباشر (Rotary Polishers). صممت لتصحيح وتنعيم الطلاء في المرحلة الثانية بكفاءة عالية لإزالة آثار البولش الخشن والدوامات المتوسطة وإبراز اللمعان النقي.\n\nأبرز المواصفات:\n• تلميع وتصحيح المرحلة الثانية: فوم أصفر متوسط الصلابة يوازن بين إزالة العيوب وتوليد اللمعان تحت عزم الروتاري\n• ظهر فلكرو صلب مخصص للروتاري: قاعدة تثبيت كاملة مصممة لأطباق أجهزة الروتاري الدائرية (بدون فتحة مركزية)\n• حافة مائلة واقية: تصميم حواف مائلة يحمي أجزاء الهيكل والشعارات المجاورة من الاحتكاك المباشر\n• مقاومة عالية للحرارة: هيكل خلايا مفتوحة يشتت حرارة الاحتكاك الناتجة عن سرعة الروتاري العالية\n• بلد المنشأ: صُنع في ألمانيا (GrünesAuto — منتج ألماني أصلي)",
    },
    images: ["/products/misc/grunes-auto-pad-step2-rotary-6in.webp"],
    specs: [
      { label: { en: "Step / Grade", ar: "المرحلة / الدرجة" }, value: { en: "Step 2 — Medium Cut & Rotary Polishing", ar: "الخطوة ٢ — قص وتلميع روتاري متوسط" } },
      { label: { en: "Size", ar: "المقاس" }, value: { en: "6 Inch (150 mm)", ar: "٦ إنش (١٥٠ مم)" } },
      { label: { en: "Machine Type", ar: "نوع الجهاز" }, value: { en: "Direct-Drive Rotary Polishers", ar: "أجهزة التلميع الدائري (الروتاري)" } },
      { label: { en: "Backing", ar: "قاعدة التثبيت" }, value: { en: "Solid Hook & Loop (Velcro)", ar: "فلكرو كامل بدون فتحة مركزية" } },
      { label: { en: "Origin", ar: "بلد المنشأ" }, value: { en: "Made in Germany (GrünesAuto)", ar: "صُنع في ألمانيا (GrünesAuto)" } },
    ],
    audience: "both",
    updatedAt: "2026-09-02",
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export const BRANDS: BrandKey[] = [
  "VTEK",
  "Vertek",
  "Autotriz",
  "Briller",
  "Grizzly",
  "InstaFinish",
  "Getsun",
  "ABK",
  "SmartCar",
  "Other",
];

export const CATEGORIES: CategoryKey[] = [
  "ppf",
  "tint",
  "shampoo",
  "polish",
  "tyre",
  "glass",
  "dressing",
  "wax",
  "interior",
  "degreaser",
  "heavy-duty",
  "fragrance",
  "accessories",
  "ceramic",
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(
  product: Product,
  audience: AudienceScope,
  limit = 4,
): Product[] {
  // Match by brand or category, but never recommend a product the current
  // audience can't browse — clicking the related card would 404 once the
  // product detail page filters its own static params by audience.
  return PRODUCTS.filter(
    (p) =>
      p.slug !== product.slug &&
      (p.audience === "both" || p.audience === audience) &&
      (p.brand === product.brand || p.category === product.category),
  ).slice(0, limit);
}


// ───── Storefront helpers ─────────────────────────────────────────────────

/** Representative photo per category — drives the "Shop by category" shelf. */
export const CATEGORY_THUMBS: Record<CategoryKey, string> = {
  ppf: "/products/vtek/vtek-weather-armor-lineup-v2.webp",
  tint: "/products/vtek/vtek-solar-armor-window-tint.webp",
  ceramic: "/products/autotriz/autotriz-ion-plus-ceramic-coating.webp",
  shampoo: "/products/autotriz/autotriz-rich-foam-shampoo-20l.webp",
  polish: "/products/autotriz/autotriz-ultimate-polish-302.webp",
  tyre: "/products/getsun/getsun-tire-shine.webp",
  glass: "/products/briller/briller-glass-cleaner.webp",
  dressing: "/products/briller/briller-quick-dressing.webp",
  wax: "/products/instafinish/insta-finish-spray-wax.webp",
  interior: "/products/autotriz/autotriz-leather-and-vinyl.webp",
  degreaser: "/products/getsun/getsun-foam-out-engine-degreaser.webp",
  "heavy-duty": "/products/misc/detainer-sticker-remover.webp",
  fragrance: "/products/abk/abk-fragrance-pair.webp",
  accessories: "/products/misc/fast-masking-tape.webp",
};

/** Representative photo per brand — drives the "Brands we carry" shelf. */
export const BRAND_IMAGES: Record<BrandKey, string> = {
  VTEK: "/products/vtek/vtek-weather-armor-lineup-v2.webp",
  Vertek: "/products/vtek/vtek-weather-armor-lineup-v2.webp",
  Autotriz: "/products/autotriz/autotriz-3d-matrix-ultra.webp",
  Briller: "/products/briller/briller-wash-and-wax.webp",
  Grizzly: "/products/grizzly/grizzly-glossy-ppf-premium-plus.webp",
  InstaFinish: "/products/instafinish/insta-finish-spray-wax.webp",
  Getsun: "/products/getsun/getsun-foam-out-engine-degreaser.webp",
  ABK: "/products/abk/abk-fragrance-pair.webp",
  SmartCar: "/products/misc/smart-car-tyre-foam.webp",
  Other: "/products/misc/protectguard-wf-premium.webp",
};

/**
 * Brands still stocked, sellable and filterable, but no longer advertised on
 * marketing surfaces (home BrandStrip, trust badges, B2B taglines, wholesale
 * meta descriptions, knowsAbout schema). Owner decision 2026-08-30: stop
 * promoting these while the remaining stock sells through. Deliberately NOT
 * applied inside getBrandsFor() -- that also drives the catalogue filter
 * chips, which must keep working for anyone browsing to these products.
 */
export const UNPROMOTED_BRANDS: readonly BrandKey[] = [
  "InstaFinish",
  "Getsun",
];

function visibleTo(audience: AudienceScope) {
  return (p: Product) => p.audience === "both" || p.audience === audience;
}

/** Categories that actually contain products for this audience, in display order. */
export function getCategoriesFor(audience: AudienceScope): CategoryKey[] {
  return CATEGORIES.filter((c) =>
    PRODUCTS.some((p) => p.category === c && visibleTo(audience)(p)),
  );
}

/** Brands that actually have products for this audience, in display order. */
export function getBrandsFor(audience: AudienceScope): BrandKey[] {
  return BRANDS.filter((b) =>
    PRODUCTS.some((p) => p.brand === b && visibleTo(audience)(p)),
  );
}

/**
 * Products for the home-page shelf: featured first, then one product from
 * each brand not yet represented so the shelf reads as a tour of the range,
 * topped up in catalogue order. Audience-scoped so no tile links to a page
 * the product detail route refuses to generate.
 */
export function getStoreShelfProducts(
  audience: AudienceScope,
  limit = 8,
): Product[] {
  const visible = PRODUCTS.filter(visibleTo(audience));
  const picked: Product[] = visible.filter((p) => p.featured);
  const seenBrands = new Set(picked.map((p) => p.brand));
  // Unpromoted brands are kept out of the brand tour and the top-up so the
  // home shelf stops advertising them -- they remain fully browsable in the
  // catalogue. An explicit `featured` flag still wins, so curation can
  // always override the exclusion.
  const promotable = visible.filter(
    (p) => p.featured || !UNPROMOTED_BRANDS.includes(p.brand),
  );
  for (const p of promotable) {
    if (picked.length >= limit) break;
    if (picked.includes(p) || seenBrands.has(p.brand)) continue;
    picked.push(p);
    seenBrands.add(p.brand);
  }
  for (const p of promotable) {
    if (picked.length >= limit) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked.slice(0, limit);
}
