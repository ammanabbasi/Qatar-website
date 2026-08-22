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
  /** Load immediately at high priority — for the first tiles above the fold. */
  eager?: boolean;
};

/**
 * Large dark shelf tile — the Apple "iPhone 17 Pro" tile. Copy sits at the
 * top on a clean ground; the studio photo fills the lower four-fifths and
 * dissolves upward into the tile so there is no visible photo edge.
 */
export function ProductTile({ product, locale, audience, eager = false }: Props) {
  const t = useTranslations();
  const name = product.name[locale];

  return (
    <Link
      href={`/${audience}/products/${product.slug}`}
      className="tile-dark group relative block aspect-[4/5] w-[300px] overflow-hidden transition-shadow duration-300 ease-soft hover:shadow-tile-hover sm:w-[340px] lg:w-[405px]"
    >
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
            product.featured ? "text-(--color-brand)" : "text-white/60"
          }`}
        >
          {product.featured ? t("Home.bestSeller") : t(`Brands.${product.brand}`)}
        </p>
        <h3 className="mt-1.5 text-title-sm font-semibold text-balance text-white lg:text-title">
          {name}
        </h3>
        <p className="mt-2 line-clamp-2 text-footnote text-white/75">
          {product.shortDesc[locale]}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-footnote font-medium text-white">
          {t("Cta.inquire")}
          <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
