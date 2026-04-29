import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogueDownloads } from "@/components/product/CatalogueDownloads";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { itemListJsonLd } from "@/lib/jsonld";
import { PRODUCTS } from "@/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("b2bProductsTitle"),
    description: t("b2bProductsDescription"),
    ...pageMeta(locale as Locale, "/b2b/products"),
  };
}

export default async function B2BProducts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale, namespace: "Products" });
  const e = await getTranslations({ locale, namespace: "Eyebrows" });
  const meta = await getTranslations({ locale, namespace: "Meta" });

  const audienceProducts = PRODUCTS.filter(
    (p) => p.audience === "b2b" || p.audience === "both",
  );
  const itemListLd = itemListJsonLd({
    name: meta("b2bProductsTitle"),
    url: `${SITE.url}/${l}/b2b/products`,
    items: audienceProducts.map((p) => ({
      name: p.name[l],
      url: `${SITE.url}/${l}/b2b/products/${p.slug}`,
      image: p.images[0] ? `${SITE.url}${p.images[0]}` : undefined,
    })),
  });

  return (
    <Shell audience="b2b" locale={l}>
      <Script
        id="ld-itemlist-b2b-products"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${e("wholesaleCatalogue")}`}
            title={t("title")}
            subtitle={t("subtitleB2b")}
          />
          <div className="mt-10 sm:mt-14">
            <ProductGrid audience="b2b" locale={l} />
          </div>
          <div className="mt-16">
            <CatalogueDownloads />
          </div>
        </Container>
      </section>
    </Shell>
  );
}
