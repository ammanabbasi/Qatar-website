/**
 * Typed product catalogue for ABK Trading & Service.
 *
 * Add/remove products by editing this file. Schema intentionally mirrors a CMS
 * document shape so migration to Sanity (or similar) later is copy-paste.
 *
 * Image paths are relative to /public and optimized at runtime by Next.js Image.
 */

export type BrandKey =
  | "Vertek"
  | "Autotriz"
  | "Briller"
  | "InstaFinish"
  | "Getsun"
  | "Sitrett"
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
  // ───── Vertek — Paint Protection Film (STAR)
  {
    slug: "vertek-ppf-weather-armor",
    brand: "Vertek",
    category: "ppf",
    name: {
      en: "Vertek PPF — Weather Armor",
      ar: "Vertek — فيلم حماية الطلاء Weather Armor",
    },
    shortDesc: {
      en: "Premium paint protection film with self-healing nano-technology. Scratch-resistant, weather-proof, high-gloss.",
      ar: "فيلم حماية طلاء فاخر بتقنية النانو الذاتية الإصلاح. مقاوم للخدش والعوامل الجوية ولامع.",
    },
    longDesc: {
      en: "Vertek Weather Armor PPF is a premium-grade paint protection film that shields your paint from rock chips, scratches, weather and chemicals. The self-healing top-coat erases minor scratches with heat, and the optical clarity keeps your paintwork invisible underneath — just brighter. Available in gloss and matte finishes, cut for full-body, front-end, or custom areas. Installed at our Mesaimeer workshop.",
      ar: "فيلم حماية الطلاء Vertek Weather Armor يحمي طلاء سيارتك من الحصى والخدوش والعوامل الجوية والمواد الكيميائية. طبقة الإصلاح الذاتي تُزيل الخدوش الخفيفة بالحرارة، والشفافية البصرية تُظهر الطلاء الأصلي بلمعان أعلى. متوفر بتشطيبات لامعة ومطفية — للهيكل الكامل أو المقدمة أو الأجزاء المحددة. يُركّب في ورشتنا بمسيمير.",
    },
    images: [
      "/products/vertek/vertek-ppf-premium-protection.webp",
      "/products/vertek/vertek-weather-armor-boxes.webp",
      "/products/vertek/vertek-landcruiser-installation.webp",
    ],
    specs: [
      {
        label: { en: "Features", ar: "المميزات" },
        value: {
          en: "Self-healing · Scratch resistant · Weather proof · High gloss",
          ar: "إصلاح ذاتي · مقاوم للخدش · مقاوم للعوامل الجوية · لمعان عالي",
        },
      },
      {
        label: { en: "Technology", ar: "التقنية" },
        value: { en: "Advanced nano-technology", ar: "تقنية النانو المتقدمة" },
      },
      {
        label: { en: "Finish", ar: "التشطيب" },
        value: { en: "Gloss / Matte", ar: "لامع / مطفي" },
      },
      {
        label: { en: "Application", ar: "التطبيق" },
        value: {
          en: "Installed at ABK Mesaimeer workshop",
          ar: "يُركّب في ورشة ABK بمسيمير",
        },
      },
    ],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
  },

  // ───── Vertek — Window Tints (STAR)
  {
    slug: "vertek-window-tints",
    brand: "Vertek",
    category: "tint",
    name: {
      en: "Vertek Window Tints",
      ar: "Vertek — تظليل النوافذ",
    },
    shortDesc: {
      en: "Heat-rejecting window films in multiple VLT grades. Compliant with Qatar regulations.",
      ar: "أفلام نوافذ عازلة للحرارة بدرجات VLT متعددة، متوافقة مع قوانين قطر.",
    },
    longDesc: {
      en: "Vertek window films cut heat, UV and glare without compromising visibility. Multiple VLT (Visible Light Transmission) grades available to match your preference and Qatar's regulations. Professionally installed at our Mesaimeer workshop with full cut and lifetime peel warranty.",
      ar: "أفلام Vertek تعزل الحرارة والأشعة فوق البنفسجية والوهج دون التأثير على الرؤية. متوفرة بدرجات VLT متعددة حسب تفضيلك وقوانين قطر. تُركّب باحتراف في ورشتنا بمسيمير مع ضمان ضد التقشير.",
    },
    images: ["/products/vertek/vertek-window-tint.webp"],
    audience: "both",
    featured: true,
    highlight: "vertek-premium",
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
    images: [
      "/products/briller/briller-wash-and-wax.webp",
      "/products/briller/briller-wash-and-wax-20l-wide.webp",
      "/products/briller/briller-wash-and-wax-close.webp",
    ],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B505", ar: "B505" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
    ],
    audience: "both",
    featured: true,
    highlight: "briller-color",
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
    ],
    audience: "both",
    highlight: "briller-color",
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
    ],
    audience: "both",
    highlight: "briller-color",
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
    images: [
      "/products/briller/briller-glass-cleaner.webp",
      "/products/briller/briller-glass-cleaner-20l.webp",
    ],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "B508", ar: "B508" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
    ],
    audience: "both",
    highlight: "briller-color",
  },

  // ───── Autotriz — Detailing Chemicals
  {
    slug: "autotriz-rich-foam-shampoo",
    brand: "Autotriz",
    category: "shampoo",
    name: {
      en: "Autotriz Rich Foam Shampoo",
      ar: "Autotriz — شامبو رغوي غني",
    },
    shortDesc: {
      en: "pH-balanced, thick-foaming shampoo with gloss enhancers. Made in Germany.",
      ar: "شامبو رغوي كثيف متوازن الحموضة مع محسّنات لمعان. صُنع في ألمانيا.",
    },
    longDesc: {
      en: "Autotriz Rich Foam Shampoo uses proprietary gloss enhancers to maximise shine and optical clarity while maintaining waxes, sealants and coatings. Produces thick suds and foam that carry dirt away without rubbing or scrubbing. Blended with special emulsifiers and pH-balanced, it won't spot or stain even in direct sunlight. Available as 20L drum — supplied to ABK Trading & Service in Qatar.",
      ar: "شامبو Autotriz يستخدم محسّنات لمعان متميزة لتعظيم اللمعان والشفافية البصرية مع الحفاظ على الشموع والطلاءات. رغوة كثيفة تحمل الأوساخ دون فرك. تركيبة متوازنة الحموضة لا تترك بقعاً حتى تحت الشمس المباشرة. متوفر في عبوة 20 لتر — موزع ABK في قطر.",
    },
    images: [
      "/products/autotriz/autotriz-rich-foam-shampoo-20l.webp",
      "/products/autotriz/autotriz-rich-foam-shampoo-abk-label.webp",
    ],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "AT-CC-RFS-20", ar: "AT-CC-RFS-20" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "20 L", ar: "٢٠ لتر" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
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
    images: [
      "/products/autotriz/autotriz-heavy-cut-901.webp",
      "/products/autotriz/autotriz-heavy-cut-901-close.webp",
      "/products/autotriz/autotriz-heavy-cut-901-shelf.webp",
    ],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "901", ar: "901" } },
    ],
    audience: "both",
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
    images: [
      "/products/autotriz/autotriz-ultimate-polish-302.webp",
      "/products/autotriz/autotriz-ultimate-polish-302-close.webp",
    ],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "302", ar: "302" } },
    ],
    audience: "both",
  },

  {
    slug: "autotriz-power-cut-701",
    brand: "Autotriz",
    category: "polish",
    name: {
      en: "Autotriz Power Cut 701",
      ar: "Autotriz Power Cut 701 — مركّب قطع قوي",
    },
    shortDesc: {
      en: "Cutting-edge polishing compound — high cut performance with gloss finish. Body-shop safe.",
      ar: "مركّب تلميع متطور — قطع عالي مع لمعان. آمن لورش السمكرة.",
    },
    longDesc: {
      en: "Autotriz Power Cut 701 is a cutting-edge solution designed to redefine your polishing experience. Formula delivers an extraordinary level of cutting performance while ensuring a superior gloss finish on automotive clear coats. Ideal for removing deep scratches and swirls. Body-shop safe. 4 L jug.",
      ar: "تركيبة متقدمة تجمع بين قدرة قطع فائقة ولمعان استثنائي على الطلاءات الشفافة. مثالي لإزالة الخدوش العميقة والهالات. آمن لورش السمكرة. عبوة 4 لتر.",
    },
    images: ["/products/autotriz/autotriz-power-cut-701-4l.webp"],
    specs: [
      { label: { en: "SKU", ar: "رقم المنتج" }, value: { en: "AT-PC-701", ar: "AT-PC-701" } },
      { label: { en: "Size", ar: "الحجم" }, value: { en: "4 L", ar: "٤ لتر" } },
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
      en: "Autotriz 3D Matrix Ultra is a professional ceramic coating applied by trained detailers to protect and enhance automotive paint. Installed at our Mesaimeer workshop. 50 ml kit. Full specifications available on request.",
      ar: "Autotriz 3D Matrix Ultra طلاء سيراميك احترافي يُطبّق بواسطة فنيين مدربين لحماية وتعميق طلاء السيارة. يُركّب في ورشتنا بمسيمير. عبوة 50 مل. المواصفات الكاملة متاحة عند الطلب.",
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
      en: "Autotriz 3D Matrix Hybrid is a professional ceramic coating applied by trained detailers to protect and enhance automotive paint. Installed at our Mesaimeer workshop. 50 ml kit. Full specifications available on request.",
      ar: "Autotriz 3D Matrix Hybrid طلاء سيراميك احترافي يُطبّق بواسطة فنيين مدربين لحماية وتعميق طلاء السيارة. يُركّب في ورشتنا بمسيمير. عبوة 50 مل. المواصفات الكاملة متاحة عند الطلب.",
    },
    images: [
      "/products/autotriz/autotriz-3d-matrix-hybrid.webp",
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
      en: "Autotriz PPF Gel — Installation Aid (4L)",
      ar: "Autotriz PPF Gel — مساعد تركيب فيلم الحماية (٤ لتر)",
    },
    shortDesc: {
      en: "Premixed paint protection film installation aid. Thick, viscous gel — no dripping, easy residue cleanup.",
      ar: "جل جاهز لتركيب فيلم حماية الطلاء. كثيف ولزج — لا يقطر، وسهل التنظيف بعد الجفاف.",
    },
    longDesc: {
      en: "AUTOTRIZ PPF Gel is a premixed Paint Protection installation aid designed to support the application of paint protection film. The gel facilitates the ease of application keeping the substrate well moisturized providing the right tack and positioning of the film during installation. This thick and viscous Gel allows the product to be sprayed on the car without dripping off or evaporating quickly. The Gel residues can be easily cleaned after application, even when fully dried.",
      ar: "جل AUTOTRIZ PPF مساعد تركيب مُجهّز مسبقاً لدعم تطبيق فيلم حماية الطلاء. يُسهّل التطبيق بالحفاظ على رطوبة السطح ويوفر الالتصاق والوضعية الصحيحة للفيلم أثناء التركيب. هذا الجل الكثيف واللزج يُرشّ على السيارة دون تقطير أو تبخر سريع. يمكن تنظيف بقاياه بسهولة حتى بعد الجفاف الكامل.",
    },
    images: ["/products/autotriz/autotriz-ppf-gel-4l.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "4 L", ar: "٤ لتر" } },
      { label: { en: "Type", ar: "النوع" }, value: { en: "Premixed installation gel", ar: "جل تركيب جاهز" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
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
    images: ["/products/autotriz/autotriz-revo-ceramic-coating.webp"],
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
    images: ["/products/autotriz/autotriz-leather-and-vinyl.webp"],
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
    images: ["/products/autotriz/autotriz-ion-plus-ceramic-coating.webp"],
    specs: [
      { label: { en: "Size", ar: "الحجم" }, value: { en: "50 ml / 1.7 oz", ar: "٥٠ مل" } },
      { label: { en: "Technology", ar: "التقنية" }, value: { en: "Surface ionized nano ceramic", ar: "سيراميك نانو بتأين سطحي" } },
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Germany", ar: "صُنع في ألمانيا" } },
    ],
    audience: "both",
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
    images: [
      "/products/instafinish/insta-finish-wash-and-wax.webp",
      "/products/instafinish/insta-finish-wash-and-wax-shelf.webp",
    ],
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
    images: [
      "/products/instafinish/insta-finish-premium-blue-guard.webp",
      "/products/instafinish/insta-finish-premium-blue-guard-shelf.webp",
    ],
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
    images: [
      "/products/getsun/getsun-foam-out-engine-degreaser.webp",
      "/products/getsun/getsun-foam-out-close.webp",
    ],
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

  // ───── Sitrett
  {
    slug: "sitrett-mx5-heavy-duty-cleaner",
    brand: "Sitrett",
    category: "heavy-duty",
    name: {
      en: "Sitrett MX5 — Heavy-Duty Stain & Oil Remover",
      ar: "Sitrett MX5 — مزيل بقع وزيوت ثقيل",
    },
    shortDesc: {
      en: "Professional-grade stain, grease and oil remover. Made in Turkey.",
      ar: "مزيل بقع وشحوم وزيوت بدرجة احترافية. صُنع في تركيا.",
    },
    longDesc: {
      en: "Sitrett MX5 is a professional heavy-duty cleaner designed for demanding jobs. Dissolves heavy grease, oil and stubborn stains on engines, wheels, concrete and workshop surfaces.",
      ar: "Sitrett MX5 منظّف احترافي ثقيل لمهام صعبة. يُذيب الشحوم والزيوت الثقيلة والبقع العنيدة من المحركات والعجلات والأسطح.",
    },
    images: [
      "/products/sitrett/sitrett-mx5-heavy-duty-cleaner.webp",
      "/products/sitrett/sitrett-mx5-turkish.webp",
    ],
    specs: [
      { label: { en: "Origin", ar: "المنشأ" }, value: { en: "Made in Turkey", ar: "صُنع في تركيا" } },
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
    ],
    audience: "both",
    highlight: "briller-color",
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
    images: [
      "/products/misc/smart-car-tyre-foam.webp",
      "/products/misc/smart-car-tyre-foam-shelf.webp",
    ],
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
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export const BRANDS: BrandKey[] = [
  "Vertek",
  "Autotriz",
  "Briller",
  "InstaFinish",
  "Getsun",
  "Sitrett",
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

