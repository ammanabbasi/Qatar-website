import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TestimonialsPlaceholder() {
  const t = useTranslations();
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-center gap-8 text-center">
          <SectionHeading
            align="center"
            eyebrow={`⸻ ${t("Eyebrows.customers")}`}
            title={t("Home.testimonialsTitle")}
          />
          <p className="text-(--color-text-muted) text-sm">
            {t("Home.testimonialsComingSoon")}
          </p>
        </div>
      </Container>
    </section>
  );
}
