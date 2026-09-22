import { JsonLd } from "@/components/seo/JsonLd";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shelf } from "@/components/ui/Shelf";
import { ChevronIcon, PinIcon, BadgeIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductCrossBanner } from "./ProductCrossBanner";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";
import type { Audience, WALocale } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

type Props = {
  product: Product;
  related: Product[];
  audience: Audience;
  locale: WALocale;
};

export function ProductDetail({ product, related, audience, locale }: Props) {
  const t = useTranslations();
  const name = product.name[locale];
  const longDesc = product.longDesc[locale];
  const shortDesc = product.shortDesc[locale];
  const brandLabel = t(`Brands.${product.brand}`);
  const categoryLabel = t(`Categories.${product.category}`);
  const productUrl = `${SITE.url}/${locale}/${audience}/products/${product.slug}`;
  const isAvailableInOtherAudience =
    product.audience === "both" ||
    product.audience === (audience === "b2c" ? "b2b" : "b2c");

  const productLd = productJsonLd({
    name,
    description: shortDesc,
    brand: brandLabel,
    category: categoryLabel,
    sku: product.slug,
    images: product.images.map((src) => `${SITE.url}${src}`),
    url: productUrl,
    priceQar: product.priceQar,
  });
  // B2C home lives at the locale root; B2B home keeps its /b2b prefix.
  const homeHref = audience === "b2c" ? "/" : `/${audience}`;
  const bcLd = breadcrumbJsonLd([
    {
      name: t("Brand.name"),
      url: audience === "b2c" ? `${SITE.url}/${locale}` : `${SITE.url}/${locale}/${audience}`,
    },
    { name: t("Products.title"), url: `${SITE.url}/${locale}/${audience}/products` },
    { name, url: productUrl },
  ]);

  const crumb = "text-caption text-white/60 transition-colors hover:text-white";

  return (
    <>
      <JsonLd id="ld-product" data={productLd} />
      <JsonLd id="ld-breadcrumb" data={bcLd} />

      {/* The name + brand eyebrow open in the same dark band as every other
          page; the gallery and buying column continue on the light ground. */}
      <PageHero
        eyebrow={`${brandLabel} · ${categoryLabel}`}
        title={name}
        subtitle={shortDesc}
        breadcrumb={
          <nav aria-label={t("Nav.breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={homeHref} className={crumb}>
                  {t("Nav.home")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-white/40 rtl:-scale-x-100" />
              </li>
              <li>
                <Link href={`/${audience}/products`} className={crumb}>
                  {t("Nav.products")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-white/40 rtl:-scale-x-100" />
              </li>
              <li className="text-caption text-white/90">{name}</li>
            </ol>
          </nav>
        }
      />

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <ProductGallery images={product.images} alt={name} />

            <div className="flex flex-col gap-6">
              {/* Contextual Cross-Audience Banner */}
              <ProductCrossBanner
                audience={audience}
                slug={product.slug}
                isAvailableInOtherAudience={isAvailableInOtherAudience}
              />

              <p className="text-body text-(--color-text-muted)">{longDesc}</p>

              <ul className="flex flex-col gap-2 text-footnote text-(--color-text)">
                <li className="flex items-center gap-2.5">
                  <PinIcon className="h-[18px] w-[18px] shrink-0 text-(--color-text-muted)" />
                  <span>{t("Products.availableAt")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeIcon className="h-[18px] w-[18px] shrink-0 text-(--color-text-muted)" />
                  <span>{t("Products.retailWholesale")}</span>
                </li>
              </ul>

              {/* Differentiated Purchase & Quote Panel */}
              <ProductPurchasePanel
                product={product}
                audience={audience}
                locale={locale}
                productUrl={productUrl}
              />

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div>
                  <h2 className="text-body font-semibold">{t("Products.detailSpecs")}</h2>
                  <dl className="mt-2 divide-y divide-(--color-border-soft) border-y border-(--color-border-soft)">
                    {product.specs.map((s) => (
                      <div
                        key={s.label[locale]}
                        className="grid gap-1 py-3 text-footnote sm:grid-cols-[9rem_1fr] sm:gap-4"
                      >
                        <dt className="text-(--color-text-muted)">{s.label[locale]}</dt>
                        <dd className="text-(--color-text)">{s.value[locale]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-8 sm:py-12">
          <Container className="mb-4">
            <SectionHeading title={t("Products.detailRelated")} />
          </Container>
          <Shelf ariaLabel={t("Products.detailRelated")}>
            {related.map((r) => (
              <ProductCard
                key={r.slug}
                product={r}
                locale={locale}
                audience={audience}
                className="w-[240px] lg:w-[280px]"
              />
            ))}
          </Shelf>
        </section>
      )}
    </>
  );
}
