/**
 * Unit tests for SADAD request signing and response verification.
 *
 *   npm run test:payments
 *
 * The request format below is the one SADAD's sandbox accepted on 2026-11-19
 * (see the header of src/lib/payments/sadad.ts). The expected JSON is written
 * out literally, so a change in field order, escaping or nesting — any of
 * which makes SADAD answer "Checksumhash did not match" — fails here first.
 */

import assert from "node:assert/strict";
import { createCipheriv, createDecipheriv, createHash } from "node:crypto";
import { test } from "node:test";
import {
  SADAD_CHECKOUT_URL,
  buildSadadCheckoutForm,
  formatSadadAmount,
  parseSadadCallback,
  parseSadadWebhook,
  phpJsonEncode,
  phpPostStructure,
  sadadTxnDate,
  verifySadadChecksum,
} from "../src/lib/payments/sadad.ts";

const SECRET = "48E+test+Key1234"; // 16 characters with '+', like SADAD's real keys
const MID = "7326278";
const IV = Buffer.from("@@@@&&&&####$$$$");

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");
const key16 = (k: string) => {
  const b = Buffer.alloc(16);
  Buffer.from(k).copy(b, 0, 0, 16);
  return b;
};
const encrypt = (s: string, k: string) => {
  const c = createCipheriv("aes-128-cbc", key16(k), IV);
  return Buffer.concat([c.update(s, "utf8"), c.final()]).toString("base64");
};
const decrypt = (s: string, k: string) => {
  const d = createDecipheriv("aes-128-cbc", key16(k), IV);
  return Buffer.concat([d.update(Buffer.from(s, "base64")), d.final()]).toString("utf8");
};
/** Signs a response the way SADAD's PHP does, with the JSON text given literally. */
const signJson = (json: string, salt: string, keyText = SECRET) =>
  encrypt(sha256(`${json}|${salt}`) + salt, keyText + MID);

test("PHP json_encode escaping: slashes and non-ASCII", () => {
  assert.equal(phpJsonEncode({ u: "https://a.b/c" }), '{"u":"https:\\/\\/a.b\\/c"}');
  assert.equal(phpJsonEncode({ n: "طلب" }), '{"n":"\\u0637\\u0644\\u0628"}');
  assert.equal(phpJsonEncode({ q: 'say "hi"' }), '{"q":"say \\"hi\\""}');
});

test("bracketed form names nest like PHP $_POST, in posted order", () => {
  const structure = phpPostStructure([
    ["a", "1"],
    ["productdetail[0][order_id]", "X"],
    ["productdetail[0][amount]", "2.00"],
    ["productdetail[1][order_id]", "Y"],
    ["z", "last"],
  ]);
  assert.equal(
    JSON.stringify(structure),
    '{"a":"1","productdetail":[{"order_id":"X","amount":"2.00"},{"order_id":"Y"}],"z":"last"}',
  );
});

const INPUT = {
  merchantId: MID,
  secretKey: SECRET,
  website: "abktradingservice.com",
  orderId: "ABK-7K3M-Q2ZD",
  amountQar: 70,
  callbackUrl: "https://abktradingservice.com/api/payments/sadad/callback",
  email: "customer@example.com",
  mobile: "97430838355",
  txnDate: "2026-11-19 17:24:56",
  language: "ENG" as const,
  itemName: "ABK order ABK-7K3M",
};

test("checkout form: exact field order, checksum over the exact accepted JSON", () => {
  const form = buildSadadCheckoutForm(INPUT, "AbC1");
  assert.equal(form.action, SADAD_CHECKOUT_URL);
  assert.deepEqual(
    form.fields.map(([k]) => k),
    [
      "merchant_id",
      "ORDER_ID",
      "WEBSITE",
      "TXN_AMOUNT",
      "CUST_ID",
      "EMAIL",
      "MOBILE_NO",
      "SADAD_WEBCHECKOUT_PAGE_LANGUAGE",
      "CALLBACK_URL",
      "txnDate",
      "productdetail[0][order_id]",
      "productdetail[0][itemname]",
      "productdetail[0][amount]",
      "productdetail[0][quantity]",
      "productdetail[0][type]",
      "checksumhash",
    ],
  );
  const json =
    '{"postData":{"merchant_id":"7326278","ORDER_ID":"ABK-7K3M-Q2ZD","WEBSITE":"abktradingservice.com",' +
    '"TXN_AMOUNT":"70.00","CUST_ID":"customer@example.com","EMAIL":"customer@example.com",' +
    '"MOBILE_NO":"97430838355","SADAD_WEBCHECKOUT_PAGE_LANGUAGE":"ENG",' +
    '"CALLBACK_URL":"https:\\/\\/abktradingservice.com\\/api\\/payments\\/sadad\\/callback",' +
    '"txnDate":"2026-11-19 17:24:56","productdetail":[{"order_id":"ABK-7K3M-Q2ZD",' +
    '"itemname":"ABK order ABK-7K3M","amount":"70.00","quantity":"1","type":"line_item"}]},' +
    '"secretKey":"48E+test+Key1234"}';
  const checksum = form.fields.at(-1)![1];
  assert.equal(decrypt(checksum, SECRET + MID), sha256(`${json}|AbC1`) + "AbC1");
});

test("a fresh salt every time, so two forms never share a checksum", () => {
  const a = buildSadadCheckoutForm(INPUT).fields.at(-1)![1];
  const b = buildSadadCheckoutForm(INPUT).fields.at(-1)![1];
  assert.notEqual(a, b);
});

test("amounts always carry two decimals and round to the dirham", () => {
  assert.equal(formatSadadAmount(2.5), "2.50");
  assert.equal(formatSadadAmount(345), "345.00");
  assert.equal(formatSadadAmount(0.1 + 0.2), "0.30");
  assert.equal(formatSadadAmount(1599.999), "1600.00");
});

test("txnDate is Doha time (UTC+3)", () => {
  assert.equal(sadadTxnDate(new Date("2026-11-19T21:30:05Z")), "2026-11-20 00:30:05");
  assert.equal(sadadTxnDate(new Date("2026-01-01T00:00:00Z")), "2026-01-01 03:00:00");
});

const CALLBACK: Record<string, string> = {
  MID,
  ORDERID: "ABK-7K3M-Q2ZD",
  RESPCODE: "1",
  RESPMSG: "Txn Success",
  STATUS: "TXN_SUCCESS",
  TXNAMOUNT: "70.00",
  issandboxmode: "1",
  transaction_number: "SD2883696582255",
  transaction_status: "3",
  website_ref_no: "ABK-7K3M-Q2ZD",
};
const CALLBACK_JSON =
  '{"postData":{"MID":"7326278","ORDERID":"ABK-7K3M-Q2ZD","RESPCODE":"1","RESPMSG":"Txn Success",' +
  '"STATUS":"TXN_SUCCESS","TXNAMOUNT":"70.00","issandboxmode":"1","transaction_number":"SD2883696582255",' +
  '"transaction_status":"3","website_ref_no":"ABK-7K3M-Q2ZD"},"secretKey":"48E+test+Key1234"}';

test("encrypted callback checksum verifies", () => {
  const checksumhash = signJson(CALLBACK_JSON, "Zz9a");
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash }, SECRET, MID), true);
});

test("encrypted checksum made with the urlencoded key also verifies", () => {
  const encodedKey = "48E%2Btest%2BKey1234";
  const json = CALLBACK_JSON.replace('"secretKey":"48E+test+Key1234"', `"secretKey":"${encodedKey}"`);
  const checksumhash = signJson(json, "q1W2", encodedKey);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash }, SECRET, MID), true);
});

test("tampered fields, a different key or a missing hash fail", () => {
  const checksumhash = signJson(CALLBACK_JSON, "Zz9a");
  assert.equal(verifySadadChecksum({ ...CALLBACK, TXNAMOUNT: "1.00", checksumhash }, SECRET, MID), false);
  assert.equal(verifySadadChecksum({ ...CALLBACK, transaction_status: "2", checksumhash }, SECRET, MID), false);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash }, "another-key-1234", MID), false);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash }, SECRET, "1111111"), true); // only 16 key bytes count
  assert.equal(verifySadadChecksum({ ...CALLBACK }, SECRET, MID), false);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash: "garbage" }, SECRET, MID), false);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash }, "", MID), false);
});

test("field order matters for the encrypted format (SADAD hashes in posted order)", () => {
  const checksumhash = signJson(CALLBACK_JSON, "Zz9a");
  const reordered = Object.fromEntries(Object.entries(CALLBACK).reverse());
  assert.equal(verifySadadChecksum({ ...reordered, checksumhash }, SECRET, MID), false);
});

test("webhook JSON numbers keep their JSON form", () => {
  const webhook = {
    invoiceNumber: "",
    isTestMode: 1,
    merchantId: MID,
    message: "success",
    transactionNumber: "SD2418209648273",
    transactionStatus: 3,
    txnAmount: 70,
    websiteRefNo: "ABK-7K3M-Q2ZD",
  };
  const json = `{"postData":${JSON.stringify(webhook)},"secretKey":"48E+test+Key1234"}`;
  assert.equal(verifySadadChecksum({ ...webhook, checksumhash: signJson(json, "x1y2") }, SECRET, MID), true);
});

test("docs-format 64-hex checksum (values in key order) is understood too", () => {
  const values = Object.keys(CALLBACK)
    .sort()
    .map((k) => CALLBACK[k])
    .join("");
  const hex = sha256(SECRET + values);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash: hex }, SECRET, MID), true);
  assert.equal(verifySadadChecksum({ ...CALLBACK, checksumhash: hex.toUpperCase() }, SECRET, MID), true);
  assert.equal(verifySadadChecksum({ ...CALLBACK, TXNAMOUNT: "9.00", checksumhash: hex }, SECRET, MID), false);
});

test("callback fields map to an outcome", () => {
  const paid = parseSadadCallback(CALLBACK);
  assert.equal(paid.orderId, "ABK-7K3M-Q2ZD");
  assert.equal(paid.outcome, "paid");
  assert.equal(paid.amountQar, 70);
  assert.equal(paid.sandbox, true);
  assert.equal(paid.transactionNumber, "SD2883696582255");
  assert.equal(parseSadadCallback({ ...CALLBACK, transaction_status: "2" }).outcome, "failed");
  assert.equal(parseSadadCallback({ ...CALLBACK, transaction_status: "1" }).outcome, "pending");
  const noStatus = { ...CALLBACK };
  delete noStatus.transaction_status;
  assert.equal(parseSadadCallback(noStatus).outcome, "paid");
  assert.equal(parseSadadCallback({ ...noStatus, STATUS: "TXN_FAILURE" }).outcome, "failed");
});

test("webhook fields map to an outcome", () => {
  const result = parseSadadWebhook({
    isTestMode: 1,
    merchantId: MID,
    transactionNumber: "SD1",
    transactionStatus: 3,
    txnAmount: 5.5,
    websiteRefNo: "PPF-AB2CD-3EFG",
  });
  assert.deepEqual(
    { orderId: result.orderId, outcome: result.outcome, amount: result.amountQar, sandbox: result.sandbox },
    { orderId: "PPF-AB2CD-3EFG", outcome: "paid", amount: 5.5, sandbox: true },
  );
  assert.equal(parseSadadWebhook({ transactionStatus: 2 }).outcome, "failed");
  assert.equal(parseSadadWebhook({}).outcome, "pending");
});
