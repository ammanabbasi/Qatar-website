"use client";

import { useEffect, useState, type RefObject } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { BagIcon, CheckIcon } from "@/components/ui/Icons";

/**
 * Phone-only bar that keeps "Add to cart" in reach once the panel's main
 * button has scrolled up out of view. While it shows, <html data-sticky-cta>
 * lifts the floating WhatsApp bubble above it (see .floating-wa in globals.css).
 */
export function StickyAddToCart({
  targetRef,
  name,
  priceLabel,
  image,
  added,
  onAdd,
}: {
  /** The panel's own Add to cart button. */
  targetRef: RefObject<HTMLElement | null>;
  name: string;
  priceLabel: string;
  image: string;
  added: boolean;
  onAdd: () => void;
}) {
  const t = useTranslations("Cart");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    // A scroll check rather than an IntersectionObserver: a fling or an End
    // key can jump the button from below the fold to above it without ever
    // intersecting, and the observer would never fire.
    let frame = 0;
    const check = () => {
      frame = 0;
      // Only once the button has been scrolled PAST — not while the shopper
      // is still on their way down to it.
      setVisible(el.getBoundingClientRect().bottom < 0);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule(); // covers a reload that restores a deep scroll position
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetRef]);

  useEffect(() => {
    setStickyCtaFlag(visible);
    return () => setStickyCtaFlag(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="cart-sticky fixed inset-x-0 bottom-0 z-30 border-t border-(--color-border-soft) bg-(--color-surface)/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <Container className="flex items-center gap-3 pt-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-(--color-surface) shadow-[0_0_0_1px_var(--color-border-soft)]">
          <Image src={image} alt="" fill sizes="44px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-footnote font-semibold text-(--color-text)">{name}</p>
          <p className="truncate text-caption font-semibold text-(--color-brand-deep)">{priceLabel}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-pill bg-(--color-brand) px-5 text-footnote font-semibold text-(--color-ink) transition-colors duration-150 ease-soft hover:bg-(--color-brand-hover) active:bg-(--color-brand-deep) active:text-white"
        >
          {added ? <CheckIcon className="h-4 w-4" /> : <BagIcon className="h-4 w-4" />}
          {added ? t("viewCart") : t("addToCart")}
        </button>
      </Container>
    </div>
  );
}

function setStickyCtaFlag(on: boolean) {
  if (on) document.documentElement.dataset.stickyCta = "on";
  else delete document.documentElement.dataset.stickyCta;
}
