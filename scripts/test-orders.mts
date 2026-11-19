/**
 * Unit tests for the order state machine in src/lib/payments/orders.ts, run
 * against its in-memory store (no BLOB_READ_WRITE_TOKEN in the environment).
 *
 *   npm run test:payments
 */

import assert from "node:assert/strict";
import { test } from "node:test";

delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.VERCEL;

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

const result = (orderId: string, outcome: "paid" | "failed" | "pending", amountQar: number | null, txn = "SD1") => ({
  orderId,
  outcome,
  transactionNumber: txn,
  amountQar,
  sandbox: true,
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
  assert.equal(odd?.newlyFlagged, true);
  assert.deepEqual(odd?.order.flags, ["amount_mismatch"]);
  const missing = await applyPaymentResult(result(id, "paid", null, "SD9"), "webhook");
  assert.equal(missing?.order.status, "review");
  assert.equal(missing?.newlyFlagged, false); // already flagged: no second alert
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
  // Once the staff email is recorded as sent, nothing is owed any more.
  await recordEmails(id, { shop: new Date().toISOString(), claimedAt: new Date(0).toISOString() });
  const after = await applyPaymentResult(result(id, "paid", 50, "SD7"), "webhook");
  assert.equal(after?.sendPaidEmails, false);
});
