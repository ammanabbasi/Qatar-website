import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/Icons";
import type { Audience } from "@/lib/whatsapp";

const SHOP_CATEGORIES = ["ppf", "ceramic", "shampoo", "polish", "tyre"] as const;

export function Footer({ audience }: { audience: Audience }) {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const audiencePrefix = `/${audience}`;
  const homeHref = audience === "b2c" ? "/" : audiencePrefix;

  const linkCls =
    "text-caption text-white/70 transition-colors duration-200 ease-soft hover:text-white hover:underline underline-offset-4";
  const headCls =
    "text-caption font-bold tracking-widest uppercase text-(--color-brand)";

  return (
    <footer className="mt-20 border-t border-white/10 bg-(--color-hero-dark) text-white">
      <Container className="py-12 lg:py-16">
        {/* Top brand tagline */}
        <div className="flex flex-col gap-2 pb-8 border-b border-white/10">
          <p className="text-body font-medium text-white/90">
            {t("Footer.tagline")}
          </p>
        </div>

        {/* 3 Columns & Map */}
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Shop Column */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <h3 className={headCls}>{t("Footer.shop")}</h3>
            <Link className={linkCls} href={`${audiencePrefix}/products`}>
              {t("Nav.products")}
            </Link>
            {SHOP_CATEGORIES.map((c) => (
              <Link
                key={c}
                className={linkCls}
                href={`${audiencePrefix}/products?category=${c}`}
              >
                {t(`Categories.${c}`)}
              </Link>
            ))}
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <h3 className={headCls}>{t("Footer.company")}</h3>
            <Link className={linkCls} href={homeHref}>
              {t("Nav.home")}
            </Link>
            <Link className={linkCls} href="/b2c/blog">
              {t("Nav.blog")}
            </Link>
            <Link className={linkCls} href="/about">
              {t("Nav.about")}
            </Link>
            <Link className={linkCls} href="/contact">
              {t("Nav.contact")}
            </Link>
            <Link className={linkCls} href="/b2b">
              {t("Nav.b2bFull")}
            </Link>
            <Link className={linkCls} href="/b2b/become-a-dealer">
              {t("Nav.becomeDealer")}
            </Link>
          </div>

          {/* Visit Us + Map Column */}
          <div className="flex flex-col gap-4 md:col-span-6">
            <h3 className={headCls}>{t("Footer.visitUs")}</h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-start">
              {/* Address details */}
              <address className="flex flex-col gap-3.5 text-caption not-italic text-white/75">
                {/* Location pin */}
                <div className="flex items-start gap-2.5">
                  <span className="text-(--color-brand) mt-0.5 shrink-0">📍</span>
                  <p>{t("Contact.addressValue")}</p>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-2.5">
                  <span className="text-(--color-brand) mt-0.5 shrink-0">🕒</span>
                  <div>
                    <span className="text-white/95">{t("Contact.hoursSatToThu")}</span>{" "}
                    <span className="ltr-nums block">
                      {SITE.hours.weekdaysMorning} · {SITE.hours.weekdaysEvening}
                    </span>
                    <span className="text-white/95 mt-1 block">
                      {t("Contact.hoursFri")}: {t("Contact.hoursClosed")}
                    </span>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-2.5">
                  <span className="text-(--color-brand) shrink-0">📞</span>
                  <a className={`${linkCls} ltr-nums`} href={`tel:${SITE.phoneE164}`}>
                    {SITE.phone}
                  </a>
                </div>

                {/* Landline */}
                <div className="flex items-center gap-2.5">
                  <span className="text-(--color-brand) shrink-0">☎️</span>
                  <a
                    className={`${linkCls} ltr-nums`}
                    href={`tel:${SITE.phoneLandlineE164}`}
                  >
                    {SITE.phoneLandline}
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2.5">
                  <span className="text-(--color-brand) shrink-0">✉️</span>
                  <a className={linkCls} href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </div>
              </address>

              {/* Dark Map Tile with Gold Pin */}
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View ABK Trading on Google Maps"
                className="group relative block h-48 w-full overflow-hidden rounded-2xl border border-white/15 bg-[#14161a] transition-transform duration-300 hover:scale-[1.02] shadow-lg"
              >
                {/* Visual Dark Map Grid Lines */}
                <svg
                  className="absolute inset-0 h-full w-full opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <pattern
                      id="dark-map-grid"
                      width="32"
                      height="32"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 32 0 L 0 0 0 32"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="#121316" />
                  <rect width="100%" height="100%" fill="url(#dark-map-grid)" />
                  {/* Road diagonals */}
                  <line
                    x1="0"
                    y1="180"
                    x2="300"
                    y2="20"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="3"
                  />
                  <line
                    x1="40"
                    y1="0"
                    x2="240"
                    y2="200"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="2"
                  />
                  <line
                    x1="120"
                    y1="200"
                    x2="280"
                    y2="40"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="2.5"
                  />
                </svg>

                {/* Glowing Golden Map Pin */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#f5a623] to-[#d48806] text-black shadow-[0_0_20px_rgba(245,166,35,0.6)] ring-4 ring-black/40 group-hover:scale-110 transition-transform">
                    <span className="text-body font-black">ABK</span>
                  </div>
                  <span className="mt-2 rounded-full bg-black/80 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white border border-white/10 shadow-sm">
                    Mesaimeer, Doha
                  </span>
                </div>
              </a>
            </div>

            {/* Social Icons */}
            <div className="mt-3 flex items-center gap-3">
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all duration-200 hover:text-(--color-brand) hover:border-(--color-brand)/60 hover:bg-white/10 hover:scale-105"
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all duration-200 hover:text-(--color-brand) hover:border-(--color-brand)/60 hover:bg-white/10 hover:scale-105"
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all duration-200 hover:text-(--color-brand) hover:border-(--color-brand)/60 hover:bg-white/10 hover:scale-105"
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-caption text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("Footer.copyright", { year })}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link className={linkCls} href="/privacy">
              {t("Footer.privacy")}
            </Link>
            <span aria-hidden className="text-white/20">
              |
            </span>
            <Link className={linkCls} href="/terms">
              {t("Footer.terms")}
            </Link>
            <span aria-hidden className="text-white/20">
              |
            </span>
            <span className="text-white/40">{t("Footer.builtBy")}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
