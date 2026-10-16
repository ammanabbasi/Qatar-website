/**
 * Curated vehicle make & model lookup for Qatar roads.
 *
 * Used by the PPF installation quote builder so customers who are unsure
 * whether their vehicle counts as a "Sedan / Coupe", "Mid SUV / Crossover"
 * or "SUV / Large SUV" can simply type their car's make or model (in English
 * or Arabic) to either:
 *   1. Instantly see which pricing tier their car falls under + exact prices, or
 *   2. Request a custom offer for any make & model.
 */

import type { BodyType } from "./ppfInstall";
import type { LocalizedText } from "./products";

export type QatarCarEntry = {
  id: string;
  make: LocalizedText;
  model: LocalizedText;
  body: BodyType;
  /** Additional search tokens (chassis codes, trims, Arabic nicknames). */
  keywords?: string[];
};

const M = {
  toyota: { en: "Toyota", ar: "تويوتا" },
  nissan: { en: "Nissan", ar: "نيسان" },
  lexus: { en: "Lexus", ar: "لكزس" },
  jetour: { en: "Jetour", ar: "جيتور" },
  landRover: { en: "Land Rover", ar: "لاند روفر" },
  mercedes: { en: "Mercedes-Benz", ar: "مرسيدس" },
  bmw: { en: "BMW", ar: "بي إم دبليو" },
  porsche: { en: "Porsche", ar: "بورش" },
  gmc: { en: "GMC", ar: "جي إم سي" },
  chevrolet: { en: "Chevrolet", ar: "شيفروليه" },
  ford: { en: "Ford", ar: "فورد" },
  hyundai: { en: "Hyundai", ar: "هيونداي" },
  kia: { en: "Kia", ar: "كيا" },
  honda: { en: "Honda", ar: "هوندا" },
  mitsubishi: { en: "Mitsubishi", ar: "ميتسوبيشي" },
  audi: { en: "Audi", ar: "أودي" },
  vw: { en: "Volkswagen", ar: "فولكس واجن" },
  gwm: { en: "GWM / Tank", ar: "تانك / جريت وول" },
  haval: { en: "Haval", ar: "هافال" },
  geely: { en: "Geely", ar: "جيلي" },
  changan: { en: "Changan", ar: "شانجان" },
  mg: { en: "MG", ar: "إم جي" },
  byd: { en: "BYD", ar: "بي واي دي" },
  tesla: { en: "Tesla", ar: "تسلا" },
  jeep: { en: "Jeep", ar: "جيب" },
  dodge: { en: "Dodge", ar: "دودج" },
  ram: { en: "Ram", ar: "رام" },
  cadillac: { en: "Cadillac", ar: "كاديلاك" },
  lincoln: { en: "Lincoln", ar: "لينكون" },
  infiniti: { en: "Infiniti", ar: "إنفينيتي" },
  genesis: { en: "Genesis", ar: "جينيسيس" },
  mazda: { en: "Mazda", ar: "مازدا" },
  volvo: { en: "Volvo", ar: "فولفو" },
  isuzu: { en: "Isuzu", ar: "إيسوزو" },
  hongqi: { en: "Hongqi", ar: "هونشي" },
} as const;

export const QATAR_CARS: QatarCarEntry[] = [
  // ── Toyota ──
  { id: "toyota-land-cruiser", make: M.toyota, model: { en: "Land Cruiser", ar: "لاند كروزر" }, body: "large-suv", keywords: ["lc300", "lc200", "gxr", "vxr", "vx", "gr sport", "مفخرة", "هدد", "استيشن"] },
  { id: "toyota-prado", make: M.toyota, model: { en: "Land Cruiser Prado", ar: "برادو" }, body: "large-suv", keywords: ["prado", "lc250", "برادو"] },
  { id: "toyota-lc70", make: M.toyota, model: { en: "Land Cruiser 70 (Pickup / Quarter)", ar: "لاند كروزر شاص / ربع" }, body: "large-suv", keywords: ["shas", "lc70", "lc79", "شاص", "ربع", "بوشنب"] },
  { id: "toyota-hilux", make: M.toyota, model: { en: "Hilux", ar: "هايلكس" }, body: "large-suv", keywords: ["pickup", "adventure", "gr"] },
  { id: "toyota-sequoia", make: M.toyota, model: { en: "Sequoia / Tundra", ar: "سيكويا / تندرا" }, body: "large-suv", keywords: ["tundra", "trd"] },
  { id: "toyota-fortuner", make: M.toyota, model: { en: "Fortuner", ar: "فورتشنر" }, body: "suv" },
  { id: "toyota-rav4", make: M.toyota, model: { en: "RAV4", ar: "راف فور" }, body: "suv", keywords: ["rav 4", "راف 4"] },
  { id: "toyota-fj", make: M.toyota, model: { en: "FJ Cruiser", ar: "إف جي كروزر" }, body: "suv", keywords: ["fj", "اف جي"] },
  { id: "toyota-corolla-cross", make: M.toyota, model: { en: "Corolla Cross / Urban Cruiser", ar: "كورولا كروس / أوربان كروزر" }, body: "suv", keywords: ["raize", "c-hr", "chr"] },
  { id: "toyota-camry", make: M.toyota, model: { en: "Camry", ar: "كامري" }, body: "sedan", keywords: ["grande", "gle"] },
  { id: "toyota-corolla", make: M.toyota, model: { en: "Corolla", ar: "كورولا" }, body: "sedan" },
  { id: "toyota-yaris", make: M.toyota, model: { en: "Yaris", ar: "يارس" }, body: "sedan" },
  { id: "toyota-crown", make: M.toyota, model: { en: "Crown / Avalon", ar: "كراون / أفالون" }, body: "sedan" },
  { id: "toyota-supra", make: M.toyota, model: { en: "GR Supra / GR86", ar: "سوبرا / GR86" }, body: "sedan" },

  // ── Nissan ──
  { id: "nissan-patrol", make: M.nissan, model: { en: "Patrol", ar: "باترول" }, body: "large-suv", keywords: ["y62", "y63", "platinum", "nismo", "titanium", "le", "se", "بطل الدروب", "نيسمو", "بلاتينيوم"] },
  { id: "nissan-patrol-safari", make: M.nissan, model: { en: "Patrol Safari (VTC)", ar: "باترول سفاري (فتك)" }, body: "large-suv", keywords: ["vtc", "super safari", "y61", "فتك", "سوبر سفاري"] },
  { id: "nissan-x-trail", make: M.nissan, model: { en: "X-Trail", ar: "إكس تريل" }, body: "suv", keywords: ["xtrail", "اكس تريل"] },
  { id: "nissan-x-terra", make: M.nissan, model: { en: "X-Terra / Pathfinder", ar: "إكس تيرا / باثفندر" }, body: "suv", keywords: ["xterra", "pathfinder", "اكس تيرا"] },
  { id: "nissan-kicks", make: M.nissan, model: { en: "Kicks / Qashqai", ar: "كيكس / قشقاي" }, body: "suv" },
  { id: "nissan-altima", make: M.nissan, model: { en: "Altima", ar: "ألتيما" }, body: "sedan", keywords: ["التيما"] },
  { id: "nissan-maxima", make: M.nissan, model: { en: "Maxima", ar: "ماكسيما" }, body: "sedan" },
  { id: "nissan-sunny", make: M.nissan, model: { en: "Sunny / Sentra", ar: "صني / سنترا" }, body: "sedan" },
  { id: "nissan-z", make: M.nissan, model: { en: "Z / GT-R", ar: "زد / جي تي آر" }, body: "sedan", keywords: ["400z", "370z", "gtr"] },

  // ── Lexus ──
  { id: "lexus-lx", make: M.lexus, model: { en: "LX (LX600 / LX570)", ar: "LX (إل إكس 600 / 570)" }, body: "large-suv", keywords: ["lx600", "lx570", "ال اكس", "لكزس استيشن"] },
  { id: "lexus-gx", make: M.lexus, model: { en: "GX (GX550 / GX460)", ar: "GX (جي إكس 550 / 460)" }, body: "large-suv", keywords: ["gx550", "gx460"] },
  { id: "lexus-rx", make: M.lexus, model: { en: "RX", ar: "آر إكس (RX)" }, body: "suv", keywords: ["rx350", "rx500h", "ار اكس"] },
  { id: "lexus-nx", make: M.lexus, model: { en: "NX / UX", ar: "إن إكس (NX)" }, body: "suv", keywords: ["nx350", "ux200"] },
  { id: "lexus-es", make: M.lexus, model: { en: "ES", ar: "إي إس (ES)" }, body: "sedan", keywords: ["es350", "es300h", "اي اس"] },
  { id: "lexus-is", make: M.lexus, model: { en: "IS / LS / LC", ar: "IS / LS / LC" }, body: "sedan", keywords: ["is350", "ls500", "lc500"] },

  // ── Jetour ──
  { id: "jetour-t2", make: M.jetour, model: { en: "T2", ar: "T2 (تي 2)" }, body: "suv", keywords: ["traveller", "جيتور تي 2", "ترافلر"] },
  { id: "jetour-t1", make: M.jetour, model: { en: "T1", ar: "T1 (تي 1)" }, body: "suv" },
  { id: "jetour-dashing", make: M.jetour, model: { en: "Dashing", ar: "داشينغ" }, body: "suv" },
  { id: "jetour-x70", make: M.jetour, model: { en: "X70 Plus / X90 Plus", ar: "X70 بلس / X90 بلس" }, body: "suv", keywords: ["x70", "x90"] },

  // ── Land Rover / Range Rover ──
  { id: "lr-defender", make: M.landRover, model: { en: "Defender 110 / 130", ar: "ديفندر 110 / 130" }, body: "large-suv", keywords: ["defender", "ديفندر", "octa", "v8"] },
  { id: "lr-defender-90", make: M.landRover, model: { en: "Defender 90 (2-Door)", ar: "ديفندر 90 (بابين)" }, body: "suv", keywords: ["defender 90"] },
  { id: "lr-range-rover", make: M.landRover, model: { en: "Range Rover (Vogue / SV)", ar: "رنج روفر (فوج / أوتوبيوغرافي)" }, body: "large-suv", keywords: ["vogue", "autobiography", "رنج روفر"] },
  { id: "lr-range-rover-sport", make: M.landRover, model: { en: "Range Rover Sport", ar: "رنج روفر سبورت" }, body: "large-suv", keywords: ["svr", "سبورت"] },
  { id: "lr-velar", make: M.landRover, model: { en: "Range Rover Velar / Evoque", ar: "رنج روفر فيلار / إيفوك" }, body: "suv", keywords: ["velar", "evoque", "فيلار", "ايفوك"] },

  // ── Mercedes-Benz ──
  { id: "mb-g-class", make: M.mercedes, model: { en: "G-Class (G63 / G500)", ar: "جي كلاس (G63 / G500)" }, body: "large-suv", keywords: ["g63", "g500", "gwagon", "g-wagon", "amg", "جي 63", "جي كلاس"] },
  { id: "mb-gls", make: M.mercedes, model: { en: "GLS / Maybach GLS", ar: "GLS / مايباخ" }, body: "large-suv", keywords: ["gls600", "gls580", "gls450", "eqs suv"] },
  { id: "mb-gle", make: M.mercedes, model: { en: "GLE / GLE Coupe", ar: "GLE / GLE كوبيه" }, body: "suv", keywords: ["gle53", "gle63", "gle450"] },
  { id: "mb-glc", make: M.mercedes, model: { en: "GLC / GLA / GLB", ar: "GLC / GLA / GLB" }, body: "suv", keywords: ["glc300", "glc43"] },
  { id: "mb-s-class", make: M.mercedes, model: { en: "S-Class / E-Class / C-Class", ar: "إس كلاس / إي كلاس / سي كلاس" }, body: "sedan", keywords: ["s500", "s580", "e300", "c200", "c300", "cla", "cle", "amg gt", "sl"] },

  // ── BMW ──
  { id: "bmw-x7", make: M.bmw, model: { en: "X7 / XM", ar: "X7 / XM" }, body: "large-suv", keywords: ["x7", "xm", "m60i"] },
  { id: "bmw-x5", make: M.bmw, model: { en: "X5 / X6", ar: "X5 / X6" }, body: "suv", keywords: ["x5m", "x6m", "إكس 5", "إكس 6"] },
  { id: "bmw-x3", make: M.bmw, model: { en: "X1 / X2 / X3 / X4 / iX", ar: "X1 / X3 / X4 / iX" }, body: "suv" },
  { id: "bmw-sedan", make: M.bmw, model: { en: "3 / 5 / 7 Series / M3 / M4 / M5", ar: "الفئة 3 / 5 / 7 / M3 / M5" }, body: "sedan", keywords: ["520i", "530i", "740i", "760i", "m3", "m4", "m5", "i7", "i4"] },

  // ── Porsche ──
  { id: "porsche-cayenne", make: M.porsche, model: { en: "Cayenne / Cayenne Coupe", ar: "كايين / كايين كوبيه" }, body: "suv", keywords: ["turbo gt", "gts", "كايين"] },
  { id: "porsche-macan", make: M.porsche, model: { en: "Macan", ar: "ماكان" }, body: "suv", keywords: ["ماكان"] },
  { id: "porsche-911", make: M.porsche, model: { en: "911 / Taycan / Panamera / 718", ar: "911 / تايكان / باناميرا" }, body: "sedan", keywords: ["carrera", "gt3", "turbo s", "cayman", "boxster"] },

  // ── GMC & Chevrolet ──
  { id: "gmc-yukon", make: M.gmc, model: { en: "Yukon / Yukon XL", ar: "يوكن / يوكن XL" }, body: "large-suv", keywords: ["denali", "at4", "يوكون", "دينالي"] },
  { id: "gmc-sierra", make: M.gmc, model: { en: "Sierra 1500 / HD", ar: "سييرا" }, body: "large-suv", keywords: ["denali", "at4", "at4x", "elevation", "غمارة", "غمارتين"] },
  { id: "gmc-acadia", make: M.gmc, model: { en: "Acadia / Terrain", ar: "أكاديا / تيرين" }, body: "suv" },
  { id: "chevy-tahoe", make: M.chevrolet, model: { en: "Tahoe / Suburban", ar: "تاهو / سوبربان" }, body: "large-suv", keywords: ["z71", "rst", "premier", "تاهو"] },
  { id: "chevy-silverado", make: M.chevrolet, model: { en: "Silverado", ar: "سيلفرادو" }, body: "large-suv", keywords: ["zr2", "trail boss"] },
  { id: "chevy-traverse", make: M.chevrolet, model: { en: "Traverse / Blazer / Captiva", ar: "ترافيرس / بليزر / كابتيفا" }, body: "suv", keywords: ["groove"] },
  { id: "chevy-corvette", make: M.chevrolet, model: { en: "Corvette / Camaro / Malibu", ar: "كورفيت / كمارو / ماليبو" }, body: "sedan", keywords: ["c8", "z06"] },

  // ── Ford ──
  { id: "ford-f150", make: M.ford, model: { en: "F-150 / Raptor", ar: "F-150 / رابتر" }, body: "large-suv", keywords: ["f150", "raptor", "lariat", "tremor", "رابتر", "اف 150"] },
  { id: "ford-expedition", make: M.ford, model: { en: "Expedition", ar: "إكسبيديشن" }, body: "large-suv", keywords: ["timberline", "اكسبدشن"] },
  { id: "ford-bronco", make: M.ford, model: { en: "Bronco / Explorer", ar: "برونكو / إكسبلورر" }, body: "suv", keywords: ["badlands", "wildtrak", "st", "اكسبلورر"] },
  { id: "ford-territory", make: M.ford, model: { en: "Territory / Edge", ar: "تيريتوري / إيدج" }, body: "suv" },
  { id: "ford-mustang", make: M.ford, model: { en: "Mustang / Taurus", ar: "موستانج / تورس" }, body: "sedan", keywords: ["gt", "dark horse", "توروس"] },

  // ── GWM / Tank / Haval ──
  { id: "gwm-tank-500", make: M.gwm, model: { en: "Tank 500", ar: "تانك 500" }, body: "large-suv", keywords: ["tank500"] },
  { id: "gwm-tank-300", make: M.gwm, model: { en: "Tank 300", ar: "تانك 300" }, body: "suv", keywords: ["tank300"] },
  { id: "gwm-poer", make: M.gwm, model: { en: "Poer Pickup", ar: "باور بيك أب" }, body: "large-suv" },
  { id: "haval-h6", make: M.haval, model: { en: "H6 / Dargo / Jolion", ar: "H6 / دارجو / جوليون" }, body: "suv" },

  // ── Hyundai & Kia ──
  { id: "hyundai-palisade", make: M.hyundai, model: { en: "Palisade / Staria", ar: "باليسيد / ستاريا" }, body: "large-suv" },
  { id: "hyundai-tucson", make: M.hyundai, model: { en: "Tucson / Santa Fe / Creta", ar: "توسان / سنتافي / كريتا" }, body: "suv", keywords: ["kona", "ioniq 5"] },
  { id: "hyundai-sonata", make: M.hyundai, model: { en: "Elantra / Sonata / Azera / Accent", ar: "إلنترا / سوناتا / أزيرا / أكسنت" }, body: "sedan" },
  { id: "kia-telluride", make: M.kia, model: { en: "Telluride / Carnival / EV9", ar: "تيلورايد / كرنفال / EV9" }, body: "large-suv" },
  { id: "kia-sportage", make: M.kia, model: { en: "Sportage / Sorento / Seltos", ar: "سبورتاج / سورينتو / سيلتوس" }, body: "suv" },
  { id: "kia-k5", make: M.kia, model: { en: "K5 / K8 / Cerato / Stinger", ar: "K5 / K8 / سيراتو" }, body: "sedan", keywords: ["optima", "أوبتيما"] },

  // ── Honda & Mitsubishi & Mazda & Isuzu ──
  { id: "honda-crv", make: M.honda, model: { en: "CR-V / Pilot / ZR-V / HR-V", ar: "CR-V / بايلوت / HR-V" }, body: "suv", keywords: ["crv", "hrv", "zrv"] },
  { id: "honda-accord", make: M.honda, model: { en: "Accord / Civic / City", ar: "أكورد / سيفيك / سيتي" }, body: "sedan", keywords: ["type r", "اكورد"] },
  { id: "mitsubishi-pajero", make: M.mitsubishi, model: { en: "Pajero / L200", ar: "باجيرو / L200" }, body: "large-suv" },
  { id: "mitsubishi-outlander", make: M.mitsubishi, model: { en: "Outlander / Montero Sport / ASX", ar: "أوتلاندر / مونتيرو سبورت" }, body: "suv", keywords: ["eclipse cross"] },
  { id: "mazda-cx", make: M.mazda, model: { en: "CX-5 / CX-9 / CX-60 / CX-90 / CX-30", ar: "CX-5 / CX-9 / CX-90" }, body: "suv", keywords: ["cx5", "cx9", "cx90", "cx60", "cx30"] },
  { id: "mazda-sedan", make: M.mazda, model: { en: "Mazda 6 / Mazda 3", ar: "مازدا 6 / مازدا 3" }, body: "sedan", keywords: ["mazda6", "mazda3"] },
  { id: "isuzu-dmax", make: M.isuzu, model: { en: "D-Max / MU-X", ar: "دي ماكس / MU-X" }, body: "large-suv", keywords: ["dmax"] },

  // ── Audi & Volkswagen & Volvo ──
  { id: "audi-q", make: M.audi, model: { en: "Q7 / Q8 / Q5 / Q3", ar: "Q7 / Q8 / Q5 / Q3" }, body: "suv", keywords: ["rsq8", "sq7", "sq8", "etron"] },
  { id: "audi-a", make: M.audi, model: { en: "A3 / A4 / A6 / A7 / A8 / RS6 / R8", ar: "A4 / A6 / A8 / RS6" }, body: "sedan" },
  { id: "vw-teramont", make: M.vw, model: { en: "Teramont", ar: "تيرامونت" }, body: "large-suv" },
  { id: "vw-tiguan", make: M.vw, model: { en: "Touareg / Tiguan / T-Roc", ar: "طوارق / تيجوان / تي روك" }, body: "suv" },
  { id: "vw-golf", make: M.vw, model: { en: "Golf GTI / Golf R / Passat", ar: "جولف GTI / جولف R / باسات" }, body: "sedan" },
  { id: "volvo-xc", make: M.volvo, model: { en: "XC90 / XC60 / XC40", ar: "XC90 / XC60 / XC40" }, body: "suv" },

  // ── Geely, Changan, MG, BYD, Tesla, Hongqi ──
  { id: "geely-monjaro", make: M.geely, model: { en: "Monjaro / Tugella / Coolray / Starray", ar: "مونجارو / توجيلا / كول راي" }, body: "suv", keywords: ["okavango"] },
  { id: "geely-sedan", make: M.geely, model: { en: "Preface / Emgrand", ar: "بريفيس / إمجراند" }, body: "sedan" },
  { id: "changan-suv", make: M.changan, model: { en: "UNI-K / UNI-T / CS95 / CS75 Plus / CS85", ar: "يوني كي / CS95 / CS75 بلس" }, body: "suv", keywords: ["unik", "unit", "cs35"] },
  { id: "changan-sedan", make: M.changan, model: { en: "UNI-V / Eado Plus", ar: "يوني في / إيدو بلس" }, body: "sedan", keywords: ["univ"] },
  { id: "mg-suv", make: M.mg, model: { en: "RX8 / RX5 / HS / ZS / Whale / One", ar: "RX8 / RX5 / HS / ZS" }, body: "suv" },
  { id: "mg-sedan", make: M.mg, model: { en: "MG7 / MG6 / MG5 / GT", ar: "MG7 / MG6 / MG5 / GT" }, body: "sedan" },
  { id: "byd-leopard", make: M.byd, model: { en: "Leopard 5 (Bao 5) / Yangwang U8", ar: "ليوبارد 5 / يانغ وانغ U8" }, body: "large-suv", keywords: ["bao5", "u8"] },
  { id: "byd-suv", make: M.byd, model: { en: "Song Plus / Atto 3 / Tang", ar: "سونج بلس / أتو 3 / تانج" }, body: "suv" },
  { id: "byd-sedan", make: M.byd, model: { en: "Seal / Han / Qin Plus", ar: "سيل / هان / تشين بلس" }, body: "sedan" },
  { id: "tesla-y", make: M.tesla, model: { en: "Model Y / Model X", ar: "موديل Y / موديل X" }, body: "suv" },
  { id: "tesla-3", make: M.tesla, model: { en: "Model 3 / Model S", ar: "موديل 3 / موديل S" }, body: "sedan" },
  { id: "tesla-cybertruck", make: M.tesla, model: { en: "Cybertruck", ar: "سايبر تراك" }, body: "large-suv" },
  { id: "hongqi-ehs9", make: M.hongqi, model: { en: "E-HS9 / HS7", ar: "E-HS9 / HS7" }, body: "large-suv", keywords: ["hs5", "h9", "ousado"] },

  // ── Jeep, Dodge, Ram, Cadillac, Lincoln, Infiniti, Genesis ──
  { id: "jeep-wrangler", make: M.jeep, model: { en: "Wrangler / Grand Cherokee", ar: "رانجلر / جراند شيروكي" }, body: "suv", keywords: ["rubicon", "sahara", "روبيكون"] },
  { id: "jeep-wagoneer", make: M.jeep, model: { en: "Grand Wagoneer / Gladiator", ar: "جراند واجونير / جلاديتور" }, body: "large-suv" },
  { id: "ram-1500", make: M.ram, model: { en: "1500 / TRX / Rebel", ar: "رام 1500 / TRX / ريبيل" }, body: "large-suv", keywords: ["trx", "rebel", "laramie"] },
  { id: "dodge-durango", make: M.dodge, model: { en: "Durango", ar: "دورانجو" }, body: "large-suv", keywords: ["srt", "hellcat"] },
  { id: "dodge-charger", make: M.dodge, model: { en: "Charger / Challenger", ar: "تشارجر / تشالنجر" }, body: "sedan", keywords: ["scat pack", "hellcat"] },
  { id: "cadillac-escalade", make: M.cadillac, model: { en: "Escalade", ar: "إسكاليد" }, body: "large-suv", keywords: ["esv", "v-series", "اسكاليد"] },
  { id: "cadillac-xt", make: M.cadillac, model: { en: "XT4 / XT5 / XT6 / CT5", ar: "XT5 / XT6 / CT5" }, body: "suv" },
  { id: "lincoln-navigator", make: M.lincoln, model: { en: "Navigator", ar: "نافيجيتور" }, body: "large-suv" },
  { id: "lincoln-aviator", make: M.lincoln, model: { en: "Aviator / Nautilus / Corsair", ar: "أفياتور / نوتيلوس" }, body: "suv" },
  { id: "infiniti-qx80", make: M.infiniti, model: { en: "QX80", ar: "QX80" }, body: "large-suv" },
  { id: "infiniti-qx60", make: M.infiniti, model: { en: "QX60 / QX50 / QX55", ar: "QX60 / QX50" }, body: "suv" },
  { id: "genesis-gv", make: M.genesis, model: { en: "GV80 / GV70", ar: "GV80 / GV70" }, body: "suv" },
  { id: "genesis-g", make: M.genesis, model: { en: "G90 / G80 / G70", ar: "G90 / G80 / G70" }, body: "sedan" },
];

function normaliseSearch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[-_/.,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Searches the Qatar vehicle database by make, model, or keyword in English or Arabic.
 */
export function searchQatarCars(query: string, limit = 6): QatarCarEntry[] {
  const q = normaliseSearch(query);
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);

  const scored: Array<{ entry: QatarCarEntry; score: number }> = [];

  for (const entry of QATAR_CARS) {
    const haystack = normaliseSearch(
      [
        entry.make.en,
        entry.make.ar,
        entry.model.en,
        entry.model.ar,
        ...(entry.keywords ?? []),
      ].join(" "),
    );

    const matchedAll = tokens.every((tok) => haystack.includes(tok));
    if (!matchedAll) continue;

    let score = 10;
    const modelEn = normaliseSearch(entry.model.en);
    const modelAr = normaliseSearch(entry.model.ar);
    const makeEn = normaliseSearch(entry.make.en);
    const makeAr = normaliseSearch(entry.make.ar);

    if (modelEn.startsWith(q) || modelAr.startsWith(q)) score += 30;
    else if (makeEn.startsWith(q) || makeAr.startsWith(q)) score += 20;
    else if (`${makeEn} ${modelEn}`.startsWith(q) || `${makeAr} ${modelAr}`.startsWith(q)) score += 35;

    if (entry.keywords?.some((k) => normaliseSearch(k) === q)) score += 25;

    scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

/**
 * Best-effort split of a single free-text car query (e.g. "Porsche Cayenne",
 * "Jetour T2", "Toyota Land Cruiser") into `{ make, model }` for pre-filling
 * the booking form.
 */
export function splitCarQuery(raw: string, locale: "en" | "ar" = "en"): { make: string; model: string } {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { make: "", model: "" };

  const norm = normaliseSearch(trimmed);
  for (const brand of Object.values(M)) {
    for (const candidate of [brand.en, brand.ar]) {
      const cNorm = normaliseSearch(candidate);
      if (norm === cNorm) {
        return { make: brand[locale], model: "" };
      }
      if (norm.startsWith(`${cNorm} `)) {
        const rest = trimmed.slice(candidate.length).trim();
        return { make: brand[locale], model: rest };
      }
    }
  }

  const parts = trimmed.split(" ");
  if (parts.length === 1) {
    return { make: "", model: parts[0] };
  }
  return { make: parts[0], model: parts.slice(1).join(" ") };
}

/**
 * Clean display label for a matched car entry (e.g. "Toyota Land Cruiser").
 * When an entry groups several models with "/", returns the specific model
 * the customer typed if it matches one of the slash-separated options.
 */
export function resolveCarModelName(
  entry: QatarCarEntry,
  query: string,
  locale: "en" | "ar",
): { make: string; model: string } {
  const make = entry.make[locale];
  const rawModel = entry.model[locale];
  if (!rawModel.includes("/")) return { make, model: rawModel };

  const q = normaliseSearch(query);
  const enVariants = entry.model.en.split("/").map((s) => s.trim());
  const arVariants = entry.model.ar.split("/").map((s) => s.trim());

  if (q) {
    for (let i = 0; i < enVariants.length; i++) {
      const enV = normaliseSearch(enVariants[i] ?? "");
      const arV = normaliseSearch(arVariants[i] ?? "");
      if ((enV && q.includes(enV)) || (arV && q.includes(arV))) {
        return { make, model: (locale === "ar" ? arVariants[i] : enVariants[i]) || rawModel };
      }
    }
  }

  return { make, model: (locale === "ar" ? arVariants[0] : enVariants[0]) || rawModel };
}
