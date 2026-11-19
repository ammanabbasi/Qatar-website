/**
 * POST /api/checkout — starts an online payment for the retail cart.
 *
 * Re-prices the cart on the server, stores the order (status
 * "awaiting_payment") and answers with the signed SADAD form the browser
 * then posts to SADAD's hosted payment page. The secret key never leaves the
 * server. Nothing is emailed yet: staff hear about an order once SADAD
 * confirms the payment (callback/webhook routes under /api/payments/sadad).
 */

import { AREA_OTHER, findArea } from "@/data/qatarAreas";
import { callbackOrigin, sadadConfig } from "@/lib/payments/config";
import { createOrder, newOrderId, type Order } from "@/lib/payments/orders";
import { buildSadadCheckoutForm, sadadTxnDate } from "@/lib/payments/sadad";
import { priceShopCart } from "@/lib/payments/shop";
import { isEmail, normaliseQatarMobile, sadadMobile, str } from "@/lib/payments/validate";

export const maxDuration = 20;

const CART_REF = /^ABK-[2-9A-HJKMNP-Z]{4}$/;

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** The cart normally sends its own ABK-XXXX reference; this covers a missing one. */
function newCartRef(): string {
  return newOrderId("ABK");
}

export async function POST(request: Request) {
  const config = sadadConfig();
  if (!config) return json(503, { ok: false, error: "payments_unavailable" });

  let f: Record<string, unknown>;
  try {
    f = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: "bad_request" });
  }
  // Honeypot: a filled hidden field means a bot. No order, no payment form.
  if (str(f.website, 200)) return json(400, { ok: false, error: "bad_request" });

  const locale = f.locale === "ar" ? "ar" : "en";
  const fulfilment = f.fulfilment === "pickup" ? "pickup" : "delivery";
  const name = str(f.name, 80);
  const mobile = normaliseQatarMobile(str(f.mobile, 30));
  const email = str(f.email, 120);
  const notes = str(f.notes, 300);
  const areaKey = fulfilment === "delivery" ? str(f.area, 40) : "";
  const areaOther = str(f.areaOther, 80);
  const address = fulfilment === "delivery" ? str(f.address, 200) : "";
  const knownArea = findArea(areaKey);

  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!mobile) errors.push("mobile");
  if (!isEmail(email)) errors.push("email");
  if (fulfilment === "delivery") {
    if (!knownArea && !(areaKey === AREA_OTHER && areaOther)) errors.push("area");
    if (address.length < 4) errors.push("address");
  }
  if (errors.length > 0) return json(422, { ok: false, error: "invalid_fields", fields: errors });

  const priced = priceShopCart(f.lines, fulfilment);
  if (!priced.ok) return json(409, { ok: false, error: priced.error });

  // The page priced the cart from the catalogue it was built with. If a
  // deploy changed a price since, say so instead of charging a surprise.
  const expected = Number(f.expectedTotalQar);
  if (Number.isFinite(expected) && Math.abs(expected - priced.totalQar) >= 0.01) {
    return json(409, { ok: false, error: "total_changed", totalQar: priced.totalQar });
  }

  const ref = typeof f.ref === "string" && CART_REF.test(f.ref) ? f.ref : newCartRef();
  const id = newOrderId(ref);
  const area =
    fulfilment === "pickup"
      ? { en: "", ar: "" }
      : knownArea
        ? knownArea.name
        : { en: areaOther, ar: areaOther };

  const order: Order = {
    v: 1,
    id,
    ref,
    kind: "shop",
    createdAt: new Date().toISOString(),
    locale,
    pay: "online",
    status: "awaiting_payment",
    totalQar: priced.totalQar,
    customer: { name, mobile: mobile!, email },
    notes,
    shop: {
      fulfilment,
      areaKey: fulfilment === "delivery" ? areaKey : "",
      area,
      address,
      lines: priced.lines,
      subtotalQar: priced.subtotalQar,
      discount: priced.discount,
      deliveryFeeQar: priced.deliveryFeeQar,
    },
    attribution: {
      gclid: str(f.gclid, 200),
      gbraid: str(f.gbraid, 200),
      wbraid: str(f.wbraid, 200),
      utmSource: str(f.utmSource, 60),
      utmMedium: str(f.utmMedium, 60),
      utmCampaign: str(f.utmCampaign, 60),
    },
    events: [],
    flags: [],
    emails: {},
  };

  try {
    await createOrder(order);
  } catch (err) {
    console.error(`[checkout] could not store order ${id}: ${err instanceof Error ? err.message : err}`);
    return json(503, { ok: false, error: "store_unavailable" });
  }

  const sadad = buildSadadCheckoutForm({
    merchantId: config.merchantId,
    secretKey: config.secretKey,
    website: config.website,
    orderId: id,
    amountQar: priced.totalQar,
    callbackUrl: `${callbackOrigin(request)}/api/payments/sadad/callback`,
    email,
    mobile: sadadMobile(mobile!),
    txnDate: sadadTxnDate(),
    language: locale === "ar" ? "ARB" : "ENG",
    itemName: `ABK order ${ref}`,
  });

  console.info(`[checkout] ${id} created: QAR ${priced.totalQar.toFixed(2)}, ${priced.lines.length} line(s), ${fulfilment}`);
  return json(200, { ok: true, orderId: id, ref, totalQar: priced.totalQar, sadad });
}
