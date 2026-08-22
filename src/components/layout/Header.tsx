"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { AudienceSwitch } from "./AudienceSwitch";
import { LocaleSwitch } from "./LocaleSwitch";
import { Container } from "@/components/ui/Container";
import { MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";

export function Header({ audience }: { audience: Audience }) {
  const t = useTranslations("Nav");
  const c = useTranslations("Cta");
  const locale = useLocale() as WALocale;
  const pathname = usePathname();
  // The sheet is "open for" a pathname, so any navigation (including one
  // started from inside the sheet) closes it without needing an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (next: boolean) => setOpenFor(next ? pathname : null);

  const audiencePrefix = `/${audience}`;
  // B2C home lives at the locale root; deeper b2c routes keep the /b2c prefix.
  const homeHref = audience === "b2c" ? "/" : audiencePrefix;

  const links = [
    { href: homeHref, label: t("home") },
    { href: `${audiencePrefix}/products`, label: t("products") },
    ...(audience === "b2c"
      ? [
          { href: "/b2c/services", label: t("services") },
          { href: "/b2c/blog", label: t("blog") },
        ]
      : [{ href: "/b2b/become-a-dealer", label: t("becomeDealer") }]),
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  // Escape closes the sheet; the page behind it stops scrolling while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFor(null);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const waHref = buildWhatsAppUrl({ audience, locale });

  return (
    <header className="sticky top-0 z-40">
      {/* The blur lives on this inner bar, not on <header>: backdrop-filter
          turns an element into the containing block for fixed descendants,
          which would trap the mobile sheet inside the 48px bar. */}
      <div className="nav-glass border-b border-black/8">
      <Container className="flex h-12 items-center justify-between gap-4">
        <Link
          href={homeHref}
          className="flex shrink-0 items-center gap-2.5"
          aria-label={t("home")}
        >
          <Image
            src="/logo-mark.webp"
            alt=""
            width={28}
            height={28}
            loading="eager"
            className="rounded-[7px]"
          />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-(--color-text)">
            ABK
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t("menu")} className="hidden md:flex md:items-center md:gap-7">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== homeHref && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-caption transition-colors duration-200 ease-soft rtl:text-[13px] ${
                  active
                    ? "font-medium text-(--color-text)"
                    : "text-(--color-text)/80 hover:text-(--color-text)"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <AudienceSwitch current={audience} />
          </div>
          <LocaleSwitch current={locale} />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c("whatsAppUs")}
            className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} hidden h-8 w-8 items-center justify-center rounded-full text-(--color-text) transition-colors duration-200 ease-soft hover:bg-(--color-fill) md:inline-flex`}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-(--color-text) transition-colors duration-200 ease-soft hover:bg-(--color-fill) md:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </Container>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-12 bottom-0 overflow-y-auto bg-white md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            <nav aria-label={t("menu")} className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-(--color-border-soft) py-3.5 text-title-sm font-semibold text-(--color-text) last:border-b-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-4 sm:hidden">
              <AudienceSwitch current={audience} />
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} inline-flex h-11 w-fit items-center gap-2 whitespace-nowrap rounded-pill bg-(--color-accent) px-[22px] text-body text-white transition-colors hover:bg-(--color-accent-hover)`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {c("whatsAppUs")}
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
