"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { TrayItem } from "./whatsapp";

const STORAGE_KEY = "abk_order_tray";
const EVENT_NAME = "abk:tray-change";

const emptyTray: TrayItem[] = [];
let cachedRaw: string | null = null;
let cachedItems: TrayItem[] = emptyTray;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): TrayItem[] {
  if (typeof window === "undefined") return emptyTray;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    cachedItems = raw ? (JSON.parse(raw) as TrayItem[]) : emptyTray;
    return cachedItems;
  } catch {
    return emptyTray;
  }
}

function getServerSnapshot(): TrayItem[] {
  return emptyTray;
}

const emptySubscribe = () => () => {};

export function getStoredTray(): TrayItem[] {
  return getSnapshot();
}

function saveTray(items: TrayItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }));
  } catch (err) {
    console.error("Failed to save order tray", err);
  }
}

export function addToTray(
  item: Omit<TrayItem, "quantity">,
  quantity = 1,
) {
  const current = getStoredTray();
  const existingIdx = current.findIndex((i) => i.slug === item.slug);

  let updated: TrayItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      quantity: updated[existingIdx].quantity + quantity,
    };
  } else {
    updated = [...current, { ...item, quantity }];
  }

  saveTray(updated);
}

export function updateQuantity(slug: string, quantity: number) {
  const current = getStoredTray();
  if (quantity <= 0) {
    removeFromTray(slug);
    return;
  }
  const updated = current.map((item) =>
    item.slug === slug ? { ...item, quantity } : item,
  );
  saveTray(updated);
}

export function removeFromTray(slug: string) {
  const current = getStoredTray();
  const updated = current.filter((item) => item.slug !== slug);
  saveTray(updated);
}

export const OPEN_TRAY_EVENT = "abk:open-tray";

export function openTray() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_TRAY_EVENT));
}

export function clearTray() {
  saveTray([]);
}

export function useOrderTray() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = useCallback(
    (item: Omit<TrayItem, "quantity">, quantity = 1) => {
      addToTray(item, quantity);
    },
    [],
  );

  const updateItemQty = useCallback((slug: string, quantity: number) => {
    updateQuantity(slug, quantity);
  }, []);

  const removeItem = useCallback((slug: string) => {
    removeFromTray(slug);
  }, []);

  const clear = useCallback(() => {
    clearTray();
  }, []);

  return {
    items: mounted ? items : emptyTray,
    count: mounted ? totalCount : 0,
    mounted,
    addItem,
    updateQuantity: updateItemQty,
    removeItem,
    clear,
  };
}
