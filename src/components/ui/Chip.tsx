import type { ButtonHTMLAttributes } from "react";

type Props = { active?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>;

/** Filter pill. Selected = ink fill, otherwise white with a hairline. */
export function Chip({ active = false, className = "", children, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...rest}
      className={`inline-flex h-9 shrink-0 items-center rounded-pill px-4 text-footnote font-medium transition-colors duration-200 ease-soft ${
        active
          ? "bg-(--color-ink) text-white"
          : "bg-(--color-surface) text-(--color-text) shadow-[0_0_0_1px_var(--color-border-soft)] hover:bg-(--color-fill)"
      } ${className}`}
    >
      {children}
    </button>
  );
}
