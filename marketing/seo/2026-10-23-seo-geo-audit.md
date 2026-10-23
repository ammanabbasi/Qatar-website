# SEO / GEO audit — 23 October 2026

Follow-up to `2026-10-20-traffic-audit-and-actions.md`. Sources: live crawl of all 192 sitemap URLs, Search Console
(URL-prefix property `https://abktradingservice.com/`, data since 17 Oct), GA4 (last 28 days), Bing Webmaster Tools,
the Google Ads search-terms report and the code. No private cost data belongs here (the repository is public).

## 1. Where the site stands

| Area | Finding |
|---|---|
| Crawl | 192/192 sitemap URLs return 200, self-canonical, one H1, valid JSON-LD, `lang`/`dir` correct, head hreflang identical to the sitemap, no `noindex`, no missing alt text. robots.txt admits every search and AI crawler; GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, bingbot and meta-externalagent all get 200. |
| Google index | 71 indexed, 15 excluded: 4 redirects and 3 alternate-canonical (expected), 2 old `/en/opengraph-image` 404s (harmless), 1 duplicate (`/ar/b2c`, now a redirect), 5 *crawled – not indexed* (AR shampoo and fragrance hubs, EN polish hub, AR fabric coating, an old `/b2b/products?category=` URL). The other ~100 sitemap URLs do not appear in the report yet: the property is six days old. |
| Google performance (since 17 Oct) | 33 clicks, 632 impressions, CTR 5.2%, average position 7.2. Top pages: `/en` (149 impressions), window-tinting guide (153), PPF cost guide (93), PPF installation (61). Non-brand queries already at positions 2–5: "best ppf in qatar", "ppf price in qatar", "ceramic coating price in qatar", "how much is ppf". "ppf qatar" sits at 9.7. |
| Rich results | Product snippets: 2 valid (warnings: no rating/review). Merchant listings: 1 valid, warnings `shippingDetails` and `hasMerchantReturnPolicy`. Core Web Vitals: not enough field data yet. |
| GA4, 28 days | 1,016 sessions. Google organic 306 (75% engaged, 58 s), direct 302, paid 267, **ChatGPT 65 (best key-event rate, 3.1%)**, Instagram 31, Bing organic ~0. 17 key events; `/en/b2c/ppf-installation` lands 92 sessions and 6 key events (5.4%), `/en` lands 569 sessions and 5. |
| Bing | 148 URLs indexed, sitemap read 20 Oct (192 URLs), 4 clicks / 53 impressions in 30 days, 20 Copilot citations (mostly 26 Sep). |
| Page weight | Raw HTML 420–500 KB on the home and PPF pages (mostly the React Server Components payload), 62–65 KB over the wire with Brotli. Not a ranking problem; noted only. |

## 2. Defects found and fixed in this pass

1. **Guides were orphaned.** Seven of ten guides had exactly one internal link (the blog index); the other three had
   two. These are the pages that rank for price queries. Every product, category and brand page and every guide now
   ends with up to three related guides, chosen by `relatedGuides()` in `src/data/articles.ts` from each guide's
   `relatedProducts` and new `topics` field.
2. **Broken internal link.** The car-care-products guide pointed at `/b2b/dealer-application` (404) in both
   languages; it now points at `/b2b/become-a-dealer`.
3. **Localeless URLs answered 307.** `/privacy`, `/contact`, `/b2c/...` were temporary middleware redirects, and
   Search Console showed `/privacy` itself collecting impressions. They now 308 to `/en/...`, with the same Arabic
   exception as the bare domain.
4. **Merchant-listing shipping.** The Organization node now carries a `ShippingService` (free delivery from QAR 200,
   otherwise QAR 25, Qatar) and every priced Offer references it by `@id`.
5. **Entity contradiction.** The store node was typed `AutoPartsStore` *and* `AutoRepair`, although nothing is
   fitted at the Mesaimeer address. It is now `AutoPartsStore` only, matching the Business Profile category.
6. **Duplicate meta descriptions.** Autotriz 3D Matrix Ultra and Hybrid shared one description in both languages.

### Deployed and verified (23 Oct 2026, commit 2e22404)

- Live crawl after deploy: 192/192 URLs 200, self-canonical, hreflang identical to the sitemap, one H1, valid JSON-LD,
  0 duplicate descriptions, no internal link to a URL outside the sitemap. Every guide now has 9–53 internal links per
  locale. validator.schema.org: 0 errors / 0 warnings on the homepage and a product page.
- IndexNow: all 192 sitemap URLs submitted, HTTP 200.
- Search Console URL Inspection: the ten guides spot-checked (EN and AR), `/en/b2c/categories/polish` and the AR
  shampoo and fragrance hubs are already indexed (the Pages report lags). `/en/b2c/categories/film` was crawled on
  23 Oct but not indexed; indexing was requested and it is in the priority crawl queue.
- Lab Web Vitals on production (iPhone 13 profile, no throttling, median of 3): LCP 1.4–1.7 s, CLS 0.000 on `/en`,
  `/en/b2c/ppf-installation`, `/en/b2c/products`, a product page and an AR guide. PageSpeed Insights' key-less API quota
  was exhausted all day, so there is no Lighthouse score in this record.
- Static pages are served from Vercel's `bom1` edge cache (`X-Vercel-Cache: HIT`). `/about`, `/contact`, `/privacy`
  and `/terms` are rendered per request in `iad1` (US East, `Cache-Control: private, no-store`) because they read the
  `abk_audience` cookie to pick the header variant: ~1.0–1.3 s TTFB from Qatar. Rendering them statically with the B2C
  header (and letting the client switch the header) would fix it; that is a product call because B2B visitors see a
  different header and cart today.
- Bing AI Performance: 20 Copilot citations in the last 30 days and no grounding-query rows yet; the 3- and 6-month
  views returned Bing's "momentary issue" error.

## 3. Open owner decisions (not changed in code)

- **Retail return policy.** Google asks for `hasMerchantReturnPolicy`; the site publishes none. Decide the policy
  (e.g. unopened items within N days), publish it on `/terms`, then add it to the Organization markup.
- **"Official & Exclusive Distributor" wording** (`messages/*.json` `heroTrustDistributor`, `distributorTitle`,
  `relationDistributor`, brand-hub titles, `llms.txt`). VTEK's contact page lists ABK's showroom but never says
  "exclusive". AI answer engines cross-check such claims; keep only what a brand page or document confirms.
- **Thin product pages.** About 20 product pages have under 550 words and generic copy ("Full specifications
  available on request"). Real data-sheet figures per product would give them something to rank for.

## 4. Access blockers

- **Google Business Profile:** Business Profile Manager shows 0 businesses for ceo.abktrading@gmail.com (and for the
  other Chrome profile). Name clean-up, the website field (`http://abktradingservice.com/` → `/en`), services,
  products and review requests all wait on finding the owning account or requesting ownership.
- **Search Console:** only the URL-prefix property exists; there is no Domain property (`sc-domain:`), so
  `www`/`http` variants are not reported. Adding one needs a DNS TXT record at Hostinger.

## 5. Next three actions

1. **Recover the Business Profile** and fix name, website URL, services and review requests (playbook:
   `PPF-LOCAL-AUTHORITY-AND-OUTREACH.md`). The local pack is where "ppf near me" and "best ppf in qatar" are decided.
2. **Get the guides and hubs indexed:** submit IndexNow after each deploy, request indexing in Search Console for the
   10 guides and the PPF page (about 10 a day), and re-check *crawled – not indexed* hubs in two weeks.
3. **Earn third-party corroboration:** a crawlable VTEK dealer listing linking to `/en/b2c/brands/vtek`, brand
   stockist listings (Autotriz, Briller, Grizzly) and Bing Places — ChatGPT is already the highest-converting
   referrer, and it grounds on Bing plus these sources.

## 6. Re-check in two weeks (6 Nov 2026)

- Search Console → Pages: indexed count (baseline 71) and the five *crawled – not indexed* URLs.
- Search Console → Merchant listings: `shippingDetails` warning gone.
- Search Console → Performance → Pages: guides' impressions (baseline above); `/privacy` should drop out.
- GA4 → Traffic acquisition: Organic Search and AI Assistant channel sessions vs. this 28-day baseline (309 / 66).
