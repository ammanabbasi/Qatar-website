import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

export function DealerLogistics() {
  const t = useTranslations("DealerPage");

  return (
    <section className="bg-(--color-ink) py-14 sm:py-20 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-caption font-bold uppercase tracking-[0.16em] text-(--color-brand)">
              {t("logisticsEyebrow")}
            </span>
            <h2 className="mt-2 text-title sm:text-headline font-bold text-white text-balance">
              {t("logisticsTitle")}
            </h2>
            <p className="mt-4 text-body text-white/70 leading-relaxed">
              {t("logisticsSubtitle")}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-display-sm font-bold text-(--color-brand)">{t("logisticsStat1Number")}</p>
                <p className="mt-0.5 text-footnote text-white/60">{t("logisticsStat1Label")}</p>
              </div>
              <div>
                <p className="text-display-sm font-bold text-(--color-brand)">{t("logisticsStat2Number")}</p>
                <p className="mt-0.5 text-footnote text-white/60">{t("logisticsStat2Label")}</p>
              </div>
              <div>
                <p className="text-display-sm font-bold text-(--color-brand)">{t("logisticsStat3Number")}</p>
                <p className="mt-0.5 text-footnote text-white/60">{t("logisticsStat3Label")}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-white/12 bg-white/6 p-6 backdrop-blur-xs transition-colors hover:bg-white/8">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/20 text-(--color-brand)">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-title-sm font-semibold text-white">
                    {t("logisticsCard1Title")}
                  </h3>
                  <p className="mt-1 text-footnote text-white/70 leading-relaxed">
                    {t("logisticsCard1Desc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/6 p-6 backdrop-blur-xs transition-colors hover:bg-white/8">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-title-sm font-semibold text-white">
                    {t("logisticsCard2Title")}
                  </h3>
                  <p className="mt-1 text-footnote text-white/70 leading-relaxed">
                    {t("logisticsCard2Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
