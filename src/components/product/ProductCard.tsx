import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";
import type { Product } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

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
  const ctaLabel = isB2b
    ? locale === "ar"
      ? "طلب تسعير جملة"
      : "Wholesale Quote"
    : product.price
      ? locale === "ar"
        ? "طلب عبر واتساب"
        : "Order on WhatsApp"
      : t("Cta.inquire");

  return (
    <Link
      href={`/${audience}/products/${product.slug}`}
      className={`group flex flex-col min-w-0 ${className}`}
    >
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
      <div className="flex flex-col gap-1 px-1 pt-4 min-w-0">
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <p className="min-w-0 truncate text-caption font-medium text-(--color-text-muted)">
            {t(`Brands.${product.brand}`)} · {t(`Categories.${product.category}`)}
          </p>
          {isB2b ? (
            product.price ? (
              <span className="shrink-0 rounded-md bg-(--color-brand)/12 px-2 py-0.5 text-[11px] font-semibold text-(--color-brand-deep) whitespace-nowrap">
                {locale === "ar" ? "سعر تجزئة: " : "MSRP: "}
                {product.price[locale]}
              </span>
            ) : (
              <span className="shrink-0 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                {locale === "ar" ? "توريد جملة" : "Trade Supply"}
              </span>
            )
          ) : (
            product.price && (
              <span className="shrink-0 rounded-md bg-(--color-brand)/12 px-2 py-0.5 text-caption font-bold text-(--color-brand-deep) whitespace-nowrap">
                {product.price[locale]}
              </span>
            )
          )}
        </div>
        <Heading className="text-body font-semibold text-(--color-text) sm:text-title-sm">
          {name}
        </Heading>
        <p className="line-clamp-2 text-footnote text-(--color-text-muted)">
          {product.shortDesc[locale]}
        </p>
        <span className="text-link mt-1 text-footnote font-medium flex items-center gap-1">
          <span>{ctaLabel}</span>
          <ChevronIcon className="h-[0.65em] w-[0.65em] rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}
