import { PRODUCTS, type BrandKey, type CategoryKey, type Product } from "./products";

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
  | "getsun"
  | "sitrett";

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
      ar: "أفلام حماية الطلاء PPF وتظليل النوافذ في الدوحة، قطر — VTEK وGrizzly",
    },
    description: {
      en: "Buy genuine VTEK & Grizzly TPU Paint Protection Film (PPF), Solar Armor nano-ceramic window tint rolls, and installation gel in Doha, Qatar. Retail & wholesale.",
      ar: "اشترِ أفلام حماية الطلاء الأصلية VTEK وGrizzly وتظليل النوافذ النانو سيراميك Solar Armor وجل التركيب في الدوحة، قطر. بيع بالتجزئة والجملة في مسيمير.",
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
      en: "Genuine VTEK Weather Armor aliphatic TPU rolls, Solar Armor heat-rejection window films, Grizzly PPF, and Autotriz installation solutions — stocked in Mesaimeer, Doha.",
      ar: "رولات أفلام حماية الطلاء الأليفاتية VTEK Weather Armor، وأفلام العزل الحراري Solar Armor، ورولات Grizzly ومحلول التركيب Autotriz — متوفرة في معرضنا بمسيمير، الدوحة.",
    },
    guideTitle: {
      en: "Choosing PPF & Window Tint Films for Qatar's 50°C Climate",
      ar: "كيف تختار أفلام الحماية PPF والعزل الحراري لمناخ قطر القاسي",
    },
    guideParagraphs: {
      en: [
        "In Doha's extreme summer heat (45°C–50°C+) and UV index 11+ sun, low-grade PVC or TPH films oxidize, yellow, and delaminate within 12 to 18 months. ABK Trading & Service exclusively stocks 100% aliphatic Thermoplastic Polyurethane (TPU) films from VTEK (Weather Armor PRO 7.5 mil, PRO PLUS 8.0 mil, MATTE, PRISM, and ULTIMATE) and Grizzly (7.5 mil self-healing TPU at QAR 1,200 per 1.52m × 15m master roll). Every VTEK film features heat-activated self-healing topcoats and non-yellowing optical adhesives backed by 5- to 15-year warranties.",
        "For cabin heat rejection that complies with Qatar Traffic Department (Metrash2) VLT rules, VTEK Solar Armor window film rolls (VUE, APEX, and ICONIC) block over 99% of UV radiation and up to 95% of infrared solar heat without metallic signal interference. Looking for turn-key installation? Car owners can also book fixed-price VTEK PPF installation in Doha (starting from QAR 899 front-end and QAR 3,999 full body) directly through our online quote builder.",
      ],
      ar: [
        "في ظل حرارة صيف الدوحة التي تتجاوز 45–50 درجة مئوية ومؤشر الأشعة فوق البنفسجية المرتفع، تتعرض الأفلام التجارية الرخيصة (PVC أو TPH) للاصفرار والتشقق وتلف اللاصق خلال عام واحد. لذلك توفر ABK للتجارة والخدمات حصرياً أفلام البولي يوريثان الأليفاتية الأصلية (Aliphatic TPU) من علامتَي VTEK الأمريكية (Weather Armor PRO بسماكة 7.5 ميل، وPRO PLUS بسماكة 8.0 ميل، والمطفي MATTE، والملون PRISM) وGrizzly (رول 1.52م × 15م بسعر 1,200 ر.ق) مع خاصية المعالجة الذاتية للخدوش بالحرارة.",
        "وللعزل الحراري المتوافق مع اشتراطات الإدارة العامة للمرور في قطر، توفر أفلام تظليل النوافذ VTEK Solar Armor (فئات VUE وAPEX وICONIC) عزلاً للأشعة فوق البنفسجية بنسبة تتجاوز 99% وعزلاً للأشعة تحت الحمراء حتى 95% دون التأثير على إشارات الجوال أو الملاحة. كما يمكن لملاك السيارات في قطر حجز باقات تركيب أفلام VTEK PPF بأسعار ثابتة ومعلنة (تبدأ من 899 ر.ق للواجهة و3,999 ر.ق لكامل السيارة) عبر حاسبة الأسعار الفورية.",
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
          en: "What is the price of a full PPF roll in Qatar?",
          ar: "كم يبلغ سعر رول حماية الطلاء PPF الكامل في قطر؟",
        },
        a: {
          en: "Grizzly Self-Healing TPU PPF (190 microns / 7.5 mil, 1.52m × 15m roll) is priced at QAR 1,200. VTEK Weather Armor TPU master rolls (PRO, PRO PLUS, MATTE, PRISM, ULTIMATE) and Solar Armor window tint rolls are quoted on WhatsApp (+974 3083 8355) with tiered trade discounts for studios and workshops.",
          ar: "يتوفر رول حماية الطلاء Grizzly TPU ذاتي المعالجة (سماكة 190 ميكرون / 7.5 ميل، مقاس 1.52م × 15م) بسعر 1,200 ريال قطري. أما رولات VTEK Weather Armor وأفلام التظليل Solar Armor فتُسعّر عبر واتساب (+974 3083 8355) مع خصومات تجارية لمراكز التلميع.",
        },
      },
      {
        q: {
          en: "Do you stock PPF slip solution and aftercare maintenance sprays in Doha?",
          ar: "هل يتوفر لديكم جل تركيب PPF وبخاخات العناية بالأفلام في الدوحة؟",
        },
        a: {
          en: "Yes. We stock German-engineered Autotriz PPF Gel in 4L (QAR 150) and 20L workshop drums (QAR 500) to prevent premature adhesive tacking in warm bays, plus Autotriz PPF Refresh (1L at QAR 130) to maintain hydrophobic gloss on installed films.",
          ar: "نعم، نوفر جل تركيب الأفلام الألماني Autotriz PPF Gel بعبوة 4 لتر (150 ر.ق) وعبوة الورش 20 لتر (500 ر.ق)، بالإضافة إلى بخاخ الصيانة Autotriz PPF Refresh بحجم 1 لتر (130 ر.ق) للحفاظ على لمعان الأفلام وطرد المياه.",
        },
      },
    ],
  },
  {
    slug: "ceramic",
    title: {
      en: "Nano Ceramic Coating Products in Doha, Qatar — Autotriz 9H",
      ar: "منتجات النانو سيراميك للسيارات في الدوحة، قطر — Autotriz الألمانية",
    },
    description: {
      en: "Shop professional 9H nano ceramic coatings in Doha, Qatar. German Autotriz 3D Matrix Ultra, Hybrid, REVO +15 & ION+ kits from QAR 250. Same-day Qatar delivery.",
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
          en: "Can ceramic coating be applied on top of Paint Protection Film (PPF)?",
          ar: "هل يمكن تطبيق النانو سيراميك فوق أفلام حماية الطلاء PPF؟",
        },
        a: {
          en: "Yes! Applying Autotriz 3D Matrix Hybrid, REVO +15, or ION+ over VTEK or Grizzly PPF boosts hydrophobic water beading, prevents desert dust from sticking to the film pores, and makes washing effortless without interfering with the film's self-healing topcoat.",
          ar: "نعم بالتأكيد! تطبيق سيراميك Autotriz فوق أفلام الحماية VTEK أو Grizzly يعزز خاصية طرد المياه والأتربة ويحمي مسام الفيلم من التصبغات مع الحفاظ الكامل على ميزة المعالجة الذاتية للخدوش.",
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
      en: "Buy pH-neutral car wash shampoos, 20L commercial snow foam drums & 20kg touchless wash powder in Doha, Qatar. Briller, Autotriz, Grizzly & Insta Finish.",
      ar: "اشترِ شامبو غسيل السيارات المتعادل وبراميل الرغوة الغنية 20 لتر وبودرة الغسيل اللاتلامسي 20 كجم في الدوحة، قطر من Briller وAutotriz وGrizzly.",
    },
    keywords: {
      en: [
        "car shampoo Qatar",
        "snow foam shampoo Doha",
        "car wash chemicals supplier Qatar",
        "20L car shampoo drum Qatar",
        "touchless car wash powder Qatar",
        "pH neutral car shampoo Doha",
      ],
      ar: [
        "شامبو سيارات قطر",
        "شامبو رغوة للسيارات الدوحة",
        "مواد غسيل سيارات بالجملة قطر",
        "شامبو غسيل بدون لمس قطر",
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
      en: "High-lubricity shampoos and thick snow foams that lift abrasive desert grit safely off PPF, ceramic coatings, and clearcoat — available in retail bottles, 20L drums, and 20kg sacks.",
      ar: "شامبوهات عالية التزليق ورغوة ثلجية كثيفة تزيل الرمال والأتربة بأمان تام عن أفلام الحماية PPF والنانو سيراميك والطلاء — متوفرة للعملاء الأفراد وبعبوات 20 لتر و20 كجم للمغاسل.",
    },
    guideTitle: {
      en: "Safe Sand Removal: Choosing the Right Car Shampoo in Qatar",
      ar: "إزالة الرمال بأمان: كيف تختار شامبو غسيل السيارات المناسب في قطر",
    },
    guideParagraphs: {
      en: [
        "More swirl marks are inflicted during a 15-minute wash than in months of highway driving — especially in Qatar, where fine silica sand settles on horizontal panels every day. Using dish soap or harsh alkaline degreasers strips wax protection and dries out rubber window seals. A high-lubricity foam pre-wash encapsulates sand grains and floats them off the paint before a wash mitt ever touches the surface.",
        "For commercial carwashes, detailing studios, and home foam-cannon enthusiasts with multiple vehicles, our 20-litre concentrate drums deliver the lowest cost-per-wash in Doha: Briller Car Shampoo Wash & Wax (20L drum on special offer at QAR 350, was QAR 400) and Autotriz Rich Foam Shampoo (20L drum on special offer at QAR 450, was QAR 500), alongside Grizzly 20kg Touchless Car Wash Powder and Insta Finish Maxi Suds Cherry Shampoo.",
      ],
      ar: [
        "تحدث معظم دوائر الخدش (Swirl Marks) أثناء عملية الغسيل الخاطئة بسبب ذرات الرمل الناعمة المتراكمة يومياً على هيكل السيارة في قطر. استخدام المنظفات المنزلية القلوية يؤدي إلى بهتان الطلاء وجفاف جلد النوافذ. الحل الاحترافي يبدأ برغوة كثيفة عالية التزليق تفكك ذرات الرمل وتزيلها قبل ملامسة إسفنجة الغسيل للطلاء.",
        "للمغاسل التجارية ومراكز التلميع وأصحاب المنازل الذين يستخدمون مدفع الرغوة (Foam Gun)، نوفر براميل مركزة سعة 20 لتر بأفضل قيمة اقتصادية في الدوحة: شامبو وغسيل بالشمع Briller الكندي (20 لتر بسعر عرض خاص 350 ر.ق بدلاً من 400 ر.ق)، وشامبو الرغوة الغنية الألماني Autotriz Rich Foam (20 لتر بسعر 450 ر.ق بدلاً من 500 ر.ق)، بالإضافة إلى بودرة الغسيل بدون لمس Grizzly بوزن 20 كجم.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Are your car shampoos safe for PPF and ceramic-coated cars?",
          ar: "هل شامبوهات السيارات لديكم آمنة على أفلام الحماية PPF والنانو سيراميك؟",
        },
        a: {
          en: "Yes. Autotriz Rich Foam Shampoo, Briller Wash & Wax, and Insta Finish Maxi Suds are formulated to clean thoroughly without degrading aliphatic TPU self-healing topcoats or stripping SiO2 ceramic coatings.",
          ar: "نعم، تم تطوير شامبو Autotriz Rich Foam وشامبو Briller وInsta Finish Maxi Suds لتنظيف الطلاء بعمق وأمان دون التأثير على الطبقة العلوية لأفلام الحماية PPF أو إضعاف عزل النانو سيراميك.",
        },
      },
      {
        q: {
          en: "Can individual car owners buy the 20-litre shampoo drums in Doha?",
          ar: "هل يمكن للأفراد شراء براميل الشامبو سعة 20 لتر في الدوحة؟",
        },
        a: {
          en: "Absolutely! Both retail customers (such as villas washing multiple family SUVs) and commercial car washes can order 20L drums of Briller Wash & Wax (QAR 350) and Autotriz Rich Foam (QAR 450) online with same-day Doha delivery.",
          ar: "بالتأكيد! يمكن للأفراد (أصحاب الفلل الذين يغسلون عدة سيارات في المنزل) وكذلك المغاسل التجارية شراء براميل 20 لتر مباشرة عبر الموقع أو واتساب مع توصيل سريع في الدوحة.",
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
      en: "Shop German Autotriz & Grizzly polishing compounds, 1-step polishes, wool cutting pads & GrünesAuto 6-inch DA/Rotary foam pads (from QAR 30) in Doha, Qatar.",
      ar: "تسوّق مركبات تلميع السيارات الألمانية Autotriz وGrizzly ووسائد الصوف وإسفنجات البوليش GrünesAuto مقاس 6 إنش (من 30 ر.ق) في الدوحة، قطر.",
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
      en: "Low-dust diminishing abrasive compounds from Autotriz & Grizzly paired with German-engineered GrünesAuto 6-inch DA and Rotary foam pads — built for swirl-free correction.",
      ar: "مركبات تلميع منخفضة الغبار من Autotriz وGrizzly مع وسائد الإسفنج الألمانية GrünesAuto مقاس 6 إنش لأجهزة التلميع المدارية والدوارة — لنتائج مرآة خالية من الدوائر.",
    },
    guideTitle: {
      en: "Multi-Stage Paint Correction vs. One-Step Polishing for Gulf Clearcoats",
      ar: "الفرق بين تصحيح الطلاء متعدد المراحل وتلميع الخطوة الواحدة",
    },
    guideParagraphs: {
      en: [
        "Sandstorms and automatic brush washes leave deep P1500–P2000 grit scratches and oxidation haze across clearcoat. To restore optical clarity before applying PPF or a 9H ceramic coating, match your abrasive cut to the defect depth: start with Autotriz Heavy Cut 901, Extreme Cut 801 (1L: QAR 160), or Power Cut 701 (4L: QAR 280) on an Autotriz 8-inch Double-Sided Wool Cutting Pad (QAR 75) or GrünesAuto Heavy Cut Step 1 Foam Pad (QAR 30), then refine to a hologram-free mirror finish with Autotriz Ultimate Polish 302 (QAR 135) on a Step 3 Finishing Pad.",
        "When turnaround speed matters for daily drivers or pre-sale reconditioning, Grizzly One Step Polish 3-in-1 (1L: QAR 115) and Autotriz One Step Polish (4L workshop bottle: QAR 265) combine medium defect removal, high-gloss jeweling, and protective sealing in a single pass. For quick localized door-handle or bumper scuffs, Getsun Scratch Remover provides an easy hand-applied solution.",
      ],
      ar: [
        "تتسبب العواصف الرملية والغسيل الآلي بالفرش في خدوش عميقة وبهتان في طبقة اللكر. لاستعادة صفاء الطلاء قبل تركيب أفلام الحماية PPF أو تطبيق النانو سيراميك، اختر درجة القطع المناسبة: ابدأ بكومباوند القطع القوي Autotriz Heavy Cut 901 أو Extreme Cut 801 (حجم 1 لتر بسعر 160 ر.ق) أو Power Cut 701 (حجم 4 لتر بسعر 280 ر.ق) مع وسادة الصوف المزدوجة Autotriz مقاس 8 إنش (75 ر.ق) أو إسفنجة القطع GrünesAuto Step 1 (30 ر.ق)، ثم أنهِ العمل بلمعان المرآة باستخدام Autotriz Ultimate Polish 302 (135 ر.ق) مع إسفنجة التنعيم Step 3.",
        "أما عند الرغبة في إنجاز سريع يجمع بين إزالة الخدوش المتوسطة واللمعان والحماية في خطوة واحدة، فإن Grizzly One Step Polish 3-in-1 (حجم 1 لتر بسعر 115 ر.ق) وAutotriz One Step Polish (عبوة ورش 4 لتر بسعر 265 ر.ق) يمنحان نتائج احترافية بتكلفة ووقت أقل.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Which polishing pad should I choose: DA (Dual Action) or Rotary?",
          ar: "أي وسادة تلميع أختار: المدارية (DA) أم الدوارة (Rotary)؟",
        },
        a: {
          en: "We stock German-engineered GrünesAuto 6-inch foam pads for both machine types at QAR 30 per pad: Step 1 (Heavy Cut), Step 2 (Medium Polish), and Step 3 (Finishing). Use Rotary pads for fast defect removal on hard clearcoats, and DA pads for cooler running temperatures and zero-hologram finishing.",
          ar: "نوفر وسائد الإسفنج الألمانية GrünesAuto مقاس 6 إنش لكلا الجهازين بسعر 30 ر.ق للقطعة: الخطوة 1 (قطع قوي)، الخطوة 2 (تلميع متوسط)، والخطوة 3 (تنعيم نهائي). تُستخدم وسائد Rotary للقطع السريع، بينما تضمن وسائد DA حرارة أقل وتشطيباً خالياً تماماً من الهولوجرام.",
        },
      },
      {
        q: {
          en: "What is the best one-step car polish in Qatar?",
          ar: "ما هو أفضل ملمع سيارات بخطوة واحدة في قطر؟",
        },
        a: {
          en: "Grizzly One Step Polish 3-in-1 (1L for QAR 115) is our top seller for enthusiasts and mobile detailers, while high-volume workshops prefer the 4-litre Autotriz One Step Polish (QAR 265) for its low-dust diminishing abrasives in warm Doha bays.",
          ar: "يُعد Grizzly One Step Polish 3-in-1 (حجم 1 لتر بسعر 115 ر.ق) الخيار المفضل للأفراد، بينما تفضل مراكز التلميع عبوة الورش الاقتصادية Autotriz One Step Polish بحجم 4 لتر (265 ر.ق) بفضل تركيبته منخفضة الغبار.",
        },
      },
      {
        q: {
          en: "Are Autotriz compounds body-shop safe and silicone-free?",
          ar: "هل مركبات التلميع Autotriz خالية من السيليكون وآمنة قبل النانو سيراميك؟",
        },
        a: {
          en: "Yes. Autotriz Heavy Cut 901, Extreme Cut 801, Power Cut 701, and Ultimate Polish 302 use diminishing abrasives without cheap wax fillers, making them ideal for paint prep prior to ceramic coating or PPF installation.",
          ar: "نعم، مركبات Autotriz (901 و801 و701 و302) تعتمد على حبيبات كاشطة متلاشية بدون مالئات شمعية تخفي الخدوش مؤقتاً، مما يجعلها مثالية لتجهيز الطلاء قبل النانو سيراميك أو تركيب PPF.",
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
      en: "Shop carnauba paste wax, spray wax, 20L quick dressings & ABK Rejuvenate French plastic restorer (from QAR 40) in Doha, Qatar. Restore sun-faded SUV bumpers.",
      ar: "تسوّق شمع الكارنوبا، الشمع البخاخ، ومجدد البلاستيك الفرنسي ABK Rejuvenate (ابتداءً من 40 ر.ق) في الدوحة، قطر لاستعادة لون الصدامات والفيبر الباهت من الشمس.",
    },
    keywords: {
      en: [
        "plastic restorer car Qatar",
        "car wax Doha",
        "carnauba wax Qatar",
        "trim dressing car Qatar",
        "ABK Rejuvenate plastic restorer",
        "Insta Finish Butter Wet Wax Qatar",
      ],
      ar: [
        "مجدد بلاستيك السيارات قطر",
        "شمع سيارات الدوحة",
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
      en: "Restore sun-bleached SUV fenders and bumpers with French-made ABK Rejuvenate, or lock in deep wet-look gloss with Grizzly Carnauba and Insta Finish Butter Wet Wax.",
      ar: "استعد اللون الأسود الأصلي للصدامات والرفارف الباهتة من الشمس مع ABK Rejuvenate الفرنسي، وامنح طلاء سيارتك لمعاناً عميقاً مع شمع الكارنوبا من Grizzly وInsta Finish.",
    },
    guideTitle: {
      en: "Restoring Sun-Bleached Trim & Boosting Paint Gloss in Qatar",
      ar: "كيف تعالج بهتان البلاستيك الخارجي وتمنح سيارتك لمعاناً عميقاً في قطر",
    },
    guideParagraphs: {
      en: [
        "Unpainted black plastic bumpers, wheel-arch flares, cowl panels, and running boards on SUVs like the Land Cruiser, Patrol, Wrangler, and Prado chalk to a dull grey under Doha's intense UV exposure. French-formulated ABK Rejuvenate Plastic Restorer penetrates porous plastic and rubber to restore a deep, non-greasy OEM satin-black finish that lasts 6+ months without washing off. Available in 60 ml (on special offer at QAR 40, was QAR 50), 250 ml (QAR 180), 350 ml (QAR 220), and 500 ml workshop bottles (QAR 280).",
        "For paintwork gloss and rapid post-wash protection, enthusiasts love Grizzly Carnauba Paste Wax, Grizzly Spray Wax, and USA-made Insta Finish Butter Wet Wax & Clean N Shine. High-volume detailing bays and carwashes also stock Briller Quick Dressing in 20L commercial drums (QAR 450) for fast, streak-free interior and exterior trim conditioning.",
      ],
      ar: [
        "تتعرض الأجزاء البلاستيكية السوداء غير المطلية (مثل الصدامات، أقواس العجلات، الدعاسات، وغطاء المحرك) في سيارات الدفع الرباعي للبهتان والتحول إلى اللون الرمادي بسبب شمس الدوحة الحارقة. يعمل مجدد البلاستيك الفرنسي الأصل ABK Rejuvenate على التغلغل داخل مسام البلاستيك والربل ليستعيد اللون الأسود الوكالي غير الدهني بثبات يتجاوز 6 أشهر. متوفر بأحجام 60 مل (بسعر عرض 40 ر.ق بدلاً من 50 ر.ق)، 250 مل (180 ر.ق)، 350 مل (220 ر.ق)، و500 مل للورش (280 ر.ق).",
        "ولإضفاء لمعان عميق وحماية سريعة بعد الغسيل، تتوفر شموع الكارنوبا الفاخرة من Grizzly وشمع Butter Wet Wax الأمريكي من Insta Finish، إلى جانب عبوة الورش الاقتصادية Briller Quick Dressing بسعة 20 لتر (450 ر.ق) لتلميع البلاستيك والربل الداخلي والخارجي.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How long does ABK Rejuvenate Plastic Restorer last in Qatar's heat?",
          ar: "كم يدوم مفعول مجدد البلاستيك ABK Rejuvenate في حرارة قطر؟",
        },
        a: {
          en: "Unlike silicone dressings that wash off in the first rinse or attract desert dust, ABK Rejuvenate (Made in France) bonds into the plastic pores and maintains a deep satin-black finish for 6+ months when applied to clean, dry trim.",
          ar: "على عكس الملمعات الزيتية المؤقتة التي تزول مع أول غسلة أو تجمع الغبار، يتغلغل ABK Rejuvenate (صناعة فرنسية) داخل مسام البلاستيك ويدوم لأكثر من 6 أشهر عند تطبيقه على سطح نظيف وجاف.",
        },
      },
      {
        q: {
          en: "What sizes of ABK Rejuvenate are in stock in Doha?",
          ar: "ما هي الأحجام المتوفرة من ABK Rejuvenate في الدوحة؟",
        },
        a: {
          en: "We stock four sizes at our Mesaimeer showroom: 60 ml DIY bottle (QAR 40 promo, was QAR 50), 250 ml (QAR 180), 350 ml (QAR 220), and 500 ml professional bottle (QAR 280).",
          ar: "يتوفر بأربعة أحجام في معرضنا بمسيمير: عبوة 60 مل للاستخدام الشخصي (40 ر.ق بدلاً من 50 ر.ق)، عبوة 250 مل (180 ر.ق)، عبوة 350 مل (220 ر.ق)، وعبوة المحترفين 500 مل (280 ر.ق).",
        },
      },
      {
        q: {
          en: "Do you sell bulk trim dressing for car washes in Qatar?",
          ar: "هل توفرون ملمع بلاستيك بالجملة لمغاسل السيارات في قطر؟",
        },
        a: {
          en: "Yes. Briller Quick Dressing is stocked in 20-litre commercial drums at QAR 450, delivering a clean, non-sticky satin sheen across exterior plastics, engine bays, and interior vinyl.",
          ar: "نعم، يتوفر Briller Quick Dressing ببرميل تجاري سعة 20 لتر بسعر 450 ر.ق، ويمنح لمعة ساتان نظيفة وغير دهنية للبلاستيك الخارجي وحجرات المحرك والديكورات الداخلية.",
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
      en: "Shop alloy wheel cleaners, non-sling tyre shine, tyre foam & curved applicator sponges (QAR 8) in Doha, Qatar. Briller 20L drums, Autotriz, Grizzly & Smart Car.",
      ar: "تسوّق منظفات الجنوط وملمعات ورغوة الإطارات وإسفنجات التلميع (8 ر.ق) في الدوحة، قطر. عبوات 20 لتر للمغاسل وعبوات فردية من Briller وAutotriz وGrizzly.",
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
      en: "Dissolve baked-on brake dust from alloy wheels and protect tyre sidewalls against UV cracking and browning — available in spray bottles, aerosols, and 20L commercial drums.",
      ar: "تخلص من غبار الفرامل العنيد عن الجنوط واحمِ جدران الإطارات من التشقق والبهتان الناتج عن حرارة الأسفلت — متوفرة بعبوات فردية وبراميل 20 لتر للمغاسل.",
    },
    guideTitle: {
      en: "Preventing Tyre Browning & Brake Dust Pitting on Qatar Roads",
      ar: "حماية الإطارات من الاسمرار وتآكل الجنوط على طرقات قطر",
    },
    guideParagraphs: {
      en: [
        "Heavy braking in high ambient temperatures bakes metallic brake dust onto painted and diamond-cut alloy wheels, while asphalt temperatures above 65°C draw antiozonants to tyre sidewalls — turning tyres brown and dry. Dedicated wheel cleaners like Grizzly Rim Cleaner, Briller Alloy Rim Cleaner (20L drum: QAR 250), and Autotriz Hyper Wheel Cleaner (20L drum: QAR 400) break down brake dust and road grime rapidly without etching delicate caliper finishes.",
        "After rinsing and drying the tyre sidewall, apply Briller Quick Tyre Shine (20L drum: QAR 280), Briller Tyre Foam, Smart Car Tyre Foam, or Getsun Leather & Tyre Wax using our contoured Tyre Polish Applicator Sponge (QAR 8) for an even, sling-free satin or wet-black finish that resists sand buildup.",
      ],
      ar: [
        "يؤدي الكبح المتكرر في درجات الحرارة المرتفعة إلى التصاق غبار الفرامل المعدني بالجنوط، بينما تتسبب حرارة الأسفلت التي تتجاوز 65 درجة مئوية في جفاف جدران الإطارات وتحول لونها إلى البني. تعمل المنظفات المتخصصة مثل Grizzly Rim Cleaner ومنظف الجنوط الكندي Briller Alloy Rim Cleaner (برميل 20 لتر: 250 ر.ق) والألماني Autotriz Hyper Wheel Cleaner (برميل 20 لتر: 400 ر.ق) على إذابة غبار الفرامل والزيوت بأمان وسرعة فائقة.",
        "وبعد تنظيف وتجفيف الإطار، استخدم ملمع الإطارات Briller Quick Tyre Shine (برميل 20 لتر: 280 ر.ق) أو رغوة الإطارات من Briller وSmart Car مع إسفنجة تلميع الإطارات المنحنية (بسعر 8 ر.ق فقط) للحصول على لمعة سوداء متناسقة بدون تطاير على هيكل السيارة.",
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
          en: "Briller Alloy Rim Cleaner (20L) is QAR 250, Briller Quick Tyre Shine (20L) is QAR 280, and German Autotriz Hyper Wheel Cleaner (20L) is QAR 400 — all in stock at our Mesaimeer showroom with same-day Doha delivery.",
          ar: "يتوفر برميل منظف الجنوط Briller Alloy Rim Cleaner (20 لتر) بسعر 250 ر.ق، وبرميل ملمع الإطارات Briller Quick Tyre Shine (20 لتر) بسعر 280 ر.ق، وبرميل Autotriz Hyper Wheel Cleaner الألماني (20 لتر) بسعر 400 ر.ق.",
        },
      },
      {
        q: {
          en: "Are your wheel cleaners safe for painted and factory alloy rims?",
          ar: "هل منظفات الجنوط آمنة على الجنوط المطلية والوكالية؟",
        },
        a: {
          en: "Yes. Grizzly Rim Cleaner, Briller Alloy Rim Cleaner, and Autotriz Hyper Wheel Cleaner are formulated for clear-coated, powder-coated, and OEM alloy wheels when used as directed on cool surfaces.",
          ar: "نعم، جميع منظفات الجنوط من Grizzly وBriller وAutotriz آمنة تماماً على جنوط الوكالة والجنوط المطلية عند استخدامها وفق التعليمات على سطح بارد.",
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
      en: "Buy heavy-duty engine degreasers, multi-purpose cleaners (APC), Sitrett MX5 & adhesive remover in Doha, Qatar. Retail sprays & 20L Briller drums from QAR 300.",
      ar: "اشترِ مزيلات الشحوم القوية، منظفات المحرك ومتعدد الاستخدامات APC، ومنظف Sitrett MX5 ومزيل الملصقات في الدوحة، قطر. عبوات فردية وبراميل 20 لتر من 300 ر.ق.",
    },
    keywords: {
      en: [
        "engine cleaner car Qatar",
        "all purpose cleaner car Doha",
        "heavy duty degreaser Qatar",
        "Sitrett MX5 Qatar",
        "sticker adhesive remover car Qatar",
        "20L APC drum Doha",
      ],
      ar: [
        "منظف محرك السيارة قطر",
        "مزيل شحوم السيارات الدوحة",
        "منظف متعدد الاستخدامات للسيارات قطر",
        "مزيل صمغ التظليل والملصقات قطر",
        "منظف سيتريت MX5 قطر",
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
      en: "Tackle baked-on engine oil, wheel-well grease, interior grime, and old window-tint or badge adhesive with professional degreasers and APCs in retail and 20L drums.",
      ar: "تخلص من زيوت المحرك المتراكمة، شحوم الشاصي، أوساخ المقصورة، وبقايا صمغ التظليل القديم مع أقوى المنظفات الاحترافية بالعبوات الفردية وبراميل 20 لتر.",
    },
    guideTitle: {
      en: "Choosing the Right Degreaser, APC & Adhesive Remover for Your Job",
      ar: "كيف تختار مزيل الشحوم أو منظف APC أو مزيل اللواصق المناسب",
    },
    guideParagraphs: {
      en: [
        "Desert sand mixed with engine-bay oil vapour or suspension grease forms a stubborn crust that regular car shampoo cannot dissolve. For heavy mechanical degreasing, wheel arches, and chassis prep, Briller Heavy Duty Degreaser (20L commercial drum: QAR 300), Grizzly Engine Cleaner, and Sitrett MX5 Heavy-Duty Multi-Surface Degreaser emulsify grease and carbon buildup rapidly.",
        "For versatile interior and exterior detailing across door jambs, rubber floor mats, fabric upholstery, and plastics, Briller Multi-Purpose Cleaner (20L drum on special offer at QAR 350, was QAR 400) and Insta Finish Super APC can be diluted to match any surface sensitivity. When stripping old window tint, dealership stickers, or PPF residue, Detainer Sticker & Adhesive Remover dissolves glue cleanly without scraping.",
      ],
      ar: [
        "يختلط الغبار الصحراوي الناعم مع أبخرة الزيوت في حجرة المحرك والشاصي ليكوّن طبقة شحمية صلبة لا يستطيع الشامبو العادي إزالتها. لتنظيف المحركات والبطانات السفلية بكفاءة عالية، يوفر برميل Briller Heavy Duty Degreaser (سعة 20 لتر بسعر 300 ر.ق) ومنظف المحركات Grizzly ومنظف Sitrett MX5 قوة تفكيك فورية للشحوم والزيوت.",
        "وللتنظيف الشامل داخل وخارج السيارة (فواصل الأبواب، الدعاسات، المقاعد، والبلاستيك)، يتوفر منظف Briller Multi-Purpose Cleaner متعدد الاستخدامات (برميل 20 لتر بسعر عرض خاص 350 ر.ق بدلاً من 400 ر.ق) ومنظف Insta Finish Super APC القابل للتخفيف حسب نوع السطح. وعند إزالة التظليل القديم أو الملصقات، يضمن مزيل اللواصق Detainer إذابة الصمغ بأمان دون خدش الزجاج أو الطلاء.",
      ],
    },
    faqs: [
      {
        q: {
          en: "What is the price of 20L APC and Heavy Duty Degreaser drums in Qatar?",
          ar: "كم يبلغ سعر برميل المنظف متعدد الاستخدامات ومزيل الشحوم 20 لتر في قطر؟",
        },
        a: {
          en: "Briller Heavy Duty Degreaser (20L drum) is QAR 300, and Briller Multi-Purpose Cleaner APC (20L drum) is on special offer at QAR 350 (was QAR 400). Both are in stock at our Mesaimeer showroom.",
          ar: "يتوفر برميل مزيل الشحوم Briller Heavy Duty Degreaser (20 لتر) بسعر 300 ر.ق، وبرميل المنظف متعدد الاستخدامات Briller Multi-Purpose Cleaner (20 لتر) بسعر عرض خاص 350 ر.ق (بدلاً من 400 ر.ق).",
        },
      },
      {
        q: {
          en: "Can I use Detainer Adhesive Remover to remove old window tint glue?",
          ar: "هل يمكن استخدام مزيل الملصقات Detainer لإزالة صمغ التظليل القديم؟",
        },
        a: {
          en: "Yes. Detainer Sticker & Adhesive Remover softens stubborn window-tint adhesive, tar, and badge tape so it wipes away cleanly with a microfibre towel.",
          ar: "نعم، يعمل مزيل اللواصق Detainer على تفكيك صمغ التظليل القديم وبقع القار وأشرطة الشعارات ليتم مسحها بسهولة بمنشفة مايكروفايبر.",
        },
      },
      {
        q: {
          en: "Is Sitrett MX5 safe for multi-surface automotive and workshop cleaning?",
          ar: "هل منظف Sitrett MX5 مناسب لتنظيف المحركات والأسطح المتعددة؟",
        },
        a: {
          en: "Yes. Sitrett MX5 is a high-performance multi-surface cleaner trusted across Qatar for engine bays, rims, workshop tools, and stubborn upholstery stains when diluted or sprayed as directed.",
          ar: "نعم، يُعد Sitrett MX5 من أقوى المنظفات متعددة الأسطح في قطر لتنظيف حجرات المحرك والجنوط ومعدات الورش والبقع الصعبة.",
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
      en: "Shop concentrated luxury car & majlis fragrances in Doha, Qatar. ABK Mashmom & ABK Secret 250ml sprays (QAR 70) crafted for Gulf interiors. Same-day delivery.",
      ar: "تسوّق معطرات السيارات والمجالس الفاخرة المركزة في الدوحة، قطر. معطر ABK مشموم وABK سيكريت بحجم 250 مل (70 ر.ق) بثبات عالٍ وتوصيل سريع في قطر.",
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
      en: "Signature Gulf Scents",
      ar: "عطور ومعطرات خليجية فاخرة",
    },
    h1: {
      en: "Luxury Car & Majlis Fragrances in Doha, Qatar",
      ar: "معطرات السيارات والمجالس الفاخرة في الدوحة، قطر",
    },
    subtitle: {
      en: "Fine-fragrance oil concentrations formulated for automotive cabins, carpets, and majlis spaces — long-lasting scent throw without staining fabrics.",
      ar: "توليفات عطرية مركزة صُممت خصيصاً لمقصورات السيارات والسجاد والمجالس القطرية — ثبات طويل وفوحان راقٍ دون ترك أي أثر على الأقمشة.",
    },
    guideTitle: {
      en: "Crafting Heat-Stable Cabin & Majlis Fragrances for Qatar",
      ar: "ثبات وفوحان يدوم طويلاً في مقصورة سيارتك ومجلسك",
    },
    guideParagraphs: {
      en: [
        "Ordinary hanging paper air fresheners evaporate completely in two days of Doha summer heat and smell synthetic. ABK's proprietary 250 ml fragrance sprays (QAR 70 each) are blended with high-grade perfumery oils designed to bond gently into automotive floor mats, headliners, and majlis upholstery for days of refined projection.",
        "Choose between two signature Gulf profiles: ABK Mashmom (an authentic Qatari heritage bouquet of fresh basil/mashmom, white florals, and warm aromatic woods) and ABK Secret (a modern, sophisticated blend of crisp citrus, ambergris, and velvety musk that leaves every freshly detailed car smelling like a luxury showroom).",
      ],
      ar: [
        "تتبخر المعطرات الورقية التقليدية خلال يومين فقط في حرارة صيف الدوحة. لذلك طورت ABK بخاخات المعطرات الفاخرة بحجم 250 مل (بسعر 70 ر.ق للعبوة) بتركيز عالٍ من الزيوت العطرية النقية التي تثبت في أرضيات السيارة والمقاعد القماشية والمفارش لأيام طويلة دون ترك بقع.",
        "اختر بين توليفتين مميزتين: معطر ABK المشموم (عبق تراثي قطري أصيل يجمع بين الريحان والمشموم الطازج والزهور البيضاء والأخشاب الدافئة)، ومعطر ABK سيكريت (مزيج عصري فاخر من الحمضيات المنعشة والعنبر والمسك المخملي يمنح سيارتك رائحة صالات العرض الفاخرة).",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much are ABK Mashmom and ABK Secret fragrances in Qatar?",
          ar: "كم يبلغ سعر معطر ABK مشموم وABK سيكريت في قطر؟",
        },
        a: {
          en: "Both ABK Mashmom and ABK Secret come in generous 250 ml atomizer bottles priced at QAR 70 each, available at our Mesaimeer showroom or with same-day delivery across Doha.",
          ar: "يتوفر كل من معطر ABK مشموم ومعطر ABK سيكريت بعبوة بخاخ كبيرة سعة 250 مل بسعر 70 ريال قطري للعبوة، في معرضنا بمسيمير أو مع توصيل سريع في الدوحة.",
        },
      },
      {
        q: {
          en: "Where should I spray car fragrance so it lasts longest in Qatar's heat?",
          ar: "أين يُنصح برش المعطر داخل السيارة ليدوم أطول فترة ممكنة؟",
        },
        a: {
          en: "Mist 2 to 3 sprays onto clean fabric floor mats or under the front seats rather than directly onto hot leather or dashboard plastics. The carpet fibres hold the fragrance oils and release them gradually when the AC circulates.",
          ar: "يُنصح برش 2 إلى 3 بخات على دعاسات الأرضية القماشية النظيفة أو أسفل المقاعد الأمامية بدلاً من رشها على الجلد أو الطبلون الساخن، حيث تحتفظ ألياف السجاد بالزيوت العطرية وتنشرها مع هواء المكيف.",
        },
      },
      {
        q: {
          en: "Do detailing studios and car washes buy ABK fragrances as a finishing touch?",
          ar: "هل تستخدم مراكز التلميع والمغاسل معطرات ABK كخطوة نهائية؟",
        },
        a: {
          en: "Yes! Many detailing studios and VIP car washes in Doha use a mist of ABK Secret or ABK Mashmom before customer handover, and also retail the 250 ml bottles at their reception counter.",
          ar: "نعم! تعتمد العديد من مراكز التلميع ومغاسل VIP في الدوحة معطرات ABK المشموم وسيكريت كلمسة ختامية قبل تسليم السيارة للعميل، كما توفرها للبيع في صالات الاستقبال لديها.",
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
      en: "Official & Exclusive Qatar Distributor",
      ar: "الموزع الرسمي والحصري في قطر",
    },
    title: {
      en: "VTEK PPF & Solar Armor Window Tint in Doha, Qatar | Official Distributor",
      ar: "أفلام حماية الطلاء VTEK وتظليل Solar Armor في قطر | الموزع الحصري",
    },
    description: {
      en: "ABK Trading is the official Qatar distributor for VTEK (Vertek) Weather Armor TPU PPF & Solar Armor nano-ceramic window tint. Buy rolls or book Doha installation.",
      ar: "شركة ABK هي الموزع الرسمي والحصري لأفلام حماية الطلاء VTEK Weather Armor وتظليل النوافذ Solar Armor في قطر. اشترِ الرولات أو احجز التركيب في الدوحة.",
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
      en: "Official Qatar Distributor · USA",
      ar: "الموزع الرسمي والحصري في قطر · أمريكا",
    },
    h1: {
      en: "VTEK (Vertek) Paint Protection Film & Solar Armor Window Tint in Qatar",
      ar: "أفلام حماية الطلاء VTEK Weather Armor وتظليل النوافذ Solar Armor في قطر",
    },
    subtitle: {
      en: "100% aliphatic polycarbonate-infused TPU paint protection films (5 to 15-year warranties) and nano-ceramic solar window films — distributed and installed by ABK in Doha.",
      ar: "أفلام حماية الطلاء الأمريكية المصنوعة من البولي يوريثان الأليفاتي (بضمان 5 إلى 15 سنة) وأفلام العزل الحراري النانو سيراميك — توزيع وتركيب معتمد لدى ABK في الدوحة.",
    },
    guideTitle: {
      en: "VTEK Weather Armor PPF & Solar Armor Window Tint Lineup in Qatar",
      ar: "تشكيلة أفلام الحماية VTEK Weather Armor والعزل الحراري Solar Armor في قطر",
    },
    guideParagraphs: {
      en: [
        "As the exclusive authorized distributor of VTEK (formerly Vertek) in Qatar, ABK Trading & Service supplies the complete Weather Armor TPU Paint Protection Film range directly from our climate-controlled Mesaimeer warehouse: Weather Armor PRO (7.5 mil gloss TPU, 10-year warranty), Weather Armor PRO PLUS (8.0 mil ultra-gloss hydrophobic TPU, 12-year warranty), Weather Armor MATTE (8.0 mil satin stealth conversion, 5-year warranty), Weather Armor PRISM (8.5 mil colour-change TPU, 5-year warranty), and flagship Weather Armor ULTIMATE (polycarbonate-infused TPU, 15-year warranty).",
        "Alongside PPF, VTEK's Solar Armor window film series — VUE, APEX, and ICONIC — utilizes non-metallized nano-ceramic technology to reject up to 95% of infrared solar heat and 99%+ of UV rays in legal Qatar VLT shades. Want VTEK PPF installed on your vehicle? Use our online quote builder to book installed VTEK PPF packages in Doha starting from QAR 899 (front-end) and QAR 3,999 (full body), backed by both the registered VTEK manufacturer warranty and ABK's 12-month workmanship guarantee.",
      ],
      ar: [
        "بصفتها الموزع الرسمي والحصري لعلامة VTEK (المعروفة سابقاً بـ Vertek) في دولة قطر، توفر شركة ABK للتجارة والخدمات التشكيلة الكاملة من أفلام حماية الطلاء Weather Armor TPU مباشرة من مستودعاتنا المبردة في مسيمير: فيلم Weather Armor PRO (سماكة 7.5 ميل، ضمان 10 سنوات)، وفيلم Weather Armor PRO PLUS (سماكة 8.0 ميل فائق اللمعان، ضمان 12 سنة)، وفيلم Weather Armor MATTE المطفي (سماكة 8.0 ميل، ضمان 5 سنوات)، وفيلم Weather Armor PRISM الملون (سماكة 8.5 ميل، ضمان 5 سنوات)، والفئة العليا Weather Armor ULTIMATE (بضمان 15 سنة).",
        "وإلى جانب أفلام الحماية، تقدم سلسلة تظليل النوافذ VTEK Solar Armor (بفئاتها VUE وAPEX وICONIC) تقنية النانو سيراميك غير المعدنية لعزل ما يصل إلى 95% من الأشعة تحت الحمراء وأكثر من 99% من الأشعة فوق البنفسجية بدرجات شفافية متوافقة مع قانون المرور القطري. كما يمكن لملاك السيارات حجز باقات تركيب VTEK PPF الشاملة في الدوحة بأسعار ثابتة تبدأ من 899 ر.ق للواجهة و3,999 ر.ق لكامل السيارة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Is VTEK the same brand as Vertek PPF?",
          ar: "هل علامة VTEK هي نفسها Vertek PPF؟",
        },
        a: {
          en: "Yes. Vertek rebranded globally to VTEK while keeping the exact same American aliphatic TPU formulations (Weather Armor PRO, PRO PLUS, MATTE, PRISM, ULTIMATE) and Solar Armor nano-ceramic window films. ABK Trading & Service is the official Qatar distributor.",
          ar: "نعم، تم تحديث الاسم التجاري عالمياً من Vertek إلى VTEK مع الاحتفاظ بنفس التركيبات الأمريكية الأصلية لأفلام Weather Armor وتظليل Solar Armor، وشركة ABK هي الموزع الرسمي المعتمد في قطر.",
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
      en: "Autotriz Germany Ceramic Coatings & Polishes in Doha, Qatar | ABK",
      ar: "منتجات أوتوتريز الألمانية Autotriz للنانو سيراميك والتلميع في قطر | ABK",
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
        "Engineered in Germany with TÜV-certified nano-polysilazane chemistry, Autotriz delivers a unified detailing system from wash bay to final ceramic curing. At ABK Trading in Mesaimeer, we stock every stage of the Autotriz workflow: pre-wash with Autotriz Rich Foam Shampoo (20L drum: QAR 450 promo) and Hyper Wheel Cleaner (20L drum: QAR 400); correct paint defects with Heavy Cut 901, Extreme Cut 801 (1L: QAR 160), Power Cut 701 (4L: QAR 280), One Step Polish (4L: QAR 265), and Ultimate Polish 302 (QAR 135) paired with the 8-inch Double-Sided Wool Pad (QAR 75).",
        "For long-term surface protection, choose between Autotriz 3D Matrix Ultra (QAR 280), 3D Matrix Hybrid (QAR 280), REVO +15 (QAR 250), ION+ +15 (QAR 250), V-9 3D Matrix 9H, Leather & Vinyl Coating (QAR 280), and Fabric & Textile Guard (QAR 280). PPF installers also rely on Autotriz PPF Gel (4L: QAR 150 | 20L: QAR 500) and PPF Refresh (1L: QAR 130) for crystal-clear film fitting and maintenance.",
      ],
      ar: [
        "بفضل تقنية البوليسيلازان الألمانية المعتمدة من TÜV، تقدم علامة Autotriz منظومة متكاملة تبدأ من مرحلة الغسيل وحتى الحماية النهائية بالنانو سيراميك. توفر ABK في معرض مسيمير جميع مراحل العمل: الغسيل التحضيري بشامبو Autotriz Rich Foam (برميل 20 لتر بسعر عرض 450 ر.ق) ومنظف الجنوط Hyper Wheel Cleaner (20 لتر بسعر 400 ر.ق)؛ ثم تصحيح الطلاء بمركبات Heavy Cut 901 وExtreme Cut 801 (160 ر.ق) وPower Cut 701 (4 لتر: 280 ر.ق) وOne Step Polish (4 لتر: 265 ر.ق) وUltimate Polish 302 (135 ر.ق) مع وسادة الصوف المزدوجة مقاس 8 إنش (75 ر.ق).",
        "وللحماية الفائقة طويلة الأمد، تتوفر أطقم النانو سيراميك 3D Matrix Ultra (280 ر.ق)، و3D Matrix Hybrid (280 ر.ق)، وREVO +15 (250 ر.ق)، وION+ +15 (250 ر.ق)، إلى جانب حماية المقصورة Leather & Vinyl (280 ر.ق) وFabric & Textile Guard (280 ر.ق). كما تعتمد مراكز تركيب الأفلام على جل التركيب Autotriz PPF Gel (4 لتر: 150 ر.ق | 20 لتر: 500 ر.ق) وبخاخ الصيانة PPF Refresh (130 ر.ق).",
      ],
    },
    faqs: [
      {
        q: {
          en: "Where can I buy genuine Autotriz products in Doha, Qatar?",
          ar: "أين يمكنني شراء منتجات Autotriz الألمانية الأصلية في الدوحة، قطر؟",
        },
        a: {
          en: "ABK Trading & Service in Mesaimeer, Doha is the authorized Qatar distributor for Autotriz Germany. Order online for same-day delivery or visit Showroom no. 2, Building 1306, Street 70, Zone 56.",
          ar: "شركة ABK للتجارة والخدمات في مسيمير، الدوحة هي الموزع المعتمد لعلامة Autotriz الألمانية في قطر. يمكنك الطلب عبر الموقع للتوصيل في نفس اليوم أو زيارة معرضنا في المنطقة 56، شارع 70، مبنى 1306.",
        },
      },
      {
        q: {
          en: "What is the difference between Autotriz 3D Matrix Ultra and REVO +15?",
          ar: "ما الفرق بين سيراميك Autotriz 3D Matrix Ultra وREVO +15؟",
        },
        a: {
          en: "3D Matrix Ultra (QAR 280) is Autotriz's flagship high-build 9H polysilazane coating engineered for maximum multi-year abrasion and chemical resistance. REVO +15 (QAR 250) is a rapid-cure nano-ceramic formula delivering extreme water-beading and slickness with faster installation flashes.",
          ar: "يُعد 3D Matrix Ultra (280 ر.ق) الطلاء الرائد بصلابة 9H لمقاومة الخدوش الدقيقة والكيماويات لعدة سنوات، بينما يتميز REVO +15 (250 ر.ق) بسرعة الجفاف والتطبيق مع نعومة فائقة وطرد مذهل للمياه.",
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
      en: "Briller Car Care (Canada) 20L Wash & Detailing Drums in Qatar | ABK",
      ar: "منتجات بريلر الكندية Briller Car Care وعبوات 20 لتر في قطر | ABK",
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
        "Running a profitable car wash, detailing studio, or fleet maintenance bay in Qatar requires concentrated chemicals that perform reliably in desalinated water while keeping cost-per-vehicle low. Briller Car Care (Canada) packages its entire professional line in 20-litre drums with transparent published QAR pricing at ABK Trading: Car Shampoo Wash & Wax (QAR 350 promo, was QAR 400), Multi-Purpose Cleaner APC (QAR 350 promo, was QAR 400), Heavy Duty Degreaser (QAR 300), and Alloy Rim Cleaner (QAR 250).",
        "To finish every vehicle to showroom standard, pair your wash bay with Briller Crystal Clear Glass Cleaner (20L drum: QAR 265), Briller Quick Tyre Shine (20L drum: QAR 280), Briller Quick Dressing for plastics and engine bays (20L drum: QAR 450), and convenient Briller Tyre Foam aerosols.",
      ],
      ar: [
        "يتطلب تشغيل مغسلة سيارات أو مركز تلميع ناجح في قطر مواد كيميائية مركزة تعمل بكفاءة عالية مع المياه المحلاة وتوفر أقل تكلفة تشغيلية لكل سيارة. تقدم علامة Briller Car Care الكندية خطها الاحترافي الكامل ببراميل سعة 20 لتر بأسعار معلنة ومباشرة لدى ABK: شامبو الغسيل والشمع Wash & Wax (بسعر عرض 350 ر.ق بدلاً من 400 ر.ق)، المنظف الشامل Multi-Purpose Cleaner (بسعر عرض 350 ر.ق بدلاً من 400 ر.ق)، مزيل الشحوم القوي Heavy Duty Degreaser (300 ر.ق)، ومنظف الجنوط Alloy Rim Cleaner (250 ر.ق).",
        "ولإنهاء كل سيارة بمظهر الوكالة، استكمل تجهيز مركزك بمنظف الزجاج Crystal Clear Glass Cleaner (20 لتر: 265 ر.ق)، وملمع الإطارات Quick Tyre Shine (20 لتر: 280 ر.ق)، وملمع البلاستيك والمحركات Quick Dressing (20 لتر: 450 ر.ق)، بالإضافة إلى عبوات رغوة الإطارات الجاهزة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Can I order a full set of Briller 20L drums with delivery in Doha?",
          ar: "هل يمكنني طلب مجموعة كاملة من براميل Briller سعة 20 لتر مع التوصيل في الدوحة؟",
        },
        a: {
          en: "Yes! All seven Briller 20L drums are stocked at our Mesaimeer warehouse. Orders over QAR 250 qualify for free delivery across Doha, Lusail, Al Rayyan, and Al Wakrah.",
          ar: "نعم! جميع براميل Briller السبعة سعة 20 لتر متوفرة في مستودعنا بمسيمير، والطلبات التي تزيد عن 250 ر.ق تحصل على توصيل مجاني في الدوحة ولوسيل والريان والوكرة.",
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
      en: "Authorized Qatar Distributor",
      ar: "الموزع المعتمد في قطر",
    },
    title: {
      en: "Grizzly PPF Rolls (QAR 1,200), One-Step Polish & Car Care in Qatar",
      ar: "أفلام حماية الطلاء Grizzly PPF (1,200 ر.ق) ومنتجات العناية الأمريكية في قطر",
    },
    description: {
      en: "Shop Grizzly Self-Healing TPU PPF rolls (QAR 1,200), One Step Polish 3-in-1 (QAR 115), Carnauba Wax, Spray Wax, Rim/Engine Cleaners & 20kg Touchless Powder in Doha.",
      ar: "تسوّق رولات حماية الطلاء Grizzly TPU (1,200 ر.ق)، ملمع الخطوة الواحدة 3 في 1 (115 ر.ق)، شمع الكارنوبا، منظف الجنوط والمحرك وبودرة الغسيل 20 كجم في الدوحة.",
    },
    keywords: {
      en: [
        "Grizzly PPF Qatar",
        "Grizzly One Step Polish Doha",
        "Grizzly car care Qatar",
        "TPU PPF roll 1200 QAR",
        "Grizzly touchless wash powder Qatar",
      ],
      ar: [
        "أفلام حماية جريزلي قطر",
        "بولش جريزلي 3 في 1 الدوحة",
        "منتجات جريزلي الامريكية للسيارات",
        "رول حماية الطلاء 1200 ريال",
        "بودرة غسيل سيارات بدون لمس جريزلي",
      ],
    },
    eyebrow: {
      en: "American PPF & Detailing Line",
      ar: "أفلام الحماية ومنتجات العناية الأمريكية",
    },
    h1: {
      en: "Grizzly — Self-Healing TPU PPF, 3-in-1 Polish & Car Care in Doha, Qatar",
      ar: "جريزلي الأمريكية (Grizzly) — أفلام الحماية TPU ومواد التلميع والعناية في قطر",
    },
    subtitle: {
      en: "High-value American surface protection: QAR 1,200 self-healing 7.5 mil TPU paint protection film master rolls, QAR 115 One Step 3-in-1 Polish, carnauba waxes, and heavy-duty cleaners.",
      ar: "أداء أمريكي بقيمة استثنائية: رولات حماية الطلاء TPU ذاتية المعالجة بسماكة 7.5 ميل (1,200 ر.ق)، وملمع الخطوة الواحدة 3 في 1 (115 ر.ق)، وشموع الكارنوبا والمنظفات القوية.",
    },
    guideTitle: {
      en: "Inside the Grizzly Product Line Stocked in Doha",
      ar: "تشكيلة منتجات Grizzly الأمريكية المتوفرة في الدوحة",
    },
    guideParagraphs: {
      en: [
        "Grizzly combines American performance engineering with accessible retail and workshop pricing. Its standout product in Qatar is the Grizzly Self-Healing TPU Paint Protection Film (190 microns / 7.5 mil thickness, 1.52m × 15m full master roll) at a published price of QAR 1,200 — making genuine aliphatic TPU protection accessible to independent installers, body shops, and car owners.",
        "In the polishing and maintenance bay, Grizzly One Step Polish 3-in-1 (1L: QAR 115) cuts swirls, polishes to a mirror gloss, and leaves a protective seal in a single pass. Round out your kit with Grizzly Carnauba Paste Wax, Spray Wax, Rim Cleaner, Engine Cleaner, and 20 kg Touchless Car Wash Powder sacks for commercial tunnel and pressure-wash bays.",
      ],
      ar: [
        "تجمع علامة Grizzly الأمريكية بين الجودة العالية والتسعير التنافسي للأفراد والمراكز. ويُعد رول حماية الطلاء Grizzly Self-Healing TPU PPF (بسماكة 190 ميكرون / 7.5 ميل، ومقاس 1.52م × 15م) بسعره المعلن 1,200 ريال قطري فقط من أكثر الرولات طلباً لدى مراكز التركيب والورش وملاك السيارات الباحثين عن حماية TPU حقيقية بسعر اقتصادي.",
        "وفي قسم التلميع والعناية، يتألق ملمع Grizzly One Step Polish 3-in-1 (حجم 1 لتر بسعر 115 ر.ق) بقدرته على إزالة الدوائر الخفيفة والتلميع وإضافة طبقة حماية في خطوة واحدة، إلى جانب شمع الكارنوبا الصلب والبخاخ، ومنظف الجنوط، ومنظف المحرك، وأكياس بودرة الغسيل اللاتلامسي سعة 20 كجم للمغاسل.",
      ],
    },
    faqs: [
      {
        q: {
          en: "What are the specs of the QAR 1,200 Grizzly PPF roll?",
          ar: "ما هي مواصفات رول حماية الطلاء Grizzly بسعر 1,200 ر.ق؟",
        },
        a: {
          en: "It is a full 1.52m × 15m (5ft × 50ft) master roll of 190-micron (7.5 mil) optical TPU paint protection film with a heat-activated self-healing topcoat and hydrophobic surface.",
          ar: "يأتي الرول الرئيسي بمقاس كامل 1.52م × 15م وسماكة 190 ميكرون (7.5 ميل) من مادة TPU الشفافة مع طبقة علوية ذاتية المعالجة للخدوش بالحرارة وطاردة للمياه.",
        },
      },
      {
        q: {
          en: "Can Grizzly One Step Polish 3-in-1 be used with both DA and Rotary polishers?",
          ar: "هل يعمل ملمع Grizzly 3-in-1 مع أجهزة التلميع المدارية والدوارة؟",
        },
        a: {
          en: "Yes. At QAR 115 for a 1-litre bottle, Grizzly One Step Polish works seamlessly with GrünesAuto DA or Rotary medium foam pads (QAR 30) to remove light-to-moderate swirls and leave a wax-sealed finish.",
          ar: "نعم، يعمل ملمع Grizzly 3-in-1 (حجم 1 لتر بسعر 115 ر.ق) بكفاءة ممتازة مع وسائد الإسفنج المتوسطة GrünesAuto سواء على أجهزة DA أو Rotary.",
        },
      },
      {
        q: {
          en: "How is Grizzly 20kg Touchless Car Wash Powder used?",
          ar: "كيف تُستخدم بودرة الغسيل بدون لمس Grizzly بوزن 20 كجم؟",
        },
        a: {
          en: "It is an industrial active-foam powder designed for commercial car washes and fleet bays: dissolve in water per your dosing tank ratio, spray onto the vehicle to break down road film and desert dust, and pressure-rinse clean.",
          ar: "صُممت البودرة للمغاسل التجارية وأساطيل السيارات؛ تُذاب في خزان الرغوة وفق نسبة التخفيف المعتمدة، وتُرش على السيارة لتفكيك الأتربة والأغشية الدهنية ثم تُشطف بماء الضغط العالي دون الحاجة للفرك اليدوي.",
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
      en: "GrünesAuto German 6-Inch Foam Polishing Pads in Doha, Qatar (QAR 30)",
      ar: "وسائد وإسفنجات التلميع الألمانية GrünesAuto مقاس 6 إنش في قطر (30 ر.ق)",
    },
    description: {
      en: "Buy German-engineered GrünesAuto 6-inch DA (Dual Action) & Rotary foam polishing pads in Doha, Qatar — Step 1 Heavy Cut, Step 2 Medium & Step 3 Finishing at QAR 30.",
      ar: "اشترِ وسائد وإسفنجات التلميع الألمانية GrünesAuto مقاس 6 إنش لأجهزة DA وRotary في الدوحة، قطر — الخطوة 1 قطع، الخطوة 2 متوسط، والخطوة 3 تنعيم بسعر 30 ر.ق.",
    },
    keywords: {
      en: [
        "GrunesAuto pads Qatar",
        "foam polishing pads Doha",
        "6 inch DA polishing pad Qatar",
        "rotary buffing pads Doha",
        "German foam pads car detailing Qatar",
      ],
      ar: [
        "اسفنج تلميع السيارات قطر",
        "وسائد بوليش المانية الدوحة",
        "بف تلميع 6 انش قطر",
        "ادوات تصحيح الطلاء قطر",
      ],
    },
    eyebrow: {
      en: "German Reticulated Foam Technology",
      ar: "تقنية الإسفنج الشبكي الألمانية",
    },
    h1: {
      en: "GrünesAuto (Germany) — 6-Inch DA & Rotary Foam Polishing Pads in Qatar",
      ar: "جرينز أوتو الألمانية (GrünesAuto) — وسائد التلميع الإسفنجية مقاس 6 إنش في قطر",
    },
    subtitle: {
      en: "Color-coded Step 1 Heavy Cut, Step 2 Medium Polish, and Step 3 Finishing pads engineered from open-cell German foam for Dual Action and Rotary polishers — QAR 30 per pad.",
      ar: "وسائد تلميع مرقمة للخطوة 1 (قطع قوي) والخطوة 2 (تلميع متوسط) والخطوة 3 (تنعيم نهائي) من الإسفنج الألماني مفتوح المسام لأجهزة DA وRotary — بسعر 30 ر.ق للقطعة.",
    },
    guideTitle: {
      en: "Matching GrünesAuto Step 1, Step 2 & Step 3 Pads to Your Machine",
      ar: "كيف تختار وسادة GrünesAuto المناسبة لجهاز التلميع لديك",
    },
    guideParagraphs: {
      en: [
        "Polishing in warm Gulf workshops puts extreme thermal stress on cheap foam pads, causing Velcro backing failure and foam collapse mid-panel. GrünesAuto 6-inch pads (QAR 30 each) are manufactured from high-resilience German reticulated foam with heat-dissipating profiles and heavy-duty hook-and-loop backing.",
        "We stock two dedicated geometries across all three correction steps: bevelled center-vented DA (Dual Action / Orbital) pads that channel heat away from the spindle on long-throw polishers, and full-contact Rotary pads engineered for smooth, chatter-free tracking on rotary buffers.",
      ],
      ar: [
        "يؤدي التلميع في أجواء الخليج الحارة إلى تلف الإسفنجات التجارية الرخيصة وانفصال طبقة الفيلكرو بسرعة. صُنعت وسائد GrünesAuto مقاس 6 إنش (بسعر 30 ر.ق للقطعة) من الإسفنج الشبكي الألماني عالي التحمل مع فتحات تبريد ولاصق خلفي فائق القوة.",
        "نوفر تصميمين مخصصين لجميع المراحل الثلاث (Step 1 للقطع، Step 2 للمتوسط، Step 3 للتنعيم): وسائد أجهزة التلميع المدارية (DA) المزودة بفتحة تهوية مركزية وحواف مشطوفة لتبديد الحرارة، ووسائد أجهزة التلميع الدوارة (Rotary) المصممة لثبات مثالي وانسيابية عالية على الأسطح.",
      ],
    },
    faqs: [
      {
        q: {
          en: "How much are GrünesAuto 6-inch polishing pads in Qatar?",
          ar: "كم يبلغ سعر إسفنجة التلميع GrünesAuto مقاس 6 إنش في قطر؟",
        },
        a: {
          en: "Every GrünesAuto 6-inch foam pad — whether DA or Rotary, Step 1 Heavy Cut, Step 2 Medium Polish, or Step 3 Finishing — is priced at QAR 30 at ABK Trading.",
          ar: "تتوفر جميع وسائد التلميع الألمانية GrünesAuto مقاس 6 إنش (سواء لأجهزة DA أو Rotary ولجميع المراحل 1 و2 و3) بسعر موحد يبلغ 30 ريال قطري للقطعة.",
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
          en: "Pair Step 1 Heavy Cut with Autotriz Heavy Cut 901 or Extreme Cut 801; pair Step 2 Medium Polish with Grizzly One Step 3-in-1 or Autotriz One Step Polish; and pair Step 3 Finishing with Autotriz Ultimate Polish 302.",
          ar: "استخدم الخطوة 1 مع كومباوند القطع القوي Autotriz 901 أو 801؛ والخطوة 2 مع ملمع الخطوة الواحدة Grizzly 3-in-1 أو Autotriz One Step؛ والخطوة 3 مع الملمع النهائي Autotriz Ultimate Polish 302.",
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
      en: "ABK Rejuvenate Plastic Restorer & Luxury Car Fragrances in Qatar",
      ar: "مجدد البلاستيك الفرنسي ABK Rejuvenate ومعطرات ABK الفاخرة في قطر",
    },
    description: {
      en: "Shop ABK proprietary products in Doha, Qatar: French-made ABK Rejuvenate Plastic Restorer (60ml QAR 40 to 500ml QAR 280) & ABK Mashmom / Secret 250ml fragrances (QAR 70).",
      ar: "تسوّق منتجات علامة ABK الحصرية في الدوحة، قطر: مجدد البلاستيك الفرنسي ABK Rejuvenate (من 40 ر.ق إلى 280 ر.ق) ومعطرات المشموم وسيكريت 250 مل (70 ر.ق).",
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
      en: "ABK Signature Range — French Plastic Restorer & Gulf Cabin Fragrances",
      ar: "مجموعة ABK الخاصة — مجدد البلاستيك الفرنسي ومعطرات المقصورة والمجالس",
    },
    subtitle: {
      en: "Developed specifically for Qatar's climate and automotive culture: French-manufactured ABK Rejuvenate trim restorer and long-lasting Mashmom & Secret 250ml sprays.",
      ar: "طُوّرت خصيصاً لتلائم مناخ قطر وذائقة ملاك السيارات: مجدد البلاستيك الفرنسي ABK Rejuvenate، ومعطرات المشموم وسيكريت المركزة بحجم 250 مل.",
    },
    guideTitle: {
      en: "Built by ABK for Qatar's Sun, SUVs & Majlis",
      ar: "منتجات صممتها ABK خصيصاً لأجواء وسيارات قطر",
    },
    guideParagraphs: {
      en: [
        "When we couldn't find an off-the-shelf trim restorer that survived a full Doha summer without turning sticky or washing off, we partnered with a specialty French chemical laboratory to produce ABK Rejuvenate Plastic Restorer. Available in 60 ml (QAR 40 promo), 250 ml (QAR 180), 350 ml (QAR 220), and 500 ml (QAR 280), it restores deep OEM satin-black richness to faded SUV bumpers, fender flares, mirror housings, and engine plastics for 6+ months.",
        "Complementing our exterior restoration formula are ABK Mashmom and ABK Secret (250 ml atomizers at QAR 70 each) — high-oil-concentration cabin and majlis sprays crafted for heat stability and refined projection.",
      ],
      ar: [
        "صُمم مجدد البلاستيك الفرنسي ABK Rejuvenate خصيصاً ليتحمل شمس الدوحة الحارقة دون أن يترك ملمساً دهنياً يجمع الغبار أو يزول مع الغسيل. يتوفر بأربعة أحجام (60 مل بسعر عرض 40 ر.ق، 250 مل بسعر 180 ر.ق، 350 مل بسعر 220 ر.ق، و500 مل بسعر 280 ر.ق) ليعيد اللون الأسود الوكالي للصدامات والرفارف وأغطية المحرك لأكثر من 6 أشهر.",
        "وتكتمل المجموعة بمعطرات المقصورة والمجالس ABK المشموم وABK سيكريت (عبوة 250 مل بسعر 70 ر.ق) بتركيز زيتي عالٍ يمنح سيارتك ومجلسك فوحاناً فاخراً وثباتاً يدوم طويلاً.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Where is ABK Rejuvenate Plastic Restorer manufactured?",
          ar: "أين يُصنّع مجدد البلاستيك ABK Rejuvenate؟",
        },
        a: {
          en: "ABK Rejuvenate is manufactured in France exclusively for ABK Trading & Service in Qatar.",
          ar: "يُصنّع ABK Rejuvenate في فرنسا حصرياً لصالح شركة ABK للتجارة والخدمات في قطر.",
        },
      },
      {
        q: {
          en: "Which size of ABK Rejuvenate should I buy for one SUV?",
          ar: "أي حجم من ABK Rejuvenate يكفي لسيارة دفع رباعي واحدة؟",
        },
        a: {
          en: "The 60 ml bottle (on special offer at QAR 40, was QAR 50) easily covers all exterior plastic trim, bumpers, and fender flares on a full-size SUV with product to spare.",
          ar: "تكفي عبوة 60 مل (بسعر عرض 40 ر.ق بدلاً من 50 ر.ق) لتجديد جميع الأجزاء البلاستيكية الخارجية والصدامات لسيارة دفع رباعي كاملة بكل سهولة.",
        },
      },
      {
        q: {
          en: "Can I smell ABK Mashmom and Secret at your Doha showroom?",
          ar: "هل يمكنني تجربة معطرات ABK في معرضكم بالدوحة؟",
        },
        a: {
          en: "Yes! Visit our Mesaimeer showroom (Showroom no. 2, Building 1306, Street 70, Zone 56) Saturday to Thursday to test both scents in person.",
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
      en: "Insta Finish (USA) Butter Wet Wax, Super APC & Shampoo in Qatar",
      ar: "منتجات إنستا فينش الأمريكية Insta Finish للسيارات في الدوحة، قطر",
    },
    description: {
      en: "Buy genuine USA-made Insta Finish car care products in Doha, Qatar: Butter Wet Wax, Clean N Shine, Super APC & Maxi Suds Cherry Shampoo at ABK Trading.",
      ar: "اشترِ منتجات Insta Finish الأمريكية الأصلية في الدوحة، قطر: شمع Butter Wet Wax، ملمع Clean N Shine، منظف Super APC وشامبو الكرز Maxi Suds لدى ABK.",
    },
    keywords: {
      en: [
        "Insta Finish Qatar",
        "Butter Wet Wax Doha",
        "Insta Finish Super APC Qatar",
        "Maxi Suds shampoo Qatar",
        "American car wax Doha",
      ],
      ar: [
        "منتجات انستا فينش قطر",
        "شمع بتر ويت واكس الدوحة",
        "منظف سوبر APC الامريكي",
        "شامبو ماكسي سدز قطر",
      ],
    },
    eyebrow: {
      en: "Classic American Detailing Chemistry",
      ar: "منتجات العناية الأمريكية الأصيلة",
    },
    h1: {
      en: "Insta Finish (USA) — Butter Wet Wax, Super APC & Wash Shampoos in Qatar",
      ar: "إنستا فينش الأمريكية (Insta Finish) — شمع Butter Wet Wax والمنظفات في قطر",
    },
    subtitle: {
      en: "Proven California detailing formulations: pure Brazilian carnauba Butter Wet Wax, Clean N Shine quick detailer, Super APC, and Maxi Suds Cherry Shampoo.",
      ar: "تركيبات كاليفورنيا الشهيرة للعناية بالسيارات: شمع الكارنوبا السائل Butter Wet Wax، وملمع Clean N Shine السريع، ومنظف Super APC، وشامبو Maxi Suds برائحة الكرز.",
    },
    guideTitle: {
      en: "Showroom Depth & Versatile Cleaning with Insta Finish USA",
      ar: "لمعان استثنائي وتنظيف احترافي مع Insta Finish الأمريكية",
    },
    guideParagraphs: {
      en: [
        "Manufactured in California for dealership prep centers and professional detailers, Insta Finish is renowned for ease of use in warm climates. Insta Finish Butter Wet Wax blends natural carnauba with polymers that melt into paintwork for an ultra-deep wet look that wipes off effortlessly without chalky white residue.",
        "For daily maintenance and decontamination, pair Maxi Suds Cherry Shampoo (high-sudsing, pH-balanced lubricity) with Clean N Shine spray detailer for quick fingerprint and dust removal, and Super All Purpose Cleaner (APC) for interior carpets, door panels, and exterior bug/road grime.",
      ],
      ar: [
        "صُنعت منتجات Insta Finish في كاليفورنيا بالولايات المتحدة لتلبية متطلبات صالات عرض السيارات ومراكز التلميع، وتشتهر بسهولة استخدامها حتى في الأجواء الدافئة. يمزج شمع Butter Wet Wax بين الكارنوبا البرازيلية الطبيعية والبوليمرات ليمنح الطلاء لمعاناً عميقاً ومظهراً رطباً يُمسح بسهولة فائقة دون ترك بقايا بيضاء.",
        "وللعناية اليومية والتنظيف الشامل، اجمع بين شامبو Maxi Suds الغني بالرغوة وبرائحة الكرز المنعشة، وبخاخ التلميع السريع Clean N Shine لإزالة البصمات والغبار الخفيف، ومنظف Super APC القوي لتنظيف السجاد والديكورات الداخلية.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Can Insta Finish Butter Wet Wax be applied by hand or machine?",
          ar: "هل يمكن تطبيق شمع Butter Wet Wax يدوياً أم بجهاز التلميع؟",
        },
        a: {
          en: "Both! Apply a thin layer by hand with a foam applicator or with a GrünesAuto Step 3 Finishing Pad on a DA polisher, let it haze briefly, and buff off with an edgeless microfibre towel.",
          ar: "كلاهما! يمكن توزيع طبقة رقيقة يدوياً بإسفنجة التطبيق أو باستخدام وسادة التنعيم GrünesAuto Step 3 على جهاز التلميع المداري، ثم مسحها بمنشفة مايكروفايبر بدون حواف.",
        },
      },
      {
        q: {
          en: "Where can I order Insta Finish products in Qatar?",
          ar: "كيف يمكنني طلب منتجات Insta Finish في قطر؟",
        },
        a: {
          en: "Add any Insta Finish product to your cart on abktradingservice.com or message our Mesaimeer showroom on WhatsApp (+974 3083 8355) for retail or trade pricing.",
          ar: "يمكنك إضافة منتجات Insta Finish إلى سلة الطلب عبر الموقع أو التواصل مباشرة مع معرضنا في مسيمير عبر واتساب (+974 3083 8355).",
        },
      },
      {
        q: {
          en: "Is Insta Finish Super APC dilutable?",
          ar: "هل يمكن تخفيف منظف Insta Finish Super APC بالماء؟",
        },
        a: {
          en: "Yes. Dilute around 1:10 to 1:15 for interior fabrics, vinyl, and leather prep, or 1:4 for heavier exterior wheel arches, tyres, and door jambs.",
          ar: "نعم، يمكن تخفيفه بنسبة 1:10 إلى 1:15 للأقمشة والديكورات الداخلية، أو بنسبة 1:4 لتنظيف الإطارات وبطانات العجلات وفواصل الأبواب.",
        },
      },
    ],
  },
  {
    slug: "getsun",
    brandKey: "Getsun",
    matchBrandKeys: ["Getsun"],
    origin: { en: "International", ar: "عالمية" },
    roleBadge: {
      en: "Authorized Qatar Retailer & Wholesaler",
      ar: "موزع تجزئة وجملة معتمد في قطر",
    },
    title: {
      en: "Getsun Scratch Remover, Spray Polish & Leather Wax in Doha, Qatar",
      ar: "منتجات جيتسون Getsun لإزالة الخدوش وتلميع السيارات في الدوحة، قطر",
    },
    description: {
      en: "Shop Getsun Scratch Remover, Spray Polish, and Leather & Tyre Wax in Doha, Qatar. Quick DIY paint care and interior conditioning stocked at ABK Mesaimeer.",
      ar: "تسوّق معجون إزالة الخدوش Getsun وبخاخ التلميع وشمع الجلد والإطارات في الدوحة، قطر. حلول عملية وسريعة للعناية بسيارتك متوفرة لدى ABK مسيمير.",
    },
    keywords: {
      en: [
        "Getsun Qatar",
        "Getsun scratch remover Doha",
        "Getsun spray polish Qatar",
        "Getsun leather and tyre wax",
      ],
      ar: [
        "منتجات جيتسون قطر",
        "مزيل خدوش السيارة جيتسون",
        "ملمع جيتسون بخاخ الدوحة",
        "ملمع جلد واطارات جيتسون",
      ],
    },
    eyebrow: {
      en: "Quick DIY Maintenance",
      ar: "حلول العناية السريعة والعملية",
    },
    h1: {
      en: "Getsun — Scratch Remover, Spray Polish & Leather/Tyre Care in Qatar",
      ar: "جيتسون (Getsun) — معجون إزالة الخدوش وبخاخات التلميع السريع في قطر",
    },
    subtitle: {
      en: "Convenient, fast-acting maintenance essentials for car owners in Qatar: spot scratch removal compound, aerosol spray polish, and multi-surface leather & tyre wax.",
      ar: "منتجات عملية وسريعة المفعول لملاك السيارات في قطر: معجون معالجة الخدوش السطحية، وبخاخ التلميع الفوري، وشمع العناية بالجلد والإطارات.",
    },
    guideTitle: {
      en: "Fast Touch-Up & Everyday Car Care with Getsun",
      ar: "عناية يومية سريعة ومعالجة فورية للخدوش البسيطة",
    },
    guideParagraphs: {
      en: [
        "Not every mark requires a full machine paint-correction session. Fingernail scratches inside door handle cups, light parking-lot paint transfer, and surface oxidation around keyholes can be buffed out by hand in minutes using Getsun Scratch Remover and a microfibre towel.",
        "For quick weekend turnarounds before a drive or gathering, Getsun Spray Polish restores surface slickness across painted panels and chrome trim, while Getsun Leather & Tyre Wax conditions vinyl dashboards, door cards, and tyre sidewalls with a protective sheen.",
      ],
      ar: [
        "لا تتطلب كل خدشة بسيطة جلسة تلميع كاملة بالماكينة؛ إذ يمكن معالجة خدوش الأظافر خلف مقابض الأبواب، وآثار الاحتكاك السطحي البسيط في المواقف يدوياً خلال دقائق معدودة باستخدام معجون Getsun Scratch Remover ومنشفة مايكروفايبر.",
        "ولإضفاء لمعة سريعة قبل الخروج، يمنح بخاخ Getsun Spray Polish نعومة ولمعاناً فورياً للطلاء والكروم، بينما يعتني Getsun Leather & Tyre Wax بالديكورات الداخلية والإطارات في خطوة واحدة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "Does Getsun Scratch Remover work on deep scratches that catch a fingernail?",
          ar: "هل يزيل معجون Getsun الخدوش العميقة التي وصلت إلى الأساس؟",
        },
        a: {
          en: "Getsun Scratch Remover is designed for clearcoat-level scuffs, fingernail marks under door handles, and light paint transfer. If a scratch has penetrated through the clearcoat into primer or metal, it will soften the edges to make it less visible.",
          ar: "صُمم معجون Getsun لإزالة الخدوش السطحية في طبقة اللكر وآثار الاحتكاك الخفيف وخدوش مقابض الأبواب. أما الخدوش العميقة التي اخترقت الطلاء فيقوم بتنعيم حوافها لتصبح أقل وضوحاً.",
        },
      },
      {
        q: {
          en: "Can I order Getsun products in bulk cartons for an auto accessories shop?",
          ar: "هل تتوفر منتجات Getsun بالكرتون لمحلات زينة السيارات والمغاسل؟",
        },
        a: {
          en: "Yes! ABK supplies Getsun both individually for car owners and in wholesale master cartons for auto accessory retailers and car washes across Qatar.",
          ar: "نعم! توفر ABK منتجات Getsun بالقطعة للأفراد وبالكرتون التجاري لمحلات إكسسوارات السيارات والمغاسل في جميع أنحاء قطر.",
        },
      },
      {
        q: {
          en: "How can I check stock and prices for Getsun in Doha?",
          ar: "كيف يمكنني الاستفسار عن أسعار وتوفر منتجات Getsun في الدوحة؟",
        },
        a: {
          en: "Click any Getsun product below to add to your order cart or message us on WhatsApp (+974 3083 8355) for instant confirmation.",
          ar: "اختر المنتج المطلوب أدناه لإضافته إلى سلة الطلب أو تواصل معنا عبر واتساب (+974 3083 8355) للرد الفوري.",
        },
      },
    ],
  },
  {
    slug: "sitrett",
    brandKey: "Other",
    matchBrandKeys: ["Other", "SmartCar"],
    origin: { en: "Turkey / Europe", ar: "تركيا / أوروبا" },
    roleBadge: {
      en: "Authorized Qatar Supplier",
      ar: "المورد المعتمد في قطر",
    },
    title: {
      en: "Sitrett MX5 Heavy-Duty Multi-Surface Degreaser in Doha, Qatar | ABK",
      ar: "منظف ومزيل الشحوم القوي سيتريت Sitrett MX5 في الدوحة، قطر | ABK",
    },
    description: {
      en: "Buy genuine Sitrett MX5 heavy-duty multi-surface degreaser & cleaner in Doha, Qatar. Dissolves engine grease, brake dust, carpet stains & workshop grime.",
      ar: "اشترِ منظف ومزيل الشحوم الأصلي Sitrett MX5 في الدوحة، قطر. يزيل شحوم المحرك، غبار الفرامل، بقع المقاعد المستعصية والزيوت بكفاءة فائقة.",
    },
    keywords: {
      en: [
        "Sitrett MX5 Qatar",
        "Sitrett cleaner Doha",
        "heavy duty degreaser car Qatar",
        "multi surface cleaner Sitrett MX5",
      ],
      ar: [
        "منظف سيتريت MX5 قطر",
        "سيتريت ام اكس 5 الدوحة",
        "مزيل شحوم المحرك سيتريت",
        "منظف شامل سيتريت قطر",
      ],
    },
    eyebrow: {
      en: "High-Strength Multi-Surface Cleaner",
      ar: "مزيل الشحوم والبقع متعدد الأسطح",
    },
    h1: {
      en: "Sitrett MX5 — Heavy-Duty Multi-Surface Degreaser & Cleaner in Qatar",
      ar: "سيتريت (Sitrett MX5) — منظف ومزيل الشحوم القوي متعدد الأسطح في قطر",
    },
    subtitle: {
      en: "The famous concentrated multi-surface cleaner trusted across Qatar for engine bays, alloy rims, upholstery stains, and workshop equipment.",
      ar: "المنظف المركز الشهير والموثوق في قطر لتنظيف حجرات المحرك، الجنوط، بقع المفروشات الصعبة، ومعدات الورش.",
    },
    guideTitle: {
      en: "Why Sitrett MX5 Is a Staple in Qatar Garages & Detailing Bays",
      ar: "لماذا يُعد Sitrett MX5 خياراً أساسياً في كراجات ومراكز التلميع في قطر",
    },
    guideParagraphs: {
      en: [
        "Sitrett MX5 has earned a loyal following among Qatari car enthusiasts and workshop technicians for its ability to cut through baked-on hydrocarbon grease, diesel soot, brake dust, and stubborn fabric or carpet stains that ordinary cleaners leave behind.",
        "Always test on an inconspicuous spot first, spray onto the contaminated surface, agitate briefly with a detailing brush or microfibre towel, and wipe or rinse thoroughly before the product dries on hot panels.",
      ],
      ar: [
        "اكتسب منظف Sitrett MX5 شهرة واسعة وثقة كبيرة بين ملاك السياراتوفنيي الورش في قطر بفضل قدرته الفائقة على تفكيك الشحوم المحترقة في حجرة المحرك، وغبار الفرامل المتراكم على الجنوط، والبقع المستعصية على السجاد والمفروشات.",
        "يُنصح دائماً بتجربته على منطقة صغيرة غير ظاهرة أولاً، ثم رشه على السطح المتسخ وتوزيعه بفرشاة تلميع ناعمة أو منشفة مايكروفايبر، وشطفه أو مسحه جيداً قبل أن يجف على الأسطح الساخنة.",
      ],
    },
    faqs: [
      {
        q: {
          en: "What surfaces can Sitrett MX5 clean on a car?",
          ar: "ما هي الأسطح التي ينظفها Sitrett MX5 في السيارة؟",
        },
        a: {
          en: "Sitrett MX5 is used on engine bays, alloy wheels, tyre sidewalls, door jambs, rubber floor mats, and tough upholstery or carpet stains. Avoid leaving it to dry in direct sunlight on delicate bare aluminum or unsealed plastics.",
          ar: "يُستخدم لتنظيف حجرة المحرك، الجنوط، الإطارات، فواصل الأبواب، الدعاسات، وبقع السجاد والمقاعد القماشية الصعبة، مع تجنب تركه يجف تحت أشعة الشمس المباشرة.",
        },
      },
      {
        q: {
          en: "Is Sitrett MX5 available for wholesale purchase in Doha?",
          ar: "هل يتوفر Sitrett MX5 بالجملة في الدوحة؟",
        },
        a: {
          en: "Yes. ABK Trading & Service stocks Sitrett MX5 in Mesaimeer for both individual buyers and wholesale carton orders via WhatsApp (+974 3083 8355).",
          ar: "نعم، توفر شركة ABK للتجارة والخدمات منظف Sitrett MX5 في معرض مسيمير للأفراد وبالكرتون لمراكز الغسيل والتلميع عبر واتساب (+974 3083 8355).",
        },
      },
      {
        q: {
          en: "Can I combine Sitrett MX5 with microfibre towels and brushes in one order?",
          ar: "هل يمكنني طلب Sitrett MX5 مع مناشف المايكروفايبر في طلب واحد؟",
        },
        a: {
          en: "Yes! Add Sitrett MX5 along with our QAR 8–10 microfibre towels and spray bottles to your cart and send the entire order on WhatsApp in one tap.",
          ar: "نعم بالتأكيد! أضف Sitrett MX5 مع مناشف المايكروفايبر (8–10 ر.ق) إلى سلة التسوق وأرسل طلبك كاملاً عبر واتساب بضغطة واحدة.",
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
