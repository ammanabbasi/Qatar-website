import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon, CheckIcon } from "@/components/ui/Icons";
import { EVIDENCE_CHECKED_AT, TRUST_PROOFS } from "@/data/ppfEvidence";

const linkClass =
  "mt-auto inline-flex min-h-8 items-center gap-1 pt-1 text-caption font-semibold text-(--color-link) hover:underline sm:min-h-0 sm:pt-3";

/**
 * Five proofs a visitor can open and check themselves, straight under the
 * hero. Every row names its source (src/data/ppfEvidence.ts) and the section
 * says when the sources were last read, so nothing here rests on "trust us".
 */
export async function PpfTrustStrip({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "PpfInstall" });
  const checked = new Date(EVIDENCE_CHECKED_AT).toLocaleDateString(
    locale === "ar" ? "ar-QA" : "en-QA",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );

  return (
    <section
      id="trust"
      aria-labelledby="trust-title"
      className="border-b border-(--color-border) bg-(--color-surface) py-8 lg:py-12"
    >
      <Container>
        <SectionHeading id="trust-title" title={t("trustTitle")} subtitle={t("trustSubtitle")} />
        <ul className="mt-6 grid gap-px overflow-hidden rounded-tile border border-(--color-border) bg-(--color-border) sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_PROOFS.map((p) => (
            <li
              key={p.key}
              className="flex flex-col bg-(--color-surface) px-4 py-3.5 sm:p-5 sm:max-lg:last:col-span-2"
            >
              <div className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--color-brand)/20 text-(--color-brand-deep)"
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                <h3 className="text-footnote font-semibold text-(--color-text)">{p.title[locale]}</h3>
              </div>
              <p className="mt-1.5 text-caption leading-relaxed text-(--color-text-muted)">
                {p.body[locale]}
              </p>
              {p.proof.internal ? (
                <Link href={p.proof.href} className={linkClass}>
                  {p.proof.label[locale]}
                </Link>
              ) : (
                <a
                  href={p.proof.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {p.proof.label[locale]}
                  <ArrowUpRightIcon className="h-3 w-3 shrink-0 rtl:-scale-x-100" />
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-(--color-text-muted)">{t("trustChecked", { date: checked })}</p>
      </Container>
    </section>
  );
}
