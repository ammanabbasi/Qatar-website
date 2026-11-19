/**
 * Server-side pricing of a retail cart for online payment.
 *
 * The browser only sends `{ slug, qty }` lines; every price, the discount and
 * the delivery fee are recomputed here from the same catalogue and the same
 * pricing rules (src/lib/pricing.ts) the cart page shows, so a tampered
 * request can't change what SADAD charges.
 *
 * Online payment needs a firm total, so a cart is payable only when every
 * line has a price. Carts with a price-on-request item keep the WhatsApp
 * order, where staff price it.
 */

import { getCartCatalogue } from "@/data/cartCatalogue";
import { cartTotals, findProduct, quoteDelivery, quoteDiscount, resolveCartLines } from "@/lib/pricing";
import type { Fulfilment } from "@/lib/pricing";
import type { OrderLine } from "./orders";
import { round2 } from "./validate";

export const MAX_LINES = 40;
export const MAX_QTY = 99;

export type PricedCart =
  | {
      ok: true;
      lines: OrderLine[];
      subtotalQar: number;
      discount: { percent: number; amountQar: number } | null;
      deliveryFeeQar: number;
      totalQar: number;
    }
  | { ok: false; error: "empty" | "too_many_items" | "invalid_line" | "unknown_item" | "unpriced" };

export function priceShopCart(input: unknown, fulfilment: Fulfilment): PricedCart {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: "empty" };
  if (input.length > MAX_LINES) return { ok: false, error: "too_many_items" };

  const catalogue = getCartCatalogue();
  const wanted: { slug: string; qty: number }[] = [];
  for (const raw of input) {
    const line = raw as { slug?: unknown; qty?: unknown } | null;
    const slug = line && typeof line.slug === "string" ? line.slug : "";
    const qty = line ? Number(line.qty) : NaN;
    if (!slug || slug.length > 120 || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false, error: "invalid_line" };
    }
    if (wanted.some((w) => w.slug === slug)) return { ok: false, error: "invalid_line" };
    const product = findProduct(catalogue, slug);
    if (!product || product.audience === "b2b") return { ok: false, error: "unknown_item" };
    wanted.push({ slug, qty });
  }

  const resolved = resolveCartLines(wanted, catalogue);
  const totals = cartTotals(resolved);
  if (totals.unpricedLines > 0 || totals.fromPricedLines > 0) return { ok: false, error: "unpriced" };

  const discount = quoteDiscount(totals);
  const delivery = quoteDelivery(totals, fulfilment);
  // Every line is priced, so delivery is pickup, free or a firm fee — never provisional.
  const deliveryFeeQar = delivery.kind === "fee" ? delivery.feeQar : 0;
  const subtotalQar = round2(totals.pricedSubtotal);
  const totalQar = round2(subtotalQar - (discount?.amountQar ?? 0) + deliveryFeeQar);

  return {
    ok: true,
    lines: resolved.map((l) => ({
      slug: l.slug,
      name: l.product.name,
      ...(l.product.variantSize ? { size: l.product.variantSize } : {}),
      qty: l.qty,
      unitQar: l.product.priceQar!,
      lineQar: round2(l.product.priceQar! * l.qty),
    })),
    subtotalQar,
    discount: discount ? { percent: discount.percent, amountQar: discount.amountQar } : null,
    deliveryFeeQar,
    totalQar,
  };
}
