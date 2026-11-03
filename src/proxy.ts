import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Only URLs without a locale need this: it picks /en or /ar for them. Proxy is
  // a Node.js function in one region (US East here), so running it on /en/... and
  // /ar/... sent every Qatar page view to the US and back before the CDN could
  // serve the cached HTML: real-user TTFB 1.4 s, 1.1 s from Bangalore against 0.2 s
  // from New York. Those pages are all statically generated with setRequestLocale,
  // and the language switch sets NEXT_LOCALE itself, so they don't need it.
  matcher: "/((?!en(?:/|$)|ar(?:/|$)|api|trpc|_next|_vercel|.*\\..*).*)",
};
