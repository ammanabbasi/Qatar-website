/**
 * Order records — one private JSON blob per payment attempt in the Vercel
 * Blob store "abk-orders" (created 2026-11-19, region bom1, private access).
 *
 * The store is the site's only order database. Staff work from the emails
 * (src/lib/payments/email.ts) and SADAD's own transaction list; the blobs are
 * the durable record behind both and can be browsed in Vercel → Storage →
 * abk-orders. Production writes under `orders/`, preview deployments under
 * `preview/orders/` and local development under `dev/orders/`, so test
 * traffic never mixes with real orders.
 *
 * Updates are compare-and-swap on the blob's ETag: the callback (customer's
 * browser) and the webhook (SADAD's server) can arrive together, and exactly
 * one of them sees an order turn paid — that one sends the emails.
 *
 * Without BLOB_READ_WRITE_TOKEN (unit tests, a fresh clone) records live in
 * memory; on a Vercel deployment a missing token is an error instead.
 */

import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import type { SadadResult } from "./sadad";

export type Text = { en: string; ar: string };
export type OrderLocale = "en" | "ar";

export type OrderLine = {
  slug: string;
  name: Text;
  size?: Text;
  qty: number;
  unitQar: number;
  lineQar: number;
};

export type ShopDetails = {
  fulfilment: "delivery" | "pickup";
  /** Area key from QATAR_AREAS, "other", or "" for pickup. */
  areaKey: string;
  area: Text;
  /** Building / street / zone or landmark, as typed. Delivery only. */
  address: string;
  lines: OrderLine[];
  subtotalQar: number;
  discount: { percent: number; amountQar: number } | null;
  deliveryFeeQar: number;
};

export type PpfDetails = {
  body: string;
  bodyLabel: Text;
  coverage: string;
  coverageLabel: Text;
  film: string;
  filmLabel: Text;
  parts: Text[];
  car: string;
  existingFilm: string;
  preferredDate: string;
  priceQar: number | null;
  isEstimate: boolean;
};

export type OrderStatus =
  /** Sent to SADAD, no final result yet. */
  | "awaiting_payment"
  | "paid"
  | "failed"
  /** PPF booking that will be paid at handover. */
  | "booked"
  /** SADAD reported success but something did not match — staff check the SADAD panel. */
  | "review";

export type PaymentEvent = {
  source: "callback" | "webhook";
  outcome: SadadResult["outcome"];
  transactionNumber: string;
  amountQar: number | null;
  sandbox: boolean;
  message: string;
  at: string;
};

export type Order = {
  v: 1;
  /** SADAD ORDER_ID: the customer reference plus a per-attempt suffix. */
  id: string;
  /** What the customer sees and quotes: ABK-XXXX (cart) or PPF-XXXXX (booking). */
  ref: string;
  kind: "shop" | "ppf";
  createdAt: string;
  locale: OrderLocale;
  pay: "online" | "handover";
  status: OrderStatus;
  totalQar: number;
  customer: { name: string; mobile: string; email: string };
  notes: string;
  shop?: ShopDetails;
  ppf?: PpfDetails;
  attribution: Record<string, string>;
  payment?: {
    transactionNumber: string;
    sandbox: boolean;
    paidAt: string;
    source: "callback" | "webhook";
  };
  events: PaymentEvent[];
  flags: string[];
  /**
   * When each email went out. shop/customer: the PAID staff alert and the
   * customer's receipt — each retried on its own until it has gone out.
   * booked/review: the staff alerts for a new booking and for a payment to
   * check, kept apart so they never count as the paid emails. claimedAt: when
   * a caller took on sending the paid emails; a later SADAD event retries
   * whatever is still missing 10 minutes after the claim (SMTP down, instance
   * died).
   */
  emails: {
    shop?: string;
    customer?: string;
    booked?: string;
    review?: string;
    error?: string;
    claimedAt?: string;
  };
};

/** How long a claim to send the paid emails stands before another event may retry. */
const EMAIL_CLAIM_MS = 10 * 60 * 1000;

/** Why a payment needs a person to look at it. */
export type ReviewReason = "amount_mismatch" | "paid_twice" | "test_payment";

/** A paid order still owes the staff alert, or the receipt when the customer gave an email. */
export function paidEmailsMissing(o: Order): boolean {
  return o.status === "paid" && (!o.emails.shop || (Boolean(o.customer.email) && !o.emails.customer));
}

/**
 * The live site only takes live payments: a sandbox result there means a
 * test key reached production, and must never release goods.
 */
function isLiveSite(): boolean {
  return process.env.VERCEL_ENV === "production";
}

const ID_PATTERN = /^(ABK-[2-9A-HJKMNP-Z]{4}|PPF-[2-9A-HJKMNP-Z]{5})-[2-9A-HJKMNP-Z]{4}$/;

export function isOrderId(id: unknown): id is string {
  return typeof id === "string" && ID_PATTERN.test(id);
}

// Same alphabet as the cart and booking references (no 0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** `ABK-7K3M` → `ABK-7K3M-Q2ZD`: unique per payment attempt, as SADAD requires. */
export function newOrderId(ref: string): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  return `${ref}-${suffix}`;
}

function prefix(): string {
  if (process.env.VERCEL_ENV === "production") return "orders/";
  if (process.env.VERCEL_ENV === "preview") return "preview/orders/";
  return "dev/orders/";
}

function pathFor(id: string): string {
  return `${prefix()}${id}.json`;
}

// ── storage backend ──────────────────────────────────────────────────────

const memory = new Map<string, { body: string; etag: string }>();
let memoryEtag = 0;

function inMemoryMode(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.VERCEL) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set — connect the abk-orders Blob store to this project");
  }
  return true;
}

class EtagMismatch extends Error {}

async function readRaw(path: string): Promise<{ body: string; etag: string } | null> {
  if (inMemoryMode()) return memory.get(path) ?? null;
  const res = await get(path, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  // A compressed response carries a weak ETag (W/"…"), which a conditional
  // write never matches; the quoted value is the blob's own (strong) ETag.
  // Seen 2026-11-19: every update of a ~1 KB order failed without this.
  const etag = res.blob.etag.startsWith("W/") ? res.blob.etag.slice(2) : res.blob.etag;
  return { body: await new Response(res.stream).text(), etag };
}

async function writeRaw(path: string, body: string, ifMatch: string | null): Promise<void> {
  if (inMemoryMode()) {
    const current = memory.get(path);
    if (ifMatch === null ? current : current?.etag !== ifMatch) throw new EtagMismatch();
    memoryEtag += 1;
    memory.set(path, { body, etag: `m${memoryEtag}` });
    return;
  }
  try {
    await put(path, body, {
      access: "private",
      contentType: "application/json; charset=utf-8",
      addRandomSuffix: false,
      cacheControlMaxAge: 60,
      ...(ifMatch === null ? { allowOverwrite: false } : { allowOverwrite: true, ifMatch }),
    });
  } catch (err) {
    if (err instanceof BlobPreconditionFailedError) throw new EtagMismatch();
    throw err;
  }
}

// ── public API ───────────────────────────────────────────────────────────

/** Stores a new order; throws if the store is unavailable or the id is taken. */
export async function createOrder(order: Order): Promise<void> {
  await writeRaw(pathFor(order.id), JSON.stringify(order), null);
}

export async function readOrder(id: string): Promise<{ order: Order; etag: string } | null> {
  if (!isOrderId(id)) return null;
  const raw = await readRaw(pathFor(id));
  if (!raw) return null;
  return { order: JSON.parse(raw.body) as Order, etag: raw.etag };
}

/**
 * Read-modify-write with retries. `change` returns the next order (or null
 * for "no change") plus whatever the caller needs to know; only the attempt
 * that actually wrote decides that answer.
 */
async function updateOrder<T>(
  id: string,
  change: (order: Order) => { next: Order | null; info: T },
): Promise<{ order: Order; changed: boolean; info: T } | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await readOrder(id);
    if (!current) return null;
    const { next, info } = change(structuredClone(current.order));
    if (!next) return { order: current.order, changed: false, info };
    try {
      await writeRaw(pathFor(id), JSON.stringify(next), current.etag);
      return { order: next, changed: true, info };
    } catch (err) {
      if (!(err instanceof EtagMismatch)) throw err;
    }
  }
  throw new Error(`order ${id}: too many concurrent updates`);
}

export type PaymentUpdate = {
  order: Order;
  /** True for exactly one caller: the one whose write turned the order paid. */
  newlyPaid: boolean;
  /**
   * Set when this result needs a person to look: the first report of a
   * transaction that parked the order in review or paid it a second time.
   * The same transaction arriving again by the other channel stays quiet.
   */
  review: ReviewReason | null;
  /**
   * This caller holds the claim to send the paid emails still missing: the
   * first time, or a retry because a claim older than 10 minutes never
   * produced them.
   */
  sendPaidEmails: boolean;
};

/**
 * Applies a verified SADAD result. Paid is final (a late "failed" can't undo
 * it); failed can still become paid, because SADAD settles in-progress
 * payments after midnight. A success whose amount differs from the order
 * total, or a sandbox success on the live site, is parked in "review"
 * instead of being treated as paid; a second successful transaction on a
 * paid order is reported so staff can refund it.
 */
export async function applyPaymentResult(
  result: SadadResult,
  source: PaymentEvent["source"],
): Promise<PaymentUpdate | null> {
  const now = new Date().toISOString();
  const nowMs = Date.parse(now);
  /** Paid emails still missing, and nobody holds a fresh claim to send them. */
  const emailsOwed = (o: Order) =>
    paidEmailsMissing(o) &&
    (!o.emails.claimedAt || nowMs - Date.parse(o.emails.claimedAt) > EMAIL_CLAIM_MS);
  const quiet: Omit<PaymentUpdate, "order"> = { newlyPaid: false, review: null, sendPaidEmails: false };

  const out = await updateOrder(result.orderId, (order) => {
    const duplicate = order.events.some(
      (e) =>
        e.source === source &&
        e.outcome === result.outcome &&
        e.transactionNumber === result.transactionNumber &&
        e.amountQar === result.amountQar,
    );
    if (duplicate) {
      // A repeated event changes nothing, but may still collect owed emails.
      if (!emailsOwed(order)) return { next: null, info: quiet };
      order.emails = { ...order.emails, claimedAt: now };
      return { next: order, info: { ...quiet, sendPaidEmails: true } };
    }

    // The same transaction, already reported by the other channel.
    const seenBefore = order.events.some(
      (e) => e.outcome === result.outcome && e.transactionNumber === result.transactionNumber,
    );
    order.events = [
      ...order.events,
      {
        source,
        outcome: result.outcome,
        transactionNumber: result.transactionNumber,
        amountQar: result.amountQar,
        sandbox: result.sandbox,
        message: result.message,
        at: now,
      },
    ].slice(-20);

    const raise = (reason: ReviewReason): ReviewReason | null => {
      if (!order.flags.includes(reason)) order.flags.push(reason);
      return seenBefore ? null : reason;
    };
    let newlyPaid = false;
    let review: ReviewReason | null = null;
    if (result.outcome === "paid" && order.status === "paid") {
      const first = order.payment?.transactionNumber;
      if (first && result.transactionNumber && result.transactionNumber !== first) review = raise("paid_twice");
    } else if (result.outcome === "paid") {
      const amountMatches =
        result.amountQar !== null && Math.abs(result.amountQar - order.totalQar) < 0.01;
      if (result.sandbox && isLiveSite()) {
        order.status = "review";
        review = raise("test_payment");
      } else if (amountMatches) {
        order.status = "paid";
        order.payment = {
          transactionNumber: result.transactionNumber,
          sandbox: result.sandbox,
          paidAt: now,
          source,
        };
        newlyPaid = true;
      } else {
        order.status = "review";
        review = raise("amount_mismatch");
      }
    } else if (result.outcome === "failed" && order.status === "awaiting_payment") {
      order.status = "failed";
    }
    let sendPaidEmails = false;
    if (emailsOwed(order)) {
      order.emails = { ...order.emails, claimedAt: now };
      sendPaidEmails = true;
    }
    return { next: order, info: { newlyPaid, review, sendPaidEmails } };
  });
  return out ? { order: out.order, ...out.info } : null;
}

/** Records which emails went out (or why they didn't). */
export async function recordEmails(
  id: string,
  emails: Order["emails"],
): Promise<void> {
  await updateOrder(id, (order) => ({
    next: { ...order, emails: { ...order.emails, ...emails } },
    info: null,
  }));
}
