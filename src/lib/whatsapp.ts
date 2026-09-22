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
  quantity?: number;
  notes?: string;
};

export type TrayItem = {
  slug: string;
  name: string;
  brand: string;
  category?: string;
  price?: string;
  priceQar?: number;
  quantity: number;
  audience: Audience;
  url: string;
  image?: string;
};

export type TrayContext = {
  items: TrayItem[];
  audience: Audience;
  locale: WALocale;
  companyName?: string;
  notes?: string;
};

export type DealerApplicationContext = {
  locale: WALocale;
  companyName: string;
  contactName: string;
  phone: string;
  businessType: string;
  location: string;
  estimatedVolume: string;
  priorityBrands: string[];
  notes?: string;
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
  quantity,
  notes,
}: WAContext): string {
  const hasProduct = Boolean(productName);
  const priceTag = productPrice ? ` (${productPrice})` : "";
  const qtyStr = quantity && quantity > 1 ? ` [الكمية: ${quantity}]` : "";
  const qtyStrEn = quantity && quantity > 1 ? ` [Qty: ${quantity}]` : "";

  if (audience === "b2c") {
    if (locale === "ar") {
      if (!hasProduct) {
        return `السلام عليكم، أود الاستفسار عن منتجات العناية بالسيارات المتوفرة لدى ABK Trading & Service. شكراً.`;
      }
      return `السلام عليكم ABK،\nأود طلب المنتج التالي:\n• ${productName}${qtyStr}${priceTag}${
        productUrl ? `\nالرابط: ${productUrl}` : ""
      }${notes ? `\nملاحظات: ${notes}` : ""}\nأرجو تأكيد التوفر في متجر مسيمير وموعد الاستلام/التوصيل. شكراً لك!`;
    }

    if (!hasProduct) {
      return `Hi ABK, I'd like to inquire about your car care products.`;
    }
    return `Hi ABK,\nI would like to order the following product:\n• ${productName}${qtyStrEn}${priceTag}${
      productUrl ? `\nLink: ${productUrl}` : ""
    }${notes ? `\nNotes: ${notes}` : ""}\nPlease confirm availability at your Mesaimeer store and delivery options. Thank you!`;
  }

  // B2B Wholesale
  if (locale === "ar") {
    if (!hasProduct) {
      return `السلام عليكم ABK،\nنحن شركة/مركز عناية مهتمون بطلب تسعير جملة وتوريد تجاري من ABK Trading & Service.\nاسم الشركة: ____\nالنشاط: ____\nالكمية الشهرية المتوقعة: ____\nيرجى تزويدنا بقائمة أسعار الجملة المعتمدة. شكراً.`;
    }
    return `السلام عليكم ABK،\nنود طلب عرض أسعار جملة للمنتج التالي:\n• ${productName}${qtyStr}${
      productUrl ? `\nالرابط: ${productUrl}` : ""
    }\nاسم الشركة / المركز: ____\nالكمية المطلوبة (رولات/كراتين): ____${notes ? `\nملاحظات: ${notes}` : ""}\nيرجى تزويدنا بالأسعار التجارية وشروط التوريد. شكراً.`;
  }

  if (!hasProduct) {
    return `Hi ABK,\nWe are reaching out to discuss wholesale trade supply and dealer pricing.\nCompany Name: ____\nBusiness Type: ____\nEstimated Monthly Volume: ____\nPlease share your wholesale trade catalogue. Thank you.`;
  }
  return `Hi ABK,\nWe would like to request a wholesale trade quote for:\n• ${productName}${qtyStrEn}${
    productUrl ? `\nLink: ${productUrl}` : ""
  }\nCompany / Workshop: ____\nQuantity Required (Rolls / Cartons): ____${notes ? `\nNotes: ${notes}` : ""}\nPlease share commercial trade pricing and delivery terms. Thank you.`;
}

export function buildWhatsAppUrl(ctx: WAContext): string {
  const text = buildWhatsAppMessage(ctx);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encode(text)}`;
}

export function buildTrayWhatsAppMessage({
  items,
  audience,
  locale,
  companyName,
  notes,
}: TrayContext): string {
  if (items.length === 0) {
    return buildWhatsAppMessage({ audience, locale });
  }

  if (audience === "b2c") {
    if (locale === "ar") {
      const list = items
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.name} × ${item.quantity}${item.price ? ` (${item.price})` : ""}\n   الرابط: ${item.url}`,
        )
        .join("\n");
      return `السلام عليكم ABK،\nأود تأكيد طلب السلة الموحد للمنتجات التالية:\n\n${list}\n\nإجمالي العناصر: ${items.reduce((s, i) => s + i.quantity, 0)}${
        notes ? `\nملاحظات التوصيل/الاستلام: ${notes}` : ""
      }\nيرجى تأكيد التوفر في متجر مسيمير والتكلفة الإجمالية وطريقة الدفع عند الاستلام/التوصيل. شكراً لك!`;
    }

    const list = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} × ${item.quantity}${item.price ? ` (${item.price})` : ""}\n   Link: ${item.url}`,
      )
      .join("\n");
    return `Hi ABK,\nI'd like to place an order for the following items:\n\n${list}\n\nTotal Items: ${items.reduce((s, i) => s + i.quantity, 0)}${
      notes ? `\nPickup/Delivery notes: ${notes}` : ""
    }\nPlease confirm availability at your Mesaimeer store, order total, and delivery schedule. Thank you!`;
  }

  // B2B Wholesale Tray
  if (locale === "ar") {
    const list = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} — الكمية: ${item.quantity} (رول/كرتون)\n   الرابط: ${item.url}`,
      )
      .join("\n");
    return `السلام عليكم ABK للتجارة والخدمات،\nنود طلب عرض أسعار جملة تجاري للمنتجات التالية لمركزنا:\n\n${list}\n\nاسم الشركة / الورشة: ${
      companyName || "____"
    }\nالكمية الكلية: ${items.reduce((s, i) => s + i.quantity, 0)} وحدة${
      notes ? `\nملاحظات إضافية: ${notes}` : ""
    }\nيرجى إرسال عرض الأسعار المعتمد وشروط التوريد وسرعة التجهيز من مستودع الدوحة. شكراً.`;
  }

  const list = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} — Qty: ${item.quantity} (Rolls/Cartons)\n   Link: ${item.url}`,
    )
    .join("\n");
  return `Hi ABK Trading & Service,\nWe would like to request a wholesale trade quote for our business:\n\n${list}\n\nCompany / Workshop Name: ${
    companyName || "____"
  }\nTotal Units Requested: ${items.reduce((s, i) => s + i.quantity, 0)}${
    notes ? `\nAdditional requirements: ${notes}` : ""
  }\nPlease provide tiered wholesale trade pricing and dispatch timeframe from your Doha warehouse. Thank you!`;
}

export function buildTrayWhatsAppUrl(ctx: TrayContext): string {
  const text = buildTrayWhatsAppMessage(ctx);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encode(text)}`;
}

export function buildDealerApplicationWhatsAppMessage(
  data: DealerApplicationContext,
): string {
  const brandsList = data.priorityBrands.length > 0 ? data.priorityBrands.join(", ") : "All Brands";

  if (data.locale === "ar") {
    return `السلام عليكم ABK للتجارة والخدمات،\nأود التقدم بطلب اعتماد موزع / حساب تجاري بالجملة لمركزنا في قطر والخليج:\n\n• اسم الشركة / المركز: ${data.companyName}\n• الشخص المسؤول: ${data.contactName}\n• رقم التواصل: ${data.phone}\n• نوع النشاط: ${data.businessType}\n• المدينة / الدولة: ${data.location}\n• الحجم الشهري المتوقع: ${data.estimatedVolume}\n• العلامات التجارية المطلوبة: ${brandsList}${
      data.notes ? `\n• تفاصيل إضافية: ${data.notes}` : ""
    }\n\nنرجو التواصل معنا لتزويدنا بأسعار الموزعين المعتمدة وتفعيل الحساب التجاري. شكراً لكم.`;
  }

  return `Hi ABK Trading & Service,\nI would like to apply for an Authorized Dealer / Wholesale Commercial Account:\n\n• Company / Center Name: ${data.companyName}\n• Contact Person: ${data.contactName}\n• Phone Number: ${data.phone}\n• Business Type: ${data.businessType}\n• Location / City: ${data.location}\n• Estimated Monthly Volume: ${data.estimatedVolume}\n• Brands of Interest: ${brandsList}${
    data.notes ? `\n• Additional Notes: ${data.notes}` : ""
  }\n\nPlease get in touch to discuss wholesale tier pricing, dealer terms, and account onboarding. Thank you!`;
}

export function buildDealerApplicationWhatsAppUrl(
  data: DealerApplicationContext,
): string {
  const text = buildDealerApplicationWhatsAppMessage(data);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encode(text)}`;
}

export function buildMailto(subject: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
