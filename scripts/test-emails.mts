/**
 * Order email content: who gets what, and that customer-typed text can't
 * inject HTML. Set EMAIL_PREVIEW_DIR to also write the rendered HTML there.
 *
 *   npm run test:payments
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.VERCEL;
process.env.ORDER_LINK_SECRET = "test-link-secret";

const { renderOrderEmails } = await import("../src/lib/payments/email.ts");
type Order = Parameters<typeof renderOrderEmails>[0];

const shopOrder = (over: Partial<Order> = {}): Order =>
  ({
    v: 1,
    id: "ABK-7K3M-Q2ZD",
    ref: "ABK-7K3M",
    kind: "shop",
    createdAt: "2026-11-19T14:00:00.000Z",
    locale: "en",
    pay: "online",
    status: "paid",
    totalQar: 345,
    customer: { name: "Fatima Al-Kuwari", mobile: "+97433334444", email: "fatima@example.com" },
    notes: "Gate 3, call on arrival",
    shop: {
      fulfilment: "delivery",
      areaKey: "al-wakrah",
      area: { en: "Al Wakrah", ar: "الوكرة" },
      address: "Building 12, Street 340, Zone 90",
      lines: [
        { slug: "briller-wash-and-wax", name: { en: "Briller Wash & Wax", ar: "بريلر غسيل وشمع" }, qty: 1, unitQar: 350, lineQar: 350 },
      ],
      subtotalQar: 350,
      discount: null,
      deliveryFeeQar: 0,
    },
    attribution: { gclid: "abc", utmSource: "google" },
    payment: { transactionNumber: "SD2883696582255", sandbox: false, paidAt: "2026-11-19T14:01:00.000Z", source: "callback" },
    events: [],
    flags: [],
    emails: {},
    ...over,
  }) as Order;

const preview = process.env.EMAIL_PREVIEW_DIR;
function save(name: string, html: string) {
  if (!preview) return;
  mkdirSync(preview, { recursive: true });
  writeFileSync(path.join(preview, `${name}.html`), html);
}

test("paid shop order: staff alert with every fulfilment detail, plus the customer receipt", () => {
  const { shop, customer } = renderOrderEmails(shopOrder(), "paid");
  assert.equal(shop.subject, "Paid order ABK-7K3M: QAR 345.00, delivery to Al Wakrah");
  for (const needle of ["Fatima Al-Kuwari", "+97433334444", "wa.me/97433334444", "Building 12, Street 340, Zone 90", "Briller Wash &amp; Wax", "SD2883696582255", "Gate 3, call on arrival", "Live"]) {
    assert.ok(shop.html.includes(needle), `staff email should mention ${needle}`);
  }
  assert.ok(customer, "customer gets a receipt");
  assert.equal(customer.subject, "Your ABK order ABK-7K3M is confirmed");
  assert.ok(customer.html.includes("/api/orders/open?l=en&amp;id=ABK-7K3M-Q2ZD&amp;t=") || customer.html.includes("/api/orders/open?l=en&id=ABK-7K3M-Q2ZD&t="), "receipt links to the order page through the key handoff");
  assert.ok(customer.html.includes("within 7 days"), "receipt states the returns policy");
  assert.ok(!customer.html.includes("gclid"), "receipt carries no tracking data");
  save("shop-paid-staff", shop.html);
  save("shop-paid-customer", customer.html);
});

test("Arabic receipt is right-to-left and in Arabic", () => {
  const { customer } = renderOrderEmails(shopOrder({ locale: "ar" }), "paid");
  assert.ok(customer);
  assert.match(customer.subject, /تم تأكيد طلبك/);
  assert.ok(customer.html.includes('dir="rtl"'));
  assert.ok(customer.html.includes("الوكرة"));
  save("shop-paid-customer-ar", customer.html);
});

test("sandbox payments are labelled TEST in both emails", () => {
  const order = shopOrder({ payment: { transactionNumber: "SD1", sandbox: true, paidAt: "x", source: "webhook" } });
  const { shop, customer } = renderOrderEmails(order, "paid");
  assert.match(shop.subject, /^\[TEST\] /);
  assert.match(customer!.subject, /^\[TEST\] /);
});

test("customer-typed text cannot inject HTML", () => {
  const evil = '<img src=x onerror="alert(1)">';
  const order = shopOrder({
    customer: { name: evil, mobile: "+97433334444", email: "fatima@example.com" },
    notes: `</td><script>alert(2)</script>`,
  });
  const { shop, customer } = renderOrderEmails(order, "paid");
  for (const html of [shop.html, customer!.html]) {
    assert.ok(!html.includes("<img src=x"), "no raw <img>");
    assert.ok(!html.includes("<script>"), "no raw <script>");
  }
  assert.ok(shop.html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"));
});

test("bookings and reviews never email the customer (no mail to arbitrary addresses)", () => {
  const ppf = shopOrder({
    kind: "ppf",
    ref: "PPF-AB2CD",
    id: "PPF-AB2CD-3EFG",
    pay: "handover",
    status: "booked",
    totalQar: 899,
    shop: undefined,
    payment: undefined,
    ppf: {
      body: "sedan",
      bodyLabel: { en: "Sedan / Coupe", ar: "سيدان / كوبيه" },
      coverage: "front-end",
      coverageLabel: { en: "Front-end Essential", ar: "الواجهة الأساسية" },
      film: "pro",
      filmLabel: { en: "Weather Armor PRO", ar: "Weather Armor PRO" },
      parts: [],
      car: "2024 Toyota Camry",
      existingFilm: "Factory paint, no film",
      preferredDate: "2026-11-25",
      priceQar: 899,
      isEstimate: false,
    },
  });
  const booked = renderOrderEmails(ppf, "booked");
  assert.equal(booked.customer, null);
  assert.equal(booked.shop.subject, "PPF booking PPF-AB2CD: pay at handover, QAR 899.00");
  assert.ok(booked.shop.html.includes("2024 Toyota Camry"));
  save("ppf-booked-staff", booked.shop.html);

  const online = renderOrderEmails({ ...ppf, pay: "online", status: "awaiting_payment" }, "booked");
  assert.equal(online.customer, null);
  assert.match(online.shop.subject, /paying online \(not paid yet\)/);

  const paid = renderOrderEmails(
    { ...ppf, pay: "online", status: "paid", payment: { transactionNumber: "SD9", sandbox: false, paidAt: "x", source: "callback" } },
    "paid",
  );
  assert.equal(paid.customer?.subject, "Your PPF booking PPF-AB2CD is paid");
  assert.ok(paid.customer?.html.includes("48 hours"), "PPF receipt states the cancellation terms");
  save("ppf-paid-customer", paid.customer!.html);

  const review = renderOrderEmails(shopOrder({ status: "review", flags: ["amount_mismatch"] }), "review");
  assert.equal(review.customer, null);
  assert.match(review.shop.subject, /^CHECK PAYMENT ABK-7K3M/);
});

test("payment checks say what to check, and a filled anti-bot field marks the booking", () => {
  const twice = renderOrderEmails(
    shopOrder({
      flags: ["paid_twice"],
      payment: { transactionNumber: "SD1", sandbox: false, paidAt: "2026-11-19T10:00:00.000Z", source: "callback" },
    }),
    "review",
    "paid_twice",
  );
  assert.equal(twice.customer, null);
  assert.match(twice.shop.subject, /^CHECK PAYMENT ABK-7K3M: a second payment/);
  assert.ok(twice.shop.text.includes("refund the extra one"));
  assert.ok(twice.shop.text.includes("Second payment transaction"));

  const test = renderOrderEmails(shopOrder({ status: "review", flags: ["test_payment"] }), "review", "test_payment");
  assert.match(test.shop.subject, /TEST payment on the live site/);
  assert.ok(test.shop.text.includes("Do not fulfil it"));

  const flagged = renderOrderEmails(
    shopOrder({ kind: "ppf", ref: "PPF-AB2CD", pay: "handover", status: "booked", flags: ["honeypot"], shop: undefined }),
    "booked",
  );
  assert.match(flagged.shop.subject, /^\[Check: possible spam\] PPF booking PPF-AB2CD/);
});

test("a payment while another attempt of the order is paid asks staff to refund one", () => {
  const other = renderOrderEmails(
    shopOrder({
      payment: { transactionNumber: "SD2", sandbox: false, paidAt: "2026-11-19T10:00:00.000Z", source: "webhook" },
    }),
    "review",
    "paid_other_attempt",
  );
  assert.equal(other.customer, null);
  assert.match(other.shop.subject, /^CHECK PAYMENT ABK-7K3M: paid in two attempts \(possible double charge\)/);
  assert.ok(other.shop.text.includes("refund the extra one"));
});
