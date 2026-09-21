/**
 * Builds WhatsApp deep-link URLs with audience + locale-specific pre-filled messages.
 * Phone number is the user-supplied ABK WhatsApp line: +974 30838355
 */

export const WHATSAPP_PHONE = "97430838355"; // no + or spaces per wa.me spec
export const CONTACT_EMAIL = "sales@abktradingservice.com";

export type Audience = "b2c" | "b2b";
export type WALocale = "en" | "ar";

export type WAContext = {
  audience: Audience;
  locale: WALocale;
  productName?: string;
  productPrice?: string;
  productUrl?: string;
};

function encode(text: string) {
  return encodeURIComponent(text.trim());
}

export function buildWhatsAppMessage({
  audience,
  locale,
  productName,
  productPrice,
  productUrl,
}: WAContext): string {
  const hasProduct = Boolean(productName);
  const priceTag = productPrice ? ` (${productPrice})` : "";

  if (audience === "b2c") {
    if (locale === "ar") {
      return hasProduct
        ? `السلام عليكم، أنا مهتم بمنتج "${productName}"${priceTag} من ABK Trading & Service.${
            productUrl ? `\nالرابط: ${productUrl}` : ""
          }\nأرجو إفادتي بالتفاصيل وطريقة الطلب.`
        : `السلام عليكم، أرغب في الاستفسار عن منتجاتكم. شكراً.`;
    }
    return hasProduct
      ? `Hi ABK, I'm interested in "${productName}"${priceTag}.${
          productUrl ? `\nLink: ${productUrl}` : ""
        }\nCould you share details and how to order?`
      : `Hi ABK, I'd like to inquire about your products.`;
  }

  // B2B
  if (locale === "ar") {
    return hasProduct
      ? `السلام عليكم،\nأرغب في الحصول على أسعار الجملة للمنتج: "${productName}".${
          productUrl ? `\nالرابط: ${productUrl}` : ""
        }\nاسم الشركة: ____\nالكمية المطلوبة: ____\nشكراً.`
      : `السلام عليكم،\nنحن شركة مهتمة بالتعاون كموزع/تاجر جملة مع ABK Trading & Service.\nاسم الشركة: ____\nالمنتجات المهتم بها: ____\nالكمية الشهرية المتوقعة: ____\nأرجو إرسال قائمة أسعار الجملة. شكراً.`;
  }
  return hasProduct
    ? `Hi ABK, I'd like to enquire about wholesale pricing for "${productName}".${
        productUrl ? `\nLink: ${productUrl}` : ""
      }\nCompany: ____\nQuantity: ____\nThank you.`
    : `Hi ABK, I'm reaching out about becoming a wholesale partner/reseller.\nCompany: ____\nProducts of interest: ____\nEstimated monthly volume: ____\nPlease share your wholesale price list. Thank you.`;
}

export function buildWhatsAppUrl(ctx: WAContext): string {
  const text = buildWhatsAppMessage(ctx);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encode(text)}`;
}

export function buildMailto(subject: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
