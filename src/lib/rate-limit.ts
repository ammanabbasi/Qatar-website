/**
 * Per-visitor limits on the public order endpoints (/api/checkout,
 * /api/ppf-booking). The site runs as ONE long-lived server on Railway, so an
 * in-memory window sees every request (on a serverless host it would not).
 * Generous on purpose: many customers on Qatari mobile networks share one
 * public address (carrier NAT), and a person books once or twice.
 */

const hits = new Map<string, number[]>();
let lastPrune = 0;

/**
 * The visitor's address as Railway's edge saw it: the last X-Forwarded-For
 * hop (the one the edge added; earlier hops are whatever the client sent).
 * Null when unknown — then nothing is limited, rather than everyone sharing
 * one bucket.
 */
export function clientAddress(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const hops = forwarded?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return hops.at(-1) ?? request.headers.get("x-real-ip")?.trim() ?? null;
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
