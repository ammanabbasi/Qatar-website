import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

export function DealerPartnershipTiers() {
  const t = useTranslations("DealerPage");

  const tiers = [
    {
      id: "tier1",
      badge: t("tier1Badge"),
      title: t("tier1Title"),
      desc: t("tier1Desc"),
      points: [t("tier1Point1"), t("tier1Point2"), t("tier1Point3")],
      highlight: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-(--color-brand)" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      id: "tier2",
      badge: t("tier2Badge"),
      title: t("tier2Title"),
      desc: t("tier2Desc"),
      points: [t("tier2Point1"), t("tier2Point2"), t("tier2Point3")],
      highlight: false,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      id: "tier3",
      badge: t("tier3Badge"),
      title: t("tier3Title"),
      desc: t("tier3Desc"),
      points: [t("tier3Point1"), t("tier3Point2"), t("tier3Point3")],
      highlight: false,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-caption font-bold uppercase tracking-[0.16em] text-(--color-brand-deep)">
            {t("tiersEyebrow")}
          </p>
          <h2 className="mt-1.5 text-title sm:text-headline font-bold text-(--color-text)">
            {t("tiersTitle")}
          </h2>
          <p className="mt-3 text-body text-(--color-text-muted) leading-relaxed">
            {t("tiersSubtitle")}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`tile flex flex-col justify-between p-6 sm:p-8 transition-all hover:shadow-md ${
                tier.highlight
                  ? "border-2 border-(--color-brand) shadow-sm ring-4 ring-(--color-brand)/10"
                  : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-fill)">
                    {tier.icon}
                  </span>
                  <span className="rounded-full bg-(--color-fill) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
                    {tier.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-title-sm font-bold text-(--color-text)">
                  {tier.title}
                </h3>
                <p className="mt-2 text-footnote text-(--color-text-muted) leading-relaxed">
                  {tier.desc}
                </p>

                <div className="my-6 border-t border-(--color-border-soft)" />

                <ul className="flex flex-col gap-3">
                  {tier.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-footnote text-(--color-text)">
                      <svg
                        viewBox="0 0 16 16"
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M3 8.5l3 3 7-7" />
                      </svg>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-(--color-border-soft)">
                <a
                  href="#apply-form"
                  className={`flex w-full items-center justify-center rounded-full px-4 py-2.5 text-footnote font-bold transition-colors ${
                    tier.highlight
                      ? "bg-(--color-brand) text-black hover:bg-(--color-brand-hover)"
                      : "bg-(--color-fill) text-(--color-text) hover:bg-(--color-fill-secondary)"
                  }`}
                >
                  {t("tierApplyCta")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
