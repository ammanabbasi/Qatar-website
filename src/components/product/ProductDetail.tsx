import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { ProductCard } from "./ProductCard";
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
  const isBriller = product.highlight === "briller-color";

  const productLd = productJsonLd({
    name,
    description: shortDesc,
    brand: t(`Brands.${product.brand}`),
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

  return (
    <>
      <JsonLd id="ld-product" data={productLd} />
      <JsonLd id="ld-breadcrumb" data={bcLd} />

      <section className="py-12 sm:py-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="text-xs text-(--color-text-muted) mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href={homeHref} className="hover:text-(--color-gold)">
              {t("Nav.home")}
            </Link>
            <span>/</span>
            <Link
              href={`/${audience}/products`}
              className="hover:text-(--color-gold)"
            >
              {t("Nav.products")}
            </Link>
            <span>/</span>
            <span className="text-(--color-text)">{name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div
              className={`rounded-3xl border border-(--color-border) overflow-hidden ${
                isBriller ? "briller-frame" : "bg-(--color-surface)"
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1">
                  {product.images.slice(1, 5).map((src) => (
                    <div key={src} className="relative aspect-square bg-black">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div className="flex gap-3 items-center">
                <span className="text-[10px] uppercase tracking-[0.22em] bg-(--color-gold)/15 text-(--color-gold) px-3 py-1 rounded-full border border-(--color-gold)/30">
                  {brandLabel}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-(--color-text-muted)">
                  {categoryLabel}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                {name}
              </h1>
              <p className="text-base sm:text-lg text-(--color-text-muted) leading-relaxed">
                {longDesc}
              </p>

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-xs uppercase tracking-[0.22em] text-(--color-gold) mb-3">
                    {t("Products.detailSpecs")}
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.specs.map((s) => (
                      <div
                        key={s.label[locale]}
                        className="flex flex-col border-s-2 border-(--color-gold)/40 ps-4 py-1"
                      >
                        <dt className="text-xs text-(--color-text-muted)">
                          {s.label[locale]}
                        </dt>
                        <dd className="text-sm">{s.value[locale]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* CTA */}
              <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-display text-lg mb-1">
                    {t("Products.detailAskFor")}
                  </h3>
                  <p className="text-sm text-(--color-text-muted)">
                    {audience === "b2b"
                      ? t("Products.detailAskForB2b")
                      : t("Products.detailAskForB2c")}
                  </p>
                </div>
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
                />
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20 sm:mt-28">
              <h3 className="font-display text-2xl sm:text-3xl mb-8">
                {t("Products.detailRelated")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7">
                {related.map((r) => (
                  <ProductCard
                    key={r.slug}
                    product={r}
                    locale={locale}
                    audience={audience}
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
