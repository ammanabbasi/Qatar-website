import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/data/products";
import { pageMeta } from "@/lib/seo";

// Reject any slug not produced by generateStaticParams — b2b-only products
// hit 404 under /b2c instead of rendering an orphan page no listing links to.
export const dynamicParams = false;

export async function generateStaticParams() {
  return PRODUCTS.filter(
    (p) => p.audience === "b2c" || p.audience === "both",
  ).flatMap((p) =>
    routing.locales.map((locale) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const l = (locale === "ar" ? "ar" : "en") as "en" | "ar";
  return {
    title: product.name[l],
    description: product.shortDesc[l],
    ...pageMeta(locale as Locale, `/b2c/products/${product.slug}`),
  };
}

export default async function B2CProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product, "b2c");
  const l = locale as "en" | "ar";

  return (
    <Shell audience="b2c" locale={l}>
      <ProductDetail
        product={product}
        related={related}
        audience="b2c"
        locale={l}
      />
    </Shell>
  );
}
