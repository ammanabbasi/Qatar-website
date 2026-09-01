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

  return (
    <Link
      href={`/${audience}/products/${product.slug}`}
      className={`group flex flex-col ${className}`}
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
      <div className="flex flex-col gap-1 px-1 pt-4">
        <p className="text-caption font-medium text-(--color-text-muted)">
          {t(`Brands.${product.brand}`)} · {t(`Categories.${product.category}`)}
        </p>
        <Heading className="text-body font-semibold text-(--color-text) sm:text-title-sm">
          {name}
        </Heading>
        <p className="line-clamp-2 text-footnote text-(--color-text-muted)">
          {product.shortDesc[locale]}
        </p>
        <span className="text-link mt-1 text-footnote font-medium">
          {t("Cta.inquire")}
          <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
