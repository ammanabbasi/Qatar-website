import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  /** One line under the title, visible while the block is collapsed. */
  hint?: ReactNode;
  id?: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Native <details> card. No JS, keyboard and screen-reader accessible, and the
 * folded content stays in the server-rendered HTML for crawlers. The PPF page
 * uses it for secondary detail so a phone scrolls past it instead of through it.
 */
export function Disclosure({
  title,
  hint,
  id,
  defaultOpen = false,
  className = "",
  children,
}: Props) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className={`group scroll-mt-16 rounded-tile border border-(--color-border) bg-(--color-surface) ${className}`}
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-footnote font-semibold text-(--color-text) sm:text-body">
            {title}
          </span>
          {hint ? (
            <span className="mt-0.5 block text-caption text-(--color-text-muted)">{hint}</span>
          ) : null}
        </span>
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text) transition-transform duration-300 ease-soft group-open:rotate-45"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
        </span>
      </summary>
      <div className="border-t border-(--color-border-soft) px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </details>
  );
}
