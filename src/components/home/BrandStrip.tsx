import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shelf } from "@/components/ui/Shelf";
import { ChevronIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import {
  BRAND_IMAGES,
  getBrandsFor,
  UNPROMOTED_BRANDS,
  type BrandKey,
} from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

const TAG_KEYS: Partial<Record<BrandKey, string>> = {
  Vertek: "brandTagVertek",
  Autotriz: "brandTagAutotriz",
  Briller: "brandTagBriller",
  SmartCar: "brandTagSmartCar",
  ABK: "brandTagABK",
};

/** "Brands we carry." — compact white tiles linking into a brand-filtered catalogue. */
export function BrandStrip({ audience }: { audience: Audience }) {
  const t = useTranslations();
  const brands = getBrandsFor(audience).filter(
    (b) => b !== "Other" && !UNPROMOTED_BRANDS.includes(b),
  );

  return (
    <section className="py-6 lg:py-8">
      <Container className="mb-4">
        <SectionHeading title={t("Home.brandsTitle")} subtitle={t("Home.brandsSubtitle")} />
      </Container>
      <Shelf ariaLabel={t("Home.brandsTitle")}>
        {brands.map((b) => {
          const tagKey = TAG_KEYS[b];
          return (
            <Link
              key={b}
              href={`/${audience}/products?brand=${b}`}
              className="tile group flex w-[240px] flex-col gap-4 p-5 transition-shadow duration-300 ease-soft hover:shadow-tile-hover lg:w-[270px]"
            >
              <span className="relative block h-14 w-14 overflow-hidden rounded-[12px] bg-(--color-tile-dark)">
                <Image
                  src={BRAND_IMAGES[b]}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
                />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-title-sm font-semibold">{t(`Brands.${b}`)}</span>
                {tagKey && (
                  <span className="text-footnote text-(--color-text-muted)">
                    {t(`Home.${tagKey}`)}
                  </span>
                )}
              </span>
              <span className="text-link mt-auto text-footnote font-medium">
                {t("Cta.explore")}
                <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
              </span>
            </Link>
          );
        })}
      </Shelf>
    </section>
  );
}
