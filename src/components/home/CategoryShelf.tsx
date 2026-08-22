import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shelf } from "@/components/ui/Shelf";
import { CATEGORY_THUMBS, getCategoriesFor } from "@/data/products";
import type { Audience } from "@/lib/whatsapp";

/** The Mac / iPhone / iPad chip row — one tile per catalogue category. */
export function CategoryShelf({ audience }: { audience: Audience }) {
  const t = useTranslations();
  const categories = getCategoriesFor(audience);

  // The <section> is deliberately NOT aria-labelledby: the scroller inside is
  // already a named region, and two landmarks with the same name trip axe.
  return (
    <section className="py-4 lg:py-6">
      <h2 className="sr-only">{t("Home.categoriesTitle")}</h2>
      <Shelf ariaLabel={t("Home.categoriesTitle")}>
        {categories.map((c, i) => (
          <Link
            key={c}
            href={`/${audience}/products?category=${c}`}
            className="group flex w-[104px] flex-col items-center gap-3 text-center lg:w-[120px]"
          >
            <span className="relative block h-[104px] w-[104px] overflow-hidden rounded-tile bg-(--color-tile-dark) lg:h-[120px] lg:w-[120px]">
              <Image
                src={CATEGORY_THUMBS[c]}
                alt=""
                fill
                sizes="120px"
                loading={i < 6 ? "eager" : undefined}
                className="object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
              />
            </span>
            <span className="text-footnote font-medium leading-[1.25] text-(--color-text) underline-offset-2 group-hover:underline">
              {t(`Categories.${c}`)}
            </span>
          </Link>
        ))}
      </Shelf>
    </section>
  );
}
