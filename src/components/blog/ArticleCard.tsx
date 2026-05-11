import { Link } from "@/i18n/navigation";
import type { Article } from "@/data/articles";

type Props = {
  article: Article;
  locale: "en" | "ar";
};

export function ArticleCard({ article, locale }: Props) {
  return (
    <Link
      href={`/b2c/blog/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) card-gold-hover overflow-hidden"
    >
      {/* Gradient header instead of image */}
      <div className="h-36 bg-mesh-gold relative">
        <div className="absolute inset-0 flex items-end p-5">
          <span className="text-[0.65rem] uppercase tracking-[0.28em] text-(--color-gold) font-medium bg-(--color-bg)/70 backdrop-blur-sm px-3 py-1 rounded-full">
            {article.readingTime} {locale === "ar" ? "دقائق" : "min read"}
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-5 gap-3">
        <h3 className="font-display text-lg font-medium leading-snug group-hover:text-(--color-gold) transition-colors line-clamp-2">
          {article.title[locale]}
        </h3>
        <p className="text-sm text-(--color-text-muted) leading-relaxed line-clamp-3">
          {article.description[locale]}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-(--color-text-muted)">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString(
              locale === "ar" ? "ar-QA" : "en-QA",
              { year: "numeric", month: "short", day: "numeric" },
            )}
          </time>
          <span className="text-(--color-gold) group-hover:underline underline-offset-4">
            {locale === "ar" ? "اقرأ المزيد →" : "Read more →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
