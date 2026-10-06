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
  /** Load immediately at high priority — for the first above-the-fold cards (LCP). */
  eager?: boolean;
  /** Heading level: h2 directly under a page h1 (catalogue), h3 inside an h2 section (shelves). */
  as?: "h2" | "h3";
  className?: string;
};

/**
 * Catalogue card — photo tile above, copy below.
 *
 * The product name is a stretched link (its ::after covers the whole card),
 * so the "Add to cart" and "Inquire for Wholesale" buttons sit on top of it.
 */
export function ProductCard({
  product,
  locale,
  audience = "b2c",
  eager = false,
  as: Heading = "h3",
  className = "",
}: Props) {
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
    <div className={`group relative flex min-w-0 flex-col ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-tile bg-(--color-surface) shadow-tile transition-shadow duration-300 ease-soft group-hover:shadow-tile-hover">
        <Image
          src={product.images[0]}
          alt={name}
          fill
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 300px"
          loading={eager ? "eager" : undefined}
          fetchPriority={eager ? "high" : undefined}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
        />
        {product.originalPrice && (
          <span className="absolute start-2.5 top-2.5 z-[2] rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {t("Products.saleBadge")}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-1 pt-4">
        <div className="flex min-w-0 items-center justify-between gap-1.5">
          <p className="min-w-0 truncate text-caption font-medium text-(--color-text-muted)">
            {t(`Brands.${product.brand}`)}
            <span className="max-sm:hidden"> · {t(`Categories.${product.category}`)}</span>
          </p>
          {product.price ? (
            <div className="flex shrink-0 items-baseline gap-1.5">
              <span className="whitespace-nowrap rounded-md bg-(--color-brand)/12 px-2 py-0.5 text-caption font-bold text-(--color-brand-deep)">
                {product.price[locale]}
              </span>
              {product.originalPrice ? (
                <span className="whitespace-nowrap text-[11px] text-(--color-text-muted) line-through">
                  {product.originalPrice[locale]}
                </span>
              ) : null}
            </div>
          ) : (
            <span className="shrink-0 whitespace-nowrap rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              {t("Cart.priceOnRequest")}
            </span>
          )}
        </div>
        <Heading className="text-body font-semibold text-(--color-text) sm:text-title-sm">
          <Link
            href={`/b2c/products/${product.slug}`}
            className="after:absolute after:inset-0 after:rounded-tile focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-(--color-brand-deep)"
          >
            {name}
          </Link>
        </Heading>
        <p className="line-clamp-2 text-footnote text-(--color-text-muted)">
          {product.shortDesc[locale]}
        </p>

        {/* Action buttons — above the stretched link overlay */}
        <div className="relative z-10 mt-auto flex flex-col gap-2 pt-3">
          {product.price ? (
            <AddToCartButton slug={product.slug} />
          ) : null}

          <a
            href={wholesaleWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("Products.inquireWholesale")} — ${name}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-pill font-semibold transition-colors duration-150 ease-soft text-footnote ${
              product.price
                ? "h-9 w-full border border-black/10 bg-(--color-surface) text-(--color-text) hover:border-(--color-brand) hover:bg-(--color-brand)/10 dark:border-white/15 dark:hover:border-(--color-brand)"
                : "h-11 w-full bg-(--color-brand) text-black hover:bg-(--color-brand-hover) shadow-xs"
            }`}
          >
            <WhatsAppIcon className={`h-4 w-4 shrink-0 ${product.price ? "text-emerald-600 dark:text-emerald-400" : "text-black"}`} />
            <span className="truncate">{t("Products.inquireWholesale")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
