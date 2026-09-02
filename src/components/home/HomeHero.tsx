import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  BadgeIcon,
  BoxIcon,
  HeadsetIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
};

const TRUST_POINTS = [
  { key: "heroTrustAuthentic", Icon: BadgeIcon },
  { key: "heroTrustDistributor", Icon: ShieldCheckIcon },
  { key: "heroTrustRange", Icon: BoxIcon },
  { key: "heroTrustSupport", Icon: HeadsetIcon },
] as const;

/**
 * Dark showroom hero — headline, gold CTAs and the four trust points over the
 * showroom photograph. Owns the page's single <h1>.
 */
export function HomeHero({ audience, locale }: Props) {
  const t = useTranslations("Home");
  const waHref = buildWhatsAppUrl({ audience, locale });
  const b2c = audience === "b2c";

  return (
    <section className="relative isolate overflow-hidden bg-(--color-hero-dark) text-white">
      {/* One rtl:-scale-x-100 on the whole backdrop mirrors the car AND the
          text-legibility gradients together for Arabic (the photo carries no
          legible text, so mirroring is safe). */}
      <div aria-hidden className="absolute inset-0 -z-10 rtl:-scale-x-100">
        <Image
          src="/home/hero-showroom.webp"
          alt=""
          fill
          preload
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[70%_42%] brightness-[1.14] saturate-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-(--color-hero-dark) from-5% via-(--color-hero-dark)/60 via-40% to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-(--color-hero-dark)/55 via-transparent via-30% to-(--color-hero-dark)/85" />
      </div>

      <Container className="pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-24 lg:pb-12">
        <div className="max-w-[620px]">
          <p className="text-caption font-bold uppercase tracking-[0.16em] text-(--color-brand)">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-3 text-headline font-bold tracking-tight sm:text-display lg:text-display-lg">
            <span className="block">{t("heroTitleLine1")}</span>
            <span className="block text-(--color-brand)">{t("heroTitleLine2")}</span>
          </h1>
          <p className="mt-4 max-w-[46ch] text-body text-white/80 sm:mt-5 sm:text-body-lg">
            {b2c ? t("heroBodyB2c") : t("heroBodyB2b")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
            <Link
              href={`/${audience}/products`}
              className={`${buttonClasses("brand", "lg")} w-full sm:w-auto`}
            >
              {t("heroCtaProducts")}
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <ButtonLink
              variant="brandOutline"
              size="lg"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} w-full sm:w-auto`}
            >
              {t("heroCtaQuote")}
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </ButtonLink>
          </div>
        </div>

        {/* Trust bar */}
        <ul className="mt-10 grid grid-cols-2 rounded-hero border border-white/10 bg-white/5 backdrop-blur-md sm:mt-14 sm:grid-cols-4 sm:divide-x sm:divide-white/10 lg:mt-16">
          {TRUST_POINTS.map(({ key, Icon }) => (
            <li
              key={key}
              className="flex flex-col items-center gap-2.5 px-3 py-5 text-center sm:px-4 sm:py-6"
            >
              <Icon className="h-6 w-6 text-(--color-brand)" />
              <span className="max-w-[17ch] text-caption font-medium text-balance text-white/90 sm:text-footnote">
                {t(key)}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
