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
 * offers the WhatsApp hand-off with a reference, so a lead is never lost.
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
  if (!url) {
    console.error("[ppf-booking] webhook not configured; booking", ref, "not saved");
    return json(503, { ok: false, error: "not_configured", ref, priceQar: quote.priceQar });
  }

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

  try {
    // Apps Script answers a POST with a 302 to the script's output; fetch
    // follows it as a GET, which is how web apps are meant to be called.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(secret ? { secret, booking } : { booking }),
      signal: AbortSignal.timeout(10000),
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !out?.ok) throw new Error(`webhook replied ${res.status}`);
  } catch (err) {
    console.error("[ppf-booking] save failed for", ref, err);
    return json(502, { ok: false, error: "save_failed", ref, priceQar: quote.priceQar });
  }

  return json(200, { ok: true, ref, priceQar: quote.priceQar });
}
