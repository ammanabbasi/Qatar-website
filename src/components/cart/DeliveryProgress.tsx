"use client";

import { useTranslations } from "next-intl";
import { CheckIcon, TruckIcon } from "@/components/ui/Icons";
import { DELIVERY, formatQar, type CartTotals, type PriceLocale } from "@/lib/pricing";

/**
 * Free-delivery nudge. Counts priced lines only — a cart of price-on-request
 * items gets the rule and a "we'll confirm" note instead of a 0% bar.
 */
export function DeliveryProgress({
  totals,
  locale,
}: {
  totals: CartTotals;
  locale: PriceLocale;
}) {
  const t = useTranslations("Cart");
  const threshold = DELIVERY.freeThresholdQar;
  const reached = totals.pricedSubtotal >= threshold;

  if (totals.pricedLines === 0) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl bg-(--color-fill) px-3.5 py-3 text-caption text-(--color-text-muted)">
        <TruckIcon className="mt-px h-4 w-4 shrink-0 text-(--color-brand-deep)" />
        <p>
          <span className="font-semibold text-(--color-text)">
            {t("freeRule", {
              amount: formatQar(threshold, locale),
              fee: formatQar(DELIVERY.feeQar, locale),
            })}
          </span>{" "}
          {totals.unpricedLines > 0 ? t("freePending") : null}
        </p>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((totals.pricedSubtotal / threshold) * 100));

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-(--color-fill) px-3.5 py-3">
      <p className="flex items-center gap-2 text-caption font-semibold text-(--color-text)">
        {reached ? (
          <CheckIcon className="h-4 w-4 shrink-0 text-(--color-brand-deep)" />
        ) : (
          <TruckIcon className="h-4 w-4 shrink-0 text-(--color-brand-deep)" />
        )}
        {reached
          ? t("freeUnlocked")
          : t("freeAway", { amount: formatQar(threshold - totals.pricedSubtotal, locale) })}
      </p>
      <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-(--color-surface)">
        <div
          className="h-full rounded-full bg-(--color-brand) transition-[width] duration-300 ease-soft"
          style={{ width: `${pct}%` }}
        />
      </div>
      {!reached && totals.unpricedLines > 0 ? (
        <p className="text-caption text-(--color-text-muted)">{t("freePending")}</p>
      ) : null}
    </div>
  );
}
