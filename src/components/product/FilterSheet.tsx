"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CloseIcon, SlidersIcon } from "@/components/ui/Icons";
import { formatNumber } from "@/lib/pricing";

type Props = {
  /** "Filters": the trigger text and the sheet title. */
  label: string;
  /** Brand + pack + priced filters in force: the trigger's badge. */
  activeCount: number;
  /** Products showing right now: the live "Show N products" label. */
  resultCount: number;
  /** Static fallback: the trigger stays, same look and size, but is inert. */
  disabled?: boolean;
  /** Brand / pack / priced back to "all". Keeps the sheet open. */
  onReset?: () => void;
  /** After the sheet has closed (any way). */
  onClosed?: () => void;
  /** The sheet's sections. Mounted only while the sheet is open. */
  children: React.ReactNode;
};

/** Slightly longer than the 240ms exit animation: the fallback if animationend never comes. */
const CLOSE_FALLBACK_MS = 260;

/**
 * Phone-only "Filters" pill plus the bottom sheet it opens.
 *
 * The sheet is a native modal <dialog>: showModal() gives the focus trap, an
 * inert page behind, Escape and top-layer stacking for free, so neither the
 * sticky header nor the WhatsApp button can ever cover the footer buttons.
 * Closing returns focus to the pill. The Back button is deliberately not
 * wired: chip taps replaceState the one history entry, so a history.back() on
 * close would restore the old URL and undo the shopper's filters.
 */
export function FilterSheet({
  label,
  activeCount,
  resultCount,
  disabled = false,
  onReset,
  onClosed,
  children,
}: Props) {
  const t = useTranslations("Products");
  const locale = useLocale() === "ar" ? "ar" : "en";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef(0);
  const dialogId = useId();
  const titleId = useId();

  const finishClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = 0;
    setOpen(false);
  }, []);

  const requestClose = useCallback(() => {
    if (!dialogRef.current?.open || closeTimer.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(finishClose, CLOSE_FALLBACK_MS);
  }, [finishClose]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      titleRef.current?.focus();
    }
    if (!open && d.open) d.close();
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    // The sheet is a phone control: cross into tablet width and it goes away.
    const mq = window.matchMedia("(min-width: 40rem)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onMq);
    return () => {
      html.style.overflow = prev;
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  // Native `close` event: fires however the dialog closed.
  const handleClosed = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = 0;
    setOpen(false);
    setClosing(false);
    // Closed by a resize past 40rem, the pill is display:none — fall back to
    // the search box rather than dropping focus on <body>.
    if (triggerRef.current?.offsetParent) triggerRef.current.focus();
    else document.getElementById("catalogue-search")?.focus({ preventScroll: true });
    onClosed?.();
  };

  // `n` is the Arabic-Indic-formatted number, matching the chip counts and the
  // Filters badge in the sheet (ICU's own `#` would print Latin digits).
  const showCount = t("showCount", {
    count: resultCount,
    n: formatNumber(resultCount, locale),
  });
  const active = activeCount > 0;

  return (
    <>
      <button
        ref={triggerRef}
        id="catalogue-filters-btn"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-pill bg-(--color-surface) ps-3.5 pe-4 text-footnote font-semibold text-(--color-text) transition-colors duration-200 ease-soft hover:bg-(--color-fill) max-[374px]:ps-3 max-[374px]:pe-3.5 sm:hidden ${
          active
            ? "shadow-[0_0_0_1.5px_var(--color-ink)]"
            : "shadow-[0_0_0_1px_var(--color-border)]"
        }`}
      >
        {/* The badge takes the icon's place, so the pill keeps its width and
            the category shelf beside it keeps its scroll cue. Outlined, not
            filled: an ink fill would read as one more selected chip. */}
        {active ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-ink) px-1.5 text-[11px] font-bold tabular-nums text-white">
            {formatNumber(activeCount, locale)}
          </span>
        ) : (
          <SlidersIcon className="h-[18px] w-[18px]" />
        )}
        <span>{label}</span>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className="filter-sheet"
        aria-labelledby={titleId}
        data-closing={closing ? "" : undefined}
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
        onAnimationEnd={(e) => {
          if (closing && e.target === dialogRef.current) finishClose();
        }}
        onClose={handleClosed}
      >
        {open ? (
          <>
            <span
              aria-hidden
              className="mx-auto mt-2.5 block h-1 w-9 shrink-0 rounded-full bg-(--color-border)"
            />
            <div className="flex h-12 shrink-0 items-center justify-between ps-5 pe-2">
              <h2
                ref={titleRef}
                id={titleId}
                tabIndex={-1}
                className="text-body font-semibold outline-none"
              >
                {label}
              </h2>
              <button
                type="button"
                aria-label={t("sheetClose")}
                onClick={requestClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-(--color-text-muted) transition-colors hover:bg-(--color-fill)"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-5 pb-4 pt-1">
              {children}
            </div>
            <div className="flex shrink-0 items-center gap-3 border-t border-(--color-border-soft) bg-(--color-surface) px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onReset}
                aria-disabled={activeCount === 0 || undefined}
                className="inline-flex h-12 shrink-0 items-center rounded-pill px-3 text-footnote font-semibold text-(--color-link) aria-disabled:pointer-events-none aria-disabled:opacity-40"
              >
                {t("sheetReset")}
              </button>
              <button
                type="button"
                onClick={requestClose}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-pill bg-(--color-ink) px-5 text-footnote font-semibold text-white transition-colors duration-200 ease-soft hover:bg-black"
              >
                {showCount}
              </button>
              <p aria-live="polite" className="sr-only">
                {showCount}
              </p>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
