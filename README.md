# ABK Trading & Service — Website

High-end bilingual (EN/AR) B2B + B2C website for **ABK Trading & Service** at **abktradingservice.com**. Built with Next.js 16, TypeScript, Tailwind 4, next-intl v4.

## Tech stack

- **Framework:** Next.js 16 App Router (Turbopack), React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 (CSS variables theme)
- **i18n:** `next-intl` v4 — English + Arabic with RTL, locale-prefixed routes (`/en`, `/ar`)
- **Images:** `next/image` with WebP/AVIF optimization
- **Fonts:** Inter (sans), Playfair Display (display), IBM Plex Sans Arabic (Arabic) via `next/font`
- **Analytics:** Plausible (privacy-first, no cookie banner needed) with `data-plausible-event` attributes

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
│   ├── product/   # ProductCard, ProductGrid (w/ filters), ProductDetail, CatalogueDownloads
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
3. `npm run build` — the sitemap picks it up automatically.

Mark a product as a "star" (shown on homepage) by setting `featured: true`.  For the Briller "jewelry on velvet" dark-frame treatment, set `highlight: "briller-color"`.

## Editing copy

- **UI strings:** `messages/en.json` + `messages/ar.json`
- **Business info (address, hours, phone, socials):** `src/lib/constants.ts`
- **Product names/descriptions:** `src/data/products.ts` (each field is `{ en, ar }`)

## Business details (baked into site + JSON-LD)

- **Company:** ABK Trading & Service
- **Address:** Shop 2 & 3, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, Qatar
- **Hours:** Sat – Thu 10:00–13:00 and 16:00–22:00 · Fri closed
- **Phone / WhatsApp:** +974 30838355
- **Email:** ceo.abktrading@gmail.com
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

- **Canonical URLs + hreflang** set per-page via `buildAlternates()` in `src/lib/seo.ts`. Every page's `generateMetadata` calls the helper with its own path.
- **LocalBusiness JSON-LD** emitted only on pages that display NAP (name/address/phone): `/[locale]/b2c`, `/[locale]/b2b`, `/[locale]/contact`. Product pages carry Product + BreadcrumbList. `geo` (lat/long) intentionally omitted — add real coordinates only after the Google Business Profile pin is placed.
- **Sitemap** auto-generated at `/sitemap.xml` covering all static + product pages × 2 locales × 2 audiences. Bare locale roots (`/en`, `/ar`) excluded since they redirect.
- **Robots.txt** at `/robots.txt` — explicit allow-list for Googlebot, Bingbot, DuckDuckBot, Applebot plus AI crawlers (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, anthropic-ai) to surface in AI shopping answers.
- **OG image** — Satori-rendered 1200×630 PNG at `/[locale]/opengraph-image`. Per-locale (EN/AR variants with direction-aware layout).

### Target Qatar keywords (populated throughout copy)
"paint protection film Qatar", "PPF Doha", "window tinting Qatar", "ceramic coating Mesaimeer", "car wash supplies Qatar wholesale", plus Arabic equivalents.

## Analytics

Plausible script loads in `[locale]/layout.tsx` with `data-domain="abktradingservice.com"`. Custom events use `data-plausible-event` attributes (already wired on every WhatsApp CTA, audience switch, language switch, and catalogue download).

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
- [ ] **Claim Google Business Profile** at the Mesaimeer address. Place the map pin precisely on the shop.
- [ ] Copy the resulting lat/long from your Google Business dashboard and add to `src/lib/jsonld.ts` (re-enable `geo` object):
  ```ts
  geo: { latitude: 25.XXX, longitude: 51.XXX }
  ```
- [ ] **Google Search Console** — add the site, verify via DNS TXT, submit `sitemap.xml`. Consider adding separate en-QA and ar-QA properties.
- [ ] **Test WhatsApp deep-links** on a real iPhone + Android device — make sure pre-filled text renders correctly in Arabic on both.
- [ ] **Check Plausible dashboard** — confirm events are firing for `whatsapp_click`, `whatsapp_floating_click`, `audience_switch`, `language_switch`, `catalogue_download`.
- [ ] **Authorized Distributor labels** in `src/components/home/TrustBadges.tsx` — confirm wording matches ABK's actual legal relationship with each brand (Distributor / Retailer / Partner).
- [ ] **Product image quality** — some source photos are raw WhatsApp captures. Consider a studio photography pass for the star products (Vertek PPF, Briller, ABK Mashmom/Secret).
- [ ] **Social preview** — replace `/og-image.svg` placeholder with a proper 1200×630 branded image.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Dev server won't start — port 3000 in use | `taskkill /PID <pid> /F` or `npx kill-port 3000` |
| Image changes not reflecting | `rm -rf .next` and restart dev server |
| Plausible events missing in dashboard | Check the domain attribute on the script tag and ensure the site is added in Plausible |
| RTL layout looks off for a specific element | Use Tailwind's `rtl:` variant (e.g. `rtl:flex-row-reverse`) or logical properties like `ps-`, `pe-`, `ms-`, `me-` instead of `pl-`, `pr-` |

## License

Proprietary — ABK Trading & Service. All rights reserved.
