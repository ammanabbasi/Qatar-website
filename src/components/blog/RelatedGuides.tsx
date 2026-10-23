import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/data/articles";

type Props = {
  guides: Article[];
  locale: "en" | "ar";
  /** Overrides the default "Guides for drivers in Qatar" heading. */
  title?: string;
  className?: string;
};

/**
 * Crawlable links from catalogue pages into the buying guides. Before this
 * strip the guides were linked only from the blog index, so the pages that
 * rank for "ppf price qatar" and "window tinting rules qatar" received almost
 * no internal links. Renders nothing when no guide matches the page.
 */
export function RelatedGuides({ guides, locale, title, className }: Props) {
  if (guides.length === 0) return null;
  const heading =
    title ?? (locale === "ar" ? "أدلة مفيدة للسائقين في قطر" : "Guides for drivers in Qatar");
  return (
    <section aria-label={heading} className={className}>
      <h2 className="text-title-sm font-semibold text-(--color-text)">{heading}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <ArticleCard key={g.slug} article={g} locale={locale} />
        ))}
      </div>
    </section>
  );
}
