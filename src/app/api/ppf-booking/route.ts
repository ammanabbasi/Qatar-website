/**
 * POST /api/ppf-booking — saves an installed-PPF booking and, when the
 * customer chose to pay now, starts the SADAD payment for it.
 *
 * Every booking is stored in the abk-orders Blob store and emailed to staff
 * (src/lib/payments/email.ts). Paying online is offered for fixed-price
 * packages only — custom-panel jobs and custom-vehicle offers are estimates,
 * so those are always paid at handover. If online payment can't start (not
 * configured, store down) the booking is still saved as pay-at-handover and
 * the reply says so, so a booking is never lost to a payment problem.
 *
 * The owner's Google Sheet (PPF_BOOKING_WEBHOOK_URL, Apps Script web app) is
 * still written when configured; PPF_BOOKING_WEBHOOK_SECRET is optional
 * hardening. If neither the store nor the Sheet takes the booking, the full
 * booking is logged on one "UNSAVED PPF BOOKING" line and the customer is
 * offered the WhatsApp hand-off with a reference.
 */

import { after } from "next/server";
import {
  BODY_TYPES,
  COVERAGES,
  FILMS,
  PARTS,
  isCoverage,
  isFilm,
  isPart,
  isVehicleBodySelection,
  makeBookingRef,
  PPF_ONLINE_DISCOUNT_PERCENT,
  ppfOnlinePriceQar,
  quotePpf,
  type PartKey,
} from "@/data/ppfInstall";
import { callbackOrigin, sadadConfig } from "@/lib/payments/config";
import { sendOrderEmails } from "@/lib/payments/email";
import { createOrder, newOrderId, type Order } from "@/lib/payments/orders";
import { buildSadadCheckoutForm, sadadTxnDate } from "@/lib/payments/sadad";
import { isEmail, normaliseQatarMobile, sadadMobile, str } from "@/lib/payments/validate";
import { rateLimit } from "@/lib/rate-limit";

const MAX = { short: 60, name: 80, notes: 500, clickId: 200 } as const;

// Two webhook attempts of up to 12 s each, plus the pause between them.
// Room for the staff booking email sent after the response, alongside a slow Sheet save.
export const maxDuration = 60;
const ATTEMPT_TIMEOUT_MS = 12000;
const RETRY_PAUSE_MS = 1500;

type Fields = Record<string, unknown>;

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const CUSTOM_BODY_LABEL = { en: "Custom offer by make & model", ar: "عرض خاص حسب الطراز" };

export async function POST(request: Request) {
  // Each booking emails staff: 10 per 10 minutes per visitor caps a flood, not a customer.
  const limited = rateLimit(request, "ppf-booking", 10, 10 * 60_000);
  if (limited) return limited;
  let f: Fields;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("not an object");
    f = parsed as Fields;
  } catch {
    return json(400, { ok: false, error: "bad_request" });
  }

  // Anti-bot timing: how long the form was open, measured on the customer's
  // own clock (elapsedMs), so a phone whose clock runs fast or slow is never
  // taken for a bot. A page built before elapsedMs existed sends only
  // startedAt; a phone clock ahead of the server's then gives a negative gap,
  // which counts as a person. Submitted within 3 s (or no timing at all): a
  // bot, which gets a convincing reply and nothing saved.
  const elapsedMs = typeof f.elapsedMs === "number" ? f.elapsedMs : Date.now() - Number(f.startedAt);
  if (!Number.isFinite(elapsedMs) || (elapsedMs >= 0 && elapsedMs < 3000)) {
    return json(200, { ok: true, ref: makeBookingRef(), payment: "handover" });
  }
  // The hidden field filled by someone who took their time is more likely
  // autofill than a bot: keep the booking, and tell staff to check it.
  const trapFilled = Boolean(str(f.website, 200));

  const { body, coverage, film } = f;
  const parts = Array.isArray(f.parts) ? (f.parts.filter(isPart) as PartKey[]) : [];
  if (!isVehicleBodySelection(body) || !isCoverage(coverage) || !isFilm(film)) {
    return json(422, { ok: false, error: "invalid_selection" });
  }
  if (coverage === "custom" && parts.length === 0) {
    return json(422, { ok: false, error: "invalid_selection" });
  }

  const wantsOnline = f.payment === "online";
  const name = str(f.name, MAX.name);
  const mobile = normaliseQatarMobile(str(f.mobile, 30));
  const email = str(f.email, 120);
  const make = str(f.make, MAX.short);
  const model = str(f.model, MAX.short);
  const rawYear = f.year === "" || f.year === null || f.year === undefined ? 0 : Number(f.year);
  const thisYear = new Date().getFullYear();
  const preferredDate = str(f.preferredDate, 10);
  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!mobile) errors.push("mobile");
  // SADAD sends its receipt by email, so paying now needs one.
  if (email ? !isEmail(email) : wantsOnline) errors.push("email");
  if (!make && !model) errors.push("make");
  if (rawYear !== 0 && (!Number.isInteger(rawYear) || rawYear < 1990 || rawYear > thisYear + 1)) {
    errors.push("year");
  }
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.push("preferredDate");
  if (f.consent !== true) errors.push("consent");
  if (errors.length > 0) return json(422, { ok: false, error: "invalid_fields", fields: errors });

  // Price comes from the shared table, never from the request.
  const quote = quotePpf({ body, coverage, parts, film });
  const ref = makeBookingRef();
  const locale = f.locale === "ar" ? "ar" : "en";
  const config = sadadConfig();
  const fixedPrice = body !== "custom" && quote.priceQar !== null && !quote.isEstimate;
  const payOnline = wantsOnline && fixedPrice && config !== null;

  // Paying online now: 5% off the package price (PPF_ONLINE_DISCOUNT_PERCENT).
  const onlineChargeQar = payOnline ? ppfOnlinePriceQar(quote.priceQar!) : null;

  // The page priced the job from the table it was built with; if a deploy
  // changed the price since, say so instead of charging a surprise amount.
  // (A page from before the online discount sends the full price: never more
  // than the charge, so it is accepted.)
  const expected = Number(f.expectedPriceQar);
  if (
    payOnline &&
    f.expectedPriceQar !== undefined &&
    (!Number.isFinite(expected) || (expected !== onlineChargeQar && expected !== quote.priceQar))
  ) {
    return json(409, { ok: false, error: "price_changed", priceQar: onlineChargeQar });
  }

  const booking = {
    ref,
    locale,
    bodyType: body,
    coverage,
    parts: coverage === "custom" ? parts : [],
    film,
    priceQar: quote.priceQar ?? "quote",
    payment: payOnline ? "online" : "handover",
    make: make || model,
    model: make ? model : "",
    year: rawYear || "",
    existingFilm: str(f.existingFilm, MAX.short),
    preferredDate,
    name,
    mobile,
    email,
    notes: str(f.notes, MAX.notes),
    gclid: str(f.gclid, MAX.clickId),
    gbraid: str(f.gbraid, MAX.clickId),
    wbraid: str(f.wbraid, MAX.clickId),
    utmSource: str(f.utmSource, MAX.short),
    utmMedium: str(f.utmMedium, MAX.short),
    utmCampaign: str(f.utmCampaign, MAX.short),
  };

  // isFilm() still accepts the retired "ultimate" key, which quotePpf prices as PRO PLUS.
  const filmKey = (film as string) === "ultimate" ? "pro-plus" : film;
  const filmInfo = FILMS.find((x) => x.key === filmKey);
  const order: Order = {
    v: 1,
    id: newOrderId(ref),
    ref,
    kind: "ppf",
    createdAt: new Date().toISOString(),
    locale,
    pay: payOnline ? "online" : "handover",
    status: payOnline ? "awaiting_payment" : "booked",
    totalQar: onlineChargeQar ?? quote.priceQar ?? 0,
    customer: { name, mobile: mobile!, email },
    notes: booking.notes,
    ppf: {
      body,
      bodyLabel: BODY_TYPES.find((b) => b.key === body)?.name ?? CUSTOM_BODY_LABEL,
      coverage,
      coverageLabel: COVERAGES.find((c) => c.key === coverage)?.name ?? { en: coverage, ar: coverage },
      film,
      filmLabel: filmInfo?.name ?? { en: String(film), ar: String(film) },
      parts:
        coverage === "custom"
          ? PARTS.filter((p) => parts.includes(p.key)).map((p) => p.name)
          : [],
      car: [rawYear || "", make, model].filter(Boolean).join(" "),
      existingFilm: booking.existingFilm,
      preferredDate,
      priceQar: quote.priceQar,
      isEstimate: quote.isEstimate,
      ...(onlineChargeQar !== null
        ? { onlineDiscountPercent: PPF_ONLINE_DISCOUNT_PERCENT, onlineDiscountQar: quote.priceQar! - onlineChargeQar }
        : {}),
    },
    attribution: {
      gclid: booking.gclid,
      gbraid: booking.gbraid,
      wbraid: booking.wbraid,
      utmSource: booking.utmSource,
      utmMedium: booking.utmMedium,
      utmCampaign: booking.utmCampaign,
    },
    events: [],
    flags: trapFilled ? ["honeypot"] : [],
    emails: {},
  };

  let stored = false;
  let emailedWithoutStore: Promise<boolean> | null = null;
  try {
    await createOrder(order);
    stored = true;
    // Started now, alongside the Sheet save below (up to ~25 s when the Sheet
    // is down), so the staff email keeps its time; after() waits for it.
    after(sendOrderEmails(order, "booked"));
  } catch (err) {
    console.error(`[ppf-booking] could not store ${order.id}: ${err instanceof Error ? err.message : err}`);
    // No stored order, nothing for SADAD to pay against: the customer is told
    // to pay at handover, and the Sheet and the staff email must say the same.
    booking.payment = "handover";
    order.pay = "handover";
    order.status = "booked";
    // Paid at handover after all: the full price, no online discount.
    order.totalQar = quote.priceQar ?? 0;
    delete order.ppf!.onlineDiscountPercent;
    delete order.ppf!.onlineDiscountQar;
    // The booking still reaches staff by email (awaited below, alongside the
    // Sheet), so a store outage never loses it.
    emailedWithoutStore = sendOrderEmails(order, "booked");
  }

  const sheet = await saveToSheet(booking);
  const emailed = emailedWithoutStore ? await emailedWithoutStore : false;
  if (!stored && emailed) {
    console.warn(`[ppf-booking] ${order.id} reached staff by email only (order store unavailable)`);
  }
  if (!stored && sheet.result !== "saved" && !emailed) {
    logUnsaved(sheet.failure, booking);
    return json(sheet.result === "not_configured" ? 503 : 502, {
      ok: false,
      error: sheet.result === "not_configured" ? "not_configured" : "save_failed",
      ref,
      priceQar: quote.priceQar,
    });
  }

  if (payOnline && stored && config) {
    const sadad = buildSadadCheckoutForm({
      merchantId: config.merchantId,
      secretKey: config.secretKey,
      website: config.website,
      orderId: order.id,
      amountQar: order.totalQar,
      callbackUrl: `${callbackOrigin(request)}/api/payments/sadad/callback`,
      email,
      mobile: sadadMobile(mobile!),
      txnDate: sadadTxnDate(),
      language: locale === "ar" ? "ARB" : "ENG",
      itemName: `ABK PPF installation ${ref}`,
    });
    return json(200, { ok: true, ref, priceQar: quote.priceQar, payment: "online", sadad });
  }

  return json(200, {
    ok: true,
    ref,
    priceQar: quote.priceQar,
    payment: "handover",
    ...(wantsOnline ? { paymentUnavailable: true } : {}),
  });
}

/** The owner's Google Sheet, when its Apps Script web app is configured. */
async function saveToSheet(
  booking: Record<string, unknown>,
): Promise<{ result: "saved" | "not_configured" | "failed"; failure: string }> {
  const url = process.env.PPF_BOOKING_WEBHOOK_URL;
  const secret = process.env.PPF_BOOKING_WEBHOOK_SECRET;
  if (!url) return { result: "not_configured", failure: "webhook not configured" };

  let failure = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      // Apps Script answers a POST with a 302 to the script's output; fetch
      // follows it as a GET, which is how web apps are meant to be called.
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(secret ? { secret, booking } : { booking }),
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });
      const out = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; stored?: string } | null;
      if (res.ok && out?.ok) {
        if (out.stored === "email") {
          console.warn("[ppf-booking] Sheet unavailable; booking", booking.ref, "was emailed to staff instead");
        }
        return { result: "saved", failure: "" };
      }
      failure = `attempt ${attempt}: HTTP ${res.status} ${out?.error ?? "no JSON reply"}`;
      // A wrong secret will not fix itself; retrying only delays the customer.
      if (out?.error === "unauthorized") break;
    } catch (err) {
      failure = `attempt ${attempt}: ${err instanceof Error ? err.message : String(err)}`;
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, RETRY_PAUSE_MS));
  }
  return { result: "failed", failure };
}

/**
 * The last line of defence: one greppable error line carrying the whole
 * booking, so nothing depends on the customer pressing send in WhatsApp.
 */
function logUnsaved(reason: string, booking: Record<string, unknown>) {
  console.error(`[ppf-booking] UNSAVED PPF BOOKING (${reason}) ${JSON.stringify(booking)}`);
}
