"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { AlertIcon, BagIcon, CloseIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import {
  clearQuoteTray,
  reopenCart,
  startNewOrder,
  updateQuoteDetails,
  useCart,
  useCheckoutDetails,
  useQuoteDetails,
} from "@/lib/cart";
import { cartTotals, findProduct, formatQar, resolveCartLines } from "@/lib/pricing";
import { buildQuoteTrayWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";
import { useCartUi } from "./CartProvider";
import { CartLineItem } from "./CartLineItem";
import { DeliveryProgress } from "./DeliveryProgress";
import { RemovedNotice, useRemoveWithUndo } from "./useRemoveWithUndo";

/**
 * Mini-cart. Retail: quick review + "Checkout" to the cart page, where the
 * pickup/delivery step and the WhatsApp hand-off live. Wholesale keeps its
 * original quote tray: lines, company name, notes, WhatsApp quote request.
 */
export function CartDrawer() {
  const { audience, drawerOpen, closeDrawer } = useCartUi();
  const titleId = useId();
  if (!drawerOpen) return null;
  return (
    <DrawerDialog titleId={titleId} onClose={closeDrawer}>
      {audience === "b2c" ? (
        <RetailDrawer titleId={titleId} onClose={closeDrawer} />
      ) : (
        <QuoteDrawer titleId={titleId} onClose={closeDrawer} />
      )}
    </DrawerDialog>
  );
}

// ───── Dialog shell: scrim, focus trap, Escape, scroll lock ────────────────

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && el.getAttribute("aria-hidden") !== "true",
  );
}

function lockPageScroll(): () => void {
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;
  };
}

function DrawerDialog({
  titleId,
  onClose,
  children,
}: {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const unlock = lockPageScroll();
    (panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusablesIn(panel);
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div aria-hidden className="cart-scrim absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="cart-drawer relative flex h-full w-full max-w-md flex-col bg-(--color-bg) shadow-paddle outline-none"
      >
        {children}
      </div>
    </div>
  );
}

function DrawerHeader({
  titleId,
  title,
  subtitle,
  closeLabel,
  onClose,
}: {
  titleId: string;
  title: string;
  subtitle?: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-(--color-border-soft) bg-(--color-surface) py-3 ps-5 pe-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-brand)/15 text-(--color-brand-deep)">
          <BagIcon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <h2 id={titleId} className="truncate text-body font-semibold text-(--color-text)">
            {title}
          </h2>
          {subtitle ? <p className="text-caption text-(--color-text-muted)">{subtitle}</p> : null}
        </div>
      </div>
      <button
        type="button"
        data-autofocus
        onClick={onClose}
        aria-label={closeLabel}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors duration-150 ease-soft hover:bg-(--color-fill) hover:text-(--color-text) active:bg-(--color-fill-hover)"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function StorageNotice() {
  const t = useTranslations("Cart");
  return (
    <p className="flex items-start gap-2 bg-(--color-brand)/15 px-5 py-2.5 text-caption text-(--color-text)">
      <AlertIcon className="mt-px h-4 w-4 shrink-0 text-(--color-brand-deep)" />
      {t("storageBlocked")}
    </p>
  );
}

// ───── Retail mini-cart ─────────────────────────────────────────────────────

function RetailDrawer({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const t = useTranslations("Cart");
  const { catalogue, locale } = useCartUi();
  const cart = useCart("b2c");
  const details = useCheckoutDetails();
  const { removed, remove, undo, setPaused } = useRemoveWithUndo("b2c");
  const lines = resolveCartLines(cart.lines, catalogue);
  const totals = cartTotals(lines);
  const removedName = removed ? findProduct(catalogue, removed.slug)?.name[locale] : undefined;

  return (
    <>
      <DrawerHeader
        titleId={titleId}
        title={t("title")}
        subtitle={lines.length > 0 ? t("items", { count: totals.units }) : undefined}
        closeLabel={t("close")}
        onClose={onClose}
      />
      {!cart.storageAvailable ? <StorageNotice /> : null}
      {cart.sentAt !== null && lines.length > 0 ? (
        // The order already went to WhatsApp: say so, and make "new order vs
        // add to the same order" an explicit choice.
        <div className="flex flex-col gap-2.5 border-b border-(--color-border-soft) bg-(--color-brand)/10 px-5 py-3.5">
          <p className="flex items-start gap-2 text-footnote text-(--color-text)">
            <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
            {t("sentDrawerNotice", { ref: cart.ref ?? "" })}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startNewOrder}
              className={`${buttonClasses("primary", "sm")} font-semibold`}
            >
              {t("sentNewOrder")}
            </button>
            <button
              type="button"
              onClick={() => reopenCart("b2c")}
              className={buttonClasses("light", "sm")}
            >
              {t("keepEditing")}
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-5">
        {removed && removedName ? (
          <div className="pt-4">
            <RemovedNotice
              name={removedName}
              noticeId={removed.id}
              onUndo={undo}
              onFocusWithin={setPaused}
            />
          </div>
        ) : null}
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text-muted)">
              <BagIcon className="h-7 w-7" />
            </span>
            <p className="text-body font-semibold text-(--color-text)">{t("emptyTitle")}</p>
            <p className="max-w-xs text-footnote text-(--color-text-muted)">{t("emptyDesc")}</p>
            <Link
              href="/b2c/products"
              onClick={onClose}
              className={`${buttonClasses("primary", "md")} mt-2 font-semibold`}
            >
              {t("emptyCta")}
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-(--color-border-soft)">
            {lines.map((line) => (
              <CartLineItem
                key={line.slug}
                line={line}
                audience="b2c"
                locale={locale}
                showPrices
                onRemove={remove}
                onNavigate={onClose}
              />
            ))}
          </ul>
        )}
      </div>

      {lines.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-(--color-border-soft) bg-(--color-surface) p-5">
          {totals.pricedLines > 0 ? (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-footnote text-(--color-text-muted)">
                {t("subtotalPriced", { count: totals.pricedLines })}
              </span>
              <span className="text-body font-semibold tabular-nums text-(--color-text)">
                {formatQar(totals.pricedSubtotal, locale)}
              </span>
            </div>
          ) : null}
          {totals.unpricedLines > 0 ? (
            <p className="text-caption text-(--color-text-muted)">
              {t("unpricedNote", { count: totals.unpricedLines })}
            </p>
          ) : null}
          {details.fulfilment === "delivery" ? (
            <DeliveryProgress totals={totals} locale={locale} />
          ) : null}
          <Link
            href="/b2c/cart"
            onClick={onClose}
            className={`${buttonClasses("primary", "lg")} w-full font-semibold active:bg-(--color-brand-deep) active:text-white`}
          >
            {t("checkout")}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-pill text-footnote font-medium text-(--color-link) transition-colors duration-150 ease-soft hover:bg-(--color-fill)"
          >
            {t("continueShopping")}
          </button>
        </div>
      ) : null}
    </>
  );
}

// ───── Wholesale quote tray (behaviour and message unchanged) ───────────────

function QuoteDrawer({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const t = useTranslations("Tray");
  const { catalogue, locale } = useCartUi();
  const cart = useCart("b2b");
  // Stored, so closing the tray to change a quantity doesn't wipe them.
  const { companyName, notes } = useQuoteDetails();
  const { removed, remove, undo, setPaused } = useRemoveWithUndo("b2b");
  const lines = resolveCartLines(cart.lines, catalogue);
  const units = lines.reduce((sum, l) => sum + l.qty, 0);
  const removedName = removed ? findProduct(catalogue, removed.slug)?.name[locale] : undefined;

  const whatsappUrl = buildQuoteTrayWhatsAppUrl({
    items: lines.map((l) => ({
      name: l.product.name[locale],
      quantity: l.qty,
      url: `${SITE.url}/${locale}/b2b/products/${l.slug}`,
    })),
    locale,
    companyName,
    notes,
  });

  const field =
    "mt-1.5 w-full rounded-xl bg-(--color-surface) px-3.5 py-2.5 text-footnote text-(--color-text) shadow-[0_0_0_1px_var(--color-border)] placeholder:text-(--color-text-subtle) focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-(--color-brand-deep)";

  return (
    <>
      <DrawerHeader
        titleId={titleId}
        title={t("title")}
        subtitle={lines.length > 0 ? t("units", { count: units }) : undefined}
        closeLabel={t("close")}
        onClose={onClose}
      />
      <p className="bg-(--color-brand)/15 px-5 py-2.5 text-caption font-medium text-(--color-text)">
        {t("subtitleB2b")}
      </p>
      {!cart.storageAvailable ? <StorageNotice /> : null}

      <div className="flex-1 overflow-y-auto px-5">
        {removed && removedName ? (
          <div className="pt-4">
            <RemovedNotice
              name={removedName}
              noticeId={removed.id}
              onUndo={undo}
              onFocusWithin={setPaused}
            />
          </div>
        ) : null}
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text-muted)">
              <BagIcon className="h-7 w-7" />
            </span>
            <p className="text-body font-semibold text-(--color-text)">{t("emptyTitle")}</p>
            <p className="max-w-xs text-footnote text-(--color-text-muted)">{t("emptyDesc")}</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-(--color-border-soft)">
              {lines.map((line) => (
                <CartLineItem
                  key={line.slug}
                  line={line}
                  audience="b2b"
                  locale={locale}
                  showPrices={false}
                  onRemove={remove}
                  onNavigate={onClose}
                />
              ))}
            </ul>
            <div className="mb-5 flex flex-col gap-3 rounded-tile bg-(--color-surface) p-4 shadow-[0_0_0_1px_var(--color-border-soft)]">
              <label className="block text-caption font-semibold text-(--color-text)">
                {t("companyNamePlaceholder")}
                <input
                  type="text"
                  value={companyName}
                  maxLength={120}
                  onChange={(e) => updateQuoteDetails({ companyName: e.target.value })}
                  placeholder={t("companyNameExample")}
                  autoComplete="organization"
                  className={field}
                />
              </label>
              <label className="block text-caption font-semibold text-(--color-text)">
                {t("notesPlaceholderB2b")}
                <textarea
                  rows={2}
                  value={notes}
                  maxLength={300}
                  onChange={(e) => updateQuoteDetails({ notes: e.target.value })}
                  placeholder={t("notesExampleB2b")}
                  className={field}
                />
              </label>
            </div>
          </>
        )}
      </div>

      {lines.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-(--color-border-soft) bg-(--color-surface) p-5">
          <div className="flex items-baseline justify-between text-footnote font-semibold text-(--color-text)">
            <span>{t("totalItems")}</span>
            <span className="text-(--color-brand-deep)">{t("units", { count: units })}</span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-item-count={units}
            data-placement="quote-tray"
            className={`plausible-event-name=cart_whatsapp_send plausible-event-audience=b2b ${buttonClasses("primary", "lg")} w-full font-semibold`}
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t("sendQuoteB2b")}
          </a>
          <button
            type="button"
            onClick={clearQuoteTray}
            className="inline-flex h-10 items-center justify-center rounded-pill text-caption font-medium text-(--color-text-muted) transition-colors duration-150 ease-soft hover:bg-(--color-fill) hover:text-(--color-danger)"
          >
            {t("clear")}
          </button>
        </div>
      ) : null}
    </>
  );
}
