import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { ChatIcon, PinIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
};

const DISTRIBUTOR_BRANDS = [
  {
    key: "Grizzly",
    name: "GRIZZLY",
    country: { en: "USA", ar: "أمريكا" },
    logo: "/brands/grizzly.webp",
  },
  {
    key: "VTEK",
    name: "VTEK",
    country: { en: "USA", ar: "أمريكا" },
    logo: "/brands/vtek.webp",
  },
  {
    key: "Autotriz",
    name: "AUTOTRIZ",
    country: { en: "GERMANY", ar: "ألمانيا" },
    logo: "/brands/autotriz.webp",
  },
  {
    key: "Briller",
    name: "BRILLER",
    country: { en: "CANADA", ar: "كندا" },
    logo: "/brands/briller.webp",
  },
];

/**
 * Store header with primary title, official distributor badge,
 * brand logos showcase, and quick-contact links.
 */
export function StoreHeader({ audience, locale }: Props) {
  const t = useTranslations("Home");
  const waHref = buildWhatsAppUrl({ audience, locale });
  const b2c = audience === "b2c";
  const isAr = locale === "ar";

  return (
    <section className="pb-4 pt-8 sm:pt-12 lg:pb-6 lg:pt-16">
      <Container className="flex flex-col gap-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div>
            {/* Primary Heading */}
            <h1 className="text-display font-bold tracking-tight text-(--color-text) lg:text-display-lg">
              {b2c ? t("storeTitleB2c") : t("storeTitleB2b")}
            </h1>

            {/* Exclusive & Official Distributor Subtitle */}
            <p className="mt-3 text-footnote font-semibold uppercase tracking-wider text-(--color-text-muted) sm:text-callout sm:mt-4">
              {b2c ? t("storeTaglineB2c") : t("storeTaglineB2b")}
            </p>
          </div>

          <ul className="flex flex-col gap-3 lg:items-end lg:pt-2">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
                <ChatIcon className="h-[18px] w-[18px]" />
              </span>
              <p className="text-footnote">
                <span className="text-(--color-text-muted)">{t("helpChoosing")}</span>{" "}
                <TextLink
                  external
                  icon="external"
                  size="footnote"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience}`}
                >
                  {t("chatSpecialist")}
                </TextLink>
              </p>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
                <PinIcon className="h-[18px] w-[18px]" />
              </span>
              <p className="text-footnote">
                <TextLink
                  external
                  icon="external"
                  size="footnote"
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("visitStore")}
                </TextLink>
              </p>
            </li>
          </ul>
        </div>

        {/* Brand Logos Showcase Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 pt-2">
          {DISTRIBUTOR_BRANDS.map((brand) => (
            <Link
              key={brand.key}
              href={`/${audience}/products?brand=${brand.key}`}
              className="tile group flex items-center justify-between rounded-[16px] border border-(--color-border) bg-(--color-tile) p-3.5 transition-all duration-300 ease-soft hover:border-(--color-text) hover:shadow-tile-hover sm:p-4"
            >
              <div className="relative h-7 w-24 sm:h-8 sm:w-28 flex items-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain object-left rtl:object-right transition-transform duration-300 ease-soft group-hover:scale-105"
                />
              </div>
              <span className="rounded-full bg-(--color-fill) px-2 py-0.5 text-[11px] font-bold tracking-wider text-(--color-text-muted) group-hover:text-(--color-text)">
                {isAr ? brand.country.ar : brand.country.en}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
