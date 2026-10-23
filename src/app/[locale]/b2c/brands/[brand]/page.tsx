import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ChevronIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/product/ProductCard";
import { PpfInstallStrip } from "@/components/ppf/PpfInstallStrip";
import { RelatedGuides } from "@/components/blog/RelatedGuides";
import { relatedGuides } from "@/data/articles";
import { Link } from "@/i18n/navigation";
import { clampDescription, fitTitle, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/jsonld";
import {
  BRAND_LANDING_PAGES,
  CATEGORY_LANDING_PAGES,
  getBrandLanding,
  getProductsByBrandLanding,
} from "@/data/categoriesAndBrands";

export const dynamicParams = false;

export async function generateStaticParams() {
  return BRAND_LANDING_PAGES.flatMap((b) =>
    routing.locales.map((locale) => ({ locale, brand: b.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale, brand } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const data = getBrandLanding(brand);
  if (!data) return {};
  const l = (locale === "ar" ? "ar" : "en") as "en" | "ar";
  return {
    title: fitTitle(data.title[l]),
    description: clampDescription(data.description[l]),
    keywords: data.keywords[l],
    ...pageMeta(locale as Locale, `/b2c/brands/${data.slug}`),
  };
}

export default async function BrandLandingPage({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale, brand } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const data = getBrandLanding(brand);
  if (!data) notFound();

  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale });
  const products = getProductsByBrandLanding(data);
  const pageUrl = `${SITE.url}/${l}/b2c/brands/${data.slug}`;
  const brandLabel = t(`Brands.${data.brandKey}`);

  const itemListLd = itemListJsonLd({
    name: data.h1[l],
    url: pageUrl,
    items: products.map((p) => ({
      name: p.name[l],
      url: `${SITE.url}/${l}/b2c/products/${p.slug}`,
      image: p.images[0] ? `${SITE.url}${p.images[0]}` : undefined,
    })),
  });

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: data.h1[l],
    description: data.description[l],
    url: pageUrl,
    inLanguage: l === "ar" ? "ar-QA" : "en-QA",
    isPartOf: { "@id": `${SITE.url}#website` },
    about: {
      "@type": "Brand",
      name: brandLabel,
    },
    mainEntity: itemListLd,
  };

  const crumbLd = breadcrumbJsonLd([
    { name: t("Nav.home"), url: `${SITE.url}/${l}` },
    { name: t("Nav.products"), url: `${SITE.url}/${l}/b2c/products` },
    { name: brandLabel, url: pageUrl },
  ]);

  const faqLd = faqJsonLd(
    data.faqs.map((f) => ({
      question: f.q[l],
      answer: f.a[l],
    })),
  );

  const crumb = "text-caption text-white/60 transition-colors hover:text-white";

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id={`ld-brand-collection-${data.slug}`} data={collectionLd} />
      <JsonLd id={`ld-brand-itemlist-${data.slug}`} data={itemListLd} />
      <JsonLd id={`ld-brand-crumb-${data.slug}`} data={crumbLd} />
      <JsonLd id={`ld-brand-faq-${data.slug}`} data={faqLd} />

      <PageHero
        eyebrow={data.eyebrow[l]}
        title={data.h1[l]}
        subtitle={data.subtitle[l]}
        breadcrumb={
          <nav aria-label={t("Nav.breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className={crumb}>
                  {t("Nav.home")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-white/40 rtl:-scale-x-100" />
              </li>
              <li>
                <Link href="/b2c/products" className={crumb}>
                  {t("Nav.products")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-white/40 rtl:-scale-x-100" />
              </li>
              <li className="text-caption text-white/90">{brandLabel}</li>
            </ol>
          </nav>
        }
      />

      <section className="py-8 sm:py-10">
        <Container>
          <div className="flex flex-col gap-8">
            {/* Brand Switcher Navigation */}
            <nav
              aria-label={t("Products.filterBrand")}
              className="flex flex-wrap items-center gap-2"
            >
              <Link
                href="/b2c/products"
                className="inline-flex h-9 items-center rounded-pill bg-(--color-surface) px-4 text-caption font-medium text-(--color-text-muted) shadow-[0_0_0_1px_var(--color-border)] transition-colors hover:text-(--color-text)"
              >
                {t("Products.filterAll")}
              </Link>
              {BRAND_LANDING_PAGES.map((b) => {
                const active = b.slug === data.slug;
                return (
                  <Link
                    key={b.slug}
                    href={`/b2c/brands/${b.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "inline-flex h-9 items-center rounded-pill bg-(--color-ink) px-4 text-caption font-semibold text-white"
                        : "inline-flex h-9 items-center rounded-pill bg-(--color-surface) px-4 text-caption font-medium text-(--color-text-muted) shadow-[0_0_0_1px_var(--color-border)] transition-colors hover:text-(--color-text)"
                    }
                  >
                    {t(`Brands.${b.brandKey}`)}
                  </Link>
                );
              })}
            </nav>

            {data.slug === "vtek" || data.slug === "grizzly" ? (
              <PpfInstallStrip locale={l} />
            ) : null}

            <div className="flex items-center justify-between text-footnote text-(--color-text-muted)">
              <span>{t("Products.count", { count: products.length })}</span>
              <Link
                href={`/b2c/products?brand=${data.brandKey}`}
                className="text-link font-medium"
              >
                {l === "ar"
                  ? "البحث والفرز في الكتالوج الكامل ←"
                  : "Search & sort in full catalogue →"}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  locale={l}
                  audience="b2c"
                  eager={i < 4}
                  as="h2"
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Brand Overview & FAQ */}
      <section className="border-t border-(--color-border-soft) py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-pill bg-(--color-fill) px-3 py-1 text-caption font-semibold text-(--color-text)">
                  {data.roleBadge[l]}
                </span>
                <span className="text-caption text-(--color-text-muted)">
                  {l === "ar" ? `المنشأ: ${data.origin.ar}` : `Origin: ${data.origin.en}`}
                </span>
              </div>
              <h2 className="text-title-sm font-semibold lg:text-title">
                {data.guideTitle[l]}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-body text-(--color-text-muted)">
                {data.guideParagraphs[l].map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/b2b/become-a-dealer"
                  className="inline-flex h-10 items-center rounded-pill bg-(--color-brand) px-5 text-footnote font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand-hover)"
                >
                  {l === "ar"
                    ? "كن موزعاً معتمداً أو اطلب تسعير جملة"
                    : "Apply for Wholesale / Dealer Account"}
                </Link>
                <Link
                  href="/b2c/ppf-installation"
                  className="inline-flex h-10 items-center rounded-pill bg-(--color-surface) px-5 text-footnote font-semibold text-(--color-text) shadow-[0_0_0_1px_var(--color-border)] transition-colors hover:bg-(--color-fill)"
                >
                  {l === "ar"
                    ? "احجز تركيب أفلام VTEK PPF في الدوحة"
                    : "Book VTEK PPF Installation in Doha"}
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-title-sm font-semibold">
                {l === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {data.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="tile group p-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-footnote font-semibold text-(--color-text)">
                      <span>{faq.q[l]}</span>
                      <ChevronIcon className="h-3.5 w-3.5 shrink-0 rotate-90 text-(--color-text-muted) transition-transform group-open:-rotate-90" />
                    </summary>
                    <p className="mt-2.5 text-footnote text-(--color-text-muted)">
                      {faq.a[l]}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <RelatedGuides
            guides={relatedGuides({
              products: products.map((p) => p.slug),
              categories: [...new Set(products.map((p) => p.category))],
              // Hubs index their topic, so they list every matching guide (two
              // rows) — with three, VTEK's PPF guides crowded out the tint guide.
              limit: 6,
            })}
            locale={l}
            className="mt-12 border-t border-(--color-border-soft) pt-8"
          />

          {/* Shop by Category Cross-Links */}
          <div className="mt-12 border-t border-(--color-border-soft) pt-8">
            <h3 className="text-footnote font-semibold text-(--color-text-muted)">
              {l === "ar" ? "تصفح حسب الفئة" : "Browse by Category"}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORY_LANDING_PAGES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/b2c/categories/${c.slug}`}
                  className="inline-flex h-8 items-center rounded-pill bg-(--color-surface) px-3.5 text-caption font-medium text-(--color-text) shadow-[0_0_0_1px_var(--color-border)] transition-colors hover:bg-(--color-fill)"
                >
                  {t(`Categories.${c.slug}`)}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Shell>
  );
}
