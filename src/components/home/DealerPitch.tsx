import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import type { WALocale } from "@/lib/whatsapp";

/** Wholesale pitch — a wide black promo tile. */
export function DealerPitch({ locale }: { locale: WALocale }) {
  const t = useTranslations();
  const bullets = [
    t("Home.dealerBullet1"),
    t("Home.dealerBullet2"),
    t("Home.dealerBullet3"),
    t("Home.dealerBullet4"),
  ];

  return (
    <section className="py-6 lg:py-8">
      <Container>
        <div className="grid gap-10 rounded-hero bg-(--color-ink) p-8 text-white shadow-tile sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14 lg:p-14">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-brand)">
              {t("Eyebrows.wholesale")}
            </p>
            <h2 className="mt-2 text-title font-semibold text-balance lg:text-headline">
              {t("Home.dealerTitle")}
            </h2>
            <p className="mt-4 max-w-lg text-body text-white/70">{t("Home.dealerSubtitle")}</p>
            <div className="mt-6">
              <WhatsAppButton
                audience="b2b"
                locale={locale}
                label={t("Cta.wholesaleInquiry")}
                emailFallbackLabel={t("Cta.preferEmail")}
                size="lg"
                variant="light"
                showEmailFallback={false}
              />
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-[14px] bg-white/8 p-4 text-footnote text-white/90"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
