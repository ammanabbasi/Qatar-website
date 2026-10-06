"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitch } from "./LocaleSwitch";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, BagIcon, MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { HEADER_CART_BUTTON_ID, useCartUi } from "@/components/cart/CartProvider";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { findProduct, formatNumber, formatQar } from "@/lib/pricing";
import { installedFromQar } from "@/lib/ppfOffer";

/** The one standout retail item: professionally installed PPF. */
const PPF_HREF = "/b2c/ppf-installation";

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
  const tp = useTranslations("PpfPromo");
  const tc = useTranslations("Cart");
  const tt = useTranslations("Tray");
  const isRetail = audience === "b2c";
  // Retail says "Cart"; wholesale keeps its quote-tray wording.
  const cartLabel = isRetail ? tc("open", { count }) : tt("open", { count });
  const badge = count > 99 ? "99+" : formatNumber(count, locale);

  const ppfFrom = installedFromQar("pro");
  const homeHref = "/";

  const links = [
    { href: "/", label: t("home") },
    { href: "/b2c/products", label: t("products") },
    { href: PPF_HREF, label: t("ppfInstall") },
    { href: "/b2c/blog", label: t("blog") },
    { href: "/b2b/become-a-dealer", label: t("becomeDealer") },
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
              alt="ABK Trading & Service — Car Care & PPF Qatar"
              width={452}
              height={305}
              loading="eager"
              className="h-7 w-auto"
            />
          ) : (
            <>
              <Image
                src="/logo-mark.webp"
                alt="ABK Trading & Service"
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
        <nav aria-label={t("menu")} className="hidden md:flex md:items-center md:gap-3 lg:gap-7">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== homeHref && pathname.startsWith(link.href));
            if (link.href === PPF_HREF) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group/ppf inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-pill border px-2.5 text-caption font-semibold transition-colors duration-200 ease-soft rtl:text-[13px] lg:ps-3 lg:pe-1.5 ${
                    active
                      ? "border-(--color-brand) bg-(--color-brand) text-black"
                      : dark
                        ? "border-(--color-brand)/55 bg-(--color-brand)/12 text-(--color-brand) hover:bg-(--color-brand)/22"
                        : "border-(--color-ink) bg-(--color-ink) text-white hover:bg-black"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`hidden rounded-pill px-1.5 py-px text-[10px] font-bold uppercase leading-[1.5] tracking-[0.08em] lg:inline ${
                      active ? "bg-black/85 text-(--color-brand)" : "bg-(--color-brand) text-black"
                    }`}
                  >
                    {tp("newTag")}
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap text-caption transition-colors duration-200 ease-soft rtl:text-[13px] ${
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
            {isRetail && (
              <Link
                href={PPF_HREF}
                onClick={() => setOpen(false)}
                className="group/ppf relative isolate flex min-h-[72px] items-center justify-between gap-3 overflow-hidden rounded-2xl bg-(--color-tile-dark) p-4 text-white ring-1 ring-inset ring-(--color-brand)/45"
              >
                <span aria-hidden className="ppf-blueprint absolute inset-0 -z-10" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-(--color-brand)">
                    <span className="rounded-pill bg-(--color-brand) px-1.5 py-px text-[10px] leading-[1.5] tracking-[0.08em] text-black">
                      {tp("newTag")}
                    </span>
                    {tp("menuEyebrow")}
                  </span>
                  <span className="mt-1 block text-title-sm font-bold">{t("ppfInstall")}</span>
                  {ppfFrom !== null && (
                    <span className="mt-0.5 block text-footnote text-white/65">
                      {tp("menuSub", { price: formatQar(ppfFrom, locale) })}
                    </span>
                  )}
                </span>
                <ArrowRightIcon className="h-5 w-5 shrink-0 text-(--color-brand) transition-transform duration-200 ease-soft group-hover/ppf:translate-x-0.5 rtl:rotate-180 rtl:group-hover/ppf:-translate-x-0.5" />
              </Link>
            )}



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
              {links.filter((link) => link.href !== PPF_HREF).map((link) => (
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
