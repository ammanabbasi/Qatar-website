import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";

/**
 * Brief "about" content block rendered on the B2C homepage between Star Products
 * and BrandStrip. Purpose is purely SEO: gives Google a keyword-rich text block
 * on the most-crawled page for queries like "car care Doha", "auto detailing
 * products Qatar", "car shampoo Qatar" etc.
 *
 * Content mirrors the About page but is much shorter — ~120 words, enough for
 * 3 paragraphs of topical text without diluting the page's commercial intent.
 * The "Learn more" link passes equity to the full About page.
 */
export function AboutSnippet() {
  const t = useTranslations("HomeAbout");

  return (
    <section className="py-14 sm:py-20 border-t border-(--color-border)">
      <Container>
        <SectionHeading
          eyebrow={`⸻ ${t("eyebrow")}`}
          title={t("title")}
        />
        <div className="mt-8 max-w-3xl flex flex-col gap-4 text-base text-(--color-text-muted) leading-relaxed">
          <p>{t("paragraph1")}</p>
          <p>{t("paragraph2")}</p>
          <Link
            href="/about"
            className="text-(--color-gold) hover:underline underline-offset-4 w-fit"
          >
            {t("learnMore")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
