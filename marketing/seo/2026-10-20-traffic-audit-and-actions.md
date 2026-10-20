# Traffic audit and action log — 20 October 2026

Scope: why GA4 showed sessions down ~40% week-on-week, what was fixed, what is still open and which external
actions matter most. Figures are from GA4 (property `abk`), Search Console, Bing Webmaster and live checks made
on 20 Oct 2026. No private cost data belongs in this file (the repository is public).

## 1. Verdict

The drop is the previous week's spike unwinding, not a defect.

| Organic Search sessions per day | Sessions |
|---|---|
| 14–29 Sep (typical day) | 1–7, mean ≈ 3 |
| 30 Sep – 5 Oct | 4–8, mean ≈ 5.5 |
| 6–12 Oct | 16, 10, 26, **56**, 22, 18, 20 |
| 13–18 Oct | 12, 8, 13, 10, 6, 15 (mean ≈ 10.7) |

- 13–19 Oct: 238 sessions vs 429 the week before (−44.5%). Organic −61%, direct −35%, paid −5%, Instagram −96%
  (a one-off), ChatGPT referrals 12 vs 19.
- The 9 Oct peak (56 organic sessions) was Qatar + Safari + landing page `/en`; GA4 flagged it as an anomaly. The
  current level is still about twice the pre-spike baseline.
- Live crawl of all 188 sitemap URLs on 20 Oct: every page 200, self-canonical, one H1, valid JSON-LD, head hreflang
  identical to the sitemap, no `noindex`, no duplicate titles. No technical regression.
- Search Console only exists for this domain since 17 Oct (sitemap submitted that day, 188 pages discovered);
  there is no history to compare against. 15 clicks / 185 impressions in the first two days, average position 6.5,
  almost all branded.
- Rankings in Qatar (Google, `gl=qa`): "ppf price qatar" — ABK guide #2 and homepage #4 plus an ad; "ceramic coating
  price qatar" — ABK guide #1; "best ppf in qatar" — homepage is the first web result but the local pack is all
  installers with 150–342 reviews.

Traffic mix, 14 Sep – 19 Oct (1,026 sessions): direct 309, Google organic 296 (75% engaged, 1m01s average — the best
channel), Google Ads 270 (19s average), ChatGPT 59, Instagram 35. Key events: 6 (4 direct, 2 paid, 0 organic).

## 2. What changed in the code (commits 283e433, 93d735a and the follow-up)

- Bare domain now answers with a 308 to `/en` (was 307) unless the visitor asks for Arabic; every legacy `/b2b`
  route is a single hop (the `/b2b/products` chain was two hops).
- Every `<title>` fits ~60 characters (median 72 → 57) and every meta description is ≤158; the brand suffix is only
  added when it fits. The H1s keep their full length.
- Warranty copy reconciled to **5–12 years by film** and coverage wording aligned with VTEK's warranty page
  ("defects such as bubbling, cracking, peeling and fading").
- New guides, EN + AR, with crawlable tables and FAQ schema: `matte-colored-ppf-qatar` and `best-ppf-brands-qatar`
  (warranty terms read from each manufacturer's site on 20 Oct 2026).
- The Doha PPF comparison on `/b2c/ppf-installation`, `llms.txt` and `llms-full.txt` previously quoted competitor
  prices that no provider publishes (and the two files disagreed). They now read `src/data/ppfMarket.ts`: only
  statements the provider publishes itself, with URL and date. `llms*.txt` also read installed prices from
  `src/data/ppfInstall.ts` instead of hand-typed copies.
- A link to VTEK's own contact page, which lists ABK's Mesaimeer showroom in its Qatar block, now sits next to the
  other official-verification links on the PPF page.

## 3. Open decisions for the owner

1. **PRO PLUS "12-year" warranty.** VTEK's public warranty page lists ULTIMATE 15, PRO 10, MATTE 5, PRISM 5 (NEX 5)
   and shows no 12-year film; its "PRO+" card says 10 years. The site still claims 12 years for PRO PLUS in several
   places (`ppfInstall.ts`, `products.ts`, `faq.ts`, `messages/*.json`, price list, llms). Confirm against a VTEK
   document you hold, or change it to what VTEK publishes.
2. **Film specifications.** VTEK's FAQ states Weather Armor PRO = 8.0 mil and Ultra/Matte/Black = 6.5 mil, and VTEK
   never calls its film "aliphatic". The site says PRO and ULTIMATE 7.5 mil, MATTE 8 mil, and "aliphatic TPU".
   Replace with the figures on your VTEK data sheets.
3. **"Official / authorised distributor".** VTEK's contact page lists ABK's showroom address and phone but does not
   use the word "distributor"; its installer locator loads no static entries. Ask VTEK for a crawlable dealer
   listing (template in `PPF-LOCAL-AUTHORITY-AND-OUTREACH.md`, section 4).
4. **Google Business Profile access.** The listing exists (4.9★, 11 reviews, *Car accessories store*) but the
   Business Profile Manager in both available Chrome profiles shows 0 businesses. Find the Google account that owns
   it (or request ownership) before anything below can be applied.
5. **Paid landing page.** 211 of 270 paid sessions landed on `/en` with 12s engagement and no conversion; the 25 that
   landed on `/en/b2c/ppf-installation` produced both paid conversions. Point Campaign #1's responsive search ad at
   `https://abktradingservice.com/en/b2c/ppf-installation` (its keywords are PPF-led) and keep ceramic/brand keywords
   on the matching category or brand hub. The Ads tab froze under automation, so this was not changed.

## 4. External authority — top three, in order

1. **Fix and fill the Google Business Profile.**
   - Name: the listing reads "ABK Trading and Service — Vertek & Autotriz". Google expects the real-world name; extra
     keywords and the retired "Vertek" spelling risk suspension. Use "ABK Trading & Service".
   - Add Services/Products from section 3 of `PPF-LOCAL-AUTHORITY-AND-OUTREACH.md` (PRO prices only until decision 1
     is settled), each linking to `/en/b2c/ppf-installation`. Add opening hours, the WhatsApp number and photos of the
     showroom and film samples.
   - Reviews are the local-pack gap (11 vs 150–342): send every happy customer the message below after handover.
2. **Ask for reviews, every time, without incentives.** Google prohibits paying for or conditioning reviews.
   - EN: "Thank you for choosing ABK Trading & Service. If you're happy with your order, a short Google review takes
     30 seconds and helps other drivers in Qatar find us: <review link from the GBP dashboard>"
   - AR: "شكراً لاختيارك ABK للتجارة والخدمات. إن كنت راضياً عن طلبك فتقييم قصير على Google يستغرق 30 ثانية ويساعد
     سائقين آخرين في قطر على إيجادنا: <رابط التقييم>"
3. **Earn links that prove the claims.**
   - VTEK: a crawlable dealer/installer listing linking to `/en/b2c/brands/vtek` (template in the playbook).
   - Brand stockist pages: Autotriz, Briller, Grizzly and Getsun each list where to buy; ask for ABK to be listed with a
     link to its brand hub (`/en/b2c/brands/<brand>`).
   - Community: Reddit threads (r/qatar, r/QatarCarEnthusiasts) rank on page one for "best ppf in qatar". Answer with
     the published price table, disclose that ABK sells VTEK, and link the guide where it is genuinely useful.

Directories (Qatar Living, Yellow Pages Qatar, Marhaba Qatar, Bing Places): keep name, address and phone identical to
the website; use the bilingual descriptions in the playbook. Bing Places should list the same Services/Products.

## 5. Weekly check (10 minutes)

1. GA4 → Traffic acquisition, last 35 days, add secondary dimension *Date*, filter Organic Search. Judge against the
   5-week series, never week-on-week.
2. Search Console → Performance (queries/pages) and Pages (indexing) once the report is populated; request indexing
   for new guides (about 10 URLs a day).
3. Bing Webmaster → AI Performance (Copilot citations were 20 between 24 Sep and 18 Oct).
4. Google with `&gl=qa` for: ppf price qatar, best ppf in qatar, ceramic coating price qatar, matte ppf qatar,
   xpel ppf qatar. Note ABK's positions.
5. After shipping content: `npm run indexnow -- --since <date>`.
