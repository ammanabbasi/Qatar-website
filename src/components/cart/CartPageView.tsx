"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { AlertIcon, BagIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import type { CartProduct } from "@/data/cartCatalogue";
import {
  getCart,
  reopenCart,
  startNewOrder,
  useCart,
  useCheckoutDetails,
} from "@/lib/cart";
import { cartTotals, findProduct, resolveCartLines } from "@/lib/pricing";
import { suggestAddOns } from "@/lib/suggestions";
import { gaItem, trackCartEvent } from "@/lib/analytics";
import { useCartUi } from "./CartProvider";
import { CartLineItem } from "./CartLineItem";
import { CartSuggestionCard } from "./CartSuggestionCard";
import { CheckoutPanel } from "./CheckoutPanel";
import { RemovedNotice, useRemoveWithUndo } from "./useRemoveWithUndo";

/**
 * /[locale]/b2c/cart — review, the single checkout step, and the WhatsApp
 * hand-off. Everything renders client-side from localStorage, so the page
 * shows a skeleton until the stored cart has loaded rather than flashing
 * "Your cart is empty" at someone who has a full cart.
 */
export function CartPageView({ popularSlugs }: { popularSlugs: string[] }) {
  const t = useTranslations("Cart");
  const { catalogue, locale } = useCartUi();
  const cart = useCart("b2c");
  const details = useCheckoutDetails();
  const { removed, remove, undo, setPaused } = useRemoveWithUndo("b2c");

  const lines = resolveCartLines(cart.lines, catalogue);
  const totals = cartTotals(lines);
  const removedName = removed ? findProduct(catalogue, removed.slug)?.name[locale] : undefined;

  const mode = !cart.hydrated
    ? "loading"
    : cart.sentAt !== null && lines.length > 0
      ? "sent"
      : lines.length === 0
        ? "empty"
        : "items";

  // When the view swaps (Send → "Order sent?", "Start a new order" → empty,
  // "Back to my cart" → items), the control that had focus disappears. Move
  // focus to the new view's heading instead of letting it fall to <body>.
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousMode = useRef(mode);
  useEffect(() => {
    const previous = previousMode.current;
    previousMode.current = mode;
    if (previous === "loading" || previous === mode) return;
    const active = document.activeElement;
    if (active && active !== document.body && document.contains(active)) return;
    const target =
      bodyRef.current?.querySelector<HTMLElement>("[data-view-heading]") ?? headingRef.current;
    target?.focus();
  }, [mode]);

  // view_cart once per visit, after the stored cart has loaded.
  const viewTracked = useRef(false);
  useEffect(() => {
    if (!cart.hydrated || viewTracked.current) return;
    viewTracked.current = true;
    const current = resolveCartLines(getCart("b2c").lines, catalogue);
    trackCartEvent(
      "view_cart",
      current.map((l) => gaItem(l.product, l.qty)),
    );
  }, [cart.hydrated, catalogue]);

  const notice =
    removed && removedName ? (
      <RemovedNotice
        name={removedName}
        noticeId={removed.id}
        onUndo={undo}
        onFocusWithin={setPaused}
      />
    ) : null;

  let body: ReactNode;
  if (mode === "loading") {
    body = <CartSkeleton label={t("loading")} />;
  } else if (mode === "sent") {
    body = <SentPanel orderRef={cart.ref ?? ""} />;
  } else if (mode === "empty") {
    const popular = popularSlugs
      .map((slug) => findProduct(catalogue, slug))
      .filter((p): p is CartProduct => p !== undefined)
      .slice(0, 8);
    body = <EmptyCart popular={popular} notice={notice} />;
  } else {
    const suggestions = suggestAddOns(lines, catalogue, totals.pricedSubtotal, popularSlugs);
    body = (
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-8">
          <section aria-labelledby="cart-items" className="tile px-4 sm:px-6">
            <h2 id="cart-items" className="sr-only">
              {t("itemsTitle")}
            </h2>
            {notice ? <div className="pt-4">{notice}</div> : null}
            <ul className="divide-y divide-(--color-border-soft)">
              {lines.map((line) => (
                <CartLineItem
                  key={line.slug}
                  line={line}
                  audience="b2c"
                  locale={locale}
                  showPrices
                  onRemove={remove}
                />
              ))}
            </ul>
          </section>

          {suggestions.length > 0 ? (
            <section aria-labelledby="cart-addons">
              <h2 id="cart-addons" className="text-title-sm font-semibold text-(--color-text)">
                {t("addOnsTitle")}
              </h2>
              <div className="hide-scrollbar -mx-6 mt-4 flex gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0">
                {suggestions.map((s) => (
                  <CartSuggestionCard
                    key={s.product.slug}
                    product={s.product}
                    locale={locale}
                    badge={s.unlocksFreeDelivery ? t("unlocksFree") : undefined}
                    className="w-44 shrink-0"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <CheckoutPanel
          lines={lines}
          totals={totals}
          details={details}
          orderRef={cart.ref ?? ""}
        />
      </div>
    );
  }

  return (
    <section className="pb-16 pt-8 sm:pb-20 sm:pt-12">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-headline font-bold tracking-tight text-(--color-text) focus:outline-none"
          >
            {t("heading")}
          </h1>
          {cart.hydrated && lines.length > 0 && cart.sentAt === null ? (
            <p className="text-footnote text-(--color-text-muted)">
              {t("items", { count: totals.units })}
              {cart.ref ? (
                <>
                  {" · "}
                  {t("orderRef")}{" "}
                  <span className="ltr-nums font-semibold text-(--color-text)">{cart.ref}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>

        {cart.hydrated && !cart.storageAvailable ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-(--color-brand)/15 px-4 py-3 text-footnote text-(--color-text)">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-deep)" />
            {t("storageBlocked")}
          </p>
        ) : null}

        <div ref={bodyRef} className="mt-6 sm:mt-8">
          {body}
        </div>
      </Container>
    </section>
  );
}

function CartSkeleton({ label }: { label: string }) {
  return (
    <div role="status" className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
      <span className="sr-only">{label}</span>
      <div aria-hidden className="tile flex flex-col gap-5 p-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-(--color-fill)" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
              <div className="h-3 w-1/4 animate-pulse rounded-full bg-(--color-fill)" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-(--color-fill)" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-(--color-fill)" />
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden className="tile h-80 animate-pulse" />
    </div>
  );
}

function EmptyCart({ popular, notice }: { popular: CartProduct[]; notice: ReactNode }) {
  const t = useTranslations("Cart");
  const { locale } = useCartUi();
  return (
    <div className="flex flex-col gap-10">
      {notice}
      <div className="tile flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text-muted)">
          <BagIcon className="h-7 w-7" />
        </span>
        <h2
          data-view-heading
          tabIndex={-1}
          className="text-title-sm font-semibold text-(--color-text) focus:outline-none"
        >
          {t("emptyTitle")}
        </h2>
        <p className="max-w-sm text-footnote text-(--color-text-muted)">{t("emptyDesc")}</p>
        <Link href="/b2c/products" className={`${buttonClasses("primary", "md")} mt-2 font-semibold`}>
          {t("emptyCta")}
        </Link>
      </div>
      {popular.length > 0 ? (
        <section aria-labelledby="cart-popular">
          <h2 id="cart-popular" className="text-title-sm font-semibold text-(--color-text)">
            {t("popularTitle")}
          </h2>
          <div className="hide-scrollbar -mx-6 mt-4 flex gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0">
            {popular.map((product) => (
              <CartSuggestionCard
                key={product.slug}
                product={product}
                locale={locale}
                className="w-44 shrink-0"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SentPanel({ orderRef }: { orderRef: string }) {
  const t = useTranslations("Cart");
  return (
    <div className="tile mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-10 text-center sm:px-10">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-(--color-brand)/15 text-(--color-brand-deep)">
        <WhatsAppIcon className="h-7 w-7" />
      </span>
      <h2
        data-view-heading
        tabIndex={-1}
        className="text-title font-semibold text-(--color-text) focus:outline-none"
      >
        {t("sentTitle")}
      </h2>
      <p className="text-body text-(--color-text-muted)">{t("sentBody", { ref: orderRef })}</p>
      <p className="text-footnote text-(--color-text-muted)">{t("sentNotSent")}</p>
      <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={startNewOrder}
          className={`${buttonClasses("primary", "md")} font-semibold active:bg-(--color-brand-deep) active:text-white`}
        >
          {t("sentNewOrder")}
        </button>
        <button
          type="button"
          onClick={() => reopenCart("b2c")}
          className={`${buttonClasses("secondary", "md")} active:bg-(--color-border)`}
        >
          {t("sentBack")}
        </button>
      </div>
    </div>
  );
}
