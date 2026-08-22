import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "dark" | "light" | "outline";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap select-none transition-colors duration-200 ease-soft disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-busy:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-footnote",
  md: "h-11 px-[22px] text-body",
  lg: "h-12 px-7 text-body",
};

const variants: Record<Variant, string> = {
  primary: "bg-(--color-accent) text-white hover:bg-(--color-accent-hover)",
  secondary: "bg-(--color-fill) text-(--color-text) hover:bg-(--color-fill-hover)",
  dark: "bg-(--color-ink) text-white hover:bg-black",
  light: "bg-white text-(--color-text) hover:bg-(--color-fill)",
  outline:
    "bg-transparent text-(--color-link) border border-(--color-link) hover:bg-(--color-link) hover:text-white",
};

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  children,
  ...props
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      aria-busy={loading || undefined}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? <Spinner /> : null}
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      aria-busy={loading || undefined}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
