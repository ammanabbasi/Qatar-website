"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  label: string;
  /** Key of the selected chip. Leave undefined when the first ("All") chip is selected. */
  activeKey?: string;
  /**
   * "page" (default): the row bleeds 24px to both screen edges.
   * "bar": for the catalogue's sticky bar, where a Filters pill sits at the
   * start. The row bleeds only to the end edge, and its label is always
   * screen-reader-only on phones.
   */
  variant?: "page" | "bar";
  /** Keep the label for screen readers only below 640px (the row is self-explanatory). */
  labelHiddenOnPhone?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Width of the "bar" variant's edge fades (px): keep in step with its mask-image. */
const BAR_FADE = 12;

/**
 * Labelled row of filter chips. Scrolls sideways on phones, wraps from sm up.
 *
 * On phones the selected chip is kept centred, so a deep link such as
 * `?category=fragrance` never highlights a chip that is off-screen. The row's
 * own scrollLeft is adjusted from bounding rects (scrollIntoView would also
 * scroll the page); that holds in RTL, where scrollLeft is negative and 0 is
 * the start edge in both directions. Back on the first ("All") chip the row
 * returns to its start edge. The edge fade sits in the row's bleed, so it only
 * touches chips that are actually scrolled under it. In the "bar" variant the
 * start side has no bleed: its 12px padding next to the Filters pill is the
 * fade, and the end side bleeds 24px to the screen edge with a 12px fade, short
 * enough that the next chip still peeks out on a 360px phone (mirrored in RTL).
 * The bar also never re-centres a chip that is already fully on screen: tapping
 * one of the first categories must not slide the shelf and leave "All" half
 * hidden under the Filters pill.
 */
export function ChipRow({
  label,
  activeKey,
  variant = "page",
  labelHiddenOnPhone = false,
  className,
  children,
}: Props) {
  const labelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const bar = variant === "bar";

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
      if (
        bar &&
        chipBox.left >= rowBox.left + BAR_FADE - 1 &&
        chipBox.right <= rowBox.right - BAR_FADE + 1
      ) {
        // Wholly inside the row and clear of both 12px edge fades: it is
        // already on screen, so leave the shelf where it is.
        return;
      }
      row.scrollLeft +=
        chipBox.left + chipBox.width / 2 - (rowBox.left + rowBox.width / 2);
    };
    // Fires on first layout and on resize.
    const observer = new ResizeObserver(centre);
    observer.observe(row);
    return () => observer.disconnect();
  }, [activeKey, bar]);

  return (
    <div className={className ? `flex flex-col gap-2 ${className}` : "flex flex-col gap-2"}>
      <span
        id={labelId}
        className={
          bar || labelHiddenOnPhone
            ? "text-caption font-semibold text-(--color-text-muted) max-sm:sr-only"
            : "text-caption font-semibold text-(--color-text-muted)"
        }
      >
        {label}
      </span>
      <div
        ref={ref}
        role="group"
        aria-labelledby={labelId}
        className={
          bar
            ? "hide-scrollbar -my-1.5 -me-6 flex gap-2 overflow-x-auto py-1.5 ps-3 pe-6 max-[374px]:gap-1.5 [mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%_-_12px),transparent)] rtl:[mask-image:linear-gradient(to_left,transparent,#000_12px,#000_calc(100%_-_12px),transparent)] sm:m-0 sm:flex-wrap sm:overflow-visible sm:p-0 sm:[mask-image:none] sm:rtl:[mask-image:none]"
            : "hide-scrollbar -mx-6 -my-1.5 flex gap-2 overflow-x-auto px-6 py-1.5 [mask-image:linear-gradient(to_right,transparent,#000_24px,#000_calc(100%_-_24px),transparent)] sm:mx-0 sm:my-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0 sm:[mask-image:none]"
        }
      >
        {children}
      </div>
    </div>
  );
}
