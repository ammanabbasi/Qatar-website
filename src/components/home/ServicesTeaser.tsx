import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shelf } from "@/components/ui/Shelf";
import { TextLink } from "@/components/ui/TextLink";
import { ChevronIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppUrl, type WALocale } from "@/lib/whatsapp";

export const WORKSHOP_SERVICES = [
  { key: "ppf", image: "/products/vertek/vertek-landcruiser-installation.webp" },
  { key: "tint", image: "/products/vertek/vertek-window-tint.webp" },
  { key: "ceramic", image: "/products/autotriz/autotriz-ion-plus-ceramic-coating.webp" },
  { key: "detailing", image: "/products/briller/briller-wash-and-wax.webp" },
] as const;

/** "Help is here." — white tiles, one per workshop service. */
export function ServicesTeaser({ locale }: { locale: WALocale }) {
  const t = useTranslations();

  return (
    <section className="py-6 lg:py-8">
      <Container className="mb-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <SectionHeading
          title={t("Home.servicesTeaserTitle")}
          subtitle={t("Home.servicesTeaserSubtitle")}
        />
        <TextLink href="/b2c/services" size="footnote" className="mb-1 font-medium">
          {t("Home.exploreServices")}
        </TextLink>
      </Container>
      <Shelf ariaLabel={t("Home.servicesTeaserTitle")}>
        {WORKSHOP_SERVICES.map((s) => {
          const title = t(`Services.${s.key}Title`);
          const waHref = buildWhatsAppUrl({ audience: "b2c", locale, productName: title });
          return (
            <article
              key={s.key}
              className="tile flex w-[300px] flex-col overflow-hidden sm:w-[340px] lg:w-[405px]"
            >
              <div className="p-6 lg:p-7">
                <p className="text-caption font-semibold uppercase tracking-[0.04em] text-(--color-text-muted)">
                  {t("Eyebrows.workshop")}
                </p>
                <h3 className="mt-1.5 text-title-sm font-semibold text-balance lg:text-title">
                  <Link href={`/b2c/services#${s.key}`} className="hover:underline underline-offset-2">
                    {title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-footnote text-(--color-text-muted)">
                  {t(`Services.${s.key}Desc`)}
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c plausible-event-product=${title.replace(/\s+/g, "+")} text-link mt-3 text-footnote font-medium`}
                >
                  {t("Home.bookOnWhatsApp")}
                  <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
                </a>
              </div>
              <div className="relative mx-4 mb-4 mt-auto aspect-[4/3] overflow-hidden rounded-[12px] bg-(--color-tile-dark)">
                <Image
                  src={s.image}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 405px"
                  className="object-cover"
                />
              </div>
            </article>
          );
        })}
      </Shelf>
    </section>
  );
}
