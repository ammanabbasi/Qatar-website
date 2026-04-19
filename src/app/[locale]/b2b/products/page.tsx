import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogueDownloads } from "@/components/product/CatalogueDownloads";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("productsTitle"),
    description: t("productsDescription"),
    ...pageMeta(locale as Locale, "/b2b/products"),
  };
}

export default async function B2BProducts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const t = await getTranslations({ locale, namespace: "Products" });
  const e = await getTranslations({ locale, namespace: "Eyebrows" });

  return (
    <Shell audience="b2b" locale={l}>
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${e("wholesaleCatalogue")}`}
            title={t("title")}
            subtitle={t("subtitleB2b")}
          />
          <div className="mt-10 sm:mt-14">
            <ProductGrid audience="b2b" locale={l} />
          </div>
          <div className="mt-16">
            <CatalogueDownloads />
          </div>
        </Container>
      </section>
    </Shell>
  );
}
