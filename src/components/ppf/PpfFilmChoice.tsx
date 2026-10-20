import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { FILMS, ULTIMATE_WARRANTY_YEARS, quotePpf } from "@/data/ppfInstall";
import { FILM_FACTS, VTEK_URLS, yearsPhrase } from "@/data/ppfEvidence";
import { formatQar } from "@/lib/pricing";

/**
 * "Which film?" — four cards instead of a six-column spec table. Each card says
 * only what VTEK publishes about the film (src/data/ppfEvidence.ts), its VTEK
 * warranty term and the installed full-body price, and opens the quote builder
 * on that film. No thickness, polymer or heat-rating figures: VTEK publishes
 * none for its current films, and the page used to print numbers it could not
 * source.
 */
export async function PpfFilmChoice({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "PpfInstall" });

  return (
    <section
      id="films"
      className="scroll-mt-16 border-t border-(--color-border) py-10 lg:py-14"
    >
      <Container>
        <SectionHeading title={t("filmsTitle")} subtitle={t("filmsSubtitle")} />

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FILMS.map((f) => {
            const facts = FILM_FACTS[f.key];
            const sedanFullBody = quotePpf({
              body: "sedan",
              coverage: "full-body",
              parts: [],
              film: f.key,
            }).priceQar;
            return (
              <li
                key={f.key}
                className="flex flex-col rounded-tile border border-(--color-border) bg-(--color-surface) p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-body font-bold text-(--color-text)">
                      <Link
                        href={`/b2c/products/${f.productSlug}`}
                        className="hover:text-(--color-brand-deep) hover:underline"
                      >
                        {f.name[locale]}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-caption font-medium text-(--color-text-muted)">
                      {facts.finish[locale]}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-pill bg-(--color-fill) px-2.5 py-1 text-caption font-semibold text-(--color-text)">
                    {yearsPhrase(f.warrantyYears, locale)}
                  </span>
                </div>

                <p className="mt-3 text-footnote leading-relaxed text-(--color-text-muted)">
                  {facts.vtek[locale]}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 sm:mt-auto sm:flex-col sm:items-stretch sm:gap-3 sm:pt-4">
                  <p className="min-w-0 text-footnote font-bold tabular-nums text-(--color-brand-deep) sm:text-center">
                    {sedanFullBody === null
                      ? t("filmPerCar")
                      : t("filmFullBodyFrom", { price: formatQar(sedanFullBody, locale) })}
                  </p>
                  <a
                    href="#quote"
                    data-ppf-film={f.key}
                    data-ppf-coverage="full-body"
                    className={`shrink-0 ${buttonClasses("secondary", "sm")}`}
                  >
                    {t("filmChoose")}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 max-w-3xl text-footnote text-(--color-text-muted)">
          {t("filmUltimateNote", { years: yearsPhrase(ULTIMATE_WARRANTY_YEARS, locale) })}
        </p>
        <a
          href={VTEK_URLS.films}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-caption font-semibold text-(--color-link) hover:underline"
        >
          {t("filmsVtekLink")}
          <ArrowUpRightIcon className="h-3 w-3 shrink-0 rtl:-scale-x-100" />
        </a>

        <div className="mt-8 max-w-3xl border-t border-(--color-border) pt-6">
          <h3 className="text-title-sm font-semibold text-(--color-text)">{t("whyTitle")}</h3>
          <p className="mt-2 text-footnote leading-relaxed text-(--color-text-muted) sm:text-body">
            {t("whyBody")}
          </p>
        </div>
      </Container>
    </section>
  );
}
