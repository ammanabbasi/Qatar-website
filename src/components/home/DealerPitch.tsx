import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import type { WALocale } from "@/lib/whatsapp";

export function DealerPitch({ locale }: { locale: WALocale }) {
  const t = useTranslations();
  const bullets = [
    t("Home.dealerBullet1"),
    t("Home.dealerBullet2"),
    t("Home.dealerBullet3"),
    t("Home.dealerBullet4"),
  ];
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative rounded-3xl border border-(--color-border) bg-gradient-to-br from-(--color-surface) via-(--color-bg) to-(--color-surface-2) p-8 sm:p-12 overflow-hidden">
          <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-(--color-gold)/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <SectionHeading
                eyebrow={`⸻ ${t("Eyebrows.wholesale")}`}
                title={t("Home.dealerTitle")}
                subtitle={t("Home.dealerSubtitle")}
              />
            </div>
            <ul className="flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-1 w-4 h-4 rounded-full bg-(--color-gold)/20 inline-flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)" />
                  </span>
                  <span className="text-(--color-text)">{b}</span>
                </li>
              ))}
              <div className="mt-4">
                <WhatsAppButton
                  audience="b2b"
                  locale={locale}
                  label={t("Cta.wholesaleInquiry")}
                  emailFallbackLabel={t("Cta.preferEmail")}
                  size="lg"
                />
              </div>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
