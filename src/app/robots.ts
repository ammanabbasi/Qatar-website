import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/**
 * Explicit allow-list for search + AI crawlers.
 *
 * Named user-agents are a stronger discoverability signal than a bare `*: /` —
 * it tells AI answer engines (ChatGPT, Claude, Perplexity, Gemini) that their
 * access is intentional, not accidental. For a small retail site, surfacing
 * in AI shopping answers is pure upside.
 */
const SEARCH_BOTS = ["Googlebot", "Bingbot", "DuckDuckBot", "Applebot"];
const AI_BOTS = [
  "GPTBot", // OpenAI / ChatGPT
  "ClaudeBot", // Anthropic / Claude
  "anthropic-ai", // Anthropic legacy UA
  "Google-Extended", // Gemini / Bard training + serving
  "PerplexityBot", // Perplexity answer engine
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...SEARCH_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
