import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/**
 * Explicit allow-list for search + AI crawlers.
 *
 * `*: /` already admits everyone; naming the agents is a deliberate signal to
 * the AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Meta AI) that
 * their access — training crawls AND live retrieval on a user's behalf — is
 * intentional. For a small retail site, being cited in "where to buy PPF in
 * Doha" answers is pure upside. Add new agents here as engines publish them.
 */
const SEARCH_BOTS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
];
const AI_BOTS = [
  "GPTBot", // OpenAI — model training
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — live browsing for a user
  "ClaudeBot", // Anthropic — crawling
  "Claude-SearchBot", // Anthropic — search index
  "Claude-User", // Anthropic — live fetch for a user
  "anthropic-ai", // Anthropic — legacy UA
  "Google-Extended", // Google — Gemini training + grounding
  "PerplexityBot", // Perplexity — index
  "Perplexity-User", // Perplexity — live fetch for a user
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent", // Meta AI
  "Amazonbot", // Alexa / Rufus
  "DuckAssistBot", // DuckDuckGo AI answers
  "Bytespider", // ByteDance / TikTok search
  "CCBot", // Common Crawl — feeds many open models
  "cohere-ai",
  "MistralAI-User",
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
