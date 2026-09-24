import type { LocalizedText } from "./products";

/**
 * Delivery areas offered in the retail checkout. The shopper can always pick
 * "Other" and type their area, so this list only needs the common ones — add
 * or rename entries freely; the `key` is what gets stored on the device.
 */
export type QatarArea = { key: string; name: LocalizedText };

export const QATAR_AREAS: readonly QatarArea[] = [
  { key: "abu-hamour", name: { en: "Abu Hamour", ar: "أبو هامور" } },
  { key: "ain-khaled", name: { en: "Ain Khaled", ar: "عين خالد" } },
  { key: "al-aziziya", name: { en: "Al Aziziya", ar: "العزيزية" } },
  { key: "al-dafna", name: { en: "Al Dafna", ar: "الدفنة" } },
  { key: "al-duhail", name: { en: "Al Duhail", ar: "الدحيل" } },
  { key: "al-gharrafa", name: { en: "Al Gharrafa", ar: "الغرافة" } },
  { key: "al-hilal", name: { en: "Al Hilal", ar: "الهلال" } },
  { key: "al-khor", name: { en: "Al Khor", ar: "الخور" } },
  { key: "al-luqta", name: { en: "Al Luqta", ar: "اللقطة" } },
  { key: "al-mamoura", name: { en: "Al Mamoura", ar: "المعمورة" } },
  { key: "al-mansoura", name: { en: "Al Mansoura", ar: "المنصورة" } },
  { key: "al-markhiya", name: { en: "Al Markhiya", ar: "المرخية" } },
  { key: "al-muntazah", name: { en: "Al Muntazah", ar: "المنتزه" } },
  { key: "al-nasr", name: { en: "Al Nasr", ar: "النصر" } },
  { key: "al-rayyan", name: { en: "Al Rayyan", ar: "الريان" } },
  { key: "al-sadd", name: { en: "Al Sadd", ar: "السد" } },
  { key: "al-sailiya", name: { en: "Al Sailiya", ar: "السيلية" } },
  { key: "al-shamal", name: { en: "Al Shamal", ar: "الشمال" } },
  { key: "al-thumama", name: { en: "Al Thumama", ar: "الثمامة" } },
  { key: "al-waab", name: { en: "Al Waab", ar: "الوعب" } },
  { key: "al-wakrah", name: { en: "Al Wakrah", ar: "الوكرة" } },
  { key: "al-wukair", name: { en: "Al Wukair", ar: "الوكير" } },
  { key: "bin-mahmoud", name: { en: "Bin Mahmoud", ar: "بن محمود" } },
  { key: "dukhan", name: { en: "Dukhan", ar: "دخان" } },
  { key: "education-city", name: { en: "Education City", ar: "المدينة التعليمية" } },
  { key: "fereej-bin-omran", name: { en: "Fereej Bin Omran", ar: "فريج بن عمران" } },
  { key: "industrial-area", name: { en: "Industrial Area", ar: "المنطقة الصناعية" } },
  { key: "lusail", name: { en: "Lusail", ar: "لوسيل" } },
  { key: "madinat-khalifa", name: { en: "Madinat Khalifa", ar: "مدينة خليفة" } },
  { key: "mesaieed", name: { en: "Mesaieed", ar: "مسيعيد" } },
  { key: "mesaimeer", name: { en: "Mesaimeer", ar: "مسيمير" } },
  { key: "muaither", name: { en: "Muaither", ar: "معيذر" } },
  { key: "najma", name: { en: "Najma", ar: "نجمة" } },
  { key: "old-airport", name: { en: "Old Airport", ar: "المطار القديم" } },
  { key: "onaiza", name: { en: "Onaiza", ar: "عنيزة" } },
  { key: "the-pearl", name: { en: "The Pearl", ar: "اللؤلؤة" } },
  { key: "umm-ghuwailina", name: { en: "Umm Ghuwailina", ar: "أم غويلينة" } },
  { key: "umm-salal", name: { en: "Umm Salal", ar: "أم صلال" } },
  { key: "west-bay", name: { en: "West Bay", ar: "الخليج الغربي" } },
];

/** Select value for "my area isn't listed". */
export const AREA_OTHER = "other";

export function findArea(key: string): QatarArea | undefined {
  return QATAR_AREAS.find((a) => a.key === key);
}
