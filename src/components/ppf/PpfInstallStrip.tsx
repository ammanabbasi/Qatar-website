import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PpfCarLine } from "./PpfCarLine";
import { WORKMANSHIP_COVER_MONTHS, installHref, installedFromQar } from "@/lib/ppfOffer";
import { formatNumber, formatQar } from "@/lib/pricing";

/**
 * Catalogue banner for the installed-PPF service: a slim carbon strip above
 * the product grid. Server-renderable (the catalogue's Suspense fallback
 * shows it too), so it carries no client state.
 */
export function PpfInstallStrip({ locale }: { locale: "en" | "ar" }) {
  const t = useTranslations("PpfPromo");
  const from = installedFromQar("pro") ?? 0;

  return (
    <aside
      aria-labelledby="ppf-strip-title"
      className="relative isolate overflow-hidden rounded-tile bg-(--color-tile-dark) text-white ring-1 ring-inset ring-white/10"
    >
      <div aria-hidden className="ppf-blueprint absolute inset-0 -z-10" />
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
        <div className="hidden w-44 shrink-0 lg:block">
          <PpfCarLine id="ppf-strip-car" ruler={false} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--color-brand)">
            <span aria-hidden className="hidden h-px w-5 bg-(--color-brand) sm:block" />
            {t("eyebrow")}
          </p>
          <h2 id="ppf-strip-title" className="mt-2 text-title-sm font-bold">
            {t("stripTitle")}
          </h2>
          <p className="mt-1 text-footnote text-white/60">
            {t("stripBody", { months: formatNumber(WORKMANSHIP_COVER_MONTHS, locale) })}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <p className="shrink-0 leading-tight">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
              {t("fromLabel")}
            </span>
            <span className="block whitespace-nowrap text-title-sm font-bold tabular-nums">
              {formatQar(from, locale)}
            </span>
          </p>
          <Link
            href={installHref()}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-(--color-brand) px-5 sm:w-auto text-footnote font-bold text-black transition-colors duration-200 ease-soft hover:bg-(--color-brand-hover)"
          >
            <span>{t("stripCta")}</span>
            <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
