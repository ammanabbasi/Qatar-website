"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartCatalogue } from "@/data/cartCatalogue";
import type { Audience, WALocale } from "@/lib/whatsapp";
import { addToCart, getCart, pruneUnknownLines } from "@/lib/cart";
import { findProduct, resolveCartLines } from "@/lib/pricing";
import { gaItem, trackCartEvent } from "@/lib/analytics";

export type AddedToast = {
  id: number;
  slug: string;
  /** Units of this product in the cart after the add — makes every announcement distinct. */
  inCart: number;
};

type CartUi = {
  audience: Audience;
  locale: WALocale;
  /** Slim product projection built by the Shell on the server. */
  catalogue: CartCatalogue;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: AddedToast | null;
  dismissToast: () => void;
  /**
   * Adds to this audience's cart, reports it and confirms it (retail toast).
   * Returns false when nothing was added (already at the quantity cap).
   */
  add: (slug: string, qty?: number) => boolean;
};

const CartUiContext = createContext<CartUi | null>(null);

/** Focus lands here when the element that opened the drawer no longer exists. */
export const HEADER_CART_BUTTON_ID = "header-cart-button";

/**
 * Cart UI state shared by the header button, add buttons, the drawer and the
 * toast. Cart CONTENTS live in `src/lib/cart.ts` (localStorage); this context
 * only carries what the page needs to present them. It remounts on every
 * route change, which is what closes the drawer after navigating.
 */
export function CartProvider({
  audience,
  locale,
  catalogue,
  children,
}: {
  audience: Audience;
  locale: WALocale;
  catalogue: CartCatalogue;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<AddedToast | null>(null);
  const toastSeq = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Lines for products that no longer exist (a renamed slug, an old tray
  // entry) can't be shown or removed, yet would still count in the badge.
  useEffect(() => {
    const known = (slug: string) => findProduct(catalogue, slug) !== undefined;
    pruneUnknownLines("b2c", known);
    pruneUnknownLines("b2b", known);
  }, [catalogue]);

  const openDrawer = useCallback(() => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setToast(null);
    setDrawerOpen(true);
    // The cart page already reported view_cart when it loaded.
    if (audience === "b2c" && !window.location.pathname.endsWith("/b2c/cart")) {
      const lines = resolveCartLines(getCart(audience).lines, catalogue);
      trackCartEvent(
        "view_cart",
        lines.map((l) => gaItem(l.product, l.qty)),
      );
    }
  }, [audience, catalogue]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    const target = returnFocus.current;
    returnFocus.current = null;
    // After the dialog unmounts, give focus back to whatever opened it — or to
    // the header cart button if that control is gone (e.g. a dismissed toast).
    window.requestAnimationFrame(() => {
      const fallback = document.getElementById(HEADER_CART_BUTTON_ID);
      (target?.isConnected ? target : fallback)?.focus();
    });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const add = useCallback(
    (slug: string, qty = 1) => {
      const product = findProduct(catalogue, slug);
      if (!product) return false;
      const added = addToCart(audience, slug, qty);
      if (added === 0) return false;
      if (audience === "b2c") {
        trackCartEvent("add_to_cart", [gaItem(product, added)]);
        const inCart = getCart(audience).lines.find((l) => l.slug === slug)?.qty ?? added;
        toastSeq.current += 1;
        setToast({ id: toastSeq.current, slug, inCart });
      }
      return true;
    },
    [audience, catalogue],
  );

  const value = useMemo<CartUi>(
    () => ({
      audience,
      locale,
      catalogue,
      drawerOpen,
      openDrawer,
      closeDrawer,
      toast,
      dismissToast,
      add,
    }),
    [audience, locale, catalogue, drawerOpen, openDrawer, closeDrawer, toast, dismissToast, add],
  );

  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
}

export function useCartUi(): CartUi {
  const ctx = useContext(CartUiContext);
  if (!ctx) throw new Error("useCartUi must be used inside <CartProvider> (rendered by Shell).");
  return ctx;
}
