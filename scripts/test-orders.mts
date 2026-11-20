/**
 * Unit tests for the order state machine in src/lib/payments/orders.ts, run
 * against its in-memory store (no DATABASE_URL in the environment).
 *
 *   npm run test:payments
 */

import assert from "node:assert/strict";
import { test } from "node:test";

delete process.env.DATABASE_URL;
delete process.env.VERCEL;
delete process.env.RAILWAY_ENVIRONMENT_NAME;
delete process.env.RAILWAY_PROJECT_ID;

const { applyPaymentResult, createOrder, isOrderId, newOrderId, readOrder } = await import(
  "../src/lib/payments/orders.ts"
);
type Order = Awaited<ReturnType<typeof readOrder>> extends infer R ? (R extends { order: infer O } ? O : never) : never;

function order(id: string, totalQar: number): Order {
  return {
    v: 1,
    id,
    ref: id.slice(0, 8),
    kind: "shop",
    createdAt: new Date().toISOString(),
    locale: "en",
    pay: "online",
    status: "awaiting_payment",
    totalQar,
    customer: { name: "Test", mobile: "+97430838355", email: "t@example.com" },
    notes: "",
    attribution: {},
    events: [],
    flags: [],
    emails: {},
  } as Order;
}

const result = (
  orderId: string,
  outcome: "paid" | "failed" | "pending",
  amountQar: number | null,
  txn = "SD1",
  sandbox = true,
) => ({
  orderId,
  outcome,
  transactionNumber: txn,
  amountQar,
  sandbox,
  merchantId: "7326278",
  message: "",
});

test("order ids: reference plus a 4-character attempt suffix", () => {
  const id = newOrderId("ABK-7K3M");
  assert.match(id, /^ABK-7K3M-[2-9A-HJKMNP-Z]{4}$/);
  assert.equal(isOrderId(id), true);
  assert.equal(isOrderId(newOrderId("PPF-AB2CD")), true);
  assert.equal(isOrderId("ABK-7K3M"), false);
  assert.equal(isOrderId("../orders/x"), false);
  assert.equal(isOrderId("ABK-ILO1-XXXX"), false); // I, L, O and 1 are not in the alphabet
});

test("a creation is refused for an id that already exists", async () => {
  const id = newOrderId("ABK-AAAA");
  await createOrder(order(id, 10));
  await assert.rejects(createOrder(order(id, 10)));
});

test("paid with the right amount: paid exactly once", async () => {
  const id = newOrderId("ABK-BBBB");
  await createOrder(order(id, 75));
  const first = await applyPaymentResult(result(id, "paid", 75), "callback");
  assert.equal(first?.newlyPaid, true);
  assert.equal(first?.order.status, "paid");
  assert.equal(first?.order.payment?.transactionNumber, "SD1");

  const webhook = await applyPaymentResult(result(id, "paid", 75), "webhook");
  assert.equal(webhook?.newlyPaid, false);
  assert.equal(webhook?.order.status, "paid");

  const replay = await applyPaymentResult(result(id, "paid", 75), "webhook");
  assert.equal(replay?.newlyPaid, false);
  assert.equal((await readOrder(id))?.order.events.length, 2);
});

test("a late failure never undoes a payment", async () => {
  const id = newOrderId("ABK-CCCC");
  await createOrder(order(id, 20));
  await applyPaymentResult(result(id, "paid", 20), "callback");
  const late = await applyPaymentResult(result(id, "failed", 20, "SD2"), "webhook");
  assert.equal(late?.order.status, "paid");
  assert.equal(late?.newlyPaid, false);
});

test("failed, then settled as paid after midnight: becomes paid", async () => {
  const id = newOrderId("ABK-DDDD");
  await createOrder(order(id, 30));
  const failed = await applyPaymentResult(result(id, "failed", 30), "callback");
  assert.equal(failed?.order.status, "failed");
  const settled = await applyPaymentResult(result(id, "paid", 30), "webhook");
  assert.equal(settled?.order.status, "paid");
  assert.equal(settled?.newlyPaid, true);
});

test("in progress stays awaiting payment", async () => {
  const id = newOrderId("ABK-EEEE");
  await createOrder(order(id, 40));
  const pending = await applyPaymentResult(result(id, "pending", 40), "callback");
  assert.equal(pending?.order.status, "awaiting_payment");
  assert.equal(pending?.newlyPaid, false);
});

test("a success for a different amount goes to review, not paid", async () => {
  const id = newOrderId("ABK-FFFF");
  await createOrder(order(id, 75));
  const odd = await applyPaymentResult(result(id, "paid", 1), "callback");
  assert.equal(odd?.order.status, "review");
  assert.equal(odd?.review, "amount_mismatch");
  assert.equal(odd?.sendPaidEmails, false);
  assert.deepEqual(odd?.order.flags, ["amount_mismatch"]);
  // The same transaction by the other channel: staff were already told.
  const echo = await applyPaymentResult(result(id, "paid", 1), "webhook");
  assert.equal(echo?.order.status, "review");
  assert.equal(echo?.review, null);
  // A different transaction is a different payment: tell staff again.
  const other = await applyPaymentResult(result(id, "paid", null, "SD9"), "webhook");
  assert.equal(other?.order.status, "review");
  assert.equal(other?.review, "amount_mismatch");
  assert.deepEqual(other?.order.flags, ["amount_mismatch"]);
});

test("review, then the right amount: paid, and the paid emails are owed despite the review alert", async () => {
  const { recordEmails } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-KKKK");
  await createOrder(order(id, 80));
  await applyPaymentResult(result(id, "paid", 8), "callback");
  await recordEmails(id, { review: new Date().toISOString() });
  const fixed = await applyPaymentResult(result(id, "paid", 80), "webhook");
  assert.equal(fixed?.order.status, "paid");
  assert.equal(fixed?.newlyPaid, true);
  assert.equal(fixed?.sendPaidEmails, true);
});

test("an online PPF booking: its 'booked' alert never stands in for the paid emails", async () => {
  const { recordEmails } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("PPF-AB2CD");
  await createOrder({ ...order(id, 899), kind: "ppf" } as Order);
  await recordEmails(id, { booked: new Date().toISOString() });
  const paid = await applyPaymentResult(result(id, "paid", 899), "webhook");
  assert.equal(paid?.newlyPaid, true);
  assert.equal(paid?.sendPaidEmails, true);
});

test("a second successful payment on a paid order alerts staff once, and the order stays paid", async () => {
  const id = newOrderId("ABK-MMMM");
  await createOrder(order(id, 60));
  await applyPaymentResult(result(id, "paid", 60, "SD1"), "callback");
  const echo = await applyPaymentResult(result(id, "paid", 60, "SD1"), "webhook");
  assert.equal(echo?.review, null);
  const twice = await applyPaymentResult(result(id, "paid", 60, "SD2"), "callback");
  assert.equal(twice?.order.status, "paid");
  assert.equal(twice?.order.payment?.transactionNumber, "SD1");
  assert.equal(twice?.review, "paid_twice");
  assert.equal(twice?.newlyPaid, false);
  const twiceEcho = await applyPaymentResult(result(id, "paid", 60, "SD2"), "webhook");
  assert.equal(twiceEcho?.review, null);
  assert.deepEqual(twiceEcho?.order.flags, ["paid_twice"]);
});

test("a sandbox payment on the live site is never treated as paid", async () => {
  process.env.VERCEL_ENV = "production";
  try {
    const id = newOrderId("ABK-NNNN");
    await createOrder(order(id, 45));
    const sandbox = await applyPaymentResult(result(id, "paid", 45, "SD1", true), "callback");
    assert.equal(sandbox?.order.status, "review");
    assert.equal(sandbox?.newlyPaid, false);
    assert.equal(sandbox?.sendPaidEmails, false);
    assert.equal(sandbox?.review, "test_payment");
    const live = await applyPaymentResult(result(id, "paid", 45, "SD5", false), "webhook");
    assert.equal(live?.order.status, "paid");
    assert.equal(live?.newlyPaid, true);
  } finally {
    delete process.env.VERCEL_ENV;
  }
});

test("callback and webhook racing: exactly one sees newlyPaid", async () => {
  const id = newOrderId("ABK-GGGG");
  await createOrder(order(id, 99));
  const [a, b] = await Promise.all([
    applyPaymentResult(result(id, "paid", 99), "callback"),
    applyPaymentResult(result(id, "paid", 99), "webhook"),
  ]);
  assert.equal([a?.newlyPaid, b?.newlyPaid].filter(Boolean).length, 1);
  assert.equal((await readOrder(id))?.order.status, "paid");
});

test("an unknown order is reported as such", async () => {
  assert.equal(await applyPaymentResult(result(newOrderId("ABK-HHHH"), "paid", 5), "webhook"), null);
});

test("paid emails: one claim at a time, retried by a later event if they never went out", async () => {
  const { recordEmails } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-JJJJ");
  await createOrder(order(id, 50));
  const first = await applyPaymentResult(result(id, "paid", 50), "callback");
  assert.equal(first?.sendPaidEmails, true);
  // The webhook right after: the claim is fresh, so it must not send again.
  const second = await applyPaymentResult(result(id, "paid", 50), "webhook");
  assert.equal(second?.sendPaidEmails, false);
  // The first sender died before mailing; 11 minutes later SADAD repeats the webhook.
  await recordEmails(id, { claimedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString() });
  const retry = await applyPaymentResult(result(id, "paid", 50), "webhook");
  assert.equal(retry?.sendPaidEmails, true);
  // The staff alert went out but the receipt failed: a later event retries the receipt.
  await recordEmails(id, { shop: new Date().toISOString(), claimedAt: new Date(0).toISOString() });
  const receipt = await applyPaymentResult(result(id, "paid", 50), "callback");
  assert.equal(receipt?.sendPaidEmails, true);
  // Both recorded as sent: nothing is owed any more, whatever arrives.
  await recordEmails(id, { customer: new Date().toISOString(), claimedAt: new Date(0).toISOString() });
  const done = await applyPaymentResult(result(id, "pending", 50, "SD7"), "webhook");
  assert.equal(done?.sendPaidEmails, false);
});

test("paid emails: no customer email means the staff alert alone settles them", async () => {
  const { recordEmails } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-PPPP");
  await createOrder({ ...order(id, 25), customer: { name: "Test", mobile: "+97430838355", email: "" } } as Order);
  await applyPaymentResult(result(id, "paid", 25), "callback");
  await recordEmails(id, { shop: new Date().toISOString(), claimedAt: new Date(0).toISOString() });
  const later = await applyPaymentResult(result(id, "pending", 25, "SD3"), "webhook");
  assert.equal(later?.sendPaidEmails, false);
});

test("paid emails: a released claim (failed send) lets the other channel retry at once", async () => {
  const { recordEmails } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-RRRR");
  await createOrder(order(id, 40));
  const first = await applyPaymentResult(result(id, "paid", 40, "SD9"), "callback");
  assert.equal(first?.sendPaidEmails, true);
  // The send failed: sendOrderEmails records the error and gives the claim back.
  await recordEmails(id, { error: "shop: connection refused", claimedAt: undefined });
  const stored = await readOrder(id);
  assert.equal(stored?.order.emails.claimedAt, undefined);
  // The webhook for the same payment, seconds later, takes the retry.
  const webhook = await applyPaymentResult(result(id, "paid", 40, "SD9"), "webhook");
  assert.equal(webhook?.sendPaidEmails, true);
  assert.equal(webhook?.newlyPaid, false);
  assert.equal(webhook?.review, null);
});

test("hasPaymentEvent: the same outcome and transaction from either channel", async () => {
  const { hasPaymentEvent } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-HHHH");
  await createOrder(order(id, 15));
  await applyPaymentResult(result(id, "paid", 15, "SD10"), "webhook");
  const stored = (await readOrder(id))!.order;
  assert.equal(hasPaymentEvent(stored, result(id, "paid", 15, "SD10")), true);
  assert.equal(hasPaymentEvent(stored, result(id, "paid", 15, "SD11")), false);
  assert.equal(hasPaymentEvent(stored, result(id, "failed", 15, "SD10")), false);
});

test("a write that landed but lost its reply keeps its answer (paid emails still go out)", async () => {
  const { testHooks } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-WWWW");
  await createOrder(order(id, 60));
  testHooks.loseNextWriteReply = true;
  const out = await applyPaymentResult(result(id, "paid", 60, "SD20"), "callback");
  assert.equal(testHooks.loseNextWriteReply, false); // the fault was injected
  assert.equal(out?.newlyPaid, true);
  assert.equal(out?.sendPaidEmails, true);
  const stored = (await readOrder(id))!.order;
  assert.equal(stored.status, "paid");
  assert.equal(stored.events.length, 1); // recorded once, not twice
});

test("other attempts of a cart: a paid one by the same mobile is found, never itself or another customer's", async () => {
  const { findOtherPaidAttempt } = await import("../src/lib/payments/orders.ts");
  const mobile = "+97430838355"; // order() uses this mobile
  const a = newOrderId("ABK-QQQQ");
  let b = newOrderId("ABK-QQQQ");
  while (b === a) b = newOrderId("ABK-QQQQ");
  await createOrder(order(a, 30));
  await createOrder(order(b, 30));
  assert.equal(await findOtherPaidAttempt("ABK-QQQQ", mobile), null);
  await applyPaymentResult(result(a, "paid", 30, "SD30"), "webhook");
  assert.equal((await findOtherPaidAttempt("ABK-QQQQ", mobile, b))?.id, a);
  assert.equal(await findOtherPaidAttempt("ABK-QQQQ", mobile, a), null); // b is unpaid
  // The same 4-character reference from another customer is not this cart.
  assert.equal(await findOtherPaidAttempt("ABK-QQQQ", "+97455551234", b), null);
  assert.equal(await findOtherPaidAttempt("ABK-ZZZZ", mobile), null);
});

test("PPF: a paid booking of the same package by the same mobile is found; another package or mobile is not", async () => {
  const { findOtherPaidPpfBooking } = await import("../src/lib/payments/orders.ts");
  const label = { en: "", ar: "" };
  const ppfOrder = (id: string, mobile: string, coverage = "front-end") =>
    ({
      ...order(id, 899),
      kind: "ppf",
      customer: { name: "Test", mobile, email: "" },
      ppf: {
        body: "sedan", bodyLabel: label, coverage, coverageLabel: label, film: "pro", filmLabel: label,
        parts: [], car: "", existingFilm: "", preferredDate: "", priceQar: 899, isEstimate: false,
      },
    }) as Order;
  const first = newOrderId("PPF-AAAA2");
  const retry = newOrderId("PPF-BBBB3"); // a resubmitted booking gets a new reference
  const stranger = newOrderId("PPF-CCCC4");
  const otherPackage = newOrderId("PPF-DDDD5");
  await createOrder(ppfOrder(first, "+97433334444"));
  await createOrder(ppfOrder(retry, "+97433334444"));
  await createOrder(ppfOrder(stranger, "+97455556666"));
  await createOrder(ppfOrder(otherPackage, "+97433334444", "full-front"));
  const read = async (id: string) => (await readOrder(id))!.order;
  assert.equal(await findOtherPaidPpfBooking(await read(retry)), null);
  await applyPaymentResult(result(first, "paid", 899, "SD40"), "webhook");
  assert.equal((await findOtherPaidPpfBooking(await read(retry)))?.id, first);
  assert.equal(await findOtherPaidPpfBooking(await read(stranger)), null);
  assert.equal(await findOtherPaidPpfBooking(await read(otherPackage)), null);
  assert.equal(await findOtherPaidPpfBooking(await read(first)), null); // never itself
});

test("hasPaymentEvent can ask which channel reported it", async () => {
  const { hasPaymentEvent } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-SSSS");
  await createOrder(order(id, 20));
  await applyPaymentResult(result(id, "paid", 20, "SD50"), "callback");
  const stored = (await readOrder(id))!.order;
  assert.equal(hasPaymentEvent(stored, result(id, "paid", 20, "SD50"), "callback"), true);
  assert.equal(hasPaymentEvent(stored, result(id, "paid", 20, "SD50"), "webhook"), false);
});

test("flagOrder adds a flag once and reports only the first time", async () => {
  const { flagOrder } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-FFFF");
  await createOrder(order(id, 5));
  assert.equal(await flagOrder(id, "unverified_result"), true);
  assert.equal(await flagOrder(id, "unverified_result"), false);
  assert.deepEqual((await readOrder(id))!.order.flags, ["unverified_result"]);
  assert.equal(await flagOrder("ABK-FFFF-2222", "x"), false); // unknown order
});

test("sweep: owed paid emails are claimed again, counted, and capped", async () => {
  const { claimPaidEmails, recordEmails } = await import("../src/lib/payments/orders.ts");
  const id = newOrderId("ABK-SWPA");
  await createOrder(order(id, 70));
  const paid = await applyPaymentResult(result(id, "paid", 70, "SD60"), "callback");
  assert.equal(paid?.order.emails.attempts, 1);
  // The send failed and gave its claim back: the sweep may claim it now.
  await recordEmails(id, { error: "shop: timeout", claimedAt: undefined });
  const again = await claimPaidEmails(id);
  assert.equal(again?.emails.attempts, 2);
  assert.equal(await claimPaidEmails(id), null); // a fresh claim stands
  // Stale claims are retried until six tries are used up.
  for (let n = 3; n <= 6; n++) {
    await recordEmails(id, { claimedAt: new Date(0).toISOString() });
    assert.equal((await claimPaidEmails(id))?.emails.attempts, n);
  }
  await recordEmails(id, { claimedAt: new Date(0).toISOString() });
  assert.equal(await claimPaidEmails(id), null); // capped: a bounced address isn't mailed forever
});

test("sweep: unpaid online cart checkouts are picked once per cart, only when due", async () => {
  const { unpaidCheckoutsToAlert } = await import("../src/lib/payments/sweep.ts");
  const now = Date.parse("2026-11-20T12:00:00.000Z");
  const at = (minutesAgo: number) => new Date(now - minutesAgo * 60_000).toISOString();
  const mk = (ref: string, minutesAgo: number, extra: Partial<Order> = {}) =>
    ({ ...order(`${ref}-${"2345"}`, 30), ref, createdAt: at(minutesAgo), ...extra }) as Order;
  const orders: Order[] = [
    mk("ABK-AAA2", 60), // due
    mk("ABK-BBB3", 10), // the customer may still be paying
    mk("ABK-CCC4", 60 * 24 * 4), // older than 3 days
    mk("ABK-DDD5", 60, { status: "failed" }), // failed and not retried: due
    mk("ABK-EEE6", 90), // an older attempt of a cart that was then paid
    { ...mk("ABK-EEE6", 30), id: "ABK-EEE6-3456", status: "paid" } as Order,
    mk("ABK-FFF7", 60, { flags: ["unpaid_alerted"] }), // already alerted
    mk("ABK-GGG8", 120), // two unpaid attempts of one cart: one alert, for the newer
    { ...mk("ABK-GGG8", 70), id: "ABK-GGG8-3456" } as Order,
    mk("ABK-HHH9", 60, { pay: "handover", status: "booked" }), // not an online payment
    { ...mk("PPF-JJJJ2", 60), kind: "ppf" } as Order, // PPF bookings alert staff when booked
  ];
  const due = unpaidCheckoutsToAlert(orders, now, 45 * 60_000).map((o) => o.id).sort();
  assert.deepEqual(due, ["ABK-AAA2-2345", "ABK-DDD5-2345", "ABK-GGG8-3456"]);
});

test("rate limit: counts per key inside the window, and reads the edge's address", async () => {
  const { clientAddress, overLimit } = await import("../src/lib/rate-limit.ts");
  const t0 = 1_000_000;
  for (let i = 0; i < 3; i++) assert.equal(overLimit("test:a", 3, 60_000, t0 + i), false);
  assert.equal(overLimit("test:a", 3, 60_000, t0 + 10), true);
  assert.equal(overLimit("test:b", 3, 60_000, t0 + 10), false); // another visitor
  assert.equal(overLimit("test:a", 3, 60_000, t0 + 60_005), false); // the window moved on
  const req = (h: Record<string, string>) => new Request("https://example.com/", { headers: h });
  assert.equal(clientAddress(req({ "x-forwarded-for": "1.2.3.4, 203.0.113.9" })), "203.0.113.9");
  assert.equal(clientAddress(req({ "x-real-ip": "198.51.100.7" })), "198.51.100.7");
  assert.equal(clientAddress(req({})), null); // unknown: never limited
});

test("PPF online price: 5% off, rounded down to whole riyals", async () => {
  const { ppfOnlinePriceQar, PPF_ONLINE_DISCOUNT_PERCENT } = await import("../src/data/ppfInstall.ts");
  assert.equal(PPF_ONLINE_DISCOUNT_PERCENT, 5, "the page copy says 5% (messages/*.json summaryPayment, how3Body, payBody; src/data/faq.ts): change it with the constant");
  const cases: [number, number][] = [[899, 854], [1599, 1519], [1899, 1804], [3999, 3799], [4799, 4559], [5499, 5224], [1000, 950]];
  for (const [full, online] of cases) assert.equal(ppfOnlinePriceQar(full), online, `${full}`);
});
