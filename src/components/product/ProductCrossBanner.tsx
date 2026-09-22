"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";
import type { Audience } from "@/lib/whatsapp";

function writeAudienceCookie(value: Audience) {
  if (typeof document === "undefined") return;
  document.cookie = `abk_audience=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

type Props = {
  audience: Audience;
  slug: string;
  isAvailableInOtherAudience: boolean;
};

export function ProductCrossBanner({
  audience,
  slug,
  isAvailableInOtherAudience,
}: Props) {
  const t = useTranslations("Products");
  const isB2c = audience === "b2c";
  const targetAudience: Audience = isB2c ? "b2b" : "b2c";

  // If available in the other audience, deep link to the same product slug; otherwise link to the catalogue.
  const targetHref = isAvailableInOtherAudience
    ? `/${targetAudience}/products/${slug}`
    : `/${targetAudience}/products`;

  const bannerTitle = isB2c
    ? t("pdpCrossBannerB2cTitle")
    : t("pdpCrossBannerB2bTitle");

  const bannerAction = isB2c
    ? t("pdpCrossBannerB2cAction")
    : t("pdpCrossBannerB2bAction");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
      <div className="flex items-start gap-3 sm:items-center">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isB2c
              ? "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
              : "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
          }`}
        >
          {isB2c ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}
        </span>
        <p className="text-callout font-medium text-(--color-text)">
          {bannerTitle}
        </p>
      </div>

      <Link
        href={targetHref}
        onClick={() => writeAudienceCookie(targetAudience)}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-(--color-fill) px-4 py-2 text-footnote font-semibold text-(--color-text) transition-colors hover:bg-(--color-fill-secondary) self-start sm:self-auto"
      >
        <span>{bannerAction}</span>
        <ChevronIcon className="h-3.5 w-3.5 rtl:rotate-180" />
      </Link>
    </div>
  );
}
