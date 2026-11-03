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

/**
 * URLs that waste a crawl. Search Console's crawl stats (Oct 2026) showed 71% of
 * Googlebot's requests going to `?_rsc=` prefetch payloads and about 10% of its
 * HTML fetches going to filter states of the catalogue, while 94 real pages sat
 * in "Discovered, not indexed". None of them holds content that isn't on a
 * clean URL (the category and brand hubs), and pages render fully without them.
 *
 * A crawler obeys only the most specific group that names it, so this list has
 * to be repeated in every group: the `*` group alone would not reach Googlebot.
 * AdsBot ignores `*` and isn't named here, so ad landing checks are unaffected.
 * `?film=` on the PPF page stays crawlable on purpose: its canonical consolidates
 * those links into the page that sells the installation.
 */
const NOT_WORTH_CRAWLING = ["/api/", "/*?_rsc=", "/*&_rsc=", "/*/b2c/products?"];

export default function robots(): MetadataRoute.Robots {
  const rule = (userAgent: string) => ({
    userAgent,
    allow: "/",
    disallow: NOT_WORTH_CRAWLING,
  });
  return {
    rules: [rule("*"), ...SEARCH_BOTS.map(rule), ...AI_BOTS.map(rule)],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
