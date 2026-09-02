import { JsonLd } from "@/components/seo/JsonLd";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shelf } from "@/components/ui/Shelf";
import { ChevronIcon, PinIcon, BadgeIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { ProductCard } from "./ProductCard";
import { ProductGallery } from "./ProductGallery";
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

  const productLd = productJsonLd({
    name,
    description: shortDesc,
    brand: brandLabel,
    category: categoryLabel,
    sku: product.slug,
    images: product.images.map((src) => `${SITE.url}${src}`),
    url: productUrl,
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

  const crumb = "text-caption text-(--color-text-muted) transition-colors hover:text-(--color-text)";

  return (
    <>
      <JsonLd id="ld-product" data={productLd} />
      <JsonLd id="ld-breadcrumb" data={bcLd} />

      <section className="py-8 sm:py-12">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label={t("Nav.breadcrumb")} className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={homeHref} className={crumb}>
                  {t("Nav.home")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-(--color-text-subtle) rtl:-scale-x-100" />
              </li>
              <li>
                <Link href={`/${audience}/products`} className={crumb}>
                  {t("Nav.products")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronIcon className="h-2.5 w-2.5 text-(--color-text-subtle) rtl:-scale-x-100" />
              </li>
              <li className="text-caption text-(--color-text)">{name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <ProductGallery images={product.images} alt={name} />

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-text-muted)">
                  {brandLabel} · {categoryLabel}
                </p>
                <h1 className="mt-2 text-headline font-semibold text-balance lg:text-display">
                  {name}
                </h1>
                <p className="mt-4 text-body text-(--color-text-muted)">{longDesc}</p>
              </div>

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

              {/* CTA */}
              <div className="tile p-6">
                <h2 className="text-title-sm font-semibold">{t("Products.detailAskFor")}</h2>
                <p className="mt-1.5 text-footnote text-(--color-text-muted)">
                  {audience === "b2b"
                    ? t("Products.detailAskForB2b")
                    : t("Products.detailAskForB2c")}
                </p>
                <div className="mt-5">
                  <WhatsAppButton
                    audience={audience}
                    locale={locale}
                    productName={name}
                    productUrl={productUrl}
                    label={
                      audience === "b2b"
                        ? t("Cta.wholesaleInquiry")
                        : t("Cta.inquireWhatsApp")
                    }
                    emailFallbackLabel={t("Cta.preferEmail")}
                    size="lg"
                    className="w-full"
                  />
                </div>
              </div>

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
