import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRightIcon, ChevronIcon } from "./Icons";

type Props = {
  href: string;
  children: ReactNode;
  /** Plain <a> (external URLs, mailto, wa.me). Internal hrefs go through the locale-aware Link. */
  external?: boolean;
  icon?: "chevron" | "external" | "none";
  size?: "caption" | "footnote" | "body" | "body-lg";
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const SIZES = {
  caption: "text-caption",
  footnote: "text-footnote",
  body: "text-body",
  "body-lg": "text-body-lg",
} as const;

/**
 * The blue "Learn more ›" link. Chevron flips in RTL.
 */
export function TextLink({
  href,
  children,
  external = false,
  icon = "chevron",
  size = "body",
  className = "",
  ...rest
}: Props) {
  const cls = `text-link ${SIZES[size]} ${className}`;
  const glyph =
    icon === "chevron" ? (
      <ChevronIcon className="h-[0.62em] w-[0.62em] shrink-0 rtl:-scale-x-100" />
    ) : icon === "external" ? (
      <ArrowUpRightIcon className="h-[0.7em] w-[0.7em] shrink-0 rtl:-scale-x-100" />
    ) : null;

  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        <span>{children}</span>
        {glyph}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <span>{children}</span>
      {glyph}
    </Link>
  );
}
