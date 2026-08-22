import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shelf } from "@/components/ui/Shelf";
import { ChevronIcon } from "@/components/ui/Icons";
import { ProductTile } from "@/components/product/ProductTile";
import { getStoreShelfProducts } from "@/data/products";
import { Link } from "@/i18n/navigation";
import type { Audience } from "@/lib/whatsapp";

/** "The latest." — a shelf of dark product tiles, best-sellers first. */
export function StarProducts({
  audience,
  locale,
}: {
  audience: Audience;
  locale: "en" | "ar";
}) {
  const t = useTranslations();
  const products = getStoreShelfProducts(audience, 8);

  return (
    <section className="py-6 lg:py-8">
      <Container className="mb-4">
        <SectionHeading
          title={t("Home.starProductsTitle")}
          subtitle={t("Home.starProductsSubtitle")}
        />
      </Container>
      <Shelf ariaLabel={t("Home.starProductsTitle")}>
        {products.map((p, i) => (
          <ProductTile
            key={p.slug}
            product={p}
            locale={locale}
            audience={audience}
            eager={i < 3}
          />
        ))}
        <Link
          href={`/${audience}/products`}
          className="tile flex w-[200px] flex-col items-center justify-center gap-4 p-6 text-center transition-shadow duration-300 ease-soft hover:shadow-tile-hover lg:w-[240px]"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
            <ChevronIcon className="h-5 w-5 rtl:-scale-x-100" />
          </span>
          <span className="text-body font-semibold">{t("Cta.viewAll")}</span>
        </Link>
      </Shelf>
    </section>
  );
}
