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
      en: "Yes — polishing compounds like Autotriz Heavy Cut 901 remove sanding marks and deep swirls, while finishing polishes like Autotriz Ultimate Polish 302 restore a high-gloss, hologram-free finish. For best results, professional machine polishing is recommended. ABK sells these compounds and offers detailing services at our Mesaimeer workshop.",
      ar: "نعم — مركبات التلميع مثل Autotriz Heavy Cut 901 تزيل علامات السنفرة والدوائر العميقة، بينما الملمعات النهائية مثل Autotriz Ultimate Polish 302 تعيد لمعاناً عالياً خالياً من الهالات. للحصول على أفضل النتائج، يُنصح بالتلميع الاحترافي بالمكينة. توفر ABK هذه المركبات وتقدم خدمات التلميع في ورشتنا بمسيمير.",
    },
  },
];
