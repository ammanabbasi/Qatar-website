/**
 * Order emails, sent through the shop's own Hostinger mailbox over SMTP.
 *
 *   SMTP_PASS       Password of the sending mailbox (required; nothing is sent without it).
 *   SMTP_USER       Sending mailbox (default sales@abktradingservice.com).
 *   SMTP_HOST/PORT  Default smtp.hostinger.com:465 (SSL).
 *   ORDER_EMAIL_TO  Where staff alerts go (default sales@abktradingservice.com).
 *
 * Staff get every paid order, every PPF booking and every payment that needs
 * a check; the customer gets a receipt, in the language they shopped in, for
 * PAID orders only — so no request to this site can make the shop's mailbox
 * write to an arbitrary address without a real SADAD payment behind it. A
 * failed or unconfigured send never loses the order: it is in the Blob
 * store, logs carry only its id (no personal data), and the next SADAD event
 * for a paid order retries (see applyPaymentResult).
 */

import nodemailer from "nodemailer";
import { SITE } from "@/lib/constants";
import { formatPercent, formatQar } from "@/lib/pricing";
import { orderPagePath } from "./config";
import { recordEmails, type Order } from "./orders";
import { sadadTxnDate } from "./sadad";

export type OrderEmailEvent = "paid" | "booked" | "review";

export type Mail = { subject: string; text: string; html: string };

function mailer() {
  const pass = process.env.SMTP_PASS?.trim();
  if (!pass) return null;
  const user = process.env.SMTP_USER?.trim() || SITE.email;
  const port = Number(process.env.SMTP_PORT?.trim() || 465);
  return {
    from: `"ABK Trading & Service" <${user}>`,
    to: process.env.ORDER_EMAIL_TO?.trim() || SITE.email,
    transport: nodemailer.createTransport({
      host: process.env.SMTP_HOST?.trim() || "smtp.hostinger.com",
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    }),
  };
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** The emails an event produces: always the staff alert; the customer receipt only once paid. */
export function renderOrderEmails(order: Order, event: OrderEmailEvent): { shop: Mail; customer: Mail | null } {
  return {
    shop: shopEmail(order, event),
    customer: event === "paid" && order.customer.email ? customerEmail(order) : null,
  };
}

/** One log line that identifies an order without personal data (the Blob record has the rest). */
function logRef(order: Order): string {
  return `${order.id} (${order.kind}, ${order.status}, QAR ${order.totalQar.toFixed(2)})`;
}

/** Sends the staff alert and, for a paid order, the customer receipt. Never throws. */
export async function sendOrderEmails(order: Order, event: OrderEmailEvent): Promise<void> {
  const m = mailer();
  if (!m) {
    console.error(`[orders] EMAIL NOT SENT (SMTP_PASS is not set): ${event} ${logRef(order)}`);
    await recordEmails(order.id, { error: "smtp_not_configured" }).catch(() => {});
    return;
  }
  const sent: Order["emails"] = {};
  const errors: string[] = [];
  const mails = renderOrderEmails(order, event);

  try {
    const mail = mails.shop;
    await m.transport.sendMail({
      from: m.from,
      to: m.to,
      replyTo: order.customer.email || undefined,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    sent.shop = new Date().toISOString();
  } catch (err) {
    errors.push(`shop: ${errorText(err)}`);
    console.error(`[orders] EMAIL FAILED (staff) ${logRef(order)}: ${errorText(err)}`);
  }

  if (mails.customer) {
    try {
      const mail = mails.customer;
      await m.transport.sendMail({
        from: m.from,
        to: order.customer.email,
        replyTo: SITE.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
      sent.customer = new Date().toISOString();
    } catch (err) {
      errors.push(`customer: ${errorText(err)}`);
      console.error(`[orders] EMAIL FAILED (customer) ${logRef(order)}: ${errorText(err)}`);
    }
  }

  // A clean run clears an error left by an earlier attempt.
  sent.error = errors.length > 0 ? errors.join("; ").slice(0, 300) : undefined;
  await recordEmails(order.id, sent).catch((err) =>
    console.error(`[orders] could not record emails for ${order.id}: ${errorText(err)}`),
  );
}

/**
 * SADAD confirmed a payment this site could not record (order not found,
 * order store unavailable). The customer has paid, so staff must act: the
 * SADAD panel has the transaction; this email says which one.
 */
export async function sendUnmatchedPaymentAlert(
  result: { orderId: string; transactionNumber: string; amountQar: number | null; sandbox: boolean; message: string },
  source: "callback" | "webhook",
  reason: string,
): Promise<void> {
  const m = mailer();
  if (!m) {
    console.error(`[orders] EMAIL NOT SENT (SMTP_PASS is not set): unrecorded payment ${result.orderId}`);
    return;
  }
  const rows: Row[] = [
    ["Order ID (SADAD)", result.orderId || "missing"],
    ["SADAD transaction", result.transactionNumber || "missing"],
    ["Amount", result.amountQar === null ? "missing" : qar2(result.amountQar)],
    ["Mode", result.sandbox ? "TEST (sandbox, no money moved)" : "Live"],
    ["Reported by", source],
    ["Problem", reason],
  ];
  const subject = `${result.sandbox ? "[TEST] " : ""}ACTION NEEDED: paid ${result.orderId || "order"} could not be recorded`;
  const headline =
    "SADAD confirmed this payment, but the website could not record it. Find the transaction in the SADAD panel, then contact the customer (their mobile and email are on the transaction) to arrange the order.";
  try {
    await m.transport.sendMail({
      from: m.from,
      to: m.to,
      subject,
      text: `${headline}\n\n${textBlock(rows)}`,
      html: htmlShell(subject, `<p style="margin:0 0 16px">${esc(headline)}</p>${htmlTable(rows)}`),
    });
  } catch (err) {
    console.error(`[orders] EMAIL FAILED (unrecorded payment ${result.orderId}): ${errorText(err)}`);
  }
}

// ── shared bits ──────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const qar2 = (n: number) => `QAR ${n.toFixed(2)}`;

/** "2026-11-19 17:01 (Doha)" — staff read times in Qatar time, not UTC. */
function dohaTime(iso: string): string {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? `${sadadTxnDate(new Date(ms)).slice(0, 16)} (Doha)` : iso;
}

function lineName(l: NonNullable<Order["shop"]>["lines"][number], locale: "en" | "ar"): string {
  return l.size ? `${l.name[locale]} (${l.size[locale]})` : l.name[locale];
}

type Row = [label: string, value: string];

function htmlTable(rows: Row[], dir: "ltr" | "rtl" = "ltr"): string {
  const align = dir === "rtl" ? "right" : "left";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6e6e73;vertical-align:top;white-space:nowrap;text-align:${align}">${esc(k)}</td><td style="padding:6px 0;color:#1d1d1f;text-align:${align}">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
}

function htmlShell(title: string, body: string, dir: "ltr" | "rtl" = "ltr"): string {
  const font =
    dir === "rtl"
      ? "'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif"
      : "Inter,-apple-system,'Segoe UI',Arial,sans-serif";
  return `<!doctype html><html dir="${dir}"><body style="margin:0;background:#f5f5f7;font-family:${font};font-size:15px;line-height:1.5;color:#1d1d1f"><div style="max-width:600px;margin:0 auto;padding:24px 16px"><div style="background:#ffffff;border-radius:18px;padding:24px" dir="${dir}"><p style="margin:0 0 4px;color:#b7791f;font-weight:600;font-size:13px">ABK Trading &amp; Service</p><h1 style="margin:0 0 16px;font-size:20px;line-height:1.3">${esc(title)}</h1>${body}</div><p style="margin:16px 0 0;color:#86868b;font-size:12px;text-align:center">${esc(SITE.address.full)} · ${esc(SITE.phone)} · ${esc(SITE.email)}</p></div></body></html>`;
}

function textBlock(rows: Row[]): string {
  return rows.map(([k, v]) => `${k}: ${v}`).join("\n");
}

function sectionTitle(text: string): string {
  return `<h2 style="margin:20px 0 8px;font-size:15px">${esc(text)}</h2>`;
}

// ── staff email (English) ────────────────────────────────────────────────

function shopEmail(order: Order, event: OrderEmailEvent): Mail {
  const test = order.payment?.sandbox ? "[TEST] " : "";
  const shop = order.shop;
  const ppf = order.ppf;

  let subject: string;
  let headline: string;
  if (event === "review") {
    subject = `CHECK PAYMENT ${order.ref}: SADAD amount differs from the order total`;
    headline = "SADAD reported a successful payment whose amount does not match this order. Check the transaction in the SADAD panel before fulfilling.";
  } else if (event === "booked" && order.pay === "online") {
    subject = `PPF booking ${order.ref}: paying online (not paid yet), ${qar2(order.totalQar)}`;
    headline =
      "New installation booking. The customer chose to pay online now and was sent to SADAD. A second email follows when SADAD confirms the payment; if none arrives, follow up on WhatsApp.";
  } else if (event === "booked") {
    subject = `PPF booking ${order.ref}: pay at handover${ppf?.priceQar ? `, ${qar2(ppf.priceQar)}` : ""}`;
    headline = "New installation booking. The customer chose to pay at handover. Confirm the slot on WhatsApp.";
  } else if (order.kind === "ppf") {
    subject = `${test}Paid PPF booking ${order.ref}: ${qar2(order.totalQar)}`;
    headline = "Paid online via SADAD. Confirm the installation slot on WhatsApp.";
  } else {
    const where = shop?.fulfilment === "pickup" ? "pickup" : `delivery to ${shop?.area.en ?? ""}`;
    subject = `${test}Paid order ${order.ref}: ${qar2(order.totalQar)}, ${where}`;
    headline = "Paid online via SADAD. Prepare the order and confirm the delivery or pickup time on WhatsApp.";
  }

  const waLink = `https://wa.me/${order.customer.mobile.replace(/^\+/, "")}`;
  const customer: Row[] = [
    ["Name", order.customer.name],
    ["Mobile", `${order.customer.mobile} (WhatsApp: ${waLink})`],
    ["Email", order.customer.email || "not given"],
  ];

  const details: Row[] = [];
  if (shop) {
    details.push(
      shop.fulfilment === "pickup"
        ? ["Fulfilment", "Pickup at the Mesaimeer showroom"]
        : ["Delivery to", `${shop.area.en}${shop.address ? `\n${shop.address}` : ""}`],
    );
  }
  if (ppf) {
    details.push(
      ["Car", ppf.car || "not given"],
      ["Size", ppf.bodyLabel.en],
      ["Coverage", ppf.coverageLabel.en],
      ...(ppf.parts.length > 0 ? ([["Panels", ppf.parts.map((p) => p.en).join(", ")]] as Row[]) : []),
      ["Film", ppf.filmLabel.en],
      ["Existing film", ppf.existingFilm || "not given"],
      ["Preferred date", ppf.preferredDate || "not given"],
      ["Price", ppf.priceQar === null ? "to quote" : `${qar2(ppf.priceQar)}${ppf.isEstimate ? " (estimate)" : ""}`],
    );
  }
  if (order.notes) details.push(["Notes", order.notes]);

  const money: Row[] = [];
  if (shop) {
    for (const l of shop.lines) money.push([`${l.qty} × ${lineName(l, "en")}`, qar2(l.lineQar)]);
    money.push(["Subtotal", qar2(shop.subtotalQar)]);
    if (shop.discount) money.push([`Discount ${shop.discount.percent}%`, `−${qar2(shop.discount.amountQar)}`]);
    money.push(["Delivery", shop.deliveryFeeQar > 0 ? qar2(shop.deliveryFeeQar) : "free"]);
  }
  const totalLabel =
    order.pay === "handover" ? "Total due at handover" : order.status === "paid" ? "Total charged" : "Order total";
  money.push([totalLabel, ppf && ppf.priceQar === null ? "to quote" : qar2(order.totalQar)]);

  const payment: Row[] = [];
  if (order.payment) {
    payment.push(
      ["SADAD transaction", order.payment.transactionNumber || "not given"],
      ["Mode", order.payment.sandbox ? "TEST (sandbox, no money moved)" : "Live"],
      ["Paid at", dohaTime(order.payment.paidAt)],
    );
  }
  if (event === "review") {
    const last = order.events[order.events.length - 1];
    payment.push(["SADAD amount", last?.amountQar === null || !last ? "missing" : qar2(last.amountQar)]);
    payment.push(["SADAD transaction", last?.transactionNumber || "not given"]);
  }
  payment.push(["Order ID (SADAD)", order.id], ["Created", dohaTime(order.createdAt)], ["Language", order.locale.toUpperCase()]);
  const source = Object.entries(order.attribution)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  if (source) payment.push(["Source", source]);

  const text = [
    headline,
    "",
    textBlock(customer),
    "",
    textBlock(details),
    "",
    textBlock(money),
    "",
    textBlock(payment),
    "",
    `Record: Vercel → Storage → abk-orders → orders/${order.id}.json`,
  ].join("\n");

  const html = htmlShell(
    subject,
    `<p style="margin:0 0 16px">${esc(headline)}</p>` +
      sectionTitle("Customer") +
      htmlTable(customer) +
      (details.length ? sectionTitle(shop ? "Delivery" : "Job") + htmlTable(details) : "") +
      sectionTitle(shop ? "Items" : "Amount") +
      htmlTable(money) +
      sectionTitle("Payment") +
      htmlTable(payment) +
      `<p style="margin:16px 0 0;color:#86868b;font-size:12px">Record: Vercel → Storage → abk-orders → orders/${esc(order.id)}.json</p>`,
  );
  return { subject, text, html };
}

// ── customer email (their language) ──────────────────────────────────────

/** The receipt for a paid order, in the language the customer shopped in. */
function customerEmail(order: Order): Mail {
  const l = order.locale;
  const ar = l === "ar";
  const qar = (n: number) => formatQar(n, l);
  const shop = order.shop;
  const ppf = order.ppf;
  const first = order.customer.name.split(/\s+/)[0] || order.customer.name;
  const test = order.payment?.sandbox ? (ar ? "[تجربة] " : "[TEST] ") : "";

  const subject =
    test +
    (order.kind === "ppf"
      ? ar
        ? `تم دفع حجز التركيب ${order.ref}`
        : `Your PPF booking ${order.ref} is paid`
      : ar
        ? `تم تأكيد طلبك ${order.ref}`
        : `Your ABK order ${order.ref} is confirmed`);

  const greeting = ar ? `مرحباً ${first}،` : `Hi ${first},`;
  const intro =
    order.kind === "ppf"
      ? ar
        ? "استلمنا دفعتك بنجاح. سنؤكد موعد التركيب معك عبر واتساب خلال ساعات العمل."
        : "We've received your payment. We'll confirm your installation slot on WhatsApp during opening hours."
      : shop?.fulfilment === "pickup"
        ? ar
          ? "استلمنا دفعتك بنجاح. سنراسلك عبر واتساب عندما يصبح طلبك جاهزاً للاستلام من معرضنا في مسيمير."
          : "We've received your payment. We'll message you on WhatsApp when your order is ready to collect from our Mesaimeer showroom."
        : ar
          ? "استلمنا دفعتك بنجاح. سنراسلك عبر واتساب لتأكيد موعد التوصيل."
          : "We've received your payment. We'll message you on WhatsApp to confirm the delivery time.";

  const rows: Row[] = [[ar ? "رقم الطلب" : "Order reference", order.ref]];
  if (shop) {
    for (const line of shop.lines) rows.push([`${line.qty} × ${lineName(line, l)}`, qar(line.lineQar)]);
    if (shop.discount) {
      const pct = formatPercent(shop.discount.percent, l);
      rows.push([ar ? `خصم ${pct}` : `Discount ${pct}`, `−${qar(shop.discount.amountQar)}`]);
    }
    rows.push([
      shop.fulfilment === "pickup" ? (ar ? "الاستلام" : "Pickup") : ar ? "التوصيل" : "Delivery",
      shop.fulfilment === "pickup"
        ? ar
          ? "معرض مسيمير — مجاناً"
          : "Mesaimeer showroom — free"
        : `${shop.area[l]}${shop.address ? ` — ${shop.address}` : ""} · ${shop.deliveryFeeQar > 0 ? qar(shop.deliveryFeeQar) : ar ? "مجاناً" : "free"}`,
    ]);
  }
  if (ppf) {
    rows.push(
      [ar ? "السيارة" : "Car", ppf.car || ppf.bodyLabel[l]],
      [ar ? "التغطية" : "Coverage", ppf.coverageLabel[l]],
      [ar ? "الفيلم" : "Film", ppf.filmLabel[l]],
    );
    if (ppf.preferredDate) rows.push([ar ? "التاريخ المفضل" : "Preferred date", ppf.preferredDate]);
  }
  rows.push([ar ? "المبلغ المدفوع" : "Paid", qar(order.totalQar)]);
  if (order.payment?.transactionNumber) {
    rows.push([ar ? "مرجع SADAD" : "SADAD reference", order.payment.transactionNumber]);
  }

  const policy = shop
    ? ar
      ? "يمكن إرجاع المنتجات غير المفتوحة وغير المستخدمة خلال ٧ أيام من التوصيل أو الاستلام، ويُرد المبلغ إلى البطاقة التي دفعت بها. المنتجات المعيبة أو الخاطئة نستبدلها أو نرد قيمتها دائماً."
      : "Unopened, unused items can be returned within 7 days of delivery or pickup, refunded to the card you paid with. Faulty or wrong items are always replaced or refunded."
    : ar
      ? "إلغاء مجاني حتى ٤٨ ساعة قبل الموعد المؤكد، ويُرد المبلغ المدفوع إلى بطاقتك."
      : "Free cancellation up to 48 hours before your confirmed slot; anything you paid is refunded to your card.";

  const contact = ar
    ? `أسئلة؟ راسلنا على واتساب ${SITE.phone} أو ردّ على هذا البريد.`
    : `Questions? WhatsApp us on ${SITE.phone} or reply to this email.`;
  const link = `${SITE.url}${orderPagePath(l, order.id)}`;
  const linkLabel = ar ? "عرض طلبك" : "View your order";

  const text = [greeting, "", intro, "", textBlock(rows), "", policy, "", `${linkLabel}: ${link}`, "", contact].join("\n");
  const dir = ar ? "rtl" : "ltr";
  const html = htmlShell(
    subject,
    `<p style="margin:0 0 8px">${esc(greeting)}</p><p style="margin:0 0 16px">${esc(intro)}</p>` +
      htmlTable(rows, dir) +
      `<p style="margin:0 0 16px"><a href="${esc(link)}" style="display:inline-block;background:#0071e3;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:980px;font-weight:600">${esc(linkLabel)}</a></p>` +
      `<p style="margin:0 0 8px;color:#6e6e73;font-size:13px">${esc(policy)}</p>` +
      `<p style="margin:0;color:#6e6e73;font-size:13px">${esc(contact)}</p>`,
    dir,
  );
  return { subject, text, html };
}
