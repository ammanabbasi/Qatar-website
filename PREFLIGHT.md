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

- [ ] Vertek Tints distinct from Vertek PPF (currently sharing imagery)
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
- [ ] Replace the generated OG PNG with a studio-designed JPG — delete
      `src/app/[locale]/opengraph-image.tsx` and add a static
      `src/app/[locale]/opengraph-image.jpg` (max 8MB). Next.js picks up
      whichever file exists
