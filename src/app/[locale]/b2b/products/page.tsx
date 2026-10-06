import { redirect } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
    title: t("b2bProductsTitle"),
    description: t("b2bProductsDescription"),
    ...pageMeta(locale as Locale, "/b2c/products"),
  };
}

export default async function B2BProducts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  redirect(`/${locale}/b2c/products`);
}
