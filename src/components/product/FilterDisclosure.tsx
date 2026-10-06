"use client";

import { useId, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronIcon } from "@/components/ui/Icons";
import { formatNumber } from "@/lib/pricing";

type Props = {
  /** Toggle text, e.g. "Filters". */
  label: string;
  /** Active filters inside — shown as a badge and opens the panel on first render. */
  activeCount: number;
  children: React.ReactNode;
};

/**
 * Secondary filter rows. Below 640px they sit behind a "Filters" pill so the
 * first products stay near the fold; from sm up they are always visible and
 * the pill is gone.
 */
export function FilterDisclosure({ label, activeCount, children }: Props) {
  const [open, setOpen] = useState(activeCount > 0);
  const panelId = useId();
  const locale = useLocale() === "ar" ? "ar" : "en";

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 self-start rounded-pill bg-(--color-surface) px-4 text-footnote font-medium text-(--color-text) shadow-[0_0_0_1px_var(--color-border-soft)] transition-colors duration-200 ease-soft hover:bg-(--color-fill) sm:hidden"
      >
        {label}
        {activeCount > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-ink) px-1.5 text-[11px] font-semibold text-white">
            {formatNumber(activeCount, locale)}
          </span>
        ) : null}
        <ChevronIcon
          className={`h-2.5 w-2.5 text-(--color-text-muted) transition-transform duration-200 ease-soft ${
            open ? "-rotate-90" : "rotate-90"
          }`}
        />
      </button>
      <div id={panelId} className={`${open ? "flex" : "hidden"} flex-col gap-4 sm:flex sm:flex-row sm:flex-wrap sm:gap-x-8`}>
        {children}
      </div>
    </div>
  );
}
