import { PRODUCTS, type BrandKey, type CategoryKey, type Product } from "./products";
import { DELIVERY, DISCOUNT_ENTRY, DISCOUNT_TOP, formatNumber } from "@/lib/pricing";

// Delivery and discount figures in the copy below come from pricing.ts, the
// rules the cart applies, so the two can never disagree. Western digits in
// both languages, matching the surrounding text.
const n = (value: number) => formatNumber(value, "en");

export type LocalizedText = {
  en: string;
  ar: string;
};

export type LandingFaq = {
  q: LocalizedText;
  a: LocalizedText;
};

export type CategoryLandingData = {
  slug: CategoryKey;
  title: LocalizedText;
  description: LocalizedText;
  keywords: { en: string[]; ar: string[] };
  eyebrow: LocalizedText;
  h1: LocalizedText;
  subtitle: LocalizedText;
  guideTitle: LocalizedText;
  guideParagraphs: { en: string[]; ar: string[] };
  faqs: LandingFaq[];
};

export type BrandSlug =
  | "vtek"
  | "autotriz"
  | "briller"
  | "grizzly"
  | "grunes-auto"
  | "abk"
  | "instafinish"
  | "getsun";

export type BrandLandingData = {
  slug: BrandSlug;
  brandKey: BrandKey;
  /** Additional BrandKey values that belong to this brand page (e.g. Vertek -> VTEK). */
  matchBrandKeys: BrandKey[];
  origin: LocalizedText;
  roleBadge: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  keywords: { en: string[]; ar: string[] };
  eyebrow: LocalizedText;
  h1: LocalizedText;
  subtitle: LocalizedText;
  guideTitle: LocalizedText;
  guideParagraphs: { en: string[]; ar: string[] };
  faqs: LandingFaq[];
};

export const CATEGORY_LANDING_PAGES: CategoryLandingData[] = [
  {
    slug: "film",
    title: {
      en: "PPF & Window Tint Films in Doha, Qatar — VTEK & Grizzly",
      ar: "أفلام حماية الطلاء PPF وتظليل النوافذ في الدوحة، قطر | ABK",
    },
    description: {
      en: "Buy genuine VTEK TPU Paint Protection Film (PPF), Solar Armor nano-ceramic window tint rolls, and Autotriz installation gel in Doha, Qatar. Retail & wholesale.",
      ar: "اشترِ أفلام حماية الطلاء الأصلية VTEK وتظليل النوافذ النانو سيراميك Solar Armor وجل التركيب الألماني Autotriz في الدوحة، قطر. تجزئة وجملة في مسيمير.",
    },
    keywords: {
      en: [
        "PPF roll Qatar",
        "paint protection film Doha",
        "window tint film Qatar",
        "VTEK PPF Qatar",
        "Grizzly PPF Qatar",
        "nano ceramic window tint Doha",
        "PPF installation gel Qatar",
      ],
      ar: [
        "رول افلام حماية قطر",
        "أفلام حماية الطلاء الدوحة",
        "تظليل نانو سيراميك قطر",
        "فيلم حماية VTEK قطر",
        "توريد افلام حماية بالجملة قطر",
      ],
    },
    eyebrow: {
      en: "Paint Protection & Solar Films",
      ar: "أفلام حماية الطلاء والعزل الحراري",
    },
    h1: {
      en: "Paint Protection Film (PPF) & Nano-Ceramic Window Tint in Qatar",
      ar: "أفلام حماية الطلاء (PPF) وتظليل النوافذ النانو سيراميك في قطر",
    },
    subtitle: {
      en: "Genuine VTEK Weather Armor TPU rolls, Solar Armor heat-rejection window films, and Autotriz installation & aftercare solutions — stocked in Mesaimeer, Doha.",
      ar: "رولات أفلام حماية الطلاء VTEK Weather Armor، وأفلام العزل الحراري Solar Armor، ومحلول التركيب والعناية Autotriz — متوفرة في معرضنا بمسيمير، الدوحة.",
    },
    guideTitle: {
      en: "Choosing PPF & Window Tint Films for Qatar's 50°C Climate",
      ar: "كيف تختار أفلام الحماية PPF والعزل الحراري لمناخ قطر القاسي",
    },
    guideParagraphs: {
      en: [
        "In Doha's extreme summer heat (45°C–50°C+) and UV index 11+ sun, low-grade PVC or TPH films can yellow, crack and lose adhesion. ABK Trading & Service stocks Thermoplastic Polyurethane (TPU) films from VTEK (Weather Armor PRO, PRO PLUS, MATTE, PRISM and ULTIMATE) and supplies Grizzly films on trade enquiry. VTEK Weather Armor films have a self-healing top layer and a written VTEK warranty of 5 to 15 years by film, registered on VTEK's NFC e-Warranty.",
        "For cabin heat rejection, VTEK Solar Armor window film rolls (VUE, APEX, and ICONIC) block over 99% of UV radiation and up to 95% of infrared solar heat without metallic signal interference. Qatar's published regulation limits tint film to the rear side doors with a Traffic Department permit, so read our window tinting rules guide before fitting. Looking for turn-key installation? Car owners can also book fixed-price VTEK PPF installation in Doha (starting from QAR 899 front-end and QAR 3,999 full body) directly through our online quote builder.",
      ],
      ar: [
        "في ظل حرارة صيف الدوحة التي تتجاوز 45–50 درجة مئوية ومؤشر الأشعة فوق البنفسجية المرتفع، قد تتعرض الأفلام التجارية الرخيصة (PVC أو TPH) للاصفرار والتشقق وتلف اللاصق. لذلك توفر ABK للتجارة والخدمات أفلام البولي يوريثان الحراري (TPU) من علامة VTEK (Weather Armor PRO وPRO PLUS والمطفي MATTE والملون PRISM وULTIMATE) وتورّد أفلام Grizzly للمراكز عند الطلب. وتتميز أفلام VTEK Weather Armor بطبقة علوية ذاتية الإصلاح وضمان VTEK مكتوب من 5 إلى 15 سنة حسب الفيلم، يُسجَّل في ضمان VTEK الإلكتروني NFC.",
        "وللعزل الحراري، توفر أفلام تظليل النوافذ VTEK Solar Armor (فئات VUE وAPEX وICONIC) عزلاً للأشعة فوق البنفسجية بنسبة تتجاوز 99% وعزلاً للأشعة تحت الحمراء حتى 95% دون التأثير على إشارات الجوال أو الملاحة. وتقصر اللائحة المنشورة في قطر فيلم التظليل على الأبواب الخلفية الجانبية بتصريح من إدارة المرور، فاقرأ دليل قوانين التظليل قبل التركيب. كما يمكن لملاك السيارات في قطر حجز باقات تركيب أفلام VTEK PPF بأسعار ثابتة ومعلنة (تبدأ من 899 ر.ق للواجهة و3,999 ر.ق لكامل السيارة) عبر حاسبة الأسعار الفورية.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Can I buy PPF and window tint rolls directly, or book installation in Doha?",
          ar: "هل يمكنني شراء رولات PPF والتظليل مباشرة أم حجز التركيب في الدوحة؟",
        },
        a: {
          en: "Both. Detailing studios, tint shops, and car owners can buy master rolls (1.52m × 15m) and Autotriz PPF installation gel/refresh directly from our Mesaimeer showroom or via WhatsApp (+974 3083 8355). Car owners who want turnkey fitting can book VTEK PPF installation at fixed published prices starting from QAR 899.",
          ar: "كلاهما متاح. يمكن لمراكز التلميع ومحلات التظليل والأفراد شراء الرولات الرئيسية (1.52م × 15م) وجل التركيب مباشرة من معرضنا في مسيمير أو عبر واتساب (+974 3083 8355). كما يمكن لملاك السيارات حجز تركيب VTEK PPF بأسعار ثابتة تبدأ من 899 ر.ق.",
        },
      },
      {
        q: {
          en: "How are PPF and window tint master rolls priced in Qatar?",
          ar: "كيف تُسعَّر رولات حماية الطلاء PPF وتظليل النوافذ الكاملة في قطر؟",
        },
        a: {
          en: "VTEK Weather Armor TPU master rolls (PRO, PRO PLUS, MATTE, PRISM, ULTIMATE), Solar Armor window tint rolls (VUE, APEX, ICONIC), and Grizzly film rolls are quoted directly on WhatsApp (+974 3083 8355) with tiered trade pricing for detailing studios and tint shops.",
          ar: "تُسعَّر رولات VTEK Weather Armor وأفلام التظليل Solar Armor ورولات Grizzly مباشرة عبر واتساب (+974 3083 8355) مع خصومات تجارية مخصصة لمراكز التلميع ومحلات التظليل حسب الكمية.",
        },
      },
      {
        q: {
          en: "Do you stock PPF slip solution and aftercare maintenance sprays in Doha?",
          ar: "هل يتوفر لديكم جل تركيب PPF وبخاخات العناية بالأفلام في الدوحة؟",
        },
        a: {
          en: "Yes. We stock German-engineered Autotriz PPF Gel in 4L (QAR 150) and 20L workshop drums (QAR 500) to prevent premature adhesive tacking in warm bays, plus Autotriz PPF Refresh (1L at QAR 130) and masking tape (from QAR 2.5).",
          ar: "نعم، نوفر جل تركيب الأفلام الألماني Autotriz PPF Gel بعبوة 4 لتر (150 ر.ق) وعبوة الورش 20 لتر (500 ر.ق)، بالإضافة إلى ملمع الصيانة Autotriz PPF Refresh بحجم 1 لتر (130 ر.ق) وشريط الحماية (من 2.5 ر.ق).",
        },
      },
    ],
  },
  {
    slug: "ceramic",
    title: {
      en: "Nano Ceramic Coating Products in Doha, Qatar — Autotriz 9H",
      ar: "طلاءات النانو سيراميك 9H للسيارات في الدوحة، قطر | Autotriz",
    },
    description: {
      en: "Shop professional 9H nano ceramic coatings in Doha, Qatar. German Autotriz 3D Matrix Ultra, Hybrid, REVO +15 & ION+ kits from QAR 250. Fast Qatar delivery.",
      ar: "تسوّق طلاءات النانو سيراميك الاحترافية 9H في الدوحة، قطر. أطقم Autotriz الألمانية 3D Matrix Ultra وHybrid وREVO +15 ابتداءً من 250 ر.ق مع توصيل سريع.",
    },
    keywords: {
      en: [
        "ceramic coating products Qatar",
        "nano ceramic coating Doha",
        "buy ceramic coating Qatar",
        "Autotriz ceramic coating Qatar",
        "9H ceramic coating kit Doha",
        "car ceramic coating supplier Qatar",
      ],
      ar: [
        "منتجات نانو سيراميك قطر",
        "طلاء سيراميكي للسيارات الدوحة",
        "شراء نانو سيراميك قطر",
        "سيراميك اوتوتريز الالماني قطر",
        "حماية نانو سيراميك 9H قطر",
      ],
    },
    eyebrow: {
      en: "German Surface Protection",
      ar: "حماية الأسطح بتقنية ألمانية",
    },
    h1: {
      en: "Professional Nano Ceramic Coatings in Doha, Qatar",
      ar: "طلاءات النانو سيراميك الاحترافية للسيارات في الدوحة، قطر",
    },
    subtitle: {
      en: "Authentic German Autotriz 9H polysilazane & SiO2 ceramic coating kits engineered to shield clearcoat against Qatar's UV radiation, hard tap-water mineral rings, and chemical oxidation.",
      ar: "أطقم النانو سيراميك الألمانية الأصلية من Autotriz بصلابة 9H لحماية طلاء السيارة من الأشعة فوق البنفسجية القوية في قطر وبقع المياه الكلسية والأكسدة.",
    },
    guideTitle: {
      en: "Why Polysilazane & 3D Matrix Ceramic Coatings Outperform in Doha",
      ar: "لماذا تتفوق طلاءات النانو سيراميك الألمانية Autotriz في أجواء قطر",
    },
    guideParagraphs: {
      en: [
        "Qatar's combination of intense UV radiation, coastal humidity in Lusail and West Bay, and mineral-heavy desalinated tap water rapidly degrades ordinary waxes and consumer sealants. Autotriz Germany formulates professional-grade 3D Matrix polysilazane and high-solids SiO2 coatings that bond covalently with automotive clearcoat, creating a permanent glass-like barrier with contact angles exceeding 110°.",
        "Every Autotriz ceramic kit stocked at our Mesaimeer showroom is fresh, climate-stored inventory: choose REVO +15 or ION+ +15 (50 ml kits at QAR 250 each) for rapid single-layer hydrophobic gloss, or step up to 3D Matrix Hybrid and 3D Matrix Ultra (50 ml kits at QAR 280 each) for maximum chemical resistance and multi-year durability on daily-driven SUVs and luxury sedans.",
      ],
      ar: [
        "يؤدي اجتماع الأشعة فوق البنفسجية الحارقة مع الرطوبة الساحلية في لوسيل والخليج الغربي والمياه المحلاة الغنية بالأملاح إلى تآكل الشموع العادية خلال أسابيع قليلة. صُممت طلاءات Autotriz الألمانية بتقنية مصفوفة البوليسيلازان ثلاثية الأبعاد (3D Matrix) لترتبط كيميائياً مع طبقة اللكر الشفافة وتكوّن درعاً زجاجياً فائق النعومة بزاوية طرد للمياه تتجاوز 110 درجات.",
        "جميع أطقم السيراميك في معرضنا بمسيمير مخزنة في بيئة مبردة لضمان أعلى فعالية: اختر طقم REVO +15 أو ION+ +15 (عبوة 50 مل بسعر 250 ر.ق) للمعان فوري وعزل مائي فائق، أو طقم 3D Matrix Hybrid و3D Matrix Ultra (عبوة 50 مل بسعر 280 ر.ق) لأقصى صلابة 9H ومقاومة كيميائية تدوم لسنوات.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much do Autotriz nano ceramic coating kits cost in Qatar?",
          ar: "كم تبلغ أسعار أطقم النانو سيراميك Autotriz في قطر؟",
        },
        a: {
          en: "At ABK Trading in Doha, 50 ml Autotriz REVO +15 and ION+ +15 kits retail for QAR 250, while flagship Autotriz 3D Matrix Ultra and 3D Matrix Hybrid 50 ml kits are QAR 280. A single 50 ml bottle covers 1 to 2 full vehicles depending on body size and layer count.",
          ar: "تتوفر أطقم Autotriz REVO +15 وION+ +15 (حجم 50 مل) بسعر 250 ر.ق، بينما تتوفر أطقم الفئة العليا Autotriz 3D Matrix Ultra و3D Matrix Hybrid (حجم 50 مل) بسعر 280 ر.ق. تكفي العبوة الواحدة (50 مل) لتطبيق سيارة إلى سيارتين حسب الحجم وعدد الطبقات.",
        },
      },
      {
        q: {
          en: "Can ceramic coating be combined with Paint Protection Film (PPF)?",
          ar: "هل يمكن دمج النانو سيراميك مع أفلام حماية الطلاء PPF؟",
        },
        a: {
          en: "Yes, with the right product on each surface. Apply Autotriz 3D Matrix, REVO +15, or ION+ to unfilmed painted panels (never underneath PPF, as coatings reduce film adhesion). On PPF-wrapped panels, VTEK recommends PPF-specific care rather than standard silicone ceramics — we stock Autotriz PPF Refresh (1L: QAR 130) and Autotriz Nano Rich Foam Shampoo (20L: QAR 450) specifically for PPF topcoats.",
          ar: "نعم، مع استخدام المنتج المخصص لكل سطح. يُطبَّق سيراميك Autotriz (3D Matrix أو REVO +15 أو ION+) على الألواح المطلية غير المغطاة بالفيلم (ولا يُوضع أبداً تحت الفيلم حتى لا يُضعف التصاقه). أما الأسطح المحمية بفيلم PPF فتنصح VTEK بالعناية بها بمنتجات مخصصة للأفلام مثل Autotriz PPF Refresh (1 لتر: 130 ر.ق) وشامبو Autotriz Nano Rich Foam.",
        },
      },
      {
        q: {
          en: "Do you supply ceramic coatings wholesale to detailing studios in Qatar?",
          ar: "هل توفرون طلاءات النانو سيراميك بالجملة لمراكز التلميع في قطر؟",
        },
        a: {
          en: "Yes. ABK is the authorized Qatar distributor for Autotriz Germany. Registered detailing studios and workshops qualify for tiered wholesale pricing on master cartons and full coating lines via WhatsApp (+974 3083 8355).",
          ar: "نعم، شركة ABK هي الموزع المعتمد لعلامة Autotriz الألمانية في قطر. تحصل مراكز التلميع والعناية بالسيارات على أسعار جملة تنافسية عند طلب الكراتين عبر واتساب (+974 3083 8355).",
        },
      },
    ],
  },
  {
    slug: "shampoo",
    title: {
      en: "Car Wash Shampoos & 20L Snow Foam in Doha, Qatar | ABK",
      ar: "شامبو غسيل السيارات ورغوة الثلج 20 لتر في الدوحة، قطر | ABK",
    },
    description: {
      en: "Buy pH-balanced car wash shampoos & 20L commercial snow foam drums in Doha, Qatar: Briller Wash & Wax (QAR 350), Autotriz Rich Foam (QAR 450) & Insta Finish (QAR 45).",
      ar: "اشترِ شامبو غسيل السيارات وبراميل الرغوة الغنية 20 لتر في الدوحة، قطر: Briller Wash & Wax (350 ر.ق)، Autotriz Rich Foam (450 ر.ق) وInsta Finish (45 ر.ق).",
    },
    keywords: {
      en: [
        "car shampoo Qatar",
        "snow foam shampoo Doha",
        "car wash chemicals supplier Qatar",
        "20L car shampoo drum Qatar",
        "wash and wax shampoo Qatar",
        "pH neutral car shampoo Doha",
      ],
      ar: [
        "شامبو سيارات قطر",
        "شامبو رغوة للسيارات الدوحة",
        "مواد غسيل سيارات بالجملة قطر",
        "شامبو وغسيل وشمع قطر",
        "برميل شامبو سيارات 20 لتر قطر",
      ],
    },
    eyebrow: {
      en: "Safe Wash & Commercial Foam",
      ar: "غسيل آمن ورغوة كثيفة للمغاسل والأفراد",
    },
    h1: {
      en: "Car Wash Shampoos, Snow Foams & 20L Commercial Drums in Qatar",
      ar: "شامبوهات غسيل السيارات، الرغوة الكثيفة وعبوات الورش 20 لتر في قطر",
    },
    subtitle: {
      en: "High-lubricity shampoos and thick snow foams that lift abrasive desert grit safely off PPF, ceramic coatings, and clearcoat — available in 473 ml retail bottles and 20L drums.",
      ar: "شامبوهات عالية التزليق ورغوة ثلجية كثيفة تزيل الرمال والأتربة بأمان تام عن أفلام الحماية PPF والنانو سيراميك والطلاء — متوفرة بعبوات 473 مل للأفراد وبراميل 20 لتر للمغاسل.",
    },
    guideTitle: {
      en: "Safe Sand Removal: Choosing the Right Car Shampoo in Qatar",
      ar: "إزالة الرمال بأمان: كيف تختار شامبو غسيل السيارات المناسب في قطر",
    },
    guideParagraphs: {
      en: [
        "More swirl marks are inflicted during a 15-minute wash than in months of highway driving — especially in Qatar, where fine silica sand settles on horizontal panels every day. Using dish soap or harsh alkaline degreasers strips wax protection and dries out rubber window seals. A high-lubricity foam pre-wash encapsulates sand grains and floats them off the paint before a wash mitt ever touches the surface.",
        "For commercial carwashes, detailing studios, and home foam-cannon enthusiasts with multiple vehicles, our 20-litre concentrate drums deliver low cost-per-wash in Doha: Briller Wash & Wax (20L drum on special offer at QAR 350, was QAR 400; 1:50 dilution in blue, red, or green) and Autotriz Nano Rich Foam Shampoo (20L drum on special offer at QAR 450, was QAR 500; 1:80 dilution for PPF and ceramic-coated cars). For single-car home washing, USA-made Insta Finish Wash & Wax (473 ml concentrate: QAR 45) mixes cleanly with 20 litres of bucket water.",
      ],
      ar: [
        "تحدث معظم دوائر الخدش (Swirl Marks) أثناء عملية الغسيل الخاطئة بسبب ذرات الرمل الناعمة المتراكمة يومياً على هيكل السيارة في قطر. استخدام المنظفات المنزلية القلوية يؤدي إلى بهتان الطلاء وجفاف جلد النوافذ. الحل الاحترافي يبدأ برغوة كثيفة عالية التزليق تفكك ذرات الرمل وتزيلها قبل ملامسة إسفنجة الغسيل للطلاء.",
        "للمغاسل التجارية ومراكز التلميع وأصحاب المنازل الذين يستخدمون مدفع الرغوة (Foam Gun)، نوفر براميل مركزة سعة 20 لتر بأفضل قيمة اقتصادية في الدوحة: شامبو وغسيل بالشمع Briller الكندي (20 لتر بسعر عرض 350 ر.ق بدلاً من 400 ر.ق؛ تخفيف 1:50)، وشامبو الرغوة النانو الألماني Autotriz Nano Rich Foam (20 لتر بسعر عرض 450 ر.ق بدلاً من 500 ر.ق؛ تخفيف 1:80)، إلى جانب عبوة الأفراد المركزة Insta Finish Wash & Wax الأمريكية (473 مل بسعر 45 ر.ق).",
      ],
    },
    faqs: [
      {
        q: {
          en: "Are your car shampoos safe for PPF and ceramic-coated cars?",
          ar: "هل شامبوهات السيارات لديكم آمنة على أفلام الحماية PPF والنانو سيراميك؟",
        },
        a: {
          en: "Yes. Autotriz Nano Rich Foam Shampoo (1:80 concentrate) is specifically formulated to clean and revitalize PPF topcoats and ceramic coatings, while Briller Wash & Wax and Insta Finish Wash & Wax leave a slick water-beading gloss on painted bodywork.",
          ar: "نعم، صُمم شامبو Autotriz Nano Rich Foam (تركيز 1:80) خصيصاً لتنظيف وتجديد الطبقة العلوية لأفلام الحماية PPF وطلاءات السيراميك، بينما يمنح شامبو Briller Wash & Wax وInsta Finish Wash & Wax طبقة لمعان طاردة للماء.",
        },
      },
      {
        q: {
          en: "Can individual car owners buy the 20-litre shampoo drums in Doha?",
          ar: "هل يمكن للأفراد شراء براميل الشامبو سعة 20 لتر في الدوحة؟",
        },
        a: {
          en: "Absolutely! Both retail customers (such as villas washing multiple family SUVs) and commercial car washes can order 20L drums of Briller Wash & Wax (QAR 350) and Autotriz Nano Rich Foam (QAR 450) online with delivery across Qatar.",
          ar: "بالتأكيد! يمكن للأفراد (أصحاب الفلل الذين يغسلون عدة سيارات في المنزل) وكذلك المغاسل التجارية شراء براميل 20 لتر مباشرة عبر الموقع أو واتساب مع التوصيل في قطر.",
        },
      },
      {
        q: {
          en: "Do you sell a high-pressure snow foam cannon in Qatar?",
          ar: "هل يتوفر لديكم مدفع رغوة عالي الضغط (Foam Gun) في قطر؟",
        },
        a: {
          en: "Yes. We stock the heavy-duty brass-manifold Autotriz High-Pressure Foam Gun (QAR 180) in our Towels & Tools category, which pairs directly with Autotriz Rich Foam and Briller shampoos.",
          ar: "نعم، نوفر مدفع الرغوة الاحترافي عالي الضغط Autotriz Foam Gun برأس نحاسي متين بسعر 180 ر.ق، ويعمل بكفاءة مثالية مع شامبوهات الرغوة الكثيفة.",
        },
      },
    ],
  },
  {
    slug: "polish",
    title: {
      en: "Car Polishing Compounds & Foam Pads in Doha, Qatar | ABK",
      ar: "مواد تلميع السيارات ووسائد البوليش في الدوحة، قطر | ABK",
    },
    description: {
      en: "Shop German Autotriz polishing compounds (from QAR 130), 4L 1-step polish, 8\" wool pad (QAR 40) & GrünesAuto 6-inch DA/Rotary foam pads (QAR 28–30) in Doha.",
      ar: "تسوّق مركبات تلميع السيارات الألمانية Autotriz (من 130 ر.ق) ووسادة الصوف 8 إنش (40 ر.ق) وإسفنجات البوليش GrünesAuto مقاس 6 إنش (28–30 ر.ق) في الدوحة.",
    },
    keywords: {
      en: [
        "car polish Qatar",
        "polishing compound Doha",
        "paint correction supplies Qatar",
        "Autotriz polish Qatar",
        "polishing pads Doha",
        "one step polish Qatar",
        "scratch remover car Qatar",
      ],
      ar: [
        "ملمع سيارات قطر",
        "كومباوند تلميع السيارات الدوحة",
        "اسفنج تلميع السيارات قطر",
        "معجون ازالة خدوش السيارة قطر",
        "ادوات بوليش السيارات الدوحة",
      ],
    },
    eyebrow: {
      en: "Paint Correction & Finishing",
      ar: "تصحيح الطلاء وإزالة الخدوش",
    },
    h1: {
      en: "Car Polishing Compounds, One-Step Polishes & German Foam Pads in Qatar",
      ar: "كومباوند تلميع السيارات، ملمعات الخطوة الواحدة ووسائد البوليش الألمانية في قطر",
    },
    subtitle: {
      en: "Low-dust diminishing abrasive compounds from Autotriz Germany paired with German-engineered GrünesAuto 6-inch DA and Rotary foam pads — built for swirl-free correction.",
      ar: "مركبات تلميع ألمانية منخفضة الغبار من Autotriz مع وسائد الإسفنج الألمانية GrünesAuto مقاس 6 إنش لأجهزة التلميع المدارية والدوارة — لنتائج مرآة خالية من الدوائر.",
    },
    guideTitle: {
      en: "Multi-Stage Paint Correction vs. One-Step Polishing for Gulf Clearcoats",
      ar: "الفرق بين تصحيح الطلاء متعدد المراحل وتلميع الخطوة الواحدة",
    },
    guideParagraphs: {
      en: [
        "Sandstorms and automatic brush washes leave deep P1500–P2000 grit scratches and oxidation haze across clearcoat. To restore optical clarity before applying PPF or a 9H ceramic coating, match your abrasive cut to the defect depth: start with Autotriz Heavy Cut 901 (1L: QAR 130), Extreme Cut 801 (1L: QAR 130), or Power Cut 701 2-in-1 compound (4L: QAR 280) on an Autotriz 8-Inch Single-Sided Wool Pad (QAR 40) or GrünesAuto Step 1 Cutting Pad (DA: QAR 30 | Rotary: QAR 28), then refine to a hologram-free mirror finish with Autotriz Ultimate Polish 302 (1L: QAR 135) on a Step 3 Finishing Pad.",
        "When turnaround speed matters for daily drivers or pre-sale reconditioning, Autotriz One Step Finish (4L workshop jug: QAR 265) combines moderate swirl removal and deep gloss finishing in a single pass by hand, DA, or rotary polisher.",
      ],
      ar: [
        "تتسبب العواصف الرملية والغسيل الآلي بالفرش في خدوش عميقة وبهتان في طبقة اللكر. لاستعادة صفاء الطلاء قبل تركيب أفلام الحماية PPF أو تطبيق النانو سيراميك، اختر درجة القطع المناسبة: ابدأ بكومباوند القطع القوي Autotriz Heavy Cut 901 (حجم 1 لتر: 130 ر.ق) أو Extreme Cut 801 (حجم 1 لتر: 130 ر.ق) أو Power Cut 701 (حجم 4 لتر: 280 ر.ق) مع وسادة الصوف Autotriz مقاس 8 إنش (40 ر.ق) أو إسفنجة القطع GrünesAuto Step 1 (لأجهزة DA بسعر 30 ر.ق وللروتاري 28 ر.ق)، ثم أنهِ العمل بلمعان المرآة باستخدام Autotriz Ultimate Polish 302 (135 ر.ق) مع إسفنجة التنعيم Step 3.",
        "أما عند الرغبة في إنجاز سريع يجمع بين إزالة الدوامات المتوسطة واللمعان العميق في خطوة واحدة، فإن ملمع الورش الاقتصادي Autotriz One Step Finish بحجم 4 لتر (265 ر.ق) يمنح نتائج احترافية يدوياً أو بالماكينة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Which polishing pad should I choose: DA (Dual Action) or Rotary?",
          ar: "أي وسادة تلميع أختار: المدارية (DA) أم الدوارة (Rotary)؟",
        },
        a: {
          en: "We stock German-engineered GrünesAuto 6-inch foam pads across Step 1 (Cutting), Step 2 (Medium Polish), and Step 3 (Finishing): Rotary pads are QAR 28 each for fast defect removal on hard clearcoats, and center-vented DA pads are QAR 30 each for cooler orbital temperatures and zero-hologram finishing.",
          ar: "نوفر وسائد الإسفنج الألمانية GrünesAuto مقاس 6 إنش للمراحل الثلاث (الخطوة 1 قطع، الخطوة 2 متوسط، الخطوة 3 تنعيم): وسائد Rotary بسعر 28 ر.ق للقطع السريع، ووسائد DA المزودة بفتحة تبريد بسعر 30 ر.ق لتشطيب خالٍ من الهولوجرام.",
        },
      },
      {
        q: {
          en: "What is the best one-step car polish in stock in Doha?",
          ar: "ما هو أفضل ملمع سيارات بخطوة واحدة متوفر في الدوحة؟",
        },
        a: {
          en: "Autotriz One Step Finish (4L jug for QAR 265) removes light-to-moderate swirls while leaving a high-gloss finish in one step, and Autotriz Power Cut 701 (4L jug for QAR 280) offers a stronger 2-in-1 cut-and-gloss pass for harder clearcoats.",
          ar: "يزيل Autotriz One Step Finish (عبوة 4 لتر بسعر 265 ر.ق) الدوامات الخفيفة والمتوسطة مع لمعان عالٍ في خطوة واحدة، بينما يمنح Autotriz Power Cut 701 (عبوة 4 لتر بسعر 280 ر.ق) قوة قطع ولمعان 2 في 1 للطلاء القاسي.",
        },
      },
      {
        q: {
          en: "Are Autotriz compounds body-shop safe and silicone-free?",
          ar: "هل مركبات التلميع Autotriz خالية من السيليكون وآمنة قبل النانو سيراميك؟",
        },
        a: {
          en: "Yes. Autotriz Heavy Cut 901 (QAR 130), Extreme Cut 801 (QAR 130), Power Cut 701 (QAR 280), and Ultimate Polish 302 (QAR 135) are silicone-free and body-shop safe, making them ideal for paint prep prior to ceramic coating or PPF installation.",
          ar: "نعم، مركبات Autotriz (901 و801 و701 و302) خالية من السيليكون وآمنة لورش الصبغ، مما يجعلها مثالية لتجهيز الطلاء قبل النانو سيراميك أو تركيب PPF.",
        },
      },
    ],
  },
  {
    slug: "dressing",
    title: {
      en: "Car Waxes, Plastic Restorers & Trim Dressings in Doha, Qatar",
      ar: "شمع السيارات، مجددات البلاستيك والفيبر في الدوحة، قطر | ABK",
    },
    description: {
      en: "Shop Insta Finish spray wax & dressings (QAR 45), 20L Briller Quick Dressing (QAR 450) & French ABK Rejuvenate plastic restorer (from QAR 50) in Doha, Qatar.",
      ar: "تسوّق شمع وملمعات Insta Finish الأمريكية (45 ر.ق) ومجدد البلاستيك الفرنسي ABK Rejuvenate (ابتداءً من 50 ر.ق) وBriller سعة 20 لتر في الدوحة، قطر.",
    },
    keywords: {
      en: [
        "plastic restorer car Qatar",
        "car spray wax Doha",
        "trim dressing car Qatar",
        "ABK Rejuvenate plastic restorer",
        "Insta Finish Spray Wax Qatar",
        "Insta Finish Blue Guard Doha",
      ],
      ar: [
        "مجدد بلاستيك السيارات قطر",
        "شمع بخاخ للسيارات الدوحة",
        "تلميع فيبر السيارة قطر",
        "واكس سيارات قطر",
        "ملمع طبلون وبلاستيك قطر",
      ],
    },
    eyebrow: {
      en: "Gloss Waxes & Trim Restoration",
      ar: "الشموع الفاخرة وتجديد البلاستيك والربل",
    },
    h1: {
      en: "Car Waxes, Spray Sealants & Exterior Plastic Restorers in Qatar",
      ar: "شمع السيارات، ملمعات الأسطح ومجدد البلاستيك الخارجي في قطر",
    },
    subtitle: {
      en: "Restore sun-bleached SUV fenders and bumpers with French-made ABK Rejuvenate, or finish paintwork and trim with USA-made Insta Finish Spray Wax, Blue Guard, and Dress All.",
      ar: "استعد اللون الأصلي للصدامات والرفارف الباهتة من الشمس مع ABK Rejuvenate الفرنسي، وأنهِ طلاء سيارتك وديكوراتها بشمع وملمعات Insta Finish الأمريكية.",
    },
    guideTitle: {
      en: "Restoring Sun-Bleached Trim & Boosting Paint Gloss in Qatar",
      ar: "كيف تعالج بهتان البلاستيك الخارجي وتمنح سيارتك لمعاناً عميقاً في قطر",
    },
    guideParagraphs: {
      en: [
        "Unpainted black plastic bumpers, wheel-arch flares, cowl panels, and running boards on SUVs like the Land Cruiser, Patrol, Wrangler, and Prado chalk to a dull grey under Doha's intense UV exposure. French-formulated ABK Rejuvenate Plastic Restorer restores faded exterior and interior plastics and rubber with up to 6 months of durable protection (supplied with 2 sponges and 1 microfibre cloth). Available in 60 ml (QAR 50), 250 ml (QAR 180), 350 ml (QAR 220), and 500 ml workshop bottles (QAR 280).",
        "For rapid post-wash paint gloss and trim conditioning, USA-made Insta Finish 473 ml bottles (QAR 45 each) cover every finish preference: Insta Finish Spray Wax for wet-shine paint protection, Insta Finish Premium Blue Guard for a glossy interior/exterior dressing, and Insta Finish Premium Dress All for a clean, non-greasy matte finish. High-volume detailing bays and carwashes also stock Briller Quick Dressing in 20L commercial drums (QAR 450, 1:1 dilution) for satin interior and exterior trim care.",
      ],
      ar: [
        "تتعرض الأجزاء البلاستيكية السوداء غير المطلية (مثل الصدامات، أقواس العجلات، والدعاسات) في سيارات الدفع الرباعي للبهتان والتحول إلى اللون الرمادي بسبب شمس الدوحة الحارقة. يعيد مجدد البلاستيك الفرنسي ABK Rejuvenate الأجزاء الباهتة إلى لونها الغني مع حماية تدوم حتى 6 أشهر (يأتي مع إسفنجتين وقطعة مايكروفايبر). متوفر بأحجام 60 مل (50 ر.ق)، 250 مل (180 ر.ق)، 350 مل (220 ر.ق)، و500 مل للورش (280 ر.ق).",
        "ولإضفاء لمعان سريع بعد الغسيل والعناية بالديكورات، تتوفر منتجات Insta Finish الأمريكية بحجم 473 مل (45 ر.ق للعبوة): شمع البخاخ Spray Wax للطلاء، وملمع Blue Guard للمظهر اللامع، وملمع Dress All للمظهر المطفي غير الدهني، إلى جانب برميل الورش Briller Quick Dressing بسعة 20 لتر (450 ر.ق، تخفيف 1:1) بلمسة ساتان عطرية.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How long does ABK Rejuvenate Plastic Restorer last in Qatar's heat?",
          ar: "كم يدوم مفعول مجدد البلاستيك ABK Rejuvenate في حرارة قطر؟",
        },
        a: {
          en: "ABK Rejuvenate (Made in France) bonds to clean, dry plastic trims and delivers up to 6 months of durable gloss and UV protection when allowed its recommended 6–7 hour curing window.",
          ar: "يرتبط ABK Rejuvenate (صناعة فرنسية) بالبلاستيك النظيف والجاف ليمنح لمعاناً وحماية تدوم حتى 6 أشهر عند منحه فترة التماسك الموصى بها (6 إلى 7 ساعات).",
        },
      },
      {
        q: {
          en: "What sizes of ABK Rejuvenate are in stock in Doha?",
          ar: "ما هي الأحجام المتوفرة من ABK Rejuvenate في الدوحة؟",
        },
        a: {
          en: "We stock four sizes at our Mesaimeer showroom: 60 ml bottle (QAR 50), 250 ml (QAR 180), 350 ml (QAR 220), and 500 ml professional bottle (QAR 280), including 2 applicator sponges and 1 premium microfibre cloth.",
          ar: "يتوفر بأربعة أحجام في معرضنا بمسيمير: عبوة 60 مل (50 ر.ق)، عبوة 250 مل (180 ر.ق)، عبوة 350 مل (220 ر.ق)، وعبوة المحترفين 500 مل (280 ر.ق)، مع إسفنجتين ومنشفة مايكروفايبر.",
        },
      },
      {
        q: {
          en: "Do you sell bulk trim dressing for car washes in Qatar?",
          ar: "هل توفرون ملمع بلاستيك بالجملة لمغاسل السيارات في قطر؟",
        },
        a: {
          en: "Yes. Briller Quick Dressing is stocked in 20-litre commercial drums at QAR 450 (1:1 dilution), delivering a clean, perfume-scented satin sheen across exterior plastics, leather, and interior vinyl.",
          ar: "نعم، يتوفر Briller Quick Dressing ببرميل تجاري سعة 20 لتر بسعر 450 ر.ق (تخفيف 1:1)، ويمنح لمعة ساتان نظيفة برائحة عطرية للبلاستيك الخارجي والجلد والديكورات الداخلية.",
        },
      },
    ],
  },
  {
    slug: "tyre",
    title: {
      en: "Wheel Cleaners & Tyre Shine in Doha, Qatar — Retail & 20L",
      ar: "منظف الجنوط وملمع الإطارات في الدوحة، قطر — تجزئة و20 لتر",
    },
    description: {
      en: "Shop alloy wheel cleaners, non-sling tyre shine, tyre foam (QAR 15) & contoured sponges (QAR 8) in Doha, Qatar. Briller 20L drums, Autotriz, Getsun & Smart Car.",
      ar: "تسوّق منظفات الجنوط وملمعات ورغوة الإطارات (15 ر.ق) وإسفنجات التلميع (8 ر.ق) في الدوحة، قطر. براميل 20 لتر للمغاسل من Briller وAutotriz وعبوات فردية.",
    },
    keywords: {
      en: [
        "tyre shine Qatar",
        "wheel cleaner Doha",
        "alloy rim cleaner Qatar",
        "tyre foam Qatar",
        "20L tyre shine drum Doha",
        "brake dust remover Qatar",
      ],
      ar: [
        "ملمع تواير قطر",
        "منظف جنوط السيارات الدوحة",
        "رغوة تلميع الاطارات قطر",
        "ملمع كفرات بدون تطاير قطر",
        "مواد تلميع الاطارات بالجملة قطر",
      ],
    },
    eyebrow: {
      en: "Brake Dust Removal & Tyre Care",
      ar: "إزالة غبار الفرامل وتلميع الإطارات",
    },
    h1: {
      en: "Alloy Wheel Cleaners, Tyre Shine & Rim Care in Doha, Qatar",
      ar: "منظفات الجنوط، ملمعات الإطارات ورغوة الكفرات في الدوحة، قطر",
    },
    subtitle: {
      en: "Dissolve baked-on brake dust from alloy wheels and protect tyre sidewalls against UV cracking and browning — available in QAR 15 aerosols and 20L commercial drums.",
      ar: "تخلص من غبار الفرامل العنيد عن الجنوط واحمِ جدران الإطارات من التشقق والبهتان الناتج عن حرارة الأسفلت — متوفرة ببخاخات فردية (15 ر.ق) وبراميل 20 لتر للمغاسل.",
    },
    guideTitle: {
      en: "Preventing Tyre Browning & Brake Dust Pitting on Qatar Roads",
      ar: "حماية الإطارات من الاسمرار وتآكل الجنوط على طرقات قطر",
    },
    guideParagraphs: {
      en: [
        "Heavy braking in high ambient temperatures bakes metallic brake dust onto painted and chrome alloy wheels, while asphalt temperatures above 65°C dry out tyre sidewalls. Dedicated wheel cleaners like Briller Alloy Rim Cleaner (20L drum on special offer at QAR 300, was QAR 350; 1:4 dilution) and Autotriz Hyper Wheel Cleaner (20L drum: QAR 400; 1:1 dilution) lift brake dust and road grime safely from clear-coated and chrome rims.",
        "After rinsing and drying the tyre sidewall, apply Briller Quick Tyre Shine (20L aqua-based drum: QAR 280) with our contoured Tyre Polish Applicator Sponge (QAR 8), or use convenient aerosol sprays — Getsun Tyre Shine (500 ml: QAR 15) and Smart Car Tyre Foam (500/650 ml: QAR 15) — for rapid deep-black gloss.",
      ],
      ar: [
        "يؤدي الكبح المتكرر في درجات الحرارة المرتفعة إلى التصاق غبار الفرامل المعدني بالجنوط، بينما تتسبب حرارة الأسفلت العالية في جفاف جدران الإطارات. تعمل المنظفات المتخصصة مثل منظف الجنوط الكندي Briller Alloy Rim Cleaner (برميل 20 لتر بسعر عرض 300 ر.ق بدلاً من 350 ر.ق؛ تخفيف 1:4) والألماني Autotriz Hyper Wheel Cleaner (برميل 20 لتر: 400 ر.ق؛ تخفيف 1:1) على إذابة غبار الفرامل بأمان على الجنوط المطلية والكروم.",
        "وبعد تنظيف وتجفيف الإطار، استخدم ملمع الإطارات المائي Briller Quick Tyre Shine (برميل 20 لتر: 280 ر.ق) مع إسفنجة تلميع الإطارات المنحنية (8 ر.ق)، أو البخاخات السريعة Getsun Tyre Shine (بسعر 15 ر.ق) ورغوة Smart Car Tyre Foam (بسعر 15 ر.ق) للحصول على لمعة سوداء عميقة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How do I stop tyre shine from slinging onto my car doors?",
          ar: "كيف أمنع تطاير ملمع الإطارات على أبواب السيارة؟",
        },
        a: {
          en: "First clean the rubber sidewall thoroughly so the dressing bonds to bare rubber rather than old dirt. Apply a thin, even coat using our curved Tyre Polish Applicator Sponge (QAR 8) and let it cure for 10 minutes before driving.",
          ar: "نظف جدار الإطار جيداً أولاً حتى يلتصق الملمع بالمطاط مباشرة وليس فوق الأتربة القديمة، ثم وزع طبقة متساوية باستخدام إسفنجة تلميع الإطارات المنحنية (8 ر.ق) واتركها تجف لمدة 10 دقائق قبل القيادة.",
        },
      },
      {
        q: {
          en: "What are the prices of 20L wheel cleaner and tyre shine drums in Doha?",
          ar: "كم تبلغ أسعار براميل منظف الجنوط وملمع الإطارات 20 لتر في الدوحة؟",
        },
        a: {
          en: "Briller Quick Tyre Shine (20L) is QAR 280, Briller Alloy Rim Cleaner (20L) is QAR 300 (special offer, was QAR 350), and German Autotriz Hyper Wheel Cleaner (20L) is QAR 400 — plus Getsun Tyre Shine and Smart Car Tyre Foam aerosols at QAR 15 each.",
          ar: "يتوفر برميل ملمع الإطارات Briller Quick Tyre Shine (20 لتر) بسعر 280 ر.ق، وبرميل منظف الجنوط Briller Alloy Rim Cleaner (20 لتر) بسعر عرض 300 ر.ق (بدلاً من 350 ر.ق)، وبرميل Autotriz Hyper Wheel Cleaner الألماني (20 لتر) بسعر 400 ر.ق، بالإضافة إلى بخاخات الإطارات الفردية بسعر 15 ر.ق.",
        },
      },
      {
        q: {
          en: "Are your wheel cleaners safe for painted and chrome alloy rims?",
          ar: "هل منظفات الجنوط آمنة على الجنوط المطلية والكروم؟",
        },
        a: {
          en: "Yes. Both Briller Alloy Rim Cleaner (1:4 dilution) and Autotriz Hyper Wheel Cleaner (1:1 non-caustic formula with rust inhibitors) are safe for clear-coated, factory-painted, and chrome alloy wheels when applied to cool surfaces.",
          ar: "نعم، كل من Briller Alloy Rim Cleaner (تخفيف 1:4) وAutotriz Hyper Wheel Cleaner (تركيبة غير كاوية مع مانع صدأ) آمنان على جنوط الوكالة المطلية والكروم عند استخدامهما على جنوط باردة.",
        },
      },
    ],
  },
  {
    slug: "interior",
    title: {
      en: "Car Interior, Leather Coating & Glass Cleaners in Doha, Qatar",
      ar: "منظفات مقصورة السيارة، حماية الجلد وتنظيف الزجاج في الدوحة، قطر",
    },
    description: {
      en: "Buy Autotriz Leather & Vinyl Ceramic Coating (QAR 280), Fabric & Textile Guard (QAR 280), and Briller 20L Crystal Clear Glass Cleaner (QAR 265) in Doha, Qatar.",
      ar: "اشترِ نانو سيراميك الجلد Autotriz Leather & Vinyl (280 ر.ق)، وحماية الأقمشة والمخمل (280 ر.ق)، ومنظف الزجاج Briller سعة 20 لتر (265 ر.ق) في الدوحة، قطر.",
    },
    keywords: {
      en: [
        "car leather protection Qatar",
        "car interior cleaner Doha",
        "fabric ceramic coating Qatar",
        "automotive glass cleaner Qatar",
        "Autotriz leather coating Doha",
        "window tint safe glass cleaner Qatar",
      ],
      ar: [
        "حماية جلد السيارات قطر",
        "نانو سيراميك داخلي للسيارات الدوحة",
        "منظف زجاج السيارات قطر",
        "حماية مقاعد المخمل والجلد قطر",
        "منظف داخلية السيارة الدوحة",
      ],
    },
    eyebrow: {
      en: "Cabin, Leather & Optical Glass Care",
      ar: "العناية بالمقصورة والجلود والزجاج",
    },
    h1: {
      en: "Car Interior Protection, Leather Ceramic Coatings & Glass Care in Qatar",
      ar: "حماية مقصورة السيارة، سيراميك الجلود والأقمشة ومنظفات الزجاج في قطر",
    },
    subtitle: {
      en: "Protect Nappa leather, Alcantara, and fabric seats against UV drying, dye transfer, and karak or coffee spills — plus ammonia-free glass cleaners safe for tinted windows.",
      ar: "احمِ مقاعد الجلد الفاخر والمخمل من التشقق الحراري وتصبغات الملابس وانسكاب القهوة أو الكرك — مع منظف زجاج خالٍ من الأمونيا وآمن تماماً على أفلام التظليل.",
    },
    guideTitle: {
      en: "Protecting Leather Cabins & Tinted Glass in Doha's Summer Heat",
      ar: "حماية المقصورة الجلدية والزجاج المظلل في صيف الدوحة",
    },
    guideParagraphs: {
      en: [
        "Closed cabin temperatures in Qatar routinely exceed 70°C when parked outdoors, drying out natural leather oils and causing light-coloured beige or white seats to absorb blue denim dye and coffee stains. Autotriz Leather & Vinyl Coating (50 ml kit: QAR 280) forms a flexible, breathable hydrophobic barrier over leather and soft-touch dashboards without changing their factory matte feel. For cloth seats, carpets, and Alcantara, Autotriz Fabric & Textile Guard (300 ml: QAR 280) repels liquid spills before they soak into seat foam.",
        "Inside glass surfaces collect a hazy film of dashboard plasticizer outgassing and AC humidity that causes night-time headlight glare. Briller Crystal Clear Glass Cleaner (20L commercial drum: QAR 265) cuts through oil film and fingerprints with zero streaks and is safe for VTEK Solar Armor and aftermarket window tints.",
      ],
      ar: [
        "تتجاوز درجة الحرارة داخل مقصورة السيارة المتوقفة تحت شمس الدوحة 70 درجة مئوية، مما يؤدي إلى جفاف وتشقق الجلد الطبيعي وتصبغ المقاعد الفاتحة (البيج والأوف وايت) من الملابس أو انسكاب المشروبات. يوفر طلاء Autotriz Leather & Vinyl Coating الألماني (طقم 50 مل بسعر 280 ر.ق) طبقة حماية مرنة وغير لامعة تحافظ على ملمس الوكالة وتمنع التصبغات، بينما يحمي بخاخ Autotriz Fabric & Textile Guard (عبوة 300 مل بسعر 280 ر.ق) مقاعد القماش والمخمل والسجاد من امتصاص السوائل.",
        "ولإزالة الضباب الدهني المتراكم على الزجاج الأمامي من الأبخرة الداخلية والرطوبة، يضمن منظف الزجاج Briller Crystal Clear Glass Cleaner (برميل 20 لتر بسعر 265 ر.ق) صفاءً بصرياً خالياً من الخطوط وبأمان تام على أفلام العزل الحراري والتظليل.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Does Autotriz Leather & Vinyl Coating make leather seats shiny or slippery?",
          ar: "هل يغير سيراميك الجلد Autotriz لمعة المقاعد أو يجعلها منزلقة؟",
        },
        a: {
          en: "No. Autotriz Leather & Vinyl Coating (QAR 280) preserves the original OEM matte finish and supple feel of Nappa and semi-aniline leather while sealing pores against jeans dye transfer, sweat, and UV fading.",
          ar: "لا، يحافظ Autotriz Leather & Vinyl Coating (280 ر.ق) على المظهر المطفي الأصلي وملمس الوكالة الطبيعي للجلد مع إغلاق المسام ضد تصبغات الجينز والعرق وأشعة الشمس.",
        },
      },
      {
        q: {
          en: "Is Briller Crystal Clear Glass Cleaner safe for tinted car windows?",
          ar: "هل منظف الزجاج Briller Crystal Clear آمن على النوافذ المظللة؟",
        },
        a: {
          en: "Yes. It is formulated to evaporate cleanly without damaging nano-ceramic window tint films or rear defroster grid lines.",
          ar: "نعم، تركيبته سريعة التبخر ولا تسبب أي ضرر لأفلام تظليل النوافذ النانو سيراميك أو خطوط تسخين الزجاج الخلفي.",
        },
      },
      {
        q: {
          en: "How much Autotriz Fabric & Textile Guard is needed for a 7-seater SUV?",
          ar: "كم تكفي عبوة حماية الأقمشة Autotriz Fabric & Textile Guard؟",
        },
        a: {
          en: "A single 300 ml bottle of Autotriz Fabric & Textile Guard (QAR 280) is sufficient to treat the fabric seats and floor mats of a full-size SUV or sedan.",
          ar: "تكفي عبوة واحدة بحجم 300 مل (بسعر 280 ر.ق) لمعالجة مقاعد القماش والأرضيات لسيارة دفع رباعي كاملة أو سيدان.",
        },
      },
    ],
  },
  {
    slug: "cleaners",
    title: {
      en: "Car Degreasers, APC & Adhesive Removers in Doha, Qatar | ABK",
      ar: "مزيلات الشحوم، منظفات المحرك APC ومزيل الملصقات في الدوحة، قطر",
    },
    description: {
      en: "Buy heavy-duty engine degreasers, multi-purpose cleaners (APC), Getsun Engine Foam (QAR 15) & Detainer adhesive remover (QAR 15) in Doha, Qatar. Retail & 20L.",
      ar: "اشترِ مزيلات الشحوم القوية ومنظف متعدد الأغراض APC ورغوة المحرك Getsun (15 ر.ق) ومزيل الملصقات (15 ر.ق) في الدوحة، قطر. عبوات فردية وبراميل 20 لتر.",
    },
    keywords: {
      en: [
        "engine cleaner car Qatar",
        "all purpose cleaner car Doha",
        "heavy duty degreaser Qatar",
        "Getsun engine cleaner Doha",
        "sticker adhesive remover car Qatar",
        "20L APC drum Doha",
      ],
      ar: [
        "منظف محرك السيارة قطر",
        "مزيل شحوم السيارات الدوحة",
        "منظف متعدد الاستخدامات للسيارات قطر",
        "مزيل صمغ التظليل والملصقات قطر",
        "رغوة تنظيف المحرك قطر",
      ],
    },
    eyebrow: {
      en: "Engine Bays, APC & Decontamination",
      ar: "تنظيف المحركات وإزالة الشحوم واللواصق",
    },
    h1: {
      en: "Engine Cleaners, All-Purpose Cleaners (APC) & Degreasers in Qatar",
      ar: "منظفات المحرك، المنظفات متعددة الاستخدامات (APC) ومزيلات الشحوم في قطر",
    },
    subtitle: {
      en: "Tackle baked-on engine oil, wheel-well grease, interior grime, and old window-tint or badge adhesive with professional degreasers and APCs in retail sprays and 20L drums.",
      ar: "تخلص من زيوت المحرك المتراكمة، شحوم الشاصي، أوساخ المقصورة، وبقايا صمغ التظليل القديم مع أقوى المنظفات الاحترافية بالعبوات الفردية وبراميل 20 لتر.",
    },
    guideTitle: {
      en: "Choosing the Right Degreaser, APC & Adhesive Remover for Your Job",
      ar: "كيف تختار مزيل الشحوم أو منظف APC أو مزيل اللواصق المناسب",
    },
    guideParagraphs: {
      en: [
        "Desert sand mixed with engine-bay oil vapour or suspension grease forms a stubborn crust that regular car shampoo cannot dissolve. For exterior mechanical degreasing, wheel arches, and chassis prep, Briller Heavy Duty Degreaser (20L commercial drum: QAR 300; 1:5 dilution, exterior use only) dissolves heavy grease and rust stains rapidly, while Getsun Engine Cleaner Foam Spray (500/650 ml aerosol: QAR 15) lifts oil film and leaves engine plastics with a clean matte finish.",
        "For interior upholstery, carpets, leather, and plastics, lemon-scented Briller Multipurpose Cleaner (20L drum on special offer at QAR 350, was QAR 400; 1:5 dilution) cleans deeply with foaming action. When stripping old window tint glue, dealership stickers, or tape residue, Detainer Sticker Remover (450/473 ml spray: QAR 15) dissolves adhesive cleanly on glass and paint.",
      ],
      ar: [
        "يختلط الغبار الصحراوي الناعم مع أبخرة الزيوت في حجرة المحرك والشاصي ليكوّن طبقة شحمية صلبة لا يستطيع الشامبو العادي إزالتها. لتنظيف الأجزاء الخارجية والبطانات السفلية بكفاءة عالية، يوفر برميل Briller Heavy Duty Degreaser (سعة 20 لتر بسعر 300 ر.ق؛ تخفيف 1:5 للاستخدام الخارجي) قوة تفكيك فورية للشحوم، بينما تمنح رغوة Getsun Foam Out (بسعر 15 ر.ق) تنظيفاً سريعاً ومظهراً مطفياً لبلاستيك المحرك.",
        "ولتنظيف المقصورة الداخلية (المقاعد القماشية، الجلد، البلاستيك، والسجاد)، يتوفر منظف Briller Multipurpose Cleaner برائحة الليمون (برميل 20 لتر بسعر عرض 350 ر.ق بدلاً من 400 ر.ق؛ تخفيف 1:5). وعند إزالة صمغ التظليل القديم أو الملصقات، يضمن بخاخ Detainer Sticker Remover (بسعر 15 ر.ق) إذابة الغراء بأمان دون خدش الزجاج أو الطلاء.",
      ],
    },
    faqs: [
      {
        q: {
          en: "What is the price of 20L APC and Heavy Duty Degreaser drums in Qatar?",
          ar: "كم يبلغ سعر برميل المنظف متعدد الاستخدامات ومزيل الشحوم 20 لتر في قطر؟",
        },
        a: {
          en: "Briller Heavy Duty Degreaser (20L exterior drum, 1:5 dilution) is QAR 300, and Briller Multipurpose Cleaner (20L lemon-scented interior cleaner, 1:5 dilution) is on special offer at QAR 350 (was QAR 400). Both are in stock at our Mesaimeer showroom.",
          ar: "يتوفر برميل مزيل الشحوم الخارجي Briller Heavy Duty Degreaser (20 لتر) بسعر 300 ر.ق، وبرميل المنظف متعدد الأغراض Briller Multipurpose Cleaner (20 لتر) بسعر عرض خاص 350 ر.ق (بدلاً من 400 ر.ق).",
        },
      },
      {
        q: {
          en: "Can I use Detainer Sticker Remover to remove old window tint glue?",
          ar: "هل يمكن استخدام مزيل الملصقات Detainer لإزالة صمغ التظليل القديم؟",
        },
        a: {
          en: "Yes. Detainer Sticker Remover (QAR 15) softens stubborn window-tint adhesive, decals, and tape glue on glass and car paint so it wipes away cleanly with a microfibre towel.",
          ar: "نعم، يعمل بخاخ Detainer Sticker Remover (بسعر 15 ر.ق) على تفكيك صمغ التظليل القديم والملصقات وأشرطة الشعارات عن الزجاج والطلاء ليُمسح بسهولة بمنشفة مايكروفايبر.",
        },
      },
      {
        q: {
          en: "Do you have a retail aerosol spray for cleaning an engine bay at home?",
          ar: "هل يتوفر بخاخ فردي لتنظيف حجرة المحرك في المنزل؟",
        },
        a: {
          en: "Yes. Getsun Engine Cleaner Foam Spray (Foam Out, QAR 15) sprays directly onto cool engine bay surfaces to lift grease and oil, then wipes off with a clean microfibre cloth for an OEM matte look.",
          ar: "نعم، تُرش رغوة Getsun Engine Cleaner Foam Spray (بسعر 15 ر.ق) على حجرة المحرك الباردة لتفكيك الزيوت والأوساخ، ثم تُمسح بمنشفة مايكروفايبر نظيفة لمظهر مطفي أنيق.",
        },
      },
    ],
  },
  {
    slug: "tools",
    title: {
      en: "Microfibre Towels, Foam Guns & Detailing Tools in Doha, Qatar",
      ar: "مناشف مايكروفايبر، مدفع الرغوة وأدوات التلميع في الدوحة، قطر",
    },
    description: {
      en: "Shop edgeless microfibre towels (from QAR 8), PVA drying chamois (QAR 18), wash sponges (QAR 10), masking tape & Autotriz foam guns (QAR 180) in Doha, Qatar.",
      ar: "تسوّق مناشف المايكروفايبر (من 8 ر.ق)، مناشف التجفيف PVA (18 ر.ق)، إسفنجات الغسيل (10 ر.ق)، شريط الحماية ومدفع الرغوة Autotriz (180 ر.ق) في الدوحة، قطر.",
    },
    keywords: {
      en: [
        "microfibre towel car Qatar",
        "car detailing tools Doha",
        "snow foam cannon Qatar",
        "car drying towel Doha",
        "automotive masking tape Qatar",
        "detailing spray bottle Qatar",
      ],
      ar: [
        "مناشف مايكروفايبر للسيارات قطر",
        "ادوات تلميع السيارات الدوحة",
        "مدفع رغوة غسيل السيارات قطر",
        "منشفة تنشيف السيارة قطر",
        "شريط لاصق للتلميع قطر",
      ],
    },
    eyebrow: {
      en: "Towels, Sprayers & Workshop Accessories",
      ar: "مناشف المايكروفايبر، البخاخات وإكسسوارات الورش",
    },
    h1: {
      en: "Car Detailing Towels, Foam Guns, Sponges & Workshop Tools in Qatar",
      ar: "مناشف المايكروفايبر، مدافع الرغوة، الإسفنجات وأدوات التلميع في قطر",
    },
    subtitle: {
      en: "Everything your wash bay or home garage needs — from QAR 2.5 masking tape and QAR 8 microfibre towels to QAR 180 brass-manifold high-pressure snow foam guns.",
      ar: "كل ما يحتاجه مركز التلميع أو كراجك المنزلي — من أشرطة الحماية (2.5 ر.ق) ومناشف المايكروفايبر (8 ر.ق) إلى مدفع الرغوة الاحترافي عالي الضغط (180 ر.ق).",
    },
    guideTitle: {
      en: "Essential Detailing Tools to Prevent Swirls & Water Spots in Doha",
      ar: "الأدوات الأساسية لمنع خدوش الغسيل وبقع المياه في الدوحة",
    },
    guideParagraphs: {
      en: [
        "Even the finest car shampoo or ceramic coating will fail if applied or wiped with cheap, stitched-edge rags. Ultrasonic-cut Edgeless Microfibre Towels (40×40 cm at QAR 10) eliminate hard nylon borders so you can level ceramic coatings and buff polish residue without marring soft clearcoat. Pair them with our Premium Microfibre Towel (60×40 cm at QAR 8), Jumbo Honeycomb Wash Sponge (QAR 10) that traps sand grains deep inside its cells, and the 3D PVA Chamois Drying Towel (64×43 cm at QAR 18) to pull desalinated tap water off panels before it bakes into mineral spots.",
        "For workshop efficiency, we stock chemical-resistant Autotriz Spray Bottles (QAR 15), precision Wax & Polish Dispenser Bottles (QAR 12), residue-free Automotive Yellow Masking Tape in 1-inch (QAR 2.5) and 2-inch (QAR 3.5) widths to protect rubber trim during rotary polishing, and the heavy-duty Autotriz High-Pressure Foam Gun (QAR 180).",
      ],
      ar: [
        "حتى أفضل أنواع الشامبو أو النانو سيراميك لن تعطي نتيجتها المثالية إذا استُخدمت مع فوط تقليدية خشنة الحواف. صُممت منشفة المايكروفايبر بدون حواف Edgeless (مقاس 40×40 سم بسعر 10 ر.ق) بقص ليزري يمنع أي خدش أثناء مسح الكومباوند أو تسوية النانو سيراميك. اجمعها مع منشفة المايكروفايبر الكبيرة (60×40 سم بسعر 8 ر.ق)، وإسفنجة الغسيل الخلوية Jumbo Honeycomb (10 ر.ق) التي تحبس ذرات الرمل داخل مسامها، ومنشفة التجفيف فائقة الامتصاص 3D PVA Chamois (مقاس 64×43 سم بسعر 18 ر.ق) لتجفيف المياه قبل تبخرها وتكوّن البقع الكلسية.",
        "ولرفع كفاءة العمل في الورش والمنازل، نوفر بخاخات Autotriz المقاومة للكيماويات (15 ر.ق)، وعبوات توزيع البولش والشمع (12 ر.ق)، وشريط الحماية الأصفر للسيارات بعرض 1 إنش (2.5 ر.ق) و2 إنش (3.5 ر.ق) لحماية الربلات أثناء التلميع، بالإضافة إلى مدفع الرغوة الاحترافي عالي الضغط Autotriz Foam Gun (180 ر.ق).",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much do microfibre towels and drying chamois cost at ABK Doha?",
          ar: "كم تبلغ أسعار مناشف المايكروفايبر والتجفيف لدى ABK في الدوحة؟",
        },
        a: {
          en: "Our 60×40 cm Premium Microfibre Towel is QAR 8, the 40×40 cm Ultrasonic Edgeless Microfibre Towel is QAR 10, and the 64×43 cm 3D PVA Chamois Drying Towel is QAR 18. Bulk bundle quantities are always in stock in Mesaimeer.",
          ar: "تتوفر منشفة المايكروفايبر الممتازة (60×40 سم) بسعر 8 ر.ق، ومنشفة المايكروفايبر بدون حواف (40×40 سم) بسعر 10 ر.ق، ومنشفة التجفيف 3D PVA Chamois (64×43 سم) بسعر 18 ر.ق، مع توفر كميات الجملة للمغاسل والمراكز.",
        },
      },
      {
        q: {
          en: "Does your automotive masking tape leave sticky residue in hot weather?",
          ar: "هل يترك شريط الحماية الأصفر أي أثر صمغي على الربلات؟",
        },
        a: {
          en: "No. Our Automotive Yellow Masking Tape (QAR 2.5 for 1-inch, QAR 3.5 for 2-inch) uses a clean-release adhesive designed for paint correction masking on rubber seals, plastic trim, and headlights.",
          ar: "لا، يتميز شريط الحماية الأصفر للسيارات (2.5 ر.ق لعرض 1 إنش و3.5 ر.ق لعرض 2 إنش) بلاصق مخصص يسهل نزعه دون ترك أي بقايا على الربلات أو البلاستيك بعد انتهاء التلميع.",
        },
      },
      {
        q: {
          en: "Is the Autotriz High-Pressure Foam Gun compatible with pressure washers in Qatar?",
          ar: "هل يركب مدفع الرغوة Autotriz على غسالات الضغط العالي؟",
        },
        a: {
          en: "Yes. The Autotriz High-Pressure Foam Gun (QAR 180) features a solid brass manifold, adjustable fan nozzle, and 1-litre wide-neck tank for thick snow foam output.",
          ar: "نعم، يأتي مدفع الرغوة Autotriz (بسعر 180 ر.ق) بقلب نحاسي متين وفوهة قابلة للتعديل وخزان سعة 1 لتر لإنتاج رغوة ثلجية كثيفة ومتماسكة.",
        },
      },
    ],
  },
  {
    slug: "fragrance",
    title: {
      en: "Luxury Car & Home Fragrances in Doha, Qatar — ABK Mashmom",
      ar: "معطرات السيارات والمجالس الفاخرة في الدوحة، قطر — ABK مشموم",
    },
    description: {
      en: "Shop Qatar-made luxury car & home fragrances in Doha: ABK Mashmom & ABK Secret 250 ml sprays (QAR 30 each). Lasts 8–9 hours, safe on seats & fabrics.",
      ar: "تسوّق معطرات السيارات والمجالس القطرية الفاخرة في الدوحة: معطر ABK مشموم وABK سيكريت بحجم 250 مل (30 ر.ق للعبوة) بثبات 8–9 ساعات.",
    },
    keywords: {
      en: [
        "car fragrance Qatar",
        "luxury car air freshener Doha",
        "ABK Mashmom perfume",
        "ABK Secret fragrance Qatar",
        "majlis & car spray Doha",
      ],
      ar: [
        "معطر سيارات فاخر قطر",
        "عطر سيارات الدوحة",
        "معطر مشموم ABK قطر",
        "معطر سيكريت ABK",
        "معطر مفارش وسيارات قطر",
      ],
    },
    eyebrow: {
      en: "Qatar-Crafted Cabin & Home Scents",
      ar: "معطرات قطرية فاخرة للسيارة والمنزل",
    },
    h1: {
      en: "Luxury Car & Home Fragrances in Doha, Qatar",
      ar: "معطرات السيارات والمنزل الفاخرة في الدوحة، قطر",
    },
    subtitle: {
      en: "Crafted in Qatar for automotive cabins, upholstery, and living spaces — 8 to 9 hours of scent longevity and safe for skin, clothes, and car seats at QAR 30 per 250 ml bottle.",
      ar: "صُنعت في قطر لمقصورات السيارات والمفروشات والمنازل — ثبات يدوم من 8 إلى 9 ساعات وآمنة على البشرة والملابس ومقاعد السيارة بسعر 30 ر.ق للعبوة (250 مل).",
    },
    guideTitle: {
      en: "Long-Lasting Qatar-Made Cabin & Home Fragrances",
      ar: "ثبات وفوحان يدوم طويلاً في مقصورة سيارتك ومنزلك",
    },
    guideParagraphs: {
      en: [
        "Ordinary hanging paper air fresheners fade within days in Doha's summer heat. ABK's Qatar-crafted 250 ml fragrance sprays (QAR 30 each) deliver 8 to 9 hours of clean scent projection and are tested safe for skin, clothing fabrics, and leather or cloth car seats without staining.",
        "Choose between two signature profiles: ABK Mashmom (an uplifting, artisanal fruity aroma that neutralises cabin odours) and ABK Secret (our #1 best-selling bold, crisp fresh fragrance that gives every freshly detailed interior a showroom finish).",
      ],
      ar: [
        "تفقد المعطرات الورقية التقليدية رائحتها سريعاً في حرارة صيف الدوحة. لذلك توفر ABK بخاخات المعطرات القطرية بحجم 250 مل (بسعر 30 ر.ق للعبوة) بثبات يدوم من 8 إلى 9 ساعات، وبتركيبة آمنة على البشرة والملابس ومقاعد السيارة الجلدية والقماشية دون ترك أثر.",
        "اختر بين توليفتين مميزتين: معطر ABK مشموم (برائحة فواكه منعشة وفواحة تزيل الروائح غير المرغوبة)، ومعطر ABK سيكريت الأكثر مبيعاً لدينا (بعطر فواح ومنعش وقوي يمنح المقصورة رائحة صالات العرض الفاخرة).",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much are ABK Mashmom and ABK Secret fragrances in Qatar?",
          ar: "كم يبلغ سعر معطر ABK مشموم وABK سيكريت في قطر؟",
        },
        a: {
          en: "Both ABK Mashmom and ABK Secret come in 250 ml spray bottles priced at QAR 30 each (Made in Qatar), available at our Mesaimeer showroom or via online cart delivery across Qatar.",
          ar: "يتوفر كل من معطر ABK مشموم ومعطر ABK سيكريت بعبوة بخاخ سعة 250 مل (صُنع في قطر) بسعر 30 ريال قطري للعبوة، في معرضنا بمسيمير أو عبر التوصيل في قطر.",
        },
      },
      {
        q: {
          en: "Are ABK Mashmom and Secret safe on car seats and clothing?",
          ar: "هل معطرات ABK مشموم وسيكريت آمنة على مقاعد السيارة والملابس؟",
        },
        a: {
          en: "Yes. Both 250 ml sprays are tested safe for contact with skin, clothing fabrics, and leather or cloth automotive seating, lasting up to 8 to 9 hours per application.",
          ar: "نعم، كلا المعطرين آمنان على البشرة والملابس ومقاعد السيارات الجلدية والقماشية، ويدوم ثبات الرائحة من 8 إلى 9 ساعات.",
        },
      },
      {
        q: {
          en: "Do detailing studios and car washes buy ABK fragrances as a finishing touch?",
          ar: "هل تستخدم مراكز التلميع والمغاسل معطرات ABK كخطوة نهائية؟",
        },
        a: {
          en: "Yes! Many detailing studios and VIP car washes in Doha mist ABK Secret or ABK Mashmom before customer handover, and also order wholesale cartons via WhatsApp (+974 3083 8355).",
          ar: "نعم! تعتمد العديد من مراكز التلميع ومغاسل VIP في الدوحة معطرات ABK المشموم وسيكريت كلمسة ختامية قبل تسليم السيارة للعميل، كما تتوفر بكميات الجملة عبر واتساب (+974 3083 8355).",
        },
      },
    ],
  },
];

export const BRAND_LANDING_PAGES: BrandLandingData[] = [
  {
    slug: "vtek",
    brandKey: "VTEK",
    matchBrandKeys: ["VTEK", "Vertek"],
    origin: { en: "United States", ar: "الولايات المتحدة الأمريكية" },
    roleBadge: {
      en: "Authorised Qatar Distributor",
      ar: "الموزع المعتمد في قطر",
    },
    title: {
      en: "VTEK PPF & Window Tint in Qatar — Authorised Distributor",
      ar: "أفلام حماية VTEK وتظليل Solar Armor في قطر | الموزع المعتمد",
    },
    description: {
      en: "ABK Trading is the authorised Qatar distributor for VTEK (Vertek) Weather Armor TPU PPF & Solar Armor nano-ceramic window tint. Buy rolls or book Doha installation.",
      ar: "شركة ABK هي الموزع المعتمد لأفلام حماية الطلاء VTEK Weather Armor وتظليل النوافذ Solar Armor في قطر. اشترِ الرولات أو احجز التركيب في الدوحة.",
    },
    keywords: {
      en: [
        "VTEK PPF Qatar",
        "Vertek PPF Doha",
        "VTEK Weather Armor PRO",
        "VTEK Solar Armor window tint Qatar",
        "VTEK distributor Qatar",
        "American PPF Qatar",
      ],
      ar: [
        "أفلام حماية VTEK قطر",
        "فيرتك PPF الدوحة",
        "تظليل VTEK Solar Armor قطر",
        "وكيل افلام VTEK في قطر",
        "تركيب حماية VTEK الدوحة",
      ],
    },
    eyebrow: {
      en: "Authorised Qatar Distributor",
      ar: "الموزع المعتمد في قطر",
    },
    h1: {
      en: "VTEK (Vertek) Paint Protection Film & Solar Armor Window Tint in Qatar",
      ar: "أفلام حماية الطلاء VTEK Weather Armor وتظليل النوافذ Solar Armor في قطر",
    },
    subtitle: {
      en: "TPU paint protection films with VTEK warranties of 5 to 15 years by film, and nano-ceramic solar window films — distributed and installed by ABK in Doha.",
      ar: "أفلام حماية الطلاء من البولي يوريثان الحراري TPU بضمان VTEK من 5 إلى 15 سنة حسب الفيلم، وأفلام العزل الحراري النانو سيراميك — توزيع وتركيب معتمد لدى ABK في الدوحة.",
    },
    guideTitle: {
      en: "VTEK Weather Armor PPF & Solar Armor Window Tint Lineup in Qatar",
      ar: "تشكيلة أفلام الحماية VTEK Weather Armor والعزل الحراري Solar Armor في قطر",
    },
    guideParagraphs: {
      en: [
        "As VTEK's authorised distributor in Qatar (VTEK's own contact page lists our Mesaimeer showroom as its Qatar contact), ABK Trading & Service supplies the Weather Armor TPU paint protection film range from its Mesaimeer showroom: Weather Armor PRO (gloss, 10-year warranty), Weather Armor PRO PLUS (step-up gloss grade, 10-year warranty), Weather Armor MATTE (satin matte, 5-year warranty), Weather Armor PRISM (colour change, 5-year warranty), and flagship Weather Armor ULTIMATE (Polycarbonate Diol-based TPU, 15-year warranty, special roll order). Every installation is registered on VTEK's NFC e-Warranty.",
        "Alongside PPF, VTEK's Solar Armor window film series — VUE, APEX, and ICONIC — utilizes non-metallized nano-ceramic technology to reject up to 95% of infrared solar heat and 99%+ of UV rays. Want VTEK PPF installed on your vehicle? Use our online quote builder to book installed VTEK PPF packages in Doha starting from QAR 899 (front-end) and QAR 3,999 (full body), backed by both the registered VTEK manufacturer warranty and ABK's 12-month workmanship guarantee.",
      ],
      ar: [
        "بصفتها الموزع المعتمد لعلامة VTEK (المعروفة سابقاً بـ Vertek) في قطر — وتُدرج صفحة التواصل لدى VTEK معرضنا في مسيمير كجهة التواصل الخاصة بها في قطر — توفر شركة ABK للتجارة والخدمات تشكيلة أفلام حماية الطلاء Weather Armor TPU من معرضها في مسيمير: فيلم Weather Armor PRO (لامع، ضمان 10 سنوات)، وفيلم Weather Armor PRO PLUS (فئة لمعان أعلى، ضمان 10 سنوات)، وفيلم Weather Armor MATTE المطفي (ضمان 5 سنوات)، وفيلم Weather Armor PRISM الملون (ضمان 5 سنوات)، والفئة العليا Weather Armor ULTIMATE (بضمان 15 سنة، بالطلب الخاص للرول). ويُسجَّل كل تركيب في ضمان VTEK الإلكتروني NFC.",
        "وإلى جانب أفلام الحماية، تقدم سلسلة تظليل النوافذ VTEK Solar Armor (بفئاتها VUE وAPEX وICONIC) تقنية النانو سيراميك غير المعدنية لعزل ما يصل إلى 95% من الأشعة تحت الحمراء وأكثر من 99% من الأشعة فوق البنفسجية. كما يمكن لملاك السيارات حجز باقات تركيب VTEK PPF الشاملة في الدوحة بأسعار ثابتة تبدأ من 899 ر.ق للواجهة و3,999 ر.ق لكامل السيارة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Is VTEK the same brand as Vertek PPF?",
          ar: "هل علامة VTEK هي نفسها Vertek PPF؟",
        },
        a: {
          en: "Yes. Vertek rebranded to VTEK; VTEK's own FAQ still answers under the VERTEK name, and the Weather Armor PPF and Solar Armor window film lines carry on under VTEK. ABK Trading & Service is VTEK's authorised Qatar distributor.",
          ar: "نعم، تغيّر الاسم التجاري من Vertek إلى VTEK، وما زالت الأسئلة الشائعة لدى VTEK تجيب باسم VERTEK، واستمرت أفلام Weather Armor وتظليل Solar Armor تحت اسم VTEK. وشركة ABK هي الموزع المعتمد لـ VTEK في قطر.",
        },
      },
      {
        q: {
          en: "How much does installed VTEK PPF cost in Doha, Qatar?",
          ar: "كم تكلفة تركيب أفلام الحماية VTEK PPF في الدوحة، قطر؟",
        },
        a: {
          en: "Installed VTEK Weather Armor PRO starts at QAR 899 for a front-end kit, QAR 1,599 for full front, and QAR 3,999 for full body on a sedan/coupe (QAR 4,799 SUV, QAR 5,499 Large SUV). See all fixed prices and build your quote at /en/b2c/ppf-installation.",
          ar: "تبدأ أسعار تركيب VTEK Weather Armor PRO من 899 ر.ق لواجهة السيارة، و1,599 ر.ق للواجهة الكاملة، و3,999 ر.ق لكامل هيكل السيدان (4,799 ر.ق لسيارات SUV و5,499 ر.ق لسيارات الدفع الرباعي الكبيرة). يمكنك حساب السعر الفوري عبر صفحة تركيب PPF.",
        },
      },
      {
        q: {
          en: "How can detailing studios in Qatar become authorized VTEK installers?",
          ar: "كيف يمكن لمراكز التلميع في قطر الحصول على وكالة تركيب VTEK؟",
        },
        a: {
          en: "Apply via our Wholesale Dealer page (/en/b2b/become-a-dealer) or message our Trade Desk on WhatsApp (+974 3083 8355) for master-roll trade pricing, sample books, and warranty registration access.",
          ar: "يمكنك التقديم عبر صفحة كن موزعاً (/ar/b2b/become-a-dealer) أو مراسلة قسم مبيعات الجملة عبر واتساب (+974 3083 8355) للحصول على أسعار الرولات التجارية وكتالوجات العينات وتفعيل الضمان.",
        },
      },
    ],
  },
  {
    slug: "autotriz",
    brandKey: "Autotriz",
    matchBrandKeys: ["Autotriz"],
    origin: { en: "Germany", ar: "ألمانيا" },
    roleBadge: {
      en: "Authorized Qatar Distributor",
      ar: "الموزع المعتمد في قطر",
    },
    title: {
      en: "Autotriz Ceramic Coatings & Polishes in Doha, Qatar | ABK",
      ar: "منتجات Autotriz للنانو سيراميك والتلميع في قطر | ABK",
    },
    description: {
      en: "Buy genuine German Autotriz 9H nano ceramic coatings (3D Matrix, REVO +15, ION+), compounds (901, 801, 701, 302), PPF gel & 20L foam shampoo in Doha, Qatar.",
      ar: "اشترِ منتجات Autotriz الألمانية الأصلية في الدوحة، قطر: طلاءات النانو سيراميك 9H، كومباوند التلميع، جل تركيب PPF، وشامبو الرغوة الغنية 20 لتر لدى ABK.",
    },
    keywords: {
      en: [
        "Autotriz Qatar",
        "Autotriz ceramic coating Doha",
        "Autotriz 3D Matrix Ultra Qatar",
        "Autotriz PPF Gel Qatar",
        "Autotriz polish compound Doha",
        "German ceramic coating Qatar",
      ],
      ar: [
        "اوتوتريز قطر",
        "نانو سيراميك اوتوتريز الالماني",
        "ملمع اوتوتريز الدوحة",
        "جل تركيب افلام حماية اوتوتريز",
        "شامبو اوتوتريز 20 لتر قطر",
      ],
    },
    eyebrow: {
      en: "Authorized Qatar Distributor · Germany",
      ar: "الموزع المعتمد في قطر · ألمانيا",
    },
    h1: {
      en: "Autotriz Germany — Nano Ceramic Coatings, PPF Care & Polishing Systems in Qatar",
      ar: "أوتوتريز الألمانية (Autotriz) — أنظمة النانو سيراميك والتلميع والعناية بـ PPF في قطر",
    },
    subtitle: {
      en: "The complete German-engineered Autotriz ecosystem: 3D Matrix polysilazane coatings, interior leather/fabric shields, PPF installation gel, diminishing compounds, and workshop hardware.",
      ar: "المنظومة الألمانية المتكاملة من Autotriz: طلاءات النانو سيراميك ثلاثية الأبعاد، حماية الجلود والأقمشة، جل تركيب وصيانة PPF، مركبات التلميع الاحترافية، ومعدات الغسيل.",
    },
    guideTitle: {
      en: "Why Qatar's Top Detailing Studios Run on Autotriz Germany",
      ar: "لماذا تعتمد نخبة مراكز التلميع في قطر على منتجات Autotriz الألمانية",
    },
    guideParagraphs: {
      en: [
        "Engineered in Germany with nano-polysilazane chemistry, Autotriz delivers a unified detailing system from wash bay to final ceramic curing. At ABK Trading in Mesaimeer, we stock every stage of the Autotriz workflow: pre-wash with Autotriz Nano Rich Foam Shampoo (20L drum: QAR 450 promo, was QAR 500) and Hyper Wheel Cleaner (20L drum: QAR 400); correct paint defects with Heavy Cut 901 (QAR 130), Extreme Cut 801 (1L: QAR 130), Power Cut 701 (4L: QAR 280), One Step Finish (4L: QAR 265), and Ultimate Polish 302 (QAR 135) paired with the Autotriz 8-inch Single-Sided Wool Pad (QAR 40).",
        "For long-term surface protection, choose between Autotriz 3D Matrix Ultra (50ml: QAR 280), 3D Matrix Hybrid graphene-infused polysilazane (50ml: QAR 280), REVO +15 (50ml: QAR 250), ION+ +15 (50ml: QAR 250), Leather & Vinyl Coating (50ml: QAR 280), and Fabric & Textile Coating (300ml: QAR 280). PPF installers also rely on Autotriz PPF Gel (4L: QAR 150 | 20L: QAR 500) and PPF Refresh (1L: QAR 130) for clean film fitting and topcoat maintenance.",
      ],
      ar: [
        "بفضل تقنية البوليسيلازان الألمانية المتطورة، تقدم علامة Autotriz منظومة متكاملة تبدأ من مرحلة الغسيل وحتى الحماية النهائية بالنانو سيراميك. توفر ABK في معرض مسيمير جميع مراحل العمل: الغسيل التحضيري بشامبو Autotriz Nano Rich Foam (برميل 20 لتر بسعر عرض 450 ر.ق بدلاً من 500 ر.ق) ومنظف الجنوط Hyper Wheel Cleaner (20 لتر بسعر 400 ر.ق)؛ ثم تصحيح الطلاء بمركبات Heavy Cut 901 (130 ر.ق) وExtreme Cut 801 (1 لتر: 130 ر.ق) وPower Cut 701 (4 لتر: 280 ر.ق) وOne Step Finish (4 لتر: 265 ر.ق) وUltimate Polish 302 (135 ر.ق) مع وسادة الصوف المفردة مقاس 8 إنش (40 ر.ق).",
        "وللحماية الفائقة طويلة الأمد، تتوفر أطقم النانو سيراميك 3D Matrix Ultra (50 مل: 280 ر.ق)، و3D Matrix Hybrid المعزز بالجرافين (50 مل: 280 ر.ق)، وREVO +15 (250 ر.ق)، وION+ +15 (250 ر.ق)، إلى جانب حماية المقصورة Leather & Vinyl (50 مل: 280 ر.ق) وFabric & Textile Coating (300 مل: 280 ر.ق). كما تعتمد مراكز تركيب الأفلام على جل التركيب Autotriz PPF Gel (4 لتر: 150 ر.ق | 20 لتر: 500 ر.ق) وبخاخ الصيانة PPF Refresh (1 لتر: 130 ر.ق).",
      ],
    },
    faqs: [
      {
        q: {
          en: "Where can I buy genuine Autotriz products in Doha, Qatar?",
          ar: "أين يمكنني شراء منتجات Autotriz الألمانية الأصلية في الدوحة، قطر؟",
        },
        a: {
          en: "ABK Trading & Service in Mesaimeer, Doha is the authorized Qatar distributor for Autotriz Germany. Order online for Qatar-wide delivery (confirmed on WhatsApp) or visit Showroom no. 2, Building 1306, Street 70, Zone 56.",
          ar: "شركة ABK للتجارة والخدمات في مسيمير، الدوحة هي الموزع المعتمد لعلامة Autotriz الألمانية في قطر. يمكنك الطلب عبر الموقع للتوصيل السريع داخل قطر (يُؤكَّد عبر واتساب) أو زيارة معرضنا في المنطقة 56، شارع 70، مبنى 1306.",
        },
      },
      {
        q: {
          en: "What is the difference between Autotriz 3D Matrix Ultra, Hybrid, and REVO +15?",
          ar: "ما الفرق بين سيراميك Autotriz 3D Matrix Ultra وHybrid وREVO +15؟",
        },
        a: {
          en: "3D Matrix Ultra (QAR 280) is Autotriz's pure polysilazane permanent coating for deep wet gloss and chemical resistance (pH 1–14). 3D Matrix Hybrid (QAR 280) infuses graphene into polysilazane to lower surface heat and reduce hard-water spotting. REVO +15 (QAR 250) is a rapid-flash nano-ceramic engineered for extreme hydrophobic beading.",
          ar: "يُعد 3D Matrix Ultra (280 ر.ق) طلاء بوليسيلازان نقي بلمعة عميقة ومقاومة كيميائية عالية (pH 1–14)، بينما يدمج 3D Matrix Hybrid (280 ر.ق) الجرافين لتقليل حرارة السطح وبقع الماء العسر، ويتميز REVO +15 (250 ر.ق) بسرعة التطبيق وطرد مذهل للمياه.",
        },
      },
      {
        q: {
          en: "Do you stock Autotriz PPF Gel in 4L and 20L sizes?",
          ar: "هل يتوفر جل تركيب الأفلام Autotriz PPF Gel بحجم 4 لتر و20 لتر؟",
        },
        a: {
          en: "Yes. Both the 4-litre bottle (QAR 150) and the 20-litre commercial drum (QAR 500) are in stock in Doha for immediate pickup or delivery.",
          ar: "نعم، تتوفر عبوة 4 لتر (150 ر.ق) والبرميل التجاري سعة 20 لتر (500 ر.ق) في مستودعنا بالدوحة للاستلام الفوري أو التوصيل.",
        },
      },
    ],
  },
  {
    slug: "briller",
    brandKey: "Briller",
    matchBrandKeys: ["Briller"],
    origin: { en: "Canada", ar: "كندا" },
    roleBadge: {
      en: "Authorized Qatar Distributor",
      ar: "الموزع المعتمد في قطر",
    },
    title: {
      en: "Briller Car Care 20L Wash & Detailing Drums in Qatar | ABK",
      ar: "منتجات بريلر الكندية Briller سعة 20 لتر في قطر | ABK",
    },
    description: {
      en: "Buy Briller Car Care (Canada) 20L commercial drums in Doha, Qatar: Wash & Wax Shampoo (QAR 350), APC (QAR 350), Tyre Shine (QAR 280), Degreaser (QAR 300) & Glass Cleaner.",
      ar: "اشترِ براميل ومنتجات Briller Car Care الكندية سعة 20 لتر في الدوحة، قطر: شامبو وواكس (350 ر.ق)، منظف شامل APC (350 ر.ق)، ملمع إطارات (280 ر.ق) ومزيل شحوم.",
    },
    keywords: {
      en: [
        "Briller Car Care Qatar",
        "20L car wash chemicals Doha",
        "car wash supplies wholesale Qatar",
        "Briller shampoo 20L Qatar",
        "Briller tyre shine Doha",
        "Canadian car care products Qatar",
      ],
      ar: [
        "منتجات بريلر الكندية قطر",
        "مواد مغاسل السيارات بالجملة الدوحة",
        "براميل غسيل سيارات 20 لتر قطر",
        "شامبو بريلر 20 لتر",
        "ملمع اطارات بريلر قطر",
      ],
    },
    eyebrow: {
      en: "Authorized Qatar Distributor · Canada",
      ar: "الموزع المعتمد في قطر · كندا",
    },
    h1: {
      en: "Briller Car Care (Canada) — 20L Commercial Drums & Detailing Chemicals in Qatar",
      ar: "بريلر الكندية (Briller Car Care) — عبوات الورش والمغاسل 20 لتر في قطر",
    },
    subtitle: {
      en: "Formulated in Canada with All-in-One CA Tech™ for high-volume car washes, detailing studios, fleet operators, and villa garages across Qatar.",
      ar: "مُصنّعة في كندا بتقنية All-in-One CA Tech™ لتلبية احتياجات مغاسل السيارات ومراكز التلميع وأساطيل الشركات وكراجات الفلل في جميع أنحاء قطر.",
    },
    guideTitle: {
      en: "Complete 20-Litre Commercial Chemical Lineup for Qatar Car Washes",
      ar: "التشكيلة المتكاملة من براميل 20 لتر لمغاسل ومراكز العناية بالسيارات في قطر",
    },
    guideParagraphs: {
      en: [
        "Running a profitable car wash, detailing studio, or fleet maintenance bay in Qatar requires concentrated chemicals that perform reliably in desalinated water while keeping cost-per-vehicle low. Briller Car Care (Canada) packages its entire professional line in 20-litre drums with transparent published QAR pricing at ABK Trading: Briller Wash & Wax Shampoo (QAR 350 promo, was QAR 400), Briller Multipurpose Cleaner APC (QAR 350 promo, was QAR 400), Briller Heavy Duty Degreaser (QAR 300), and Briller Alloy Rim Cleaner (QAR 300 promo, was QAR 350).",
        "To finish every vehicle to showroom standard, pair your wash bay with Briller Glass Cleaner (20L ready-to-use drum: QAR 265), Briller Quick Tyre Shine (20L aqua-based non-sling drum: QAR 280), and Briller Quick Dressing for exterior plastics, leather, and dashboards (20L 1:1 dilutable drum: QAR 450).",
      ],
      ar: [
        "يتطلب تشغيل مغسلة سيارات أو مركز تلميع ناجح في قطر مواد كيميائية مركزة تعمل بكفاءة عالية مع المياه المحلاة وتوفر أقل تكلفة تشغيلية لكل سيارة. تقدم علامة Briller Car Care الكندية خطها الاحترافي الكامل ببراميل سعة 20 لتر بأسعار معلنة ومباشرة لدى ABK: شامبو الغسيل والشمع Wash & Wax (بسعر عرض 350 ر.ق بدلاً من 400 ر.ق)، المنظف الشامل Multipurpose Cleaner (بسعر عرض 350 ر.ق بدلاً من 400 ر.ق)، مزيل الشحوم القوي Heavy Duty Degreaser (300 ر.ق)، ومنظف الجنوط Alloy Rim Cleaner (بسعر عرض 300 ر.ق بدلاً من 350 ر.ق).",
        "ولإنهاء كل سيارة بمظهر الوكالة، استكمل تجهيز مركزك بمنظف الزجاج الجاهز للاستخدام Briller Glass Cleaner (20 لتر: 265 ر.ق)، وملمع الإطارات المائي Quick Tyre Shine (20 لتر: 280 ر.ق)، وملمع البلاستيك والجلد والديكور Quick Dressing القابل للتخفيف 1:1 (20 لتر: 450 ر.ق).",
      ],
    },
    faqs: [
      {
        q: {
          en: "Can I order a full set of Briller 20L drums with delivery in Doha?",
          ar: "هل يمكنني طلب مجموعة كاملة من براميل Briller سعة 20 لتر مع التوصيل في الدوحة؟",
        },
        a: {
          en: `Yes! All seven Briller 20L drums are stocked at our Mesaimeer warehouse. Retail orders of QAR ${n(DELIVERY.freeThresholdQar)} or more get free delivery across Doha, Lusail, Al Rayyan and Al Wakrah (QAR ${n(DELIVERY.feeQar)} below that), and the website cart takes ${DISCOUNT_ENTRY.percent}% off orders of QAR ${n(DISCOUNT_ENTRY.minSubtotalQar)} or more and ${DISCOUNT_TOP.percent}% off from QAR ${n(DISCOUNT_TOP.minSubtotalQar)} — so a full set of drums gets ${DISCOUNT_TOP.percent}% off.`,
          ar: `نعم! جميع براميل Briller السبعة سعة 20 لتر متوفرة في مستودعنا بمسيمير. تحصل طلبات التجزئة بقيمة ${n(DELIVERY.freeThresholdQar)} ر.ق فأكثر على توصيل مجاني في الدوحة ولوسيل والريان والوكرة (ورسوم ${n(DELIVERY.feeQar)} ر.ق لما دون ذلك)، وتخصم سلة الموقع ${DISCOUNT_ENTRY.percent}% على الطلبات بقيمة ${n(DISCOUNT_ENTRY.minSubtotalQar)} ر.ق فأكثر و${DISCOUNT_TOP.percent}% من ${n(DISCOUNT_TOP.minSubtotalQar)} ر.ق — أي أن المجموعة الكاملة من البراميل تحصل على خصم ${DISCOUNT_TOP.percent}%.`,
        },
      },
      {
        q: {
          en: "Do you offer extra wholesale discounts for pallet or multi-drum orders?",
          ar: "هل توجد خصومات إضافية عند طلب كميات كبيرة للمغاسل؟",
        },
        a: {
          en: "Yes. Commercial car washes, detailing studios, and fleet operators ordering multiple drums or monthly standing supply can message our Wholesale Trade Desk on WhatsApp (+974 3083 8355) for tiered contract pricing.",
          ar: "نعم، تحصل المغاسل التجارية ومراكز التلميع والشركات عند طلب كميات متعددة أو عقود توريد شهرية على أسعار جملة خاصة عبر التواصل مع قسم الجملة على واتساب (+974 3083 8355).",
        },
      },
      {
        q: {
          en: "Where are Briller Car Care products formulated?",
          ar: "ما هو بلد المنشأ لمنتجات Briller Car Care؟",
        },
        a: {
          en: "Briller Car Care products are formulated in Canada with All-in-One CA Tech™ specifically adapted for high-temperature Gulf wash environments.",
          ar: "تم تطوير منتجات Briller Car Care في كندا بتقنية All-in-One CA Tech™ المصممة لتناسب أجواء العمل الحارة في دول الخليج.",
        },
      },
    ],
  },
  {
    slug: "grizzly",
    brandKey: "Grizzly",
    matchBrandKeys: ["Grizzly"],
    origin: { en: "United States", ar: "الولايات المتحدة الأمريكية" },
    roleBadge: {
      en: "Showroom & Trade Enquiry",
      ar: "متوفر عبر المعرض وطلبات الجملة",
    },
    title: {
      en: "Grizzly USA PPF & Car Care Products in Doha, Qatar | ABK",
      ar: "أفلام حماية ومنتجات Grizzly الأمريكية في الدوحة، قطر | ABK",
    },
    description: {
      en: "Enquire about Grizzly USA paint protection films, window films, polishing compounds & car care supplies at ABK Trading's Mesaimeer showroom in Doha, Qatar.",
      ar: "استفسر عن أفلام الحماية والتظليل ومواد التلميع والعناية بالسيارات من علامة Grizzly الأمريكية لدى معرض ABK للتجارة والخدمات في مسيمير، الدوحة، قطر.",
    },
    keywords: {
      en: [
        "Grizzly PPF Qatar",
        "Grizzly car care Doha",
        "Grizzly detailing products Qatar",
        "Grizzly window film Doha",
      ],
      ar: [
        "أفلام حماية جريزلي قطر",
        "منتجات جريزلي الامريكية للسيارات",
        "جريزلي الدوحة",
      ],
    },
    eyebrow: {
      en: "American Automotive Films & Car Care",
      ar: "أفلام الحماية ومنتجات العناية الأمريكية",
    },
    h1: {
      en: "Grizzly (USA) — Paint Protection Films, Window Tint & Car Care in Qatar",
      ar: "جريزلي الأمريكية (Grizzly) — أفلام الحماية والتظليل ومواد العناية في قطر",
    },
    subtitle: {
      en: "American-formulated automotive protection films, compounds, and workshop car care supplied through ABK Trading & Service's Mesaimeer showroom and trade desk.",
      ar: "أفلام حماية وتظليل ومركبات تلميع وعناية بالسيارات بتركيبات أمريكية متوفرة عبر معرض ABK في مسيمير وقسم مبيعات الجملة.",
    },
    guideTitle: {
      en: "Ordering Grizzly Products & Checking Live Showroom Batch Stock in Doha",
      ar: "طلب منتجات Grizzly والتحقق من المخزون المباشر في معرض مسيمير",
    },
    guideParagraphs: {
      en: [
        "Grizzly's American automotive care portfolio spans paint protection films, window tint rolls, polishing compounds, waxes, and commercial cleaning formulations designed for independent workshops and car owners seeking dependable everyday performance.",
        "Because Grizzly shipments rotate by batch at our Mesaimeer warehouse, individual Grizzly items are quoted directly by our showroom and trade desk rather than listed as fixed online-cart SKUs. Message ABK on WhatsApp (+974 3083 8355) or visit Showroom no. 2, Building 1306, Street 70, Zone 56 to confirm live shelf availability, or browse our ready-to-ship VTEK, Autotriz, Briller, and Insta Finish lines.",
      ],
      ar: [
        "تشمل تشكيلة علامة Grizzly الأمريكية أفلام حماية الطلاء وأفلام التظليل ومركبات التلميع والشموع ومواد التنظيف الموجهة للورش المستقلة وملاك السيارات الباحثين عن أداء عملي موثوق.",
        "نظراً لتجدد دفعات Grizzly حسب الشحنات الواردة إلى مستودعنا في مسيمير، يتم تسعير وتأكيد توفر أصناف Grizzly مباشرة عبر المعرض وقسم الجملة بدلاً من سلة المتجر الإلكتروني. راسلنا عبر واتساب (+974 3083 8355) أو تفضل بزيارة معرضنا في المنطقة 56، شارع 70، مبنى 1306 للتحقق من الأصناف المتوفرة حالياً، أو تصفح بدائلنا المتوفرة للشحن الفوري من VTEK وAutotriz وBriller وInsta Finish.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Why are Grizzly products not listed in the online cart right now?",
          ar: "لماذا لا تظهر منتجات Grizzly حالياً في سلة المتجر الإلكتروني؟",
        },
        a: {
          en: "Grizzly rolls and workshop chemicals rotate by shipment batch at our Mesaimeer showroom, so we confirm exact batch specs and current QAR pricing directly on WhatsApp (+974 3083 8355) before taking an order.",
          ar: "تتوفر منتجات ورولات Grizzly وفق دفعات الشحن في معرض مسيمير، لذا نؤكد المواصفات الدقيقة والأسعار الحالية مباشرة عبر واتساب (+974 3083 8355) قبل اعتماد الطلب.",
        },
      },
      {
        q: {
          en: "Which ready-to-order alternatives does ABK stock in Doha?",
          ar: "ما البدائل الجاهزة للطلب الفوري لدى ABK في الدوحة؟",
        },
        a: {
          en: "For TPU paint protection and nano-ceramic window films, we stock VTEK Weather Armor and Solar Armor rolls (plus fixed-price installed VTEK PPF from QAR 899). For compounds, waxes, and 20L wash chemicals, we carry Autotriz Germany, Briller Canada, and Insta Finish USA in ready stock.",
          ar: "لأفلام الحماية والتظليل نوفر رولات VTEK Weather Armor وSolar Armor (مع خدمة تركيب VTEK PPF بسعر ثابت يبدأ من 899 ر.ق). وللملمعات والشموع وبراميل الغسيل 20 لتر نوفر منتجات Autotriz الألمانية وBriller الكندية وInsta Finish الأمريكية بمخزون فوري.",
        },
      },
      {
        q: {
          en: "Can workshops enquire about wholesale Grizzly cartons or rolls?",
          ar: "هل يمكن للورش الاستفسار عن طلبات الجملة لمنتجات Grizzly؟",
        },
        a: {
          en: "Yes. Detailing shops, car washes, and auto accessory retailers can message our Wholesale Trade Desk on WhatsApp (+974 3083 8355) to check incoming Grizzly stock and carton pricing.",
          ar: "نعم، يمكن لمراكز التلميع والمغاسل ومحلات زينة السيارات التواصل مع قسم مبيعات الجملة عبر واتساب (+974 3083 8355) للاستفسار عن الشحنات المتوفرة وأسعار الكراتين.",
        },
      },
    ],
  },
  {
    slug: "grunes-auto",
    brandKey: "GrunesAuto",
    matchBrandKeys: ["GrunesAuto"],
    origin: { en: "Germany", ar: "ألمانيا" },
    roleBadge: {
      en: "Authorized Qatar Supplier",
      ar: "المورد المعتمد في قطر",
    },
    title: {
      en: "GrünesAuto 6-Inch Foam Pads & Towels in Qatar | ABK",
      ar: "وسائد تلميع ومناشف GrünesAuto الألمانية في قطر | ABK",
    },
    description: {
      en: "Buy German GrünesAuto 6-inch DA foam pads (QAR 30), Rotary buffing pads (QAR 28) — Step 1, 2 & 3 — and edgeless microfibre towels (QAR 10) in Doha, Qatar.",
      ar: "اشترِ وسائد التلميع الألمانية GrünesAuto مقاس 6 إنش لأجهزة DA (30 ر.ق) وRotary (28 ر.ق) للمراحل 1 و2 و3 ومناشف المايكروفايبر بدون حواف (10 ر.ق) في الدوحة.",
    },
    keywords: {
      en: [
        "GrunesAuto pads Qatar",
        "foam polishing pads Doha",
        "6 inch DA polishing pad Qatar",
        "rotary buffing pads Doha",
        "edgeless microfiber towel Qatar",
      ],
      ar: [
        "اسفنج تلميع السيارات قطر",
        "وسائد بوليش المانية الدوحة",
        "بف تلميع 6 انش قطر",
        "منشفة مايكروفايبر بدون حواف قطر",
      ],
    },
    eyebrow: {
      en: "German Reticulated Foam & Microfibre",
      ar: "تقنية الإسفنج الشبكي والمايكروفايبر الألمانية",
    },
    h1: {
      en: "GrünesAuto (Germany) — 6-Inch DA & Rotary Pads and Edgeless Towels in Qatar",
      ar: "جرينز أوتو الألمانية (GrünesAuto) — وسائد التلميع 6 إنش ومناشف المايكروفايبر في قطر",
    },
    subtitle: {
      en: "Color-coded Step 1 Heavy Cut, Step 2 Medium Polish, and Step 3 Finishing pads from open-cell German foam (DA: QAR 30 | Rotary: QAR 28), plus laser-cut edgeless microfibre towels (QAR 10).",
      ar: "وسائد تلميع مرقمة للخطوة 1 و2 و3 من الإسفنج الألماني مفتوح المسام (أجهزة DA: 30 ر.ق | أجهزة Rotary: 28 ر.ق)، مع مناشف مايكروفايبر مقصوصة بالليزر بدون حواف (10 ر.ق).",
    },
    guideTitle: {
      en: "Matching GrünesAuto Step 1, Step 2 & Step 3 Pads to Your Machine",
      ar: "كيف تختار وسادة GrünesAuto المناسبة لجهاز التلميع لديك",
    },
    guideParagraphs: {
      en: [
        "Polishing in warm Gulf workshops puts extreme thermal stress on cheap foam pads, causing Velcro backing failure and foam collapse mid-panel. GrünesAuto 6-inch (150 mm) pads are manufactured in Germany from high-resilience reticulated foam with heat-dissipating profiles and heavy-duty hook-and-loop backing.",
        "We stock two dedicated geometries across all three correction steps: bevelled center-vented Dual Action (DA) pads at QAR 30 each that channel heat away from the spindle on orbital polishers, and full-contact Rotary pads at QAR 28 each engineered for smooth, chatter-free tracking on direct-drive rotary buffers — complemented by the laser-cut 40×40 cm GrünesAuto Edgeless Microfibre Towel (QAR 10) for scratch-free compound and ceramic wipe-down.",
      ],
      ar: [
        "يؤدي التلميع في أجواء الخليج الحارة إلى تلف الإسفنجات التجارية الرخيصة وانفصال طبقة الفيلكرو بسرعة. صُنعت وسائد GrünesAuto مقاس 6 إنش (150 مم) في ألمانيا من الإسفنج الشبكي عالي التحمل مع لاصق خلفي فائق القوة.",
        "نوفر تصميمين مخصصين لجميع المراحل الثلاث (Step 1 للقطع، Step 2 للمتوسط، Step 3 للتنعيم): وسائد أجهزة التلميع المدارية (DA) المزودة بفتحة تهوية مركزية بسعر 30 ر.ق للقطعة، ووسائد أجهزة التلميع الدوارة (Rotary) بسعر 28 ر.ق للقطعة لثبات مثالي وانسيابية عالية، إلى جانب منشفة المايكروفايبر بدون حواف مقاس 40×40 سم (10 ر.ق) لمسح بقايا الكومباوند والنانو سيراميك بأمان تام.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much are GrünesAuto 6-inch polishing pads and towels in Qatar?",
          ar: "كم يبلغ سعر وسائد ومناشف GrünesAuto الألمانية في قطر؟",
        },
        a: {
          en: "At ABK Trading in Doha, GrünesAuto 6-inch Dual Action (DA) foam pads (Step 1, 2, and 3) are QAR 30 each, 6-inch Rotary foam pads (Step 1, 2, and 3) are QAR 28 each, and the 40×40 cm laser-cut Edgeless Microfibre Towel is QAR 10.",
          ar: "تتوفر وسائد GrünesAuto مقاس 6 إنش لأجهزة DA (المراحل 1 و2 و3) بسعر 30 ر.ق للقطعة، ولأجهزة Rotary الدوارة (المراحل 1 و2 و3) بسعر 28 ر.ق للقطعة، كما تتوفر منشفة المايكروفايبر بدون حواف مقاس 40×40 سم بسعر 10 ر.ق.",
        },
      },
      {
        q: {
          en: "What backing plate size fits GrünesAuto 6-inch pads?",
          ar: "ما هو مقاس قاعدة التلميع المناسب لوسائد GrünesAuto مقاس 6 إنش؟",
        },
        a: {
          en: "They are designed for standard 5-inch (125 mm) to 6-inch (150 mm) hook-and-loop backing plates on both Dual Action and Rotary polishing machines.",
          ar: "تتوافق مع قواعد الفيلكرو القياسية بمقاس 5 إنش (125 مم) إلى 6 إنش (150 مم) في أجهزة التلميع المدارية والدوارة.",
        },
      },
      {
        q: {
          en: "Which compounds pair best with GrünesAuto Step 1, 2, and 3 pads?",
          ar: "ما هي مواد التلميع المناسبة لكل خطوة من وسائد GrünesAuto؟",
        },
        a: {
          en: "Pair Step 1 Heavy Cut with Autotriz Heavy Cut 901 (QAR 130) or Extreme Cut 801 (QAR 130); pair Step 2 Medium Polish with Autotriz Power Cut 701 (4L: QAR 280) or One Step Finish (4L: QAR 265); and pair Step 3 Finishing with Autotriz Ultimate Polish 302 (QAR 135) or Insta Finish Spray Wax (QAR 45).",
          ar: "استخدم الخطوة 1 مع كومباوند القطع القوي Autotriz 901 أو 801 (130 ر.ق)؛ والخطوة 2 مع Autotriz Power Cut 701 (280 ر.ق) أو One Step Finish (265 ر.ق)؛ والخطوة 3 مع الملمع النهائي Autotriz Ultimate Polish 302 (135 ر.ق).",
        },
      },
    ],
  },
  {
    slug: "abk",
    brandKey: "ABK",
    matchBrandKeys: ["ABK"],
    origin: { en: "France & Qatar", ar: "فرنسا وقطر" },
    roleBadge: {
      en: "Proprietary Brand",
      ar: "علامة ABK الخاصة",
    },
    title: {
      en: "ABK Rejuvenate Trim Restorer & Car Fragrances in Qatar",
      ar: "مجدد البلاستيك ABK Rejuvenate ومعطرات ABK في قطر",
    },
    description: {
      en: "Shop ABK signature products in Doha, Qatar: French-made ABK Rejuvenate Plastic Restorer (60ml QAR 50 to 500ml QAR 280) & Mashmom / Secret sprays (QAR 30).",
      ar: "تسوّق منتجات علامة ABK الحصرية في الدوحة، قطر: مجدد البلاستيك الفرنسي ABK Rejuvenate (من 50 إلى 280 ر.ق) ومعطرات المشموم وسيكريت القطرية 250 مل (30 ر.ق).",
    },
    keywords: {
      en: [
        "ABK Rejuvenate Qatar",
        "ABK plastic restorer Doha",
        "ABK Mashmom fragrance",
        "ABK Secret car perfume",
        "ABK Trading products Qatar",
      ],
      ar: [
        "منتجات ABK قطر",
        "مجدد البلاستيك ABK Rejuvenate",
        "معطر مشموم ABK",
        "معطر سيكريت ABK",
      ],
    },
    eyebrow: {
      en: "ABK Signature Formulations",
      ar: "إصدارات ABK الحصرية",
    },
    h1: {
      en: "ABK Signature Range — French Plastic Restorer & Qatari Car/Home Fragrances",
      ar: "مجموعة ABK الخاصة — مجدد البلاستيك الفرنسي ومعطرات المقصورة والمجالس القطرية",
    },
    subtitle: {
      en: "Developed specifically for Qatar's climate and automotive culture: French-manufactured ABK Rejuvenate trim restorer (QAR 50–280) and Made-in-Qatar Mashmom & Secret 250ml sprays (QAR 30).",
      ar: "طُوّرت خصيصاً لتلائم مناخ قطر وذائقة ملاك السيارات: مجدد البلاستيك الفرنسي ABK Rejuvenate (50–280 ر.ق)، ومعطرات المشموم وسيكريت القطرية بحجم 250 مل (30 ر.ق).",
    },
    guideTitle: {
      en: "Built by ABK for Qatar's Sun, SUVs & Majlis",
      ar: "منتجات صممتها ABK خصيصاً لأجواء وسيارات قطر",
    },
    guideParagraphs: {
      en: [
        "When we couldn't find an off-the-shelf trim restorer that survived a full Doha summer without turning sticky or washing off, we partnered with a specialty French laboratory to produce ABK Rejuvenate Multi-Surface Plastic Restorer. Available in 60 ml (QAR 50), 250 ml (QAR 180), 350 ml (QAR 220), and 500 ml (QAR 280) — each bundled with 2 applicator sponges and 1 microfibre towel — it restores deep OEM satin-black richness to faded SUV bumpers, fender flares, mirror housings, and engine plastics for up to 6 months.",
        "Complementing our exterior restoration formula are ABK Mashmom (fresh fruity profile) and best-selling ABK Secret (crisp luxury profile) — Made-in-Qatar 250 ml car and home fragrances priced at QAR 30 each, safe on car seats, fabrics, and clothes with 8 to 9 hours of scent longevity.",
      ],
      ar: [
        "صُمم مجدد البلاستيك الفرنسي ABK Rejuvenate خصيصاً ليتحمل شمس الدوحة الحارقة دون أن يترك ملمساً دهنياً يجمع الغبار أو يزول مع الغسيل. يتوفر بأربعة أحجام (60 مل بسعر 50 ر.ق، 250 مل بسعر 180 ر.ق، 350 مل بسعر 220 ر.ق، و500 مل بسعر 280 ر.ق) مع إسفنجتي تطبيق ومنشفة مايكروفايبر مجاناً، ليعيد اللون الأسود الوكالي للصدامات والرفارف وأغطية المحرك لمدة تصل إلى 6 أشهر.",
        "وتكتمل المجموعة بمعطرات السيارة والمنزل القطرية الصنع ABK المشموم (عبير فاكهي منعش) وABK سيكريت الأكثر مبيعاً (عبير فاخر قوي) بحجم 250 مل وسعر 30 ر.ق للعبوة، بتركيبة آمنة على المقاعد والأقمشة وثبات يدوم من 8 إلى 9 ساعات.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Where are ABK Rejuvenate and ABK Fragrances manufactured?",
          ar: "أين يُصنّع مجدد البلاستيك ABK Rejuvenate ومعطرات ABK؟",
        },
        a: {
          en: "ABK Rejuvenate Plastic Restorer is manufactured in France exclusively for ABK Trading & Service, while ABK Mashmom and ABK Secret 250 ml sprays (QAR 30 each) are proudly made in Qatar.",
          ar: "يُصنّع مجدد البلاستيك ABK Rejuvenate في فرنسا حصرياً لصالح شركة ABK، بينما تُصنّع معطرات ABK المشموم وسيكريت (250 مل بسعر 30 ر.ق) في دولة قطر.",
        },
      },
      {
        q: {
          en: "Which size of ABK Rejuvenate should I buy for one SUV?",
          ar: "أي حجم من ABK Rejuvenate يكفي لسيارة دفع رباعي واحدة؟",
        },
        a: {
          en: "The 60 ml kit (QAR 50, including 2 sponges and 1 microfibre cloth) easily covers all exterior plastic trim, bumpers, and fender flares on a full-size SUV; allow 6 to 7 hours of dry curing before driving.",
          ar: "تكفي عبوة 60 مل (بسعر 50 ر.ق شاملة إسفنجتين ومنشفة مايكروفايبر) لتجديد جميع الأجزاء البلاستيكية الخارجية والصدامات لسيارة دفع رباعي كاملة، مع ترك السطح ليجف 6 إلى 7 ساعات قبل القيادة.",
        },
      },
      {
        q: {
          en: "Can I smell ABK Mashmom and Secret at your Doha showroom?",
          ar: "هل يمكنني تجربة معطرات ABK في معرضكم بالدوحة؟",
        },
        a: {
          en: "Yes! Visit our Mesaimeer showroom (Showroom no. 2, Building 1306, Street 70, Zone 56) Saturday to Thursday to test both QAR 30 scents in person.",
          ar: "نعم بالتأكيد! تفضل بزيارة معرضنا في مسيمير (معرض رقم 2، مبنى 1306، شارع 70، منطقة 56) من السبت إلى الخميس لتجربة العطور مباشرة.",
        },
      },
    ],
  },
  {
    slug: "instafinish",
    brandKey: "InstaFinish",
    matchBrandKeys: ["InstaFinish"],
    origin: { en: "United States", ar: "الولايات المتحدة الأمريكية" },
    roleBadge: {
      en: "Authorized Qatar Supplier",
      ar: "المورد المعتمد في قطر",
    },
    title: {
      en: "Insta Finish USA Spray Wax, Wash & Dressings in Qatar | ABK",
      ar: "منتجات Insta Finish الأمريكية للعناية بالسيارات في قطر | ABK",
    },
    description: {
      en: "Buy genuine USA-made Insta Finish 473ml car care products in Doha, Qatar: Spray Wax, Wash & Wax, Premium Blue Guard & Premium Dress All at QAR 45 each.",
      ar: "اشترِ منتجات Insta Finish الأمريكية الأصلية (473 مل بسعر 45 ر.ق) في الدوحة، قطر: شمع البخاخ Spray Wax، شامبو Wash & Wax، وملمعات Blue Guard وDress All.",
    },
    keywords: {
      en: [
        "Insta Finish Qatar",
        "Insta Finish Spray Wax Doha",
        "Insta Finish Blue Guard Qatar",
        "Insta Finish Dress All Qatar",
        "American car wax Doha",
      ],
      ar: [
        "منتجات انستا فينش قطر",
        "شمع بخاخ انستا فينش الدوحة",
        "ملمع بلو جارد الامريكي",
        "شامبو انستا فينش قطر",
      ],
    },
    eyebrow: {
      en: "American Detailing Chemistry · 473 ml Range",
      ar: "منتجات العناية الأمريكية الأصيلة · عبوات 473 مل",
    },
    h1: {
      en: "Insta Finish (USA) — Spray Wax, Wash & Wax, Blue Guard & Dress All in Qatar",
      ar: "إنستا فينش الأمريكية (Insta Finish) — شمع البخاخ والشامبو وملمعات الديكور في قطر",
    },
    subtitle: {
      en: "Genuine USA-manufactured 16 fl oz (473 ml) detailing bottles priced at QAR 45 each: Spray Wax, Wash & Wax shampoo, glossy Premium Blue Guard, and matte Premium Dress All.",
      ar: "عبوات أمريكية أصلية بحجم 473 مل (16 أونصة) وبسعر موحد 45 ر.ق للعبوة: شمع Spray Wax، وشامبو Wash & Wax، وملمع Blue Guard اللامع، وملمع Dress All المطفي.",
    },
    guideTitle: {
      en: "Four Ready-to-Use American Detailing Staples at QAR 45 Each",
      ar: "أربعة منتجات أمريكية أساسية للعناية بالسيارة بسعر 45 ر.ق للعبوة",
    },
    guideParagraphs: {
      en: [
        "Manufactured in the United States for dealership prep bays and enthusiasts who want effortless results in warm weather, ABK's Insta Finish 16 fl oz (473 ml) lineup covers exterior gloss and trim conditioning at a flat QAR 45 per bottle. Start your wash with Insta Finish Wash & Wax (dilutes into 20 litres of water to clean and leave a water-beading shine), then mist Insta Finish Spray Wax onto clean panels and buff with a microfibre towel for a deep wet-look gloss.",
        "For interior leather, dashboards, steering wheels, and exterior plastic trims, Insta Finish lets you pick your exact sheen: choose Premium Blue Guard (473 ml: QAR 45) when you want a rich glossy showroom finish, or choose Premium Dress All (473 ml: QAR 45) when you prefer a factory-fresh, non-greasy matte finish with zero windshield glare.",
      ],
      ar: [
        "صُنعت منتجات Insta Finish في الولايات المتحدة لتمنح مراكز التلميع وملاك السيارات نتائج فورية وسهلة في الأجواء الحارة، وتتوفر لدى ABK بعبوات 473 مل (16 أونصة) بسعر موحد يبلغ 45 ريالاً قطرياً للعبوة. ابدأ الغسيل بشامبو Insta Finish Wash & Wax (يُخفف في 20 لتر ماء ليمنح رغوة غنية وطبقة شمعية طاردة للماء)، ثم عزز اللمعان ببخاخ Insta Finish Spray Wax الذي يُرش ويُمسح مباشرة بمنشفة مايكروفايبر لمظهر رطب عميق.",
        "وللعناية بالجلد والطبلون والمقود والبلاستيك الخارجي، تمنحك Insta Finish خيارين حسب المظهر المفضل لديك: اختر Premium Blue Guard (بسعر 45 ر.ق) للحصول على لمعة غنية وقوية، أو اختر Premium Dress All (بسعر 45 ر.ق) للحصول على مظهر الوكالة المطفي غير الدهني دون أي انعكاس على الزجاج الأمامي.",
      ],
    },
    faqs: [
      {
        q: {
          en: "What is the difference between Insta Finish Premium Blue Guard and Premium Dress All?",
          ar: "ما الفرق بين Insta Finish Premium Blue Guard وPremium Dress All؟",
        },
        a: {
          en: "Both are ready-to-use 473 ml USA dressings (QAR 45 each) safe for interior leather, dashboards, and exterior plastics: Premium Blue Guard leaves a high-gloss finish, whereas Premium Dress All leaves a non-glare, non-greasy OEM matte finish.",
          ar: "كلاهما ملمع أمريكي جاهز للاستخدام بدون تخفيف بحجم 473 مل وسعر 45 ر.ق للجلد والطبلون والبلاستيك الخارجي؛ يمنح Premium Blue Guard لمعة قوية، بينما يمنح Premium Dress All مظهراً مطفياً طبيعياً غير دهني.",
        },
      },
      {
        q: {
          en: "How do I use Insta Finish Wash & Wax and Spray Wax?",
          ar: "كيف أستخدم شامبو Wash & Wax وبخاخ Spray Wax من Insta Finish؟",
        },
        a: {
          en: "Mix Insta Finish Wash & Wax (473 ml, QAR 45) with 20 litres of wash water to lift dirt and leave a water-beading film. After drying, mist Insta Finish Spray Wax (473 ml, QAR 45) directly onto cool paintwork and buff clean with an edgeless microfibre towel.",
          ar: "اخلط شامبو Insta Finish Wash & Wax (45 ر.ق) مع 20 لتر من الماء لغسل السيارة وترك طبقة طاردة للماء، وبعد التجفيف رش Insta Finish Spray Wax (45 ر.ق) مباشرة على الطلاء وامسحه بمنشفة مايكروفايبر ناعمة.",
        },
      },
      {
        q: {
          en: "Where can I order Insta Finish products in Qatar?",
          ar: "كيف يمكنني طلب منتجات Insta Finish في قطر؟",
        },
        a: {
          en: "Add any QAR 45 Insta Finish bottle to your cart on abktradingservice.com for Doha delivery or free pickup at our Mesaimeer showroom, or message us on WhatsApp (+974 3083 8355) for carton trade pricing.",
          ar: "أضف أي عبوة Insta Finish (45 ر.ق) إلى سلة الطلب عبر الموقع للتوصيل في الدوحة أو الاستلام المجاني من معرض مسيمير، أو تواصل معنا عبر واتساب (+974 3083 8355) لأسعار الجملة.",
        },
      },
    ],
  },
  {
    slug: "getsun",
    brandKey: "Getsun",
    matchBrandKeys: ["Getsun"],
    origin: { en: "China", ar: "الصين" },
    roleBadge: {
      en: "Authorized Qatar Retailer & Wholesaler",
      ar: "موزع تجزئة وجملة معتمد في قطر",
    },
    title: {
      en: "Getsun Tyre Shine, Interior & Engine Foam in Qatar | ABK",
      ar: "بخاخات Getsun للإطارات والمقصورة والمحرك في قطر | ABK",
    },
    description: {
      en: "Shop Getsun car care aerosols at QAR 15 in Doha, Qatar: Getsun Tyre Shine (500ml), Foam Spray Interior Cleaner & Engine Cleaner Foam Spray at ABK Mesaimeer.",
      ar: "تسوّق بخاخات العناية السريعة Getsun بسعر 15 ر.ق في الدوحة، قطر: ملمع الإطارات الفوري، رغوة تنظيف المقصورة والمقاعد، ورغوة تنظيف المحرك لدى ABK مسيمير.",
    },
    keywords: {
      en: [
        "Getsun Qatar",
        "Getsun tyre shine Doha",
        "Getsun foam interior cleaner Qatar",
        "Getsun engine cleaner spray Doha",
      ],
      ar: [
        "منتجات جيتسون قطر",
        "ملمع اطارات جيتسون الدوحة",
        "فوم تنظيف مقاعد السيارة جيتسون",
        "بخاخ تنظيف المحرك جيتسون",
      ],
    },
    eyebrow: {
      en: "Quick Aerosol Maintenance · QAR 15 Range",
      ar: "حلول العناية السريعة بالرغوة · 15 ر.ق",
    },
    h1: {
      en: "Getsun — Tyre Shine, Interior Foam Cleaner & Engine Degreaser in Qatar",
      ar: "جيتسون (Getsun) — بخاخ تلميع الإطارات ورغوة تنظيف المقصورة والمحرك في قطر",
    },
    subtitle: {
      en: "Fast-acting QAR 15 maintenance aerosols stocked in Mesaimeer, Doha: no-wipe high-gloss Tyre Shine, deep-lifting Interior Foam Cleaner, and Engine Cleaner Foam Spray.",
      ar: "بخاخات عناية سريعة وعملية بسعر 15 ر.ق للعبوة في معرض مسيمير: ملمع الإطارات الفوري، رغوة تنظيف المقاعد والديكور، وبخاخ رغوة تنظيف المحرك.",
    },
    guideTitle: {
      en: "Everyday Aerosol Convenience for Tyres, Seats & Engine Bays at QAR 15",
      ar: "عناية فورية بالإطارات والمقاعد وحجرة المحرك بسعر 15 ر.ق فقط",
    },
    guideParagraphs: {
      en: [
        "Keep three QAR 15 Getsun cans in your garage or trunk for rapid touch-ups between full washes. Getsun Tyre Shine (500 ml: QAR 15) sprays directly onto clean tyre sidewalls for an instant wet-black gloss with no wiping or run-off, while Getsun Foam Spray Interior Cleaner (500/650 ml: QAR 15) lifts coffee spills, dust, and stains from fabric seats, leather upholstery, carpets, and plastic door cards.",
        "Under the bonnet, Getsun Engine Cleaner Foam Spray (500/650 ml: QAR 15) clings to dusty shrouds, hoses, and valve covers to break down oil mist and grime — simply spray onto a cool engine bay, agitate lightly if needed, and wipe clean with a microfibre towel to leave a tidy matte finish on engine plastics.",
      ],
      ar: [
        "احتفظ ببخاخات Getsun العملية (بسعر 15 ر.ق للعبوة) في كراجك للعناية السريعة بين الغسلات. يمنحك بخاخ Getsun Tyre Shine (حجم 500 مل: 15 ر.ق) لمعة سوداء قوية وفورية للإطارات بمجرد الرش على إطار نظيف دون الحاجة للمسح، بينما تفكك رغوة Getsun Foam Spray Interior Cleaner (بسعر 15 ر.ق) البقع والأوساخ عن المقاعد القماشية والجلدية والسجاد والديكورات البلاستيكية.",
        "وفي حجرة المحرك، تلتصق رغوة Getsun Engine Cleaner Foam Spray (بسعر 15 ر.ق) بالأغطية والخراطيم لتفكيك آثار الزيوت والغبار المتراكم — رش الرغوة على محرك بارد ثم امسحها بمنشفة مايكروفايبر نظيفة لتحصل على مظهر مطفي مرتب للبلاستيك.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much are Getsun sprays at ABK Trading in Qatar?",
          ar: "كم يبلغ سعر بخاخات Getsun لدى ABK في قطر؟",
        },
        a: {
          en: "All three Getsun aerosols stocked at ABK — Getsun Tyre Shine, Getsun Foam Spray Interior Cleaner, and Getsun Engine Cleaner Foam Spray — are QAR 15 per can.",
          ar: "تتوفر بخاخات Getsun الثلاثة لدى ABK — ملمع الإطارات، ورغوة تنظيف المقصورة، ورغوة تنظيف المحرك — بسعر موحد يبلغ 15 ريالاً قطرياً للعبوة.",
        },
      },
      {
        q: {
          en: "Can I order Getsun products in bulk cartons for an auto accessories shop?",
          ar: "هل تتوفر منتجات Getsun بالكرتون لمحلات زينة السيارات والمغاسل؟",
        },
        a: {
          en: "Yes! ABK supplies Getsun both individually at QAR 15 for car owners and in wholesale master cartons for auto accessory retailers and car washes across Qatar via WhatsApp (+974 3083 8355).",
          ar: "نعم! توفر ABK منتجات Getsun بالقطعة (15 ر.ق) للأفراد وبالكرتون التجاري لمحلات إكسسوارات السيارات والمغاسل في جميع أنحاء قطر عبر واتساب (+974 3083 8355).",
        },
      },
      {
        q: {
          en: "Is Getsun Foam Spray Interior Cleaner safe on both fabric and leather seats?",
          ar: "هل رغوة التنظيف الداخلي Getsun آمنة على المقاعد القماشية والجلدية؟",
        },
        a: {
          en: "Yes. Getsun Foam Spray Interior Cleaner is formulated for fabric upholstery, leather seats, carpets, and interior plastics; spray the foam, agitate gently with a soft brush or microfibre towel, and wipe dry.",
          ar: "نعم، صُممت رغوة التنظيف الداخلي Getsun لتناسب المقاعد القماشية والجلدية والسجاد والبلاستيك الداخلي؛ رش الرغوة وامسحها بمنشفة مايكروفايبر ناعمة.",
        },
      },
    ],
  },
];

const BRAND_SLUG_BY_KEY: Record<BrandKey, BrandSlug | undefined> = {
  VTEK: "vtek",
  Vertek: "vtek",
  Autotriz: "autotriz",
  Briller: "briller",
  Grizzly: "grizzly",
  GrunesAuto: "grunes-auto",
  ABK: "abk",
  InstaFinish: "instafinish",
  Getsun: "getsun",
  SmartCar: undefined,
  Other: undefined,
};

export function getCategoryLanding(slug: string): CategoryLandingData | undefined {
  return CATEGORY_LANDING_PAGES.find((c) => c.slug === slug);
}

export function getBrandLanding(slug: string): BrandLandingData | undefined {
  return BRAND_LANDING_PAGES.find((b) => b.slug === slug);
}

export function getBrandSlugForKey(brandKey: BrandKey): BrandSlug | undefined {
  return BRAND_SLUG_BY_KEY[brandKey];
}

export function getProductsByCategorySlug(slug: CategoryKey): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === slug && (p.audience === "b2c" || p.audience === "both"),
  );
}

export function getProductsByBrandLanding(brand: BrandLandingData): Product[] {
  return PRODUCTS.filter(
    (p) =>
      brand.matchBrandKeys.includes(p.brand) &&
      (p.audience === "b2c" || p.audience === "both"),
  );
}
