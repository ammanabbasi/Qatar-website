/**
 * Retail pricing rules — pure functions, safe on server and client.
 *
 * Only 12 retail products carry a QAR price; the rest are "price on request"
 * and are quoted by staff on WhatsApp. Every total below therefore counts
 * PRICED lines only, and says so wherever it is shown.
 */

import type { CartCatalogue, CartProduct } from "@/data/cartCatalogue";

/**
 * Owner-confirmed delivery terms (2026-09-24): free delivery once the priced
 * subtotal reaches QAR 200, otherwise a flat QAR 25. Pickup at the Mesaimeer
 * showroom is always free. Change the numbers here — nowhere else.
 */
export const DELIVERY = {
  freeThresholdQar: 200,
  feeQar: 25,
} as const;

export type PriceLocale = "en" | "ar";

/**
 * QAR amount in the exact style of the catalogue's `price` strings
 * (`QAR 45` / `٤٥ ر.ق`). Intl's own `ar-QA` currency style adds RLM marks and
 * a trailing dot ("‏٤٥ ر.ق.‏"), so only the number part comes from Intl.
 */
export function formatQar(amount: number, locale: PriceLocale): string {
  return locale === "ar"
    ? `${formatNumber(amount, "ar")} ر.ق`
    : `QAR ${formatNumber(amount, "en")}`;
}

/** Plain number — Arabic-Indic digits for Arabic, matching the price strings. */
export function formatNumber(value: number, locale: PriceLocale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-QA-u-nu-arab" : "en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export type ResolvedLine = {
  slug: string;
  qty: number;
  product: CartProduct;
};

/**
 * Own-property lookup: slugs can come from localStorage, and a plain object
 * would otherwise "find" inherited keys such as `constructor`.
 */
export function findProduct(catalogue: CartCatalogue, slug: string): CartProduct | undefined {
  return Object.prototype.hasOwnProperty.call(catalogue, slug) ? catalogue[slug] : undefined;
}

/** Attach catalogue data to stored lines; lines for removed products are dropped. */
export function resolveCartLines(
  lines: ReadonlyArray<{ slug: string; qty: number }>,
  catalogue: CartCatalogue,
): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const line of lines) {
    const product = findProduct(catalogue, line.slug);
    if (product) out.push({ slug: line.slug, qty: line.qty, product });
  }
  return out;
}

export type CartTotals = {
  /** Sum of priced lines only. */
  pricedSubtotal: number;
  /** Number of LINES (products) with a price. */
  pricedLines: number;
  /** Priced lines whose price is only a starting price ("From QAR 50"). */
  fromPricedLines: number;
  /** Number of LINES (products) quoted on WhatsApp. */
  unpricedLines: number;
  /** Total units across all lines — what the header badge shows. */
  units: number;
};

/**
 * True when the catalogue shows a starting price ("From QAR 50") rather than
 * the price itself — a multi-size product whose size staff confirm on
 * WhatsApp. Its `priceQar` is the smallest size's price.
 */
export function isFromPrice(product: CartProduct): boolean {
  return (
    product.priceQar !== undefined &&
    product.priceLabel !== undefined &&
    product.priceLabel.en !== formatQar(product.priceQar, "en")
  );
}

/** Unit price as the catalogue words it: "QAR 45", or "From QAR 50". */
export function unitPriceLabel(product: CartProduct, locale: PriceLocale): string | undefined {
  if (product.priceQar === undefined) return undefined;
  return isFromPrice(product) ? product.priceLabel![locale] : formatQar(product.priceQar, locale);
}

export function cartTotals(lines: ReadonlyArray<ResolvedLine>): CartTotals {
  let pricedSubtotal = 0;
  let pricedLines = 0;
  let fromPricedLines = 0;
  let unpricedLines = 0;
  let units = 0;
  for (const { qty, product } of lines) {
    units += qty;
    if (product.priceQar !== undefined) {
      pricedSubtotal += product.priceQar * qty;
      pricedLines += 1;
      if (isFromPrice(product)) fromPricedLines += 1;
    } else {
      unpricedLines += 1;
    }
  }
  return { pricedSubtotal, pricedLines, fromPricedLines, unpricedLines, units };
}

export type Fulfilment = "delivery" | "pickup";

export type DeliveryQuote =
  | { kind: "pickup" }
  | { kind: "free" }
  /** Priced subtotal is under the threshold and every line is priced. */
  | { kind: "fee"; feeQar: number; remainingQar: number }
  /**
   * Under the threshold, but some lines are unpriced or only "from"-priced —
   * once staff confirm them the order may qualify, so the fee is provisional.
   */
  | { kind: "provisional"; feeQar: number; remainingQar: number };

export function quoteDelivery(
  totals: CartTotals,
  fulfilment: Fulfilment,
): DeliveryQuote {
  if (fulfilment === "pickup") return { kind: "pickup" };
  if (totals.pricedSubtotal >= DELIVERY.freeThresholdQar) return { kind: "free" };
  const remainingQar = DELIVERY.freeThresholdQar - totals.pricedSubtotal;
  return totals.unpricedLines > 0 || totals.fromPricedLines > 0
    ? { kind: "provisional", feeQar: DELIVERY.feeQar, remainingQar }
    : { kind: "fee", feeQar: DELIVERY.feeQar, remainingQar };
}

/**
 * Fee to include in an on-screen estimate. A provisional fee is counted too —
 * overstating by QAR 25 is kinder than a total that later grows.
 */
export function estimatedFee(quote: DeliveryQuote): number {
  return quote.kind === "fee" || quote.kind === "provisional" ? quote.feeQar : 0;
}
