/**
 * Server start (Node.js runtime only). Starts the background order sweep
 * (src/lib/payments/sweep.ts) inside the long-lived Railway server. Not on
 * Vercel (serverless: nothing keeps a timer alive between requests) and not
 * without a database (local runs and unit tests keep orders in memory).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.VERCEL || !process.env.DATABASE_URL?.trim()) return;
  if (process.env.ORDER_SWEEP_DISABLED === "1") return; // kill switch (and for deterministic test runs)
  const { startOrderSweep } = await import("./lib/payments/sweep");
  startOrderSweep();
}
