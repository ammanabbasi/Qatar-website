/**
 * Order records — one row per payment attempt in the Railway Postgres
 * database (DATABASE_URL), the JSON order in `data`. Moved from Vercel Blob on
 * 2026-11-19 after Vercel's Hobby plan suspended the Blob store for the month.
 *
 * The table is the site's only order database. Staff work from the emails
 * (src/lib/payments/email.ts) and SADAD's own transaction list; the rows are
 * the durable record behind both (Railway → abk-website → Postgres → Data).
 * Production uses table `abk_orders`, other Railway/Vercel environments
 * `abk_orders_preview` and local development `abk_orders_dev`, so test traffic
 * never mixes with real orders even against the same database.
 *
 * Updates are compare-and-swap on the row's `version`: the callback
 * (customer's browser) and the webhook (SADAD's server) can arrive together,
 * and exactly one of them sees an order turn paid — that one sends the emails.
 *
 * Without DATABASE_URL (unit tests, a fresh clone) records live in memory; on
 * a deployment a missing DATABASE_URL is an error instead.
 */

import { Pool } from "pg";
import { deployEnv, isDeployed } from "./config";
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
  return deployEnv() === "production";
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

// ── storage backend ──────────────────────────────────────────────────────

/** Production, every other deployment and local development each get their own table. */
function table(): string {
  const env = deployEnv();
  return env === "production" ? "abk_orders" : env === "preview" ? "abk_orders_preview" : "abk_orders_dev";
}

const memory = new Map<string, { body: string; etag: string }>();
let memoryEtag = 0;

/** Unit tests only (in-memory store): the next write is stored but reports a lost race, as when its reply is lost. */
export const testHooks = { loseNextWriteReply: false };

function inMemoryMode(): boolean {
  if (process.env.DATABASE_URL?.trim()) return false;
  if (isDeployed()) throw new Error("DATABASE_URL is not set: connect the Postgres database to this service");
  return true;
}

let pool: Pool | null = null;
let schema: Promise<void> | null = null;

/** The connection pool, with the table created on first use (idempotent). */
async function db(): Promise<Pool> {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL!.trim();
    // Railway's private network and a local database speak plain TCP; its
    // public proxy wants TLS with Railway's own certificate.
    const plain = /@[^/]*(\.railway\.internal|localhost|127\.0\.0\.1)(:\d+)?\//.test(connectionString);
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: plain ? false : { rejectUnauthorized: false },
    });
    pool.on("error", (err) => console.error(`[orders] database pool error: ${err.message}`));
  }
  schema ??= pool
    .query(
      `CREATE TABLE IF NOT EXISTS ${table()} (
         id text PRIMARY KEY,
         data jsonb NOT NULL,
         version integer NOT NULL DEFAULT 1,
         created_at timestamptz NOT NULL DEFAULT now(),
         updated_at timestamptz NOT NULL DEFAULT now()
       )`,
    )
    .then(
      () => undefined,
      (err: unknown) => {
        schema = null; // try again on the next call
        throw err;
      },
    );
  await schema;
  return pool;
}

class EtagMismatch extends Error {}

async function readRaw(id: string): Promise<{ body: string; etag: string } | null> {
  if (inMemoryMode()) return memory.get(id) ?? null;
  const { rows } = await (await db()).query<{ body: string; version: number }>(
    `SELECT data::text AS body, version FROM ${table()} WHERE id = $1`,
    [id],
  );
  return rows[0] ? { body: rows[0].body, etag: String(rows[0].version) } : null;
}

/** ifMatch null: create (refused if the id exists); otherwise update only that version. */
async function writeRaw(id: string, body: string, ifMatch: string | null): Promise<void> {
  if (ifMatch !== null && !ifMatch) throw new Error(`order store returned no version for ${id}`);
  if (inMemoryMode()) {
    const current = memory.get(id);
    if (ifMatch === null ? current : current?.etag !== ifMatch) throw new EtagMismatch();
    memoryEtag += 1;
    memory.set(id, { body, etag: `m${memoryEtag}` });
    if (testHooks.loseNextWriteReply) {
      testHooks.loseNextWriteReply = false;
      throw new EtagMismatch();
    }
    return;
  }
  const pg = await db();
  const res =
    ifMatch === null
      ? await pg.query(`INSERT INTO ${table()} (id, data) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO NOTHING`, [id, body])
      : await pg.query(
          `UPDATE ${table()} SET data = $2::jsonb, version = version + 1, updated_at = now() WHERE id = $1 AND version = $3`,
          [id, body, Number(ifMatch)],
        );
  if (res.rowCount !== 1) throw new EtagMismatch();
}

// ── public API ───────────────────────────────────────────────────────────

/** Stores a new order; throws if the store is unavailable or the id is taken. */
export async function createOrder(order: Order): Promise<void> {
  await writeRaw(order.id, JSON.stringify(order), null);
}

export async function readOrder(id: string): Promise<{ order: Order; etag: string } | null> {
  if (!isOrderId(id)) return null;
  const raw = await readRaw(id);
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
      await writeRaw(id, JSON.stringify(next), current.etag);
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

/** Ids starting with `start` (references use only A-Z, 2-9 and "-", so no LIKE wildcards). */
async function idsStartingWith(start: string, sinceMs = 0): Promise<string[]> {
  if (inMemoryMode()) return [...memory.keys()].filter((k) => k.startsWith(start));
  const { rows } = await (await db()).query<{ id: string }>(
    `SELECT id FROM ${table()} WHERE id LIKE $1 AND updated_at >= $2 ORDER BY created_at`,
    [`${start}%`, new Date(sinceMs)],
  );
  return rows.map((r) => r.id).filter(isOrderId);
}

/** Every stored attempt (order id) of one cart or booking reference. */
function attemptIds(ref: string): Promise<string[]> {
  return idsStartingWith(`${ref}-`);
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

/** Ids of orders starting with `start`, last written at or after `sinceMs` (all of them in memory mode). */
function recentIds(start: string, sinceMs: number): Promise<string[]> {
  return idsStartingWith(start, sinceMs);
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
