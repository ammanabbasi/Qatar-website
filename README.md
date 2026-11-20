# ABK Trading & Service — Website

High-end bilingual (EN/AR) B2B + B2C website for **ABK Trading & Service** at **abktradingservice.com**. Built with Next.js 16, TypeScript, Tailwind 4, next-intl v4.

## Tech stack

- **Framework:** Next.js 16 App Router (Turbopack), React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 (CSS variables theme)
- **i18n:** `next-intl` v4 — English + Arabic with RTL, locale-prefixed routes (`/en`, `/ar`)
- **Images:** `next/image` with WebP/AVIF optimization
- **Fonts:** Inter (sans), IBM Plex Sans Arabic (Arabic) via `next/font`
- **Analytics:** Plausible (privacy-first, no cookie banner needed) with `data-plausible-event` attributes

## Design system

The UI is modeled on the Apple Store: light ground, one typeface, one accent colour, product photography in dark tiles, and horizontally scrolling "shelves".

- **Tokens** live in `src/app/globals.css` (`@theme`): colours (`--color-bg` #f5f5f7 ground, `--color-surface` white, `--color-text` / `-muted` / `-subtle`, `--color-link` + `--color-accent` blue, `--color-brand` logo gold for eyebrow labels only, `--color-tile-dark` behind product photos), radii (`rounded-tile` 18px, `rounded-hero` 28px, `rounded-pill`), shadows (`shadow-tile`, `shadow-tile-hover`) and the type scale (`text-caption` 12px … `text-display-lg` 56px, each with line-height and tracking baked in). Reference tokens as `bg-(--color-surface)`; never hard-code hex in components.
- **Primitives** in `src/components/ui/`: `Container`, `SectionHeading` (two-tone "Title. Subtitle in grey." — `size="display"` for page titles), `Button` / `ButtonLink` (primary · secondary · dark · light · outline), `TextLink` (blue "Learn more ›", flips in RTL), `Chip`, `Shelf` (snap-scrolling row with paddles; give tiles fixed widths), `Icons`.
- **Product surfaces** in `src/components/product/`: `ProductTile` (dark shelf tile — copy on top, photo dissolving in below), `ProductCard` (catalogue grid), `ProductGallery` (client, thumbnails), `ProductGrid` (filters live in the URL, e.g. `?brand=VTEK&category=film`; pages wrap it in `<Suspense>` with `ProductGridView` as the static fallback so the full catalogue is prerendered). Shelf/thumbnail imagery per brand and category is configured in `src/data/products.ts` (`BRAND_IMAGES`, `CATEGORY_THUMBS`).
- **RTL:** logical properties only (`ps-` / `pe-` / `start-` / `end-`), chevrons get `rtl:-scale-x-100`, and Arabic is never letter-spaced (global rule in `globals.css`).
- **Images:** Next 16 deprecates `priority`; above-the-fold images use `loading="eager"` (plus `fetchPriority="high"` for LCP candidates) and the product-page hero uses `preload`.

## Run locally

```bash
cp .env.example .env.local   # first-time — leave Plausible unset for dev
npm install
npm run dev         # http://localhost:3000
npm run llms:sync   # regenerate public/llms.txt & public/llms-full.txt from src/data/*
npm run build       # production build; pre-renders 340 static segments (190 bilingual sitemap URLs)
npm run seo:verify  # audit built HTML, JSON-LD, hreflang, attribution & llms.txt sync
npm run start       # serve production build
```

Root path `/` permanently redirects (`308`) to `/en` (unless `Accept-Language: ar` or `NEXT_LOCALE=ar` negotiates `/ar`). After deploying content updates, notify Bing/IndexNow with `npm run indexnow -- --since YYYY-MM-DD /llms.txt /llms-full.txt`.

## Environment variables

See `.env.example` for the full set. Two variables matter at build time:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL used for SEO (canonical, hreflang, sitemap, JSON-LD). Falls back to the production URL if unset.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Plausible tracking domain. **Leave unset on dev/preview** so localhost traffic doesn't pollute production stats. Set only on the production host (Railway).

For owner-action launch steps, read `PREFLIGHT.md`. Online payments add their own variables — see the next section.

## Online payments (SADAD)

Customers can pay online through **SADAD Web Checkout** (Qatar; card, Apple Pay, Google Pay, NAPS debit) in two places:

- **Retail cart** (`/b2c/cart`): "Pay online now" or the existing "Order on WhatsApp, pay later". Online payment is offered only when every item in the cart has a price — a price-on-request film keeps the WhatsApp route.
- **PPF installation booking** (`/b2c/ppf-installation`): "Pay now online" (fixed-price packages only, **5% off** the package price) or "Pay at handover" (full price). Custom-panel jobs and custom-vehicle offers are estimates, so they are always paid at handover. The discount is `PPF_ONLINE_DISCOUNT_PERCENT` / `ppfOnlinePriceQar()` in `src/data/ppfInstall.ts`, rounded down to whole riyals (899 → 854, 1,599 → 1,519, 3,999 → 3,799); the server charges it, and the form, staff emails, receipt and order page show the package price, the discount and the amount paid. A page from before a change may send the full price as `expectedPriceQar`; that is accepted and charged the discounted price. The page copy (`summaryPayment`, `how3Body`, `payBody` in `messages/*.json`, two answers in `src/data/faq.ts`, then `npm run llms:sync`) says "5%": change it together with the constant (a unit test fails until you do).

How it works:

1. The browser posts the cart (`slug` + `qty` only) or the booking to `/api/checkout` / `/api/ppf-booking`. The server re-prices everything from `src/data/*` + `src/lib/pricing.ts`, stores the order in Postgres on Railway (table `abk_orders`, status `awaiting_payment`) and returns a signed SADAD form; the browser posts it to SADAD's hosted page. Card details never touch our servers.
2. SADAD sends the customer back to `/api/payments/sadad/callback` (form POST) and notifies `/api/payments/sadad/webhook` (JSON, server-to-server). Both are checksum-verified; the order turns `paid` once — the update is compare-and-swap on the row's `version` — and that single transition sends the emails (staff alert to `ORDER_EMAIL_TO`, receipt to the customer in EN/AR). Staff get a **CHECK PAYMENT** email instead when a payment needs a person: an amount that differs from the order total (order parked as `review`), a second successful payment on an already-paid order (stays `paid`; refund the extra one), or a sandbox payment on the live site (a test key reached production; parked as `review`, never fulfilled), or a payment while **another attempt by the same customer** is already paid or under a check (each retry is its own order id; SADAD can settle an attempt that looked failed or pending later): for a cart, the same cart reference and mobile; for a PPF booking (new reference per submission), the same package and mobile within 7 days. The same transaction arriving by the other channel never alerts twice. Writes that collide (the callback and webhook land together) are retried with jittered backoff, and an update whose reply was lost recognises its own write (`writes` ids on the record). A "paid" result whose checksum does **not** verify never changes the order; if no verified copy follows within 15 s, staff get one **CHECK PAYMENT … could not verify** email per order (forgery, or SADAD changed its signing). Checkout refuses (`already_paid`) a cart whose earlier attempt by the same mobile was paid — a customer who never reached the order page still has the full cart — and the cart page then says so and starts a fresh cart.
3. A customer who cancels on SADAD's page is **not** sent to the callback: SADAD redirects them to the site root with `?order_id=<id>` (no callback, no webhook). `next.config.ts` routes such URLs to `/api/payments/sadad/cancelled`, which sends them back to the cart or the PPF page, in their language, with a "payment cancelled" notice; the order just stays `awaiting_payment`.
4. The customer lands on `/[locale]/b2c/order/<id>`: paid / pending (auto-refreshes) / failed (try again) / review, plus a WhatsApp button with the paid order prefilled. Opening it needs the order's key (HMAC of the order id, so order ids alone can't open order pages), held in a private HttpOnly cookie `abk_order_<id>`. The callback sets the cookie and redirects to `…/order/<id>?t=<key>&c=1`; a browser that kept the cookie is sent on at once to the plain address, so the key leaves the address bar (Google Analytics/Ads page and referrer URLs, history, screenshots, shared links). A browser that refuses cookies is shown its order at the keyed address. The receipt email links to `/api/orders/open?…&t=<key>`, which does the same handoff; an old-style `?t=` link without `c=1` is first sent there. Without a key the page says it can't be opened and points to the confirmation email and WhatsApp — it never shows anything about the order. A paid cart is emptied there and GA4 `purchase` is sent once; a paid **shop** order also reports the Google Ads cart-order conversion (value = goods after discount, transaction id = cart reference, so a cart also sent on WhatsApp counts once). A PPF booking's Ads conversion fires when it is booked, and the pay-now path waits for it (1.2 s at most) before leaving for SADAD so the ping isn't cancelled. The paid page's WhatsApp button reports a GA4 event only, never a second conversion.
5. **Emails** (`src/lib/payments/email.ts`, Hostinger SMTP): each one is recorded on the order the moment the server accepts it (`emails.booked` / `emails.review` for those staff alerts, `emails.shop` + `emails.customer` for the paid alert and the receipt), so a booking alert never stands in for the paid emails and a retry sends only what is missing. A temporary SMTP failure (no connection, 4xx) is retried after 2 s and 5 s; a paid email that still fails gives up its claim, so a later SADAD notification for that payment retries it straight away (the other channel has often passed by then, so do not count on it). The **order sweep** catches the rest (`src/lib/payments/sweep.ts`, a timer in the Railway Node server started by `src/instrumentation.ts`; first run a minute after start, then every 15 minutes): it retries paid emails still owed (6 attempts per order at most; the record shows `emails.attempts` and `emails.error`), and sends staff one **"Unpaid online order … follow up"** email for an online cart whose latest attempt is still unpaid 45 minutes later (carts under 3 days old; never when any attempt of that cart is paid, under review or already alerted — flag `unpaid_alerted`). PPF bookings are excluded: staff already got the booking alert. It runs only where `DATABASE_URL` is set, and `ORDER_SWEEP_DISABLED=1` turns it off. Failures are logged without addresses (`[orders] EMAIL FAILED …`, recipients masked as `<address>`). The mailer greets the server as `abktradingservice.com` — Hostinger closed the connection when Vercel's own host name was used — and falls back from port 465 to 587 if 465 can't connect. `SMTP_DEBUG=1` logs the whole SMTP conversation; turn it off again afterwards.
6. **Bookings and bots**: the PPF form sends how long it was open, measured on the customer's own clock (`elapsedMs`), so a phone with a wrong clock is never taken for a bot. Mobile numbers typed on an Arabic keyboard (٣٠٨٣…) are accepted (`toLatinDigits`). Under 3 s is treated as a bot (convincing reply, nothing saved). A filled hidden field on a slower submission is kept and emailed with `[Check: possible spam]`, because autofill can fill hidden fields.
7. **Rate limits** (`src/lib/rate-limit.ts`): `/api/checkout` allows 30 and `/api/ppf-booking` 10 requests per 10 minutes per visitor address, then answers 429 with `Retry-After` (every request counts, valid or not, because each valid one stores an order or emails staff). On Railway the address is `X-Real-IP`, the client-IP header Railway's edge documents; never `X-Forwarded-For` there — the edge passes a client-sent one through, so every hop in it can be made up (measured live 2026-11-20: 12 requests with invented addresses all got through). Off Railway (local `next start`) it is the last `X-Forwarded-For` hop. With no address nothing is limited. Counts live in the server's memory: a redeploy resets them, and more than one instance would count separately.

**Signing scheme — read before touching `src/lib/payments/sadad.ts`.** SADAD's 2.1 docs describe a plain SHA-256 `signature`; their live endpoint rejects it ("Checksumhash did not match"). It accepts the encrypted `checksumhash` scheme their plugins use (details in the file header), the form must be posted in exactly the order it was signed, `productdetail` lines are required, and `CALLBACK_URL` must be on a domain registered in the SADAD panel ("ERR-03 … not registered against this merchant's sandbox (test) domains" otherwise). `npm run test:payments` pins all of this (52 tests: signing, verification, parsing, order state machine, sweep, rate limit, online discount, emails).

| Variable | Where | Notes |
| --- | --- | --- |
| `SADAD_MERCHANT_ID` | Railway `website` (build + runtime) | `7326278` — shown at the top of the SADAD panel. Not secret. |
| `SADAD_SECRET_KEY` | Railway `website` (runtime only) | SADAD panel → Online Payment → Payment Gateway → Configure API → **Live** key (Test key = sandbox). Secret; never commit it. |
| `SMTP_PASS` | Railway `website` (runtime only) | Password of the sending mailbox (`sales@abktradingservice.com`, Hostinger). Without it orders are still stored, but no emails go out (logged as `[orders] EMAIL NOT SENT`). |
| `PAYMENTS_PUBLIC` | Railway `website` (build) | `1` shows online payment to everyone. Unset = only on a device that opened any page with `?pay=preview` (go-live check; `?pay=off` clears it). |
| `DATABASE_URL` | Railway `website` (runtime) | `${{Postgres.DATABASE_URL}}`, a reference to the project's Postgres (private network only). A deployment without it refuses orders; locally, unset means an in-memory store. |
| `SMTP_USER`, `SMTP_HOST`, `SMTP_PORT`, `ORDER_EMAIL_TO`, `SADAD_WEBSITE`, `PAYMENTS_CALLBACK_ORIGIN` | optional | Defaults: `sales@abktradingservice.com`, `smtp.hostinger.com`, `465`, `sales@abktradingservice.com`, `abktradingservice.com`, canonical site URL. |
| `ORDER_SWEEP_INTERVAL_MS`, `ORDER_SWEEP_UNPAID_AFTER_MS`, `ORDER_SWEEP_DISABLED` | optional (runtime) | Order sweep: every `900000` ms (15 min); unpaid-cart email after `2700000` ms (45 min); `1` turns the sweep off. |

Pages are static, so the public settings (`SADAD_MERCHANT_ID`, `PAYMENTS_PUBLIC`, `NEXT_PUBLIC_*`, passed to the Docker build as build args) reach them on the next deployment; Railway redeploys once a variable change is deployed. Secrets are runtime-only and never reach the build. With no SADAD key set, the site behaves exactly as before (WhatsApp only).

SADAD panel settings (Online Payment → Payment Gateway): website domain `abktradingservice.com` registered under both Test and Live keys; **Webhook** → `https://abktradingservice.com/api/payments/sadad/webhook`; **Notifications** → transaction/refund/dispute/downtime alerts to `sales@abktradingservice.com`.

Orders live in Railway → abk-website → **Postgres** (private network only): table `abk_orders` in production, `abk_orders_preview` / `abk_orders_dev` for other environments. To look at them, open a shell in the website service (`railway ssh --service website`), which has `pg` and `DATABASE_URL`. Never point tests at it: local runs without `DATABASE_URL` use the in-memory store. (Until 2026-11-19 orders were in a Vercel Blob store, which Vercel's Hobby plan suspended for the month.) Refunds are issued from the SADAD panel.

Testing: order emails can be checked locally without the mailbox password by pointing `SMTP_HOST=localhost` / `SMTP_PORT=465` at a local TLS SMTP sink (start `next start` with `NODE_EXTRA_CA_CERTS=<sink cert>`) and replaying signed SADAD callbacks/webhooks with the Test key. Sandbox payments use the Test key and SADAD's test cards (developer.sadad.qa → Test Pay; e.g. Mastercard 5123 4500 0000 0008, any name/CVC/future expiry). Locally, the return URL must be a registered HTTPS domain — tunnel the server and add the tunnel's domain to the Test key's domains (`PAYMENTS_CALLBACK_ORIGIN=https://<tunnel>` in `.env.local`).

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # minimal root (passes children through)
│   ├── globals.css           # Tailwind + theme tokens + RTL fixes
│   ├── sitemap.ts            # dynamic — includes all products × locales × audiences
│   ├── robots.ts
│   ├── icon.svg              # favicon
│   └── [locale]/
│       ├── layout.tsx        # html/body, fonts, NextIntlClientProvider, Plausible, JSON-LD
│       ├── page.tsx          # redirects to /[audience]
│       ├── not-found.tsx
│       ├── b2c/
│       │   ├── page.tsx
│       │   └── products/
│       │       ├── page.tsx
│       │       └── [slug]/page.tsx
│       ├── b2b/
│       │   ├── page.tsx
│       │   ├── become-a-dealer/page.tsx
│       │   └── products/
│       │       ├── page.tsx
│       │       └── [slug]/page.tsx
│       ├── about/page.tsx
│       └── contact/page.tsx
├── components/
│   ├── layout/    # Header, Footer, AudienceSwitch, LocaleSwitch, Shell
│   ├── home/      # StoreHeader, StarProducts, BrandStrip, CategoryShelf, AboutSnippet, WhyQatar, FaqSection, TrustBadges, DealerPitch
│   ├── product/   # ProductCard, ProductGrid (w/ filters), ProductDetail
│   ├── cta/       # WhatsAppButton, FloatingWhatsApp, WhatsAppIcon
│   └── ui/        # Container, Button, SectionHeading
├── data/
│   └── products.ts           # typed catalogue — edit here to add/update SKUs
├── i18n/
│   ├── routing.ts            # locales, defaultLocale
│   ├── request.ts            # message loader
│   └── navigation.ts         # locale-aware Link, router, redirect
├── lib/
│   ├── constants.ts          # SITE constants (address, hours, socials, phone)
│   ├── whatsapp.ts           # deep-link builder w/ audience-specific pre-fills
│   ├── jsonld.ts             # LocalBusiness + Product + Breadcrumb schema
│   └── fonts.ts
└── proxy.ts                  # next-intl middleware (renamed "proxy" in Next.js 16)

messages/
├── en.json   # English
└── ar.json   # Arabic (DRAFT — native speaker review required before launch)

public/
├── logo.svg, logo-mark.svg, logo.webp
├── llms.txt, llms-full.txt   # generated by `npm run llms:sync`
├── googlee3ff2df0d5447778.html, abktrading8f255517ef109a16b63bca.txt
├── og/                       # 1200×630 brand & per-SKU social cards
└── products/
    ├── vtek/ · vertek/ · autotriz/ · briller/ · instafinish/ · abk/ · getsun/ · misc/
```

## Editing products

All product data lives in `src/data/products.ts`. The schema mirrors a CMS document shape so you can migrate to Sanity (or similar) later with a simple copy of the data. To add a product:

1. Drop the image(s) into the matching `public/products/<brand>/` folder.
2. Append a new entry to `PRODUCTS` in `src/data/products.ts` following the existing shape.
3. `npm run og:products` — renders its social card (`public/og/products/<slug>.jpg`, the image WhatsApp/Facebook show when the product link is shared). Commit it.
4. `npm run build` — the sitemap picks it up automatically.

Mark a product as a "star" (shown on homepage) by setting `featured: true`.

## Editing copy

- **UI strings:** `messages/en.json` + `messages/ar.json`
- **Business info (address, hours, phone, socials):** `src/lib/constants.ts`
- **Product names/descriptions:** `src/data/products.ts` (each field is `{ en, ar }`)

## Business details (baked into site + JSON-LD)

- **Company:** ABK Trading & Service
- **Address:** Showroom no. 2, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, Qatar
- **Hours:** Sat – Thu 10:00–13:00 and 16:00–22:00 · Fri closed
- **Phone / WhatsApp:** +974 3083 8355 (secondary: +974 7779 0915 · landline: +974 4451 4476)
- **Email:** sales@abktradingservice.com
- **Facebook:** https://www.facebook.com/profile.php?id=61588332885735
- **Instagram:** https://www.instagram.com/abk.trading
- **TikTok:** https://www.tiktok.com/@abk.trading

## Audience split (B2C ↔ B2B)

- Top-bar toggle persists in `abk_audience` cookie (180 days).
- Routes: `/[locale]/b2c/*` vs `/[locale]/b2b/*`.
- WhatsApp pre-filled messages differ:
  - B2C: `"Hi ABK, I'm interested in [Product]…"`
  - B2B: `"Hi ABK, I'd like wholesale pricing for [Product]. Company: ____ Quantity: ____ …"`

## SEO / GEO

- **Canonical URLs, hreflang and social tags** come from `pageMeta()` in `src/lib/seo.ts`. Every page's `generateMetadata` calls it with its own path; it returns the canonical, the `en`/`ar`/`x-default` alternates and the complete `openGraph`/`twitter` block (og:url = canonical, locale, image). `metaDescription()` clamps descriptions to ~158 characters while keeping the local-intent tail.
- **Title template** `%s | ABK Trading` is applied in `[locale]/layout.tsx` — page titles in `messages/*.json` must not repeat the brand (Home/About pass `title: { absolute }` because their strings already carry it).
- **Structured data** (`src/lib/jsonld.ts`, rendered by `components/seo/JsonLd.tsx`): localized Organization (with `ShippingService`) + WebSite on every page; `AutoPartsStore` (NAP, hours, `geo` from the Google Business Profile pin, `hasMap`, area served, stocked brands under `knowsAbout` — never `brand`, which would claim ABK owns them) on the locale homes and Contact; Product + `Offer`/`AggregateOffer` (linked to `#shipping` for priced SKUs; omitted on quote-only SKUs) + BreadcrumbList on product pages; `Service` + `OfferCatalog` + `FAQPage` on `/b2c/ppf-installation`; `FAQPage` on About and category/brand hubs; `CollectionPage` + `ItemList` on non-empty listings; `Article` (with `citation` sources) on blog posts.
- **Google Business Profile** — "ABK Trading and Service — Vertek & Autotriz" (CID `9860894303806767987`, pin 25.2040478, 51.5029268). Listing name, CID and coordinates live in `src/lib/constants.ts` (`gbpName`, `mapsUrl`, `geo`) and feed the JSON-LD, the `geo.*` meta tags and every "Open in Maps" link — change them there if the shop moves.
- **Sitemap** auto-generated at `/sitemap.xml`: static pages + canonical product URLs + blog posts × 2 locales, each with `en`/`ar`/`x-default` alternates, plus image entries for product photos. `lastmod` dates are pinned (`STATIC_PAGES_UPDATED_AT`, `Product.updatedAt`) — bump them only when content really changes.
- **Robots.txt** at `/robots.txt` — allow-all plus an explicit allow-list for search and AI crawlers (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, meta-externalagent, …) so ABK is citable in AI answers. `public/llms.txt` gives those engines a plain-text summary of the business.
- **Social cards** — `public/og/abk-og-{en,ar}.jpg` (site-wide; 1200×630 screenshots of `scripts/og/brand-card.html`, `?lang=ar` for Arabic), `public/og/abk-hero-1x1.jpg` (the square product render the card is built from; doubles as the 1:1 image in LocalBusiness/Article JSON-LD) and `public/og/products/<slug>.jpg` from `npm run og:products` (`scripts/generate-og.mjs`, sharp, Node 22.18+). Keep every card under 300 KB — WhatsApp's limit for showing the large preview. A file-convention `opengraph-image.jpg` is deliberately NOT used: it only binds to the segment it sits in.

### Target Qatar keywords (populated throughout copy)
"paint protection film Qatar", "PPF Doha", "window tinting Qatar", "ceramic coating Mesaimeer", "car wash supplies Qatar wholesale", plus Arabic equivalents.

## Analytics

Plausible script loads in `[locale]/layout.tsx` with `data-domain="abktradingservice.com"`. Custom events use Plausible's class-based tagged-events syntax (`plausible-event-name=whatsapp_click plausible-event-audience=b2c`; the script ignores `data-*` attributes), already wired on every WhatsApp CTA, audience switch, language switch, catalogue download and map load.

To self-host Plausible and avoid the $9/mo fee, point the script `src` at your own instance.

## Deployment (Railway)

Since 2026-11-20 the site runs on Railway: workspace **dealersgpt**, project **abk-website**, services **website** and **Postgres**, region EU West (Amsterdam). Pushing to `main` deploys it: Railway builds the `Dockerfile` (standalone Next.js on Node 24) and `railway.json` sets the health check (`/api/health`).

- DNS stays at Hostinger: `@` is a CNAME (Hostinger stores it as an ALIAS) and `www` a CNAME, both to the targets Railway shows under website → Settings → Networking; the `_railway-verify` TXT records prove ownership. Email records (MX, SPF, DKIM, DMARC, autodiscover) are Hostinger's and must stay. Railway issues the HTTPS certificates (about 20 minutes after a DNS change).
- `www` redirects permanently to the bare domain (`next.config.ts`).
- The old Vercel project is disconnected from Git, so it no longer builds; reconnect it (`vercel git connect`) and point DNS back to it only as an emergency fallback.

### Alternative host: Cloudflare Pages
Same Git-push flow, higher free-tier bandwidth cap. Set build command `npm run build`, output dir `.next`.

## Post-deploy checklist (manual — owner actions)

- [ ] Verify HTTPS cert auto-issued.
- [ ] **Arabic translation review** — the AR content in `messages/ar.json` and `products.ts` is AI-generated draft. Have a native Arabic speaker polish the copy before public launch. AI Arabic in Qatar reads as "off" to locals.
- [x] **Google Business Profile** claimed — pin + CID are wired into the site (see SEO / GEO).
- [ ] **GBP website field** — change it from `http://abktradingservice.com/` to `https://abktradingservice.com/en` so the listing links straight to the secured English home.
- [ ] **Google Search Console** — add the site, verify via DNS TXT (or set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on Railway), submit `sitemap.xml`. Consider adding separate en-QA and ar-QA properties.
- [ ] **Test WhatsApp deep-links** on a real iPhone + Android device — make sure pre-filled text renders correctly in Arabic on both.
- [ ] **Check Plausible dashboard** — confirm events are firing for `whatsapp_click`, `whatsapp_floating_click`, `audience_switch`, `language_switch`, `catalogue_download`.
- [ ] **Authorized Distributor labels** in `src/components/home/TrustBadges.tsx` — confirm wording matches ABK's actual legal relationship with each brand (Distributor / Retailer / Partner).
- [ ] **Product image quality** — some source photos are raw WhatsApp captures. Consider a studio photography pass for the star products (Vertek PPF, Briller, ABK Mashmom/Secret).
- [x] **Social preview** — 1200×630 brand cards + per-product cards under `public/og/` (see SEO / GEO).

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Dev server won't start — port 3000 in use | `taskkill /PID <pid> /F` or `npx kill-port 3000` |
| Image changes not reflecting | `rm -rf .next` and restart dev server |
| Plausible events missing in dashboard | Check the domain attribute on the script tag and ensure the site is added in Plausible |
| RTL layout looks off for a specific element | Use Tailwind's `rtl:` variant (e.g. `rtl:flex-row-reverse`) or logical properties like `ps-`, `pe-`, `ms-`, `me-` instead of `pl-`, `pr-` |

## License

Proprietary — ABK Trading & Service. All rights reserved.
