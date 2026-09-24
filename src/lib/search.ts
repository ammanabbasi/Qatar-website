/**
 * Catalogue search — tolerant matching for English and Arabic shoppers.
 *
 * Both the query and the product text go through `normalizeSearch`, so these
 * all match regardless of how they were typed:
 *   - Arabic hamza/madda forms (أ إ آ ٱ → ا), ة → ه, ى → ي, ؤ → و, ئ → ي
 *   - Arabic diacritics (tashkeel) and tatweel (ـ) are ignored
 *   - Arabic-Indic digits (٠-٩, ۰-۹) equal Western digits
 *   - British/American spellings used side by side in the catalogue
 *     ("Tyre Shine" vs "Tire Shine", "microfibre" vs "microfiber")
 */

export function normalizeSearch(input: string): string {
  return (
    input
      .normalize("NFKD")
      // Latin accents (NFKD splits them off) and Arabic tashkeel / hamza marks.
      .replace(/[̀-ͯؐ-ًؚ-ٰٟۖ-ۭ]/g, "")
      .toLowerCase()
      .replace(/ـ/g, "") // tatweel
      .replace(/[آأإٱ]/g, "ا") // آ أ إ ٱ → ا
      .replace(/ة/g, "ه") // ة → ه
      .replace(/ى/g, "ي") // ى → ي
      .replace(/ؤ/g, "و") // ؤ → و
      .replace(/ئ/g, "ي") // ئ → ي
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      .replace(/tyre/g, "tire")
      .replace(/fibre/g, "fiber")
      .replace(/colour/g, "color")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
  );
}

/** Pre-normalized text for one product, split by how strongly a hit counts. */
export type SearchDoc = {
  name: string;
  meta: string;
  body: string;
};

export function buildSearchDoc(fields: {
  names: string[];
  meta: string[];
  body: string[];
}): SearchDoc {
  return {
    name: normalizeSearch(fields.names.join(" ")),
    meta: normalizeSearch(fields.meta.join(" ")),
    body: normalizeSearch(fields.body.join(" ")),
  };
}

export function queryTokens(query: string): string[] {
  const normalized = normalizeSearch(query);
  return normalized ? normalized.split(" ") : [];
}

/**
 * Every token must appear somewhere (AND). Returns 0 for no match, otherwise a
 * relevance score: name hits outrank brand/category hits, which outrank
 * description hits — so "wax" lists the waxes before products that merely
 * mention wax.
 */
export function scoreDoc(doc: SearchDoc, tokens: readonly string[]): number {
  let score = 0;
  for (const token of tokens) {
    if (doc.name.includes(token)) score += 3;
    else if (doc.meta.includes(token)) score += 2;
    else if (doc.body.includes(token)) score += 1;
    else return 0;
  }
  return score;
}
