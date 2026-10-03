import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Product } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";
import { filmForSlug, installHref, installedFromQar } from "@/lib/ppfOffer";
import { formatQar } from "@/lib/pricing";

type Props = {
  product: Product;
  locale: "en" | "ar";
  audience: Audience;
  /** Load immediately at high priority — for the first above-the-fold cards (LCP). */
  eager?: boolean;
  /** Heading level: h2 directly under a page h1 (catalogue), h3 inside an h2 section (shelves). */
  as?: "h2" | "h3";
  className?: string;
};

/**
 * Catalogue card — photo tile above, copy below, the Apple accessories grid.
 *
 * The product name is a stretched link (its ::after covers the whole card),
 * so the retail "Add to cart" button can sit on top of it instead of inside
 * it — a button nested in a link is invalid HTML and unreliable to tap.
 */
export function ProductCard({
  product,
  locale,
  audience,
  eager = false,
  as: Heading = "h3",
  className = "",
}: Props) {
  const t = useTranslations();
  const name = product.name[locale];
  const isB2b = audience === "b2b";
  // Retail VTEK films also sell as an installed service. A sibling of the
  // stretched product link (never inside it), above its overlay like the cart button.
  const film = !isB2b ? filmForSlug(product.slug) : undefined;
  const installFrom = film ? installedFromQar(film.key) : null;

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
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-1 pt-4">
        <div className="flex min-w-0 items-center justify-between gap-1.5">
          <p className="min-w-0 truncate text-caption font-medium text-(--color-text-muted)">
            {t(`Brands.${product.brand}`)} · {t(`Categories.${product.category}`)}
          </p>
          {isB2b ? (
            product.price ? (
              <span className="shrink-0 whitespace-nowrap rounded-md bg-(--color-brand)/12 px-2 py-0.5 text-[11px] font-semibold text-(--color-brand-deep)">
                {t("Products.cardMsrp", { price: product.price[locale] })}
              </span>
            ) : (
              <span className="shrink-0 whitespace-nowrap rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                {t("Products.cardTradeSupply")}
              </span>
            )
          ) : product.price ? (
            <span className="shrink-0 whitespace-nowrap rounded-md bg-(--color-brand)/12 px-2 py-0.5 text-caption font-bold text-(--color-brand-deep)">
              {product.price[locale]}
            </span>
          ) : null}
        </div>
        <Heading className="text-body font-semibold text-(--color-text) sm:text-title-sm">
          <Link
            href={`/${audience}/products/${product.slug}`}
            className="after:absolute after:inset-0 after:rounded-tile focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-(--color-brand-deep)"
          >
            {name}
          </Link>
        </Heading>
        {!isB2b && !product.price ? (
          <p className="text-caption font-medium text-(--color-text-muted)">
            {t("Cart.priceOnRequest")}
          </p>
        ) : null}
        <p className="line-clamp-2 text-footnote text-(--color-text-muted)">
          {product.shortDesc[locale]}
        </p>
        {isB2b ? (
          <span className="text-link mt-1 flex items-center gap-1 text-footnote font-medium">
            <span>{t("Products.cardWholesaleQuote")}</span>
            <ChevronIcon className="h-[0.65em] w-[0.65em] rtl:rotate-180" />
          </span>
        ) : (
          // Above the stretched link's overlay, and pushed to the card's
          // bottom so buttons line up across a grid row.
          <div className="relative z-10 mt-auto flex flex-col gap-2 pt-3">
            {film ? (
              <Link
                href={installHref(film.key)}
                className="group/install flex min-h-11 items-center justify-between gap-2 rounded-xl bg-(--color-tile-dark) px-3 py-1.5 text-white ring-1 ring-inset ring-(--color-brand)/35 transition-colors duration-150 ease-soft hover:ring-(--color-brand)"
              >
                <span className="min-w-0 leading-tight">
                  <span className="block text-[11px] font-semibold text-(--color-brand)">
                    {installFrom === null ? t("PpfPromo.installedLabel") : t("PpfPromo.fromLabel")}
                  </span>
                  <span className="block truncate text-footnote font-bold tabular-nums">
                    {installFrom === null ? t("PpfPromo.perCar") : formatQar(installFrom, locale)}
                  </span>
                  <span className="sr-only"> — {film.name[locale]}</span>
                </span>
                <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-(--color-brand) transition-transform duration-150 ease-soft group-hover/install:translate-x-0.5 rtl:rotate-180 rtl:group-hover/install:-translate-x-0.5" />
              </Link>
            ) : null}
            <AddToCartButton slug={product.slug} />
          </div>
        )}
      </div>
    </div>
  );
}
