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
- **Product surfaces** in `src/components/product/`: `ProductTile` (dark shelf tile — copy on top, photo dissolving in below), `ProductCard` (catalogue grid), `ProductGallery` (client, thumbnails), `ProductGrid` (filters live in the URL, e.g. `?brand=Vertek&category=ppf`; pages wrap it in `<Suspense>` with `ProductGridView` as the static fallback so the full catalogue is prerendered). Shelf/thumbnail imagery per brand and category is configured in `src/data/products.ts` (`BRAND_IMAGES`, `CATEGORY_THUMBS`).
- **RTL:** logical properties only (`ps-` / `pe-` / `start-` / `end-`), chevrons get `rtl:-scale-x-100`, and Arabic is never letter-spaced (global rule in `globals.css`).
- **Images:** Next 16 deprecates `priority`; above-the-fold images use `loading="eager"` (plus `fetchPriority="high"` for LCP candidates) and the product-page hero uses `preload`.

## Run locally

```bash
cp .env.example .env.local   # first-time — leave Plausible unset for dev
npm install
npm run dev    # http://localhost:3000
npm run build  # production build; pre-renders ~100 pages
npm run start  # serve production build
```

Root path redirects to `/en/b2c` (or `/en/b2b` if the `abk_audience` cookie is set to `b2b`).

## Environment variables

See `.env.example` for the full set. Two variables matter at build time:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL used for SEO (canonical, hreflang, sitemap, JSON-LD). Falls back to the production URL if unset.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Plausible tracking domain. **Leave unset on dev/preview** so localhost traffic doesn't pollute production stats. Set only on Vercel production.

For owner-action launch steps, read `PREFLIGHT.md`.

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
│       │   ├── services/page.tsx
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
│   ├── home/      # Hero, StarProducts, BrandStrip, ServicesTeaser, DealerPitch, TrustBadges, Testimonials
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
├── logo.svg, logo-mark.svg
├── catalogues/
│   ├── vertek-ppf-catalogue.pdf
│   └── autotriz-catalogue.pdf
└── products/
    ├── vertek/ · autotriz/ · briller/ · instafinish/ · abk/ · getsun/ · sitrett/ · misc/
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
- **Address:** Shop 2 & 3, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, Qatar
- **Hours:** Sat – Thu 10:00–13:00 and 16:00–22:00 · Fri closed
- **Phone / WhatsApp:** +974 30838355
- **Email:** sales@abktradingservice.com
- **Facebook:** https://www.facebook.com/share/1L9drK6k4n/
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
- **Structured data** (`src/lib/jsonld.ts`, rendered by `components/seo/JsonLd.tsx`): Organization + WebSite on every page; `AutoPartsStore` (NAP, hours, `geo` from the Google Business Profile pin, `hasMap`, area served, stocked brands under `knowsAbout` — never `brand`, which would claim ABK owns them) on the B2C/B2B homes and Contact; Product + BreadcrumbList on product pages (deliberately **no Offer**: Google flags an Offer without a price as an error, so add one only with a real price); Service ×4 + FAQPage on Services; ItemList on listings; Article on blog posts.
- **Google Business Profile** — "ABK Trading and Service — Vertek & Autotriz" (CID `9860894303806767987`, pin 25.2040478, 51.5029268). Listing name, CID and coordinates live in `src/lib/constants.ts` (`gbpName`, `mapsUrl`, `geo`) and feed the JSON-LD, the `geo.*` meta tags and every "Open in Maps" link — change them there if the shop moves.
- **Sitemap** auto-generated at `/sitemap.xml`: static pages + canonical product URLs + blog posts × 2 locales, each with `en`/`ar`/`x-default` alternates, plus image entries for product photos. `lastmod` dates are pinned (`STATIC_PAGES_UPDATED_AT`, `Product.updatedAt`) — bump them only when content really changes.
- **Robots.txt** at `/robots.txt` — allow-all plus an explicit allow-list for search and AI crawlers (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, meta-externalagent, …) so ABK is citable in AI answers. `public/llms.txt` gives those engines a plain-text summary of the business.
- **Social cards** — `public/og/abk-og-{en,ar}.jpg` (site-wide; 1200×630 screenshots of `scripts/og/brand-card.html`, `?lang=ar` for Arabic), `public/og/abk-hero-1x1.jpg` (the square product render the card is built from; doubles as the 1:1 image in LocalBusiness/Article JSON-LD) and `public/og/products/<slug>.jpg` from `npm run og:products` (`scripts/generate-og.mjs`, sharp, Node 22.18+). Keep every card under 300 KB — WhatsApp's limit for showing the large preview. A file-convention `opengraph-image.jpg` is deliberately NOT used: it only binds to the segment it sits in.

### Target Qatar keywords (populated throughout copy)
"paint protection film Qatar", "PPF Doha", "window tinting Qatar", "ceramic coating Mesaimeer", "car wash supplies Qatar wholesale", plus Arabic equivalents.

## Analytics

Plausible script loads in `[locale]/layout.tsx` with `data-domain="abktradingservice.com"`. Custom events use Plausible's class-based tagged-events syntax (`plausible-event-name=whatsapp_click plausible-event-audience=b2c`; the script ignores `data-*` attributes), already wired on every WhatsApp CTA, audience switch, language switch, catalogue download and map load.

To self-host Plausible and avoid the $9/mo fee, point the script `src` at your own instance.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new) — it auto-detects Next.js.
3. Deploy. Vercel serves it immediately at a `*.vercel.app` preview URL.
4. In Vercel project settings → Domains, add `abktradingservice.com` + `www.abktradingservice.com`.
5. In your domain registrar dashboard, change the nameservers from `ns1.dns-parking.com` / `ns2.dns-parking.com` to the Vercel nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Propagation: 10–30 min. Vercel auto-issues HTTPS.

### Alternative host: Cloudflare Pages
Same Git-push flow, higher free-tier bandwidth cap. Set build command `npm run build`, output dir `.next`.

## Post-deploy checklist (manual — owner actions)

- [ ] Verify HTTPS cert auto-issued.
- [ ] **Arabic translation review** — the AR content in `messages/ar.json` and `products.ts` is AI-generated draft. Have a native Arabic speaker polish the copy before public launch. AI Arabic in Qatar reads as "off" to locals.
- [x] **Google Business Profile** claimed — pin + CID are wired into the site (see SEO / GEO).
- [ ] **GBP website field** — change it from `http://abktradingservice.com/` to `https://abktradingservice.com/en` so the listing links straight to the secured English home.
- [ ] **Google Search Console** — add the site, verify via DNS TXT (or set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on Vercel), submit `sitemap.xml`. Consider adding separate en-QA and ar-QA properties.
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
