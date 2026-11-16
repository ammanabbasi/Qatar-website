import { SITE } from "@/lib/constants";

/**
 * Tab-session attribution for SEO, Paid Search & GEO (AI Referrals).
 *
 * Captures the visitor's initial landing parameters (`utm_*`, `gclid`, `gbraid`,
 * `wbraid`, `msclkid`) and external `document.referrer` into `sessionStorage`
 * (tab-scoped, cleared automatically when the tab closes, zero cookies or PII).
 *
 * Why this matters:
 * 1. ChatGPT (`?utm_source=chatgpt.com` / `chatgpt.com`), Perplexity, Gemini,
 *    Claude, and Copilot frequently send visitors to an editorial guide first
 *    (e.g. `/en/b2c/blog/ppf-cost-qatar`), and the visitor then navigates to
 *    `/en/b2c/ppf-installation` or a product page before converting. Without
 *    session persistence, `window.location.search` and `document.referrer` are
 *    both overwritten by the internal navigation before conversion.
 * 2. Attaching `traffic_channel` and `ai_platform` / `search_engine` to GA4 and
 *    Plausible conversion events makes organic search and AI-citation ROI
 *    directly measurable alongside Google Ads.
 */

export type TrafficChannel =
  | "ai_referral"
  | "paid_search"
  | "organic_search"
  | "social"
  | "referral"
  | "direct";

export type SessionAttribution = {
  trafficChannel: TrafficChannel;
  aiPlatform: string;
  searchEngine: string;
  referrerHost: string;
  landingPage: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  aiVisitReported?: boolean;
};

const STORAGE_KEY = "abk_session_attr_v1";

const AI_HOST_PATTERNS: Array<{ platform: string; match: (s: string) => boolean }> = [
  {
    platform: "chatgpt",
    match: (s) =>
      s === "chatgpt" ||
      s.includes("chatgpt.com") ||
      s.includes("chat.openai.com") ||
      s === "openai" ||
      s.endsWith(".openai.com"),
  },
  {
    platform: "perplexity",
    match: (s) => s === "perplexity" || s.includes("perplexity.ai"),
  },
  {
    platform: "gemini",
    match: (s) =>
      s === "gemini" ||
      s.includes("gemini.google.com") ||
      s.includes("bard.google.com"),
  },
  {
    platform: "claude",
    match: (s) =>
      s === "claude" || s.includes("claude.ai") || s.includes("anthropic.com"),
  },
  {
    platform: "copilot",
    match: (s) =>
      s === "copilot" ||
      s.includes("copilot.microsoft.com") ||
      s.includes("edgeservices.bing.com"),
  },
  {
    platform: "grok",
    match: (s) => s === "grok" || s.includes("grok.com") || s === "x.ai" || s.endsWith(".x.ai"),
  },
  {
    platform: "meta_ai",
    match: (s) => s === "meta_ai" || s === "meta.ai" || s.endsWith(".meta.ai"),
  },
  {
    platform: "deepseek",
    match: (s) => s === "deepseek" || s.includes("deepseek.com"),
  },
  {
    platform: "mistral",
    match: (s) => s === "mistral" || s.includes("mistral.ai"),
  },
  {
    platform: "you",
    match: (s) => s === "you.com" || s.endsWith(".you.com"),
  },
  {
    platform: "phind",
    match: (s) => s === "phind" || s.includes("phind.com"),
  },
  {
    platform: "kagi",
    match: (s) => s === "kagi" || s.includes("kagi.com"),
  },
];

const SEARCH_HOST_PATTERNS: Array<{ engine: string; match: (h: string) => boolean }> = [
  { engine: "google", match: (h) => /(^|\.)google\.[a-z.]+$/.test(h) && !h.includes("gemini.") },
  { engine: "bing", match: (h) => h === "bing.com" || h.endsWith(".bing.com") },
  { engine: "duckduckgo", match: (h) => h === "duckduckgo.com" || h.endsWith(".duckduckgo.com") },
  { engine: "yahoo", match: (h) => h.includes("search.yahoo.") || h.endsWith(".yahoo.com") },
  { engine: "yandex", match: (h) => /(^|\.)yandex\.[a-z.]+$/.test(h) },
  { engine: "brave", match: (h) => h === "search.brave.com" },
  { engine: "ecosia", match: (h) => h === "ecosia.org" || h.endsWith(".ecosia.org") },
  { engine: "qwant", match: (h) => h === "qwant.com" || h.endsWith(".qwant.com") },
];

const SOCIAL_HOSTS = [
  "instagram.com",
  "facebook.com",
  "fb.com",
  "tiktok.com",
  "t.co",
  "x.com",
  "twitter.com",
  "youtube.com",
  "youtu.be",
  "linkedin.com",
  "lnkd.in",
  "snapchat.com",
  "pinterest.com",
];

function detectAiPlatform(token: string): string {
  const clean = token.trim().toLowerCase();
  if (!clean) return "";
  for (const entry of AI_HOST_PATTERNS) {
    if (entry.match(clean)) return entry.platform;
  }
  return "";
}

function detectSearchEngine(host: string): string {
  const clean = host.trim().toLowerCase();
  if (!clean) return "";
  for (const entry of SEARCH_HOST_PATTERNS) {
    if (entry.match(clean)) return entry.engine;
  }
  return "";
}

function isSocialHost(host: string): boolean {
  const clean = host.trim().toLowerCase();
  return SOCIAL_HOSTS.some((s) => clean === s || clean.endsWith(`.${s}`));
}

function parseExternalReferrerHost(referrer: string): string {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    const own = SITE.domain.toLowerCase();
    if (
      host === own ||
      host === `www.${own}` ||
      host === "localhost" ||
      host === "127.0.0.1"
    ) {
      return "";
    }
    return host;
  } catch {
    return "";
  }
}

function readGclCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/);
  return m ? decodeURIComponent(m[1]).split(".").slice(2).join(".") : "";
}

function readStored(): SessionAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionAttribution;
  } catch {
    return null;
  }
}

function writeStored(value: SessionAttribution): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (strict privacy / sandboxed webview) — degrade gracefully.
  }
}

/**
 * Computes or updates the current tab session's attribution record.
 * First-touch external attribution wins across internal SPA navigations, while
 * explicit fresh ad click IDs or UTM parameters in the current URL update the record.
 */
export function captureSessionAttribution(): SessionAttribution {
  if (typeof window === "undefined") {
    return {
      trafficChannel: "direct",
      aiPlatform: "",
      searchEngine: "",
      referrerHost: "",
      landingPage: "",
      gclid: "",
      gbraid: "",
      wbraid: "",
      msclkid: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
    };
  }

  const existing = readStored();
  const q = new URLSearchParams(window.location.search);
  const urlGclid = q.get("gclid") ?? "";
  const urlGbraid = q.get("gbraid") ?? "";
  const urlWbraid = q.get("wbraid") ?? "";
  const urlMsclkid = q.get("msclkid") ?? "";
  const urlUtmSource = q.get("utm_source") ?? "";
  const urlUtmMedium = q.get("utm_medium") ?? "";
  const urlUtmCampaign = q.get("utm_campaign") ?? "";

  const hasFreshQueryAttribution = Boolean(
    urlGclid || urlGbraid || urlWbraid || urlMsclkid || urlUtmSource || urlUtmMedium,
  );

  if (existing && !hasFreshQueryAttribution) {
    // Backfill _gcl_aw cookie if gtag populated it after initial capture.
    if (!existing.gclid) {
      const cookieGclid = readGclCookie();
      if (cookieGclid) {
        const updated: SessionAttribution = {
          ...existing,
          gclid: cookieGclid,
          trafficChannel: "paid_search",
        };
        writeStored(updated);
        return updated;
      }
    }
    return existing;
  }

  const referrerHost = parseExternalReferrerHost(document.referrer) || existing?.referrerHost || "";
  const gclid = urlGclid || existing?.gclid || readGclCookie();
  const gbraid = urlGbraid || existing?.gbraid || "";
  const wbraid = urlWbraid || existing?.wbraid || "";
  const msclkid = urlMsclkid || existing?.msclkid || "";
  const utmSource = urlUtmSource || existing?.utmSource || "";
  const utmMedium = urlUtmMedium || existing?.utmMedium || "";
  const utmCampaign = urlUtmCampaign || existing?.utmCampaign || "";
  const landingPage = existing?.landingPage || window.location.pathname;

  const aiFromUtm = detectAiPlatform(utmSource);
  const aiFromRef = detectAiPlatform(referrerHost);
  const aiPlatform = aiFromUtm || aiFromRef;

  const mediumLower = utmMedium.toLowerCase();
  const isPaid = Boolean(
    gclid ||
      gbraid ||
      wbraid ||
      msclkid ||
      mediumLower === "cpc" ||
      mediumLower === "ppc" ||
      mediumLower === "paid" ||
      mediumLower === "paid_search" ||
      mediumLower === "paidsocial",
  );

  const searchEngine = !isPaid && !aiPlatform
    ? detectSearchEngine(referrerHost) || detectSearchEngine(utmSource)
    : "";

  let trafficChannel: TrafficChannel = "direct";
  if (isPaid) {
    trafficChannel = "paid_search";
  } else if (aiPlatform) {
    trafficChannel = "ai_referral";
  } else if (searchEngine || mediumLower === "organic") {
    trafficChannel = "organic_search";
  } else if (isSocialHost(referrerHost) || mediumLower === "social") {
    trafficChannel = "social";
  } else if (referrerHost || utmSource) {
    trafficChannel = "referral";
  }

  const next: SessionAttribution = {
    trafficChannel,
    aiPlatform,
    searchEngine,
    referrerHost,
    landingPage,
    gclid,
    gbraid,
    wbraid,
    msclkid,
    utmSource,
    utmMedium,
    utmCampaign,
    aiVisitReported: existing?.aiVisitReported,
  };

  writeStored(next);
  return next;
}

export function markAiVisitReported(): void {
  const current = captureSessionAttribution();
  if (current.aiVisitReported) return;
  writeStored({ ...current, aiVisitReported: true });
}

/** Flat analytics dimensions to enrich GA4 & Plausible conversion events. */
export function attributionEventParams(): Record<string, string> {
  const a = captureSessionAttribution();
  const out: Record<string, string> = {
    traffic_channel: a.trafficChannel,
  };
  if (a.aiPlatform) out.ai_platform = a.aiPlatform;
  if (a.searchEngine) out.search_engine = a.searchEngine;
  if (a.landingPage) out.landing_page = a.landingPage.slice(0, 160);
  return out;
}

/**
 * Click & campaign fields for `/api/ppf-booking`. Preserves landing UTMs and
 * click IDs across internal page transitions, and synthesizes clear source/medium
 * values for untagged AI citations (e.g. `perplexity` / `ai_referral`) and
 * organic search (`google` / `organic`) when no explicit UTM parameters exist.
 */
export function readBookingAttribution() {
  const a = captureSessionAttribution();
  const fallbackSource =
    a.utmSource ||
    (a.trafficChannel === "ai_referral"
      ? a.aiPlatform
      : a.trafficChannel === "organic_search"
        ? a.searchEngine
        : a.referrerHost);
  const fallbackMedium =
    a.utmMedium ||
    (a.trafficChannel === "ai_referral"
      ? "ai_referral"
      : a.trafficChannel === "organic_search"
        ? "organic"
        : a.trafficChannel === "paid_search"
          ? "cpc"
          : a.referrerHost
            ? "referral"
            : "");

  return {
    gclid: a.gclid,
    gbraid: a.gbraid,
    wbraid: a.wbraid,
    utmSource: fallbackSource,
    utmMedium: fallbackMedium,
    utmCampaign: a.utmCampaign,
  };
}
