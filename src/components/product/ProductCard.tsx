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
 *
 * Phones (two columns, ~150px each) get a denser card: a three-line clamped
 * title, no description, and one action row of [Add] + an icon-only WhatsApp
 * button. sm+ keeps the stacked, fully labelled layout.
 */
export function ProductCard({
  product,
  locale,
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
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-1 pt-2.5 sm:pt-4">
        <div className="flex min-w-0 items-center justify-between gap-1.5 max-sm:flex-wrap max-sm:gap-y-0.5">
          <p className="min-w-0 truncate text-caption font-medium text-(--color-text-muted)">
            {t(`Brands.${product.brand}`)}
            <span className="max-sm:hidden"> · {t(`Categories.${product.category}`)}</span>
          </p>
          {product.price ? (
            <div className="flex shrink-0 items-baseline gap-1.5">
              <span className="whitespace-nowrap rounded-md bg-(--color-brand)/12 px-2 py-0.5 text-caption font-bold text-(--color-brand-deep) max-sm:text-[color-mix(in_srgb,var(--color-brand-deep)_85%,black)]">
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
        {/* line-clamp's overflow:hidden does not clip the link's stretched
            ::after: its containing block is the relative card root above.
            Three lines on phones: the variant (ULTIMATE / PRO PLUS / MATTE)
            sits at the end of many names and must not be cut off. */}
        <Heading className="line-clamp-3 text-footnote font-semibold text-(--color-text) sm:line-clamp-none sm:text-title-sm">
          <Link
            href={`/b2c/products/${product.slug}`}
            className="after:absolute after:inset-0 after:rounded-tile focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-(--color-brand-deep)"
          >
            {name}
          </Link>
        </Heading>
        <p className="line-clamp-2 text-footnote text-(--color-text-muted) max-sm:hidden">
          {product.shortDesc[locale]}
        </p>

        {/* Action buttons — above the stretched link overlay. Phones: one row,
            [Add (fills)] + a 44px icon-only WhatsApp button; sm+: stacked. */}
        <div className="relative z-10 mt-auto flex gap-1.5 pt-2.5 sm:flex-col sm:gap-2 sm:pt-3">
          {product.price ? (
            <AddToCartButton slug={product.slug} className="min-w-0 flex-1 sm:flex-none" />
          ) : null}

          {/* No aria-label: the accessible name is the visible label plus the
              sr-only product name, so "label in name" holds at every width
              (on phones the priced button's label is sr-only, icon only). */}
          <a
            href={wholesaleWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative inline-flex items-center justify-center gap-1.5 rounded-pill font-semibold transition-colors duration-150 ease-soft text-footnote ${
              product.price
                ? "h-11 w-11 shrink-0 border border-black/10 bg-(--color-surface) text-(--color-text) hover:border-(--color-brand) hover:bg-(--color-brand)/10 dark:border-white/15 dark:hover:border-(--color-brand) sm:h-9 sm:w-full"
                : "h-11 w-full bg-(--color-brand) text-black hover:bg-(--color-brand-hover) shadow-xs"
            }`}
          >
            <WhatsAppIcon className={`shrink-0 ${product.price ? "h-5 w-5 text-emerald-600 dark:text-emerald-400 sm:h-4 sm:w-4" : "h-4 w-4 text-black"}`} />
            {product.price ? (
              <span className="truncate max-sm:sr-only">{t("Products.inquireWholesale")}</span>
            ) : (
              <>
                <span className="truncate sm:hidden">{t("Cta.getQuote")}</span>
                <span className="truncate max-sm:hidden">{t("Products.inquireWholesale")}</span>
              </>
            )}
            <span className="sr-only"> — {name}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
