import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const PARTNERS: Array<{
  name: string;
  relation: "relationDistributor" | "relationRetailer";
}> = [
  { name: "VTEK PPF", relation: "relationDistributor" },
  { name: "Autotriz", relation: "relationDistributor" },
  { name: "Briller Car Care", relation: "relationDistributor" },
  { name: "Grizzly PPF", relation: "relationDistributor" },
];

export function TrustBadges() {
  const t = useTranslations("Home");

  return (
    <section className="bg-white pb-12 lg:pb-16 border-b border-(--color-border-soft)">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-(--color-hero-dark) p-6 sm:p-8 border border-white/10 shadow-xl text-white">
          <h3 className="text-footnote font-bold uppercase tracking-wider text-(--color-brand)">
            {t("trustTitle")}
          </h3>

          <ul className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {PARTNERS.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 px-4 py-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--color-brand) text-black font-black text-caption">
                  ✓
                </span>
                <span className="text-footnote font-medium text-white/95">
                  <span className="font-bold">{p.name}</span>
                  <span className="text-white/60"> · </span>
                  <span className="text-white/80">{t(p.relation)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
