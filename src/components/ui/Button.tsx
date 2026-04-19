import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  variant?: "primary" | "ghost" | "outline";
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
};

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg) focus-visible:ring-(--color-gold) overflow-hidden";

const sizes = {
  md: "px-5 h-11 text-sm tracking-[0.01em]",
  lg: "px-8 h-14 text-[0.95rem] tracking-[0.01em]",
};

const variants = {
  primary:
    "bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-soft) shadow-[0_6px_24px_-8px_rgba(200,162,74,0.55)] hover:shadow-[0_12px_36px_-10px_rgba(200,162,74,0.7)]",
  ghost:
    "bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-2) border border-(--color-border) hover:border-(--color-gold)/50",
  outline:
    "bg-transparent text-(--color-text) hover:bg-(--color-gold)/10 border border-(--color-gold)/55 hover:border-(--color-gold)",
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
