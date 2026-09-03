import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ChevronIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import type { BrandKey } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

const FEATURED_BRANDS: Array<{
  key: BrandKey;
  name: string;
  categoryKey: string;
  image: string;
}> = [
  {
    key: "VTEK",
    name: "VTEK",
    categoryKey: "brandTagVTEK",
    image: "/products/vtek/vtek-weather-armor-lineup-v2.webp",
  },
  {
    key: "Autotriz",
    name: "Autotriz",
    categoryKey: "brandTagAutotriz",
    image: "/products/autotriz/autotriz-3d-matrix-range.webp",
  },
  {
    key: "Briller",
    name: "Briller",
    categoryKey: "brandTagBriller",
    image: "/products/briller/briller-wash-and-wax-20l-wide.webp",
  },
  {
    key: "Grizzly",
    name: "Grizzly PPF",
    categoryKey: "brandTagGrizzly",
    image: "/products/grizzly/grizzly-glossy-ppf-premium-plus.webp",
  },
];

export function BrandStrip({ audience }: { audience: Audience }) {
  const t = useTranslations();

  return (
    <section className="bg-white py-12 lg:py-16 border-b border-(--color-border-soft)">
      <Container>
        {/* Two-tone header with gold accent */}
        <div className="max-w-3xl">
          <h2 className="text-display font-bold tracking-tight">
            <span className="block text-(--color-text)">{t("Home.brandsTitle")}</span>
            <span className="block text-(--color-brand-deep)">
              {t("Home.brandsSubtitle")}
            </span>
          </h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-(--color-brand)" />
        </div>

        {/* 4 Brand Cards in 2x2 (mobile) or 4-col (desktop) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {FEATURED_BRANDS.map((b) => (
            <Link
              key={b.key}
              href={`/${audience}/products?brand=${b.key}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-(--color-bg) p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-(--color-brand)/40"
            >
              {/* Product Packshot */}
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-white p-2">
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="mt-5 flex flex-col gap-1">
                <h3 className="text-title-sm font-bold text-(--color-text)">
                  {b.name}
                </h3>
                <p className="text-footnote text-(--color-text-muted)">
                  {t(`Home.${b.categoryKey}`)}
                </p>
              </div>

              {/* Explore action */}
              <div className="mt-5 flex items-center gap-1 font-bold text-footnote text-(--color-brand-deep) group-hover:underline">
                <span className="uppercase tracking-wider">{t("Cta.explore")}</span>
                <ChevronIcon className="h-3 w-3 rtl:-scale-x-100" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
