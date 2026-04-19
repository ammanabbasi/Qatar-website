import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import type { Audience, WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
};

export function Hero({ audience, locale }: Props) {
  const t = useTranslations();
  const heroImage =
    audience === "b2b"
      ? "/products/autotriz/autotriz-rich-foam-shampoo-20l.webp"
      : "/products/vertek/vertek-ppf-premium-protection.webp";

  return (
    <section className="relative overflow-hidden border-b border-(--color-border) section-with-hex">
      {/* layered hero imagery */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        {/* darken + side-bleed for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-bg)/40 via-(--color-bg)/70 to-(--color-bg)" />
        <div className="absolute inset-0 bg-gradient-to-r from-(--color-bg) via-transparent to-transparent rtl:bg-gradient-to-l" />
      </div>
      {/* hexagonal motif — Vertek's own brand language */}
      <div className="hex-motif" aria-hidden />

      <Container className="relative z-10 pt-28 pb-24 sm:pt-36 sm:pb-32 lg:pt-48 lg:pb-44">
        <div className="hero-stagger max-w-2xl flex flex-col gap-6">
          <span className="inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.32em] text-(--color-gold)/90 font-medium">
            {/* Double-hairline eyebrow — gold dash + red accent spark.
                Surfaces the accent-red that was defined but previously unused. */}
            <span className="inline-block w-8 h-px bg-(--color-gold)" />
            <span className="inline-block w-1 h-1 rounded-full bg-(--color-accent-red)" />
            <span>
              {audience === "b2c" ? t("Home.heroEyebrowB2c") : t("Home.heroEyebrowB2b")}
            </span>
          </span>
          <h1 className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.98] tracking-[-0.025em] font-medium">
            <span className="gold-gradient">
              {audience === "b2c" ? t("Home.heroTitleB2c") : t("Home.heroTitleB2b")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-(--color-text-muted) max-w-xl leading-relaxed">
            {audience === "b2c" ? t("Home.heroSubtitleB2c") : t("Home.heroSubtitleB2b")}
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <WhatsAppButton
              audience={audience}
              locale={locale}
              label={
                audience === "b2b"
                  ? t("Cta.wholesaleInquiry")
                  : t("Cta.inquireWhatsApp")
              }
              emailFallbackLabel={t("Cta.preferEmail")}
              size="lg"
              showEmailFallback={false}
            />
            <Link
              href={`/${audience}/products`}
              className="group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 px-7 h-14 text-base bg-transparent text-(--color-text) hover:bg-(--color-gold)/10 border border-(--color-gold)/50 hover:border-(--color-gold)"
            >
              <span>{t("Cta.exploreProducts")}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-(--color-gold)">→</span>
            </Link>
          </div>
          {/* tagline ribbon for Qatar market trust */}
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-(--color-text-muted)/70">
            {t("Brand.tagline")}
          </p>
        </div>
      </Container>

      {/* bottom chrome hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-(--color-gold)/60 to-transparent z-10" />
    </section>
  );
}
