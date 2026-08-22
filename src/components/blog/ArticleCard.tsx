import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";
import type { Article } from "@/data/articles";

type Props = {
  article: Article;
  locale: "en" | "ar";
};

/**
 * Blog listing card — a white tile, same rhythm as the product grid.
 * Copy carries the card; there is no article photography yet.
 */
export function ArticleCard({ article, locale }: Props) {
  return (
    <Link
      href={`/b2c/blog/${article.slug}`}
      className="tile group flex flex-col p-6 transition-shadow duration-300 ease-soft hover:shadow-tile-hover"
    >
      <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-text-muted)">
        {article.readingTime} {locale === "ar" ? "دقائق" : "min read"}
      </p>
      <h3 className="mt-3 line-clamp-2 text-title-sm font-semibold text-balance text-(--color-text)">
        {article.title[locale]}
      </h3>
      <p className="mt-2 line-clamp-3 text-footnote text-(--color-text-muted)">
        {article.description[locale]}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <time
          dateTime={article.date}
          className="text-caption text-(--color-text-muted)"
        >
          {new Date(article.date).toLocaleDateString(
            locale === "ar" ? "ar-QA" : "en-QA",
            { year: "numeric", month: "short", day: "numeric" },
          )}
        </time>
        <span className="text-link text-footnote font-medium">
          {locale === "ar" ? "اقرأ المزيد" : "Read more"}
          <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
