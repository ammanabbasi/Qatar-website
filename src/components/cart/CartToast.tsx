"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";
import { useCartUi, type AddedToast } from "./CartProvider";

/**
 * Non-blocking "Added to cart" confirmation. The sr-only live region stays
 * mounted so screen readers announce every add; the visual card underneath
 * is keyed per toast, which resets its hover/focus pause each time.
 */
export function CartToast() {
  const t = useTranslations("Cart");
  const { toast, catalogue, locale } = useCartUi();
  const product = toast ? catalogue[toast.slug] : undefined;

  return (
    <>
      {/* The running count makes a second add of the same product read as new
          text, so screen readers announce it again. */}
      <div role="status" aria-live="polite" className="sr-only">
        {product && toast
          ? t("addedAnnounce", { name: product.name[locale], count: toast.inCart })
          : ""}
      </div>
      {toast && product ? (
        <div className="pointer-events-none fixed inset-x-0 top-14 z-[60] flex justify-center px-4 sm:justify-end sm:px-6">
          <ToastCard key={toast.id} toast={toast} />
        </div>
      ) : null}
    </>
  );
}

function ToastCard({ toast }: { toast: AddedToast }) {
  const t = useTranslations("Cart");
  const nav = useTranslations("Nav");
  const { catalogue, locale, dismissToast, openDrawer } = useCartUi();
  const [paused, setPaused] = useState(false);
  const product = catalogue[toast.slug];

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(dismissToast, 4000);
    return () => window.clearTimeout(id);
  }, [paused, dismissToast]);

  if (!product) return null;

  return (
    <div
      className="cart-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-tile bg-(--color-surface) p-2.5 shadow-paddle"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-(--color-surface) shadow-[0_0_0_1px_var(--color-border-soft)]">
        <Image src={product.image} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-caption font-semibold text-(--color-brand-deep)">
          <CheckIcon className="h-3.5 w-3.5" />
          {t("added")}
        </p>
        <p className="truncate text-footnote font-medium text-(--color-text)">
          {product.name[locale]}
        </p>
      </div>
      <button
        type="button"
        onClick={openDrawer}
        className="inline-flex h-10 shrink-0 items-center rounded-pill bg-(--color-ink) px-4 text-footnote font-semibold text-white transition-colors duration-150 ease-soft hover:bg-black"
      >
        {t("viewCart")}
      </button>
      <button
        type="button"
        onClick={dismissToast}
        aria-label={nav("close")}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors duration-150 ease-soft hover:bg-(--color-fill) hover:text-(--color-text)"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
