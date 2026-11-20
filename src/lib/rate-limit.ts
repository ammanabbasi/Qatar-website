/**
 * Per-visitor limits on the public order endpoints (/api/checkout,
 * /api/ppf-booking). The site runs as ONE long-lived server on Railway, so an
 * in-memory window sees every request (on a serverless host it would not).
 * Generous on purpose: many customers on Qatari mobile networks share one
 * public address (carrier NAT), and a person books once or twice.
 */

const hits = new Map<string, number[]>();
let lastPrune = 0;

const ON_RAILWAY = Boolean(process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID);

/**
 * The visitor's address. On Railway: X-Real-IP, the header Railway's edge
 * documents for the client's address. Not X-Forwarded-For there: measured live
 * on 2026-11-20, the edge passes a client-sent X-Forwarded-For through, so
 * every hop in it can be made up and 12 requests with invented addresses all
 * got past the limit. Elsewhere (local `next start`, which fills
 * X-Forwarded-For from the socket when it is missing, and the tests that send
 * their own): the last X-Forwarded-For hop, then X-Real-IP.
 * Null when unknown — then nothing is limited, rather than everyone sharing
 * one bucket.
 */
export function clientAddress(request: Request, onRailway = ON_RAILWAY): string | null {
  const realIp = request.headers.get("x-real-ip")?.trim() || null;
  if (onRailway) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  const hops = forwarded?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return hops.at(-1) ?? realIp;
}

/**
 * True when `key` already used `limit` requests in the last `windowMs`;
 * otherwise records this request and returns false.
 */
export function overLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  if (now - lastPrune > 60_000) {
    lastPrune = now;
    for (const [k, times] of hits) if (times.every((t) => now - t > 60 * 60_000)) hits.delete(k);
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

/** 429 for a visitor over the limit of `route`, or null to carry on. */
export function rateLimit(request: Request, route: string, limit: number, windowMs: number): Response | null {
  const address = clientAddress(request);
  if (!address || !overLimit(`${route}:${address}`, limit, windowMs)) return null;
  console.warn(`[rate-limit] ${route}: over ${limit} per ${Math.round(windowMs / 60_000)} min`);
  return Response.json(
    { ok: false, error: "rate_limited" },
    { status: 429, headers: { "Retry-After": String(Math.ceil(windowMs / 1000)), "Cache-Control": "no-store" } },
  );
}
