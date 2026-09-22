"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useOrderTray, OPEN_TRAY_EVENT } from "@/lib/orderTray";
import {
  buildTrayWhatsAppUrl,
  type Audience,
  type WALocale,
} from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { CloseIcon } from "@/components/ui/Icons";

type Props = {
  audience: Audience;
  locale: WALocale;
};

export function OrderTray({ audience, locale }: Props) {
  const t = useTranslations("Tray");
  const { items, count, updateQuantity, removeItem, clear, mounted } =
    useOrderTray();
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");

  // Listen for programmatic open events (e.g. from header or PDP)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_TRAY_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_TRAY_EVENT, handleOpen);
  }, []);

  // Close sheet on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  if (!mounted || count === 0) return null;

  const isB2b = audience === "b2b";
  const whatsappUrl = buildTrayWhatsAppUrl({
    items,
    audience,
    locale,
    companyName: isB2b ? companyName : undefined,
    notes,
  });

  return (
    <>
      {/* Floating Tray Trigger Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t("title")}
        aria-expanded={isOpen}
        className="fixed bottom-[4.75rem] end-5 z-30 flex items-center gap-2 rounded-full border border-black/10 bg-(--color-ink) px-4 py-2.5 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-black/90 active:scale-95"
      >
        <span className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-5 w-5 text-(--color-brand)"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-brand) text-[11px] font-bold text-black shadow-xs">
            {count}
          </span>
        </span>
        <span className="hidden text-footnote font-semibold sm:inline">
          {t("title")}
        </span>
      </button>

      {/* Slide-over Sheet / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
          {/* Backdrop Click */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-[#151517] dark:text-white"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-4 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-brand)/15 text-(--color-brand-deep)">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-title-sm font-bold text-(--color-text) dark:text-white">
                    {t("title")}
                  </h2>
                  <span className="text-caption text-(--color-text-muted)">
                    {count} {count === 1 ? t("itemUnit") : t("itemsUnits")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t("close")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-text-muted) transition-colors hover:bg-black/5 hover:text-(--color-text) dark:hover:bg-white/10"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="bg-amber-500/10 px-6 py-2.5 text-footnote font-medium text-amber-900 dark:text-amber-300">
              {isB2b ? t("subtitleB2b") : t("subtitleB2c")}
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/5 text-(--color-text-muted) dark:bg-white/5">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </span>
                  <p className="mt-3 text-body font-semibold">{t("emptyTitle")}</p>
                  <p className="mt-1 max-w-xs text-footnote text-(--color-text-muted)">
                    {t("emptyDesc")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-black/6 dark:divide-white/8">
                  {items.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center gap-3.5 py-3.5"
                    >
                      {item.image ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/6 bg-white p-1 dark:border-white/10 dark:bg-white/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-black/5 text-caption font-bold uppercase text-(--color-text-muted)">
                          {item.brand}
                        </div>
                      )}

                      <div className="flex flex-1 flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-(--color-brand-deep)">
                          {item.brand}
                        </span>
                        <h3 className="line-clamp-2 text-footnote font-semibold text-(--color-text) dark:text-white">
                          {item.name}
                        </h3>
                        {item.price && (
                          <span className="mt-0.5 text-caption font-medium text-(--color-text-muted)">
                            {item.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-pill border border-black/10 bg-black/4 p-0.5 dark:border-white/12 dark:bg-white/8">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full text-caption font-bold text-(--color-text) hover:bg-black/10 dark:text-white dark:hover:bg-white/10"
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="w-6 text-center text-footnote font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full text-caption font-bold text-(--color-text) hover:bg-black/10 dark:text-white dark:hover:bg-white/10"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          className="text-caption text-red-500 hover:text-red-700"
                          aria-label={t("remove")}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Context inputs */}
              {items.length > 0 && (
                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-black/6 bg-black/2 p-4 dark:border-white/8 dark:bg-white/4">
                  {isB2b && (
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
                        {t("companyNamePlaceholder")}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Al Rayyan Detailing Studio"
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-footnote text-(--color-text) outline-hidden focus:border-(--color-brand) dark:border-white/15 dark:bg-white/8 dark:text-white"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
                      {isB2b ? t("notesPlaceholderB2b") : t("notesPlaceholderB2c")}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        isB2b
                          ? "Specify roll counts or delivery requests..."
                          : "Enter pickup or delivery notes..."
                      }
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-footnote text-(--color-text) outline-hidden focus:border-(--color-brand) dark:border-white/15 dark:bg-white/8 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sheet Footer */}
            {items.length > 0 && (
              <div className="border-t border-black/8 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#151517]">
                <div className="mb-3 flex items-center justify-between text-footnote font-semibold">
                  <span>{t("totalItems")}</span>
                  <span className="text-title-sm text-(--color-brand-deep)">
                    {count} {count === 1 ? t("itemUnit") : t("itemsUnits")}
                  </span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-(--color-brand) px-6 py-3.5 text-body font-bold text-black shadow-md transition-colors hover:bg-(--color-brand-hover) active:scale-[0.99]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>{isB2b ? t("sendQuoteB2b") : t("sendOrderB2c")}</span>
                </a>

                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={clear}
                    className="text-caption font-medium text-(--color-text-muted) hover:text-red-600 transition-colors"
                  >
                    {t("clear")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
