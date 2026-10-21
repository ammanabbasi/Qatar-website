"use client";

import { useTranslations } from "next-intl";
import { CheckIcon, SparkleIcon } from "@/components/ui/Icons";
import {
  DELIVERY,
  DISCOUNT_ENTRY,
  DISCOUNT_TOP,
  formatPercent,
  formatQar,
  nextDiscountTier,
  quoteDiscount,
  type CartTotals,
  type Fulfilment,
  type PriceLocale,
} from "@/lib/pricing";
import { DeliveryProgress } from "./DeliveryProgress";

/** ICU values for `Cart.discountRule` ("10% off orders of QAR 500 or more…"). */
export function discountRuleValues(locale: PriceLocale) {
  return {
    low: formatPercent(DISCOUNT_ENTRY.percent, locale),
    lowAmount: formatQar(DISCOUNT_ENTRY.minSubtotalQar, locale),
    high: formatPercent(DISCOUNT_TOP.percent, locale),
    highAmount: formatQar(DISCOUNT_TOP.minSubtotalQar, locale),
  };
}

/**
 * Order-discount nudge: progress toward the next tier, or the tier unlocked.
 * Like DeliveryProgress it counts priced lines only.
 */
export function DiscountProgress({
  totals,
  locale,
}: {
  totals: CartTotals;
  locale: PriceLocale;
}) {
  const t = useTranslations("Cart");
  const current = quoteDiscount(totals);
  const next = nextDiscountTier(totals);
  const pct = (n: number) => formatPercent(n, locale);

  if (totals.pricedLines === 0) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl bg-(--color-fill) px-3.5 py-3 text-caption text-(--color-text-muted)">
        <SparkleIcon className="mt-px h-4 w-4 shrink-0 text-(--color-brand-deep)" />
        <p className="font-semibold text-(--color-text)">
          {t("discountRule", discountRuleValues(locale))}
        </p>
      </div>
    );
  }

  const message = next
    ? current
      ? t("discountNextTier", {
          current: pct(current.percent),
          amount: formatQar(next.remainingQar, locale),
          percent: pct(next.percent),
        })
      : t("discountAway", {
          amount: formatQar(next.remainingQar, locale),
          percent: pct(next.percent),
        })
    : t("discountUnlocked", { percent: pct(current!.percent) });
  const bar = next ? Math.min(100, Math.round((totals.pricedSubtotal / next.minSubtotalQar) * 100)) : 100;

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-(--color-fill) px-3.5 py-3">
      <p className="flex items-center gap-2 text-caption font-semibold text-(--color-text)">
        {next ? (
          <SparkleIcon className="h-4 w-4 shrink-0 text-(--color-brand-deep)" />
        ) : (
          <CheckIcon className="h-4 w-4 shrink-0 text-(--color-brand-deep)" />
        )}
        {message}
      </p>
      <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-(--color-surface)">
        <div
          className="h-full rounded-full bg-(--color-brand) transition-[width] duration-300 ease-soft"
          style={{ width: `${bar}%` }}
        />
      </div>
      {next && totals.unpricedLines > 0 ? (
        <p className="text-caption text-(--color-text-muted)">{t("discountPending")}</p>
      ) : null}
    </div>
  );
}

/**
 * One nudge at a time: free delivery first (delivery orders under the
 * threshold), then the order discount — which every qualifying order reaches
 * with free delivery already unlocked. With nothing priced yet, both rules.
 */
export function CartProgress({
  totals,
  locale,
  fulfilment,
}: {
  totals: CartTotals;
  locale: PriceLocale;
  fulfilment: Fulfilment;
}) {
  if (fulfilment === "delivery" && totals.pricedLines === 0) {
    return (
      <>
        <DeliveryProgress totals={totals} locale={locale} />
        <DiscountProgress totals={totals} locale={locale} />
      </>
    );
  }
  return fulfilment === "delivery" && totals.pricedSubtotal < DELIVERY.freeThresholdQar ? (
    <DeliveryProgress totals={totals} locale={locale} />
  ) : (
    <DiscountProgress totals={totals} locale={locale} />
  );
}
