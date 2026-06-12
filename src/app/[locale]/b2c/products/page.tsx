import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogueDownloads } from "@/components/product/CatalogueDownloads";
import { WhyQatar } from "@/components/home/WhyQatar";
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
    title: t("b2cProductsTitle"),
    description: t("b2cProductsDescription"),
    ...pageMeta(locale as Locale, "/b2c/products"),
  };
}

export default async function B2CProducts({
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

  // ItemList helps Google interpret this page as a catalogue rather than a
  // generic content page. `audience: "both"` and `audience: "b2c"` both
  // surface here — same items as the visible grid, but without the JS-only
  // filter state (which is irrelevant to crawlers).
  const audienceProducts = PRODUCTS.filter(
    (p) => p.audience === "b2c" || p.audience === "both",
  );
  const itemListLd = itemListJsonLd({
    name: meta("b2cProductsTitle"),
    url: `${SITE.url}/${l}/b2c/products`,
    items: audienceProducts.map((p) => ({
      name: p.name[l],
      url: `${SITE.url}/${l}/b2c/products/${p.slug}`,
      image: p.images[0] ? `${SITE.url}${p.images[0]}` : undefined,
    })),
  });

  return (
    <Shell audience="b2c" locale={l}>
      <JsonLd id="ld-itemlist-b2c-products" data={itemListLd} />
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${e("catalogue")}`}
            title={t("title")}
            subtitle={t("subtitleB2c")}
          />
          <div className="mt-10 sm:mt-14">
            <ProductGrid audience="b2c" locale={l} />
          </div>
          <div className="mt-16">
            <CatalogueDownloads />
          </div>
        </Container>
      </section>
      {/* Topical context block — gives Google + AI shopping engines the
          Qatar-climate signals (heat, sand, hard water, salt air) needed to
          rank this catalog page for unbranded queries like "car care
          products Qatar". Placed after the grid so users scan inventory
          first; depth content reinforces below. */}
      <WhyQatar />
    </Shell>
  );
}
