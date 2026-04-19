import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";
import type { Audience } from "@/lib/whatsapp";
import Image from "next/image";

export function Footer({ audience }: { audience: Audience }) {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const audiencePrefix = `/${audience}`;

  return (
    <footer className="mt-24 border-t border-(--color-border) bg-(--color-surface)">
      <Container className="py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href={audiencePrefix} className="flex items-center gap-3">
              <Image src="/logo-mark.svg" alt="ABK" width={40} height={40} />
              <span className="font-display text-base tracking-wide">
                ABK <span className="text-(--color-gold)">Trading</span>
              </span>
            </Link>
            <p className="text-sm text-(--color-text-muted) leading-relaxed max-w-xs">
              {t("Footer.tagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-gold) mb-4">
              {t("Footer.quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link className="hover:text-(--color-gold) transition-colors" href={`${audiencePrefix}/products`}>{t("Nav.products")}</Link></li>
              {audience === "b2c" ? (
                <li><Link className="hover:text-(--color-gold) transition-colors" href="/b2c/services">{t("Nav.services")}</Link></li>
              ) : (
                <li><Link className="hover:text-(--color-gold) transition-colors" href="/b2b/become-a-dealer">{t("Nav.becomeDealer")}</Link></li>
              )}
              <li><Link className="hover:text-(--color-gold) transition-colors" href="/about">{t("Nav.about")}</Link></li>
              <li><Link className="hover:text-(--color-gold) transition-colors" href="/contact">{t("Nav.contact")}</Link></li>
            </ul>
          </div>

          {/* Visit us */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-gold) mb-4">
              {t("Footer.visitUs")}
            </h3>
            <address className="text-sm not-italic text-(--color-text-muted) leading-relaxed space-y-2">
              <p>{t("Contact.addressValue")}</p>
              <p className="ltr-nums">
                <a className="hover:text-(--color-gold)" href={`tel:${SITE.phoneE164}`}>
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a className="hover:text-(--color-gold)" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </p>
            </address>
          </div>

          {/* Hours + Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-gold) mb-4">
              {t("Contact.hours")}
            </h3>
            <ul className="text-sm text-(--color-text-muted) space-y-1">
              <li>
                <span className="text-(--color-text)">{t("Contact.hoursSatToThu")}:</span>{" "}
                <span className="ltr-nums">{SITE.hours.weekdaysMorning} · {SITE.hours.weekdaysEvening}</span>
              </li>
              <li>
                <span className="text-(--color-text)">{t("Contact.hoursFri")}:</span>{" "}
                {t("Contact.hoursClosed")}
              </li>
            </ul>
            <h4 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-(--color-gold) mb-3">
              {t("Contact.social")}
            </h4>
            <div className="flex gap-3">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="w-9 h-9 rounded-full border border-(--color-border) inline-flex items-center justify-center hover:border-(--color-gold) hover:text-(--color-gold)">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                 className="w-9 h-9 rounded-full border border-(--color-border) inline-flex items-center justify-center hover:border-(--color-gold) hover:text-(--color-gold)">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 22v-8h3l1-4h-4V7.5c0-1.1.5-2 2-2h2V2h-3c-3 0-5 1.8-5 5.2V10H6v4h3v8h4z" />
                </svg>
              </a>
              <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                 className="w-9 h-9 rounded-full border border-(--color-border) inline-flex items-center justify-center hover:border-(--color-gold) hover:text-(--color-gold)">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 8.5a7.4 7.4 0 0 1-4.3-1.4v7.6a6 6 0 1 1-6-6 6 6 0 0 1 1 .1v3.2a2.8 2.8 0 1 0 2 2.7V2h3a4.4 4.4 0 0 0 4.3 4.3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hairline my-10" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-(--color-text-muted)">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>{t("Footer.copyright", { year })}</p>
            <span aria-hidden className="hidden sm:inline text-(--color-border)">·</span>
            <Link className="hover:text-(--color-gold) transition-colors" href="/privacy">
              {t("Footer.privacy")}
            </Link>
            <span aria-hidden className="text-(--color-border)">·</span>
            <Link className="hover:text-(--color-gold) transition-colors" href="/terms">
              {t("Footer.terms")}
            </Link>
          </div>
          <p>{t("Footer.builtBy")}</p>
        </div>
      </Container>
    </footer>
  );
}
