import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { buildWhatsAppUrl, type Audience } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  locale: "en" | "ar";
  audience?: Audience;
  /** Load immediately at high priority — for the first tiles above the fold. */
  eager?: boolean;
};

/**
 * Large shelf tile — copy sits at the top; the white-background packshot fills
 * the lower area. "Add to cart" and "Inquire for Wholesale" buttons sit in the
 * bottom action area above the link overlay.
 */
export function ProductTile({ product, locale, audience = "b2c", eager = false }: Props) {
  const t = useTranslations();
  const name = product.name[locale];

  const wholesaleWaUrl = buildWhatsAppUrl({
    audience: "b2b",
    locale,
    productName: name,
    productPrice: product.price ? product.price[locale] : undefined,
    productUrl: `${SITE.url}/${locale}/b2c/products/${product.slug}`,
  });

  return (
    <div className="tile group relative block aspect-[4/5] w-[300px] overflow-hidden transition-shadow duration-300 ease-soft hover:shadow-tile-hover sm:w-[340px] lg:w-[405px]">
      <div className="tile-fade-top absolute inset-x-0 bottom-0 aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 405px"
          loading={eager ? "eager" : undefined}
          fetchPriority={eager ? "high" : undefined}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative flex flex-col p-6 lg:p-7">
        <p
          className={`text-caption font-semibold uppercase tracking-[0.04em] ${
            product.featured ? "text-(--color-brand-deep)" : "text-(--color-text-muted)"
          }`}
        >
          {product.featured ? t("Home.bestSeller") : t(`Brands.${product.brand}`)}
        </p>
        <h3 className="mt-1.5 text-title-sm font-semibold text-balance text-(--color-text) lg:text-title">
          {name}
        </h3>
        {product.price ? (
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
            <span className="text-footnote font-bold text-(--color-brand-deep)">
              {product.price[locale]}
            </span>
            {product.originalPrice ? (
              <span className="text-[11px] text-(--color-text-muted) line-through">
                {product.originalPrice[locale]}
              </span>
            ) : null}
            {product.originalPrice ? (
              <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                {t("Products.saleBadge")}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="mt-1 text-footnote font-medium text-(--color-text-muted)">
            {t("Cart.priceOnRequest")}
          </p>
        )}
        <p className="mt-2 line-clamp-2 text-footnote text-(--color-text-muted)">
          {product.shortDesc[locale]}
        </p>
      </div>
      <Link
        href={`/b2c/products/${product.slug}`}
        aria-label={name}
        className="absolute inset-0 z-[1] rounded-[inherit] focus-visible:-outline-offset-4"
      />
      <div className="absolute bottom-5 start-6 end-6 z-[2] flex flex-wrap items-center gap-2 lg:bottom-6 lg:start-7 lg:end-7">
        {product.price ? (
          <AddToCartButton slug={product.slug} variant="compact" className="shadow-tile" />
        ) : null}
        <a
          href={wholesaleWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("Products.inquireWholesale")} — ${name}`}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-pill border border-black/10 bg-white/95 px-3.5 text-footnote font-semibold text-black transition-colors hover:border-(--color-brand) hover:bg-(--color-brand)/15 shadow-tile backdrop-blur-xs"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{t("Products.inquireWholesale")}</span>
        </a>
      </div>
    </div>
  );
}
