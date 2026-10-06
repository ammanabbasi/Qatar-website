/**
 * POST /api/ppf-booking — saves an installed-PPF booking request.
 *
 * The site's only server-side write. The record goes to the owner's Google
 * Sheet through an Apps Script web app (PPF_BOOKING_WEBHOOK_URL), called from
 * here so the endpoint never reaches the browser — the unguessable deployment
 * URL is the capability. PPF_BOOKING_WEBHOOK_SECRET is optional hardening:
 * when set (and set as SHARED_SECRET in the script), it is sent and checked.
 * The proxy matcher in src/proxy.ts already excludes /api, so next-intl never
 * touches this route.
 *
 * Failure is never fatal for the customer: on any error the client still
 * offers the WhatsApp hand-off with a reference. A failed save is retried
 * once (the script ignores a ref it already has, so a retry never writes a
 * second row); if it still fails, the full booking is logged on one
 * "UNSAVED PPF BOOKING" line so the owner can recover it from Vercel →
 * Logs even if the customer never sends the WhatsApp message.
 */

import {
  isBodyType,
  isCoverage,
  isFilm,
  isPart,
  makeBookingRef,
  quotePpf,
  type PartKey,
} from "@/data/ppfInstall";

const MAX = { short: 60, name: 80, notes: 500, clickId: 200 } as const;

// Two webhook attempts of up to 12 s each, plus the pause between them.
export const maxDuration = 30;
const ATTEMPT_TIMEOUT_MS = 12000;
const RETRY_PAUSE_MS = 1500;

type Fields = Record<string, unknown>;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Qatar mobile: optional +974/00974, then 8 digits starting 3, 5, 6 or 7. */
function normaliseQatarMobile(v: string): string | null {
  const digits = v.replace(/[\s()-]/g, "").replace(/^(\+|00)?974/, "");
  return /^[3567]\d{7}$/.test(digits) ? `+974${digits}` : null;
}

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let f: Fields;
  try {
    f = (await request.json()) as Fields;
  } catch {
    return json(400, { ok: false, error: "bad_request" });
  }

  // Honeypot + a minimum fill time: bots get a convincing reply and nothing saved.
  const startedAt = Number(f.startedAt);
  if (str(f.website, 200) || !Number.isFinite(startedAt) || Date.now() - startedAt < 3000) {
    return json(200, { ok: true, ref: makeBookingRef() });
  }

  const { body, coverage, film } = f;
  const parts = Array.isArray(f.parts) ? (f.parts.filter(isPart) as PartKey[]) : [];
  if (!isBodyType(body) || !isCoverage(coverage) || !isFilm(film)) {
    return json(422, { ok: false, error: "invalid_selection" });
  }
  if (coverage === "custom" && parts.length === 0) {
    return json(422, { ok: false, error: "invalid_selection" });
  }

  const name = str(f.name, MAX.name);
  const mobile = normaliseQatarMobile(str(f.mobile, 30));
  const email = str(f.email, 120);
  const year = Number(f.year);
  const thisYear = new Date().getFullYear();
  const preferredDate = str(f.preferredDate, 10);
  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!mobile) errors.push("mobile");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
  if (!str(f.make, MAX.short)) errors.push("make");
  if (!str(f.model, MAX.short)) errors.push("model");
  if (!Number.isInteger(year) || year < 1990 || year > thisYear + 1) errors.push("year");
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.push("preferredDate");
  if (f.consent !== true) errors.push("consent");
  if (errors.length > 0) return json(422, { ok: false, error: "invalid_fields", fields: errors });

  // Price comes from the shared table, never from the request.
  const quote = quotePpf({ body, coverage, parts, film });
  const ref = makeBookingRef();

  const url = process.env.PPF_BOOKING_WEBHOOK_URL;
  const secret = process.env.PPF_BOOKING_WEBHOOK_SECRET;

  const booking = {
    ref,
    locale: f.locale === "ar" ? "ar" : "en",
    bodyType: body,
    coverage,
    parts: coverage === "custom" ? parts : [],
    film,
    priceQar: quote.priceQar ?? "quote",
    make: str(f.make, MAX.short),
    model: str(f.model, MAX.short),
    year,
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

  if (!url) {
    logUnsaved("webhook not configured", booking);
    return json(503, { ok: false, error: "not_configured", ref, priceQar: quote.priceQar });
  }

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
        if (out.stored === "email") console.warn("[ppf-booking] Sheet unavailable; booking", ref, "was emailed to staff instead");
        return json(200, { ok: true, ref, priceQar: quote.priceQar });
      }
      failure = `attempt ${attempt}: HTTP ${res.status} ${out?.error ?? "no JSON reply"}`;
      // A wrong secret will not fix itself; retrying only delays the customer.
      if (out?.error === "unauthorized") break;
    } catch (err) {
      failure = `attempt ${attempt}: ${err instanceof Error ? err.message : String(err)}`;
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, RETRY_PAUSE_MS));
  }

  logUnsaved(failure, booking);
  return json(502, { ok: false, error: "save_failed", ref, priceQar: quote.priceQar });
}

/**
 * The last line of defence: one greppable error line carrying the whole
 * booking, so nothing depends on the customer pressing send in WhatsApp.
 */
function logUnsaved(reason: string, booking: Record<string, unknown>) {
  console.error(`[ppf-booking] UNSAVED PPF BOOKING (${reason}) ${JSON.stringify(booking)}`);
}
