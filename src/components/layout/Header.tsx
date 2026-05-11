"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { AudienceSwitch } from "./AudienceSwitch";
import { LocaleSwitch } from "./LocaleSwitch";
import type { Audience } from "@/lib/whatsapp";

export function Header({ audience }: { audience: Audience }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const audiencePrefix = `/${audience}`;

  const links = [
    { href: audiencePrefix, label: t("home") },
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

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-(--color-bg)/85 border-b border-(--color-border)">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 h-16 md:h-20">
          <Link href={audiencePrefix} className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo-mark.webp"
              alt="ABK"
              width={40}
              height={40}
              priority
              className="rounded-lg"
            />
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base tracking-wide">
                ABK <span className="text-(--color-gold)">Trading</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-(--color-text-muted)">
                & Service
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== audiencePrefix && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    active
                      ? "text-(--color-gold)"
                      : "text-(--color-text) hover:text-(--color-gold)"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <AudienceSwitch current={audience} />
            </div>
            <LocaleSwitch current={locale as "en" | "ar"} />
            <button
              type="button"
              aria-label={t("menu")}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-(--color-border) hover:border-(--color-gold)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-5 border-t border-(--color-border) flex flex-col gap-4">
            <div className="sm:hidden">
              <AudienceSwitch current={audience} />
            </div>
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-base text-(--color-text) hover:text-(--color-gold)"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
