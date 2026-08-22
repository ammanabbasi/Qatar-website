import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";

/**
 * Brief "about" block on the B2C homepage. Purpose is partly SEO: gives
 * Google a keyword-rich text block on the most-crawled page for queries like
 * "car care Doha", "auto detailing products Qatar", "car shampoo Qatar".
 * Presented as a wide white promo tile.
 */
export function AboutSnippet() {
  const t = useTranslations("HomeAbout");

  return (
    <section className="py-6 lg:py-8">
      <Container>
        <div className="tile grid gap-8 rounded-hero p-8 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:p-14">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-text-muted)">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 text-title font-semibold text-balance lg:text-headline">
              {t("title")}
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-body text-(--color-text-muted)">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
            <TextLink href="/about" className="mt-1 w-fit font-medium">
              {t("learnMore")}
            </TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
