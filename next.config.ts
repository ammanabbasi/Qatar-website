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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // The B2C home moved from /{locale}/b2c to the locale root. 308
      // (permanent) so Google transfers any signals the old URL collected.
      // Config redirects run BEFORE the next-intl middleware, so this fires
      // even though the /b2c page route no longer exists. Deeper /b2c/*
      // routes (products, services, blog) still exist and are NOT redirected.
      {
        source: "/:locale(en|ar)/b2c",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
