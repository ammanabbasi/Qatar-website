import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Production-grade security headers. Deliberately lenient on CSP — Google Maps
 * iframe, Plausible remote script, and Next.js inline styles would require a
 * complex CSP + nonce pipeline that's fragile during development. Defer strict
 * CSP to a post-launch hardening pass.
 *
 * HSTS is set to 1 year WITHOUT the `preload` directive — preload + the browser
 * preload list is effectively permanent (opt-out takes months and not all
 * browsers honour it). 1 year with includeSubDomains gives the same practical
 * protection for normal users, with a graceful escape hatch if a subdomain ever
 * needs migration. Can opt into preload post-launch once the domain is stable.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Vercel restores .next/cache between builds. On 2026-10-03 the warm
    // Turbopack cache shipped the previous globals.css (new .ppf-* rules
    // missing) although the source had changed. Builds take under a minute
    // cold, so correctness wins over the warm start.
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    // Every rule below lands on its FINAL URL in one hop. Googlebot follows a
    // chain, but each extra hop costs crawl budget and dilutes the signal, and
    // the old rules produced two-hop chains (b2b → b2c/ with a trailing slash →
    // b2c, and localeless → locale redirect by the next-intl middleware).
    return [
      // The bare domain is the URL everyone links to (Google Business Profile,
      // ads, cards, citations). next-intl answers it with a 307, which Google
      // treats as temporary, so the canonical signal never settles on /en. Send
      // everyone permanently to /en EXCEPT visitors who asked for Arabic (header
      // or the NEXT_LOCALE cookie the language switch sets): those fall through
      // to the middleware, which still negotiates /ar. `missing` items must ALL
      // fail to match for the redirect to apply, so a crawler with no
      // Accept-Language header gets the 308.
      {
        source: "/",
        missing: [
          { type: "header", key: "accept-language", value: ".*\\b[aA][rR]\\b.*" },
          { type: "cookie", key: "NEXT_LOCALE", value: "ar" },
        ],
        destination: "/en",
        permanent: true,
      },
      // The B2C home moved from /{locale}/b2c to the locale root. 308
      // (permanent) so Google transfers any signals the old URL collected.
      // Config redirects run BEFORE the next-intl middleware, so this fires
      // even though the /b2c page route no longer exists. Deeper /b2c/*
      // routes (products, blog) still exist and are NOT redirected.
      {
        source: "/:locale(en|ar)/b2c",
        destination: "/:locale",
        permanent: true,
      },
      // Legacy Vertek PPF & Window Tint URLs → the VTEK product routes. These
      // come BEFORE the generic b2b rules so a legacy /b2b/ URL is one hop, not
      // two. Destination is always the b2c route (b2b product pages are gone).
      {
        source: "/:locale(en|ar)/:audience(b2c|b2b)/products/vertek-ppf-weather-armor",
        destination: "/:locale/b2c/products/vtek-ppf-weather-armor-ultimate",
        permanent: true,
      },
      {
        source: "/:audience(b2c|b2b)/products/vertek-ppf-weather-armor",
        destination: "/en/b2c/products/vtek-ppf-weather-armor-ultimate",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/:audience(b2c|b2b)/products/vertek-window-tints",
        destination: "/:locale/b2c/products/vtek-window-tints",
        permanent: true,
      },
      {
        source: "/:audience(b2c|b2b)/products/vertek-window-tints",
        destination: "/en/b2c/products/vtek-window-tints",
        permanent: true,
      },
      // Unified catalogue: redirect B2B wholesale routes to the main offerings
      // catalogue. `:slug+` (one or more) for detail pages and a separate exact
      // rule for the listing: with `:slug*` an empty slug produced
      // `/b2c/products/` and Next then 308'd again to drop the trailing slash.
      {
        source: "/:locale(en|ar)/b2b/products/:slug+",
        destination: "/:locale/b2c/products/:slug+",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/b2b/products",
        destination: "/:locale/b2c/products",
        permanent: true,
      },
      {
        source: "/b2b/products/:slug+",
        destination: "/en/b2c/products/:slug+",
        permanent: true,
      },
      {
        source: "/b2b/products",
        destination: "/en/b2c/products",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/b2b",
        destination: "/:locale/b2c/products",
        permanent: true,
      },
      {
        source: "/b2b",
        destination: "/en/b2c/products",
        permanent: true,
      },
      // /b2c/services was live and indexed before the services offering was
      // withdrawn. 301 to the catalogue so its link equity carries over and
      // shared links do not dead-end on a 404.
      {
        source: "/:locale(en|ar)/b2c/services",
        destination: "/:locale/b2c/products",
        permanent: true,
      },
      {
        source: "/b2c/services",
        destination: "/en/b2c/products",
        permanent: true,
      },
      // Localeless page URLs (/privacy, /contact, /b2c/products/…) otherwise
      // reach the next-intl middleware, which answers with a 307. Google keeps
      // the source URL of a temporary redirect, and Search Console showed
      // `/privacy` itself collecting impressions. Same rule as the bare domain:
      // permanent to English unless the visitor asked for Arabic, who still
      // falls through to the middleware's /ar negotiation. Listed after the
      // specific legacy rules above so those keep their one-hop targets.
      {
        source: "/:path(about|contact|privacy|terms|b2c/.+|b2b/become-a-dealer)",
        missing: [
          { type: "header", key: "accept-language", value: ".*\\b[aA][rR]\\b.*" },
          { type: "cookie", key: "NEXT_LOCALE", value: "ar" },
        ],
        destination: "/en/:path",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
