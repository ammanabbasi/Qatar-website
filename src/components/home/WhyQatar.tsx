import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import {
  WindIcon,
  SunIcon,
  DropIcon,
  WavesIcon,
  BadgeIcon,
  ShieldCheckIcon,
  HeadsetIcon,
  BoxIcon,
} from "@/components/ui/Icons";

const CLIMATE_CARDS = [
  {
    i: 1,
    Icon: WindIcon,
    image: "/home/climate-sand.webp",
    alt: "Car driving in sand",
  },
  {
    i: 2,
    Icon: SunIcon,
    image: "/home/climate-heat.webp",
    alt: "High heat desert thermometer",
  },
  {
    i: 3,
    Icon: WavesIcon,
    image: "/home/climate-uv.webp",
    alt: "Intense solar UV radiation",
  },
  {
    i: 4,
    Icon: DropIcon,
    image: "/home/climate-salt.webp",
    alt: "Hydrophobic water droplets on car paint",
  },
] as const;

const WHY_ABK = [
  { key: "whyAbk1", Icon: BadgeIcon },
  { key: "whyAbk2", Icon: ShieldCheckIcon },
  { key: "whyAbk3", Icon: HeadsetIcon },
  { key: "whyAbk4", Icon: BoxIcon },
] as const;

export function WhyQatar() {
  const t = useTranslations("WhyQatar");
  const tHome = useTranslations("Home");

  return (
    <section className="bg-white py-12 lg:py-16 border-b border-(--color-border-soft)">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl">
          <h2 className="text-display font-bold tracking-tight text-(--color-text)">
            {t("title")}
          </h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-(--color-brand)" />
          <p className="mt-4 text-body text-(--color-text-muted) leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* 4 Bento Photo Cards (2x2 on mobile, 4-col on desktop) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {CLIMATE_CARDS.map(({ i, Icon, image, alt }) => (
            <article
              key={i}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-(--color-bg) shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="p-5 sm:p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-(--color-text) shadow-xs border border-black/5">
                  <Icon className="h-5 w-5 text-(--color-brand-deep)" />
                </span>
                <h3 className="mt-4 text-title-sm font-bold text-(--color-text)">
                  {t(`point${i}Title`)}
                </h3>
                <p className="mt-2 text-footnote text-(--color-text-muted) leading-normal">
                  {t(`point${i}Body`)}
                </p>
              </div>

              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Why ABK? Full-width dark trust bar */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-(--color-hero-dark) p-6 sm:p-8 lg:p-10 border border-white/10 shadow-xl text-white">
          <p className="text-footnote font-bold uppercase tracking-wider text-(--color-brand)">
            {tHome("whyAbkTitle")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {WHY_ABK.map(({ key, Icon }) => (
              <div
                key={key}
                className="flex flex-col items-start gap-3 sm:items-center sm:text-center"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-(--color-brand) shadow-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-footnote font-semibold text-white/95">
                  {tHome(key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
