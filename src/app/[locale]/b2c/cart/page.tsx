import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { CartPageView } from "@/components/cart/CartPageView";
import { PRODUCTS, getStoreShelfProducts } from "@/data/products";
import { allAddOnSlugs } from "@/data/addOns";

// Build-time guard: a typo in the owner-editable add-on map fails the build
// instead of silently dropping a suggestion from every cart.
const knownSlugs = new Set(PRODUCTS.map((p) => p.slug));
const unknownAddOns = allAddOnSlugs().filter((slug) => !knownSlugs.has(slug));
if (unknownAddOns.length > 0) {
  throw new Error(
    `src/data/addOns.ts references unknown product slugs: ${unknownAddOns.join(", ")}`,
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("cartTitle"),
    description: t("cartDescription"),
    // A per-visitor page: nothing here for search engines to index. The
    // route is also left out of sitemap.ts.
    robots: { index: false, follow: true },
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";

  // Priced best-sellers: the empty cart's "Popular right now" row and the
  // add-on fallback when a cart's own pairings run out.
  const popularSlugs = getStoreShelfProducts("b2c", 12)
    .filter((p) => p.priceQar !== undefined)
    .map((p) => p.slug);

  return (
    // Light header: checkout is task-focused, so it skips the dark page band.
    // No floating WhatsApp bubble — it would send a generic message instead
    // of the order being built here.
    <Shell audience="b2c" locale={l} headerTone="light" floatingWhatsApp={false}>
      <CartPageView popularSlugs={popularSlugs} />
    </Shell>
  );
}
