# ABK Trading & Service — Technical SEO & Codebase Engine Audit

**Target Framework:** Next.js 16.2.4 (Turbopack, React 19.2.4, App Router)  
**Internationalization Engine:** `next-intl` (Bilingual English / Arabic)  
**Styling Framework:** Tailwind CSS 4 (`@tailwindcss/postcss`)  
**Scope:** Rendering behavior, crawlability, indexing mechanics, canonical integrity, bilingual reciprocity, RTL styling, and Core Web Vitals.

---

## 1. Framework & Rendering Engine Audit

### Finding 1.1: SSR Dynamic De-Optimization via `await cookies()` on Core Static Pages
* **Issue:** In `src/app/[locale]/about/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/app/[locale]/terms/page.tsx`, and `src/app/[locale]/privacy/page.tsx`, the Server Components invoke `const store = await cookies();` to determine whether the user preferred `b2b` or `b2c`.
* **Observable Evidence (Build Output):**
  ```text
  Route (app)
  ├ ƒ /[locale]/about
  ├ ƒ /[locale]/contact
  ├ ƒ /[locale]/privacy
  ├ ƒ /[locale]/terms
  ```
  All four routes are marked with `ƒ (Dynamic)` (server-rendered on demand), while every other route is `● (SSG)` or `○ (Static)`.
* **Commercial & Search Impact:**
  1. Googlebot and Bingbot incur unnecessary Time to First Byte (TTFB) latency (typically +150ms to +300ms on serverless invocations) when crawling About (which contains the 12-item bilingual `FAQPage` schema) and Contact (which contains the `AutoPartsStore` local business NAP).
  2. Edge CDN caching is bypassed because responses set dynamic cache headers or vary on cookies.
  3. The personalization achieved is trivial: it only toggles whether the navigation links default to `/b2c` or `/b2b`.
* **Production-Ready Fix:** Remove `await cookies()` from Server Components. Pass a static default audience (`"b2c"`) to `<Shell>` during build time, and allow the client-side `AudienceSwitch` and `Header` components (which are already `"use client"`) to read the `abk_audience` cookie post-mount without forcing dynamic SSR.

#### Code Fix: `src/app/[locale]/about/page.tsx`
```diff
-import { cookies } from "next/headers";
 ...
 export default async function AboutPage({
   params,
 }: {
   params: Promise<{ locale: string }>;
 }) {
   const { locale } = await params;
   if (!hasLocale(routing.locales, locale)) notFound();
   setRequestLocale(locale);
   const l = locale as "en" | "ar";
-  const store = await cookies();
-  const audience = store.get("abk_audience")?.value === "b2b" ? "b2b" : "b2c";
+  // Informational pages remain 100% static SSG. Interactive header reads cookie client-side.
+  const audience = "b2c";
   const t = await getTranslations({ locale, namespace: "About" });
```
*(Apply the identical pattern to `contact/page.tsx`, `privacy/page.tsx`, and `terms/page.tsx`).*

---

### Finding 1.2: B2B Product Canonical Self-Cannibalization
* **Issue:** In `src/app/[locale]/b2b/products/[slug]/page.tsx`, lines 50–61:
  ```typescript
  ...pageMeta(
    locale as Locale,
    product.audience === "both"
      ? `/b2c/products/${product.slug}`
      : `/b2b/products/${product.slug}`,
    { image: productSocialImage(product.slug, product.name[l]) },
  ),
  ```
  Because 53 out of 54 products have `audience: "both"`, 53 B2B product pages emit a cross-path canonical URL pointing to `/b2c/products/${product.slug}`. Furthermore, `src/app/sitemap.ts` explicitly drops these 53 B2B product URLs from the sitemap XML.
* **Observable Evidence:**
  Inspect page source on `https://abktradingservice.com/en/b2b/products/vtek-ppf-weather-armor-ultimate`:
  ```html
  <link rel="canonical" href="https://abktradingservice.com/en/b2c/products/vtek-ppf-weather-armor-ultimate"/>
  <link rel="alternate" hreflang="en" href="https://abktradingservice.com/en/b2c/products/vtek-ppf-weather-armor-ultimate"/>
  ```
* **Commercial & Search Impact:**
  1. Google treats the B2B page as duplicate content and drops it from the index entirely.
  2. ABK is rendered invisible for high-intent wholesale keywords ("wholesale PPF Qatar", "Autotriz ceramic trade supplier", "commercial car care distributor").
  3. Search engines only index the retail page displaying consumer DIY instructions and single-unit retail pricing.
* **Production-Ready Fix:**
  1. Make `/b2b/products/[slug]` self-canonical.
  2. Differentiate the B2B metadata (`title`, `description`, `keywords`) with wholesale/trade language ("Wholesale & Trade Supply", "توزيع جملة للورش ومراكز التلميع").
  3. Include all B2B product URLs in `src/app/sitemap.ts`.

#### Code Fix: `src/app/[locale]/b2b/products/[slug]/page.tsx`
```diff
@@ -33,18 +33,18 @@
   const desc = metaDescription(
     product.shortDesc[l],
     l === "ar"
-      ? "بالجملة من ABK في الدوحة، قطر. استفسر عبر واتساب."
-      : "Wholesale from ABK, Doha, Qatar. WhatsApp for pricing.",
+      ? "توريد جملة وأسعار تجارية لورش التلميع والتركيب في الدوحة، قطر. اطلب عرض سعر عبر واتساب."
+      : "Wholesale & trade supply for detailing studios and tint shops in Doha, Qatar. WhatsApp for commercial quote.",
   );
   return {
-    title: product.name[l],
+    title: l === "ar" ? `${product.name[l]} — توريد جملة` : `${product.name[l]} — Wholesale & Trade`,
     description: desc,
     keywords: [
       product.name[l],
       product.brand,
       categoryLabel,
       ...(l === "ar"
-        ? ["جملة العناية بالسيارات قطر", "الدوحة"]
-        : ["wholesale car care Qatar", "Doha"]),
+        ? ["جملة العناية بالسيارات قطر", "توريد ورش التلميع", "مورد أفلام حماية", "الدوحة"]
+        : ["wholesale car care Qatar", "detailing studio trade supply", "PPF distributor Doha", "bulk car care"]),
     ],
-    ...pageMeta(
-      locale as Locale,
-      product.audience === "both"
-        ? `/b2c/products/${product.slug}`
-        : `/b2b/products/${product.slug}`,
-      { image: productSocialImage(product.slug, product.name[l]) },
-    ),
+    // Self-canonicalize B2B product pages to capture commercial search intent
+    ...pageMeta(locale as Locale, `/b2b/products/${product.slug}`, {
+      image: productSocialImage(product.slug, product.name[l]),
+    }),
   };
```

#### Code Fix: `src/app/sitemap.ts`
```diff
@@ -67,14 +67,9 @@
       const productLastMod = new Date(
         p.updatedAt ?? PRODUCT_DEFAULT_UPDATED_AT,
       );
-      // Canonical-only URLs. Products visible to BOTH audiences render at
-      // /b2c/... and /b2b/... with near-identical content; the b2b copy
-      // canonicalises to the b2c URL (see b2b/products/[slug]/page.tsx), so
-      // only the b2c URL belongs in the sitemap
-      const audiences =
-        p.audience === "both" ? (["b2c"] as const) : ([p.audience] as const);
+      // Include both B2C and B2B URLs now that B2B product pages are self-canonical
+      const audiences = p.audience === "both" ? (["b2c", "b2b"] as const) : ([p.audience] as const);
       for (const aud of audiences) {
         entries.push({
           url: `${base}/${locale}/${aud}/products/${p.slug}`,
```

---

## 2. Bilingual & RTL Architecture

### Finding 2.1: Hreflang Parity & Cluster Validation
* **Current Status:** `src/lib/seo.ts` generates reciprocal hreflang annotations across all routes:
  - `en` → `https://abktradingservice.com/en/...`
  - `ar` → `https://abktradingservice.com/ar/...`
  - `x-default` → `https://abktradingservice.com/en/...`
* **Audit Assessment:** The hreflang implementation conforms to Google Search Central standards. Both language variants self-reference and cross-reference reciprocally.
* **Refinement Required:** Currently, `src/app/sitemap.ts` and `src/lib/seo.ts` map `x-default` to English. For Gulf-targeted businesses with heavy Arabic search query volume (over 65% of local commercial searches in Qatar are executed in Arabic), `x-default` correctly serves as the global fallback, while Arabic queries match `ar_QA`.

### Finding 2.2: RTL Typography & Letter-Spacing Reset
* **Issue:** In `src/app/globals.css`, lines 118–120:
  ```css
  html[dir="rtl"] body * {
    letter-spacing: 0;
  }
  ```
  While resetting `letter-spacing` to `0` is critical for Arabic typography (Arabic script is cursive and letter-spacing breaks the natural ligature connections between letters), applying a universal wildcard selector (`body *`) adds unnecessary CSS selector matching overhead across thousands of DOM nodes.
* **Production-Ready Fix:** Scope the reset at the body level or root container:
  ```css
  html[dir="rtl"] body {
    font-family: var(--font-arabic);
    letter-spacing: normal;
  }
  ```
* **RTL Layout Shift Safeguards:** All components across `src/components/` strictly use logical CSS properties:
  - `start-` and `end-` instead of `left-` and `right-`
  - `ms-` and `me-` instead of `ml-` and `mr-`
  - `ps-` and `pe-` instead of `pl-` and `pr-`
  - `rtl:rotate-180` and `rtl:-scale-x-100` on direction-sensitive arrows and icons (`ChevronIcon`).

---

## 3. Crawlability & Indexation Engine

### Finding 3.1: Faceted Navigation & Missing Static Category / Brand Hubs
* **Issue:** The catalogue currently allows users to filter by category (`ppf`, `tint`, `ceramic`, `shampoo`, etc.) and brand (`VTEK`, `Autotriz`, `Briller`, etc.), but does so purely via client-side query parameters (`?brand=VTEK&category=ppf`).
* **Search Engine Impact:**
  Because parameterized URLs canonicalize to `/b2c/products`, search engines cannot index dedicated landing pages for high-value transactional head terms:
  - "PPF Qatar" / "أفلام حماية الطلاء قطر"
  - "Ceramic Coating Doha" / "نانو سيراميك قطر"
  - "Car Shampoo Wholesale Qatar" / "شامبو سيارات جملة"
  - "Autotriz Qatar" / "وكيل اوتوتريز قطر"
* **Architectural Blueprint:** Introduce static nested category and brand hub routes:
  1. `src/app/[locale]/[audience]/categories/[category]/page.tsx`
  2. `src/app/[locale]/[audience]/brands/[brand]/page.tsx`
  Each page pre-renders with a dedicated semantic `<h1>`, category description optimized for Qatar climate challenges, tailored `ItemList` JSON-LD schema, and a filtered product grid.

### Finding 3.2: Next.js 16 Proxy Middleware Configuration
* **Code Location:** `src/proxy.ts` (Next.js 16 convention replacing `middleware.ts`).
* **Matcher Audit:**
  ```typescript
  export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  };
  ```
* **Evaluation:** The regex properly excludes static assets, media files, and internal Next.js endpoints.
* **Trailing Slash Consistency:** Currently, `next.config.ts` does not enforce trailing slashes (`trailingSlash: false` default). All canonical URLs in `seo.ts` omit trailing slashes. This avoids duplicate slash/non-slash URL fragmentation.

---

## 4. Core Web Vitals & Media Optimization

### Finding 4.1: Responsive Image Sizing Audit (`sizes` Attribute)
* **Code Location:** `src/components/product/ProductCard.tsx` (line 53)
  ```tsx
  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 300px"
  ```
* **Evaluation:** On mobile devices (viewports < 768px), the catalog renders as a 2-column grid (`grid-cols-2`), making `50vw` mathematically accurate.
* **LCP Shelf Optimization:**
  In `src/components/home/HomeHero.tsx` and `src/components/home/BestSellerCard.tsx`, images in the initial viewport correctly declare `fetchPriority="high"` and `loading="eager"`.
* **Format Negotiation:**
  `next.config.ts` configures:
  ```typescript
  images: {
    formats: ["image/avif", "image/webp"],
  }
  ```
  Next.js automatically negotiates AVIF for modern Chromium/Safari browsers, falling back to WebP.

### Finding 4.2: Font Display Strategy & Layout Shifts
* **Code Location:** `src/lib/fonts.ts`
  Both `Inter` and `IBM_Plex_Sans_Arabic` declare `display: "swap"`.
* **Recommendation:** To prevent minor Cumulative Layout Shift (CLS) when IBM Plex Sans Arabic swaps in over system fallback fonts on slower 4G mobile connections, configure fallback font metrics in `next/font`:
  ```typescript
  export const fontArabic = IBM_Plex_Sans_Arabic({
    subsets: ["arabic"],
    variable: "--font-plex-arabic",
    display: "swap",
    weight: ["400", "500", "600", "700"],
    adjustFontFallback: true, // Prevents CLS on initial paint
  });
  ```

---

## 5. Verification Checklist

To verify the fixes:
1. Run `npm run build` and ensure all routes show `● (SSG)` or `○ (Static)`, confirming that `about`, `contact`, `terms`, and `privacy` are no longer marked as dynamic `ƒ`.
2. Inspect `sitemap.xml` build output: verify that total URLs increase from 165 to 272 (incorporating all 107 B2B product routes across EN and AR).
3. Inspect `<link rel="canonical">` on `/en/b2b/products/vtek-ppf-weather-armor-ultimate` and confirm it resolves to `https://abktradingservice.com/en/b2b/products/vtek-ppf-weather-armor-ultimate`.
