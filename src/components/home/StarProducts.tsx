import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { FEATURED_PRODUCTS } from "@/data/products";
import { Link } from "@/i18n/navigation";
import type { Audience } from "@/lib/whatsapp";

export function StarProducts({
  audience,
  locale,
}: {
  audience: Audience;
  locale: "en" | "ar";
}) {
  const t = useTranslations();
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow={`⸻ ${t("Eyebrows.premium")}`}
            title={t("Home.starProductsTitle")}
            subtitle={t("Home.starProductsSubtitle")}
          />
          <Link
            href={`/${audience}/products`}
            className="text-sm text-(--color-gold) hover:underline underline-offset-4 shrink-0"
          >
            {t("Cta.viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7">
          {FEATURED_PRODUCTS.slice(0, 4).map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              locale={locale}
              audience={audience}
              priority={i < 2}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
