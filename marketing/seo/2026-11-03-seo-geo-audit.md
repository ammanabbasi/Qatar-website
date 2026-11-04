# SEO / GEO audit — 3 November 2026

Follow-up to `2026-10-23-seo-geo-audit.md`. Sources: GA4, Search Console, Bing Webmaster Tools (all read in the ABK Chrome
profile), a live crawl of all 192 sitemap URLs, Google in Qatar (`gl=qa`), Google AI Mode, Al Meezan, Hukoomi and the code.
The repository is public: no ad spend, cost or margin figures belong here.

## 1. Is traffic really down?

Yes for Qatar, but not because of search. GA4, 27 Oct–2 Nov against 20–26 Oct:

| Qatar active users | Before | After | Change |
|---|---|---|---|
| All channels | 138 | 106 | −23% |
| Direct | 37 | 8 | −78% |
| Paid search | 47 | 33 | −30% |
| **Organic search** | **22** | **39** | **+77%** |
| AI assistants | 26 | 25 | −4% |

- The site total looks flat (239 → 242 sessions) only because about 61 users from France, Poland and `(not set)` arrived with
  no engagement time. 40 direct sessions on 28 Oct averaged 4 seconds. Judge traffic by the Qatar line.
- Paid: PPF Installation budgets (EN and AR) were reduced by hand in Google Ads on 22–23 Oct, and Campaign #1 raised. Paid
  sessions went from about 75 a week to 50.
- Direct: 130 → 96 → 72 → about 47 a week (without the 28 Oct bot day). The earlier weeks were low quality (35% engaged), so
  part of this is likely internal visits and shared links rather than customers. GA4 has no internal-traffic filter to prove it.
- Key events fell from 24 to 13 in the week, on small numbers. Organic and AI assistants still produce most of them.
- Organic per week since the 9 Oct spike: 168, 68, 51, 68. Google clicks are rising: 45 in the last 6 days of data.

## 2. Findings by area

### Technical

| Check | Result |
|---|---|
| Crawl | 192/192 URLs 200, self-canonical, one H1, valid JSON-LD, hreflang matches the sitemap, no duplicate titles or descriptions, no internal link outside the sitemap. HTTP and `www` 308 to the apex. |
| AI and search bots | GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Googlebot, bingbot, Google-Extended and meta-externalagent all get 200. |
| **Crawl waste** | Crawl stats: 71% of Googlebot's 2,150 requests were "other file type", overwhelmingly `?_rsc=` Next.js prefetch payloads (each page rendered triggers 15–37). HTML was 13%, discovery 3%, about 8–15 HTML pages a day, and about 10% of those were catalogue filter URLs that canonicalise elsewhere. |
| **Indexing** | 106 indexed, 106 not. 94 are *Discovered, currently not indexed* (report dated 22 Oct). URL Inspection confirmed `/en/b2c/categories/ceramic` is still not crawled on 3 Nov. That hub ranks nowhere in the top 8 for "ceramic coating qatar". |
| Rendering | About, Contact, Privacy and Terms were rendered per request in US East because they read one cookie. |
| **Core Web Vitals** | Search Console shows no data, but PageSpeed has real-user data for `/en` on mobile: **fails** (LCP 2.9 s, FCP 2.9 s, **TTFB 1.4 s**, CLS 0, INP n/a). Lighthouse mobile: performance 65, SEO 100, accessibility 100. Desktop: 98. Causes found: the locale proxy ran on every page view (TTFB 1.09 s from Bangalore, 0.2 s from New York), and the home `<head>` preloaded 16 images and 5 fonts, including 4 Arabic fonts on English pages and below-the-fold shelf images. |
| Rich results | Product snippets 4 valid, merchant listings 2 valid, breadcrumbs 24 valid, 0 invalid. |

### Content and accuracy

The most important finding of this audit. AI Mode now cites abktradingservice.com heavily on brand questions and repeats what it reads.

- **Window tinting guide (first on Google Qatar for "Qatar MOI car window tint legal percentage fine traffic department", 441 impressions and
  18 clicks since 16 Oct).** It stated 20% / 80% VLT on front
  windows and fines of QR 1,000–3,000. The published law says otherwise (section 3).
- **Homepage stats** (1000+ products, 50+ brands, 1000+ clients, 5★) came from a design mockup (commit bd7769c). The catalogue has
  58 products and 9 brand hubs, and Google shows 4.9★ from 11 reviews.
- **Dealer page** (1000+ SKUs, same-day dispatch, climate-controlled stock, exclusive applicator status), added by a September SEO pass.
- **Installer guide** still claimed clean booths, medical-grade filtration, aliphatic TPU and "middleman" markups, the wording AI Mode
  was quoting. The live PPF page was already clean.
- **Ceramic price brackets** were presented as market fact. Few studios publish a price.
- **The outreach playbook** carried the same old claims plus a phone and email that do not match the site.
- Thin: about 3 product pages still say "Full specifications available on request".

### Authority and AI visibility

| Test (3 Nov) | Result |
|---|---|
| Brand questions, Google AI Mode | ABK understood and cited, including the separation from an unrelated Qatari produce trader named ABK. |
| "Best place to get PPF in Doha", AI Mode | ABK absent. The answer is built from Maps listings by rating and review count (53 to 1,100 reviews against ABK's 11). |
| "Who sells VTEK PPF in Qatar", AI Mode | ABK named first, with published prices. |
| Bing backlinks | None known to Bing. Top Bing recommendation: too few links from quality domains. |
| AI referrals, GA4 (28 days) | 94 sessions, 93 from ChatGPT, 8.5% key-event rate, the best channel. ChatGPT landing on the PPF page: 14.3%. No Perplexity, Gemini or Copilot referrals. |
| Citations, Bing AI Performance | 24 in 39 days. No grounding-query rows yet. |
| Perplexity | Could not be tested: it asks for a sign-in. |

### Local and multilingual

- Name, address and phone agree between the website, Google Maps and VTEK's contact page.
- 76% of Search Console impressions are from Qatar. `en`, `en-QA`, `ar`, `ar-QA` and `x-default` are consistent between pages and sitemap. `lang` and `dir` are correct.
- Arabic pages are 50 of the 94 not yet crawled. Arabic search demand is small, so they follow the English pages in priority.
- Equipment10 lists street and building numbers swapped. Google Maps showed "Closed" at about 21:00 on a Tuesday when the site says open until 22:00.

### Measurement

GA4 has an AI Assistant channel and working key events. Traffic is polluted by zero-engagement bots, so reports should add Qatar as a comparison.
Search Console has data only since 17 Oct. Bing's session had expired and works again through Google sign-in.

## 3. Window tint: what the law says (read on Al Meezan, 3 Nov 2026)

- Decree-Law 19 of 2007, **Art. 69**: no means of concealing vehicle glass without a written permit.
- Decision 6 of 2010, **Art. 75**: the Traffic Department may permit shaded, non-reflective film on **rear side door glass only**, excluding the
  front side doors, windscreen and rear screen. **Art. 76**: whole-car film only on a medical report or for certain government and diplomatic vehicles.
  Neither text gives a percentage.
- **Art. 95** (amended 2015): one week to one year in prison, a fine of QR 3,000–10,000, or either. **Art. 88**: impoundment up to 90 days.
- Hukoomi: permit fee QR 20, immediate, also on Metrash.
- Shops and guides quote 10%, 20%, 30% and 50% and disagree with each other. Practice may differ from the published text, so the guide says so and
  tells readers to confirm with the Traffic Department. If ABK holds written MOI guidance on percentages, add it to the guide with its source.

## 4. What changed (commits 006b5ce, 5a19db7)

**Established practice**
- robots.txt blocks `_rsc`, catalogue filter URLs and `/api/` in all 24 user-agent groups, following Google's faceted-navigation guidance.
- Internal links: homepage guide section, footer guide list, PPF page guide block, three more brand hubs in the footer, homepage brand cards to hubs.
- Static rendering for the four trust pages. Alt text on shelf tiles and gallery thumbnails. Sitemap `lastmod` per changed page.
- Speed: the locale proxy no longer runs on `/en` and `/ar` pages (313333c). Functions moved to Mumbai, the nearest Vercel region to Qatar (9cd162c). Home preloads 2 images and 1 font instead of 16 and 5 (b4c4f6e).
- Corrections in section 2, with visible updated dates, an author line and linked sources on guides.

**Reasonable but unproven for AI visibility** (Google says AI Overviews and AI Mode need no special markup or files)
- `citation` on Article schema, identity facts on the Organization node on every page, `llms.txt` regenerated.
- Plain, sourced statements and comparison tables, which answer engines can quote.

## 5. Verification

Before shipping, on the production build: robots rules tested for 24 URLs across 7 crawlers; 15 pages compared in headless Chrome with
and without `_rsc` requests (same H1, text and links, no console errors, no horizontal overflow on a 390 px phone); `tsc`, ESLint and `next build` clean.

Live on production, 3 Nov 2026 (commit 5a19db7):

- 192/192 sitemap URLs 200, self-canonical, 0 duplicate titles or descriptions, no internal link outside the sitemap, hreflang identical to the sitemap.
- About, Contact, Privacy and Terms: `X-Vercel-Cache: HIT`, 41–87 ms from this machine (was `private, no-store`, about 1 s).
- Internal links per guide: 96 (was 9–19). Homepage links 6 guides and 9 brand hubs, with no `?brand=` links left.
- Pages with an image missing alt text: 2 (the decorative home hero, EN and AR), was 30.
- Homepage shows 58 products, 9 brands, QAR 200 free delivery, 4.9★ (11 reviews). `llms.txt` carries the Art. 75 rule.
- All tested search and AI crawlers get 200. IndexNow: all URLs with a 3 Nov lastmod submitted, HTTP 200.
- validator.schema.org on the tint guide: 0 errors, 0 warnings.
- Routing, production: 29 cases pass (localeless paths, Arabic negotiation, language cookie, legacy redirects, 404s, assets). The language switch still sets `NEXT_LOCALE` and `/` honours it. Page responses no longer set a cookie.
- Search Console: indexing requested and confirmed for the tint guide (EN, AR), `/categories/ceramic`, `/categories/shampoo`, `ppf-vs-ceramic-coating-qatar`, `best-ppf-installers`, `/b2b/become-a-dealer` and `/en`. `/brands/autotriz` and `/about` were sent in a batch whose confirmation was lost; inspected again that evening, both show a 3 Nov crawl and "Page is indexed", though they were on the 22 Oct uncrawled list. The daily quota then ran out, so the remaining pages go through a daily routine at about 10 requests a day. robots.txt recrawl requested.

TTFB on `/en` (KeyCDN; no Qatar test point exists, Bangalore is the closest):

| From | Before, with proxy | After, warm edge | After, cold edge |
|---|---|---|---|
| Bangalore | 1,090 ms | 301 ms | 598 ms |
| Singapore | 1,230 ms | 328 ms | 778 ms |
| Sydney | 1,100 ms | 282 ms | 1,420 ms |
| Frankfurt | 738 ms | 174 ms | 742 ms |
| New York | 225 ms | 109 ms | 424 ms |

Cold figures were taken on a different page right after the Mumbai deploy, so they are indicative. Lighthouse mobile performance read 65 before and 68–71 after: too noisy to claim a precise gain, and its simulated LCP (about 8 s) is far above the 2.9 s real users report. Real-user data updates over 28 days.

Not measurable yet: rankings, crawl share and indexing respond over days to weeks (section 7).

## 6. Needs the owner

1. **Google Business Profile access** (0 businesses under ceo.abktrading). Name, hours, services and review requests all wait on this. It decides the "best PPF" AI answers.
2. **Google Ads budgets.** Your call: the best-converting campaign has the smallest budget. Campaign #1's keywords still land on `/en`.
3. **"Official & Exclusive Distributor"** (home page, dealer tiers). VTEK's pages do not say it. Keep it only with agreements on file.
4. **Dealer tiers:** masterclasses, rebates, branded displays, next-day delivery, 5 GCC freight corridors: confirm you offer these, or remove them.
5. **Solar Armor ICONIC:** VTEK's warranty chart lists CORE, VUE and APEX, not ICONIC. Confirm the name and the 10-year term.
6. **Same-day delivery.** About ten pages and `llms.txt` promise it, while the shipping markup says times are confirmed per order and never promised. Confirm which is true. The dealer page no longer says it.
7. **PRO PLUS 12 vs 10 years**, real photos and a retail return policy remain open from earlier audits.
8. **Commercial registration number** on the site, if you are willing to publish it: a strong, checkable identity signal in Qatar.

Smaller items left alone: unknown URLs get Next's bare default 404 rather than the branded page; every page's HTML carries all translation strings (about 57 KB raw), worth splitting by namespace; the Google tag loads at startup and could wait for page load, but it feeds Ads conversions, so change it only with a before-and-after check.

## 7. Re-check on 17 November 2026

- Search Console → Settings → Crawl stats: `_rsc` share should fall and HTML share should rise. The window still includes days before the fix, so also check that the "other file type" examples show no `_rsc` URLs after 5 Nov.
- Search Console → Pages: indexed count (baseline 106) and *Discovered* (baseline 94).
- Google with `gl=qa`: "ceramic coating qatar" (baseline: not in top 8), "ppf qatar" (baseline: first organic result).
- AI Mode: the brand question should stop saying 12-year warranty and clean booths. Tint questions should reflect Art. 75.
- PageSpeed real-user data for `/en` on mobile: TTFB (baseline 1.4 s), LCP (baseline 2.9 s). Full effect after 28 days.
- GA4 with a Qatar comparison: organic (baseline 39 users a week), AI assistants (25), direct (8), paid (33).
