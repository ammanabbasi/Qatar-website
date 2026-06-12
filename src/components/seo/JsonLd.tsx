/**
 * Server-rendered JSON-LD structured data.
 *
 * MUST be a native `<script>` tag, NOT `next/script`: next/script injects
 * client-side after hydration, so crawlers fetching raw HTML (Googlebot's
 * first wave, Bingbot, AI answer engines) never see the structured data.
 * Per Next.js docs (guides/json-ld): "Since JSON-LD is structured data, not
 * executable code, a native <script> tag is the right choice here."
 *
 * `<` is escaped to `<` so a malicious "</script>" sequence inside data
 * can't terminate the tag early (XSS guard recommended by the same doc).
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
