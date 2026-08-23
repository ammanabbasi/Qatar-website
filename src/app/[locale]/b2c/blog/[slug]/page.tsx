import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { ChevronIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import { getProductBySlug } from "@/data/products";
import { defaultSocialImage, pageMeta } from "@/lib/seo";
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
    ...pageMeta(locale as Locale, `/b2c/blog/${article.slug}`, {
      article: { publishedTime: article.date },
    }),
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
  const nav = await getTranslations({ locale, namespace: "Nav" });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[l],
    description: article.description[l],
    // `image` is recommended for Article rich results, ideally in several
    // aspect ratios: the 1.91:1 brand card plus the 1:1 product hero stand in
    // until posts get their own cover art.
    image: [defaultSocialImage(l).url, `${SITE.url}/og/abk-hero-1x1.jpg`],
    url: `${SITE.url}/${l}/b2c/blog/${article.slug}`,
    keywords: article.keywords[l].join(", "),
    articleSection: article.category,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
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

  const crumb =
    "text-caption text-(--color-text-muted) transition-colors hover:text-(--color-text)";

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-article" data={articleLd} />
      <JsonLd id="ld-article-crumb" data={crumbLd} />
      <article className="pb-16 pt-10 sm:pt-14 lg:pt-20">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label={nav("breadcrumb")} className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className={crumb}>
                  {l === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-(--color-text-subtle) rtl:-scale-x-100" />
              </li>
              <li>
                <Link href="/b2c/blog" className={crumb}>
                  {t("title")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-(--color-text-subtle) rtl:-scale-x-100" />
              </li>
              <li className="text-caption text-(--color-text)">
                {article.title[l]}
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="max-w-3xl">
            <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-text-muted)">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 text-headline font-semibold text-balance lg:text-display">
              {article.title[l]}
            </h1>
            <p className="mt-4 text-body-lg text-(--color-text-muted)">
              {article.description[l]}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-caption text-(--color-text-muted)">
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString(
                  l === "ar" ? "ar-QA" : "en-QA",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </time>
              <span aria-hidden>·</span>
              <span>
                {article.readingTime} {l === "ar" ? "دقائق قراءة" : "min read"}
              </span>
            </div>
          </header>

          {/* Article body */}
          <div className="mt-10 flex max-w-3xl flex-col gap-10">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="mb-3 text-title-sm font-semibold lg:text-title">
                  {section.heading[l]}
                </h2>
                <p className="text-body text-(--color-text-muted)">
                  {section.body[l]}
                </p>
              </section>
            ))}
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <aside className="mt-16 max-w-3xl border-t border-(--color-border-soft) pt-10">
              <h2 className="text-title-sm font-semibold">
                {t("relatedProducts")}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {relatedProducts.map(
                  (p) =>
                    p && (
                      <li key={p.slug}>
                        <Link
                          href={`/b2c/products/${p.slug}`}
                          className="tile flex items-center gap-4 p-3 transition-shadow duration-300 ease-soft hover:shadow-tile-hover"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-(--color-tile-dark)">
                            <Image
                              src={p.images[0]}
                              alt={p.name[l]}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-footnote font-semibold text-(--color-text)">
                              {p.name[l]}
                            </p>
                            <p className="line-clamp-1 text-caption text-(--color-text-muted)">
                              {p.shortDesc[l]}
                            </p>
                          </div>
                          <ChevronIcon className="ms-auto h-3 w-3 shrink-0 text-(--color-text-subtle) rtl:-scale-x-100" />
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </aside>
          )}

          {/* Back to blog */}
          <div className="mt-12">
            <TextLink
              href="/b2c/blog"
              size="footnote"
              className="font-medium [&>svg]:-scale-x-100 rtl:[&>svg]:scale-x-100"
            >
              {t("backToBlog")}
            </TextLink>
          </div>
        </Container>
      </article>
    </Shell>
  );
}
