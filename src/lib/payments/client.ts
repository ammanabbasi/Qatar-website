"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { PaymentsVisibility } from "./config";

/**
 * Browser side of online payment: whether to offer it, and the hand-off to
 * SADAD's hosted page. Type-only imports from the server modules, so no
 * secret or node:crypto code reaches the bundle.
 */

/** Ordered: SADAD verifies the checksum over the fields in the order they are posted. */
export type SadadFormPayload = { action: string; fields: Array<[string, string]> };

const PREVIEW_KEY = "abk_pay_preview";
const PREVIEW_EVENT = "abk:pay-preview";

function subscribe(onChange: () => void) {
  window.addEventListener(PREVIEW_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PREVIEW_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function previewFlag(): boolean {
  try {
    return window.localStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * True when online payment should be offered on this device. "public" is
 * everyone; "preview" (keys configured, PAYMENTS_PUBLIC not yet set) is only
 * a device that opened a page with ?pay=preview — the go-live check — until
 * it opens one with ?pay=off.
 */
export function useOnlinePayments(visibility: PaymentsVisibility): boolean {
  useEffect(() => {
    if (visibility === "off") return;
    const param = new URLSearchParams(window.location.search).get("pay");
    if (param !== "preview" && param !== "off") return;
    try {
      if (param === "preview") window.localStorage.setItem(PREVIEW_KEY, "1");
      else window.localStorage.removeItem(PREVIEW_KEY);
    } catch {
      // Storage blocked: preview simply stays off on this device.
    }
    window.dispatchEvent(new Event(PREVIEW_EVENT));
  }, [visibility]);

  const preview = useSyncExternalStore(subscribe, previewFlag, () => false);
  return visibility === "public" || (visibility === "preview" && preview);
}

/**
 * Time limit for an order request (checkout, PPF booking): past it the page
 * gives up and offers WhatsApp instead of spinning forever. Undefined where
 * AbortSignal.timeout is missing (older Safari): the request then simply runs
 * without a limit rather than failing.
 */
export function orderRequestSignal(ms = 30_000): AbortSignal | undefined {
  return typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
    ? AbortSignal.timeout(ms)
    : undefined;
}

/** Posts the signed form to SADAD; the browser leaves the site from here. */
export function submitToSadad({ action, fields }: SadadFormPayload): void {
  // The action comes from our own API; refuse anything that isn't SADAD.
  if (!/^https:\/\/sadadqa\.com\//.test(action)) throw new Error("unexpected payment endpoint");
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.style.display = "none";
  for (const [name, value] of fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
