import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { TextLink } from "@/components/ui/TextLink";
import { ChevronIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import { getProductBySlug } from "@/data/products";
import { defaultSocialImage, pageMeta } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
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
      article: {
        publishedTime: article.date,
        modifiedTime: article.updated,
      },
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

  const articleUrl = `${SITE.url}/${l}/b2c/blog/${article.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: article.title[l],
    description: article.description[l],
    // `image` is recommended for Article rich results, ideally in several
    // aspect ratios: the 1.91:1 brand card plus the 1:1 product hero stand in
    // until posts get their own cover art.
    image: [defaultSocialImage(l).url, `${SITE.url}/og/abk-hero-1x1.jpg`],
    url: articleUrl,
    keywords: article.keywords[l].join(", "),
    articleSection: article.category,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: {
      "@type": "Organization",
      "@id": `${SITE.url}#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}#organization`,
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo.webp` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    inLanguage: l === "ar" ? "ar-QA" : "en-QA",
  };

  const crumbLd = breadcrumbJsonLd([
    { name: l === "ar" ? "الرئيسية" : "Home", url: `${SITE.url}/${l}` },
    { name: t("title"), url: `${SITE.url}/${l}/b2c/blog` },
    { name: article.title[l], url: `${SITE.url}/${l}/b2c/blog/${article.slug}` },
  ]);

  const faqLd =
    article.faqs && article.faqs.length > 0
      ? faqJsonLd(
          article.faqs.map((f) => ({
            question: f.q[l],
            answer: f.a[l],
          })),
        )
      : null;

  // Resolve related products
  const relatedProducts = article.relatedProducts
    .map((s) => getProductBySlug(s))
    .filter(Boolean);

  const crumb = "text-caption text-white/60 transition-colors hover:text-white";

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-article" data={articleLd} />
      <JsonLd id="ld-article-crumb" data={crumbLd} />
      {faqLd ? <JsonLd id="ld-article-faq" data={faqLd} /> : null}
      <PageHero
        eyebrow={t("eyebrow")}
        title={article.title[l]}
        subtitle={article.description[l]}
        breadcrumb={
          <nav aria-label={nav("breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className={crumb}>
                  {l === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-white/40 rtl:-scale-x-100" />
              </li>
              <li>
                <Link href="/b2c/blog" className={crumb}>
                  {t("title")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-white/40 rtl:-scale-x-100" />
              </li>
              <li className="text-caption text-white/90">{article.title[l]}</li>
            </ol>
          </nav>
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2 text-caption text-white/50">
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
      </PageHero>
      <article className="pb-16 pt-10 sm:pt-12">
        <Container>
          {/* Article body */}
          <div className="flex max-w-3xl flex-col gap-10">
            {article.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-10">
                <section>
                  <h2 className="mb-3 text-title-sm font-semibold lg:text-title">
                    {section.heading[l]}
                  </h2>
                  <p className="text-body text-(--color-text-muted)">
                    {section.body[l]}
                  </p>
                </section>
                {i === 1 && article.inlineCta ? (
                  <aside
                    aria-label={article.inlineCta.title[l]}
                    className="tile border border-(--color-brand)/35 bg-(--color-brand)/8 p-6 sm:p-7"
                  >
                    <span className="inline-block rounded-pill bg-(--color-brand)/20 px-3 py-1 text-caption font-bold uppercase tracking-wider text-(--color-brand-deep)">
                      {article.inlineCta.badge[l]}
                    </span>
                    <h3 className="mt-3 text-title-sm font-bold text-(--color-text)">
                      {article.inlineCta.title[l]}
                    </h3>
                    <p className="mt-2 text-footnote leading-relaxed text-(--color-text-muted)">
                      {article.inlineCta.body[l]}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {article.inlineCta.primaryExternal ? (
                        <a
                          href={article.inlineCta.primaryHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-placement="blog_inline_cta"
                          className="plausible-event-audience=b2c inline-flex h-11 items-center justify-center rounded-pill bg-(--color-brand) px-6 text-footnote font-semibold text-(--color-ink) transition-colors duration-200 hover:bg-(--color-brand-hover)"
                        >
                          {article.inlineCta.primaryLabel[l]}
                        </a>
                      ) : (
                        <Link
                          href={article.inlineCta.primaryHref}
                          className="inline-flex h-11 items-center justify-center rounded-pill bg-(--color-brand) px-6 text-footnote font-semibold text-(--color-ink) transition-colors duration-200 hover:bg-(--color-brand-hover)"
                        >
                          {article.inlineCta.primaryLabel[l]}
                        </Link>
                      )}
                      {article.inlineCta.secondaryHref &&
                      article.inlineCta.secondaryLabel ? (
                        article.inlineCta.secondaryHref.startsWith("http") ? (
                          <a
                            href={article.inlineCta.secondaryHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-placement="blog_inline_cta"
                            className="plausible-event-audience=b2c inline-flex h-11 items-center justify-center rounded-pill border border-(--color-border) bg-(--color-surface) px-5 text-footnote font-semibold text-(--color-text) transition-colors duration-200 hover:bg-(--color-fill)"
                          >
                            {article.inlineCta.secondaryLabel[l]}
                          </a>
                        ) : (
                          <Link
                            href={article.inlineCta.secondaryHref}
                            className="inline-flex h-11 items-center justify-center rounded-pill border border-(--color-border) bg-(--color-surface) px-5 text-footnote font-semibold text-(--color-text) transition-colors duration-200 hover:bg-(--color-fill)"
                          >
                            {article.inlineCta.secondaryLabel[l]}
                          </Link>
                        )
                      ) : null}
                    </div>
                  </aside>
                ) : null}
              </div>
            ))}
          </div>

          {article.cta && (
            <aside className="tile mt-12 flex max-w-3xl flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-body-lg font-semibold">{article.cta.title[l]}</h2>
                <p className="mt-1 text-footnote text-(--color-text-muted)">{article.cta.body[l]}</p>
              </div>
              <Link
                href={article.cta.href}
                className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-pill bg-(--color-brand) px-6 text-footnote font-semibold text-(--color-ink) transition-colors duration-200 hover:bg-(--color-brand-hover) sm:self-auto"
              >
                {article.cta.action[l]}
              </Link>
            </aside>
          )}

          {/* Frequently Asked Questions */}
          {article.faqs && article.faqs.length > 0 && (
            <section
              aria-labelledby="article-faq-heading"
              className="mt-14 max-w-3xl border-t border-(--color-border-soft) pt-10"
            >
              <h2
                id="article-faq-heading"
                className="text-title-sm font-semibold text-(--color-text)"
              >
                {l === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                {article.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="tile group p-5 transition-all"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold text-(--color-text)">
                      <span>{faq.q[l]}</span>
                      <ChevronIcon className="h-3.5 w-3.5 shrink-0 rotate-90 text-(--color-text-subtle) transition-transform group-open:-rotate-90" />
                    </summary>
                    <p className="mt-3 text-footnote leading-relaxed text-(--color-text-muted)">
                      {faq.a[l]}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

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
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-(--color-bg)">
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
