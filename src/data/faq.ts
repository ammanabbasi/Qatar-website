/**
 * FAQ entries used both as visible content on the services page AND as
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

export type FaqEntry = {
  q: { en: string; ar: string };
  a: { en: string; ar: string };
};

export const FAQ: FaqEntry[] = [
  {
    q: {
      en: "Where can I get Vertek PPF installed in Qatar?",
      ar: "أين يمكنني تركيب أفلام Vertek لحماية الطلاء في قطر؟",
    },
    a: {
      en: "Vertek paint protection film is installed at the ABK Trading & Service workshop in Mesaimeer, Doha. Trained technicians cut and apply the film for full body, front-end or custom panels. WhatsApp +974 30838355 to book.",
      ar: "يُركّب فيلم حماية الطلاء Vertek في ورشة ABK للتجارة والخدمات بمسيمير، الدوحة. يقوم فنيون مدربون بقص وتركيب الفيلم للهيكل الكامل أو المقدمة أو الأجزاء المختارة. للحجز عبر واتساب: 30838355 974+.",
    },
  },
  {
    q: {
      en: "How long does paint protection film last?",
      ar: "ما مدة عمر فيلم حماية الطلاء PPF؟",
    },
    a: {
      en: "Premium paint protection films like Vertek typically last 7–10 years under normal use, depending on climate exposure and care. The self-healing top-coat regenerates light scratches with heat from the sun or warm water.",
      ar: "تدوم أفلام حماية الطلاء الفاخرة مثل Vertek عادةً من 7 إلى 10 سنوات في الاستخدام الطبيعي، حسب التعرض للعوامل الجوية والعناية. تعيد طبقة الإصلاح الذاتي ترميم الخدوش الخفيفة بحرارة الشمس أو الماء الدافئ.",
    },
  },
  {
    q: {
      en: "Do you supply car care products wholesale to other shops in Qatar?",
      ar: "هل تورّدون منتجات العناية بالسيارات بالجملة لمحلات أخرى في قطر؟",
    },
    a: {
      en: "Yes. ABK supplies wholesale Vertek PPF, Autotriz, Briller, Insta Finish and Getsun products to detailing shops, body shops and car-wash businesses across Qatar and the GCC. Volume pricing is quoted per request on WhatsApp.",
      ar: "نعم. تورّد ABK أفلام Vertek PPF ومنتجات Autotriz وBriller وInsta Finish وGetsun بالجملة لورش التلميع والكراجات ومحطات الغسيل في قطر والخليج. تُحدَّد الأسعار حسب الكمية عبر واتساب.",
    },
  },
  {
    q: {
      en: "Is window tinting at ABK compliant with Qatar regulations?",
      ar: "هل تظليل النوافذ في ABK متوافق مع قوانين قطر؟",
    },
    a: {
      en: "Yes. We install heat-rejecting window films in multiple VLT (visible light transmission) grades that meet Qatar's vehicle tint regulations. We confirm the right grade for your vehicle before installation.",
      ar: "نعم. نركّب أفلام تظليل عازلة للحرارة بدرجات نفاذية ضوئية متعددة متوافقة مع قوانين قطر. نُحدّد الدرجة المناسبة لسيارتك قبل التركيب.",
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
      en: "ABK Trading & Service is at Shop 2 & 3, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, Qatar. Open Saturday to Thursday, 10:00–13:00 and 16:00–22:00. Closed Friday.",
      ar: "يقع متجر ABK للتجارة والخدمات في المحل 2 و3، مبنى 1306، شارع 70، منطقة 56، مسيمير، الدوحة، قطر. مفتوح من السبت إلى الخميس، 10:00 – 1:00 و4:00 – 10:00. الجمعة مغلق.",
    },
  },
  {
    q: {
      en: "How much does paint protection film cost in Qatar?",
      ar: "كم تبلغ تكلفة فيلم حماية الطلاء في قطر؟",
    },
    a: {
      en: "PPF pricing depends on coverage area, vehicle size and finish (gloss or matte). Front-end packages start lower than full-body installs. Send a WhatsApp message with your car model and the coverage you want and we'll quote within hours.",
      ar: "تتفاوت أسعار فيلم حماية الطلاء حسب مساحة التغطية وحجم السيارة ونوع التشطيب (لامع أو مطفي). تبدأ باقات المقدمة بأسعار أقل من تغطية الهيكل الكامل. أرسل لنا موديل سيارتك ونوع التغطية المطلوبة عبر واتساب وسنرد بعرض السعر خلال ساعات.",
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
      en: "Minimum order quantities vary by brand. Autotriz and Briller can be ordered by the case. Vertek PPF rolls are sold per roll. Detailing accessories are flexible. WhatsApp the brands and SKUs you want and we'll send the wholesale price sheet.",
      ar: "يختلف الحد الأدنى للطلب حسب العلامة التجارية. تُطلب منتجات Autotriz وBriller بالكرتون. تُباع أفلام Vertek PPF بالرول. أما إكسسوارات التلميع فمرنة. أرسل لنا العلامات التجارية والأصناف المطلوبة عبر واتساب لنرسل لك قائمة أسعار الجملة.",
    },
  },
  {
    q: {
      en: "Is Vertek PPF covered by warranty?",
      ar: "هل أفلام Vertek لحماية الطلاء مشمولة بضمان؟",
    },
    a: {
      en: "Yes. Genuine Vertek PPF carries a manufacturer warranty against yellowing, cracking and delamination when installed by an authorised installer. ABK is the authorised Qatar installer; warranty terms are confirmed in writing at the time of install.",
      ar: "نعم. تأتي أفلام Vertek PPF الأصلية بضمان مصنع ضد الاصفرار والتشقق والانفصال عند التركيب من قِبل مُركّب معتمد. ABK هو المُركّب المعتمد في قطر؛ تُؤكَّد شروط الضمان كتابياً عند التركيب.",
    },
  },
  {
    q: {
      en: "Can PPF be removed without damaging the paint?",
      ar: "هل يمكن إزالة فيلم PPF دون الإضرار بالطلاء؟",
    },
    a: {
      en: "Yes — quality PPF like Vertek is designed for clean removal by a trained technician using controlled heat. The original paint underneath is preserved, often in better condition than unprotected paint of the same age.",
      ar: "نعم — صُمّمت أفلام PPF عالية الجودة مثل Vertek لتُزال بشكل نظيف على يد فنّي مدرب باستخدام حرارة محسوبة. يبقى الطلاء الأصلي تحتها محفوظاً، وغالباً بحالة أفضل من الطلاء غير المحمي بنفس العمر.",
    },
  },
];
