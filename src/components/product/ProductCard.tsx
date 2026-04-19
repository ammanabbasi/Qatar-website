import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

export function ProductCard({
  product,
  locale,
  audience,
  priority = false,
}: {
  product: Product;
  locale: "en" | "ar";
  audience: Audience;
  /** Mark first-few-above-the-fold cards so Next.js preloads the image for a faster LCP. */
  priority?: boolean;
}) {
  const t = useTranslations();
  const name = product.name[locale];
  const shortDesc = product.shortDesc[locale];
  const isBriller = product.highlight === "briller-color";
  const brandLabel = t(`Brands.${product.brand}`);
  const categoryLabel = t(`Categories.${product.category}`);

  return (
    <Link
      href={`/${audience}/products/${product.slug}`}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border border-(--color-border) card-gold-hover ${
        isBriller ? "briller-frame" : "bg-(--color-surface)"
      }`}
    >
      {/* Hover-only hexagon corner accent — reveals the Vertek brand motif on hover */}
      <svg
        className="product-card-corner"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 8 L22 0 L44 8 L44 22 L22 30 L0 22 Z"
          stroke="rgba(200,162,74,0.7)"
          strokeWidth="0.8"
        />
      </svg>

      <div className="aspect-[4/5] relative overflow-hidden bg-black">
        <Image
          src={product.images[0]}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
        />
        {/* bottom gradient for text-free legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* brand chip — top start */}
        <span className="absolute top-3 start-3 text-[9px] uppercase tracking-[0.24em] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-(--color-gold)">
          {brandLabel}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <span className="text-[9.5px] uppercase tracking-[0.28em] text-(--color-text-muted)">
          {categoryLabel}
        </span>
        {/* Product titles use the sans font — keeps editorial serif
            reserved for hero + section headings, and gives Briller's
            retail energy a more approachable feel. */}
        <h3 className="text-lg sm:text-xl leading-[1.2] tracking-[-0.005em] font-semibold text-(--color-text) group-hover:text-(--color-gold-soft) transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-(--color-text-muted) line-clamp-2 leading-relaxed">
          {shortDesc}
        </p>
        {/* micro-affordance — arrow slides on hover */}
        <span className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-(--color-gold)/90">
          <span>{t("Cta.inquireWhatsApp")}</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
