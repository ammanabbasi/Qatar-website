import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Only URLs without a locale need this: it picks /en or /ar for them. Proxy runs
  // as a function before the CDN can answer, so covering /en/... and /ar/... slowed
  // every page view: warm TTFB from Bangalore was 1.09 s with it and 0.30 s without
  // (real-user TTFB on /en was 1.4 s). Those pages are all statically generated with
  // setRequestLocale, and the language switch sets NEXT_LOCALE itself.
  matcher: "/((?!en(?:/|$)|ar(?:/|$)|api|trpc|_next|_vercel|.*\\..*).*)",
};
