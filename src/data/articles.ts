/**
 * Blog article data — SEO-targeted content hub.
 * Each article targets a high-value keyword cluster that ABK isn't ranking for.
 * Articles render as full pages with their own meta, JSON-LD (Article schema),
 * and internal links back to products/services.
 */

export type Article = {
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  date: string; // ISO date
  readingTime: number; // minutes
  category: string;
  keywords: { en: string[]; ar: string[] };
  sections: Array<{
    heading: { en: string; ar: string };
    body: { en: string; ar: string };
  }>;
  /** Product slugs to cross-link at the bottom */
  relatedProducts: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "window-tinting-rules-qatar-guide",
    title: {
      en: "Window Tinting in Qatar: Rules, Permits and Choosing the Right Film (2026 Guide)",
      ar: "تظليل النوافذ في قطر: القوانين والتصاريح واختيار الفيلم المناسب (دليل 2026)",
    },
    description: {
      en: "What tint percentage is legal in Qatar? A practical 2026 guide to MOI tint rules, Metrash permits, fines, and choosing a heat-rejecting film for Doha's climate.",
      ar: "ما نسبة التظليل القانونية في قطر؟ دليل عملي 2026 لقوانين وزارة الداخلية وتصاريح مطراش والغرامات واختيار فيلم عازل للحرارة.",
    },
    date: "2026-06-12",
    readingTime: 6,
    category: "guide",
    keywords: {
      en: ["window tinting Qatar", "car tint law Qatar", "tint percentage Qatar", "tint permit Metrash", "window tint Doha"],
      ar: ["تظليل النوافذ قطر", "قانون تظليل السيارات قطر", "نسبة التظليل المسموحة قطر", "تظليل سيارات الدوحة"],
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
          en: "Qatar's Ministry of Interior regulates how dark vehicle glass may be. Under the rules as published in 2026, private vehicles are generally permitted around 20% tint darkness on the front side windows, only a light band on the windshield, and significantly darker film on rear side windows and the rear screen. Sports and two-door cars face stricter limits. Because the MOI updates these rules and enforcement details from time to time, always confirm the current limits through Metrash or the MOI website before installing — a reputable installer will know the in-force limits and refuse work that would put your registration at risk. At ABK we install Vertek films in VLT grades that comply with the current Qatar regulations, and we advise every customer on what is legal for their specific vehicle type.",
          ar: "تنظم وزارة الداخلية القطرية درجة قتامة زجاج المركبات. وفق القواعد المنشورة في 2026، يُسمح للمركبات الخاصة عموماً بحوالي 20% قتامة على النوافذ الجانبية الأمامية، وشريط خفيف فقط على الزجاج الأمامي، وفيلم أغمق بكثير على النوافذ الجانبية الخلفية والزجاج الخلفي. وتخضع السيارات الرياضية وذات البابين لقيود أشد. ولأن وزارة الداخلية تحدّث هذه القواعد وتفاصيل تطبيقها من وقت لآخر، تأكد دائماً من الحدود السارية عبر مطراش أو موقع الوزارة قبل التركيب — المركّب الموثوق يعرف الحدود المعمول بها ويرفض أي عمل يعرّض تسجيل سيارتك للخطر. في ABK نركّب أفلام Vertek بدرجات نفاذية ضوء متوافقة مع اللوائح القطرية الحالية، وننصح كل عميل بما هو قانوني لنوع سيارته تحديداً.",
        },
      },
      {
        heading: {
          en: "Permits, Fines and Inspections",
          ar: "التصاريح والغرامات والفحص",
        },
        body: {
          en: "Drivers who need darker tint than the standard limit — for example for documented medical reasons such as skin or eye conditions — can apply for a tint permit through Metrash with a supporting medical report. Driving with non-compliant tint without a permit risks a fine of around QR 1,000 and possible vehicle impoundment, and over-dark tint can also cause a vehicle to fail its annual Fahes inspection. The practical advice is simple: install compliant film from the start. Modern ceramic films achieve excellent heat rejection even at legal VLT levels, so you genuinely do not need illegal darkness to keep your cabin cool.",
          ar: "يمكن للسائقين الذين يحتاجون تظليلاً أغمق من الحد القياسي — مثلاً لأسباب طبية موثقة كأمراض الجلد أو العيون — التقدم بطلب تصريح تظليل عبر مطراش مع تقرير طبي داعم. القيادة بتظليل مخالف دون تصريح تعرّضك لغرامة نحو 1,000 ريال قطري واحتمال حجز المركبة، كما قد يتسبب التظليل الزائد في رسوب السيارة في فحص فاحص السنوي. النصيحة العملية بسيطة: ركّب فيلماً متوافقاً من البداية. تحقق الأفلام السيراميكية الحديثة عزلاً حرارياً ممتازاً حتى عند درجات النفاذية القانونية، فلا تحتاج فعلياً إلى قتامة مخالفة لإبقاء مقصورتك باردة.",
        },
      },
      {
        heading: {
          en: "VLT, IR Rejection and Other Numbers Explained",
          ar: "شرح نفاذية الضوء وعزل الأشعة تحت الحمراء وبقية الأرقام",
        },
        body: {
          en: "Tint shopping comes with jargon. VLT (visible light transmission) is the percentage of visible light that passes through — a 70% VLT film is nearly clear, a 5% film is limousine-dark. Heat rejection numbers split into TSER (total solar energy rejected) and IR rejection (the infrared portion you feel as heat). A premium film can be light in appearance yet reject most infrared heat — this is why a legal-VLT ceramic film outperforms an illegal dark dyed film. UV rejection should be 99% or higher on any serious product. Vertek window tints, which ABK distributes in Qatar, publish these figures per grade so you can choose a film by performance rather than darkness alone.",
          ar: "يأتي شراء التظليل مصحوباً بمصطلحات تقنية. نفاذية الضوء المرئي (VLT) هي نسبة الضوء المرئي الذي يمر عبر الفيلم — فيلم بنفاذية 70% يكاد يكون شفافاً، وفيلم 5% غامق كزجاج الليموزين. أما أرقام العزل الحراري فتنقسم إلى إجمالي الطاقة الشمسية المرفوضة (TSER) وعزل الأشعة تحت الحمراء (الجزء الذي تشعر به حرارةً). يمكن لفيلم فاخر أن يبدو فاتحاً ومع ذلك يعزل معظم حرارة الأشعة تحت الحمراء — ولهذا يتفوق فيلم سيراميكي بنفاذية قانونية على فيلم مصبوغ غامق مخالف. ويجب ألا يقل حجب الأشعة فوق البنفسجية عن 99% في أي منتج جاد. أفلام تظليل Vertek التي توزعها ABK في قطر تنشر هذه الأرقام لكل درجة، لتختار الفيلم حسب الأداء لا القتامة وحدها.",
        },
      },
      {
        heading: {
          en: "Professional Installation in Mesaimeer, Doha",
          ar: "تركيب احترافي في مسيمير، الدوحة",
        },
        body: {
          en: "A film is only as good as its installation. Dust trapped under the film, stretched edges, and bubbling are the marks of rushed work — and in Qatar's heat, poor installations fail fast. At ABK Trading and Service in Mesaimeer we install Vertek window tints in a controlled environment with precision cutting, full edge sealing, and a workmanship guarantee. We will recommend the right VLT grade for each window of your vehicle so the result is both compliant and as cool as legally possible. Message us on WhatsApp at +974 30838355 for film options and pricing for your car model.",
          ar: "جودة الفيلم من جودة تركيبه. الغبار المحتجز تحت الفيلم والحواف المشدودة والفقاعات علامات على عمل متسرّع — وفي حرارة قطر تفشل التركيبات الرديئة سريعاً. في ABK للتجارة والخدمات بمسيمير نركّب أفلام تظليل Vertek في بيئة محكومة بقصّ دقيق وإحكام كامل للحواف وضمان على جودة التنفيذ. وسنوصيك بدرجة النفاذية المناسبة لكل نافذة في سيارتك ليأتي التظليل متوافقاً مع القانون وبأقصى برودة ممكنة قانونياً. راسلنا على واتساب +974 30838355 لمعرفة خيارات الأفلام والأسعار لطراز سيارتك.",
        },
      },
    ],
    relatedProducts: [
      "vertek-window-tints",
      "vertek-ppf-weather-armor",
      "briller-glass-cleaner",
    ],
  },
  {
    slug: "ceramic-coating-cost-qatar",
    title: {
      en: "How Much Does Ceramic Coating Cost in Qatar? (2026 Price Guide)",
      ar: "كم تكلفة الطلاء السيراميكي في قطر؟ (دليل الأسعار 2026)",
    },
    description: {
      en: "Ceramic coating prices in Qatar explained — what drives the cost, typical Doha market ranges, professional vs DIY, and how to judge whether a quote is fair.",
      ar: "شرح أسعار الطلاء السيراميكي في قطر — ما الذي يحدد التكلفة، ونطاقات الأسعار في الدوحة، والفرق بين التطبيق الاحترافي والمنزلي.",
    },
    date: "2026-06-11",
    readingTime: 6,
    category: "buying-guide",
    keywords: {
      en: ["ceramic coating price Qatar", "ceramic coating cost Doha", "car ceramic Qatar", "nano ceramic Doha price"],
      ar: ["سعر السيراميك للسيارات قطر", "تكلفة طلاء سيراميك الدوحة", "نانو سيراميك قطر"],
    },
    sections: [
      {
        heading: {
          en: "What Actually Determines the Price",
          ar: "ما الذي يحدد السعر فعلياً",
        },
        body: {
          en: "Ceramic coating quotes in Doha vary widely because the work behind them varies widely. The main cost drivers are: vehicle size (a Land Cruiser takes far more product and labour than a Yaris), paint condition (a new car may need only a light polish, while a sun-damaged daily driver needs multi-stage paint correction before any coating can be applied), the coating product itself (true 9H professional ceramics with multi-year durability cost more than consumer sprays), the number of layers, and what is included — many packages add wheel faces, glass, and interior surfaces. When two quotes differ sharply, the difference is almost always in the paint-correction stage, not the bottle.",
          ar: "تتفاوت عروض أسعار السيراميك في الدوحة بشدة لأن العمل وراءها يتفاوت بشدة. أبرز محددات التكلفة: حجم المركبة (لاند كروزر يستهلك منتجاً وجهداً أكبر بكثير من يارس)، وحالة الطلاء (سيارة جديدة قد تكتفي بتلميع خفيف، بينما تحتاج سيارة متضررة من الشمس إلى تصحيح طلاء متعدد المراحل قبل أي طلاء)، وجودة منتج السيراميك نفسه (السيراميك الاحترافي الحقيقي بصلابة 9H ومتانة لسنوات أغلى من البخاخات الاستهلاكية)، وعدد الطبقات، وما يشمله العرض — كثير من الباقات تضيف وجوه الجنوط والزجاج والأسطح الداخلية. وعندما يختلف عرضان اختلافاً حاداً، فالفرق غالباً في مرحلة تصحيح الطلاء لا في العبوة.",
        },
      },
      {
        heading: {
          en: "Typical Market Ranges in Doha",
          ar: "نطاقات الأسعار المعتادة في الدوحة",
        },
        body: {
          en: "As a general orientation — not a quote — professional ceramic coating packages in the Doha market typically start from several hundred riyals for an entry package on a small car with healthy paint, and run into the low thousands of riyals for a full package on a large SUV including multi-stage paint correction and multiple coating layers. Packages bundling ceramic on top of new PPF sit higher still. Be cautious at both extremes: a suspiciously cheap 'ceramic' offer is usually a silica spray sealant marketed as ceramic and will not survive a Qatari summer, while the most expensive quote is not automatically the best work. Ask any installer three questions: which product line and grade, how many correction stages are included, and what written durability warranty you receive.",
          ar: "كتوجيه عام — وليس عرض سعر — تبدأ باقات السيراميك الاحترافية في سوق الدوحة عادةً من بضع مئات من الريالات لباقة أساسية على سيارة صغيرة بطلاء سليم، وتصل إلى آلاف قليلة من الريالات لباقة كاملة على دفع رباعي كبير تشمل تصحيح طلاء متعدد المراحل وطبقات متعددة. وتأتي الباقات التي تجمع السيراميك فوق PPF جديد أعلى من ذلك. احذر من الطرفين: العرض «السيراميكي» الرخيص بشكل مريب يكون عادةً مانع تسرب سيليكا يُسوَّق كسيراميك ولن يصمد أمام صيف قطر، في حين أن أغلى عرض ليس تلقائياً أفضل عمل. اسأل أي مركّب ثلاثة أسئلة: ما خط المنتج ودرجته، كم مرحلة تصحيح تشملها الباقة، وما الضمان المكتوب للمتانة.",
        },
      },
      {
        heading: {
          en: "Professional Application vs DIY Kits",
          ar: "التطبيق الاحترافي مقابل العدد المنزلية",
        },
        body: {
          en: "Consumer ceramic kits exist, and for an enthusiast with a garage, patience, and a dual-action polisher they can deliver respectable results. But ceramic coating is unforgiving: it locks in whatever is underneath. If swirl marks and water-spot etching are not corrected first, you have sealed them under a glass-hard layer for years. Professional application buys you proper paint correction, dust-controlled curing conditions, and even coverage with no high spots. Products like Autotriz REVO and Autotriz Ion Plus that ABK supplies are professional-grade ceramics designed for trained application — and we both sell the products to detailers across Qatar and apply them in our own Mesaimeer workshop.",
          ar: "توجد عدد سيراميك استهلاكية، ويمكنها أن تعطي نتائج محترمة لهاوٍ يملك مرآباً وصبراً وآلة تلميع مزدوجة الحركة. لكن السيراميك لا يرحم: فهو يثبّت ما تحته كما هو. إن لم تُصحَّح علامات الدوائر وحفر بقع الماء أولاً، فقد ختمتها تحت طبقة بصلابة الزجاج لسنوات. التطبيق الاحترافي يشتري لك تصحيح طلاء سليماً وظروف معالجة محكومة الغبار وتغطية متساوية بلا بقع سميكة. منتجات مثل Autotriz REVO وAutotriz Ion Plus التي توفرها ABK سيراميك بدرجة احترافية مصمم لتطبيق مدرّب — ونحن نبيع المنتجات لمراكز التلميع في أنحاء قطر ونطبقها أيضاً في ورشتنا بمسيمير.",
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
          en: "Get an Exact Price for Your Car",
          ar: "احصل على سعر دقيق لسيارتك",
        },
        body: {
          en: "Because paint condition drives the price, an honest quote needs to see your car — or at least clear photos. Message ABK on WhatsApp at +974 30838355 with your vehicle model, year, and a few photos in daylight, and we will recommend a package and give you a firm price for coating, correction, or a PPF-plus-ceramic combination. Visit us in Mesaimeer, Doha — Saturday to Thursday, 10:00–13:00 and 16:00–22:00.",
          ar: "لأن حالة الطلاء هي ما يحدد السعر، يحتاج العرض الصادق إلى رؤية سيارتك — أو صور واضحة على الأقل. راسل ABK على واتساب +974 30838355 بطراز سيارتك وسنتها وبضع صور في ضوء النهار، وسنوصيك بالباقة المناسبة ونعطيك سعراً نهائياً للطلاء أو التصحيح أو باقة PPF مع سيراميك. وتفضل بزيارتنا في مسيمير، الدوحة — من السبت إلى الخميس، 10:00–13:00 و16:00–22:00.",
        },
      },
    ],
    relatedProducts: [
      "autotriz-revo-ceramic-coating",
      "autotriz-ion-plus-ceramic-coating",
      "autotriz-3d-matrix-ultra",
      "autotriz-3d-matrix-hybrid",
    ],
  },
  {
    slug: "remove-hard-water-spots-car-qatar",
    title: {
      en: "Hard Water Spots on Your Car in Qatar: How to Remove and Prevent Them",
      ar: "بقع الماء العسر على سيارتك في قطر: كيف تزيلها وتمنعها",
    },
    description: {
      en: "Why Doha's water leaves white spots on car paint and glass, how to remove fresh and etched water spots safely, and how to stop them coming back.",
      ar: "لماذا يترك ماء الدوحة بقعاً بيضاء على طلاء السيارة وزجاجها، وكيف تزيل البقع الجديدة والمحفورة بأمان، وكيف تمنع عودتها.",
    },
    date: "2026-06-10",
    readingTime: 5,
    category: "car-care",
    keywords: {
      en: ["water spots car Qatar", "remove water spots car paint", "hard water marks Doha", "water spot remover Qatar"],
      ar: ["بقع الماء على السيارة", "إزالة بقع الماء من طلاء السيارة", "علامات الماء العسر الدوحة"],
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
          en: "If a spot remains after chemical cleaning, the mineral has etched a physical crater into the clear coat, and the only fix is mechanical: polishing levels the surrounding clear coat down to the depth of the etching. Light etching responds to a finishing polish like Autotriz Ultimate Polish 302 on a dual-action machine. Deeper damage needs a cutting compound such as Autotriz Power Cut 701 followed by a finishing pass. This is precision work — every polish removes a little clear coat, so it should be done as few times as possible and ideally by a trained hand. ABK's Mesaimeer workshop performs single-panel spot correction up to full-vehicle paint correction.",
          ar: "إذا بقيت البقعة بعد التنظيف الكيميائي، فقد حفرت المعادن فوهة فعلية في طبقة الكلير، والحل الوحيد ميكانيكي: التلميع الذي يسوّي الكلير المحيط حتى عمق الحفر. الحفر الخفيف يستجيب لملمع تشطيب مثل Autotriz Ultimate Polish 302 على آلة مزدوجة الحركة. أما الضرر الأعمق فيحتاج مركب قطع مثل Autotriz Power Cut 701 تتبعه مرحلة تشطيب. هذا عمل دقيق — كل تلميع يزيل قليلاً من الكلير، لذا يجب أن يُجرى بأقل عدد ممكن من المرات وبيد مدربة. ورشة ABK في مسيمير تنفذ تصحيحاً موضعياً للوحة واحدة وحتى تصحيح طلاء كامل للسيارة.",
        },
      },
      {
        heading: {
          en: "Prevention: Stop the Spots Coming Back",
          ar: "الوقاية: امنع عودة البقع",
        },
        body: {
          en: "Three habits eliminate most water spotting in Qatar. First, never let water dry on the car — towel-dry after every wash and avoid parking near irrigation sprinklers. Second, wash in the early morning or evening, in shade, so water does not flash-evaporate mid-wash. Third — and most effective — give the paint a sacrificial hydrophobic layer. A ceramic coating such as Autotriz REVO makes water bead and roll off before it can evaporate in place, and the slick surface releases any deposits that do form with a gentle wash. Owners who combine a ceramic coating with proper drying habits almost never see etched spots again.",
          ar: "ثلاث عادات تقضي على معظم بقع الماء في قطر. أولاً، لا تدع الماء يجف على السيارة أبداً — جففها بالمنشفة بعد كل غسيل وتجنب الوقوف قرب مرشات الري. ثانياً، اغسل في الصباح الباكر أو المساء وفي الظل، حتى لا يتبخر الماء فوراً أثناء الغسيل. ثالثاً — وهو الأكثر فاعلية — امنح الطلاء طبقة حماية طاردة للماء. الطلاء السيراميكي مثل Autotriz REVO يجعل الماء يتكوّر وينزلق قبل أن يتبخر مكانه، والسطح الأملس يتخلى عن أي رواسب تتكون بغسلة لطيفة. الملاك الذين يجمعون بين السيراميك وعادات التجفيف الصحيحة لا يرون البقع المحفورة مجدداً تقريباً.",
        },
      },
      {
        heading: {
          en: "Everything You Need, In One Place in Doha",
          ar: "كل ما تحتاجه في مكان واحد في الدوحة",
        },
        body: {
          en: "ABK Trading and Service in Mesaimeer stocks the full chain of water-spot solutions: pH-balanced shampoos, glass cleaners, finishing polishes, cutting compounds, and professional ceramic coatings — and our workshop applies them if you would rather leave it to trained hands. Message us on WhatsApp at +974 30838355 with a photo of your paint and we will tell you honestly whether you need a product off the shelf or a correction session.",
          ar: "يوفر ABK للتجارة والخدمات في مسيمير سلسلة الحلول الكاملة لبقع الماء: شامبوهات متوازنة الحموضة، ومنظفات زجاج، وملمعات تشطيب، ومركبات قطع، وطلاءات سيراميكية احترافية — وورشتنا تطبقها إن فضّلت تركها لأيدٍ مدربة. راسلنا على واتساب +974 30838355 مع صورة لطلاء سيارتك وسنخبرك بصدق إن كنت تحتاج منتجاً من الرف أم جلسة تصحيح.",
        },
      },
    ],
    relatedProducts: [
      "autotriz-rich-foam-shampoo",
      "briller-glass-cleaner",
      "autotriz-ultimate-polish-302",
      "autotriz-revo-ceramic-coating",
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
          en: "Paint protection film is a transparent urethane layer applied over your car's factory paint. Premium films like Vertek PPF Weather Armor feature self-healing technology — light scratches from sand and dust disappear with heat from the sun. Unlike wax or sealant, PPF physically blocks rock chips, key scratches, and abrasion from desert sand. A full-body PPF installation protects the entire vehicle, while front-end packages cover the hood, bumper, fenders and mirrors — the areas most exposed to road debris on Qatar's highways. Quality PPF lasts 7 to 10 years with proper care, making it one of the most cost-effective long-term investments for car owners in Doha.",
          ar: "فيلم حماية الطلاء هو طبقة يوريثان شفافة تُطبق فوق طلاء المصنع. تتميز الأفلام الفاخرة مثل Vertek PPF Weather Armor بتقنية الإصلاح الذاتي — تختفي الخدوش الخفيفة من الرمل والغبار بحرارة الشمس. على عكس الشمع أو مانع التسرب، يحجب PPF فعلياً رقائق الحصى وخدوش المفاتيح وتآكل الرمل الصحراوي. تركيب PPF الكامل يحمي السيارة بالكامل، بينما تغطي باقات المقدمة غطاء المحرك والمصد والرفارف والمرايا — وهي المناطق الأكثر تعرضاً لحطام الطريق على طرق قطر السريعة. يدوم PPF عالي الجودة من 7 إلى 10 سنوات مع العناية المناسبة، مما يجعله من أكثر الاستثمارات فعالية لأصحاب السيارات في الدوحة.",
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
          en: "Quality window tint films reject up to 60% of solar heat, keeping your car's interior significantly cooler and reducing air conditioning load. In Qatar, this means your leather seats and dashboard last longer, and your fuel consumption decreases. Vertek window tints are available in multiple VLT (visible light transmission) grades that comply with Qatar's vehicle regulations. Professional installation at a workshop like ABK ensures bubble-free, precision-cut application that lasts the life of the vehicle.",
          ar: "ترفض أفلام تظليل النوافذ عالية الجودة ما يصل إلى 60% من الحرارة الشمسية، مما يبقي مقصورة سيارتك أبرد بكثير ويقلل حمل التكييف. في قطر، هذا يعني أن مقاعدك الجلدية ولوحة القيادة تدوم أطول واستهلاك الوقود ينخفض. تتوفر أفلام تظليل Vertek بدرجات متعددة من نفاذية الضوء المرئي (VLT) متوافقة مع قوانين المركبات في قطر. التركيب الاحترافي في ورشة مثل ABK يضمن تطبيقاً دقيقاً بدون فقاعات يدوم طوال عمر السيارة.",
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
      "vertek-ppf-weather-armor",
      "autotriz-3d-matrix-ultra",
      "vertek-window-tints",
      "briller-wash-and-wax",
    ],
  },
  {
    slug: "ppf-vs-ceramic-coating-qatar",
    title: {
      en: "PPF vs Ceramic Coating: Which is Right for Your Car in Qatar?",
      ar: "PPF مقابل الطلاء السيراميكي: أيهما يناسب سيارتك في قطر؟",
    },
    description: {
      en: "A detailed comparison of paint protection film and ceramic coating for cars in Qatar. Learn which option protects best against sand, UV, and water spots in Doha's climate.",
      ar: "مقارنة تفصيلية بين فيلم حماية الطلاء والطلاء السيراميكي للسيارات في قطر.",
    },
    date: "2026-05-08",
    readingTime: 5,
    category: "comparison",
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
          en: "PPF excels at preventing physical damage that ceramic coating simply cannot stop. Rock chips from highway driving between Doha and Al Khor, door dings in tight parking lots, key scratches, and the constant micro-abrasion from sand particles — PPF handles all of these. Premium films like Vertek PPF Weather Armor feature self-healing top coats that repair light scratches when exposed to heat (which Qatar has in abundance). PPF typically lasts 7 to 10 years and can be removed cleanly without damaging the original paint. The downside is cost — full-body PPF installation is a significant investment, though front-end packages offer excellent protection at a lower price point.",
          ar: "يتفوق PPF في منع الضرر الفيزيائي الذي لا يستطيع الطلاء السيراميكي إيقافه ببساطة. رقائق الحصى من القيادة على الطريق السريع بين الدوحة والخور، خدوش الأبواب في المواقف الضيقة، خدوش المفاتيح، والتآكل المستمر من جزيئات الرمل — PPF يتعامل مع كل هذا. أفلام فاخرة مثل Vertek PPF Weather Armor تتميز بطبقات علوية ذاتية الإصلاح تُرمم الخدوش الخفيفة عند تعرضها للحرارة (وهو ما تمتلكه قطر بوفرة). يدوم PPF عادةً من 7 إلى 10 سنوات ويمكن إزالته بنظافة دون إتلاف الطلاء الأصلي. الجانب السلبي هو التكلفة — تركيب PPF للهيكل الكامل استثمار كبير، لكن باقات المقدمة توفر حماية ممتازة بسعر أقل.",
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
          en: "Many car owners in Qatar choose both — applying ceramic coating on top of PPF. This combination gives you physical impact protection from the PPF layer plus the easy-clean, hydrophobic, glossy finish from the ceramic layer. It is the gold standard of car protection in the Gulf. At ABK Trading and Service in Mesaimeer, we install both products and can advise on the right combination for your vehicle, driving habits, and budget. Whether you choose PPF, ceramic, or both — professional installation makes the difference between protection that lasts years and protection that fails in months.",
          ar: "يختار كثير من أصحاب السيارات في قطر كليهما — تطبيق الطلاء السيراميكي فوق PPF. هذا المزيج يمنحك حماية فيزيائية من الصدمات من طبقة PPF بالإضافة إلى لمسة نهائية لامعة طاردة للماء وسهلة التنظيف من طبقة السيراميك. هذا هو المعيار الذهبي لحماية السيارات في الخليج. في ABK للتجارة والخدمات بمسيمير، نركّب كلا المنتجين ويمكننا تقديم المشورة حول المزيج المناسب لسيارتك وعاداتك في القيادة وميزانيتك. سواء اخترت PPF أو السيراميك أو كليهما — التركيب الاحترافي هو ما يصنع الفارق بين حماية تدوم سنوات وحماية تفشل خلال أشهر.",
        },
      },
    ],
    relatedProducts: [
      "vertek-ppf-weather-armor",
      "autotriz-3d-matrix-ultra",
      "autotriz-3d-matrix-hybrid",
      "autotriz-ion-plus-ceramic-coating",
    ],
  },
  {
    slug: "complete-guide-car-care-products-qatar",
    title: {
      en: "The Complete Guide to Car Care Products in Qatar",
      ar: "الدليل الشامل لمنتجات العناية بالسيارات في قطر",
    },
    description: {
      en: "Everything you need to know about car care products available in Qatar — from car shampoos and polishes to PPF and ceramic coatings. A buyer's guide for Doha car owners.",
      ar: "كل ما تحتاج معرفته عن منتجات العناية بالسيارات المتوفرة في قطر — من شامبوهات السيارات إلى أفلام الحماية والطلاءات السيراميكية.",
    },
    date: "2026-05-05",
    readingTime: 7,
    category: "buying-guide",
    keywords: {
      en: ["car care products Qatar", "car shampoo Doha", "car polish Qatar", "auto detailing products Qatar"],
      ar: ["منتجات العناية بالسيارات قطر", "شامبو سيارات الدوحة", "ملمع سيارات قطر"],
    },
    sections: [
      {
        heading: { en: "Car Shampoos: The Foundation of Car Care", ar: "شامبوهات السيارات: أساس العناية" },
        body: {
          en: "A quality car shampoo is the most-used product in any detailing kit. In Qatar, you need a pH-balanced formula that cleans effectively without stripping wax, sealant, or ceramic coating protection. Autotriz Rich Foam Shampoo produces thick, lubricating foam that lifts sand and dirt safely — critical in a country where airborne sand can scratch paint during washing. Briller Wash and Wax combines cleaning and protection in one step, depositing a light wax layer as you wash. For convenience, Insta Finish Wash and Wax offers a similar all-in-one solution. All three are available at ABK Trading in Mesaimeer, Doha.",
          ar: "شامبو السيارات عالي الجودة هو المنتج الأكثر استخداماً في أي مجموعة تلميع. في قطر، تحتاج تركيبة متوازنة الحموضة تنظف بفعالية دون إزالة الشمع أو الطلاء السيراميكي. شامبو Autotriz Rich Foam ينتج رغوة سميكة ترفع الرمل والأوساخ بأمان.",
        },
      },
      {
        heading: { en: "Polishing Compounds: Restoring Paint to Showroom Condition", ar: "مركبات التلميع: استعادة الطلاء لحالة المعرض" },
        body: {
          en: "Qatar's sand and dust cause micro-scratches and swirl marks that dull paint over time. Polishing compounds remove these imperfections by levelling the clear coat. Autotriz Heavy Cut 901 is a professional-grade cutting compound that removes deep scratches, sanding marks, and severe oxidation. Autotriz Power Cut 701 handles medium defects. Autotriz Ultimate Polish 302 is the finishing step — a fine polish that restores mirror-like clarity and removes holograms left by cutting compounds. For best results, machine polishing by a trained detailer is recommended. ABK's Mesaimeer workshop offers professional paint correction services using these products.",
          ar: "يتسبب رمل وغبار قطر في خدوش دقيقة وعلامات دوائر تُبهت الطلاء بمرور الوقت. مركبات التلميع تزيل هذه العيوب. Autotriz Heavy Cut 901 مركب قطع احترافي يزيل الخدوش العميقة. Autotriz Ultimate Polish 302 هو خطوة التشطيب التي تعيد اللمعان.",
        },
      },
      {
        heading: { en: "Tyre and Exterior Care", ar: "العناية بالإطارات والخارج" },
        body: {
          en: "Qatar's intense UV radiation degrades tyre rubber, causing dry rot and sidewall cracking. Regular application of tyre dressing like Briller Quick Tyre Shine or Smart Car Tyre Foam protects against UV damage and restores a deep black finish. For glass, Briller Glass Cleaner cuts through the film of dust and mineral deposits that accumulate on windshields in Doha. Getsun Tire Shine offers an aerosol alternative for quick tyre care. For engine bays, Getsun Foam Out Engine Degreaser safely removes oil and grime buildup accelerated by extreme heat.",
          ar: "تُتلف الأشعة فوق البنفسجية الشديدة في قطر مطاط الإطارات مسببةً التشقق الجاف. التطبيق المنتظم لملمع الإطارات مثل Briller Quick Tyre Shine يحمي من أضرار الأشعة فوق البنفسجية ويعيد اللون الأسود العميق. لتنظيف الزجاج، Briller Glass Cleaner يزيل طبقة الغبار والرواسب المعدنية.",
        },
      },
      {
        heading: { en: "Where to Buy Car Care Products in Doha", ar: "أين تشتري منتجات العناية بالسيارات في الدوحة" },
        body: {
          en: "ABK Trading and Service in Mesaimeer, Doha is a one-stop shop for car care products in Qatar. We are the authorised distributor for Vertek PPF, Autotriz detailing chemicals, Briller car care, and Insta Finish products. We stock everything from car shampoos and polishing compounds to ceramic coatings and paint protection film. Both retail customers and wholesale buyers (detailing shops, car washes, body shops) are welcome. Visit us Saturday to Thursday, 10:00 to 13:00 and 16:00 to 22:00, or reach us on WhatsApp at +974 30838355 for product availability and pricing.",
          ar: "ABK للتجارة والخدمات في مسيمير، الدوحة هو متجرك الشامل لمنتجات العناية بالسيارات في قطر. نحن الموزع المعتمد لأفلام Vertek PPF وكيماويات Autotriz ومنتجات Briller وInsta Finish. نوفر كل شيء من شامبوهات السيارات إلى الطلاءات السيراميكية. زرنا أو تواصل عبر واتساب 30838355 974+.",
        },
      },
    ],
    relatedProducts: [
      "autotriz-rich-foam-shampoo",
      "briller-wash-and-wax",
      "autotriz-heavy-cut-901",
      "briller-quick-tyre-shine",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
