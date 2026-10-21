/**
 * FAQ entries used both as visible content on the About page AND as
 * FAQPage JSON-LD for Google rich results / AI Overview answers.
 *
 * Constraints (Google FAQ rich results spec):
 *  - Plain text only in answers — NO HTML tags. JSON-LD will be rejected.
 *  - Keep answers under ~250 chars when possible (longer answers are accepted
 *    but rarely surfaced in rich results).
 *  - Q/A must match the visible page content exactly. Don't add JSON-LD-only
 *    questions — Google penalises that as cloaking.
 *
 * TODO (owner): refine these with the actual top questions you receive on
 * WhatsApp. The current set is a reasonable seed based on common Qatar PPF
 * buyer intents; replace with the real ones as you gather them.
 */

import {
  CUSTOM_MINIMUM_QAR,
  FILMS,
  FILM_PRESET_PRICES_QAR,
  PRESET_PRICES_QAR,
  ULTIMATE_WARRANTY_YEARS,
  fromPrice,
} from "./ppfInstall";
import { yearsPhrase } from "./ppfEvidence";
import { SITE } from "@/lib/constants";
import {
  DELIVERY,
  DISCOUNT_ENTRY,
  DISCOUNT_TOP,
  formatPercent as pct,
  formatQar as qar,
} from "@/lib/pricing";

// Prices and warranty years in the answers below are read from ppfInstall.ts,
// so the FAQ text (and its FAQPage JSON-LD) can never quote a stale price.
const film = (key: string) => FILMS.find((f) => f.key === key)!;
const fe = PRESET_PRICES_QAR["front-end"];
const ff = PRESET_PRICES_QAR["full-front"];
const fb = PRESET_PRICES_QAR["full-body"];
const fbProPlus = FILM_PRESET_PRICES_QAR["pro-plus"]["full-body"];
const fbMatte = FILM_PRESET_PRICES_QAR.matte["full-body"];

export type FaqEntry = {
  q: { en: string; ar: string };
  a: { en: string; ar: string };
};

export const FAQ: FaqEntry[] = [
  {
    q: {
      en: "How long does paint protection film last?",
      ar: "ما مدة عمر فيلم حماية الطلاء PPF؟",
    },
    a: {
      en: "Premium paint protection films like VTEK Weather Armor typically last 5–15 years under normal use, depending on the film grade, climate exposure and care. The self-healing top-coat regenerates light scratches with heat from the sun or warm water.",
      ar: "تدوم أفلام حماية الطلاء الفاخرة مثل VTEK Weather Armor عادةً من 5 إلى 15 سنة في الاستخدام الطبيعي، حسب فئة الفيلم والتعرض للعوامل الجوية والعناية. تعيد طبقة الإصلاح الذاتي ترميم الخدوش الخفيفة بحرارة الشمس أو الماء الدافئ.",
    },
  },
  {
    q: {
      en: "Do you supply car care products wholesale to other shops in Qatar?",
      ar: "هل تورّدون منتجات العناية بالسيارات بالجملة لمحلات أخرى في قطر؟",
    },
    a: {
      en: "Yes. ABK supplies wholesale VTEK PPF, Autotriz and Briller products to detailing shops, body shops and car-wash businesses across Qatar and the GCC. Volume pricing is quoted per request on WhatsApp.",
      ar: "نعم. تورّد ABK أفلام VTEK PPF ومنتجات Autotriz وBriller بالجملة لورش التلميع والكراجات ومحطات الغسيل في قطر والخليج. تُحدَّد الأسعار حسب الكمية عبر واتساب.",
    },
  },
  {
    q: {
      en: "Do your window films meet Qatar tint regulations?",
      ar: "هل أفلام التظليل لديكم متوافقة مع قوانين قطر؟",
    },
    a: {
      en: "Yes. We stock heat-rejecting window films in multiple VLT (visible light transmission) grades that meet Qatar's vehicle tint regulations. Tell us your vehicle and we will confirm the right grade before you buy.",
      ar: "نعم. نوفر أفلام تظليل عازلة للحرارة بدرجات نفاذية ضوئية متعددة متوافقة مع قوانين قطر. أخبرنا بموديل سيارتك ونُحدّد لك الدرجة المناسبة قبل الشراء.",
    },
  },
  {
    q: {
      en: "What is the difference between PPF and ceramic coating?",
      ar: "ما الفرق بين PPF والطلاء السيراميكي؟",
    },
    a: {
      en: "PPF is a thick urethane film that physically blocks rock chips, scratches and impacts. Ceramic coating is a thin chemical layer that adds gloss and water-repellency but does not stop physical damage. Many customers apply ceramic coating on top of PPF for both benefits.",
      ar: "PPF فيلم يوريثاني سميك يحجب الحصى والخدوش والصدمات. أما الطلاء السيراميكي فهو طبقة كيميائية رقيقة تُضيف اللمعان وتطرد الماء لكنها لا تمنع الضرر الميكانيكي. كثير من العملاء يطبّقون السيراميك فوق PPF للحصول على الفائدتين.",
    },
  },
  {
    q: {
      en: "Where is the ABK store located in Doha?",
      ar: "أين يقع متجر ABK في الدوحة؟",
    },
    a: {
      en: "ABK Trading & Service is at Showroom no. 2, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, Qatar. Open Saturday to Thursday, 10:00–13:00 and 16:00–22:00. Closed Friday.",
      ar: "يقع متجر ABK للتجارة والخدمات في المعرض رقم 2، مبنى 1306، شارع 70، منطقة 56، مسيمير، الدوحة، قطر. مفتوح من السبت إلى الخميس، 10:00 – 1:00 و4:00 – 10:00. الجمعة مغلق.",
    },
  },
  {
    q: {
      en: "How much does paint protection film cost in Qatar?",
      ar: "كم تبلغ تكلفة فيلم حماية الطلاء في قطر؟",
    },
    a: {
      en: `Installed VTEK PPF from ABK starts at ${qar(fromPrice("front-end"), "en")} for a front-end kit, ${qar(fromPrice("full-front"), "en")} for a full front and ${qar(fromPrice("full-body"), "en")} for a full body, depending on car size and film. Film by the roll is quoted on WhatsApp.`,
      ar: `يبدأ تركيب فيلم VTEK من ABK من ${qar(fromPrice("front-end"), "ar")} للواجهة الأساسية، و${qar(fromPrice("full-front"), "ar")} للواجهة الكاملة، و${qar(fromPrice("full-body"), "ar")} للهيكل بالكامل، حسب حجم السيارة ونوع الفيلم. أما الفيلم بالرول فيُسعَّر عبر واتساب.`,
    },
  },
  {
    q: {
      en: "Which ceramic coating works best in Qatar's heat?",
      ar: "ما أفضل طلاء سيراميكي يصلح لحرارة قطر؟",
    },
    a: {
      en: "Ceramic coatings rated for high-UV exposure (9H hardness, hydrophobic top-coat) perform best in Qatar's climate. Autotriz and Briller systems we carry are formulated for Gulf summers and resist water-spotting from hard tap water common in Doha.",
      ar: "تُؤدي الطلاءات السيراميكية المصممة للتعرض الشديد للأشعة فوق البنفسجية (صلابة 9H وطبقة طاردة للماء) أفضل أداء في مناخ قطر. أنظمة Autotriz وBriller التي نوفرها مصممة لصيف الخليج وتقاوم بقع الماء الناتجة عن الماء العسر الشائع في الدوحة.",
    },
  },
  {
    q: {
      en: "Do you ship car care products from Qatar to UAE, Saudi Arabia or Kuwait?",
      ar: "هل تشحنون منتجات العناية بالسيارات من قطر إلى الإمارات والسعودية والكويت؟",
    },
    a: {
      en: "Yes — wholesale orders ship across the GCC. Lead time and freight depend on order volume and destination. WhatsApp +974 30838355 with your country, products and quantities for a delivered-price quote.",
      ar: "نعم — تُشحن طلبات الجملة إلى جميع دول الخليج. تعتمد مدة التسليم وكلفة الشحن على حجم الطلب والوجهة. تواصل عبر واتساب 30838355 974+ مع تحديد الدولة والمنتجات والكميات للحصول على عرض سعر شامل التوصيل.",
    },
  },
  {
    q: {
      en: "What is the minimum order quantity for wholesale car care products?",
      ar: "ما الحد الأدنى للطلب من منتجات العناية بالسيارات بالجملة؟",
    },
    a: {
      en: "Minimum order quantities vary by brand. Autotriz and Briller can be ordered by the case. VTEK PPF rolls are sold per roll. Detailing accessories are flexible. WhatsApp the brands and SKUs you want and we'll send the wholesale price sheet.",
      ar: "يختلف الحد الأدنى للطلب حسب العلامة التجارية. تُطلب منتجات Autotriz وBriller بالكرتون. تُباع أفلام VTEK PPF بالرول. أما إكسسوارات التلميع فمرنة. أرسل لنا العلامات التجارية والأصناف المطلوبة عبر واتساب لنرسل لك قائمة أسعار الجملة.",
    },
  },
  {
    q: {
      en: "Is VTEK PPF covered by warranty?",
      ar: "هل أفلام VTEK لحماية الطلاء مشمولة بضمان؟",
    },
    a: {
      en: "Yes. Genuine VTEK (formerly Vertek) PPF carries a 5 to 15-year manufacturer warranty, depending on the film, against defects such as bubbling, cracking, peeling and fading when fitted by an authorised installer following VTEK's procedures. ABK is the authorised Qatar distributor and supplies the film with official warranty documentation.",
      ar: "نعم. تأتي أفلام VTEK (المعروفة سابقاً بـ Vertek) الأصلية بضمان مصنع لمدة 5 إلى 15 سنة حسب نوع الفيلم ضد عيوب مثل الفقاعات والتشقق والتقشّر وبهتان اللون عند التركيب من قِبل مُركّب معتمد وفق إجراءات VTEK. ABK هو الموزع المعتمد في قطر ويورّد الفيلم مع مستندات الضمان الرسمية.",
    },
  },
  {
    q: {
      en: "Can PPF be removed without damaging the paint?",
      ar: "هل يمكن إزالة فيلم PPF دون الإضرار بالطلاء؟",
    },
    a: {
      en: "Yes — quality PPF like VTEK Weather Armor is designed for clean removal by a trained technician using controlled heat. The original paint underneath is preserved, often in better condition than unprotected paint of the same age.",
      ar: "نعم — صُمّمت أفلام PPF عالية الجودة مثل VTEK Weather Armor لتُزال بشكل نظيف على يد فنّي مدرب باستخدام حرارة محسوبة. يبقى الطلاء الأصلي تحتها محفوظاً، وغالباً بحالة أفضل من الطلاء غير المحمي بنفس العمر.",
    },
  },

  // ───── SEO-targeted FAQ entries ─────
  // These target common unbranded search queries customers use when looking
  // for car care in Qatar. They surface as FAQPage rich results in Google
  // and are quoted by AI answer engines (ChatGPT, Perplexity, Gemini).
  {
    q: {
      en: "Where can I buy car care products in Qatar?",
      ar: "أين يمكنني شراء منتجات العناية بالسيارات في قطر؟",
    },
    a: {
      en: "ABK Trading and Service in Mesaimeer, Doha stocks a full range of car care products — car shampoos, polishing compounds, ceramic coatings, tyre shine, glass cleaners, paint protection film and more. Walk in Saturday to Thursday or order via WhatsApp at +974 30838355.",
      ar: "يوفر متجر ABK للتجارة والخدمات في مسيمير، الدوحة مجموعة كاملة من منتجات العناية بالسيارات — شامبوهات السيارات، مركبات التلميع، الطلاءات السيراميكية، ملمعات الإطارات، منظفات الزجاج، أفلام حماية الطلاء والمزيد. زرنا من السبت إلى الخميس أو اطلب عبر واتساب 30838355 974+.",
    },
  },
  {
    q: {
      en: "What is the best car shampoo for hot climates like Qatar?",
      ar: "ما أفضل شامبو سيارات للمناخ الحار مثل قطر؟",
    },
    a: {
      en: "pH-balanced car shampoos that do not strip wax or coatings perform best in Gulf heat. Autotriz Rich Foam Shampoo and Briller Wash and Wax are formulated to clean safely without spotting even in direct sunlight. Both are available at ABK Trading in Doha.",
      ar: "شامبوهات السيارات المتوازنة الحموضة التي لا تزيل الشمع أو الطلاءات تؤدي أفضل أداء في حرارة الخليج. شامبو Autotriz Rich Foam وBriller Wash and Wax صُمما للتنظيف الآمن دون ترك بقع حتى تحت الشمس المباشرة. كلاهما متوفر لدى ABK في الدوحة.",
    },
  },
  {
    q: {
      en: "How often should I wash my car in Doha?",
      ar: "كم مرة يجب أن أغسل سيارتي في الدوحة؟",
    },
    a: {
      en: "In Doha's dusty, humid climate most detailers recommend washing every 7 to 10 days. Cars with ceramic coating or PPF need less frequent washing because dust and water bead off the surface. Using a quality car shampoo prevents hard water spots common with Doha tap water.",
      ar: "في مناخ الدوحة المترب والرطب، ينصح معظم خبراء التلميع بالغسيل كل 7 إلى 10 أيام. السيارات المحمية بطلاء سيراميكي أو أفلام PPF تحتاج غسيلاً أقل لأن الغبار والماء ينزلقان عن السطح. استخدام شامبو سيارات عالي الجودة يمنع بقع الماء العسر الشائعة في الدوحة.",
    },
  },
  {
    q: {
      en: "What car detailing products do professionals use in Doha?",
      ar: "ما منتجات تلميع السيارات التي يستخدمها المحترفون في الدوحة؟",
    },
    a: {
      en: "Professional detailers in Doha typically use Autotriz cutting compounds and polishes for paint correction, Briller car shampoos for pre-wash, and Autotriz or Briller ceramic coatings for long-term protection. ABK Trading supplies these brands to workshops and individual detailers across Qatar.",
      ar: "يستخدم محترفو التلميع في الدوحة عادةً مركبات Autotriz للقطع والتلميع لتصحيح الطلاء، وشامبوهات Briller للغسيل الأولي، وطلاءات Autotriz أو Briller السيراميكية للحماية طويلة الأمد. توفر ABK هذه العلامات التجارية لورش التلميع والأفراد في جميع أنحاء قطر.",
    },
  },
  {
    q: {
      en: "Can car polish remove scratches from my car?",
      ar: "هل يمكن لملمّع السيارات إزالة الخدوش من سيارتي؟",
    },
    a: {
      en: "Yes — polishing compounds like Autotriz Heavy Cut 901 remove sanding marks and deep swirls, while finishing polishes like Autotriz Ultimate Polish 302 restore a high-gloss, hologram-free finish. For best results, professional machine polishing is recommended. ABK stocks these compounds at our Mesaimeer store.",
      ar: "نعم — مركبات التلميع مثل Autotriz Heavy Cut 901 تزيل علامات السنفرة والدوائر العميقة، بينما الملمعات النهائية مثل Autotriz Ultimate Polish 302 تعيد لمعاناً عالياً خالياً من الهالات. للحصول على أفضل النتائج، يُنصح بالتلميع الاحترافي بالمكينة. توفر ABK هذه المركبات في متجرنا بمسيمير.",
    },
  },
  {
    q: {
      en: "Can I buy single car care bottles for personal use or is ABK wholesale only?",
      ar: "هل يمكنني شراء عبوات فردية لاستخدامي الشخصي أم أن البيع بالجملة فقط؟",
    },
    a: {
      en: "ABK serves both individual car owners and commercial businesses. You can purchase single bottles of car shampoos, waxes, plastic restorers, and accessories at our Mesaimeer store or order on WhatsApp with rapid Qatar delivery. Detailing studios and workshops receive tiered wholesale volume pricing.",
      ar: "تخدم ABK الأفراد والشركات على حد سواء. يمكنك شراء عبوات فردية من الشامبو والشمع ومجدد البلاستيك والإكسسوارات من متجرنا بمسيمير أو الطلب عبر واتساب مع خدمة التوصيل السريع في قطر. بينما تحصل الورش والمراكز على أسعار جملة تجارية مخصصة.",
    },
  },
  {
    q: {
      en: "How does the WhatsApp Order Tray work?",
      ar: "كيف تعمل سلة الطلب والاستفسار عبر واتساب؟",
    },
    a: {
      en: "The WhatsApp Order Tray lets you browse products, set quantities, and compile a single multi-item order or commercial quote request. When ready, tap 'Send Order via WhatsApp' to launch a pre-formatted message with item details, quantities, and direct links.",
      ar: "تتيح لك سلة الطلب تصفح المنتجات وتحديد الكميات وجمع طلبك أو طلب التسعير التجاري في رسالة موحدة واحدة، ثم إرسالها مباشرة لفريق المبيعات عبر واتساب بضغطة زر واحدة تشمل تفاصيل المنتجات وروابطها.",
    },
  },
  {
    // Figures come from pricing.ts — the same rules the cart applies.
    q: {
      en: "Do you offer discounts or free delivery on retail orders?",
      ar: "هل توجد خصومات أو توصيل مجاني على طلبات التجزئة؟",
    },
    a: {
      en: `Yes. Orders placed through the website cart get ${pct(DISCOUNT_ENTRY.percent, "en")} off from ${qar(DISCOUNT_ENTRY.minSubtotalQar, "en")} and ${pct(DISCOUNT_TOP.percent, "en")} off from ${qar(DISCOUNT_TOP.minSubtotalQar, "en")}, applied automatically to the products. Delivery is free from ${qar(DELIVERY.freeThresholdQar, "en")} (otherwise ${qar(DELIVERY.feeQar, "en")}), and pickup from our Mesaimeer showroom is always free.`,
      ar: `نعم، تحصل الطلبات عبر سلة الموقع على خصم ${pct(DISCOUNT_ENTRY.percent, "ar")} ابتداءً من ${qar(DISCOUNT_ENTRY.minSubtotalQar, "ar")} وخصم ${pct(DISCOUNT_TOP.percent, "ar")} ابتداءً من ${qar(DISCOUNT_TOP.minSubtotalQar, "ar")}، ويُطبَّق تلقائياً على المنتجات. والتوصيل مجاني ابتداءً من ${qar(DELIVERY.freeThresholdQar, "ar")} (وإلا فرسومه ${qar(DELIVERY.feeQar, "ar")})، والاستلام من معرضنا في مسيمير مجاني دائماً.`,
    },
  },
];

/**
 * Installation-page FAQ — rendered (with its own FAQPage JSON-LD) only on
 * /[locale]/b2c/ppf-installation. Kept separate from FAQ so no question
 * appears on two pages.
 *
 * Every factual statement here is either ABK's own policy (src/app/[locale]/terms)
 * or something VTEK publishes (vtekfilms.com/warranty, /faq, the NFC e-warranty
 * portal) — see src/data/ppfEvidence.ts. No thickness, polymer, heat-rating or
 * "official/exclusive" claims: VTEK's pages do not support them.
 */
export const PPF_INSTALL_FAQ: FaqEntry[] = [
  {
    q: {
      en: "How much does PPF installation cost in Qatar, and can I get a full body under QAR 5,000?",
      ar: "كم تكلفة تركيب PPF في قطر، وهل يمكن تركيب الهيكل بالكامل بأقل من 5,000 ريال؟",
    },
    a: {
      en: `At ABK in Doha, installed VTEK Weather Armor PRO costs ${qar(fb.sedan, "en")} for a full body on a sedan or coupe, ${qar(fb.suv, "en")} on a mid-size SUV or crossover and ${qar(fb["large-suv"], "en")} on a large SUV (Land Cruiser, Patrol, Defender), so sedans and mid-size SUVs are both under QAR 5,000. A full front starts at ${qar(ff.sedan, "en")} and a front-end kit at ${qar(fe.sedan, "en")}. Prices include the film, the fitting, the ${yearsPhrase(film("pro").warrantyYears, "en")} VTEK film warranty and ABK's 12-month fitting guarantee. PRO PLUS and MATTE cost more and PRISM colour change is priced per car; every price is in the table on this page.`,
      ar: `في ABK بالدوحة، يبلغ سعر تركيب فيلم VTEK Weather Armor PRO للهيكل بالكامل ${qar(fb.sedan, "ar")} للسيدان والكوبيه و${qar(fb.suv, "ar")} لسيارات SUV المتوسطة والكروس أوفر و${qar(fb["large-suv"], "ar")} لسيارات SUV الكبيرة (لاندكروزر، باترول، ديفندر)، وبذلك يقل سعر السيدان وSUV المتوسطة عن 5,000 ريال قطري. تبدأ الواجهة الكاملة من ${qar(ff.sedan, "ar")} والواجهة الأساسية من ${qar(fe.sedan, "ar")}. تشمل الأسعار الفيلم والتركيب وضمان VTEK للفيلم لمدة ${yearsPhrase(film("pro").warrantyYears, "ar")} وضمان تركيب من ABK لمدة 12 شهراً. يُسعَّر PRO PLUS وMATTE بسعر أعلى، ويُسعَّر PRISM لتغيير اللون لكل سيارة؛ وكل الأسعار في الجدول بهذه الصفحة.`,
    },
  },
  {
    q: {
      en: "Who installs the film?",
      ar: "من يقوم بتركيب الفيلم؟",
    },
    a: {
      en: "A VTEK-authorised installer in Doha, booked and managed by ABK. VTEK's warranty only covers film professionally installed by authorised installers. ABK supplies the genuine film, confirms your slot, photographs the car at drop-off, inspects the finish at handover and stays your single point of contact. The installer's details are recorded on your VTEK e-warranty.",
      ar: "مُركّب معتمد من VTEK في الدوحة، تحجزه وتديره ABK. لا يشمل ضمان VTEK إلا الفيلم المركّب باحتراف لدى مُركّبين معتمدين. توفّر ABK الفيلم الأصلي وتؤكد موعدك وتصوّر السيارة عند التسليم وتفحص النتيجة عند الاستلام النهائي وتبقى جهة التواصل الوحيدة معك. وتُسجَّل بيانات المُركّب في ضمان VTEK الإلكتروني الخاص بك.",
    },
  },
  {
    q: {
      en: "How do I know the film is genuine and the fitting is done properly?",
      ar: "كيف أتأكد أن الفيلم أصلي وأن التركيب يتم بشكل صحيح؟",
    },
    a: {
      en: "Check it in VTEK's own system. Every job is registered on VTEK's NFC e-Warranty, and on nfc.vtekfilms.com/verify you enter your plate number and phone number to see the product installed, the installation date, the installer's details and the warranty terms. VTEK's own contact page also lists our Mesaimeer showroom as its Qatar contact. ABK supplies the film from its own stock, photographs the car at drop-off and inspects the finish before handover.",
      ar: "تحقق منه في نظام VTEK نفسه. يُسجَّل كل عمل في الضمان الإلكتروني NFC لدى VTEK، وعلى nfc.vtekfilms.com/verify تدخل رقم لوحة سيارتك ورقم هاتفك لترى المنتج المركّب وتاريخ التركيب وبيانات المُركّب وشروط الضمان. كما تُدرج صفحة التواصل لدى VTEK معرضنا في مسيمير كجهة التواصل الخاصة بها في قطر. وتوفّر ABK الفيلم من مخزونها، وتصوّر السيارة عند التسليم وتفحص النتيجة قبل التسليم النهائي.",
    },
  },
  {
    q: {
      en: "Which VTEK film should I choose?",
      ar: "أي فيلم من VTEK أختار؟",
    },
    a: {
      en: `Weather Armor PRO suits most daily drivers: gloss finish, ${yearsPhrase(film("pro").warrantyYears, "en")} VTEK warranty, full body from ${qar(fb.sedan, "en")}. PRO PLUS is the step-up gloss grade (${yearsPhrase(film("pro-plus").warrantyYears, "en")} VTEK warranty) from ${qar(fbProPlus.sedan, "en")}; ask us on WhatsApp what it adds for your car. MATTE gives a satin finish (${yearsPhrase(film("matte").warrantyYears, "en")} warranty) from ${qar(fbMatte.sedan, "en")}, and PRISM changes the colour (${yearsPhrase(film("prism").warrantyYears, "en")} warranty) and is priced per car. ULTIMATE, VTEK's flagship gloss film with a ${yearsPhrase(ULTIMATE_WARRANTY_YEARS, "en")} warranty, is available by special roll order.`,
      ar: `يناسب Weather Armor PRO معظم السيارات اليومية: لمعان عالٍ وضمان VTEK لمدة ${yearsPhrase(film("pro").warrantyYears, "ar")} والهيكل بالكامل من ${qar(fb.sedan, "ar")}. أما PRO PLUS فهو فئة اللمعان الأعلى (ضمان VTEK ${yearsPhrase(film("pro-plus").warrantyYears, "ar")}) من ${qar(fbProPlus.sedan, "ar")}؛ اسألنا عبر واتساب عمّا يضيفه لسيارتك. ويمنح MATTE لمسة ساتان (ضمان ${yearsPhrase(film("matte").warrantyYears, "ar")}) من ${qar(fbMatte.sedan, "ar")}، بينما يغيّر PRISM لون السيارة (ضمان ${yearsPhrase(film("prism").warrantyYears, "ar")}) ويُسعَّر لكل سيارة. ويتوفر ULTIMATE، فيلم VTEK الرائد اللامع بضمان ${yearsPhrase(ULTIMATE_WARRANTY_YEARS, "ar")}، بالطلب الخاص للرول.`,
    },
  },
  {
    q: {
      en: "Is a full front enough, or should I get a full body?",
      ar: "هل تكفي الواجهة الكاملة أم أختار الهيكل بالكامل؟",
    },
    a: {
      en: `A full front covers the panels that take stone chips on Qatar's highways — bonnet, front bumper, fenders, mirrors and headlights — from ${qar(ff.sedan, "en")} on a sedan. A full body (from ${qar(fb.sedan, "en")}) adds the doors, sides, roof and rear against sand abrasion, parking scuffs and wash swirls, and suits a new or high-value car you plan to keep.`,
      ar: `تغطي الواجهة الكاملة القطع التي تتعرض للحصى على الطرق السريعة في قطر — الكبوت والصدام الأمامي والرفارف والمرايا والمصابيح — بسعر يبدأ من ${qar(ff.sedan, "ar")} للسيدان. أما الهيكل بالكامل (من ${qar(fb.sedan, "ar")}) فيضيف الأبواب والجوانب والسقف والخلفية لحمايتها من احتكاك الرمل وخدوش المواقف ودوائر الغسيل، وهو الأنسب لسيارة جديدة أو عالية القيمة تنوي الاحتفاظ بها.`,
    },
  },
  {
    q: {
      en: "Can I protect only some panels?",
      ar: "هل يمكنني حماية بعض القطع فقط؟",
    },
    a: {
      en: `Yes. Pick "Choose parts" in the quote builder and tap the panels you want. The estimate updates as you go, starts at ${qar(CUSTOM_MINIMUM_QAR, "en")} and never exceeds the full-body price for your car; we confirm the final price on WhatsApp.`,
      ar: `نعم. اختر «اختر القطع» في أداة التسعير وحدّد القطع التي تريدها. يتحدّث السعر التقديري فوراً، ويبدأ من ${qar(CUSTOM_MINIMUM_QAR, "ar")} ولا يتجاوز سعر الهيكل بالكامل لسيارتك، ونؤكد السعر النهائي عبر واتساب.`,
    },
  },
  {
    q: {
      en: "How long does PPF installation take?",
      ar: "كم يستغرق تركيب فيلم الحماية؟",
    },
    a: {
      en: "Typically the same day for a front-end kit, one day for a full front and two to three days for a full body, including curing time. We confirm the exact time with your slot.",
      ar: "عادةً في اليوم نفسه للواجهة الأساسية، ويوم واحد للواجهة الكاملة، ومن يومين إلى ثلاثة أيام للهيكل بالكامل شاملةً وقت التثبيت. نؤكد المدة بدقة مع الموعد.",
    },
  },
  {
    q: {
      en: "How do I book PPF installation in Doha?",
      ar: "كيف أحجز تركيب PPF في الدوحة؟",
    },
    a: {
      en: `Tap "Get my instant quote" on this page, choose your car, coverage and film, and send the quote on WhatsApp. We confirm film stock, your slot and the final price during opening hours (Saturday to Thursday, ${SITE.hours.weekdaysMorning} and ${SITE.hours.weekdaysEvening}). You pay in full by bank transfer or cash once the slot is confirmed, drop the car at the confirmed Doha location, and collect it after our handover inspection.`,
      ar: `اضغط «احسب سعري الآن» في هذه الصفحة، واختر سيارتك والتغطية والفيلم، ثم أرسل عرض السعر عبر واتساب. نؤكد توفر الفيلم وموعدك والسعر النهائي خلال ساعات العمل (من السبت إلى الخميس، ${SITE.hours.weekdaysMorning} و${SITE.hours.weekdaysEvening}). تدفع المبلغ كاملاً بتحويل بنكي أو نقداً بعد تأكيد الموعد، وتسلّم السيارة في موقع الدوحة المؤكد، وتستلمها بعد فحص التسليم لدينا.`,
    },
  },
  {
    q: {
      en: "How do I pay, and can I cancel?",
      ar: "كيف أدفع، وهل يمكنني الإلغاء؟",
    },
    a: {
      en: "Once we confirm your slot you pay in full by bank transfer or cash. Cancel up to 48 hours before for a full refund; one reschedule is free.",
      ar: "بعد تأكيد موعدك تدفع المبلغ كاملاً بتحويل بنكي أو نقداً. يمكنك الإلغاء مع استرداد كامل حتى 48 ساعة قبل الموعد، وتغيير الموعد مرة واحدة مجاناً.",
    },
  },
  {
    q: {
      en: "What is the difference between the film warranty and the workmanship cover?",
      ar: "ما الفرق بين ضمان الفيلم وضمان التركيب؟",
    },
    a: {
      en: `VTEK's film warranty covers the film itself against manufacturing defects such as bubbling, cracking, peeling and fading when an authorised installer fits it: PRO ${yearsPhrase(film("pro").warrantyYears, "en")}, PRO PLUS ${yearsPhrase(film("pro-plus").warrantyYears, "en")}, MATTE and PRISM ${yearsPhrase(film("matte").warrantyYears, "en")}, and ULTIMATE ${yearsPhrase(ULTIMATE_WARRANTY_YEARS, "en")} (special roll order), as listed on vtekfilms.com/warranty. ABK's separate 12-month fitting guarantee covers the installation itself: edge lifting, bubbles or misalignment. It does not cover accidents, stone impacts, improper washing or pressure-washing the film edges, repairs done elsewhere or paint defects recorded at drop-off.`,
      ar: `يغطي ضمان VTEK للفيلم الفيلم نفسه ضد عيوب التصنيع مثل الفقاعات والتشقق والتقشّر وبهتان اللون عندما يركّبه مُركّب معتمد: PRO لمدة ${yearsPhrase(film("pro").warrantyYears, "ar")}، وPRO PLUS لمدة ${yearsPhrase(film("pro-plus").warrantyYears, "ar")}، وMATTE وPRISM لمدة ${yearsPhrase(film("matte").warrantyYears, "ar")}، وULTIMATE لمدة ${yearsPhrase(ULTIMATE_WARRANTY_YEARS, "ar")} (بالطلب الخاص للرول)، كما في vtekfilms.com/warranty. أما ضمان التركيب المنفصل من ABK لمدة 12 شهراً فيغطي التركيب نفسه: ارتفاع الحواف أو الفقاعات أو عدم الاستقامة. ولا يشمل الحوادث أو ضربات الحصى أو الغسيل غير السليم أو الغسيل بالضغط العالي على حواف الفيلم أو الإصلاحات في مكان آخر أو عيوب الطلاء المسجَّلة عند الاستلام.`,
    },
  },
  {
    q: {
      en: "What if something goes wrong with the film or the fitting?",
      ar: "ماذا لو حدثت مشكلة في الفيلم أو التركيب؟",
    },
    a: {
      en: "Message ABK on WhatsApp with photos. We inspect it and arrange the repair with the installer; covered fitting problems in the first 12 months are put right at no cost. For a film defect we take the claim to VTEK: its terms start every claim with the original installer, and VTEK makes the final decision on whether it is a manufacturing defect. VTEK also says its warranty can be transferred to a new owner with proof of purchase.",
      ar: "راسل ABK على واتساب مع صور للمشكلة. نفحصها ونرتّب الإصلاح مع المُركّب؛ وتُعالج مشكلات التركيب المشمولة خلال أول 12 شهراً دون أي تكلفة. وفي حال عيب في الفيلم نرفع المطالبة إلى VTEK: تبدأ شروطها كل مطالبة بالمُركّب الأصلي، وتقرر VTEK بشكل نهائي ما إذا كان العيب عيب تصنيع. كما تذكر VTEK أن ضمانها يمكن نقله إلى مالك جديد مع إثبات الشراء.",
    },
  },
  {
    q: {
      en: "My car already has old PPF or a wrap. Can you still do it?",
      ar: "سيارتي عليها فيلم حماية قديم أو تغليف. هل يمكنكم التركيب؟",
    },
    a: {
      en: "Yes. Tell us in the booking form; old film or wrap has to be removed first, and we include that in the confirmed price.",
      ar: "نعم. أخبرنا بذلك في نموذج الحجز؛ إذ يجب إزالة الفيلم أو التغليف القديم أولاً، ونضمّن ذلك في السعر المؤكد.",
    },
  },
  {
    q: {
      en: "Can I fit PPF on a new car, or after a repaint?",
      ar: "هل يمكن تركيب PPF على سيارة جديدة أو بعد إعادة الطلاء؟",
    },
    a: {
      en: "Yes on a new car: VTEK says factory paint is fully cured when the car leaves the assembly line. After a respray VTEK recommends waiting about 2 months so the paint cures fully. Tell us in the booking form if the car was recently repainted.",
      ar: "نعم للسيارة الجديدة: تقول VTEK إن طلاء المصنع يكون مكتمل التصلّب عند خروج السيارة من خط التجميع. أما بعد إعادة الطلاء فتوصي VTEK بالانتظار نحو شهرين ليتصلب الطلاء تماماً. أخبرنا في نموذج الحجز إن كانت السيارة أُعيد طلاؤها مؤخراً.",
    },
  },
  {
    q: {
      en: "Can PPF handle sandstorms and gravel on Qatar highways (Al Shamal and Salwa roads)?",
      ar: "هل يتحمل فيلم PPF العواصف الرملية وحصى الطرق السريعة في قطر (طريق الشمال وطريق سلوى)؟",
    },
    a: {
      en: "PPF takes the hit instead of your paint. The transparent polyurethane layer absorbs stone chips and sand abrasion on roads like Al Shamal and Salwa, and its self-healing top layer closes light swirl marks from washing and dust. No film makes paint chip-proof, and VTEK notes that a scratch cutting all the way through the self-healing layer will not heal, which is why highway drivers should cover at least the full front.",
      ar: "يتحمل الفيلم الصدمة بدلاً من طلاء سيارتك. تمتص طبقة البولي يوريثان الشفافة ضربات الحصى واحتكاك الرمل على طرق مثل الشمال وسلوى، وتعالج طبقتها العلوية ذاتية الإصلاح الخدوش الخفيفة ودوائر الغسيل والغبار. لا يجعل أي فيلم الطلاء محصّناً ضد الحصى، وتنبّه VTEK إلى أن الخدش الذي يخترق الطبقة ذاتية الإصلاح بالكامل لا يلتئم، ولذلك ننصح من يقود كثيراً على الطرق السريعة بتغطية الواجهة الكاملة على الأقل.",
    },
  },
  {
    q: {
      en: "How soon after PPF installation can I wash my car in Doha?",
      ar: "متى يمكنني غسيل سيارتي بعد تركيب فيلم الحماية في الدوحة؟",
    },
    a: {
      en: "VTEK says to wait about 7 days before an automatic car wash or pressure washing so the film dries completely, and to keep the pressure jet away from the film edges. Use ordinary car shampoo or detail spray, and avoid wax and sealants on the film. VTEK recommends a PPF-specific coating, such as Autotriz PPF & Vinyl Wrap Coating, once a year.",
      ar: "تنصح VTEK بالانتظار نحو 7 أيام قبل الغسيل الآلي أو الغسيل بالضغط العالي ليجف الفيلم تماماً، مع إبعاد فوهة الضغط عن حواف الفيلم. استخدم شامبو السيارات العادي أو بخاخ التنظيف، وتجنّب الشمع والسيلانت على الفيلم. وتوصي VTEK بطبقة مخصصة لأفلام PPF مثل Autotriz PPF & Vinyl Wrap Coating مرة في السنة.",
    },
  },
  {
    q: {
      en: "Can PPF damage my paint when it is removed?",
      ar: "هل يمكن أن يضر فيلم PPF بالطلاء عند إزالته؟",
    },
    a: {
      en: "VTEK says it is highly unlikely, because factory paint bonds to the panel far more strongly than the film bonds to the paint. It still recommends having the film removed by a professional following its published guidelines, and old film on a car we are fitting is removed first.",
      ar: "تقول VTEK إن ذلك مستبعد جداً، لأن التصاق الطلاء الأصلي بالقطعة أقوى بكثير من التصاق الفيلم بالطلاء. ومع ذلك توصي بأن يزيل الفيلمَ مختصٌّ وفق إرشاداتها المنشورة، ونزيل أي فيلم قديم على السيارة قبل التركيب.",
    },
  },
  {
    q: {
      en: "What is the difference between genuine TPU and cheap PVC or TPH film?",
      ar: "ما الفرق بين فيلم TPU الأصلي وأفلام PVC أو TPH الرخيصة؟",
    },
    a: {
      en: "Paint protection film should be made of TPU, thermoplastic polyurethane. VTEK Weather Armor is TPU-based, and VTEK backs it with a written 5 to 15 year warranty that you can look up in its e-warranty system. Be careful with films sold without a named manufacturer, a stated warranty term or a way to verify the installation, and ask any installer which film they use and where its warranty can be checked.",
      ar: "ينبغي أن يُصنع فيلم حماية الطلاء من TPU أي البولي يوريثان الحراري. وفيلم VTEK Weather Armor قائم على TPU، وتدعمه VTEK بضمان مكتوب من 5 إلى 15 سنة يمكنك الاطلاع عليه في نظام الضمان الإلكتروني لديها. احذر من الأفلام التي تُباع دون ذكر الشركة المصنّعة أو مدة الضمان أو وسيلة للتحقق من التركيب، واسأل أي مُركّب عن الفيلم الذي يستخدمه وأين يمكن التحقق من ضمانه.",
    },
  },
  {
    q: {
      en: "Can I combine PPF installation with ceramic coating?",
      ar: "هل يمكنني دمج تركيب PPF مع الطلاء السيراميكي؟",
    },
    a: {
      en: "Yes, but the order matters. VTEK advises against putting a wax, sealant or ceramic coating on the paint before the film, because it lowers the film's grip on the paint; any coating goes on after installation. On top of the film VTEK recommends only a PPF-specific coating such as Autotriz PPF & Vinyl Wrap Coating, because most nano ceramic coatings are silicone-based and do not bond well to the film.",
      ar: "نعم، لكن الترتيب مهم. تنصح VTEK بعدم وضع شمع أو سيلانت أو طلاء سيراميك على الطلاء قبل الفيلم لأنه يضعف التصاق الفيلم بالطلاء؛ وأي طبقة حماية تُوضع بعد التركيب. وفوق الفيلم توصي VTEK بطبقة مخصصة لأفلام PPF فقط مثل Autotriz PPF & Vinyl Wrap Coating، لأن معظم طلاءات النانو السيراميك تعتمد على السيليكون ولا تلتصق جيداً بالفيلم.",
    },
  },
  {
    q: {
      en: "Where in Doha is the PPF installation performed?",
      ar: "أين يتم تركيب فيلم الحماية في الدوحة؟",
    },
    a: {
      en: "At a VTEK-authorised installer's centre in Doha, chosen by ABK. We confirm the location and drop-off instructions with your appointment slot. It is convenient from Mesaimeer, Al Rayyan, Lusail, West Bay, The Pearl, Al Wakrah and Al Khor.",
      ar: "لدى مركز مُركّب معتمد من VTEK في الدوحة تختاره ABK. نؤكد الموقع وإرشادات تسليم السيارة مع موعدك. وهو قريب من مسيمير والريان ولوسيل والخليج الغربي واللؤلؤة والوكرة والخور.",
    },
  },
  {
    q: {
      en: "I'm not sure which category my car falls under. How can I get an exact offer?",
      ar: "لست متأكداً من الفئة التي تُحسب عليها سيارتي. كيف أحصل على عرض سعر دقيق؟",
    },
    a: {
      en: "Type your car's make and model in the quote builder search bar to automatically see its category and instant price. If your vehicle isn't listed or you prefer a tailored quote, select 'Not sure? Get a Custom Offer' and enter your make and model — our team will confirm the exact offer on WhatsApp.",
      ar: "اكتب نوع وطراز سيارتك في خانة البحث داخل أداة التسعير لمعرفة فئتها وسعرها الفوري تلقائياً. وإذا لم تجد سيارتك أو كنت تفضل عرضاً مخصصاً، اختر «لست متأكداً؟ احصل على عرض مخصص» وأدخل نوع وطراز السيارة ليؤكد لك فريقنا العرض الدقيق عبر واتساب.",
    },
  },
];
