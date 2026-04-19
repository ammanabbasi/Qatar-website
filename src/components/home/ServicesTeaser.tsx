import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";

export function ServicesTeaser() {
  const t = useTranslations();
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <Container className="relative grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-(--color-border)">
          <Image
            src="/products/vertek/vertek-landcruiser-installation.webp"
            alt={t("Home.servicesTeaserTitle")}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={`⸻ ${t("Eyebrows.workshop")}`}
            title={t("Home.servicesTeaserTitle")}
            subtitle={t("Home.servicesTeaserSubtitle")}
          />
          <ul className="grid grid-cols-2 gap-4 mt-2 text-sm">
            {[
              t("Services.ppfTitle"),
              t("Services.tintTitle"),
              t("Services.ceramicTitle"),
              t("Services.detailingTitle"),
            ].map((s) => (
              <li
                key={s}
                className="px-4 h-11 rounded-full border border-(--color-border) inline-flex items-center text-(--color-text-muted) text-xs sm:text-sm"
              >
                <span className="w-1 h-1 rounded-full bg-(--color-gold) me-2" />
                {s}
              </li>
            ))}
          </ul>
          <div>
            <Link
              href="/b2c/services"
              className="inline-flex items-center gap-2 text-(--color-gold) hover:underline underline-offset-4 text-sm font-medium mt-2"
            >
              {t("Services.cta")} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
