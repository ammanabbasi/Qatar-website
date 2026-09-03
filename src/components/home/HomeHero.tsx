import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
};

/**
 * Dark showroom hero — headline, gold CTAs and the four trust points over the
 * showroom photograph. Owns the page's single <h1>.
 */
export function HomeHero({ audience, locale }: Props) {
  const t = useTranslations("Home");
  const waHref = buildWhatsAppUrl({ audience, locale });

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
            <span className="block text-white uppercase">{t("heroTitleLine1")}</span>
            <span className="block text-(--color-brand) uppercase tracking-wide">{t("heroTitleLine2")}</span>
          </h1>

          {/* 3 Glass feature badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90 backdrop-blur-md">
              <span className="text-(--color-brand)">☀️</span>
              <span>{t("heroBadgeHeat")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90 backdrop-blur-md">
              <span className="text-(--color-brand)">🌪️</span>
              <span>{t("heroBadgeSand")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90 backdrop-blur-md">
              <span className="text-(--color-brand)">🛡️</span>
              <span>{t("heroBadgeUV")}</span>
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
            <Link
              href={`/${audience}/products`}
              className="inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap px-7 h-12 text-body font-bold uppercase tracking-wider bg-(--color-brand) text-black shadow-[0_4px_14px_rgba(245,166,35,0.35)] hover:bg-(--color-brand-hover) transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              <span>{t("heroCtaProducts")}</span>
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <ButtonLink
              variant="outline"
              size="lg"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} uppercase tracking-wider font-semibold w-full sm:w-auto border-(--color-brand)/70 text-(--color-brand) hover:bg-(--color-brand)/15`}
            >
              {t("heroCtaQuote")}
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
