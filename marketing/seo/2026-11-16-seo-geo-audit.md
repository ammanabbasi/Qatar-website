# SEO / GEO audit & end-to-end remediation — 16 November 2026

Follow-up to `2026-11-03-seo-geo-audit.md`. Covers a full codebase, built-HTML (`190` indexable pages + `3` `noindex` routes),
structured-data (`848` JSON-LD blocks), static-asset, and headless-browser E2E audit and remediation across Technical SEO,
Content & Truthfulness, Authority & AI Visibility (GEO), Local & Multilingual (`en-QA` / `ar-QA`), and Measurement.
The repository is public: no ad spend, wholesale cost, installer fee, or margin figures belong here.

---

## 1. Key findings resolved in this pass

### Technical foundations & Core Web Vitals
- **Crawl-exposed stale PDF catalogues (`public/catalogues/*.pdf`):** Commit `1599418` (2 Sep 2026) removed UI links to
  `vertek-ppf-catalogue.pdf` and `autotriz-catalogue.pdf`, leaving both files live at `/catalogues/*.pdf`. Both PDFs carried
  the former address (`Ariane City Mesaimer, Building 481, Shop No. 2 & 3`), and `vertek-ppf-catalogue.pdf` contained the
  exact superseded claims (`12 Years Warranty Super Nano Coated PRO PLUS PPF`, `ALIPHATIC TPU LAYER 200µm`, `OFFICIAL DISTRIBUTOR OF VERTEK`)
  that Google AI Mode continued repeating after HTML pages were cleaned. Both PDFs are now deleted and permanently `308`-redirected
  in `next.config.ts` to `/en/b2c/brands/vtek` and `/en/b2c/brands/autotriz`.
- **Client hydration payload bloat:** `[locale]/layout.tsx` passed all 29 `next-intl` namespaces (`52.2 KB` EN / `75.1 KB` AR)
  into the root `NextIntlClientProvider` on every route. Scoping the root provider to the 14 shared client namespaces and
  moving `PpfInstall` and `DealerPage` to page-scoped providers reduced root serialized translation JSON to `17.6 KB` EN /
  `25.0 KB` AR (**~66% reduction**).
- **Render-competing Google Tag script:** `src/instrumentation-client.ts` injected `googletagmanager.com/gtag/js` synchronously
  during initial bootstrap. `dataLayer` and `gtag("config", ...)` remain queued synchronously so early CTA clicks are never
  dropped, while the external script download now waits until `window.load` + `requestIdleCallback` (with immediate bypass for
  `gtm_debug` Tag Assistant sessions and first-interaction flush).
- **Discontinued Sitrett brand hub & global 404:** Retired `/b2c/brands/sitrett` (0 active SKUs since `dbd75b2`), added one-hop
  `308` redirects to `/{locale}/b2c/categories/cleaners`, and enabled `experimental.globalNotFound` with a bilingual (`EN`/`AR`)
  `noindex` branded `src/app/global-not-found.tsx`.
- **Root Search Console verification & deploy hygiene:** Copied misplaced `public/products/googlee3ff2df0d5447778.html` to
  `public/googlee3ff2df0d5447778.html` (`https://abktradingservice.com/googlee3ff2df0d5447778.html`), updated `.gitignore`, and
  added `.vercelignore` so local untracked files are never uploaded during CLI deployments.

### Content, structured data & truthfulness
- **Thin / near-duplicate SKUs & hub drift:** Expanded and differentiated 6 thin/duplicate entries in `src/data/products.ts`
  (`autotriz-3d-matrix-ultra`, `autotriz-3d-matrix-hybrid`, `autotriz-fabric-textile-coating`, `briller-quick-tyre-shine`,
  `briller-glass-cleaner`, `fast-masking-tape`) and reconciled every SKU name, pack size, and QAR price across all 10 category
  hubs and 8 active brand hubs in `src/data/categoriesAndBrands.ts`.
- **Editorial comparison tables, legal/technical citations & FAQ consistency:** Added crawlable HTML `<table>` matrices to
  `ppf-cost-qatar`, `ceramic-coating-cost-qatar`, and `ppf-vs-ceramic-coating-qatar`; added verifiable external `sources`
  (`Article.citation`) across 7 guides in `src/data/articles.ts`; reconciled Ceramic-over-PPF wording with VTEK's FAQ (`Autotriz
  PPF & Vinyl Wrap Coating`, never rigid paint ceramic over self-healing PPF); and removed erroneous `"Briller ceramic"` mentions
  in `src/data/faq.ts`.
- **Unverified claims removed:** Replaced `"Official & Exclusive Distributor"` / `"موزع حصري"` with `"Authorized Qatar Distributor"`,
  removed unverified `"same-day delivery"` / `"same-day dispatch"` / `"توصيل في نفس اليوم"` promises so every page agrees with
  `Terms.section9Body` and `shippingServiceJsonLd()` (delivery time confirmed per order on WhatsApp; Mesaimeer showroom pickup free),
  and replaced unverified dealer-tier claims (`"up to 35%"`, `"masterclasses"`, `"rebates"`, `"countertop displays"`, `"next-day store delivery"`)
  in `messages/en.json` and `messages/ar.json`.
- **JSON-LD graph & WCAG/heading fixes:** Localized `organizationJsonLd(locale)` in Arabic, added `SITE.mapsUrl` to `sameAs`,
  linked `CollectionPage.mainEntity` via `@id` instead of duplicating `ItemList` inline, suppressed empty `ItemList` on `grizzly`,
  raised `ProductTile` gold badge contrast to `5.86:1` (WCAG AA), and eliminated all `h1 -> h3` heading skips.

### Agentic manifests (`llms.txt`) & AI/search attribution
- **Established SEO vs. experimental GEO distinction:** Crawlability, canonicals, `hreflang`, internal linking, CWV payload
  reductions, `Organization`/`AutoPartsStore`/`Product`/`FAQPage`/`Article` JSON-LD, and sourced comparison tables follow
  established Google Search Central and Bing Webmaster guidelines. `public/llms.txt` and `public/llms-full.txt` are experimental
  GEO conveniences (Google states AI Overviews/AI Mode require no special text files), maintained via `scripts/generate-llms.mjs`
  so LLM retrieval tools receive an accurate, `llmstxt.org`-compliant Markdown index (`40` canonical links, `0` `robots.txt`-blocked
  `?pack=trade` URLs, `Content-Type: text/plain; charset=utf-8`).
- **Session-persisted AI & search attribution (`src/lib/attribution.ts`):** Captures landing UTMs, click IDs (`gclid`, `gbraid`,
  `wbraid`, `msclkid`), and external `document.referrer` across 12 AI platforms and 8 search engines in `sessionStorage`, emits
  `ai_referral_visit` once per AI-referred session, attaches `traffic_channel` + `ai_platform`/`search_engine` to conversion
  events, and preserves attribution across SPA navigations into `/api/ppf-booking`.

---

## 2. Automated & E2E verification (`npm run seo:verify` + CI gate)

Added `scripts/verify-seo.mjs` (`npm run seo:verify`) and wired it into `.github/workflows/ci.yml`:

1. `npx tsc --noEmit` — `0` errors.
2. `npm run lint` — `0` errors, `0` warnings.
3. `npm run build` — `340/340` static pages generated cleanly.
4. `npm run seo:verify` — `0` failures across:
   - `llms.txt` (`12,794` chars) & `llms-full.txt` (`117,223` chars) sync & spec check (`40` links, `0` disallowed query URLs).
   - `6/6` multi-page attribution unit tests (ChatGPT UTM, Perplexity referrer, Gemini referrer, Google organic, Bing organic, Google Ads `gclid`).
   - `190/190` built sitemap HTML pages + `3` `noindex` routes (`_not-found`, `/en/b2c/cart`, `/ar/b2c/cart`): `848` JSON-LD blocks parsed, `0` duplicate titles or descriptions, `190/190` exact canonicals & `5` `hreflang` links, `0` heading skips, `0` empty `ItemList`s, `0` unverified `"Exclusive"` or `"same-day delivery"` claims.
5. Headless browser E2E against `next start`: verified `/en`, `/ar` (`dir="rtl"`), `/en/b2c/brands/sitrett` -> `308` `/en/b2c/categories/cleaners`, `/catalogues/vertek-ppf-catalogue.pdf` -> `308` `/en/b2c/brands/vtek`, `/catalogues/autotriz-catalogue.pdf` -> `308` `/en/b2c/brands/autotriz`, `/en/b2c/brands/grizzly`, `?utm_source=chatgpt.com` session persistence into `/en/b2c/ppf-installation`, mobile `390×844` cart discount calculation (`0 px` overflow), branded 404, `/llms.txt`, and `/googlee3ff2df0d5447778.html`.

---

## 3. Immediate post-deploy owner actions

1. **Submit updated URLs via IndexNow right after Vercel deploy finishes:**
   ```bash
   npm run indexnow -- --since 2026-11-16 /llms.txt /llms-full.txt
   ```
2. **Claim Google Business Profile (`ABK Trading and Service — Vertek & Autotriz`, CID `9860894303806767987`):** rename to
   `ABK Trading & Service`, set website to `https://abktradingservice.com/en`, verify Tuesday–Thursday evening hours (`16:00–22:00`),
   add the 5 fixed-price VTEK PPF services + top-seller product links (`PPF-LOCAL-AUTHORITY-AND-OUTREACH.md`), and request customer reviews.
3. **Register GA4 custom dimensions & internal-traffic filter (`Property 554936266`):** add event-scoped custom dimensions
   `traffic_channel`, `ai_platform`, `search_engine`, and `landing_page` (`marketing/google-ads/CONVERSION-TRACKING.md`), and
   filter showroom/team IPs.
4. **Request brand distributor backlinks & directory corrections:** send the VTEK, Autotriz, Briller, GrünesAuto, Insta Finish,
   Getsun, and Grizzly link requests (`PPF-LOCAL-AUTHORITY-AND-OUTREACH.md` section 5) and ask Equipment10 to swap `Building 1306, Street 70`.
