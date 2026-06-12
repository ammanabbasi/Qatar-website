import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/data/products";
import { pageMeta } from "@/lib/seo";

// Reject any slug not produced by generateStaticParams — b2c-only products
// hit 404 under /b2b instead of rendering an orphan page no listing links to.
export const dynamicParams = false;

export async function generateStaticParams() {
  return PRODUCTS.filter(
    (p) => p.audience === "b2b" || p.audience === "both",
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
  const t = await getTranslations({ locale, namespace: "Categories" });
  const categoryLabel = t(product.category);
  const desc =
    l === "ar"
      ? `${product.shortDesc[l]} — متوفر بالجملة لدى ABK في الدوحة، قطر. استفسر عبر واتساب.`
      : `${product.shortDesc[l]} — Available wholesale at ABK in Doha, Qatar. Inquire on WhatsApp.`;
  return {
    title: product.name[l],
    description: desc,
    keywords: [
      product.name[l],
      product.brand,
      categoryLabel,
      ...(l === "ar"
        ? ["جملة العناية بالسيارات قطر", "الدوحة"]
        : ["wholesale car care Qatar", "Doha"]),
    ],
    // Products sold to BOTH audiences render near-identical pages at
    // /b2c/products/X and /b2b/products/X (same title, same ProductDetail
    // body). Two self-canonical duplicates split ranking signals and let
    // Google pick the winner arbitrarily — so the b2b copy canonicalises to
    // the b2c URL. b2b-ONLY products have no b2c twin and stay self-canonical.
    ...pageMeta(
      locale as Locale,
      product.audience === "both"
        ? `/b2c/products/${product.slug}`
        : `/b2b/products/${product.slug}`,
    ),
  };
}

export default async function B2BProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product, "b2b");
  const l = locale as "en" | "ar";

  return (
    <Shell audience="b2b" locale={l}>
      <ProductDetail
        product={product}
        related={related}
        audience="b2b"
        locale={l}
      />
    </Shell>
  );
}
