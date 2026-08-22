import type { ElementType } from "react";

type Props = {
  /** Lead sentence, rendered in ink. Keep the trailing full stop — it's the rhythm. */
  title: string;
  /** Continuation sentence, rendered muted on the same line. */
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "headline" | "title" | "title-sm";
  align?: "start" | "center";
  className?: string;
  id?: string;
};

const SIZES = {
  display: "text-display lg:text-display-lg font-bold",
  headline: "text-headline font-semibold",
  title: "text-title font-semibold",
  "title-sm": "text-title-sm font-semibold",
} as const;

/**
 * Two-tone heading — "Star products. The best-sellers keeping Qatar's cars
 * flawless." The title carries the weight; the subtitle continues in grey.
 *
 * At `display` size (page titles) the subtitle drops to its own line at
 * tagline size — "Store." over "The best way to buy the products you love."
 * — but stays inside the heading element so the h1 keeps its keywords.
 */
export function SectionHeading({
  title,
  subtitle,
  as = "h2",
  size = "title",
  align = "start",
  className = "",
  id,
}: Props) {
  const Tag: ElementType = as;
  const display = size === "display";
  return (
    <Tag
      id={id}
      className={`two-tone ${display ? "max-w-3xl" : "max-w-4xl text-balance"} ${SIZES[size]} ${
        align === "center" ? "mx-auto text-center" : "text-start"
      } ${className}`}
    >
      <span>{title}</span>
      {subtitle ? (
        display ? (
          <span className="mt-3 block text-title-sm font-semibold sm:mt-4 lg:text-title">
            {subtitle}
          </span>
        ) : (
          <>
            {" "}
            <span>{subtitle}</span>
          </>
        )
      ) : null}
    </Tag>
  );
}
