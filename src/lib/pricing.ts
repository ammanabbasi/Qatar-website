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

/**
 * Owner-set order discount (2026-10-21): 10% off once the priced subtotal
 * reaches QAR 500, 15% off from QAR 700. Retail cart only — wholesale is
 * quoted on WhatsApp. Taken off the goods, never the delivery fee (any order
 * that qualifies already has free delivery). Highest tier first. Change the
 * numbers here — nowhere else.
 */
export const DISCOUNT_TIERS = [
  { minSubtotalQar: 700, percent: 15 },
  { minSubtotalQar: 500, percent: 10 },
] as const;

/** Lowest and highest tiers — for copy that states the offer. */
export const DISCOUNT_ENTRY = DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1];
export const DISCOUNT_TOP = DISCOUNT_TIERS[0];

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

/** "10%" / "١٠٪" — Intl's Arabic percent style appends an ALM mark, so build it. */
export function formatPercent(percent: number, locale: PriceLocale): string {
  return `${formatNumber(percent, locale)}${locale === "ar" ? "٪" : "%"}`;
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

export type DiscountQuote = {
  percent: number;
  minSubtotalQar: number;
  /** Rounded to the dirham (two decimals). */
  amountQar: number;
};

/**
 * Discount earned by the priced subtotal. Unpriced and "from"-priced lines can
 * only raise the subtotal once staff confirm them, so this is a floor: the
 * order never ends up with less discount than the cart shows.
 */
export function quoteDiscount(totals: Pick<CartTotals, "pricedSubtotal">): DiscountQuote | null {
  const tier = DISCOUNT_TIERS.find((t) => totals.pricedSubtotal >= t.minSubtotalQar);
  if (!tier) return null;
  return {
    percent: tier.percent,
    minSubtotalQar: tier.minSubtotalQar,
    amountQar: Math.round(totals.pricedSubtotal * tier.percent) / 100,
  };
}

/** The next tier above the current subtotal, and how far away it is. */
export function nextDiscountTier(
  totals: Pick<CartTotals, "pricedSubtotal">,
): { percent: number; minSubtotalQar: number; remainingQar: number } | null {
  const above = DISCOUNT_TIERS.filter((t) => totals.pricedSubtotal < t.minSubtotalQar);
  const next = above[above.length - 1];
  if (!next) return null;
  return {
    percent: next.percent,
    minSubtotalQar: next.minSubtotalQar,
    remainingQar: next.minSubtotalQar - totals.pricedSubtotal,
  };
}

/** Discount amount, or 0 — for totals that subtract it. */
export function discountAmount(totals: Pick<CartTotals, "pricedSubtotal">): number {
  return quoteDiscount(totals)?.amountQar ?? 0;
}
