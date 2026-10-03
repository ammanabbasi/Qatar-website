/**
 * Retail "installed PPF" offer, as surfaced outside the installation page
 * itself (header, home, catalogue, film pages). Every figure comes from
 * src/data/ppfInstall.ts, so a price change there reaches all of these
 * placements at once.
 */
import {
  FILMS,
  WORKMANSHIP_COVER_MONTHS,
  fromPrice,
  quotePpf,
  type FilmKey,
} from "@/data/ppfInstall";

/** Opens the quote builder on arrival; `film` preselects that film. */
export function installHref(film?: FilmKey): string {
  return film ? `/b2c/ppf-installation?film=${film}#quote` : "/b2c/ppf-installation#quote";
}

export function filmForSlug(slug: string) {
  return FILMS.find((f) => f.productSlug === slug);
}

/** Sedan, front-end coverage in the given film; null when quoted per car (PRISM). */
export function installedFromQar(film: FilmKey): number | null {
  return quotePpf({ body: "sedan", coverage: "front-end", parts: [], film }).priceQar;
}

/** Warranty span across the gloss range, e.g. 10 and 15 years. */
export function glossWarrantyRange(): { min: number; max: number } {
  const years = FILMS.filter((f) => f.key === "pro" || f.key === "ultimate").map(
    (f) => f.warrantyYears,
  );
  return { min: Math.min(...years), max: Math.max(...years) };
}

export { WORKMANSHIP_COVER_MONTHS, fromPrice };
