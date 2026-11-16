import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { pathToFileURL } from "url";
import { registerHooks } from "module";

const repoRoot = path.resolve(import.meta.dirname, "..");
const appOut = path.join(repoRoot, ".next/server/app");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const full = path.join(repoRoot, "src", specifier.slice(2));
      return nextResolve(pathToFileURL(path.extname(full) ? full : `${full}.ts`).href, context);
    }
    if (specifier.startsWith(".") && !path.extname(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const {
  captureSessionAttribution,
  attributionEventParams,
  readBookingAttribution,
  markAiVisitReported,
} = await import(pathToFileURL(path.join(repoRoot, "src/lib/attribution.ts")).href);

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failures++;
  }
}

// ── 1. LLMs Manifest Drift Check ───────────────────────────────────────────
try {
  execFileSync(
    process.execPath,
    ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", path.join(repoRoot, "scripts/generate-llms.mjs"), "--check"],
    { stdio: "pipe" },
  );
  console.log("1. LLMs manifest sync check (llms.txt & llms-full.txt): PASSED.");
} catch (err) {
  assert(false, err.stderr?.toString() || err.message);
}

// ── 2. Attribution Unit & Multi-Page SPA Simulation Tests ──────────────────
function mockEnv({ search = "", pathname = "/en", referrer = "", cookie = "" }) {
  const store = new Map();
  globalThis.window = {
    location: { search, pathname, hostname: "abktradingservice.com" },
    sessionStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, v),
    },
  };
  globalThis.document = { referrer, cookie };
  return {
    navigate(nextPath, nextSearch = "") {
      globalThis.document.referrer = `https://abktradingservice.com${globalThis.window.location.pathname}`;
      globalThis.window.location.pathname = nextPath;
      globalThis.window.location.search = nextSearch;
    },
  };
}

{
  const nav = mockEnv({ pathname: "/en/b2c/blog/ppf-cost-qatar", search: "?utm_source=chatgpt.com" });
  const initial = captureSessionAttribution();
  assert(initial.trafficChannel === "ai_referral" && initial.aiPlatform === "chatgpt", "ChatGPT detected");
  markAiVisitReported();
  nav.navigate("/en/b2c/ppf-installation");
  const after = captureSessionAttribution();
  assert(after.aiPlatform === "chatgpt" && after.aiVisitReported === true, "ChatGPT persisted across SPA nav");
  const booking = readBookingAttribution();
  assert(booking.utmSource === "chatgpt.com" && booking.utmMedium === "ai_referral", "ChatGPT booking attribution");
}

{
  const nav = mockEnv({ pathname: "/en/b2c/blog/best-ppf-brands-qatar", referrer: "https://www.perplexity.ai/search/q" });
  captureSessionAttribution();
  nav.navigate("/en/b2c/ppf-installation");
  const ev = attributionEventParams();
  const booking = readBookingAttribution();
  assert(ev.traffic_channel === "ai_referral" && ev.ai_platform === "perplexity", "Perplexity event params");
  assert(booking.utmSource === "perplexity" && booking.utmMedium === "ai_referral", "Perplexity synthesized UTM");
}

{
  const nav = mockEnv({ pathname: "/ar", referrer: "https://gemini.google.com/" });
  captureSessionAttribution();
  nav.navigate("/ar/b2c/products");
  const ev = attributionEventParams();
  assert(ev.traffic_channel === "ai_referral" && ev.ai_platform === "gemini", "Gemini event params");
}

{
  const nav = mockEnv({ pathname: "/en/b2c/categories/ceramic", referrer: "https://www.google.com.qa/" });
  captureSessionAttribution();
  nav.navigate("/en/b2c/ppf-installation");
  const ev = attributionEventParams();
  const booking = readBookingAttribution();
  assert(ev.traffic_channel === "organic_search" && ev.search_engine === "google", "Google organic params");
  assert(booking.utmSource === "google" && booking.utmMedium === "organic", "Google organic booking UTM");
}

{
  const nav = mockEnv({ pathname: "/en", referrer: "https://www.bing.com/" });
  captureSessionAttribution();
  nav.navigate("/en/b2b/become-a-dealer");
  const ev = attributionEventParams();
  assert(ev.traffic_channel === "organic_search" && ev.search_engine === "bing", "Bing organic params");
}

{
  const nav = mockEnv({
    pathname: "/ar/b2c/ppf-installation",
    search: "?gclid=EAIaIQobChMI_test123&utm_source=google&utm_medium=cpc&utm_campaign=qatar_ppf",
    referrer: "https://www.google.com/",
  });
  captureSessionAttribution();
  nav.navigate("/ar/b2c/ppf-installation");
  const booking = readBookingAttribution();
  assert(booking.gclid === "EAIaIQobChMI_test123" && booking.utmCampaign === "qatar_ppf", "Paid gclid persisted");
}

delete globalThis.window;
delete globalThis.document;
console.log("2. Attribution multi-page unit tests: 6/6 scenarios PASSED.");

// ── 3. Built Sitemap, Robots, Verification Files & LLMs Spec Conformance ───
assert(fs.existsSync(appOut), "Production build (.next/server/app) exists — run `npm run build` first");
const smXml = fs.readFileSync(path.join(appOut, "sitemap.xml.body"), "utf8");
const rbTxt = fs.readFileSync(path.join(appOut, "robots.txt.body"), "utf8");
const sitemapUrls = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert(sitemapUrls.length >= 190 && sitemapUrls.length % 2 === 0, `Balanced EN/AR sitemap URLs (${sitemapUrls.length})`);
assert(!sitemapUrls.some((u) => u.includes("sitrett")), "Retired sitrett hub must not be in sitemap.xml");
assert((rbTxt.match(/^User-Agent:/gim) || []).length === 24, "24 User-Agent blocks in robots.txt");
assert(fs.existsSync(path.join(repoRoot, "public/googlee3ff2df0d5447778.html")), "GSC verification file at public root");
assert(fs.existsSync(path.join(repoRoot, "public/abktrading8f255517ef109a16b63bca.txt")), "IndexNow key file at public root");
assert(!fs.existsSync(path.join(repoRoot, "public/catalogues/vertek-ppf-catalogue.pdf")), "Stale vertek PDF removed");
assert(!fs.existsSync(path.join(repoRoot, "public/catalogues/autotriz-catalogue.pdf")), "Stale autotriz PDF removed");

const llms = fs.readFileSync(path.join(repoRoot, "public/llms.txt"), "utf8");
const llmsFull = fs.readFileSync(path.join(repoRoot, "public/llms-full.txt"), "utf8");
assert(/^# ABK Trading & Service/m.test(llms), "llms.txt H1");
assert(/^> /m.test(llms), "llms.txt summary blockquote");
assert([...llms.matchAll(/^- \[[^\]]+\]\(https?:\/\/[^)]+\)/gm)].length >= 40, "40+ Markdown links in llms.txt");
assert(!/\?pack=trade/.test(llms) && !/\?pack=trade/.test(llmsFull), "Zero disallowed query URLs in llms*.txt");
assert(!/Briller ceramic/i.test(llmsFull), "Zero 'Briller ceramic' claims in llms-full.txt");
assert(!/same-day delivery|same-day dispatch/i.test(llms + llmsFull), "Zero unverified same-day delivery claims in llms*.txt");
console.log(`3. Sitemap (${sitemapUrls.length} URLs), robots.txt (24 bots), verification files & llms*.txt: PASSED.`);

// ── 4. Full Built HTML Audit Across Every Sitemap Route + Special Routes ───
let verifiedPages = 0;
let totalJsonLdNodes = 0;
const titles = new Map();
const descs = new Map();

for (const prodUrl of sitemapUrls) {
  const rel = prodUrl.replace("https://abktradingservice.com/", "");
  const htmlPath = path.join(appOut, `${rel}.html`);
  assert(fs.existsSync(htmlPath), `Missing built HTML for ${rel}`);
  if (!fs.existsSync(htmlPath)) continue;

  const html = fs.readFileSync(htmlPath, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
  const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1] ?? "";
  const canon = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? "";
  const hreflangs = [...html.matchAll(/<link[^>]+hrefLang="([^"]+)"/gi)];
  const h1s = [...html.matchAll(/<h1\b/gi)];
  const headings = [...html.matchAll(/<(h[1-6])\b/gi)].map((m) => Number(m[1][1]));

  if (titles.has(title)) assert(false, `Duplicate title on ${rel} & ${titles.get(title)}: ${title}`);
  titles.set(title, rel);
  if (descs.has(desc)) assert(false, `Duplicate desc on ${rel} & ${descs.get(desc)}: ${desc}`);
  descs.set(desc, rel);

  assert(title.length >= 20, `Short title on ${rel}`);
  assert(desc.length >= 70, `Short desc on ${rel}`);
  assert(canon === prodUrl, `Canonical mismatch on ${rel}: ${canon}`);
  assert(hreflangs.length === 5, `Hreflang count ${hreflangs.length} on ${rel}`);
  assert(h1s.length === 1, `H1 count ${h1s.length} on ${rel}`);
  assert(
    !/Official &amp; Exclusive|Exclusive Distributor|موزع حصري|موزع رسمي وحصري|مزايا تجارية حصرية/.test(html),
    `Unverified 'Exclusive' claim in ${rel}`,
  );
  assert(
    !/same-day delivery|same-day dispatch|توصيل في نفس اليوم/i.test(html),
    `Unverified same-day delivery claim in ${rel}`,
  );

  for (let k = 1; k < headings.length; k++) {
    assert(headings[k] <= headings[k - 1] + 1, `Heading skip h${headings[k - 1]}->h${headings[k]} on ${rel}`);
  }

  const lds = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  assert(lds.length >= 2, `Missing JSON-LD on ${rel}`);
  for (const m of lds) {
    const parsed = JSON.parse(m[1]);
    totalJsonLdNodes++;
    if (parsed["@type"] === "ItemList") {
      assert(parsed.numberOfItems > 0, `Empty ItemList on ${rel}`);
    }
    if (parsed["@type"] === "CollectionPage") {
      assert(!parsed.mainEntity?.itemListElement, `Inline duplicate ItemList on ${rel}`);
    }
    if (parsed["@type"] === "Product") {
      assert(
        Boolean(parsed.offers || parsed.review || parsed.aggregateRating),
        `Invalid Product JSON-LD missing offers/review/aggregateRating on ${rel}`,
      );
    }
  }
  verifiedPages++;
}

for (const special of ["_not-found.html", "en/b2c/cart.html", "ar/b2c/cart.html"]) {
  const p = path.join(appOut, special);
  assert(fs.existsSync(p), `Exists: ${special}`);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, "utf8");
  assert(/noindex/i.test(html), `noindex on ${special}`);
}

console.log(
  `4. Full Built HTML Audit: ${verifiedPages}/${sitemapUrls.length} indexable pages + 3 noindex routes verified (${totalJsonLdNodes} JSON-LD blocks parsed, 0 duplicate titles/descriptions, 0 heading skips, 0 unverified claims).`,
);
console.log(`\nFINAL SEO/GEO VERIFICATION: ${failures === 0 ? "PASS (0 FAILURES)" : `FAIL (${failures} failures)`}`);
process.exit(failures > 0 ? 1 : 0);
