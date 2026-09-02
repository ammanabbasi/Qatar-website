import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, ChatIcon, PinIcon } from "@/components/ui/Icons";
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
    // -v3: circular emblem only — the stacked lockup's microtext made the
    // bear render at ~60% of the box height and was unreadable at tile size.
    logo: "/brands/grizzly-card-v3.webp",
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
 * Distributor strip — the exclusive-distributor claim, the four brand cards,
 * and the two quick-contact cards. The homepage <h1> lives in HomeHero.
 */
export function StoreHeader({ audience, locale }: Props) {
  const t = useTranslations("Home");
  const waHref = buildWhatsAppUrl({ audience, locale });
  const isAr = locale === "ar";

  return (
    <section className="pt-10 pb-4 sm:pt-12 lg:pb-6">
      <Container className="flex flex-col gap-5 sm:gap-6">
        <div>
          <h2 className="text-footnote font-bold uppercase tracking-[0.08em] text-(--color-brand-deep)">
            {t("distributorTitle")}
          </h2>
          <div aria-hidden className="mt-2 h-[3px] w-10 rounded-full bg-(--color-brand)" />
        </div>

        {/* Brand Logos Showcase Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
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

        {/* Quick-contact cards */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} tile group flex items-center gap-3.5 p-4 transition-shadow duration-300 ease-soft hover:shadow-tile-hover sm:p-5`}
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-brand)/12 text-(--color-brand-deep)">
              <ChatIcon className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-caption text-(--color-text-muted)">
                {t("helpChoosing")}
              </span>
              <span className="text-footnote font-semibold text-(--color-text)">
                {t("chatSpecialist")}
              </span>
            </span>
            <ArrowRightIcon className="ms-auto h-4 w-4 shrink-0 text-(--color-text-muted) transition-transform duration-200 ease-soft group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tile group flex items-center gap-3.5 p-4 transition-shadow duration-300 ease-soft hover:shadow-tile-hover sm:p-5"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-brand)/12 text-(--color-brand-deep)">
              <PinIcon className="h-5 w-5" />
            </span>
            <span className="text-footnote font-semibold text-(--color-text)">
              {t("visitStore")}
            </span>
            <ArrowRightIcon className="ms-auto h-4 w-4 shrink-0 text-(--color-text-muted) transition-transform duration-200 ease-soft group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
