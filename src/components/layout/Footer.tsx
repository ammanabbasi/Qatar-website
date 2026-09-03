import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";
import type { Audience } from "@/lib/whatsapp";

const SHOP_CATEGORIES = ["ppf", "ceramic", "shampoo", "polish", "tyre"] as const;

export function Footer({ audience }: { audience: Audience }) {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const audiencePrefix = `/${audience}`;
  // B2C home lives at the locale root; deeper b2c routes keep the /b2c prefix.
  const homeHref = audience === "b2c" ? "/" : audiencePrefix;

  const linkCls =
    "text-caption text-(--color-text-muted) transition-colors duration-200 ease-soft hover:text-(--color-text) hover:underline underline-offset-2";
  const headCls = "text-caption font-semibold text-(--color-text)";

  return (
    <footer className="mt-24 border-t border-(--color-border) bg-(--color-bg)">
      <Container className="py-6">
        <p className="max-w-3xl text-caption text-(--color-text-muted)">
          {t("Footer.tagline")}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-(--color-border) pt-6 md:grid-cols-3">
          {/* Shop */}
          <div className="flex flex-col gap-2.5">
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

          {/* Company */}
          <div className="flex flex-col gap-2.5">
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

          {/* Visit */}
          <div className="flex flex-col gap-2.5">
            <h3 className={headCls}>{t("Footer.visitUs")}</h3>
            <address className="flex flex-col gap-2.5 text-caption not-italic text-(--color-text-muted)">
              <p>{t("Contact.addressValue")}</p>
              <p>
                <span className="text-(--color-text)">{t("Contact.hoursSatToThu")}</span>{" "}
                <span className="ltr-nums">
                  {SITE.hours.weekdaysMorning} · {SITE.hours.weekdaysEvening}
                </span>
                <br />
                <span className="text-(--color-text)">{t("Contact.hoursFri")}</span>{" "}
                {t("Contact.hoursClosed")}
              </p>
              <a className={`${linkCls} ltr-nums`} href={`tel:${SITE.phoneE164}`}>
                {SITE.phone}
              </a>
              <a className={`${linkCls} ltr-nums`} href={`tel:${SITE.phoneLandlineE164}`}>
                {SITE.phoneLandline}
              </a>
              <a className={linkCls} href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </address>
            <div className="mt-1 flex gap-4">
              <a className={linkCls} href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a className={linkCls} href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a className={linkCls} href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-(--color-border) pt-4 text-caption text-(--color-text-muted) sm:flex-row sm:items-center sm:justify-between">
          <p>{t("Footer.copyright", { year })}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link className={linkCls} href="/privacy">
              {t("Footer.privacy")}
            </Link>
            <span aria-hidden className="text-(--color-border)">|</span>
            <Link className={linkCls} href="/terms">
              {t("Footer.terms")}
            </Link>
            <span aria-hidden className="text-(--color-border)">|</span>
            <span>{t("Footer.builtBy")}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
