import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PpfCarLine } from "@/components/ppf/PpfCarLine";
import { BODY_TYPES, COVERAGES } from "@/data/ppfInstall";
import {
  WORKMANSHIP_COVER_MONTHS,
  fromPrice,
  glossWarrantyRange,
  installHref,
  installedFromQar,
} from "@/lib/ppfOffer";
import { formatNumber, formatQar } from "@/lib/pricing";

/**
 * Retail home: the premium "installed PPF" band straight after the hero.
 * Dark carbon card on the light page, one gold accent, a blueprint-style car
 * with the front end marked as the protected zone. Every figure is derived
 * from src/data/ppfInstall.ts.
 */
export function PpfInstallPromo({ locale }: { locale: "en" | "ar" }) {
  const t = useTranslations("PpfPromo");
  const from = installedFromQar("pro") ?? 0;
  const body = BODY_TYPES.find((b) => b.key === "sedan")!;
  const coverage = COVERAGES.find((c) => c.key === "front-end")!;
  const warranty = glossWarrantyRange();
  const n = (v: number) => formatNumber(v, locale);

  const facts = [
    { title: t("fact1Title"), body: t("fact1Body") },
    {
      title: t("fact2Title"),
      body: t("fact2Body", {
        front: formatQar(fromPrice("front-end"), locale),
        full: formatQar(fromPrice("full-front"), locale),
        body: formatQar(fromPrice("full-body"), locale),
      }),
    },
    {
      title: t("fact3Title", { min: n(warranty.min), max: n(warranty.max) }),
      body: t("fact3Body", { months: n(WORKMANSHIP_COVER_MONTHS) }),
    },
  ];

  return (
    <section aria-labelledby="ppf-promo-title" className="pt-6 sm:pt-8">
      <Container>
        <div className="relative isolate overflow-hidden rounded-hero bg-(--color-tile-dark) text-white ring-1 ring-inset ring-white/10">
          <div aria-hidden className="ppf-blueprint absolute inset-0 -z-10" />
          <div className="grid gap-x-12 gap-y-7 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:p-12">
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--color-brand)">
                <span aria-hidden className="hidden h-px w-5 bg-(--color-brand) sm:block" />
                {t("eyebrow")}
              </p>
              <h2
                id="ppf-promo-title"
                className="mt-3 text-title font-bold sm:text-headline"
              >
                <span className="block">{t("homeTitle1")}</span>
                <span className="block text-white/55">{t("homeTitle2")}</span>
              </h2>
              <p className="mt-3 max-w-[44ch] text-footnote text-white/65 sm:text-body">
                {t("homeLead")}
              </p>
            </div>

            <figure className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:justify-center">
              <PpfCarLine id="ppf-home-car" label={t("diagramLabel")} />
              <figcaption className="mt-1 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                <span className="text-(--color-brand)">{coverage.name[locale]}</span>
                <span>{t("zoneLabel")}</span>
              </figcaption>
            </figure>

            <div className="lg:col-start-1 lg:row-start-2 lg:self-end">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-white/55">
                {t("fromLabel")}
              </p>
              <p className="mt-1 text-headline font-bold leading-none tabular-nums">
                {formatQar(from, locale)}
              </p>
              <p className="mt-2 text-caption text-white/50">
                {body.name[locale]} · {coverage.name[locale]}
              </p>
              <Link
                href={installHref()}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-(--color-brand) px-7 text-body font-bold text-black shadow-[0_4px_14px_rgba(245,166,35,0.3)] transition-colors duration-200 ease-soft hover:bg-(--color-brand-hover) sm:w-auto"
              >
                <span>{t("cta")}</span>
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            <ul className="grid gap-px border-t border-white/12 pt-1 sm:grid-cols-3 sm:gap-8 sm:pt-6 lg:col-span-2 lg:row-start-3">
              {facts.map((f, i) => (
                <li
                  key={f.title}
                  className="flex gap-3 border-b border-white/10 py-3 last:border-b-0 sm:block sm:border-b-0 sm:py-0"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 text-caption font-semibold tabular-nums text-(--color-brand) sm:block"
                  >
                    {locale === "ar" ? n(i + 1) : `0${i + 1}`}
                  </span>
                  <div className="min-w-0 sm:mt-1.5">
                    <p className="text-footnote font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-footnote text-white/55">{f.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
