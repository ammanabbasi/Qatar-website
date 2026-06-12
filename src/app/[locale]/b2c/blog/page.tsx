import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ARTICLES } from "@/data/articles";
import { pageMeta } from "@/lib/seo";
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    ...pageMeta(locale as Locale, "/b2c/blog"),
  };
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale, namespace: "Blog" });

  const listLd = itemListJsonLd({
    name: l === "ar" ? "مقالات العناية بالسيارات" : "Car Care Articles",
    url: `${SITE.url}/${l}/b2c/blog`,
    items: ARTICLES.map((a) => ({
      name: a.title[l],
      url: `${SITE.url}/${l}/b2c/blog/${a.slug}`,
    })),
  });

  const crumbLd = breadcrumbJsonLd([
    { name: l === "ar" ? "الرئيسية" : "Home", url: `${SITE.url}/${l}` },
    { name: t("title"), url: `${SITE.url}/${l}/b2c/blog` },
  ]);

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-blog-list" data={listLd} />
      <JsonLd id="ld-blog-crumb" data={crumbLd} />
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${t("eyebrow")}`}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={l}
              />
            ))}
          </div>
        </Container>
      </section>
    </Shell>
  );
}
