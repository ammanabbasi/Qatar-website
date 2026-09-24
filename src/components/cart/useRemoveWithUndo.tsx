"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { removeLine, restoreLine, type RemovedLine } from "@/lib/cart";
import { findProduct } from "@/lib/pricing";
import { gaItem, trackCartEvent } from "@/lib/analytics";
import type { Audience } from "@/lib/whatsapp";
import { useCartUi } from "./CartProvider";

type Removed = { id: number; slug: string; removed: RemovedLine };

/**
 * Remove a line with a 6-second Undo. The state lives in the caller (drawer or
 * cart page) rather than in the list, so Undo survives the list collapsing
 * into the empty state when the last item goes. The countdown pauses while
 * focus is on the notice, so it never vanishes from under a keyboard user.
 */
export function useRemoveWithUndo(audience: Audience) {
  const { catalogue } = useCartUi();
  const [removed, setRemoved] = useState<Removed | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!removed || paused) return;
    const id = window.setTimeout(() => setRemoved(null), 6000);
    return () => window.clearTimeout(id);
  }, [removed, paused]);

  const remove = useCallback(
    (slug: string) => {
      const result = removeLine(audience, slug);
      if (!result) return;
      const product = findProduct(catalogue, slug);
      if (audience === "b2c" && product) {
        trackCartEvent("remove_from_cart", [gaItem(product, result.line.qty)]);
      }
      setPaused(false);
      setRemoved({ id: Date.now(), slug, removed: result });
    },
    [audience, catalogue],
  );

  const undo = useCallback(() => {
    if (!removed) return;
    const restored = restoreLine(audience, removed.removed);
    const product = findProduct(catalogue, removed.slug);
    if (restored && audience === "b2c" && product) {
      trackCartEvent("add_to_cart", [gaItem(product, removed.removed.line.qty)]);
    }
    setRemoved(null);
  }, [audience, catalogue, removed]);

  return { removed, remove, undo, setPaused };
}

/**
 * "Removed X · Undo". Focus moves to Undo because the control the shopper
 * pressed (the line's remove button) no longer exists.
 */
export function RemovedNotice({
  name,
  noticeId,
  onUndo,
  onFocusWithin,
}: {
  name: string;
  noticeId: number;
  onUndo: () => void;
  /** Pauses the parent's expiry countdown while the notice holds focus. */
  onFocusWithin: (focused: boolean) => void;
}) {
  const t = useTranslations("Cart");
  const undoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    undoRef.current?.focus();
  }, [noticeId]);

  return (
    <div
      onFocus={() => onFocusWithin(true)}
      onBlur={() => onFocusWithin(false)}
      className="flex items-center justify-between gap-3 rounded-xl bg-(--color-fill) py-1 ps-3.5 pe-1 text-footnote text-(--color-text)"
    >
      <span className="min-w-0 truncate">{t("removed", { name })}</span>
      <button
        ref={undoRef}
        type="button"
        onClick={onUndo}
        className="inline-flex h-10 shrink-0 items-center rounded-pill px-4 font-semibold text-(--color-link) transition-colors duration-150 ease-soft hover:bg-(--color-fill-hover) active:bg-(--color-border)"
      >
        {t("undo")}
      </button>
    </div>
  );
}
