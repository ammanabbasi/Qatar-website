/**
 * SADAD Web Checkout — request signing and response verification.
 *
 * Pure functions with no Next.js or `@/` imports, so scripts/test-payments.mts
 * can load this file directly with Node.
 *
 * WHICH SCHEME: developer.sadad.qa (Web Checkout 2.1, read 2026-11-19)
 * documents a plain SHA-256 `signature`, but SADAD's live endpoint rejects it
 * ("Checksumhash did not match"). Tested against the sandbox on 2026-11-19,
 * the endpoint accepts the older `checksumhash` scheme that SADAD's own
 * plugins use (see github.com/applab-qatar/sadad, src/Traits/CheckSum.php):
 *
 *   json  = PHP json_encode({ postData: <form fields, in posted order>, secretKey })
 *   salt  = 4 random characters
 *   hash  = sha256(json + "|" + salt) + salt
 *   checksumhash = base64( AES-128-CBC(hash, key = (secretKey + merchantId) cut to
 *                  16 bytes, iv = "@@@@&&&&####$$$$") )
 *
 * SADAD rebuilds the JSON from the fields in the order they were POSTed, so
 * the form must be posted in exactly the order it was signed — fields are an
 * ordered list here, never an object. `productdetail` lines are required (the
 * checksum fails without them), and the return URL must be on the website
 * domain registered in the SADAD panel.
 *
 * Responses (callback form POST, webhook JSON) carry `checksumhash` too. They
 * are verified with the same scheme; a 64-hex value is checked the way the
 * 2.1 docs describe (sha256 of secretKey + values in key order), so either
 * format SADAD sends is understood. Both need the secret key.
 *
 * The secret key decides sandbox vs live; both use SADAD_CHECKOUT_URL.
 */

import { createCipheriv, createDecipheriv, createHash, randomInt, timingSafeEqual } from "node:crypto";

export const SADAD_CHECKOUT_URL = "https://sadadqa.com/webpurchase";

const IV = Buffer.from("@@@@&&&&####$$$$", "utf8");
const SALT_CHARS = "AbcDE123IJKLMN67QRSTUVWXYZaBCdefghijklmn123opq45rs67tuv89wxyz0FGH45OP89";

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** PHP's openssl_encrypt key handling for AES-128: cut or NUL-pad to 16 bytes. */
function aesKey(key: string): Buffer {
  const out = Buffer.alloc(16);
  Buffer.from(key, "utf8").copy(out, 0, 0, 16);
  return out;
}

function encrypt(input: string, key: string): string {
  const cipher = createCipheriv("aes-128-cbc", aesKey(key), IV);
  return Buffer.concat([cipher.update(input, "utf8"), cipher.final()]).toString("base64");
}

function decrypt(input: string, key: string): string | null {
  try {
    const decipher = createDecipheriv("aes-128-cbc", aesKey(key), IV);
    return Buffer.concat([decipher.update(Buffer.from(input, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/**
 * PHP json_encode() with default flags: like JSON.stringify, plus `/` escaped
 * as `\/` and every non-ASCII character as a lowercase \uXXXX escape.
 */
export function phpJsonEncode(value: unknown): string {
  return JSON.stringify(value)
    .replace(/\//g, "\\/")
    .replace(/[\u0080-￿]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

/** PHP urlencode(): spaces as "+", everything but [A-Za-z0-9_.-] percent-encoded. */
function phpUrlencode(s: string): string {
  return encodeURIComponent(s)
    .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%20/g, "+");
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Turns posted pairs into the structure PHP builds in $_POST:
 * `productdetail[0][amount]` becomes productdetail → [ { amount } ], and an
 * array whose keys are 0..n-1 encodes as a JSON list, as in PHP.
 */
export function phpPostStructure(pairs: ReadonlyArray<readonly [string, string]>): Record<string, JsonValue> {
  type Node = Map<string, Node | string>;
  const root: Node = new Map();
  for (const [name, value] of pairs) {
    const match = /^([^[\]]+)((?:\[[^[\]]*\])*)$/.exec(name);
    const path = match
      ? [match[1], ...[...match[2].matchAll(/\[([^[\]]*)\]/g)].map((m) => m[1])]
      : [name];
    let node = root;
    path.forEach((segment, i) => {
      const key = segment === "" ? String(node.size) : segment;
      if (i === path.length - 1) {
        node.set(key, value);
      } else {
        const next = node.get(key);
        if (next instanceof Map) node = next;
        else {
          const created: Node = new Map();
          node.set(key, created);
          node = created;
        }
      }
    });
  }
  const toJson = (node: Node): JsonValue => {
    const keys = [...node.keys()];
    const isList = keys.every((k, i) => k === String(i));
    const values = keys.map((k) => {
      const v = node.get(k)!;
      return v instanceof Map ? toJson(v) : v;
    });
    if (isList && keys.length > 0) return values;
    return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
  };
  return toJson(root) as Record<string, JsonValue>;
}

function legacyChecksum(postData: unknown, secretKey: string, merchantId: string, salt: string): string {
  const json = phpJsonEncode({ postData, secretKey });
  return encrypt(sha256Hex(`${json}|${salt}`) + salt, secretKey + merchantId);
}

export function randomSalt(length = 4): string {
  let salt = "";
  for (let i = 0; i < length; i++) salt += SALT_CHARS[randomInt(SALT_CHARS.length)];
  return salt;
}

// ── request ──────────────────────────────────────────────────────────────

export type SadadCheckoutInput = {
  merchantId: string;
  secretKey: string;
  /** The website domain registered in the SADAD panel. */
  website: string;
  /** Unique per payment attempt, at most 50 characters. */
  orderId: string;
  amountQar: number;
  /** Must be on the registered website domain. */
  callbackUrl: string;
  email: string;
  /** Digits only, with the country code: 97430838355. */
  mobile: string;
  txnDate: string;
  language: "ENG" | "ARB";
  /** Shown on SADAD's side for the single order line, e.g. "ABK order ABK-7K3M". */
  itemName: string;
};

/** Ordered form fields: SADAD verifies them in the order they are posted. */
export type SadadForm = { action: string; fields: Array<[string, string]> };

export function formatSadadAmount(qar: number): string {
  return (Math.round(qar * 100) / 100).toFixed(2);
}

/** "2026-11-19 14:05:09" in Doha time (UTC+3 all year — Qatar has no DST). */
export function sadadTxnDate(now: Date = new Date()): string {
  const d = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ` +
    `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
  );
}

/** The form the browser posts to SADAD, `checksumhash` last. `salt` is for tests. */
export function buildSadadCheckoutForm(input: SadadCheckoutInput, salt: string = randomSalt()): SadadForm {
  const amount = formatSadadAmount(input.amountQar);
  const fields: Array<[string, string]> = [
    ["merchant_id", input.merchantId],
    ["ORDER_ID", input.orderId],
    ["WEBSITE", input.website],
    ["TXN_AMOUNT", amount],
    ["CUST_ID", input.email],
    ["EMAIL", input.email],
    ["MOBILE_NO", input.mobile],
    ["SADAD_WEBCHECKOUT_PAGE_LANGUAGE", input.language],
    ["CALLBACK_URL", input.callbackUrl],
    ["txnDate", input.txnDate],
    ["productdetail[0][order_id]", input.orderId],
    ["productdetail[0][itemname]", input.itemName],
    ["productdetail[0][amount]", amount],
    ["productdetail[0][quantity]", "1"],
    ["productdetail[0][type]", "line_item"],
  ].map(([k, v]) => [k, v.trim()] as [string, string]);
  const checksum = legacyChecksum(phpPostStructure(fields), input.secretKey, input.merchantId, salt);
  return { action: SADAD_CHECKOUT_URL, fields: [...fields, ["checksumhash", checksum]] };
}

// ── responses ────────────────────────────────────────────────────────────

function sameHex(a: string, b: string): boolean {
  const x = Buffer.from(a.toLowerCase(), "utf8");
  const y = Buffer.from(b.toLowerCase(), "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

/** PHP's string cast, for the docs-style (sorted values) checksum. */
function phpString(value: unknown): string {
  if (value === null || value === undefined || value === false) return "";
  if (value === true) return "1";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

/**
 * True when `payload.checksumhash` was made with `secretKey` over the
 * payload's other fields. `payload` must keep the order the fields arrived in
 * (form entries / JSON keys) — the encrypted scheme hashes them in that order.
 */
export function verifySadadChecksum(
  payload: Record<string, unknown>,
  secretKey: string,
  merchantId: string,
): boolean {
  const received = payload.checksumhash;
  if (!secretKey || typeof received !== "string" || received.length < 16) return false;
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key !== "checksumhash") rest[key] = value;
  }

  // 2.1 docs format: 64 hex characters, sha256(secretKey + values in key order).
  if (/^[0-9a-fA-F]{64}$/.test(received)) {
    const values = Object.keys(rest)
      .sort()
      .map((k) => phpString(rest[k]))
      .join("");
    return sameHex(sha256Hex(secretKey + values), received);
  }

  // Encrypted format. SADAD's samples put the key into the JSON either as is
  // or urlencoded, so both are tried; each still needs the secret. Bracketed
  // form names are nested the way PHP's $_POST nests them.
  const postData = Object.keys(rest).some((k) => k.includes("["))
    ? phpPostStructure(Object.entries(rest).map(([k, v]) => [k, phpString(v)] as const))
    : rest;
  for (const keyText of [secretKey, phpUrlencode(secretKey)]) {
    const plain = decrypt(received, keyText + merchantId);
    if (!plain || plain.length < 68) continue;
    const salt = plain.slice(-4);
    const hash = plain.slice(0, -4);
    const json = phpJsonEncode({ postData, secretKey: keyText });
    if (sameHex(sha256Hex(`${json}|${salt}`), hash)) return true;
  }
  return false;
}

export type SadadOutcome = "paid" | "failed" | "pending";

export type SadadResult = {
  orderId: string;
  outcome: SadadOutcome;
  /** SADAD's own reference, e.g. SD2883696582255. */
  transactionNumber: string;
  amountQar: number | null;
  sandbox: boolean;
  merchantId: string;
  message: string;
};

/** transaction_status: 1 in progress, 2 failed, 3 successful. Only 2 and 3 are final. */
function outcomeFromCode(code: unknown, fallbackStatus?: unknown): SadadOutcome {
  const n = Number(code);
  if (n === 3) return "paid";
  if (n === 2) return "failed";
  if (n === 1) return "pending";
  if (fallbackStatus === "TXN_SUCCESS") return "paid";
  if (fallbackStatus === "TXN_FAILURE") return "failed";
  return "pending";
}

function amountOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function text(value: unknown, max = 120): string {
  return typeof value === "string" || typeof value === "number" ? String(value).slice(0, max) : "";
}

/** Fields of the browser callback (application/x-www-form-urlencoded). */
export function parseSadadCallback(p: Record<string, string>): SadadResult {
  return {
    orderId: text(p.ORDERID || p.website_ref_no || p.ORDER_ID, 60),
    outcome: outcomeFromCode(p.transaction_status, p.STATUS),
    transactionNumber: text(p.transaction_number || p.TXNID, 60),
    amountQar: amountOrNull(p.TXNAMOUNT),
    sandbox: p.issandboxmode === "1",
    merchantId: text(p.MID, 30),
    message: text(p.RESPMSG),
  };
}

/** Fields of the server-to-server webhook (JSON). */
export function parseSadadWebhook(p: Record<string, unknown>): SadadResult {
  return {
    orderId: text(p.websiteRefNo, 60),
    outcome: outcomeFromCode(p.transactionStatus),
    transactionNumber: text(p.transactionNumber, 60),
    amountQar: amountOrNull(p.txnAmount),
    sandbox: String(p.isTestMode) === "1",
    merchantId: text(p.merchantId, 30),
    message: text(p.message),
  };
}
