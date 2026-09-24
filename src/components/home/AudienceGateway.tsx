"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TruckIcon,
  BoxIcon,
  BadgeIcon,
} from "@/components/ui/Icons";
import type { Audience } from "@/lib/whatsapp";

type Props = {
  currentAudience: Audience;
  locale: "en" | "ar";
  /** Directly under a hero the cards tuck up into it; elsewhere they sit in normal flow. */
  overlapHero?: boolean;
};

function writeAudienceCookie(value: Audience) {
  if (typeof document === "undefined") return;
  document.cookie = `abk_audience=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

export function AudienceGateway({ currentAudience, overlapHero = true }: Props) {
  const t = useTranslations("Gateway");
  const router = useRouter();

  const handleSwitch = (target: Audience, href: string) => {
    writeAudienceCookie(target);
    router.push(href);
  };

  const isB2cActive = currentAudience === "b2c";
  const isB2bActive = currentAudience === "b2b";

  return (
    <section
      id="experience-gateway"
      className={`relative z-10 pb-10 sm:pb-14 ${overlapHero ? "-mt-3 sm:-mt-6" : "pt-10 sm:pt-14"}`}
    >
      <Container>
        {/* Section Heading */}
        <div className="mx-auto mb-6 sm:mb-8 max-w-2xl text-center">
          <p className="text-[11px] sm:text-caption font-bold uppercase tracking-[0.18em] text-(--color-brand-deep)">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 text-title sm:text-display font-bold tracking-tight text-(--color-text)">
            {t("title")}
          </h2>
          <p className="mt-2 text-footnote sm:text-body text-(--color-text-muted) leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          {/* Card 1: Retail & DIY Car Care */}
          <div
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
              isB2cActive
                ? "border-(--color-brand) bg-white shadow-[0_8px_30px_rgba(245,166,35,0.12)] ring-2 ring-(--color-brand)/30"
                : "border-(--color-border-soft) bg-white/90 shadow-sm hover:border-(--color-brand)/40 hover:shadow-md"
            }`}
          >
            <div>
              {/* Header pill & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-brand)/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-(--color-brand-deep)">
                  <SparkleIcon className="h-3.5 w-3.5" />
                  <span>{t("retailBadge")}</span>
                </span>
                {isB2cActive && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--color-brand-deep)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--color-brand)" />
                    {t("activeMode")}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-title font-bold text-(--color-text)">
                {t("retailTitle")}
              </h3>
              <p className="mt-2 text-footnote sm:text-body text-(--color-text-muted) leading-relaxed">
                {t("retailDesc")}
              </p>

              {/* Highlights */}
              <ul className="mt-5 flex flex-col gap-2.5 text-footnote text-(--color-text)">
                <li className="flex items-start gap-2.5">
                  <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>{t("retailPoint1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <BadgeIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>{t("retailPoint2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>{t("retailPoint3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-(--color-border-soft)">
              <button
                type="button"
                onClick={() => handleSwitch("b2c", "/b2c/products")}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-pill px-6 h-11 text-footnote font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isB2cActive
                    ? "bg-(--color-brand) text-black shadow-md hover:bg-(--color-brand-hover)"
                    : "border border-(--color-brand) text-(--color-brand-deep) hover:bg-(--color-brand)/10"
                }`}
              >
                <span>{t("retailCta")}</span>
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Card 2: Wholesale & Commercial Supply */}
          <div
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
              isB2bActive
                ? "border-(--color-brand) bg-white shadow-[0_8px_30px_rgba(245,166,35,0.12)] ring-2 ring-(--color-brand)/30"
                : "border-(--color-border-soft) bg-white/90 shadow-sm hover:border-(--color-brand)/40 hover:shadow-md"
            }`}
          >
            <div>
              {/* Header pill & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-(--color-text)">
                  <BoxIcon className="h-3.5 w-3.5 text-(--color-brand-deep)" />
                  <span>{t("wholesaleBadge")}</span>
                </span>
                {isB2bActive && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--color-brand-deep)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--color-brand)" />
                    {t("activeMode")}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-title font-bold text-(--color-text)">
                {t("wholesaleTitle")}
              </h3>
              <p className="mt-2 text-footnote sm:text-body text-(--color-text-muted) leading-relaxed">
                {t("wholesaleDesc")}
              </p>

              {/* Highlights */}
              <ul className="mt-5 flex flex-col gap-2.5 text-footnote text-(--color-text)">
                <li className="flex items-start gap-2.5">
                  <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>{t("wholesalePoint1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <BadgeIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>{t("wholesalePoint2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span>{t("wholesalePoint3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-(--color-border-soft)">
              <button
                type="button"
                onClick={() => handleSwitch("b2b", "/b2b")}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-pill px-6 h-11 text-footnote font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isB2bActive
                    ? "bg-(--color-brand) text-black shadow-md hover:bg-(--color-brand-hover)"
                    : "border border-(--color-brand) text-(--color-brand-deep) hover:bg-(--color-brand)/10"
                }`}
              >
                <span>{t("wholesaleCta")}</span>
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
