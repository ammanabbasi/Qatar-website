import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon, SunIcon, WindIcon, ShieldCheckIcon } from "@/components/ui/Icons";
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
  const isB2c = audience === "b2c";
  const eyebrow = isB2c ? t("heroEyebrowB2c") : t("heroEyebrowB2b");
  const line1 = isB2c ? t("heroTitleLine1B2c") : t("heroTitleLine1B2b");
  const line2 = isB2c ? t("heroTitleLine2B2c") : t("heroTitleLine2B2b");
  const ctaProducts = isB2c ? t("heroCtaProductsB2c") : t("heroCtaProductsB2b");
  const ctaQuote = isB2c ? t("heroCtaQuoteB2c") : t("heroCtaQuoteB2b");

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

      <Container className="pt-8 pb-8 sm:pt-16 sm:pb-10 lg:pt-24 lg:pb-12">
        <div className="max-w-[620px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-(--color-brand)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-brand) animate-pulse" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="mt-3 text-title sm:text-headline lg:text-display-lg font-bold tracking-tight">
            <span className="block text-white uppercase">{line1}</span>
            <span className="block text-(--color-brand) uppercase tracking-wide">{line2}</span>
          </h1>

          {/* 3 Glass feature badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90 backdrop-blur-md">
              <SunIcon className="h-3.5 w-3.5 text-(--color-brand)" />
              <span>{t("heroBadgeHeat")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90 backdrop-blur-md">
              <WindIcon className="h-3.5 w-3.5 text-(--color-brand)" />
              <span>{t("heroBadgeSand")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-medium text-white/90 backdrop-blur-md">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-(--color-brand)" />
              <span>{t("heroBadgeUV")}</span>
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href={`/${audience}/products`}
              className="inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap px-7 h-12 text-body font-bold uppercase tracking-wider bg-(--color-brand) text-black shadow-[0_4px_14px_rgba(245,166,35,0.35)] hover:bg-(--color-brand-hover) transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              <span>{ctaProducts}</span>
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </Link>
            {isB2c ? (
              <Link
                href="/b2b"
                className="inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap px-7 h-12 text-body font-bold uppercase tracking-wider border border-(--color-brand)/60 text-(--color-brand) hover:bg-(--color-brand)/15 transition-all duration-200 w-full sm:w-auto cursor-pointer"
              >
                <span>{ctaQuote}</span>
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </Link>
            ) : (
              <ButtonLink
                variant="outline"
                size="lg"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} uppercase tracking-wider font-semibold w-full sm:w-auto border-(--color-brand)/70 text-(--color-brand) hover:bg-(--color-brand)/15`}
              >
                {ctaQuote}
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
