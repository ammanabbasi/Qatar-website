import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shelf } from "@/components/ui/Shelf";
import { WindIcon, SunIcon, DropIcon, WavesIcon } from "@/components/ui/Icons";

const POINTS = [
  { i: 1, Icon: WindIcon },
  { i: 2, Icon: SunIcon },
  { i: 3, Icon: DropIcon },
  { i: 4, Icon: WavesIcon },
] as const;

/**
 * Topical-depth content block: addresses Qatar-specific car care concerns
 * (heat, sand, salt, hard water). Two purposes:
 *   1. Adds genuine word count + keyword density on commercial pages.
 *   2. Surfaces high-intent long-tail keywords ("paint protection from
 *      Doha sand", "ceramic coating Qatar heat") naturally in body copy.
 *
 * Rendered as "The Apple difference" — a shelf of white tiles with an icon.
 */
export function WhyQatar() {
  const t = useTranslations("WhyQatar");

  return (
    <section className="py-6 lg:py-8">
      <Container className="mb-4">
        <SectionHeading title={t("title")} />
        {/* The climate paragraph is the SEO payload — kept as body copy so the
            two-tone heading stays one line. */}
        <p className="mt-3 max-w-3xl text-body text-(--color-text-muted)">{t("subtitle")}</p>
      </Container>
      <Shelf ariaLabel={t("title")}>
        {POINTS.map(({ i, Icon }) => (
          <article
            key={i}
            className="tile flex w-[300px] flex-col p-6 sm:w-[340px] lg:w-[405px] lg:p-7"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
              <Icon className="h-[22px] w-[22px]" />
            </span>
            <h3 className="mt-5 text-title-sm font-semibold text-balance">
              {t(`point${i}Title`)}
            </h3>
            <p className="mt-2 text-footnote text-(--color-text-muted)">{t(`point${i}Body`)}</p>
          </article>
        ))}
      </Shelf>
    </section>
  );
}
