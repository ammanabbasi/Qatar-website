import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

// NOTE: Distributor status wording ("Authorized Distributor") is a trust claim.
// If ABK is not officially authorized by one or more of these brands, change
// the label via the `relation` prop per brand or remove from the list.
const PARTNERS: Array<{ name: string; relation: string }> = [
  { name: "Vertek PPF", relation: "Authorized Distributor" },
  { name: "Autotriz", relation: "Authorized Distributor" },
  { name: "Briller Car Care", relation: "Authorized Distributor" },
  { name: "Insta Finish", relation: "Authorized Retailer" },
];

export function TrustBadges() {
  const t = useTranslations("Home");
  return (
    <section className="py-14 border-t border-(--color-border)">
      <Container>
        <div className="flex flex-col items-center gap-8">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-(--color-gold)">
            ⸻ {t("trustTitle")}
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-(--color-border) bg-(--color-surface)/40 p-5 flex flex-col gap-1 items-center text-center"
              >
                <span className="font-display text-base">{p.name}</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-(--color-text-muted)">
                  {p.relation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
