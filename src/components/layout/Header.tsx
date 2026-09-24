"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { AudienceSwitch } from "./AudienceSwitch";
import { LocaleSwitch } from "./LocaleSwitch";
import { Container } from "@/components/ui/Container";
import { BagIcon, MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { HEADER_CART_BUTTON_ID, useCartUi } from "@/components/cart/CartProvider";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { findProduct, formatNumber } from "@/lib/pricing";

export function Header({
  audience,
  tone = "light",
}: {
  audience: Audience;
  /** "dark" pairs the glass bar with the dark homepage hero. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const t = useTranslations("Nav");
  const c = useTranslations("Cta");
  const locale = useLocale() as WALocale;
  const pathname = usePathname();
  // The sheet is "open for" a pathname, so any navigation (including one
  // started from inside the sheet) closes it without needing an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (next: boolean) => setOpenFor(next ? pathname : null);
  const { lines: cartLines, hydrated } = useCart(audience);
  const { openDrawer, drawerOpen, catalogue } = useCartUi();
  // Only lines whose product still exists count (the provider prunes the rest).
  const count = cartLines.reduce(
    (sum, l) => sum + (findProduct(catalogue, l.slug) ? l.qty : 0),
    0,
  );
  const tc = useTranslations("Cart");
  const tt = useTranslations("Tray");
  const isRetail = audience === "b2c";
  // Retail says "Cart"; wholesale keeps its quote-tray wording.
  const cartLabel = isRetail ? tc("open", { count }) : tt("open", { count });
  const badge = count > 99 ? "99+" : formatNumber(count, locale);

  const audiencePrefix = `/${audience}`;
  // B2C home lives at the locale root; deeper b2c routes keep the /b2c prefix.
  const homeHref = audience === "b2c" ? "/" : audiencePrefix;

  const links = [
    { href: homeHref, label: t("home") },
    { href: `${audiencePrefix}/products`, label: t("products") },
    ...(audience === "b2c"
      ? [
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
      <div
        className={
          dark
            ? "nav-glass-dark border-b border-white/10"
            : "nav-glass border-b border-black/8"
        }
      >
      <Container className="flex h-12 items-center justify-between gap-4">
        <Link
          href={homeHref}
          className="flex shrink-0 items-center gap-2.5"
          aria-label={t("home")}
        >
          {dark ? (
            // Transparent wordmark (white letters + gold swoosh keyed out of
            // the studio logo) — the baked-background tile would show as a
            // grey box on the dark glass, and its own "ABK" letters would
            // duplicate the text label.
            <Image
              src="/logo-dark.webp"
              alt=""
              width={452}
              height={305}
              loading="eager"
              className="h-7 w-auto"
            />
          ) : (
            <>
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
            </>
          )}
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
                    ? `font-medium ${dark ? "text-white" : "text-(--color-text)"}`
                    : dark
                      ? "text-white/75 hover:text-white"
                      : "text-(--color-text)/80 hover:text-(--color-text)"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <AudienceSwitch current={audience} tone={tone} />
          <LocaleSwitch current={locale} tone={tone} />
          {/* Always visible — shoppers look top-right for the cart. The badge
              waits for hydration so the server HTML never shows a stale 0. */}
          <button
            type="button"
            id={HEADER_CART_BUTTON_ID}
            onClick={openDrawer}
            aria-label={cartLabel}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ease-soft ${
              dark
                ? "text-white hover:bg-white/12 active:bg-white/20"
                : "text-(--color-text) hover:bg-(--color-fill) active:bg-(--color-fill-hover)"
            }`}
          >
            <BagIcon className="h-[19px] w-[19px]" />
            {hydrated && count > 0 ? (
              <span
                aria-hidden
                className="absolute -top-1 -end-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--color-brand) px-1 text-[11px] font-bold leading-none text-(--color-ink) tabular-nums"
              >
                {badge}
              </span>
            ) : null}
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c("whatsAppUs")}
            className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} hidden h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ease-soft md:inline-flex ${
              dark
                ? "text-white hover:bg-white/10"
                : "text-(--color-text) hover:bg-(--color-fill)"
            }`}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ease-soft md:hidden ${
              dark
                ? "text-white hover:bg-white/10"
                : "text-(--color-text) hover:bg-(--color-fill)"
            }`}
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
          className={`fixed inset-x-0 top-12 bottom-0 overflow-y-auto md:hidden ${
            dark ? "bg-(--color-hero-dark)" : "bg-white"
          }`}
        >
          <Container className="flex flex-col gap-3 py-4">
            {/* Experience Selector Card */}
            <div
              className={`rounded-2xl border p-3 ${
                dark
                  ? "border-white/12 bg-white/5 text-white"
                  : "border-black/8 bg-(--color-fill) text-(--color-text)"
              }`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--color-brand)">
                {t("chooseExperience")}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  onClick={() => {
                    document.cookie = `abk_audience=b2c; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
                    setOpen(false);
                  }}
                  className={`flex flex-col items-start rounded-xl p-2.5 transition-all ${
                    audience === "b2c"
                      ? "bg-(--color-brand) text-black shadow-sm font-bold"
                      : dark
                        ? "bg-white/8 text-white hover:bg-white/12"
                        : "bg-white text-(--color-text) hover:bg-white/80"
                  }`}
                >
                  <span className="text-body font-bold">{t("b2c")}</span>
                  <span
                    className={`text-[11px] mt-0.5 ${
                      audience === "b2c" ? "text-black/75 font-medium" : dark ? "text-white/60" : "text-(--color-text-muted)"
                    }`}
                  >
                    {t("b2cSubtitle")}
                  </span>
                </Link>
                <Link
                  href="/b2b"
                  onClick={() => {
                    document.cookie = `abk_audience=b2b; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
                    setOpen(false);
                  }}
                  className={`flex flex-col items-start rounded-xl p-2.5 transition-all ${
                    audience === "b2b"
                      ? "bg-(--color-brand) text-black shadow-sm font-bold"
                      : dark
                        ? "bg-white/8 text-white hover:bg-white/12"
                        : "bg-white text-(--color-text) hover:bg-white/80"
                  }`}
                >
                  <span className="text-body font-bold">{t("b2b")}</span>
                  <span
                    className={`text-[11px] mt-0.5 ${
                      audience === "b2b" ? "text-black/75 font-medium" : dark ? "text-white/60" : "text-(--color-text-muted)"
                    }`}
                  >
                    {t("b2bSubtitle")}
                  </span>
                </Link>
              </div>
            </div>

            {hydrated && count > 0 && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openDrawer();
                }}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-start font-semibold transition-all ${
                  dark
                    ? "border-(--color-brand)/40 bg-(--color-brand)/10 text-white"
                    : "border-(--color-brand)/40 bg-(--color-brand)/10 text-(--color-text)"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-brand) text-(--color-ink)">
                    <BagIcon className="h-4 w-4" />
                  </span>
                  <span className="text-footnote font-bold">
                    {isRetail ? tc("viewCart") : tt("title")}
                  </span>
                </div>
                <span className="rounded-full bg-(--color-brand) px-2 py-0.5 text-caption font-bold text-(--color-ink)">
                  {isRetail ? tc("items", { count }) : tt("units", { count })}
                </span>
              </button>
            )}

            <nav aria-label={t("menu")} className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-title-sm font-semibold last:border-b-0 ${
                    dark
                      ? "border-b border-white/10 text-white"
                      : "border-b border-(--color-border-soft) text-(--color-text)"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-(--color-brand) px-[22px] text-body font-bold text-black transition-colors hover:bg-(--color-brand-hover)`}
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
