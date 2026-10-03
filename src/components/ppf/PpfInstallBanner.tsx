import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { FILMS, WORKMANSHIP_COVER_MONTHS, quotePpf } from "@/data/ppfInstall";
import { formatQar } from "@/lib/pricing";

/**
 * "Want it fitted?" on the retail page of each VTEK PPF film. Car owners who
 * land on a film page usually want it installed, and the link tells crawlers
 * that the film and the installed service belong together. Renders nothing
 * for products that aren't an installable film.
 */
export function PpfInstallBanner({ slug, locale }: { slug: string; locale: "en" | "ar" }) {
  const t = useTranslations("Products");
  const film = FILMS.find((f) => f.productSlug === slug);
  if (!film) return null;
  const { priceQar } = quotePpf({ body: "sedan", coverage: "front-end", parts: [], film: film.key });

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <ShieldCheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-(--color-brand-deep)" />
        <div className="min-w-0">
          <p className="text-callout font-semibold text-(--color-text)">{t("pdpInstallTitle")}</p>
          <p className="mt-0.5 text-footnote text-(--color-text-muted)">
            {priceQar === null
              ? t("pdpInstallBodyQuote", { months: WORKMANSHIP_COVER_MONTHS })
              : t("pdpInstallBody", {
                  price: formatQar(priceQar, locale),
                  months: WORKMANSHIP_COVER_MONTHS,
                })}
          </p>
        </div>
      </div>
      <Link
        href="/b2c/ppf-installation"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-(--color-fill) px-4 py-2 text-footnote font-semibold text-(--color-text) transition-colors hover:bg-(--color-fill-hover) sm:self-auto"
      >
        <span>{t("pdpInstallAction")}</span>
        <ChevronIcon className="h-3.5 w-3.5 rtl:rotate-180" />
      </Link>
    </div>
  );
}
