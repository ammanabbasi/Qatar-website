/** Input helpers shared by the checkout and booking routes. */

export function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Arabic-Indic (٠–٩) and Persian (۰–۹) digits → 0–9: an Arabic phone keyboard
 * types those, and a regex \d only matches 0–9.
 */
export function toLatinDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (c) => String(c.charCodeAt(0) & 0xf));
}

/** Qatar mobile: optional +974/00974, then 8 digits starting 3, 5, 6 or 7. Returns +974XXXXXXXX. */
export function normaliseQatarMobile(value: string): string | null {
  const digits = toLatinDigits(value).replace(/[\s()-]/g, "").replace(/^(\+|00)?974/, "");
  return /^[3567]\d{7}$/.test(digits) ? `+974${digits}` : null;
}

/** +97430838355 → 97430838355, the form SADAD's MOBILE_NO expects. */
export function sadadMobile(e164: string): string {
  return e164.replace(/^\+/, "");
}

export function isEmail(value: string): boolean {
  return value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
