import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import { getProductBySlug } from "@/data/products";
import { pageMeta } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/constants";

export const dynamicParams = false;

export async function generateStaticParams() {
  return ARTICLES.flatMap((a) =>
    routing.locales.map((locale) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const l = (locale === "ar" ? "ar" : "en") as "en" | "ar";
  return {
    title: article.title[l],
    description: article.description[l],
    keywords: article.keywords[l],
    ...pageMeta(locale as Locale, `/b2c/blog/${article.slug}`),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale, namespace: "Blog" });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[l],
    description: article.description[l],
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo.webp` },
    },
    mainEntityOfPage: `${SITE.url}/${l}/b2c/blog/${article.slug}`,
    inLanguage: l === "ar" ? "ar-QA" : "en-QA",
  };

  const crumbLd = breadcrumbJsonLd([
    { name: l === "ar" ? "الرئيسية" : "Home", url: `${SITE.url}/${l}` },
    { name: t("title"), url: `${SITE.url}/${l}/b2c/blog` },
    { name: article.title[l], url: `${SITE.url}/${l}/b2c/blog/${article.slug}` },
  ]);

  // Resolve related products
  const relatedProducts = article.relatedProducts
    .map((s) => getProductBySlug(s))
    .filter(Boolean);

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-article" data={articleLd} />
      <JsonLd id="ld-article-crumb" data={crumbLd} />
      <article className="py-16 sm:py-24">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-(--color-text-muted)">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-(--color-gold) transition-colors">
                  {l === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true" className="text-(--color-border)">›</li>
              <li>
                <Link href="/b2c/blog" className="hover:text-(--color-gold) transition-colors">
                  {t("title")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-(--color-border)">›</li>
              <li className="text-(--color-text) truncate max-w-[200px]">{article.title[l]}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="max-w-3xl mb-12">
            <span className="eyebrow text-[0.68rem] uppercase tracking-[0.32em] text-(--color-gold)/90 font-medium">
              {t("eyebrow")}
            </span>
            <h1 className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.08] tracking-[-0.022em] font-medium mt-4">
              {article.title[l]}
            </h1>
            <p className="mt-4 text-(--color-text-muted) text-base sm:text-lg leading-relaxed">
              {article.description[l]}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-(--color-text-muted)">
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString(
                  l === "ar" ? "ar-QA" : "en-QA",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </time>
              <span>·</span>
              <span>
                {article.readingTime} {l === "ar" ? "دقائق قراءة" : "min read"}
              </span>
            </div>
          </header>

          {/* Article body */}
          <div className="max-w-3xl flex flex-col gap-10">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display text-xl sm:text-2xl font-medium mb-4 text-(--color-text)">
                  {section.heading[l]}
                </h2>
                <p className="text-base text-(--color-text-muted) leading-relaxed">
                  {section.body[l]}
                </p>
              </section>
            ))}
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <aside className="mt-16 pt-10 border-t border-(--color-border) max-w-3xl">
              <h2 className="font-display text-xl font-medium mb-6">
                {t("relatedProducts")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedProducts.map(
                  (p) =>
                    p && (
                      <Link
                        key={p.slug}
                        href={`/b2c/products/${p.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-(--color-border) bg-(--color-surface) hover:border-(--color-gold)/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{p.name[l]}</p>
                          <p className="text-xs text-(--color-text-muted) mt-1 line-clamp-1">
                            {p.shortDesc[l]}
                          </p>
                        </div>
                      </Link>
                    ),
                )}
              </div>
            </aside>
          )}

          {/* Back to blog */}
          <div className="mt-12">
            <Link
              href="/b2c/blog"
              className="text-(--color-gold) hover:underline underline-offset-4 text-sm"
            >
              ← {t("backToBlog")}
            </Link>
          </div>
        </Container>
      </article>
    </Shell>
  );
}
