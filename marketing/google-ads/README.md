# ABK Trading — Google Ads account

A complete, import-ready Google Ads account for `abktradingservice.com`:
campaigns, ad groups, keywords, negative keywords, responsive search ads and
extensions, in **English and Arabic**, plus the conversion tracking the account
was missing.

## What is in here

| | |
|---|---|
| Campaigns | **12** — 6 themes x English + Arabic |
| Ad groups | **58** |
| Keywords | **806** — de-duplicated so each lives in exactly one ad group |
| Negative keywords | **580** at ad-group/campaign level, plus a **357**-term shared list |
| Responsive search ads | **58** — 870 headlines, 232 descriptions |
| Extensions | 14 sitelinks, 16 callouts, 4 structured snippet sets |
| Landing pages | **128/128 verified 200** against live production |

Themes: b2b-wholesale, ceramic, interior-fragrance, polish-compound, ppf-tint, wash-care.

## Read this first: what I did not do

I built everything up to the import button. I did **not** touch the live Google
Ads account, because three things in that flow are not mine to do on your behalf:

| Step | Why not |
|---|---|
| The `action=OTP` verification on the link you sent | That is an identity/authentication step. I don't authenticate as you. |
| Adding or confirming a billing method | Entering payment details is off-limits for me, always. |
| Switching campaigns from Paused to Enabled | That commits real money and publishes public ads. That's your call, not a side effect of a script. |

Everything else — the strategy, the structure, every keyword, every line of ad
copy in both languages, the negative-keyword lists, the extensions, and the
site-side conversion tracking — is done and verified. **Every campaign imports
in `Paused` status by design.** Nothing can spend until you deliberately enable it.

## Order of operations

1. **[Set up conversion tracking](./CONVERSION-TRACKING.md) — do this first.**
   Every campaign uses *Maximize conversions*. Smart Bidding with no conversion
   data is just expensive guessing. The code is already live; you need to create
   four conversion actions and paste their labels.
2. Import the CSVs (below).
3. Set locations, ad schedule and budgets (they are not importable — see
   `import/06-campaign-settings-REFERENCE-ONLY.csv`).
4. Add the extensions (`07`–`09`).
5. Review the ads in the Google Ads UI.
6. Enable **one** campaign. Not all of them.

## Importing

Use **Google Ads Editor** (free desktop app), not the web UI — the web UI has no
bulk CSV import for this shape of data.

1. Download Google Ads Editor, sign in, and download your account.
2. **Account → Import → From file…**
3. Import the files **in numerical order**. Order matters: a keyword cannot be
   created before its ad group exists.

| File | What it creates |
|---|---|
| `import/01-campaigns.csv` | Campaigns (all Paused) |
| `import/02-ad-groups.csv` | Ad groups + default max CPC |
| `import/03-keywords.csv` | Positive keywords with match types |
| `import/04-negative-keywords.csv` | Negatives, ad-group and campaign level |
| `import/05-responsive-search-ads.csv` | The ads themselves |
| `import/06-campaign-settings-REFERENCE-ONLY.csv` | **Do not import.** Reference for the settings you apply by hand. |
| `import/07-sitelinks.csv` | Sitelink assets |
| `import/08-callouts.csv` | Callout assets |
| `import/09-structured-snippets.csv` | Structured snippet assets |
| `import/10-shared-negative-list.txt` | **Not a CSV import.** Paste into a shared negative keyword list. |

### The shared negative list

`10-shared-negative-list.txt` holds the account-wide negatives — service-intent
terms, job seekers, free/DIY searches, competitor brands and other traffic that
can only cost you money. Rather than duplicating them onto every campaign
(thousands of rows, and a nightmare to edit later), create one shared list:

**Tools → Shared library → Negative keyword lists → +** → paste the file
contents → save → **Apply to campaigns** → select all.

One list, edited in one place, applied everywhere.

Editor matches column headers automatically (capitalisation and spaces don't
matter). If it flags a column, pick the right one from the dropdown or set it to
*(ignore)*.

4. Review the proposed changes, then **Post**.

## The one rule every ad in here follows

**ABK supplies products. ABK does not install, tint, coat, polish or detail.**

`public/llms.txt` states this outright, and it shaped the whole account:

- No ad text promises fitting, application or a booking.
- Service-intent searches — "window tinting near me", "ceramic coating my car",
  "car detailing Doha" — are **negative keywords**, not targets. They are the
  highest-volume terms in this vertical and the most expensive way to buy
  visitors who will bounce.
- No prices anywhere, because the site publishes none. The offer is a WhatsApp quote.

This is enforced mechanically, not just by review: `build/assemble.mjs` fails the
build if any ad text matches a service-promise or price-claim pattern.

## Two things the exporter fixes for you

Both were found by review agents and are applied automatically on every rebuild:

- **77 duplicate keywords removed.** The six themes were written independently, so
  trade terms like "bulk car shampoo qatar" landed in three ad groups at once.
  Google only enters one ad per account into an auction, so this was never a
  bidding war — but it splits performance data and takes away control of which ad
  and landing page a query gets. The winner is the ad group with the most
  *specific* landing page (product page beats filtered catalogue beats bare hub),
  with ties going to the campaign matching the keyword's intent.
- **88 multi-word negatives moved from Broad to Phrase.** A negative *broad*
  keyword blocks whenever the query contains all its words in any order, which
  over-blocks unpredictably — a competitor negative like "armor all" can suppress
  your own "Weather Armor" searches. Explicit `Exact` declarations are left alone;
  the PPF theme relies on them so that a product query ("رول تظليل سيارات", a tint
  *roll*) is not blocked by the service phrase it happens to contain.

## Brands deliberately excluded

| Brand | Why |
|---|---|
| Insta Finish, Getsun, Sitrett | Owner decision (2026-08-30): stop promoting while remaining stock sells through. |
| Grizzly | Product photos exist in the repo but there are **no product pages**, so any ad would 404. |

The validator rejects any keyword, ad text or landing page referencing these.

## ⚠ The PPF range: ads point at the currently-live URLs

Your working tree contains an unshipped VTEK PPF range — five products
(`vtek-ppf-weather-armor-ultimate/pro/matte/prism`, `vtek-window-tints`)
replacing the two live ones. **That work is not committed and not deployed**, so
those pages currently 404 in production.

The PPF campaign therefore targets the URLs that are live today:

- `/b2c/products/vertek-ppf-weather-armor`
- `/b2c/products/vertek-window-tints`

This is safe in both directions: `next.config.ts` already defines 308 redirects
from the `vertek-*` slugs to the new `vtek-*` ones, so these ads keep working
after you ship that range. Once it is live, re-point the ad groups at the four
specific PPF products for better message match — four dedicated ad groups will
outperform one generic one.

Every landing URL in the account was checked with a real HTTP request against
production: **128/128 returned 200.**

## Three things on the site that need your decision

These are site content questions, not ad questions — but the ads inherit them,
so they need answering before spend.

### 1. One product publishes a price

`autotriz-one-step-finish` carries `Price=QAR 280 (Box rate: QAR 250 each)` in
its specs, and it renders on **both** live pages:

- `/en/b2c/products/autotriz-one-step-finish` → "QAR 280 (Box rate: QAR 250 each)"
- `/ar/b2c/products/autotriz-one-step-finish` → "٢٨٠ ر.ق (سعر الكرتون: ٢٥٠ ر.ق للواحدة)"

That contradicts `public/llms.txt:20`, which tells crawlers and AI assistants
"product pages carry no public prices". **Four ad groups** land on that page
(the EN and AR One Step Finish groups in both the ceramic and polish campaigns),
each running "ask on WhatsApp for a quote" copy against a page that shows a price.

Either the price is intentional — in which case `llms.txt` is wrong and should
be corrected — or it is a leftover and should come out. I have not changed it:
that is a pricing decision, not a copy fix.

### 2. "Supplied cut to size" — is that a service?

The live tint page says the film is **"supplied cut to size"**, and the PPF page
says it is **"cut for full-body, front-end, or custom areas"**. The ads repeat
that language, so ad and landing page agree.

But if ABK actually plotter-cuts film to a customer's vehicle, that *is* work
performed — which sits awkwardly beside "we supply, we don't fit". If the film
is simply sold in pre-cut standard sizes, the wording is fine. Worth confirming,
because if it is wrong it is wrong on the website too, which is the bigger
exposure.

### 3. "Lifetime peel warranty" needs a backer

The live tint page carries a **lifetime peel warranty on the film**. The ads do
not lead on it, but it is on the page. A film warranty is normally the
manufacturer's and is typically void without professional installation — which
ABK does not do. Confirm who honours it before it becomes a dispute.

Related: the tint page also states **"compliant with Qatar regulations"** and
names VLT grades. No ad repeats that claim, deliberately — Qatar restricts
front-glass tint and public sources disagree on the current limit. The page
claim is the larger exposure and deserves the same check.

## Arabic needs a native review

Roughly half this account is Arabic, written as Modern Standard Arabic by Claude
and reviewed by a second AI pass for fluency and character limits. The repo
README already flags all site Arabic as *"DRAFT — native speaker review required
before launch"*. The same applies here, and it matters more in ads: a clumsy
Arabic headline costs money on every impression.

**Have a native Gulf Arabic speaker read `import/05-responsive-search-ads.csv`
before enabling the `| AR |` campaigns.** The English campaigns can run
immediately.

## Suggested launch sequence

Do not enable everything at once. You will learn nothing and spend fast.

| Week | Enable | Daily budget |
|---|---|---|
| 1 | One English campaign only — the one closest to your best-selling line | Start low; let it gather ~15–20 conversions |
| 2 | Add a second English campaign | Raise the first if CPA is acceptable |
| 3 | Add the B2B / wholesale campaign | Different audience, different economics |
| 4 | Add Arabic, after the native review | Mirror the English budgets |

**Switch bid strategy deliberately.** *Maximize conversions* needs conversion
history to work. For the first ~2 weeks, if volume is thin, consider *Manual CPC*
or *Maximize clicks* with a bid cap, then switch once you have 30+ conversions
in 30 days.

### What to check after week 1

- **Search terms report** (not the keyword report) — this shows what people
  actually typed. Every irrelevant term you find becomes a new negative. This is
  the single highest-value hour you will spend on the account.
- Any ad group with a **Below average** ad relevance or landing page experience.
- Whether service-intent queries are leaking through despite the negatives.

## Rebuilding after an edit

The CSVs are generated, not hand-maintained. Edit the JSON under
`build/campaigns/`, then:

```bash
node marketing/google-ads/build/assemble.mjs
```

It validates before it writes, and **writes nothing if anything fails**. It checks
character limits (headline ≤30, description ≤90, path ≤15, callout ≤25, sitelink
text ≤25 / description ≤35), that every landing URL is a page the site actually
serves in the right locale, that no unpromoted brand appears, and that no ad text
promises a service or a price.

To re-check landing pages against production:

```bash
node marketing/google-ads/build/check-urls.mjs
```

To regenerate the catalogue after deploying product changes:

```bash
git show HEAD:src/data/products.ts > marketing/google-ads/build/products.live.ts
node --experimental-strip-types marketing/google-ads/build/extract-catalogue.mjs
```

Note it reads from `HEAD`, not your working tree — deliberately, so ads can only
ever target pages that are actually deployed.
