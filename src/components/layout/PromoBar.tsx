"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronIcon, SparkleIcon } from "@/components/ui/Icons";
import { discountRuleValues } from "@/components/cart/DiscountProgress";
import { DELIVERY, formatQar, type PriceLocale } from "@/lib/pricing";

/**
 * Retail offer announcement above the site header, so a first-time visitor
 * learns about the order discount before reaching the cart. Retail pages only
 * (wholesale is quoted on WhatsApp). It scrolls away with the page — the
 * header below it stays the only sticky chrome, so `--header-h` still holds.
 * Every number comes from pricing.ts, the same source the cart uses.
 *
 * Phones get the short line; from sm up the full offer plus free delivery.
 * The whole bar links to the catalogue, except on the catalogue itself.
 */
export function PromoBar({ locale }: { locale: PriceLocale }) {
  const t = useTranslations("Promo");
  const onCatalogue = usePathname() === "/b2c/products";
  const values = {
    ...discountRuleValues(locale),
    freeAmount: formatQar(DELIVERY.freeThresholdQar, locale),
  };
  const body = (
    <>
      <SparkleIcon className="h-3.5 w-3.5 shrink-0 max-[374px]:hidden" />
      <span className="truncate sm:hidden">{t("short", values)}</span>
      <span className="hidden truncate sm:inline">{t("long", values)}</span>
      {onCatalogue ? null : (
        <span className="hidden shrink-0 items-center gap-1 underline-offset-2 group-hover:underline sm:inline-flex">
          {t("shop")}
          <ChevronIcon className="h-2.5 w-2.5 rtl:rotate-180" />
        </span>
      )}
    </>
  );
  const className =
    "group flex h-8 items-center justify-center gap-2 bg-(--color-brand) px-4 text-caption font-semibold text-black sm:h-9 sm:gap-3";

  return (
    <aside aria-label={t("label")}>
      {onCatalogue ? (
        <p className={className}>{body}</p>
      ) : (
        <Link
          href="/b2c/products"
          className={`${className} transition-colors duration-200 ease-soft hover:bg-(--color-brand-hover)`}
        >
          {body}
        </Link>
      )}
    </aside>
  );
}
