import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import {
  BODY_TYPES,
  COVERAGES,
  CUSTOM_MINIMUM_QAR,
  FILMS,
  PRESET_COVERAGES,
  PRICES_UPDATED_AT,
  WORKMANSHIP_COVER_MONTHS,
  presetPriceList,
} from "@/data/ppfInstall";
import { formatQar } from "@/lib/pricing";
import { buildPpfCustomOfferWhatsAppUrl } from "@/lib/whatsapp";

const INCLUDED = ["included1", "included2", "included3"] as const;

/**
 * The whole fixed-price list as plain server-rendered HTML. The configurator
 * only reveals a price after a few clicks, so without this table a crawler or
 * an AI assistant reading the page sees no prices at all — and "how much is
 * PPF in Qatar" is the question they are most often asked.
 */
export async function PpfPriceList({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const qar = (n: number) => formatQar(n, locale);
  const prices = presetPriceList();
  const price = (coverage: string, body: string, film: string) =>
    prices.find((p) => p.coverage === coverage && p.body === body && p.film === film)?.priceQar;
  const years = (key: string) => FILMS.find((f) => f.key === key)!.warrantyYears;
  // Films that cost the same share a column (today: PRO PLUS and MATTE).
  // PRISM (uplift null) is priced per car and stays out of the table.
  const columns: Array<{ label: string; films: string[] }> = [];
  for (const f of FILMS) {
    if (f.uplift === null) continue;
    const short = f.name[locale].replace("Weather Armor ", "");
    const col = columns.find((x) => FILMS.find((y) => y.key === x.films[0])!.uplift === f.uplift);
    if (col) {
      col.films.push(f.key);
      col.label += ` · ${short}`;
    } else columns.push({ label: short, films: [f.key] });
  }
  const updated = new Date(PRICES_UPDATED_AT).toLocaleDateString(
    locale === "ar" ? "ar-QA" : "en-QA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <section id="prices" className="scroll-mt-16 py-8 lg:py-12">
      <Container>
        <SectionHeading title={t("pricesTitle")} subtitle={t("pricesSubtitle")} />
        {/* One row per car within each coverage group: three columns fit a
            phone without sideways scrolling, and every row reads as a
            complete fact ("Full body · SUV · PRO QAR 6,500"). */}
        <div className="mt-6 max-w-3xl overflow-hidden rounded-tile border border-(--color-border) bg-(--color-surface)">
          <table className="w-full border-collapse text-start text-footnote tabular-nums">
            <caption className="px-4 py-3 text-start text-caption text-(--color-text-muted) sm:px-6">
              {t("pricesCaption", {
                pro: years("pro"),
                proPlus: years("pro-plus"),
                matte: years("matte"),
              })}
            </caption>
            <thead>
              <tr className="border-y border-(--color-border)">
                <th scope="col" className="px-4 py-2.5 text-start font-semibold sm:px-6">
                  {t("pricesCar")}
                </th>
                {columns.map((col) => (
                  <th key={col.films[0]} scope="col" className="px-4 py-2.5 text-end font-semibold sm:px-6">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            {PRESET_COVERAGES.map((c) => (
              <tbody key={c}>
                <tr className="border-t border-(--color-border-soft) bg-(--color-bg)">
                  <th colSpan={columns.length + 1} scope="colgroup" className="px-4 py-2 text-start text-footnote font-semibold sm:px-6">
                    {COVERAGES.find((x) => x.key === c)!.name[locale]}
                  </th>
                </tr>
                {BODY_TYPES.map((b) => (
                  <tr key={b.key} className="border-t border-(--color-border-soft) transition-colors hover:bg-(--color-bg)/60">
                    <th scope="row" className="px-4 py-2.5 text-start font-normal sm:px-6">
                      <a
                        href="#quote"
                        data-ppf-body={b.key}
                        data-ppf-coverage={c}
                        className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep)"
                      >
                        <span className="block font-medium text-(--color-text) group-hover:text-(--color-brand-deep)">
                          {b.name[locale]}
                        </span>
                        <span className="mt-0.5 block text-caption text-(--color-text-muted)">
                          {b.examples[locale]}
                        </span>
                      </a>
                    </th>
                    {columns.map((col) => (
                      <td key={col.films[0]} className="px-4 py-2.5 text-end font-semibold whitespace-nowrap text-(--color-text) sm:px-6">
                        <a
                          href="#quote"
                          data-ppf-body={b.key}
                          data-ppf-coverage={c}
                          data-ppf-film={col.films[0]}
                          className="-mx-2 -my-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-(--color-text) transition-colors hover:bg-(--color-brand)/15 hover:text-(--color-brand-deep) active:bg-(--color-brand)/25"
                        >
                          {qar(price(c, b.key, col.films[0])!)}
                        </a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        {/* Callout for customers unsure which category their vehicle falls under */}
        <div className="mt-5 flex max-w-3xl flex-col justify-between gap-4 rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-body font-semibold text-(--color-text)">
              {t("pricesUnsureTitle")}
            </h3>
            <p className="mt-1 text-footnote text-(--color-text-muted)">
              {t("pricesUnsureBody")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href="#quote-custom"
              className={buttonClasses("primary", "sm")}
            >
              {t("pricesUnsureCtaQuote")}
            </a>
            <a
              href={buildPpfCustomOfferWhatsAppUrl({ locale })}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="prices_unsure_whatsapp"
              className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "sm")}`}
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {t("pricesUnsureCtaWhatsApp")}
            </a>
          </div>
        </div>

        <ul className="mt-5 grid max-w-3xl gap-x-6 gap-y-2 sm:grid-cols-2">
          {INCLUDED.map((k) => (
            <li key={k} className="flex items-start gap-2 text-footnote text-(--color-text)">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
              {t(k, { months: WORKMANSHIP_COVER_MONTHS })}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-footnote text-(--color-text-muted)">
          {t("pricesNotes", { minimum: qar(CUSTOM_MINIMUM_QAR) })}
        </p>
        <p className="mt-2 text-caption text-(--color-text-subtle)">
          {t("pricesUpdated", { date: updated })}
        </p>
      </Container>
    </section>
  );
}
