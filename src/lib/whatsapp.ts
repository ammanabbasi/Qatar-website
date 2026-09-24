/**
 * Builds WhatsApp deep-link URLs with audience + locale-specific pre-filled messages.
 * Phone number is the user-supplied ABK WhatsApp line: +974 30838355
 */

import {
  DELIVERY,
  formatNumber,
  formatQar,
  quoteDelivery,
  type Fulfilment,
} from "./pricing";

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

/** One line of the wholesale quote tray. */
export type QuoteTrayItem = {
  name: string;
  quantity: number;
  url: string;
};

export type QuoteTrayContext = {
  items: QuoteTrayItem[];
  locale: WALocale;
  companyName?: string;
  notes?: string;
};

/** One line of the retail cart order. `unitPriceQar` is absent for price-on-request products. */
export type CartMessageLine = {
  name: string;
  qty: number;
  unitPriceQar?: number;
  /** Multi-size product priced "From QAR …" — staff confirm the size. */
  priceIsFrom?: boolean;
};

export type CartMessageContext = {
  locale: WALocale;
  orderRef: string;
  lines: CartMessageLine[];
  fulfilment: Fulfilment;
  /** Localized area name (or the shopper's own text for "Other"). Delivery only. */
  areaLabel?: string;
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

/**
 * Retail cart order. Deliberately link-free: product URLs made up most of the
 * old tray message (a 12-item Arabic cart was a 5,791-char wa.me link, since
 * each Arabic letter percent-encodes to 6 characters) and staff know the
 * products by name. Totals count priced lines only and say so.
 */
export function buildCartWhatsAppMessage({
  locale,
  orderRef,
  lines,
  fulfilment,
  areaLabel,
  notes,
}: CartMessageContext): string {
  const ar = locale === "ar";
  let pricedSubtotal = 0;
  let pricedLines = 0;
  let fromPricedLines = 0;
  let unpricedLines = 0;
  for (const l of lines) {
    if (l.unitPriceQar !== undefined) {
      pricedSubtotal += l.unitPriceQar * l.qty;
      pricedLines += 1;
      if (l.priceIsFrom) fromPricedLines += 1;
    } else {
      unpricedLines += 1;
    }
  }
  const quote = quoteDelivery(
    { pricedSubtotal, pricedLines, fromPricedLines, unpricedLines, units: 0 },
    fulfilment,
  );
  const qar = (n: number) => formatQar(n, locale);
  const num = (n: number) => formatNumber(n, locale);
  const threshold = qar(DELIVERY.freeThresholdQar);

  // Arabic lines that open with a digit or a Latin brand name would otherwise
  // be laid out left-to-right by WhatsApp; a leading RLM keeps them RTL.
  const rlm = ar ? "‏" : "";
  const items = lines.map((l, i) => {
    const price =
      l.unitPriceQar !== undefined
        ? `${l.priceIsFrom ? (ar ? "من " : "from ") : ""}${qar(l.unitPriceQar * l.qty)}`
        : ar
          ? "السعر عند الطلب"
          : "price on request";
    return `${rlm}${num(i + 1)}. ${l.name} × ${num(l.qty)} — ${price}`;
  });

  const summary: string[] = [];
  if (pricedLines > 0) {
    summary.push(
      ar
        ? `المجموع الفرعي للمنتجات المسعّرة (${num(pricedLines)}): ${qar(pricedSubtotal)}`
        : `Subtotal (${pricedLines} priced item${pricedLines === 1 ? "" : "s"}): ${qar(pricedSubtotal)}`,
    );
  }
  if (unpricedLines > 0) {
    summary.push(
      ar
        ? `منتجات بانتظار التسعير من فريقكم: ${num(unpricedLines)}`
        : `${unpricedLines} item${unpricedLines === 1 ? "" : "s"} to be priced by your team`,
    );
  }

  const area = areaLabel?.trim() || "—";
  switch (quote.kind) {
    case "pickup":
      summary.push(ar ? "الاستلام: من معرض مسيمير" : "Pickup: Mesaimeer showroom");
      break;
    case "free":
      summary.push(
        ar
          ? `التوصيل إلى: ${area} — مجاني (طلب بقيمة ${threshold} فأكثر)`
          : `Delivery to: ${area} — free (order of ${threshold} or more)`,
      );
      break;
    case "fee":
      summary.push(
        ar
          ? `التوصيل إلى: ${area} — ${qar(quote.feeQar)} (مجاني للطلبات بقيمة ${threshold} فأكثر)`
          : `Delivery to: ${area} — ${qar(quote.feeQar)} (free on orders of ${threshold} or more)`,
      );
      break;
    case "provisional":
      summary.push(
        ar
          ? `التوصيل إلى: ${area} — ${qar(quote.feeQar)}، أو مجاني إذا بلغ الطلب ${threshold} بعد التسعير`
          : `Delivery to: ${area} — ${qar(quote.feeQar)}, or free if the order reaches ${threshold} once priced`,
      );
      break;
  }

  // A firm total only exists when nothing is waiting to be priced or sized.
  if (unpricedLines === 0 && fromPricedLines === 0 && pricedLines > 0) {
    const fee = quote.kind === "fee" ? quote.feeQar : 0;
    summary.push(
      ar
        ? `الإجمالي: ${qar(pricedSubtotal + fee)}${fee > 0 ? " شامل التوصيل" : ""}`
        : `Total: ${qar(pricedSubtotal + fee)}${fee > 0 ? " incl. delivery" : ""}`,
    );
  }

  const trimmedNotes = notes?.trim();
  if (trimmedNotes) summary.push(ar ? `ملاحظات: ${trimmedNotes}` : `Notes: ${trimmedNotes}`);

  const closing =
    fulfilment === "pickup"
      ? ar
        ? "يرجى تأكيد التوفر والمجموع وموعد الاستلام. شكراً لكم!"
        : "Please confirm availability, the total and when I can collect. Thank you!"
      : ar
        ? "يرجى تأكيد التوفر والمجموع وموعد التوصيل. شكراً لكم!"
        : "Please confirm availability, the total and the delivery time. Thank you!";

  const header = ar
    ? `السلام عليكم ABK، أود تقديم طلب.\nرقم الطلب: ${orderRef}`
    : `Hi ABK, I'd like to place an order.\nOrder ref: ${orderRef}`;

  return [header, items.join("\n"), summary.join("\n"), closing].join("\n\n");
}

export function buildCartWhatsAppUrl(ctx: CartMessageContext): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encode(buildCartWhatsAppMessage(ctx))}`;
}

/** Wholesale quote tray — message text unchanged from the original tray. */
export function buildQuoteTrayWhatsAppMessage({
  items,
  locale,
  companyName,
  notes,
}: QuoteTrayContext): string {
  if (items.length === 0) {
    return buildWhatsAppMessage({ audience: "b2b", locale });
  }

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

export function buildQuoteTrayWhatsAppUrl(ctx: QuoteTrayContext): string {
  const text = buildQuoteTrayWhatsAppMessage(ctx);
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
