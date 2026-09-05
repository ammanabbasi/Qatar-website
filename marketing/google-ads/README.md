# ABK Trading — Google Ads account

A complete, import-ready Google Ads account for `abktradingservice.com`:
campaigns, ad groups, keywords, negative keywords, responsive search ads and
extensions, in **English and Arabic**, plus the conversion tracking the account
was missing.

## What is in here

| | |
|---|---|
| Campaigns | **12** — 6 themes x English + Arabic |
| Ad groups | **70** — one per PPF grade, plus tint and the new 20L chemicals |
| Keywords | **1,008** — de-duplicated so each lives in exactly one ad group |
| Negative keywords | **816** at ad-group/campaign level, plus a **343**-term shared list |
| Responsive search ads | **70** — 1,050 headlines, 280 descriptions |
| Extensions | 14 sitelinks, 16 callouts, 4 structured snippet sets |
| Landing pages | **200/200 verified 200** against live production |
| Bid strategy at launch | **Manual CPC**, using each ad group's own max CPC |
| Budget if every campaign were enabled | **310 QAR/day** ≈ 9,300 QAR/month — don't; enable one at a time |

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
   The code is already live; you need to create three conversion actions (a fourth, catalogue download, is dormant — see below) and
   paste their labels. Nothing else works properly without it: you cannot judge
   a campaign, and you cannot later switch to Smart Bidding, without conversions.
2. Import the CSVs (below), in filename order.
3. Set locations, the location option (**Presence** only — see the
   account-settings table below), ad schedule and budgets by hand — these are
   not importable. Values are in `campaign-settings.csv`.
4. Paste the shared negative list and apply it to all campaigns.
5. Review the ads in the Google Ads UI.
6. Enable **one** campaign. Not all of them — all twelve at their listed budgets
   is 310 QAR/day.

## Importing

Use **Google Ads Editor** (free desktop app), not the web UI — the web UI has no
bulk CSV import for this shape of data.

1. Download Google Ads Editor, sign in, and download your account.
2. **Account → Import → From file…**
3. Import the files **in numerical order**. Order matters: a keyword cannot be
   created before its ad group exists.

Everything in `import/` is meant to be imported, in filename order. Nothing else
lives there — the settings sheet you apply by hand sits outside it, so there is
no file in that folder you have to remember *not* to import.

| File | What it creates |
|---|---|
| `import/01-campaigns.csv` | Campaigns (all Paused, Manual CPC) |
| `import/02-ad-groups.csv` | Ad groups + their max CPC |
| `import/03-keywords.csv` | Positive keywords with match types |
| `import/04-negative-keywords.csv` | Negatives, ad-group and campaign level |
| `import/05-responsive-search-ads.csv` | The ads themselves |
| `import/06-sitelinks.csv` | Sitelink assets |
| `import/07-callouts.csv` | Callout assets |
| `import/08-structured-snippets.csv` | Structured snippet assets |
| `import/09-shared-negative-list.txt` | **Not a CSV import.** Paste into a shared negative keyword list. |
| `campaign-settings.csv` *(outside `import/`)* | Reference only. Locations, location option, schedule, budget and bid-strategy target, applied by hand. |

### The shared negative list

`09-shared-negative-list.txt` holds the account-wide negatives — service-intent
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

## Account settings to check before you enable anything

None of these can be imported, every one of them costs money if left at
Google's default, and the last two were declared in `build/assets.json` from the
start but never made it into this runbook until now.

| Setting | Where | Set it to | Why |
|---|---|---|---|
| Account currency | Billing → Settings | Must be **QAR** | Every budget and bid in these files is a QAR figure. Imported into a USD account, "35" becomes $35/day — 3.6× the intended spend, across all twelve campaigns. Currency cannot be changed once an account exists; if it is wrong, create the account again before importing. |
| Location option | Each campaign → Settings → Locations → *Location options* | **Presence** (people in or regularly in your targeted locations) | Google's default, *Presence or interest*, also serves people outside Qatar who merely searched about it — in the Gulf that is the diaspora searching from India, Pakistan, Egypt and the Philippines. ABK is a Doha stockist; they cannot buy. This is the single largest source of wasted clicks in a GCC account left at defaults, and it applies to the six-country B2B campaigns too. |
| Auto-apply recommendations | Tools → Recommendations → *Auto-apply* | **All off** | Left on, Google adds broad-match keywords, expands targeting and raises budgets without asking. Each of those undoes a deliberate decision in these files — there is not one broad-match keyword in the account, on purpose. |
| Automatically created assets | Each campaign → Settings → *Automatically created assets* | **Off** | Google would write extra headlines from the landing-page text. Nothing it writes passes the validator, so it could reintroduce a spec that has since changed, or a phrase that reads as a service. |
| Call asset | Assets → Calls → **+** | `+974 3083 8355`, **Use call reporting: on** | Adds a tap-to-call button to the ad itself on mobile. Google reports those as **Calls from ads** — the one conversion that works with zero site code, so the account gets data from day one while the website labels are still being set up. Phone numbers are not allowed inside ad text, which is why no ad carries one; this is the sanctioned place. |
| Location asset | Tools → Linked accounts → Google Business Profile, then Assets → Locations | Link the *ABK Trading and Service* profile | Shows the Mesaimeer address and map pin under the ad. Free, and the strongest "we are physically here" signal a search ad can carry. |

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

## What the exporter changes, and what it deliberately doesn't

**77 duplicate keywords removed.** The six themes were written independently, so
trade terms like "bulk car shampoo qatar" landed in three ad groups at once.
Google only enters one ad per account into an auction, so this was never a
bidding war — but it splits performance data across ad groups and takes away
control of which ad and landing page a query gets. The winner is the ad group
with the most *specific* landing page (product page beats filtered catalogue
beats bare hub), with ties going to the campaign matching the keyword's intent.
Spot-checked: `vtek ppf` stayed in the PPF flagship ad group, `paint protection film
supplier qatar` went to the trade one.

**10 negatives demoted out of the shared list.** The account-wide list is the
union of what all six themes contributed independently, and a term safe for one
theme is lethal to another. Tested against every keyword, it would have
suppressed 19 of them — `kuwait` and `bahrain` killing the B2B GCC terms in the
one campaign that targets those countries, `install` killing "ppf supplier for
installers", and `تظليل سيارات` killing `رول تظليل سيارات` (a tint *roll*).
Offenders are demoted to campaign-level negatives on only the campaigns where
they block nothing, so the protection survives where it works. Both scopes
verify at zero self-blocks on every build.

**Negative match types are left exactly as written — this was a corrected
mistake.** An earlier version of this script rewrote all 88 multi-word `Broad`
negatives to `Phrase`, justified by the claim that a competitor negative like
"armor all" could suppress our own "Weather Armor" queries. That is impossible:
a negative broad keyword only blocks when the query contains **all** its words,
and "vertek weather armor" does not contain "all". Testing every multi-word
Broad negative against every positive keyword found **zero** cases where any
negative would block one of our own terms — so the rewrite fixed nothing, while
making 88 negatives leak junk traffic, since broad blocks a superset of phrase.
Reverted. The build now prints the count as a note instead, for review against
the search terms report.

## Brands deliberately excluded

| Brand | Why |
|---|---|
| Insta Finish, Getsun, Sitrett | Owner decision (2026-08-30): stop promoting while remaining stock sells through. |
| Grizzly | Product photos exist in the repo but there are **no product pages**, so any ad would 404. |

The validator rejects any keyword, ad text or landing page referencing these.

## The PPF range, after the VTEK rename

Commit `21c382a` shipped the five-SKU VTEK range, replacing the two Vertek
products. The campaign has been rebuilt for it, and each grade now gets its own
ad group and its own landing page instead of sharing one generic page:

| Ad group | Lands on | Sells on |
|---|---|---|
| Weather Armor ULTIMATE | `vtek-ppf-weather-armor-ultimate` | 8.5 mil polycarbonate TPU, 10-year warranty |
| Weather Armor PRO | `vtek-ppf-weather-armor-pro` | 7.5 mil aliphatic TPU, optical clarity |
| Weather Armor MATTE | `vtek-ppf-weather-armor-matte` | satin non-reflective finish |
| Weather Armor PRISM | `vtek-ppf-weather-armor-prism` | six named colours — a different buyer entirely |
| Solar Armor tint | `vtek-window-tints` | 65% TSER, 99% UV, MOI-compliant grades |

Every claim comes from the shipped spec sheet in `src/data/products.ts`; the
build fails on any that doesn't.

**Ad text says VTEK. Keywords still bid on "vertek".** The site itself frames the
change as "VTEK (formerly Vertek)", and the old URLs 308-redirect, so people will
keep searching the old spelling for a while. 16 keywords retain it deliberately;
the exporter now *fails the build* if any ad text names a brand with no products
in the deployed catalogue — which is how the eight stale "Vertek" assets left in
the B2B ad groups were caught.

Every landing URL was checked with a real HTTP request against production:
**140/140 returned 200**, including all four new PPF pages.

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

### Why 23 Arabic keywords are in Latin script

6% of the Arabic campaigns' keywords are Latin brand and SKU names —
`vertek ppf`, `autotriz heavy cut 901`, `briller multipurpose cleaner` — and the
same strings also appear in the English campaigns. That is deliberate, not a
duplicate that escaped de-duplication.

Gulf buyers routinely type Latin brand names regardless of interface language.
Keeping the terms on both sides means an Arabic speaker searching `vtek ppf` can
still be served the Arabic ad and the `/ar/` page. Only one ad per account enters
any auction, so there is no double-spend — the cost is slightly murkier
attribution on these 23 terms, which is the right trade.

### Why every campaign targets both languages

Google's language targeting keys off the user's **interface language**, not the
language of the query — and in Qatar, an Arabic-interface phone typing an English
query is everyday behaviour. If the English campaigns targeted only "English",
that user would match **no campaign at all**: a silent coverage hole over a large
slice of the market.

So all twelve campaigns target English **and** Arabic, and the keywords do the
routing instead — an Arabic keyword can only ever match an Arabic query. The one
side effect: the 23 shared Latin brand terms above now route by Ad Rank rather
than interface language, which is acceptable because either language's ad is a
fair answer to `vtek ppf`.

## Suggested launch sequence

Do not enable everything at once. You will learn nothing and spend fast.

| Week | Enable | Daily budget |
|---|---|---|
| 1 | One English campaign only — the one closest to your best-selling line | Start low; let it gather ~15–20 conversions |
| 2 | Add a second English campaign | Raise the first if CPA is acceptable |
| 3 | Add the B2B / wholesale campaign | Different audience, different economics |
| 4 | Add Arabic, after the native review | Mirror the English budgets |

**Bid strategy: launch on Manual CPC, switch later.** Every campaign imports as
*Manual CPC*, using the max CPC set on each ad group (1.75–5.50 QAR depending on
how competitive the theme is).

The themes were authored specifying *Maximize conversions*, and that is the right
destination — but not the right starting point. Smart Bidding has no conversion
history to learn from in a new account, so it bids blind and spends the full
daily budget gathering data. It would also make every ad group's hand-set max CPC
inert. Manual CPC keeps spend predictable and those bids meaningful.

**Switch to Maximize conversions as one portfolio strategy, once the enabled
campaigns together have ~30 conversions in 30 days.** Not one campaign at a time:
the arithmetic does not work per campaign. At 15–55 QAR/day and 2–5 QAR a click,
a campaign gets roughly 5–15 clicks a day, so reaching 30 conversions a month on
its own needs a 7–20% conversion rate, sustained. Most never get there, and a
campaign switched to Smart Bidding with too little data bids blind — the exact
problem Manual CPC was chosen to avoid. A portfolio strategy (Tools → Bidding
strategies → **+** → Maximize conversions, then attach campaigns) pools every
attached campaign's conversions into one model, so the account as a whole
reaches the threshold several times sooner than any campaign alone. The target
strategy is recorded per campaign in `campaign-settings.csv` so it isn't
forgotten.

### What to check after week 1

- **Search terms report** (not the keyword report) — this shows what people
  actually typed. Every irrelevant term you find becomes a new negative. This is
  the single highest-value hour you will spend on the account.
- Any ad group with a **Below average** ad relevance or landing page experience.
- Whether service-intent queries are leaking through despite the negatives.
- **Where the clicks came from** (Insights and reports → When and where ads
  showed → *User location*). Any impressions from outside the targeted countries
  mean a campaign was left on *Presence or interest* — fix the location option.
- **Calls** (Assets → Calls, and the *Calls from ads* conversion). Calls arriving
  while the site reports no WhatsApp conversions means the website labels are not
  pasted yet — a tracking gap, not a campaign problem.
- **Hour of day and day of week** against your WhatsApp inbox. The schedule
  pauses Friday and 13:30–15:30. If enquiries cluster on Friday evening or
  Saturday morning, the pause is costing you the Qatar weekend: try Friday on at
  a −50% bid adjustment before deciding.

## ⚠ After the first import, the live account is the source of truth

This is a one-way pipeline. The repo generates the account; nothing flows back.
The moment you import and start optimising — pausing keywords, adjusting bids,
adding negatives from the search terms report — the live account diverges from
these files, and **a wholesale re-import would propose reverting every one of
those optimisations**.

So after go-live:

- Use rebuilds for **additions** (a new product, a new theme): import only the
  new campaign or ad group, not the whole set. Editor shows you exactly what a
  file would change before you Post — read that diff.
- For **edits to live campaigns**, make them in Google Ads directly. Optionally
  mirror them into the JSON so the repo stays a readable record, but never
  re-import an edited old campaign over a live one without reviewing the diff.
- The repo files remain valuable as the audited baseline and for rebuilding a
  campaign from scratch if one is ever mangled.

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
