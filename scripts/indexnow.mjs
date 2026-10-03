/**
 * Tell Bing (and the other IndexNow engines: Yandex, Seznam, Naver, Yep) that
 * pages changed, so they recrawl within minutes instead of days. ChatGPT
 * search leans on Bing's index, so this is the fastest way to get new copy
 * in front of it. Run it AFTER the deploy is live.
 *
 *   npm run indexnow -- --since 2026-10-02     sitemap URLs with lastmod >= date
 *   npm run indexnow -- /en/b2c/ppf-installation /ar/b2c/ppf-installation
 *   npm run indexnow -- --all                  every sitemap URL (first run only)
 *   add --dry-run to print the list without submitting
 *
 * Submit only what changed: engines throttle sites that resend unchanged URLs.
 * The key file lives at public/<KEY>.txt and must stay deployed.
 */

const HOST = "abktradingservice.com";
const ORIGIN = `https://${HOST}`;
const KEY = "abktrading8f255517ef109a16b63bca";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
// One endpoint is enough — IndexNow engines share submissions with each other.
const ENDPOINT = "https://api.indexnow.org/indexnow";

const STATUS = {
  200: "OK — URLs received",
  202: "Accepted — key validation pending",
  400: "Bad request — invalid format",
  403: "Forbidden — key not valid (is the key file live?)",
  422: "Unprocessable — a URL doesn't belong to the host or the key doesn't match",
  429: "Too many requests — slow down",
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const sinceIdx = args.indexOf("--since");
const since = sinceIdx >= 0 ? args[sinceIdx + 1] : null;
const explicit = args.filter(
  (a, i) => !a.startsWith("--") && !(sinceIdx >= 0 && i === sinceIdx + 1),
);

async function sitemapEntries() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>(.*?)<\/loc>/)?.[1].trim(),
    lastmod: block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1].trim() ?? "",
  }));
}

async function main() {
  if (!all && !since && explicit.length === 0) {
    console.error("Nothing to submit. Pass URLs/paths, --since YYYY-MM-DD, or --all.");
    process.exit(1);
  }

  const key = (await (await fetch(KEY_LOCATION)).text()).trim();
  if (key !== KEY) {
    console.error(`Key file at ${KEY_LOCATION} doesn't contain the key — deploy it first.`);
    process.exit(1);
  }

  const entries = await sitemapEntries();
  const known = new Set(entries.map((e) => e.loc));
  const urls = new Set();
  if (all) entries.forEach((e) => urls.add(e.loc));
  if (since) entries.filter((e) => e.lastmod.slice(0, 10) >= since).forEach((e) => urls.add(e.loc));
  for (const a of explicit) {
    // Git Bash rewrites a bare "/path" argument into "C:/Program Files/Git/path".
    if (/^[A-Za-z]:[\\/]/.test(a)) {
      console.error(`"${a}" looks like a path Git Bash rewrote — pass the full https:// URL instead.`);
      process.exit(1);
    }
    const url = a.startsWith("http") ? a : `${ORIGIN}${a.startsWith("/") ? "" : "/"}${a}`;
    if (new URL(url).host !== HOST) {
      console.error(`Skipping ${url} — not on ${HOST}`);
      continue;
    }
    if (!known.has(url)) console.warn(`Note: ${url} is not in the sitemap (fine for llms.txt etc.)`);
    urls.add(url);
  }

  const urlList = [...urls];
  console.log(`${urlList.length} URL(s):\n  ${urlList.join("\n  ")}`);
  if (urlList.length === 0 || dryRun) return;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  console.log(`IndexNow: HTTP ${res.status} ${STATUS[res.status] ?? res.statusText}`);
  const body = await res.text();
  if (body) console.log(body);
  if (res.status >= 300) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
