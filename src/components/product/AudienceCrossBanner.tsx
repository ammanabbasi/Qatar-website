"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";
import type { Audience } from "@/lib/whatsapp";

function writeAudienceCookie(value: Audience) {
  if (typeof document === "undefined") return;
  document.cookie = `abk_audience=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

export function AudienceCrossBanner({ audience }: { audience: Audience }) {
  const t = useTranslations("Products");
  const isB2C = audience === "b2c";
  const crossHref = isB2C ? "/b2b/products" : "/b2c/products";
  const crossTitle = isB2C ? t("b2cCrossBannerTitle") : t("b2bCrossBannerTitle");
  const crossAction = isB2C ? t("b2cCrossBannerAction") : t("b2bCrossBannerAction");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-xs">
      <div className="flex items-start gap-3 sm:items-center">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isB2C
              ? "bg-amber-500/10 text-amber-600"
              : "bg-blue-500/10 text-blue-600"
          }`}
        >
          {isB2C ? (
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}
        </span>
        <p className="text-callout font-medium text-(--color-text)">
          {crossTitle}
        </p>
      </div>

      <Link
        href={crossHref}
        onClick={() => writeAudienceCookie(isB2C ? "b2b" : "b2c")}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-(--color-fill) px-4 py-2 text-footnote font-semibold text-(--color-text) transition-colors hover:bg-(--color-fill-hover) self-start sm:self-auto"
      >
        <span>{crossAction}</span>
        <ChevronIcon className="h-3.5 w-3.5 rtl:rotate-180" />
      </Link>
    </div>
  );
}
