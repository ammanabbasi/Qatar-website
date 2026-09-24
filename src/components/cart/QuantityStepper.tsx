"use client";

import { useLocale, useTranslations } from "next-intl";
import { MinusIcon, PlusIcon } from "@/components/ui/Icons";
import { MAX_QTY } from "@/lib/cart";
import { formatNumber } from "@/lib/pricing";

type Props = {
  value: number;
  onChange: (next: number) => void;
  /** Product name — completes the button labels ("Decrease quantity of …"). */
  name: string;
  min?: number;
  max?: number;
  className?: string;
};

/** − n + with 44px touch targets (thumb-sized on phones). */
export function QuantityStepper({
  value,
  onChange,
  name,
  min = 1,
  max = MAX_QTY.b2c,
  className = "",
}: Props) {
  const t = useTranslations("Cart");
  const locale = useLocale() === "ar" ? "ar" : "en";
  const button =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-(--color-text) transition-colors duration-150 ease-soft hover:bg-(--color-fill-hover) active:bg-(--color-border) disabled:pointer-events-none disabled:opacity-35";

  return (
    <div
      role="group"
      aria-label={t("quantityOf", { name })}
      className={`inline-flex items-center rounded-pill bg-(--color-fill) ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t("decrease", { name })}
        className={button}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className="min-w-7 text-center text-footnote font-semibold tabular-nums text-(--color-text)"
      >
        {formatNumber(value, locale)}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t("increase", { name })}
        className={button}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
