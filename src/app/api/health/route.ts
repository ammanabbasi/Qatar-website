/**
 * GET /api/health — Railway's readiness check (railway.json): the server
 * answers. Configuration is checked by the routes that need it, so a missing
 * secret never takes the whole site down.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
