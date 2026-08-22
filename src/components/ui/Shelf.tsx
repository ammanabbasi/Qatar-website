"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronIcon } from "./Icons";

type Props = {
  /** Accessible name for the scroll region, e.g. "Star products". */
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
};

const GAP = 20; // matches `gap: 1.25rem` in .shelf-scroller

/**
 * Horizontal scrolling shelf — the Apple Store "rf-cards-scroller".
 *
 * Tiles snap to the content edge; the last tile bleeds to the viewport edge.
 * Paddles appear on pointer devices and page by whole tiles. Touch and
 * trackpad users just swipe. Works in RTL: scrollLeft is negative there, so
 * we read `Math.abs` and flip the scroll direction.
 */
export function Shelf({ ariaLabel, children, className = "" }: Props) {
  const t = useTranslations("Shelf");
  const locale = useLocale();
  const rtl = locale === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const pos = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(pos > 4);
    setCanNext(pos < max - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const page = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const tile = first ? first.getBoundingClientRect().width + GAP : 0;
    // Advance by as many whole tiles as fit in the viewport (at least one).
    const step = tile > 0 ? Math.max(tile, Math.floor((el.clientWidth * 0.9) / tile) * tile) : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step * (rtl ? -1 : 1), behavior: "smooth" });
  };

  return (
    <div className={`shelf relative ${className}`}>
      {/* Focusable so keyboard users can arrow-scroll a shelf whose tiles
          have no links of their own (WCAG 2.1.1 / axe scrollable-region-focusable). */}
      <div
        ref={ref}
        className="shelf-scroller focus-visible:outline-2 focus-visible:-outline-offset-2"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>
      <Paddle side="start" visible={canPrev} label={t("prev")} onClick={() => page(-1)} />
      <Paddle side="end" visible={canNext} label={t("next")} onClick={() => page(1)} />
    </div>
  );
}

function Paddle({
  side,
  visible,
  label,
  onClick,
}: {
  side: "start" | "end";
  visible: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={`absolute top-1/2 hidden h-14 w-14 -translate-y-[calc(50%+0.6rem)] items-center justify-center rounded-full bg-white/95 text-(--color-text) shadow-paddle backdrop-blur transition-opacity duration-200 ease-soft hover:bg-white lg:flex ${
        side === "start" ? "start-4 xl:start-6" : "end-4 xl:end-6"
      } ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ChevronIcon
        className={`h-5 w-5 ${side === "start" ? "-scale-x-100 rtl:scale-x-100" : "rtl:-scale-x-100"}`}
      />
    </button>
  );
}
