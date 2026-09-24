"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TrashIcon } from "@/components/ui/Icons";
import { MAX_QTY, setLineQty } from "@/lib/cart";
import { gaItem, trackCartEvent } from "@/lib/analytics";
import {
  formatQar,
  unitPriceLabel,
  type PriceLocale,
  type ResolvedLine,
} from "@/lib/pricing";
import type { Audience } from "@/lib/whatsapp";
import { QuantityStepper } from "./QuantityStepper";

type Props = {
  line: ResolvedLine;
  audience: Audience;
  locale: PriceLocale;
  /** Retail shows unit and line prices; the wholesale tray never does. */
  showPrices: boolean;
  onRemove: (slug: string) => void;
  /** Runs before following a product link (the drawer closes itself). */
  onNavigate?: () => void;
};

/**
 * One cart line, two rows so it fits a 320px drawer: identity + remove on
 * top, quantity + line total underneath.
 */
export function CartLineItem({
  line,
  audience,
  locale,
  showPrices,
  onRemove,
  onNavigate,
}: Props) {
  const t = useTranslations();
  const { product, qty } = line;
  const name = product.name[locale];
  const href = `/${audience}/products/${product.slug}`;
  const priced = product.priceQar !== undefined;

  return (
    <li className="flex gap-3 py-4">
      <Link
        href={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-(--color-surface) shadow-[0_0_0_1px_var(--color-border-soft)]"
      >
        <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start gap-1">
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption text-(--color-text-muted)">
              {t(`Brands.${product.brand}`)}
            </p>
            <Link
              href={href}
              onClick={onNavigate}
              className="line-clamp-2 text-footnote font-semibold text-(--color-text) underline-offset-2 hover:underline"
            >
              {name}
            </Link>
            {showPrices ? (
              <p
                className={`mt-0.5 text-caption ${
                  priced ? "text-(--color-text-muted)" : "font-medium text-(--color-brand-deep)"
                }`}
              >
                {priced
                  ? t("Cart.each", { price: unitPriceLabel(product, locale)! })
                  : t("Cart.priceOnRequest")}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onRemove(product.slug)}
            aria-label={t("Cart.remove", { name })}
            className="-me-2.5 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors duration-150 ease-soft hover:bg-(--color-fill) hover:text-(--color-danger) active:bg-(--color-fill-hover)"
          >
            <TrashIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={qty}
            name={name}
            max={MAX_QTY[audience]}
            onChange={(next) => {
              setLineQty(audience, product.slug, next);
              const delta = next - qty;
              if (audience === "b2c" && delta !== 0) {
                trackCartEvent(delta > 0 ? "add_to_cart" : "remove_from_cart", [
                  gaItem(product, Math.abs(delta)),
                ]);
              }
            }}
          />
          {showPrices && priced ? (
            <span className="text-footnote font-semibold tabular-nums text-(--color-text)">
              {formatQar(product.priceQar! * qty, locale)}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}
