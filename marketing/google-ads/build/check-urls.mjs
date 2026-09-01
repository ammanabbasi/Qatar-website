// HEAD-checks every URL an ad could legitimately land on. A 404 landing page is
// wasted spend and a Google "destination not working" disapproval, so this is
// checked against PRODUCTION, not against the local build.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const cat = JSON.parse(readFileSync(join(HERE, "catalogue.json"), "utf8"));
const SITE = "https://abktradingservice.com";

const urls = new Set();
for (const p of cat.products) {
  for (const k of ["url_b2c_en", "url_b2b_en", "url_b2c_ar", "url_b2b_ar"]) if (p[k]) urls.add(p[k]);
}
const HUBS = ["", "/b2c/products", "/b2b", "/b2b/become-a-dealer", "/about", "/contact", "/b2c/blog"];
for (const l of ["en", "ar"]) for (const h of HUBS) urls.add(`${SITE}/${l}${h}`);
// Category-filtered catalogue URLs used by the sitelinks.
for (const l of ["en", "ar"]) for (const c of ["ppf", "ceramic", "shampoo", "polish", "interior", "tyre", "glass", "fragrance"]) {
  urls.add(`${SITE}/${l}/b2c/products?category=${c}`);
}

const list = [...urls];
const bad = [];
let done = 0;
const LIMIT = 8;

async function worker(queue) {
  while (queue.length) {
    const url = queue.pop();
    try {
      const r = await fetch(url, { method: "GET", redirect: "follow" });
      if (!r.ok) bad.push(`${r.status} ${url}`);
    } catch (e) {
      bad.push(`ERR ${url} — ${e.message}`);
    }
    if (++done % 25 === 0) console.log(`  …${done}/${list.length}`);
  }
}
const queue = [...list];
await Promise.all(Array.from({ length: LIMIT }, () => worker(queue)));

console.log(`\nchecked ${list.length} URLs`);
if (bad.length) { console.log(`\u2717 ${bad.length} BAD:`); for (const b of bad) console.log("  " + b); process.exit(1); }
else console.log("\u2713 every candidate landing page returns 200");
