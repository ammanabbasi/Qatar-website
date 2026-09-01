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

// Official raster logos carry their own baked-in backgrounds, so each card
// paints its tile that exact color (sampled from the artwork) and the logo
// files are edge-feathered to transparent — the logo reads as printed on the
// card instead of pasted over it. `dark` picks chip styling with enough
// contrast against the card color.
const DISTRIBUTOR_BRANDS = [
  {
    key: "Grizzly",
    name: "GRIZZLY",
    country: { en: "USA", ar: "أمريكا" },
    logo: "/brands/grizzly-card-v2.webp",
    bg: "#0d0c2c",
    dark: true,
  },
  {
    key: "VTEK",
    name: "VTEK",
    country: { en: "USA", ar: "أمريكا" },
    logo: "/brands/vtek-card-v2.webp",
    bg: "#231f20",
    dark: true,
  },
  {
    key: "Autotriz",
    name: "AUTOTRIZ",
    country: { en: "GERMANY", ar: "ألمانيا" },
    logo: "/brands/autotriz-card-v2.webp",
    bg: "#2f2b25",
    dark: true,
  },
  {
    key: "Briller",
    name: "BRILLER",
    country: { en: "CANADA", ar: "كندا" },
    logo: "/brands/briller-card-v2.webp",
    bg: "#9b9b9b",
    dark: false,
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
              style={{ backgroundColor: brand.bg }}
              className="tile group flex flex-col items-center gap-2 rounded-[16px] border border-white/10 p-3 pb-2.5 transition-all duration-300 ease-soft hover:border-white/25 hover:shadow-tile-hover sm:gap-2.5 sm:p-4 sm:pb-3"
            >
              <div className="relative h-20 w-full sm:h-24 lg:h-28">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="(max-width: 640px) 45vw, 24vw"
                  className="object-contain transition-transform duration-300 ease-soft group-hover:scale-[1.04]"
                />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wider transition-colors duration-300 ${
                  brand.dark
                    ? "bg-white/10 text-white/90 group-hover:bg-white/20"
                    : "bg-black/30 text-white group-hover:bg-black/40"
                }`}
              >
                {isAr ? brand.country.ar : brand.country.en}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
