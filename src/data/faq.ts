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
  PRESET_PRICES_QAR,
  fromPrice,
} from "./ppfInstall";
import { formatNumber, formatQar as qar } from "@/lib/pricing";

// Prices and warranty years in the answers below are read from ppfInstall.ts,
// so the FAQ text (and its FAQPage JSON-LD) can never quote a stale price.
const film = (key: string) => FILMS.find((f) => f.key === key)!;
const pct = (n: number, l: "en" | "ar") =>
  l === "ar" ? `${formatNumber(Math.round(n * 100), "ar")}٪` : `${Math.round(n * 100)}%`;
const yrs = (key: string, l: "en" | "ar") =>
  l === "ar" ? formatNumber(film(key).warrantyYears, "ar") : String(film(key).warrantyYears);
// Arabic counted noun: 3–10 take the plural (سنوات), 11 and up the singular (سنة).
const arYears = (key: string) => {
  const n = film(key).warrantyYears;
  return n >= 3 && n <= 10 ? "سنوات" : "سنة";
};
const ff = PRESET_PRICES_QAR["full-front"];
const fb = PRESET_PRICES_QAR["full-body"];

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
      en: "Yes. Genuine VTEK (formerly Vertek) PPF carries a 5 to 15-year manufacturer warranty, depending on the film, against yellowing, cracking and delamination when fitted by an authorised installer following VTEK's procedures. ABK is the authorised Qatar distributor and supplies the film with official warranty documentation.",
      ar: "نعم. تأتي أفلام VTEK (المعروفة سابقاً بـ Vertek) الأصلية بضمان مصنع لمدة 5 إلى 15 سنة حسب نوع الفيلم ضد الاصفرار والتشقق والانفصال عند التركيب من قِبل مُركّب معتمد وفق إجراءات VTEK. ABK هو الموزع المعتمد في قطر ويورّد الفيلم مع مستندات الضمان الرسمية.",
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
];

/**
 * Installation-page FAQ — rendered (with its own FAQPage JSON-LD) only on
 * /[locale]/b2c/ppf-installation. Kept separate from FAQ so no question
 * appears on two pages.
 */
export const PPF_INSTALL_FAQ: FaqEntry[] = [
  {
    q: {
      en: "Who installs the film?",
      ar: "من يقوم بتركيب الفيلم؟",
    },
    a: {
      en: "A VTEK-authorised partner centre in Doha, booked and managed by ABK. ABK supplies the genuine film, confirms your slot, inspects the finished car and stays your single point of contact.",
      ar: "مركز شريك معتمد من VTEK في الدوحة، تحجزه وتديره ABK. توفّر ABK الفيلم الأصلي وتؤكد موعدك وتفحص السيارة بعد التركيب وتبقى جهة التواصل الوحيدة معك.",
    },
  },
  {
    q: {
      en: "How do I know the film is genuine and the fitting is done properly?",
      ar: "كيف أتأكد أن الفيلم أصلي وأن التركيب يتم بشكل صحيح؟",
    },
    a: {
      en: "ABK is VTEK's authorised distributor in Qatar and supplies the film for every job from its own stock, so it never comes from a third party. Only VTEK-authorised installers fit it; the car is photographed at drop-off, ABK inspects the finish before handover, and the VTEK warranty is registered to your car.",
      ar: "ABK هي الموزع المعتمد لأفلام VTEK في قطر وتوفّر الفيلم لكل عملية تركيب من مخزونها مباشرة، فلا يأتي من أي طرف آخر. لا يركّبه إلا مُركّبون معتمدون من VTEK؛ وتُصوَّر السيارة عند الاستلام، وتفحص ABK النتيجة قبل التسليم، ويُسجَّل ضمان VTEK باسم سيارتك.",
    },
  },
  {
    q: {
      en: "Which VTEK film should I choose for Qatar's heat?",
      ar: "أي فيلم من VTEK أختار لحرارة قطر؟",
    },
    a: {
      en: `Weather Armor PRO suits most daily drivers: 7.5 mil (190 µm) gloss TPU with heat-activated self-healing and a ${yrs("pro", "en")}-year VTEK warranty. ULTIMATE is the same thickness with VTEK's ultra-gloss finish, a hydrophobic top coat and a ${yrs("ultimate", "en")}-year warranty, for ${pct(film("ultimate").uplift ?? 0, "en")} more. MATTE gives a satin finish (${yrs("matte", "en")}-year warranty) and PRISM changes the colour (${yrs("prism", "en")}-year warranty).`,
      ar: `يناسب Weather Armor PRO معظم السيارات اليومية: فيلم TPU لامع بسماكة ٧.٥ مل (١٩٠ ميكرون) مع معالجة ذاتية بالحرارة وضمان VTEK لمدة ${yrs("pro", "ar")} ${arYears("pro")}. أما ULTIMATE فبالسماكة نفسها مع لمعان VTEK الفائق وطبقة علوية طاردة للماء وضمان ${yrs("ultimate", "ar")} ${arYears("ultimate")}، بزيادة ${pct(film("ultimate").uplift ?? 0, "ar")}. ويمنح MATTE لمسة ساتان مطفية (ضمان ${yrs("matte", "ar")} ${arYears("matte")})، بينما يغيّر PRISM لون السيارة (ضمان ${yrs("prism", "ar")} ${arYears("prism")}).`,
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
      en: "VTEK's warranty covers the film itself against yellowing, cracking and delamination for 5 to 15 years depending on the film. ABK's 12-month workmanship cover handles the fitting: lifting, bubbles or edges letting go.",
      ar: "يغطي ضمان VTEK الفيلم نفسه ضد الاصفرار والتشقق والانفصال لمدة من 5 إلى 15 سنة حسب نوع الفيلم. أما ضمان التركيب من ABK لمدة 12 شهراً فيغطي جودة التركيب: انفصال الفيلم أو الفقاعات أو ارتفاع الحواف.",
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
];
