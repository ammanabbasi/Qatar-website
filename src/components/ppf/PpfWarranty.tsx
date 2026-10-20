import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Disclosure } from "@/components/ui/Disclosure";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowUpRightIcon, CheckIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { FILMS, ULTIMATE_WARRANTY_YEARS } from "@/data/ppfInstall";
import {
  CLAIM_STEPS,
  INSTALLER_POINTS,
  TERMS_PPF_PATH,
  VERIFY_STEPS,
  VTEK_URLS,
  yearsPhrase,
} from "@/data/ppfEvidence";
import { formatNumber } from "@/lib/pricing";
import { buildPpfEnquiryWhatsAppUrl } from "@/lib/whatsapp";

const extLink =
  "inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-(--color-link) hover:underline sm:min-h-0";

/**
 * Warranties, installer and verification, in the order a buyer asks about
 * them: what is covered and for how long, who fits the car, how to check it,
 * and what happens if something fails. Terms come from FILMS (VTEK's chart),
 * the rest from src/data/ppfEvidence.ts.
 */
export async function PpfWarranty({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const ar = locale === "ar";
  const shortName = (name: string) => name.replace("Weather Armor ", "").replace(" (colour)", "");
  const terms: Array<{ name: string; years: number; note?: string }> = [
    ...FILMS.map((f) => ({ name: shortName(f.name.en), years: f.warrantyYears })),
    { name: "ULTIMATE", years: ULTIMATE_WARRANTY_YEARS, note: t("warrantySpecialOrder") },
  ];

  return (
    <section id="credentials" className="scroll-mt-16 border-t border-(--color-border) py-10 lg:py-14">
      <Container>
        <SectionHeading id="warranty" title={t("warrantyTitle")} subtitle={t("warrantySubtitle")} />

        <div className="mt-6 grid divide-y divide-(--color-border) overflow-hidden rounded-tile border border-(--color-border) bg-(--color-surface) md:grid-cols-2 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
          {(["Film", "Work"] as const).map((k) => (
            <div key={k} className="flex gap-3.5 p-5 sm:p-6">
              <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-brand-deep)" />
              <div className="min-w-0 flex-1">
                <h3 className="text-body font-semibold">{t(`warranty${k}Title`)}</h3>
                <p className="mt-1.5 text-footnote leading-relaxed text-(--color-text-muted)">
                  {t(`warranty${k}Body`)}
                </p>
                {k === "Film" ? (
                  <div className="mt-4">
                    <p className="text-caption font-semibold text-(--color-text)">{t("warrantyByFilmTitle")}</p>
                    <dl className="mt-1">
                      {terms.map((row) => (
                        <div
                          key={row.name}
                          className="flex items-baseline justify-between gap-3 border-t border-(--color-border-soft) py-1.5 text-footnote"
                        >
                          <dt className="text-(--color-text)">
                            {row.name}
                            {row.note ? (
                              <span className="ms-1.5 text-caption text-(--color-text-muted)">({row.note})</span>
                            ) : null}
                          </dt>
                          <dd className="font-semibold tabular-nums text-(--color-text)">
                            {yearsPhrase(row.years, locale)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <a
                      href={VTEK_URLS.warranty}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-1 ${extLink}`}
                    >
                      {t("warrantyChartLink")}
                      <ArrowUpRightIcon className="h-3 w-3 shrink-0 rtl:-scale-x-100" />
                    </a>
                  </div>
                ) : (
                  <Link href={TERMS_PPF_PATH} className={`mt-3 ${extLink}`}>
                    {t("termsLink")}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
            <h3 className="text-body font-semibold text-(--color-text)">{t("installerTitle")}</h3>
            <ul className="mt-3 space-y-3 text-footnote text-(--color-text-muted)">
              {INSTALLER_POINTS.map((p) => (
                <li key={p.en} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
                  <span className="leading-relaxed">{p[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-tile border border-(--color-border) bg-(--color-surface) p-5 sm:p-6">
            <h3 className="text-body font-semibold text-(--color-text)">{t("verifyTitle")}</h3>
            <ol className="mt-3 space-y-3 text-footnote text-(--color-text-muted)">
              {VERIFY_STEPS.map((s, i) => (
                <li key={s.en} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-caption font-semibold tabular-nums text-(--color-text)"
                  >
                    {formatNumber(i + 1, locale)}
                  </span>
                  <span className="leading-relaxed">{s[locale]}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-caption text-(--color-text-muted)">{t("verifyHelp")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={VTEK_URLS.eWarrantyCheck}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", "md")}
              >
                nfc.vtekfilms.com/verify
                <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" />
              </a>
              <a
                href={buildPpfEnquiryWhatsAppUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="warranty_whatsapp"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "md")}`}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {ar ? "اسألنا على واتساب" : "Ask us on WhatsApp"}
              </a>
            </div>
          </div>
        </div>

        <Disclosure className="mt-6" title={t("claimTitle")}>
          <ol className="space-y-3 text-footnote text-(--color-text-muted)">
            {CLAIM_STEPS.map((s, i) => (
              <li key={s.en} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-caption font-semibold tabular-nums text-(--color-text)"
                >
                  {formatNumber(i + 1, locale)}
                </span>
                <span className="leading-relaxed">{s[locale]}</span>
              </li>
            ))}
          </ol>
          <Link href={TERMS_PPF_PATH} className={`mt-4 ${extLink}`}>
            {t("termsLink")}
          </Link>
        </Disclosure>
      </Container>
    </section>
  );
}
