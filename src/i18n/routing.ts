import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  // Middleware-emitted hreflang Link headers said x-default=/ while page
  // metadata (src/lib/seo.ts) says x-default=/en/... — conflicting signals
  // make Google distrust BOTH. Page-level metadata is the complete, correct
  // source; disable the middleware copy.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
