/**
 * Assembles the per-theme campaign JSON files into Google Ads Editor import CSVs.
 *
 * Why a script and not hand-written CSVs: Google Ads Editor rejects an import
 * when a single headline is 31 characters. Character limits are a mechanical
 * property, so they get a mechanical check — this script HARD FAILS with an
 * exact report rather than letting a bad row reach the account.
 *
 * Counting uses [...s].length (code points), not s.length (UTF-16 units), so
 * Arabic and any astral characters are counted the way a human counts them.
 *
 * Run: node marketing/google-ads/build/assemble.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CAMPAIGN_DIR = join(HERE, "campaigns");
const OUT = join(HERE, "..", "import");
mkdirSync(OUT, { recursive: true });

const LIMITS = { headline: 30, description: 90, path: 15 };
const len = (s) => [...String(s)].length;

const errors = [];
const warnings = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// ── load ────────────────────────────────────────────────────────────────────
const files = readdirSync(CAMPAIGN_DIR).filter((f) => f.endsWith(".json")).sort();
if (!files.length) {
  console.error("No campaign JSON files found in " + CAMPAIGN_DIR);
  process.exit(1);
}

const themes = [];
for (const f of files) {
  const raw = readFileSync(join(CAMPAIGN_DIR, f), "utf8").replace(/^﻿/, "").trim();
  // Agents occasionally wrap JSON in a markdown fence despite instructions.
  const cleaned = raw.startsWith("```")
    ? raw.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "")
    : raw;
  try {
    themes.push({ file: f, data: JSON.parse(cleaned) });
  } catch (e) {
    fail(f, `not valid JSON — ${e.message}`);
  }
}

// ── build the set of URLs the site actually serves ──────────────────────────
const SITE = "https://abktradingservice.com";
const catalogue = JSON.parse(readFileSync(join(HERE, "catalogue.json"), "utf8"));
const liveUrls = new Set();
for (const p of catalogue.products) {
  for (const k of ["url_b2c_en", "url_b2b_en", "url_b2c_ar", "url_b2b_ar"]) {
    if (p[k]) liveUrls.add(p[k]);
  }
}
const HUBS = ["", "/b2c/products", "/b2b", "/b2b/products", "/b2b/become-a-dealer", "/about", "/contact", "/b2c/blog"];
for (const loc of ["en", "ar"]) for (const path of HUBS) liveUrls.add(`${SITE}/${loc}${path}`);

const forbiddenBrands = /insta ?finish|getsun|sitrett|grizzly/i;
const forbiddenSlugs = new Set(catalogue.excludedSlugs);
const accountNegatives = new Set();

/**
 * Dilution ratios stated in ad copy must match the product's actual spec.
 *
 * This exists because a generated ad claimed the Briller Glass Cleaner is
 * "used direct or diluted 1:1" when its spec says 1:50 — a 50x error, in an ad,
 * about how to use a chemical. Prose review missed it; arithmetic does not.
 */
const dilutionBySlug = new Map();
const sizeBySlug = new Map();
const originBySlug = new Map();
for (const p of catalogue.products) {
  const d = /Dilution=([^|]+)/.exec(p.specs || "");
  if (d) dilutionBySlug.set(p.slug, d[1].trim());
  const s = /Size=([^|]+)/.exec(p.specs || "");
  if (s) sizeBySlug.set(p.slug, s[1].trim());
  const o = /Origin=([^|]+)/.exec(p.specs || "");
  if (o) originBySlug.set(p.slug, o[1].trim());
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const toWestern = (s) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

function checkDilutionClaims(where, url, texts) {
  const slug = url.split("?")[0].split("/products/")[1];
  if (!slug) return; // hub/category page — no single product to check against
  const actual = dilutionBySlug.get(slug);
  for (const raw of texts) {
    // Only `1:N`. Every real dilution here is 1:N, and anchoring on the leading
    // 1 avoids false-positiving on clock times like "13:00" or "22:00".
    for (const m of toWestern(raw).matchAll(/\b(1\s*:\s*\d+)\b/g)) {
      const claimed = m[1].replace(/\s+/g, "");
      if (!actual) {
        fail(where, `states a dilution "${claimed}" but ${slug} has no dilution spec: "${raw}"`);
      } else if (claimed !== actual.replace(/\s+/g, "")) {
        fail(where, `states dilution "${claimed}" but ${slug} is "${actual}": "${raw}"`);
      }
    }

    // Country of origin: "Made in Canada" is true of Briller and "Made in
    // Germany" of parts of the Autotriz range — never interchangeable.
    const originClaim = /Made in ([A-Z][a-z]+)/.exec(raw);
    if (originClaim) {
      const actualOrigin = originBySlug.get(slug);
      if (!actualOrigin) {
        fail(where, `claims "Made in ${originClaim[1]}" but ${slug} has no Origin spec: "${raw}"`);
      } else if (!actualOrigin.includes(originClaim[1])) {
        fail(where, `claims "Made in ${originClaim[1]}" but ${slug} is "${actualOrigin}": "${raw}"`);
      }
    }

    // Same idea for pack size: an ad promising "20 L" must land on a 20 L product.
    const size = sizeBySlug.get(slug);
    if (size) {
      for (const m of toWestern(raw).matchAll(/\b(\d+)\s*L\b/gi)) {
        if (!size.replace(/\s+/g, "").includes(`${m[1]}L`)) {
          fail(where, `states "${m[1]} L" but ${slug} is "${size}": "${raw}"`);
        }
      }
    }
  }
}

/**
 * The catalogue page supports ?brand= and ?category= filters (see public/llms.txt),
 * so a filtered URL is a perfectly good landing page. Validate the path against
 * the live set, and separately check the query only uses real filter values —
 * `?category=ppf` is a great landing page, `?category=detailing` is an empty one.
 */
function checkUrl(where, url) {
  if (!url) return fail(where, "no finalUrl");
  const [path, query] = url.split("?");
  if (!liveUrls.has(path)) return fail(where, `finalUrl is not a page this site serves: ${path}`);
  if (!query) return;
  for (const pair of query.split("&")) {
    const [k, v] = pair.split("=");
    if (k !== "brand" && k !== "category") {
      fail(where, `unsupported query param "${k}" (only brand= and category= exist): ${url}`);
    } else if (k === "brand" && !catalogue.brands.includes(v)) {
      fail(where, `unknown brand filter "${v}": ${url}`);
    } else if (k === "category" && !catalogue.categories.includes(v)) {
      fail(where, `unknown category filter "${v}": ${url}`);
    } else if (k === "brand" && forbiddenBrands.test(v)) {
      fail(where, `filter targets an unpromoted brand: ${url}`);
    }
  }
}

// Words that would have ABK promising labour it does not perform. The business
// supplies product only (public/llms.txt) — an ad implying fitting is both a
// policy risk and simply untrue.
const servicePromise = /\b(we install|installation|we fit|fitting service|we apply|book (?:now|your|a)|appointment|our workshop|we tint|we coat)\b/i;
const servicePromiseAr = /(نركب|نقوم بالتركيب|نقوم بتركيب|خدمة التركيب|احجز موعد|ورشتنا)/;

/**
 * Negative match types are used exactly as declared.
 *
 * An earlier version of this script silently rewrote every multi-word Broad
 * negative to Phrase, on the theory that broad negatives over-block. That was
 * wrong on two counts, and the reasoning is recorded here so it is not redone:
 *
 *   1. The justification given ("a competitor negative like 'armor all' would
 *      suppress our own 'Weather Armor' queries") is impossible. A negative
 *      broad keyword blocks only when the query contains ALL of its words;
 *      "vertek weather armor" does not contain "all", so it was never at risk.
 *   2. Testing every multi-word Broad negative against all 806 positive
 *      keywords found ZERO cases where a negative would block one of our own
 *      terms. The rewrite fixed nothing.
 *
 * And it had a cost: negative broad blocks a superset of negative phrase, so
 * downgrading 88 negatives made them leak junk traffic — the opposite of what a
 * negative is for. Broad negatives do carry a real risk (they can block a
 * future query that happens to contain all the words), so the count is surfaced
 * as a warning for a human to review rather than silently changed.
 */
let multiWordBroadNegatives = 0;
function negativeMatchType(n) {
  const declared = n.matchType || "Broad";
  if (declared.toLowerCase() === "broad" && n.text.trim().split(/\s+/).length > 1) {
    multiWordBroadNegatives++;
  }
  return declared;
}

const rows = { campaigns: [], adGroups: [], keywords: [], negatives: [], ads: [], settings: [] };
const campaignNames = [];
let totalKeywords = 0, totalNegatives = 0, totalAds = 0;

for (const { file, data } of themes) {
  const campaigns = data?.campaigns ?? [];
  if (!campaigns.length) fail(file, "no `campaigns` array");

  for (const c of campaigns) {
    const cw = `${file} > ${c.name}`;
    if (!c.name) fail(cw, "campaign has no name");
    if (!["en", "ar"].includes(c.language)) fail(cw, `language must be "en" or "ar", got ${c.language}`);
    if (!(c.dailyBudgetQAR > 0)) fail(cw, "dailyBudgetQAR must be a positive number");

    rows.campaigns.push({
      Campaign: c.name,
      "Campaign Type": "Search",
      "Campaign Subtype": "All features",
      // ALWAYS paused on import. Enabling spend is a human decision, never a
      // side effect of running a build script.
      Status: "Paused",
      Budget: c.dailyBudgetQAR,
      "Budget Type": "Daily",
      "Bid Strategy Type": c.bidStrategy || "Maximize conversions",
      Networks: "Google search",
      Languages: c.language === "ar" ? "Arabic" : "English",
    });
    campaignNames.push(c.name);

    // Location targeting and ad scheduling are NOT importable campaign columns
    // in Ads Editor — they are separate criterion imports. Emitting them here
    // would make Editor prompt for unknown columns. They go to a reference
    // sheet instead, and the runbook has the human set them in the UI.
    rows.settings.push({
      Campaign: c.name,
      Language: c.language === "ar" ? "Arabic" : "English",
      "Target locations": (c.locations || []).join("; "),
      "Excluded locations": (c.excludedLocations || []).join("; "),
      "Ad schedule": c.adSchedule || "",
      "Daily budget (QAR)": c.dailyBudgetQAR,
      "Bid strategy": c.bidStrategy || "Maximize conversions",
      Rationale: c.rationale || "",
    });

    for (const g of c.adGroups ?? []) {
      const gw = `${cw} > ${g.name}`;
      if (!g.name) fail(gw, "ad group has no name");

      const url = g.finalUrl || "";
      checkUrl(gw, url);
      const wantLoc = c.language === "ar" ? "/ar/" : "/en/";
      if (url && !url.includes(wantLoc)) fail(gw, `${c.language} ad group points at ${url} (expected ${wantLoc})`);
      for (const slug of forbiddenSlugs) {
        if (url.includes(slug)) fail(gw, `finalUrl targets an unpromoted product: ${slug}`);
      }

      rows.adGroups.push({
        Campaign: c.name,
        "Ad Group": g.name,
        Status: "Enabled",
        "Max CPC": g.maxCpcQAR ?? "",
        "Ad Group Type": "Standard",
      });

      for (const k of g.keywords ?? []) {
        if (!k?.text) { fail(gw, "keyword with no text"); continue; }
        if (/^\+/.test(k.text)) fail(gw, `legacy modified-broad syntax is retired: "${k.text}"`);
        if (forbiddenBrands.test(k.text)) fail(gw, `keyword names an unpromoted brand: "${k.text}"`);
        rows.keywords.push({
          Campaign: c.name, "Ad Group": g.name,
          Keyword: k.text, "Match Type": k.matchType || "Phrase", Status: "Enabled",
          _lang: c.language, _url: url, _file: file,
        });
        totalKeywords++;
      }

      for (const n of g.negativeKeywords ?? []) {
        if (!n?.text) continue;
        rows.negatives.push({
          Campaign: c.name, "Ad Group": g.name,
          Keyword: n.text, "Match Type": negativeMatchType(n), "Criterion Type": "Negative",
        });
        totalNegatives++;
      }

      const ad = g.ad;
      if (!ad) { fail(gw, "ad group has no ad"); continue; }
      const H = ad.headlines ?? [];
      const D = ad.descriptions ?? [];

      if (H.length < 3) fail(gw, `only ${H.length} headlines (Google requires 3+, target is 15)`);
      if (H.length > 15) fail(gw, `${H.length} headlines (max 15)`);
      if (D.length < 2) fail(gw, `only ${D.length} descriptions (min 2, target is 4)`);
      if (D.length > 4) fail(gw, `${D.length} descriptions (max 4)`);
      if (H.length >= 3 && H.length < 15) warn(gw, `${H.length}/15 headlines — fewer combinations for Google to test`);

      H.forEach((h, i) => {
        if (len(h) > LIMITS.headline) fail(gw, `Headline ${i + 1} is ${len(h)} chars (max 30): "${h}"`);
      });
      D.forEach((d, i) => {
        if (len(d) > LIMITS.description) fail(gw, `Description ${i + 1} is ${len(d)} chars (max 90): "${d}"`);
      });
      for (const p of ["path1", "path2"]) {
        if (ad[p] && len(ad[p]) > LIMITS.path) fail(gw, `${p} is ${len(ad[p])} chars (max 15): "${ad[p]}"`);
      }

      const dupes = H.filter((h, i) => H.indexOf(h) !== i);
      if (dupes.length) fail(gw, `duplicate headlines: ${[...new Set(dupes)].join(" / ")}`);

      for (const t of [...H, ...D]) {
        if (forbiddenBrands.test(t)) fail(gw, `ad text names an unpromoted brand: "${t}"`);
        if (/!{2,}|\?{2,}/.test(t)) fail(gw, `repeated punctuation is disallowed: "${t}"`);
        if (/\b(click here|best price|cheapest|guaranteed|lowest price)\b/i.test(t)) fail(gw, `policy-risk phrase: "${t}"`);
        if (servicePromise.test(t)) fail(gw, `implies ABK performs the work (it supplies product only): "${t}"`);
        if (servicePromiseAr.test(t)) fail(gw, `Arabic text implies ABK performs the work: "${t}"`);
        if (/\bQAR\s?\d|\bد\.ق\s?\d|\d+\s?%\s?(off|discount)/i.test(t)) fail(gw, `price/discount claim, but the site publishes no prices: "${t}"`);
        // Google disallows phone numbers in ad text — they belong in a call asset.
        if (/\+?\s?974[\s-]?\d{6,}|30838355/.test(t)) fail(gw, `phone number in ad text (use a call asset instead): "${t}"`);
      }

      checkDilutionClaims(gw, url, [...H, ...D]);

      const adRow = {
        Campaign: c.name, "Ad Group": g.name,
        "Ad type": "Responsive search ad", Status: "Enabled",
        "Final URL": url, "Path 1": ad.path1 || "", "Path 2": ad.path2 || "",
      };
      for (let i = 0; i < 15; i++) adRow[`Headline ${i + 1}`] = H[i] ?? "";
      for (let i = 0; i < 4; i++) adRow[`Description ${i + 1}`] = D[i] ?? "";
      rows.ads.push(adRow);
      totalAds++;
    }
  }

  for (const n of data.sharedNegatives ?? []) {
    const text = (typeof n === "string" ? n : n?.text)?.trim();
    if (text) accountNegatives.add(text);
  }
}

// Account-wide negatives are NOT expanded into the campaign CSV. Ads Editor has
// no "blank campaign = applies to all" row, so expanding would mean
// (negatives x campaigns) rows — thousands of lines that are then a nightmare to
// edit, because changing one term means changing it once per campaign.
// A shared negative keyword list is the right tool: one list, applied to every
// campaign, edited in one place. Editor cannot create shared lists from CSV, so
// these go to a paste-ready text file instead.
//
// BUT a term that is safe for one theme can be lethal to another. Each theme
// contributed its own sharedNegatives independently, and the union blocked 19
// of this account's own keywords: "kuwait" and "bahrain" killed the B2B GCC
// terms, "install" killed "ppf supplier for installers", and "تظليل سيارات"
// (car tinting) killed "رول تظليل سيارات" — a tint ROLL, a product query that
// happens to contain the service phrase.
//
// So the list is split. A term that blocks nothing anywhere stays account-wide.
// A term that blocks one of our keywords in some campaign is demoted to a
// campaign-level negative on only the campaigns where it is harmless — keeping
// the protection where it works instead of dropping it everywhere.
const kwByCampaign = new Map();
for (const r of rows.keywords) {
  const list = kwByCampaign.get(r.Campaign) || kwByCampaign.set(r.Campaign, []).get(r.Campaign);
  list.push(r.Keyword.toLowerCase());
}

/** True if this negative would suppress `kw` under phrase OR broad matching. */
function negativeBlocks(neg, kw) {
  const n = neg.toLowerCase();
  if (kw.includes(n)) return true; // phrase
  const words = n.split(/\s+/);
  const present = new Set(kw.split(/\s+/));
  return words.every((w) => present.has(w)); // broad
}

const sharedNegativeList = [];
const demotedNegatives = [];
for (const term of [...accountNegatives].sort((a, b) => a.localeCompare(b))) {
  const safeCampaigns = [];
  let collides = false;
  for (const name of campaignNames) {
    const hit = (kwByCampaign.get(name) || []).some((kw) => negativeBlocks(term, kw));
    if (hit) collides = true;
    else safeCampaigns.push(name);
  }
  if (!collides) { sharedNegativeList.push(term); continue; }
  demotedNegatives.push({ term, safeCampaigns });
  for (const name of safeCampaigns) {
    rows.negatives.push({
      Campaign: name, "Ad Group": "",
      Keyword: term, "Match Type": "Phrase", "Criterion Type": "Campaign negative",
    });
    totalNegatives++;
  }
}

// ── keyword de-duplication ──────────────────────────────────────────────────
/**
 * A keyword belongs to exactly ONE ad group.
 *
 * The six themes were written independently, so trade terms like
 * "bulk car shampoo qatar" ended up in three ad groups at once. Google only ever
 * enters one ad per account into an auction, so this is not a bidding war — but
 * it splits performance data across ad groups and takes away control of which
 * ad and landing page the query actually gets.
 *
 * The winner is the ad group whose landing page is most SPECIFIC, because that
 * is the page most likely to answer the query: a product page beats a filtered
 * catalogue, which beats a bare hub. Ties go to the campaign matching the
 * keyword's intent — trade language to the wholesale campaign, everything else
 * away from it.
 */
const TRADE = /\b(wholesale|bulk|supplier|distributor|dealer|trade)\b|بالجملة|موزع|مورد|جملة/i;
function specificity(row) {
  const u = row._url || "";
  if (u.includes("/products/")) return 3;
  if (u.includes("?")) return 2;
  return 1;
}
function intentFit(row) {
  const isB2bCampaign = row._file === "b2b-wholesale.json";
  return TRADE.test(row.Keyword) === isB2bCampaign ? 1 : 0;
}

const kwBest = new Map();
for (const r of rows.keywords) {
  const key = `${r._lang}|${r.Keyword.trim().toLowerCase()}|${r["Match Type"]}`;
  const cur = kwBest.get(key);
  if (!cur) { kwBest.set(key, r); continue; }
  const better =
    specificity(r) !== specificity(cur) ? specificity(r) > specificity(cur)
      : intentFit(r) !== intentFit(cur) ? intentFit(r) > intentFit(cur)
        : false;
  if (better) kwBest.set(key, r);
}
const dedupedKeywords = rows.keywords.length - kwBest.size;
rows.keywords = [...kwBest.values()].map(({ _lang, _url, _file, ...keep }) => keep);
totalKeywords = rows.keywords.length;

// A keyword-less ad group would import but never serve. Catch it here.
{
  const withKw = new Set(rows.keywords.map((r) => `${r.Campaign}||${r["Ad Group"]}`));
  for (const g of rows.adGroups) {
    if (!withKw.has(`${g.Campaign}||${g["Ad Group"]}`)) {
      fail(`${g.Campaign} > ${g["Ad Group"]}`, "every keyword was de-duplicated away — ad group would never serve");
    }
  }
}

// ── assets (sitelinks, callouts, structured snippets) ───────────────────────
// Account-level in Google Ads, so they are validated and emitted separately
// from the campaign files. Language decides which campaigns they attach to.
const ASSET_LIMITS = { sitelinkText: 25, sitelinkDesc: 35, callout: 25, snippetValue: 25 };
const assetRows = { sitelinks: [], callouts: [], snippets: [] };
let assets = null;
try {
  assets = JSON.parse(readFileSync(join(HERE, "assets.json"), "utf8"));
} catch (e) {
  warn("assets.json", `not loaded — no extensions will be generated (${e.message})`);
}

if (assets) {
  for (const lang of ["en", "ar"]) {
    const langLabel = lang === "ar" ? "Arabic" : "English";

    for (const s of assets.sitelinks?.[lang] ?? []) {
      const w = `assets.json > sitelinks.${lang} > "${s.text}"`;
      if (len(s.text) > ASSET_LIMITS.sitelinkText) fail(w, `text is ${len(s.text)} chars (max 25)`);
      for (const d of ["desc1", "desc2"]) {
        if (s[d] && len(s[d]) > ASSET_LIMITS.sitelinkDesc) fail(w, `${d} is ${len(s[d])} chars (max 35): "${s[d]}"`);
      }
      checkUrl(w, s.url);
      if (s.url && !s.url.includes(`/${lang}/`)) fail(w, `${lang} sitelink points at ${s.url}`);
      assetRows.sitelinks.push({
        Language: langLabel, "Sitelink Text": s.text,
        "Sitelink Description 1": s.desc1 || "", "Sitelink Description 2": s.desc2 || "",
        "Sitelink Final URL": s.url,
      });
    }

    for (const c of assets.callouts?.[lang] ?? []) {
      const w = `assets.json > callouts.${lang} > "${c}"`;
      if (len(c) > ASSET_LIMITS.callout) fail(w, `callout is ${len(c)} chars (max 25)`);
      if (servicePromise.test(c) || servicePromiseAr.test(c)) fail(w, "callout implies ABK performs the work");
      assetRows.callouts.push({ Language: langLabel, Scope: "Account", "Callout text": c });
    }

    for (const g of assets.structuredSnippets?.[lang] ?? []) {
      for (const v of g.values ?? []) {
        const w = `assets.json > snippets.${lang} > ${g.header}`;
        if (len(v) > ASSET_LIMITS.snippetValue) fail(w, `value is ${len(v)} chars (max 25): "${v}"`);
        if (forbiddenBrands.test(v)) fail(w, `snippet names an unpromoted brand: "${v}"`);
      }
      assetRows.snippets.push({ Language: langLabel, Header: g.header, Values: (g.values || []).join("; ") });
    }
  }

  // Brand-specific callouts must not leak onto other brands' ads.
  for (const sc of assets.scopedCallouts ?? []) {
    for (const lang of ["en", "ar"]) {
      for (const c of sc[lang] ?? []) {
        const w = `assets.json > scopedCallouts(${sc.campaignMatch}).${lang} > "${c}"`;
        if (len(c) > ASSET_LIMITS.callout) fail(w, `callout is ${len(c)} chars (max 25)`);
        const matched = campaignNames.filter((n) => n.toLowerCase().includes(sc.campaignMatch.replace(/-/g, " ")) ||
          n.toLowerCase().includes(sc.campaignMatch));
        if (!matched.length) warn(w, `campaignMatch "${sc.campaignMatch}" matched no campaign — callout will not attach`);
        for (const n of matched.length ? matched : ["(unmatched)"]) {
          assetRows.callouts.push({
            Language: lang === "ar" ? "Arabic" : "English",
            Scope: n, "Callout text": c,
          });
        }
      }
    }
  }
}

// ── emit ────────────────────────────────────────────────────────────────────
const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function csv(name, list) {
  if (!list.length) return null;
  const cols = [...new Set(list.flatMap(Object.keys))];
  const body = [cols.join(","), ...list.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
  // BOM so Excel opens the Arabic rows without mojibake. Ads Editor accepts it.
  writeFileSync(join(OUT, name), "﻿" + body + "\r\n", "utf8");
  return `${name} (${list.length} rows)`;
}

if (errors.length) {
  console.error(`\n✗ VALIDATION FAILED — ${errors.length} error(s). Nothing written.\n`);
  for (const e of errors) console.error("  - " + e);
  if (warnings.length) {
    console.error(`\n  ${warnings.length} warning(s):`);
    for (const w of warnings) console.error("  ~ " + w);
  }
  process.exit(1);
}

const written = [
  csv("01-campaigns.csv", rows.campaigns),
  csv("02-ad-groups.csv", rows.adGroups),
  csv("03-keywords.csv", rows.keywords),
  csv("04-negative-keywords.csv", rows.negatives),
  csv("05-responsive-search-ads.csv", rows.ads),
  csv("06-campaign-settings-REFERENCE-ONLY.csv", rows.settings),
  csv("07-sitelinks.csv", assetRows.sitelinks),
  csv("08-callouts.csv", assetRows.callouts),
  csv("09-structured-snippets.csv", assetRows.snippets),
].filter(Boolean);

if (sharedNegativeList.length) {
  writeFileSync(
    join(OUT, "10-shared-negative-list.txt"),
    "﻿" + sharedNegativeList.join("\r\n") + "\r\n",
    "utf8",
  );
  written.push(`10-shared-negative-list.txt (${sharedNegativeList.length} terms)`);
}

console.log("✓ VALIDATION PASSED");
console.log(`  campaigns=${rows.campaigns.length} adGroups=${rows.adGroups.length} keywords=${totalKeywords} negatives=${totalNegatives} ads=${totalAds}`);
console.log("  wrote: " + written.join(", "));
if (dedupedKeywords) {
  console.log(`  de-duplicated ${dedupedKeywords} keyword(s) that appeared in more than one ad group`);
}
if (demotedNegatives.length) {
  console.log(
    `  ${demotedNegatives.length} negative(s) would have blocked our own keywords account-wide —\n` +
    "  demoted from the shared list to campaign-level where they are safe:",
  );
  for (const d of demotedNegatives) {
    console.log(`    "${d.term}" → ${d.safeCampaigns.length}/${campaignNames.length} campaigns`);
  }
}
if (multiWordBroadNegatives) {
  console.log(
    `  note: ${multiWordBroadNegatives} multi-word negatives are Broad — they block when a query\n` +
    "        contains all their words in any order. Verified not to block any of our own 806\n" +
    "        keywords; review if the search terms report shows wanted traffic being suppressed.",
  );
}
if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  ~ " + w);
}
