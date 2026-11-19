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

import { BlobError, BlobPreconditionFailedError, get, list, put } from "@vercel/blob";
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
  /**
   * Ids of the latest writes (newest last): an update whose write landed but
   * whose reply was lost finds its own id here and keeps its answer, rather
   * than mistaking the stored change for someone else's.
   */
  writes?: string[];
};

/** How long a claim to send the paid emails stands before another event may retry. */
const EMAIL_CLAIM_MS = 10 * 60 * 1000;

/** Why a payment needs a person to look at it. */
export type ReviewReason = "amount_mismatch" | "paid_twice" | "test_payment" | "paid_other_attempt";

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

/** Unit tests only (in-memory store): the next write is stored but reports a lost race, as when its reply is lost. */
export const testHooks = { loseNextWriteReply: false };

function inMemoryMode(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.VERCEL) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set — connect the abk-orders Blob store to this project");
  }
  return true;
}

class EtagMismatch extends Error {}

/**
 * Two conditional writes reaching one blob at the same instant: the store
 * answers "The conditional request cannot succeed due to a conflicting
 * operation against this resource" (S3's ConditionalRequestConflict) instead
 * of an ETag mismatch, and @vercel/blob does not retry it. It is the same lost
 * race, so it is retried the same way. Seen 2026-11-19 with a callback and a
 * webhook for one payment written together: without this the customer was
 * sent to "checking your payment" and staff got a false "not recorded" alert.
 */
export function isWriteConflict(err: unknown): boolean {
  return err instanceof BlobError && /conflicting operation|conditional request cannot succeed/i.test(err.message);
}

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
  // An empty ETag would be dropped by the SDK, turning the conditional write
  // into a blind overwrite (last writer wins, a paid status could be lost).
  if (ifMatch !== null && !ifMatch) throw new Error(`order store returned no ETag for ${path}`);
  if (inMemoryMode()) {
    const current = memory.get(path);
    if (ifMatch === null ? current : current?.etag !== ifMatch) throw new EtagMismatch();
    memoryEtag += 1;
    memory.set(path, { body, etag: `m${memoryEtag}` });
    if (testHooks.loseNextWriteReply) {
      testHooks.loseNextWriteReply = false;
      throw new EtagMismatch();
    }
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
    if (err instanceof BlobPreconditionFailedError || isWriteConflict(err)) throw new EtagMismatch();
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

const UPDATE_ATTEMPTS = 8;

/**
 * Read-modify-write with retries. `change` returns the next order (or null
 * for "no change") plus whatever the caller needs to know; only the attempt
 * that actually wrote decides that answer. After a lost race the next attempt
 * waits a random, growing moment, so writers that collided don't collide again.
 */
async function updateOrder<T>(
  id: string,
  change: (order: Order) => { next: Order | null; info: T },
): Promise<{ order: Order; changed: boolean; info: T } | null> {
  // Writes this call attempted that answered "ETag mismatch". One of them may
  // still have landed: the SDK retries a PUT whose reply was lost, and the
  // retry then meets the ETag its own first try created.
  const tried: { write: string; info: T }[] = [];
  for (let attempt = 0; attempt < UPDATE_ATTEMPTS; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 25 + Math.random() * 100 * attempt));
    const current = await readOrder(id);
    if (!current) return null;
    const landed = tried.find((t) => current.order.writes?.includes(t.write));
    if (landed) return { order: current.order, changed: true, info: landed.info };
    const { next, info } = change(structuredClone(current.order));
    if (!next) return { order: current.order, changed: false, info };
    const write = newWriteId();
    next.writes = [...(current.order.writes ?? []), write].slice(-10);
    try {
      await writeRaw(pathFor(id), JSON.stringify(next), current.etag);
      return { order: next, changed: true, info };
    } catch (err) {
      if (!(err instanceof EtagMismatch)) throw err;
      tried.push({ write, info });
    }
  }
  throw new Error(`order ${id}: too many concurrent updates`);
}

function newWriteId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Every stored attempt (order id) of one cart or booking reference. */
async function attemptIds(ref: string): Promise<string[]> {
  const base = prefix();
  const start = `${base}${ref}-`;
  const toId = (path: string) => path.slice(base.length).replace(/\.json$/, "");
  if (inMemoryMode()) return [...memory.keys()].filter((k) => k.startsWith(start)).map(toId);
  const ids: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: start, cursor, limit: 100 });
    ids.push(...page.blobs.map((b) => toId(b.pathname)));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return ids.filter(isOrderId);
}

/** Paid, or parked for a payment check (money may have moved). */
const paidOrChecked = (o: Order) => o.status === "paid" || o.status === "review";

/**
 * Another attempt of the same cart, by the same customer mobile (a 4-character
 * reference alone can belong to two customers), that is paid or under a
 * payment check. Each retry of a payment gets its own order id, so a second
 * charge across attempts is only visible here.
 */
export async function findOtherPaidAttempt(ref: string, mobile: string, exceptId?: string): Promise<Order | null> {
  for (const id of await attemptIds(ref)) {
    if (id === exceptId) continue;
    const found = (await readOrder(id))?.order;
    if (found && found.customer.mobile === mobile && paidOrChecked(found)) return found;
  }
  return null;
}

const PPF_TWIN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * PPF bookings get a new reference on every submission, so a retried booking
 * is found by what it books instead: the same package (body, coverage, film)
 * for the same mobile, written in the last 7 days, paid or under a check.
 */
export async function findOtherPaidPpfBooking(order: Order): Promise<Order | null> {
  if (order.kind !== "ppf" || !order.ppf) return null;
  const { body, coverage, film } = order.ppf;
  for (const id of await recentIds("PPF-", Date.now() - PPF_TWIN_WINDOW_MS)) {
    if (id === order.id) continue;
    const o = (await readOrder(id))?.order;
    if (
      o?.kind === "ppf" &&
      o.customer.mobile === order.customer.mobile &&
      o.ppf?.body === body &&
      o.ppf.coverage === coverage &&
      o.ppf.film === film &&
      paidOrChecked(o)
    ) {
      return o;
    }
  }
  return null;
}

/** Ids of orders under a path start, last written at or after `sinceMs` (all of them in memory mode). */
async function recentIds(start: string, sinceMs: number): Promise<string[]> {
  const base = prefix();
  const from = `${base}${start}`;
  const toId = (path: string) => path.slice(base.length).replace(/\.json$/, "");
  if (inMemoryMode()) return [...memory.keys()].filter((k) => k.startsWith(from)).map(toId);
  const ids: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: from, cursor, limit: 1000 });
    for (const b of page.blobs) if (b.uploadedAt.getTime() >= sinceMs) ids.push(toId(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return ids.filter(isOrderId);
}

/** Adds a flag once; true only for the caller that added it. */
export async function flagOrder(id: string, flag: string): Promise<boolean> {
  const out = await updateOrder(id, (order) =>
    order.flags.includes(flag)
      ? { next: null, info: false }
      : { next: { ...order, flags: [...order.flags, flag] }, info: true },
  );
  return Boolean(out?.changed && out.info);
}

/** The order already holds this SADAD result: reported by either channel, or only by `from`. */
export function hasPaymentEvent(order: Order, result: SadadResult, from?: PaymentEvent["source"]): boolean {
  return order.events.some(
    (e) =>
      e.outcome === result.outcome &&
      e.transactionNumber === result.transactionNumber &&
      (!from || e.source === from),
  );
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
    const seenBefore = hasPaymentEvent(order, result);
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
