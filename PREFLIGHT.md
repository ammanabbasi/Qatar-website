# Preflight — before & after Vercel launch

This document is the owner's launch checklist. The codebase is production-ready;
the remaining work is configuration, content review, and post-deploy validation
that Claude cannot do from a dev shell.

---

## Before pushing to Vercel

### 1. Native-speaker review — Arabic copy

- [ ] `messages/ar.json` — site UI strings (navigation, product pages, CTAs)
- [ ] `src/data/products.ts` — Arabic `name.ar` and `shortDesc.ar` / `longDesc.ar` on every product
- [ ] `src/app/[locale]/privacy/page.tsx` + `src/app/[locale]/terms/page.tsx` — reflected via `messages/ar.json` `Privacy` and `Terms` namespaces

Machine translations are a starting point, not a finished product. Get a
bilingual Qatari reviewer to sweep the site before launch.

### 2. Legal review — Privacy & Terms drafts

- [ ] `messages/en.json` + `messages/ar.json` — `Privacy` and `Terms` namespaces

The drafts are aligned with Qatar PDPPL (Law No. 13 of 2016) principles but
have not been reviewed by a Qatari lawyer. Social platforms and app stores
treat these pages as binding legal commitments. Get a licensed attorney to
sign off before launch.

### 3. Content truth-check

- [ ] `src/components/home/TrustBadges.tsx` — verify "Authorized Distributor"
      wording is accurate for Vertek, Autotriz, Briller (confirm paperwork exists)
- [ ] Hours in `src/lib/constants.ts` match reality (currently Sat–Thu 10–13 + 16–22, Fri closed)
- [ ] Addresses, phone, email all current

### 4. Photography (optional but recommended)

- [x] Vertek Tints distinct from Vertek PPF — fixed, now uses
      `vertek-window-tint.webp` (was reusing the PPF image)
- [ ] Briller products — better studio lighting
- [ ] Apply shop interior + installation workshop imagery

---

## Git & GitHub

```bash
cd abk-website

# First-time: init if not already
git status
git add .
git commit -m "feat: initial production-ready build"

# Create a new GitHub repo (private or public — your choice), then:
git remote add origin git@github.com:<your-org>/abk-website.git
git branch -M main
git push -u origin main
```

The `.gitignore` excludes `.next/`, `node_modules/`, `.env*.local`, and
`.vercel/` — none of those should appear in your first commit. If `git status`
shows any of them, something's wrong.

---

## Vercel import

1. **Import project** — Vercel dashboard → Add New → Project → Import the GitHub repo
2. **Framework Preset** — leave as Next.js (autodetected)
3. **Root Directory** — `./` (the repo root is the Next project)
4. **Environment variables** — under Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SITE_URL` = `https://abktradingservice.com` (Production only)
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `abktradingservice.com` (Production only — do NOT set on Preview)
5. **Deploy** — first build takes ~2 min. Confirm preview URL renders (use the `.vercel.app` URL)
6. **Smoke-test the preview:**
   - `/en/b2c` home loads with products
   - `/ar/b2c` home renders RTL correctly
   - `/en/contact` — click the map placeholder and confirm iframe loads
   - `/en/privacy` and `/en/terms` resolve
   - Click any "Inquire on WhatsApp" — verify the deep-link opens WhatsApp with a pre-filled message

---

## Domain

1. Log into the current registrar managing `abktradingservice.com`
2. In Vercel: Settings → Domains → Add `abktradingservice.com` and `www.abktradingservice.com`
3. Repoint nameservers from `dns-parking.com` to Vercel's nameservers (Vercel displays the exact values to use)
4. SSL certificate is provisioned automatically — takes a few minutes to a few hours
5. Confirm `https://abktradingservice.com` resolves and shows the site

---

## Plausible Analytics

1. Log into plausible.io
2. Add site → domain `abktradingservice.com`
3. Confirm the env var set earlier is forwarding events (visit the site, then check Plausible's live dashboard)

---

## Google Search Console

1. Add two properties: `https://abktradingservice.com` (for EN) and either
   a single property + hreflang targeting, OR separate properties per language
2. Submit the sitemap: `https://abktradingservice.com/sitemap.xml`
3. Under Search Console → Settings → International Targeting, set `Qatar` for
   both the English and Arabic sides

---

## Google Business Profile

1. Claim/create the listing for "ABK Trading & Service" at the Mesaimeer address
2. Once the pin is placed on the Google Maps side, capture the lat/long
3. Open a follow-up PR updating `src/lib/jsonld.ts` to include a `geo`
   object — Google uses this for Maps ranking signals

---

## Real-device smoke test (critical)

Claude cannot test on real devices. You MUST verify on actual phones:

- [ ] iOS Safari (iPhone) — home screen icon looks right, WhatsApp deep-link
      opens the WA app (not the web), RTL layout correct on `/ar`
- [ ] Android Chrome — same checks
- [ ] WhatsApp preview when sharing a link — open WhatsApp, paste
      `https://abktradingservice.com/en/b2c`, confirm the OG image renders
      as a preview card
- [ ] Facebook/LinkedIn — paste the same URL in a draft post, confirm preview

If the OG image doesn't render on any platform, check
`https://abktradingservice.com/en/opengraph-image` directly in a browser —
it should download as a PNG.

---

## Post-launch hardening (not blocking)

- [ ] CI/CD (GitHub Actions) running `tsc --noEmit` + `next build` on PR
- [ ] Strict CSP header with nonce-based inline script handling
- [ ] Move PDFs to Vercel Blob if they start changing frequently
- [ ] Upgrade `Strict-Transport-Security` to include `preload` once the domain
      has been stable on HTTPS for 30+ days, and submit to
      https://hstspreload.org/
- [x] Replace the generated OG PNG with a studio-designed JPG — delete
      `src/app/[locale]/opengraph-image.tsx` and add a static
      `src/app/[locale]/opengraph-image.jpg` (max 8MB). Next.js picks up
      whichever file exists

---

## SEO — ranked by ROI for "show up first in Qatar"

### Reality check
On-page schema and metadata get you eligible to rank. They do not, by themselves,
make you outrank competitors with mature Google Business Profiles, dozens of
real reviews, and Qatar directory citations. The list below is ordered by what
actually moves rankings in Qatar. Skipping items 1–3 will leave the technical
work below them with very little to amplify.

### 1. Google Business Profile (highest single-factor weight)
- [ ] Claim / create the GBP listing at the Mesaimeer address
- [ ] Set primary category: **"Auto detailing service"** (most specific match
      for ABK's mix). Add secondary categories: **"Car accessories store"**,
      **"Auto repair shop"**, **"Window tinting service"**
- [ ] Upload 20+ photos within the first month: storefront, interior shelves,
      install workshop, before/after, branded products. Continue uploading
      ~weekly — photo recency is a ranking signal
- [ ] Place the map pin **precisely** on the shop entrance. Wrong coordinates
      actively harm Maps ranking
- [ ] Once the pin is placed, capture the lat/long and re-enable the `geo`
      block in `src/lib/jsonld.ts` (currently intentionally omitted)
- [ ] Set the same opening hours as `src/lib/constants.ts` and update GBP
      every time hours change in code

### 2. Reviews — the single highest-impact ongoing action
- [ ] Add a "Review us on Google" link on the contact page once GBP is live
- [ ] Have every WhatsApp customer who closes a sale receive a follow-up
      message with the GBP review link 24–48 hours after delivery / install
- [ ] Aim for 30+ reviews in the first 90 days; respond to every one within
      a week (responses are a ranking signal)
- [ ] When you cross 5+ reviews with photos, open a follow-up PR adding
      `aggregateRating` to `productJsonLd` and `serviceJsonLd`

### 3. Citations / NAP consistency on Qatar directories
NAP = Name, Address, Phone. Listing the **identical** NAP on these increases
local pack confidence:
- [ ] qatarliving.com — Business Directory
- [ ] qatardirectory.qa
- [ ] yellowpages.qa
- [ ] qatarbiz.com
- [ ] Brand "find a dealer / installer" pages: vertek.com, autotriz.com,
      brillercarcare.com — request an authorised-dealer listing

### 4. Backlinks (slow-burn)
- [ ] Vertek / Autotriz / Briller official websites — request a Qatar-installer
      backlink. These are the highest-trust links you can earn
- [ ] Sponsor a Qatar car-enthusiast forum or local detailing meetup; ask
      for a sponsor backlink
- [ ] Submit a brand-launch press note to gulf-times.com, dohanews.co — even
      a passing mention is a links source

### 5. Content depth (the long game)
The site currently ranks for product names because the product pages exist.
For broad commercial intents like "PPF Qatar" or "best ceramic coating Doha",
competitors with 1,500–2,500-word buyer's guides will outrank thin landing
pages every time. Code-already-done:
- [x] FAQ section + `FAQPage` schema on `/services` (12 entries, EN + AR)
- [x] "Why Qatar" content block on the B2C home page
- [x] Service / Product / ItemList JSON-LD across the site

Owner content work to compound the above:
- [ ] Refine `src/data/faq.ts` with the actual top WhatsApp questions
- [ ] Author one buyer's guide article per quarter (`Paint Protection Film
      Buyer's Guide for Qatar Drivers`, `Ceramic Coating vs PPF: Which Suits
      Doha's Climate?`). Each ~1,500 words. Most of the long-tail SEO uplift
      lives here. Scaffolding this would require a `/guides` route — open a
      follow-up PR if/when you commit to publishing them
- [ ] Encourage WhatsApp customers to send post-install photos; turn them
      into a `/before-after` gallery page with the customer's car model and
      install date in the alt text

### 6. Search Console — measurement infrastructure
You can't optimise what you don't measure. Sub-tasks of #6 in the Google
Search Console section above:
- [ ] Submit `https://abktradingservice.com/sitemap.xml` after launch
- [ ] Set up email alerts for indexing errors and Core Web Vitals regressions
- [ ] After 30 days, review the **Performance** report's top queries — the
      queries Google sees you for are not always the queries you wrote copy
      for. Adjust titles/H1s based on actual impressions

### 7. Bing Webmaster Tools (micro)
- [ ] Add the site to bing.com/webmasters and submit the same sitemap. Bing
      runs Yahoo and DuckDuckGo, and powers ChatGPT's web search

### Already done in code (reference)
- [x] Per-page canonical + hreflang (en, ar, x-default)
- [x] Differentiated B2C/B2B titles + descriptions per locale
- [x] `Organization` + `WebSite` JSON-LD (locale layout)
- [x] `AutomotiveBusiness` JSON-LD on home + contact
- [x] `Service` JSON-LD per workshop service (PPF, tint, ceramic, detailing)
- [x] `FAQPage` JSON-LD with 12 bilingual entries
- [x] `Product` + `BreadcrumbList` JSON-LD on every product page
- [x] `ItemList` JSON-LD on /products listings
- [x] Per-product `lastmod` in sitemap (uses `Product.updatedAt`)
- [x] Robots allow-list for Googlebot/Bingbot/AI bots
- [x] Internal cross-links from About + Contact with keyword-rich anchors
- [x] Qatar-climate content block on B2C home (sand, heat, salt, hard water)
