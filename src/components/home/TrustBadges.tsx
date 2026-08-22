import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

// NOTE: Distributor status wording ("Authorized Distributor") is a trust claim.
// If ABK is not officially authorized by one or more of these brands, change
// the relation per brand or remove it from the list. Labels live in
// messages/*.json (Home.relationDistributor / Home.relationRetailer).
const PARTNERS: Array<{ name: string; relation: "relationDistributor" | "relationRetailer" }> = [
  { name: "Vertek PPF", relation: "relationDistributor" },
  { name: "Autotriz", relation: "relationDistributor" },
  { name: "Briller Car Care", relation: "relationDistributor" },
  { name: "Insta Finish", relation: "relationRetailer" },
];

/** Quiet one-line trust strip beneath the brand shelf. */
export function TrustBadges() {
  const t = useTranslations("Home");
  return (
    <section className="py-4">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-caption text-(--color-text-muted)">
          <li className="font-semibold text-(--color-text)">{t("trustTitle")}</li>
          {PARTNERS.map((p) => (
            <li key={p.name}>
              <span className="text-(--color-text)">{p.name}</span>
              <span aria-hidden> · </span>
              {t(p.relation)}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
