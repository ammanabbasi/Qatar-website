"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  label: string;
  /** Key of the selected chip. Leave undefined when the first ("All") chip is selected. */
  activeKey?: string;
  children: React.ReactNode;
};

/**
 * Labelled row of filter chips. Scrolls sideways on phones, wraps from sm up.
 *
 * On phones the selected chip is kept centred, so a deep link such as
 * `?category=fragrance` never highlights a chip that is off-screen. The row's
 * own scrollLeft is adjusted from bounding rects (scrollIntoView would also
 * scroll the page); that holds in RTL, where scrollLeft is negative. Back on
 * the first ("All") chip the row returns to its start edge. The edge fade sits
 * in the row's 24px bleed, so it only touches chips that are actually scrolled
 * under it.
 */
export function ChipRow({ label, activeKey, children }: Props) {
  const labelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    if (activeKey === undefined) {
      row.scrollLeft = 0;
      return;
    }
    const centre = () => {
      const chip = row.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!chip || row.scrollWidth <= row.clientWidth) return;
      const chipBox = chip.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      row.scrollLeft +=
        chipBox.left + chipBox.width / 2 - (rowBox.left + rowBox.width / 2);
    };
    // Fires once on mount, again when a collapsed row is first laid out
    // (FilterDisclosure) and on resize.
    const observer = new ResizeObserver(centre);
    observer.observe(row);
    return () => observer.disconnect();
  }, [activeKey]);

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-caption font-semibold text-(--color-text-muted)">
        {label}
      </span>
      <div
        ref={ref}
        role="group"
        aria-labelledby={labelId}
        className="hide-scrollbar -mx-6 -my-1.5 flex gap-2 overflow-x-auto px-6 py-1.5 [mask-image:linear-gradient(to_right,transparent,#000_24px,#000_calc(100%_-_24px),transparent)] sm:mx-0 sm:my-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0 sm:[mask-image:none]"
      >
        {children}
      </div>
    </div>
  );
}
