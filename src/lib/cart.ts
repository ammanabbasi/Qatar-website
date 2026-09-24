"use client";

import { useSyncExternalStore } from "react";
import type { Audience } from "./whatsapp";
import type { Fulfilment } from "./pricing";

/**
 * Retail cart + wholesale quote tray — one store per audience.
 *
 * The old single `abk_order_tray` key served both audiences, so a retail
 * basket surfaced on /b2b pages and went out as a "wholesale quote". Each
 * audience now has its own key, and a legacy tray is split into them once.
 *
 * Lines persist ONLY `{ slug, qty }`. Names, prices and images resolve from
 * the catalogue at render time, so switching EN↔AR or editing a price in
 * `products.ts` reaches carts that were saved earlier; lines whose product no
 * longer exists are pruned by the CartProvider.
 *
 * localStorage is the source of truth, read through useSyncExternalStore and
 * synced across tabs by the `storage` event. When storage is blocked (some
 * private modes, disabled site data) the cart falls back to memory for the
 * life of the tab and `storageAvailable` lets the UI say so.
 */

export type CartLine = { slug: string; qty: number };

export type CartState = {
  lines: CartLine[];
  /** Order reference shown to the shopper and sent in the WhatsApp message. */
  ref: string | null;
  /** Epoch ms of the last WhatsApp hand-off. Any edit clears it. */
  sentAt: number | null;
};

export type CheckoutDetails = {
  fulfilment: Fulfilment;
  /** Key from `QATAR_AREAS`, `"other"`, or "" when not chosen yet. */
  area: string;
  areaOther: string;
  notes: string;
};

/** Wholesale quote tray fields — kept across closing the tray and page loads. */
export type QuoteDetails = {
  companyName: string;
  notes: string;
};

/** Retail bottles vs wholesale cartons/rolls — the tray never had a cap. */
export const MAX_QTY: Record<Audience, number> = { b2c: 99, b2b: 999 };
export const NOTES_MAX = 300;
export const AREA_OTHER_MAX = 80;
const COMPANY_MAX = 120;

/**
 * A sent order is treated as placed once this long has passed: the next add
 * starts a fresh order (new reference) instead of silently re-opening the old
 * one. Within the window, adding more is an update to the same order.
 */
const SENT_ORDER_TTL_MS = 12 * 60 * 60 * 1000;

const CART_KEYS: Record<Audience, string> = {
  b2c: "abk_cart_b2c",
  b2b: "abk_cart_b2b",
};
const CHECKOUT_KEY = "abk_checkout_b2c";
const QUOTE_KEY = "abk_quote_b2b";
const LEGACY_TRAY_KEY = "abk_order_tray";
const CHANGE_EVENT = "abk:cart-change";

const EMPTY_CART: CartState = { lines: [], ref: null, sentAt: null };
const DEFAULT_DETAILS: CheckoutDetails = {
  fulfilment: "delivery",
  area: "",
  areaOther: "",
  notes: "",
};
const DEFAULT_QUOTE: QuoteDetails = { companyName: "", notes: "" };

// ───── Storage, with an in-memory fallback ─────────────────────────────────

const memory = new Map<string, string>();
let storageAvailable = true;

function readRaw(key: string): string | null {
  // Once a write has failed, memory holds the only current copy.
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    storageAvailable = false;
    return null;
  }
}

function writeRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    storageAvailable = false;
    memory.set(key, value);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// useSyncExternalStore needs a stable snapshot reference while the stored
// value is unchanged, so parsed values are cached against their raw string.
const snapshots = new Map<string, { raw: string | null; value: unknown }>();

function readParsed<T>(key: string, parse: (raw: string | null) => T): T {
  const raw = readRaw(key);
  const hit = snapshots.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  const value = parse(raw);
  snapshots.set(key, { raw, value });
  return value;
}

function clampQty(qty: number, audience: Audience): number {
  return Math.min(MAX_QTY[audience], Math.max(1, Math.floor(qty)));
}

function parseCart(raw: string | null, audience: Audience): CartState {
  if (!raw) return EMPTY_CART;
  try {
    const data = JSON.parse(raw) as Partial<CartState> | null;
    const lines: CartLine[] = [];
    if (data && Array.isArray(data.lines)) {
      for (const l of data.lines as unknown[]) {
        const line = l as Partial<CartLine> | null;
        if (
          line &&
          typeof line.slug === "string" &&
          typeof line.qty === "number" &&
          line.qty > 0 &&
          !lines.some((x) => x.slug === line.slug)
        ) {
          lines.push({ slug: line.slug, qty: clampQty(line.qty, audience) });
        }
      }
    }
    return {
      lines,
      ref: typeof data?.ref === "string" ? data.ref : null,
      sentAt: typeof data?.sentAt === "number" ? data.sentAt : null,
    };
  } catch {
    return EMPTY_CART;
  }
}

function parseDetails(raw: string | null): CheckoutDetails {
  if (!raw) return DEFAULT_DETAILS;
  try {
    const d = JSON.parse(raw) as Partial<CheckoutDetails> | null;
    return {
      fulfilment: d?.fulfilment === "pickup" ? "pickup" : "delivery",
      area: typeof d?.area === "string" ? d.area : "",
      areaOther:
        typeof d?.areaOther === "string" ? d.areaOther.slice(0, AREA_OTHER_MAX) : "",
      notes: typeof d?.notes === "string" ? d.notes.slice(0, NOTES_MAX) : "",
    };
  } catch {
    return DEFAULT_DETAILS;
  }
}

function parseQuote(raw: string | null): QuoteDetails {
  if (!raw) return DEFAULT_QUOTE;
  try {
    const d = JSON.parse(raw) as Partial<QuoteDetails> | null;
    return {
      companyName:
        typeof d?.companyName === "string" ? d.companyName.slice(0, COMPANY_MAX) : "",
      notes: typeof d?.notes === "string" ? d.notes.slice(0, NOTES_MAX) : "",
    };
  } catch {
    return DEFAULT_QUOTE;
  }
}

// ───── Reads ────────────────────────────────────────────────────────────────

export function getCart(audience: Audience): CartState {
  if (typeof window === "undefined") return EMPTY_CART;
  return readParsed(CART_KEYS[audience], (raw) => parseCart(raw, audience));
}

export function getCheckoutDetails(): CheckoutDetails {
  if (typeof window === "undefined") return DEFAULT_DETAILS;
  return readParsed(CHECKOUT_KEY, parseDetails);
}

export function getQuoteDetails(): QuoteDetails {
  if (typeof window === "undefined") return DEFAULT_QUOTE;
  return readParsed(QUOTE_KEY, parseQuote);
}

export function isCartStorageAvailable(): boolean {
  return storageAvailable;
}

function isStaleSent(cart: CartState): boolean {
  return cart.sentAt !== null && Date.now() - cart.sentAt > SENT_ORDER_TTL_MS;
}

// ───── Order reference ─────────────────────────────────────────────────────

// No 0/O or 1/I/L — the reference gets read aloud and retyped on WhatsApp.
const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function makeOrderRef(): string {
  const bytes = new Uint8Array(4);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let code = "";
  for (const b of bytes) code += REF_ALPHABET[b % REF_ALPHABET.length];
  return `ABK-${code}`;
}

// ───── Writes (call from event handlers or effects, never during render) ────

function saveCart(audience: Audience, next: CartState) {
  writeRaw(CART_KEYS[audience], JSON.stringify(next));
}

/**
 * Every edit re-opens a sent order (the next send is an update to it) and
 * keeps its reference. Emptying the cart ends the order, so the next first
 * item starts a fresh reference — unless Undo hands the old one back.
 */
function editLines(audience: Audience, lines: CartLine[], preferredRef?: string | null) {
  const current = getCart(audience);
  saveCart(audience, {
    lines,
    ref: lines.length === 0 ? null : (current.ref ?? preferredRef ?? makeOrderRef()),
    sentAt: null,
  });
}

/** Adds `qty` and returns how many were actually added (0 when already at the cap). */
export function addToCart(audience: Audience, slug: string, qty = 1): number {
  let current = getCart(audience);
  if (isStaleSent(current)) {
    // The shopper sent this order long ago — treat it as placed.
    startFresh(audience);
    current = getCart(audience);
  }
  const { lines } = current;
  const index = lines.findIndex((l) => l.slug === slug);
  const before = index >= 0 ? lines[index].qty : 0;
  const after = clampQty(before + qty, audience);
  if (after === before) return 0;
  editLines(
    audience,
    index >= 0
      ? lines.map((l, i) => (i === index ? { slug, qty: after } : l))
      : [...lines, { slug, qty: after }],
  );
  return after - before;
}

export function setLineQty(audience: Audience, slug: string, qty: number) {
  const { lines } = getCart(audience);
  if (!lines.some((l) => l.slug === slug)) return;
  editLines(
    audience,
    lines.map((l) => (l.slug === slug ? { slug, qty: clampQty(qty, audience) } : l)),
  );
}

export type RemovedLine = { line: CartLine; index: number; ref: string | null };

/** Removes a line and returns what Undo needs to put it back. */
export function removeLine(audience: Audience, slug: string): RemovedLine | null {
  const { lines, ref } = getCart(audience);
  const index = lines.findIndex((l) => l.slug === slug);
  if (index < 0) return null;
  editLines(
    audience,
    lines.filter((_, i) => i !== index),
  );
  return { line: lines[index], index, ref };
}

/** Puts a removed line back at its old position; false when there was nothing to do. */
export function restoreLine(audience: Audience, removed: RemovedLine): boolean {
  const { lines } = getCart(audience);
  if (lines.some((l) => l.slug === removed.line.slug)) return false;
  const next = [...lines];
  next.splice(Math.min(Math.max(removed.index, 0), next.length), 0, removed.line);
  editLines(audience, next, removed.ref);
  return true;
}

/** Drops lines whose product no longer exists (renamed or removed slugs). */
export function pruneUnknownLines(audience: Audience, known: (slug: string) => boolean) {
  const { lines } = getCart(audience);
  const kept = lines.filter((l) => known(l.slug));
  if (kept.length !== lines.length) editLines(audience, kept);
}

export function clearCart(audience: Audience) {
  saveCart(audience, EMPTY_CART);
}

/** Empty cart and fresh reference, with the order-specific notes cleared. */
function startFresh(audience: Audience) {
  clearCart(audience);
  if (audience === "b2c") updateCheckoutDetails({ notes: "" });
  else updateQuoteDetails({ notes: "" });
}

/** Retail "Start a new order". */
export function startNewOrder() {
  startFresh("b2c");
}

/** Wholesale "Clear Tray": lines and notes go, the company name stays. */
export function clearQuoteTray() {
  startFresh("b2b");
}

export function markCartSent(audience: Audience) {
  const cart = getCart(audience);
  if (cart.lines.length === 0) return;
  saveCart(audience, { ...cart, sentAt: Date.now() });
}

export function reopenCart(audience: Audience) {
  const cart = getCart(audience);
  if (cart.sentAt === null) return;
  saveCart(audience, { ...cart, sentAt: null });
}

export function updateCheckoutDetails(patch: Partial<CheckoutDetails>) {
  writeRaw(CHECKOUT_KEY, JSON.stringify({ ...getCheckoutDetails(), ...patch }));
}

export function updateQuoteDetails(patch: Partial<QuoteDetails>) {
  writeRaw(QUOTE_KEY, JSON.stringify({ ...getQuoteDetails(), ...patch }));
}

// ───── Once per page load: legacy migration + expiring sent orders ─────────

let housekept = false;

function housekeeping() {
  if (housekept) return;
  housekept = true;
  migrateLegacyTray();
  for (const audience of ["b2c", "b2b"] as const) {
    if (isStaleSent(getCart(audience))) startFresh(audience);
  }
}

/** Splits the pre-2026-09-24 shared tray into the per-audience carts. */
function migrateLegacyTray() {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(LEGACY_TRAY_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  try {
    const items: unknown = JSON.parse(raw);
    if (Array.isArray(items)) {
      for (const entry of items) {
        const item = entry as { slug?: unknown; quantity?: unknown; audience?: unknown } | null;
        if (
          item &&
          (item.audience === "b2c" || item.audience === "b2b") &&
          typeof item.slug === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
        ) {
          addToCart(item.audience, item.slug, item.quantity);
        }
      }
    }
  } catch {
    // Unreadable legacy data is dropped rather than blocking the new cart.
  }
  try {
    window.localStorage.removeItem(LEGACY_TRAY_KEY);
  } catch {
    // Nothing more to do; the housekeeping flag stops a retry this session.
  }
}

// ───── React bindings ──────────────────────────────────────────────────────

function subscribe(onChange: () => void) {
  // Runs after hydration, so housekeeping writes never happen during render.
  housekeeping();
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const noopSubscribe = () => () => {};

/** False on the server and during hydration — distinguishes "empty" from "not loaded yet". */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useCart(audience: Audience) {
  const cart = useSyncExternalStore(
    subscribe,
    () => getCart(audience),
    () => EMPTY_CART,
  );
  const hydrated = useHydrated();
  return {
    ...cart,
    hydrated,
    storageAvailable: hydrated ? isCartStorageAvailable() : true,
  };
}

export function useCheckoutDetails(): CheckoutDetails {
  return useSyncExternalStore(subscribe, getCheckoutDetails, () => DEFAULT_DETAILS);
}

export function useQuoteDetails(): QuoteDetails {
  return useSyncExternalStore(subscribe, getQuoteDetails, () => DEFAULT_QUOTE);
}
