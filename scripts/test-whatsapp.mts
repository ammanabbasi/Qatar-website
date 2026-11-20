/**
 * Unit tests for the WhatsApp fallbacks: whatever fails online (payment,
 * our server, the network, a crashed page), the message the customer sends
 * carries the whole order, so staff can still take it on WhatsApp.
 *
 *   npm run test:payments
 */

import assert from "node:assert/strict";
import { test } from "node:test";

const { buildCartWhatsAppMessage, buildOrderWhatsAppMessage, buildPaidOrderWhatsAppMessage } = await import(
  "../src/lib/whatsapp.ts"
);
const { rescueWhatsAppMessage } = await import("../src/lib/whatsapp-rescue.ts");

const cart = {
  locale: "en" as const,
  orderRef: "ABK-7K3M",
  lines: [{ name: "Getsun Tire Shine", qty: 2, unitPriceQar: 15 }],
  fulfilment: "delivery" as const,
  areaLabel: "Al Wakrah",
  notes: "Call on arrival",
};
const contact = { name: "Fatima Al-Kuwari", mobile: "3333 4444", address: "Building 12, Zone 90" };

test("cart order on WhatsApp: the normal message is unchanged", () => {
  const m = buildCartWhatsAppMessage(cart);
  assert.ok(m.startsWith("Hi ABK, I'd like to place an order.\nOrder ref: ABK-7K3M"));
  assert.ok(m.includes("1. Getsun Tire Shine × 2 — QAR 30"));
  assert.ok(!m.includes("Name:"), "no contact block unless the shopper typed one");
});

test("cart: paying online failed → the order and the typed details go on WhatsApp", () => {
  const m = buildCartWhatsAppMessage({ ...cart, purpose: "payFailed", contact });
  assert.ok(m.startsWith("Hi ABK, I tried to pay online but it didn't go through, so I'm sending my order here.\nOrder ref: ABK-7K3M"), m);
  for (const s of ["Getsun Tire Shine × 2", "Delivery to: Al Wakrah", "Notes: Call on arrival", "Name: Fatima Al-Kuwari", "Mobile: 3333 4444", "Address: Building 12, Zone 90"]) {
    assert.ok(m.includes(s), `has "${s}"`);
  }
  const pickup = buildCartWhatsAppMessage({ ...cart, fulfilment: "pickup", purpose: "payFailed", contact });
  assert.ok(!pickup.includes("Address:"), "no delivery address on a pickup order");
  const ar = buildCartWhatsAppMessage({ ...cart, locale: "ar", purpose: "payFailed", contact });
  assert.ok(ar.includes("حاولت الدفع عبر الإنترنت لكنه لم يتم") && ar.includes("الاسم: Fatima Al-Kuwari"), ar);
});

test("cart: a payment whose result is unknown → staff are asked to check before it is paid again", () => {
  const m = buildCartWhatsAppMessage({ ...cart, purpose: "payCheck", contact });
  assert.ok(m.includes("I'm not sure the payment went through"));
  assert.ok(m.endsWith("Please check whether my payment came through before I pay again. Thank you!"), m);
  assert.ok(m.includes("Getsun Tire Shine × 2"));
});

const shopOrder = {
  locale: "en" as const,
  kind: "shop" as const,
  ref: "ABK-7K3M",
  totalQar: 55,
  transactionNumber: "SD123",
  name: "Fatima Al-Kuwari",
  lines: [{ name: "Getsun Tire Shine", qty: 2 }],
  fulfilment: "delivery" as const,
  areaLabel: "Al Wakrah",
  address: "Building 12",
};

test("order page: a failed payment's WhatsApp message IS the order", () => {
  const m = buildOrderWhatsAppMessage({ ...shopOrder, status: "failed", mobile: "+97433334444" });
  assert.ok(m.startsWith("Hi ABK, my online payment for order ABK-7K3M didn't go through. I'd still like the order:"), m);
  for (const s of ["• Getsun Tire Shine × 2", "Delivery to: Al Wakrah — Building 12", "Total: QAR 55", "Name: Fatima Al-Kuwari", "Mobile: +97433334444"]) {
    assert.ok(m.includes(s), `has "${s}"`);
  }
  assert.ok(m.endsWith("Please confirm the order and how I can pay. Thank you!"));
  const ppf = buildOrderWhatsAppMessage({
    locale: "en",
    kind: "ppf",
    ref: "PPF-AB2CD",
    totalQar: 899,
    name: "Fatima",
    ppfSummary: "2024 Toyota Camry · Front-end Essential · Weather Armor PRO",
    status: "failed",
  });
  assert.ok(ppf.includes("my online payment for PPF booking PPF-AB2CD didn't go through") && ppf.includes("Job: 2024 Toyota Camry"));
  assert.ok(ppf.includes("Total: QAR 899") && ppf.endsWith("Please confirm my slot; I'll pay at handover. Thank you!"));
  const ar = buildOrderWhatsAppMessage({ ...shopOrder, locale: "ar", status: "failed" });
  assert.ok(ar.includes("لم يتم الدفع الإلكتروني لطلبي ABK-7K3M"), ar);
});

test("order page: pending and review messages name the order, amount and SADAD reference", () => {
  const pending = buildOrderWhatsAppMessage({ ...shopOrder, status: "pending" });
  assert.ok(pending.startsWith("Hi ABK, my online payment for order ABK-7K3M (QAR 55, SADAD SD123) still shows as pending."), pending);
  assert.ok(pending.includes("• Getsun Tire Shine × 2") && pending.endsWith("Please let me know before I pay again. Thank you!"));
  const review = buildOrderWhatsAppMessage({ ...shopOrder, status: "review" });
  assert.ok(review.startsWith("Hi ABK, please check my online payment for order ABK-7K3M (QAR 55, SADAD SD123)."), review);
});

test("paid message unchanged: header, no mobile line", () => {
  const m = buildPaidOrderWhatsAppMessage({ ...shopOrder });
  assert.ok(m.startsWith("Hi ABK, I've just paid online for order ABK-7K3M (QAR 55, SADAD SD123)."), m);
  assert.ok(!m.includes("Mobile:") && !m.includes("Total:"));
  assert.ok(m.endsWith("Please confirm the delivery time. Thank you!"));
});

test("crashed page: the WhatsApp message carries the page and the stored cart", () => {
  const raw = JSON.stringify({ lines: [{ slug: "getsun-tire-shine", qty: 2 }, { slug: "bad", qty: 0 }, { qty: 1 }], ref: "ABK-7K3M", sentAt: null });
  const m = rescueWhatsAppMessage("en", "/en/b2c/cart", raw);
  assert.equal(
    m,
    [
      "Hi ABK, the website showed an error while I was ordering.",
      "Page: /en/b2c/cart",
      "Order ref: ABK-7K3M",
      "My cart:",
      "• getsun-tire-shine × 2",
      "Please help me complete my order. Thank you!",
    ].join("\n"),
  );
  const broken = rescueWhatsAppMessage("en", "/en/b2c/cart", "{not json");
  assert.ok(broken.startsWith("Hi ABK, the website showed an error") && broken.endsWith("Thank you!"), "unreadable cart: still a message");
  assert.ok(!rescueWhatsAppMessage("en", "/en", null).includes("My cart:"), "no cart: no cart block");
  assert.ok(rescueWhatsAppMessage("ar", "/ar/b2c/cart", raw).includes("سلتي:"));
});
