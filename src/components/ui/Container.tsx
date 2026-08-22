import type { HTMLAttributes } from "react";

// Content column. The Shelf component mirrors these gutters (1.5rem / 3rem
// at lg) in its `--shelf-inset` so scrolling tiles line up with headings.
export function Container({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-7xl px-6 lg:px-12 ${className}`}
    />
  );
}
