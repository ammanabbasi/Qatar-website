import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const BRANDS = [
  { name: "Vertek", tagKey: "brandTagVertek" },
  { name: "Autotriz", tagKey: "brandTagAutotriz" },
  { name: "Briller", tagKey: "brandTagBriller" },
  { name: "Insta Finish", tagKey: "brandTagInstaFinish" },
  { name: "Getsun", tagKey: "brandTagGetsun" },
  { name: "Sitrett", tagKey: "brandTagSitrett" },
  { name: "Smart Car", tagKey: "brandTagSmartCar" },
  { name: "ABK", tagKey: "brandTagABK" },
] as const;

export function BrandStrip() {
  const t = useTranslations("Home");
  // Duplicate so the marquee can loop seamlessly via translateX(-50%).
  const track = [...BRANDS, ...BRANDS];

  return (
    <section className="py-14 border-y border-(--color-border) bg-(--color-surface)/40 overflow-hidden">
      <Container>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.34em] text-(--color-text-muted)">
            {t("brandsTitle")}
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.22em] text-(--color-gold)/60">
            {t("brandsStripline")}
          </span>
        </div>
      </Container>
      <div className="mt-8 relative">
        {/* Edge fades so brands ease in/out instead of hard-cutting */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-(--color-surface) to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-(--color-surface) to-transparent z-10" />
        <div className="marquee-track">
          {track.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className="flex items-baseline gap-4 whitespace-nowrap"
            >
              <span className="font-display text-2xl sm:text-3xl text-(--color-chrome)/85 tracking-tight font-medium">
                {b.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-(--color-text-muted)/70">
                {t(b.tagKey)}
              </span>
              <span className="text-(--color-accent-red)/80 text-xs ms-10" aria-hidden>
                ◆
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
