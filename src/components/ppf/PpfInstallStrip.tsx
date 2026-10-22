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
      {/* Phones: a two-column grid (title + price anchor on the start side, the
          gold CTA spanning both rows) so the strip costs ~86px instead of a
          full stacked card. sm+ is the original single flex row. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 p-3 sm:flex sm:flex-row sm:items-center sm:gap-8 sm:p-6">
        <div className="hidden w-44 shrink-0 lg:block">
          <PpfCarLine id="ppf-strip-car" ruler={false} />
        </div>
        <div className="col-start-1 row-start-1 min-w-0 sm:flex-1">
          <p className="hidden items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--color-brand) sm:flex">
            <span aria-hidden className="hidden h-px w-5 bg-(--color-brand) sm:block" />
            {t("eyebrow")}
          </p>
          <h2 id="ppf-strip-title" className="text-footnote font-bold max-sm:text-balance sm:mt-2 sm:text-title-sm">
            {t("stripTitle")}
          </h2>
          <p className="mt-1 hidden text-footnote text-white/60 sm:block">
            {t("stripBody", { months: formatNumber(WORKMANSHIP_COVER_MONTHS, locale) })}
          </p>
        </div>
        {/* `contents` on phones: the price and CTA become grid items of the
            wrapper above. From sm up this is the original right-hand column. */}
        <div className="contents sm:flex sm:shrink-0 sm:flex-col sm:items-end sm:gap-3">
          <p className="col-start-1 row-start-2 mt-1 flex flex-wrap items-baseline gap-x-1.5 leading-tight sm:mt-0 sm:block sm:shrink-0">
            {/* Tighter tracking on phones so label + price stay on one line at 360px. */}
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/55 sm:block sm:tracking-[0.12em]">
              {t("fromLabel")}
            </span>
            <span className="whitespace-nowrap text-footnote font-bold tabular-nums sm:block sm:text-title-sm">
              {formatQar(from, locale)}
            </span>
          </p>
          <Link
            href={installHref()}
            className="col-start-2 row-span-2 row-start-1 inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-(--color-brand) px-4 text-footnote font-bold text-black transition-colors duration-200 ease-soft hover:bg-(--color-brand-hover) sm:w-auto sm:px-5"
          >
            <span className="sm:hidden">{t("stripCtaShort")}</span>
            <span className="hidden sm:inline">{t("stripCta")}</span>
            <ArrowRightIcon className="h-4 w-4 max-sm:hidden rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
