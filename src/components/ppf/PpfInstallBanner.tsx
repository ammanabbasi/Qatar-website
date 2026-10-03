import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PpfCarLine } from "./PpfCarLine";
import { WORKMANSHIP_COVER_MONTHS, filmForSlug, installHref, installedFromQar } from "@/lib/ppfOffer";
import { formatNumber, formatQar } from "@/lib/pricing";

/**
 * The premium upsell on the retail page of each VTEK PPF film: the same film,
 * professionally installed, with that film's own from-price and warranty. The
 * link carries the film so the installation page opens with it preselected,
 * and it tells crawlers the film and the installed service belong together.
 * Renders nothing for products that aren't an installable film.
 */
export function PpfInstallBanner({ slug, locale }: { slug: string; locale: "en" | "ar" }) {
  const t = useTranslations("PpfPromo");
  const film = filmForSlug(slug);
  if (!film) return null;
  const priceQar = installedFromQar(film.key);

  return (
    <aside
      aria-labelledby="ppf-pdp-title"
      className="relative isolate overflow-hidden rounded-tile bg-(--color-tile-dark) text-white ring-1 ring-inset ring-white/10"
    >
      <div aria-hidden className="ppf-blueprint absolute inset-0 -z-10" />
      <div className="p-5 sm:p-6">
        <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--color-brand)">
          <span aria-hidden className="hidden h-px w-5 bg-(--color-brand) sm:block" />
          {t("eyebrow")}
        </p>
        <h2 id="ppf-pdp-title" className="mt-2 text-title-sm font-bold">
          {t("pdpTitle")}
        </h2>

        <div className="mt-4 grid items-end gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
          <p className="leading-tight">
            <span className="block text-caption font-semibold uppercase tracking-[0.12em] text-white/55">
              {priceQar === null ? t("installedLabel") : t("fromLabel")}
            </span>
            <span className="mt-1 block text-title font-bold tabular-nums">
              {priceQar === null ? t("perCar") : formatQar(priceQar, locale)}
            </span>
          </p>
          <PpfCarLine
            id="ppf-pdp-car"
            ruler={false}
            className="max-h-[84px] max-w-[260px] sm:justify-self-end"
          />
        </div>

        <ul className="mt-4 flex flex-wrap gap-2 text-caption font-medium text-white/80">
          <li className="rounded-pill border border-white/15 px-3 py-1">
            {t("pdpWarranty", {
              years: film.warrantyYears,
              text: formatNumber(film.warrantyYears, locale),
            })}
          </li>
          <li className="rounded-pill border border-white/15 px-3 py-1">
            {t("pdpWorkmanship", { months: formatNumber(WORKMANSHIP_COVER_MONTHS, locale) })}
          </li>
        </ul>

        <Link
          href={installHref(film.key)}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-(--color-brand) px-7 text-body font-bold text-black transition-colors duration-200 ease-soft hover:bg-(--color-brand-hover) sm:w-auto"
        >
          <span>{t("cta")}</span>
          <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <p className="mt-3 text-caption text-white/50">
          {priceQar === null ? t("pdpNoteQuote") : t("pdpNote")}
        </p>
      </div>
    </aside>
  );
}
