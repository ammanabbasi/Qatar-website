import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Topical-depth content block: addresses Qatar-specific car care concerns
 * (heat, sand, salt, hard water). Two purposes:
 *   1. Adds genuine word count + keyword density on commercial pages.
 *   2. Surfaces high-intent long-tail keywords ("paint protection from
 *      Doha sand", "ceramic coating Qatar heat") naturally in body copy.
 *
 * Without this, the home page reads as generic e-commerce — Google has
 * no signal that this site is the authoritative source for Qatar car
 * care. Competitors with 1,500-word buyer's guides outrank thin
 * landing pages for almost every commercial query.
 */
export function WhyQatar() {
  const t = useTranslations();
  const points = [1, 2, 3, 4] as const;

  return (
    <section className="py-16 sm:py-24 border-t border-(--color-border)">
      <Container>
        <SectionHeading
          eyebrow={`⸻ ${t("Eyebrows.whyQatar")}`}
          title={t("WhyQatar.title")}
          subtitle={t("WhyQatar.subtitle")}
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {points.map((i) => (
            <article
              key={i}
              className="p-6 sm:p-7 rounded-2xl border border-(--color-border) bg-(--color-surface)"
            >
              <h3 className="font-display text-xl mb-2 text-(--color-gold)">
                {t(`WhyQatar.point${i}Title`)}
              </h3>
              <p className="text-base text-(--color-text-muted) leading-relaxed">
                {t(`WhyQatar.point${i}Body`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
