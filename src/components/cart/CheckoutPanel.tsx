"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, buttonClasses } from "@/components/ui/Button";
import { AlertIcon, ClockIcon, PinIcon, ShieldCheckIcon, TruckIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { AREA_OTHER, QATAR_AREAS, findArea } from "@/data/qatarAreas";
import {
  ADDRESS_MAX,
  AREA_OTHER_MAX,
  EMAIL_MAX,
  MOBILE_MAX,
  NAME_MAX,
  NOTES_MAX,
  completePaidOrder,
  markCartSent,
  switchLineVariant,
  updateCheckoutDetails,
  type CheckoutDetails,
  type PaymentMethod,
} from "@/lib/cart";
import {
  estimatedFee,
  formatNumber,
  formatPercent,
  formatQar,
  isFromPrice,
  quoteDelivery,
  quoteDiscount,
  type CartTotals,
  type Fulfilment,
  type ResolvedLine,
} from "@/lib/pricing";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";
import { gaItem, trackCartEvent } from "@/lib/analytics";
import { readBookingAttribution } from "@/lib/attribution";
import { SITE } from "@/lib/constants";
import type { PaymentsVisibility } from "@/lib/payments/config";
import { submitToSadad, useOnlinePayments, type SadadFormPayload } from "@/lib/payments/client";
import { isEmail, normaliseQatarMobile } from "@/lib/payments/validate";
import { useCartUi } from "./CartProvider";
import { CartProgress } from "./DiscountProgress";

type FieldKey = "area" | "areaOther" | "name" | "mobile" | "email" | "address";
type Errors = Partial<Record<FieldKey, true>>;

/** DOM order — the first invalid one gets focus on a failed send. */
const FIELD_ORDER: FieldKey[] = ["area", "areaOther", "name", "mobile", "email", "address"];

/** A stored key that no longer matches the area list counts as "not chosen". */
function knownArea(area: string): boolean {
  return area === AREA_OTHER || findArea(area) !== undefined;
}

function validate(details: CheckoutDetails, method: PaymentMethod): Errors {
  const errors: Errors = {};
  if (details.fulfilment === "delivery") {
    if (!knownArea(details.area)) errors.area = true;
    else if (details.area === AREA_OTHER && !details.areaOther.trim()) errors.areaOther = true;
  }
  if (method === "online") {
    if (details.name.trim().length < 2) errors.name = true;
    if (!normaliseQatarMobile(details.mobile)) errors.mobile = true;
    if (!isEmail(details.email.trim())) errors.email = true;
    if (details.fulfilment === "delivery" && details.address.trim().length < 4) errors.address = true;
  }
  return errors;
}

const FIELD =
  "w-full rounded-xl bg-(--color-surface) px-3.5 text-footnote text-(--color-text) placeholder:text-(--color-text-subtle) focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-(--color-brand-deep)";
const FIELD_OK = "shadow-[0_0_0_1px_var(--color-border)]";
const FIELD_ERROR = "shadow-[0_0_0_2px_var(--color-danger)]";
const OPTION_CARD =
  "relative flex cursor-pointer flex-col gap-0.5 rounded-xl bg-(--color-surface) p-3.5 shadow-[0_0_0_1px_var(--color-border)] transition-shadow duration-150 ease-soft hover:shadow-[0_0_0_1px_var(--color-text-subtle)] has-[:checked]:bg-(--color-brand)/8 has-[:checked]:shadow-[0_0_0_2px_var(--color-brand-deep)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--color-brand-deep) has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60";

/** Card brands SADAD's hosted page accepts for this merchant. */
const PAYMENT_MARKS = ["Visa", "Mastercard", "Apple Pay", "Google Pay", "NAPS"];

/**
 * Order summary + the checkout step (pickup or delivery area, how to pay) +
 * the hand-off: SADAD's hosted payment page, or the WhatsApp order.
 *
 * The WhatsApp send control is a real wa.me <a> only while the form is
 * valid: the analytics listener counts anchor clicks in the capture phase,
 * before any preventDefault could run, so an invalid tap must not be an
 * anchor at all or it would report a conversion that never happened.
 *
 * Paying online needs a firm total, so it is offered only when every line
 * has a price; the server re-prices the cart anyway (src/app/api/checkout).
 */
export function CheckoutPanel({
  lines,
  totals,
  details,
  orderRef,
  payments,
  holdOnlinePayment = false,
}: {
  lines: ResolvedLine[];
  totals: CartTotals;
  details: CheckoutDetails;
  orderRef: string;
  payments: PaymentsVisibility;
  /** True right after a payment SADAD hasn't confirmed yet: online pay is paused. */
  holdOnlinePayment?: boolean;
}) {
  const t = useTranslations("Cart");
  const tContact = useTranslations("Contact");
  const { locale } = useCartUi();
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [paying, setPaying] = useState(false);
  // Remembers the total it was about, so it disappears once the cart changes.
  const [payErrorState, setPayErrorState] = useState<{ message: string; total: number } | null>(null);
  const areaRef = useRef<HTMLSelectElement>(null);
  const areaOtherRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const inputRefs = { name: nameRef, mobile: mobileRef, email: emailRef, address: addressRef };
  const checkoutStarted = useRef(false);

  const onlineOffered = useOnlinePayments(payments);
  const allPriced = totals.pricedLines > 0 && totals.unpricedLines === 0 && totals.fromPricedLines === 0;
  // While a payment is still being confirmed, don't invite a second one.
  const onlineAllowed = allPriced && !holdOnlinePayment;
  const method: PaymentMethod = onlineOffered && onlineAllowed ? details.payment : "whatsapp";

  // Back from SADAD's page via the browser's back button restores this page
  // from the back/forward cache with the button still spinning.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setPaying(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const areas = useMemo(
    () => [...QATAR_AREAS].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale)),
    [locale],
  );

  const quote = quoteDelivery(totals, details.fulfilment);
  const discount = quoteDiscount(totals);
  // What the customer pays for the goods — the conversion value too.
  const orderValue = totals.pricedSubtotal - (discount?.amountQar ?? 0);
  const payTotal = Math.round((orderValue + estimatedFee(quote)) * 100) / 100;
  const payError = payErrorState && payErrorState.total === payTotal ? payErrorState.message : null;
  const errors = validate(details, method);
  const valid = FIELD_ORDER.every((k) => !errors[k]);
  const showError = (k: FieldKey) => Boolean(errors[k] && (touched[k] || attempted));
  const touch = (k: FieldKey) => () => setTouched((s) => ({ ...s, [k]: true }));
  const focusFirstInvalid = () => {
    const first = FIELD_ORDER.find((k) => errors[k]);
    const target = first === "area" ? areaRef : first === "areaOther" ? areaOtherRef : first ? inputRefs[first] : null;
    target?.current?.focus();
  };

  const areaLabel =
    details.area === AREA_OTHER ? details.areaOther.trim() : findArea(details.area)?.name[locale];

  const whatsappUrl = buildCartWhatsAppUrl({
    locale,
    orderRef,
    lines: lines.map((l) => ({
      name: l.product.variantSize
        ? `${l.product.name[locale]} (${l.product.variantSize[locale]})`
        : l.product.name[locale],
      qty: l.qty,
      unitPriceQar: l.product.priceQar,
      priceIsFrom: isFromPrice(l.product),
    })),
    fulfilment: details.fulfilment,
    areaLabel,
    notes: details.notes,
  });

  const gaItems = () => lines.map((l) => gaItem(l.product, l.qty));

  const beginCheckout = () => {
    if (checkoutStarted.current) return;
    checkoutStarted.current = true;
    trackCartEvent("begin_checkout", gaItems());
  };

  const onInvalidSend = () => {
    setAttempted(true);
    beginCheckout();
    focusFirstInvalid();
  };

  const onSend = () => {
    beginCheckout();
    // Let the browser follow the link before the page swaps to "Order sent?".
    window.setTimeout(() => markCartSent("b2c"), 600);
  };

  const onPay = async () => {
    if (paying) return;
    setAttempted(true);
    beginCheckout();
    if (!valid) {
      focusFirstInvalid();
      return;
    }
    setPaying(true);
    setPayErrorState(null);
    trackCartEvent("add_payment_info", gaItems());
    type Reply = { ok?: boolean; error?: string; totalQar?: number; sadad?: SadadFormPayload };
    let out: Reply | null = null;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          ref: orderRef,
          lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
          fulfilment: details.fulfilment,
          area: details.area,
          areaOther: details.areaOther,
          address: details.address,
          notes: details.notes,
          name: details.name,
          mobile: details.mobile,
          email: details.email.trim(),
          expectedTotalQar: payTotal,
          ...readBookingAttribution(),
        }),
      });
      out = (await res.json().catch(() => null)) as Reply | null;
      if (res.ok && out?.ok && out.sadad) {
        // The browser leaves for SADAD; the spinner stays until it does.
        submitToSadad(out.sadad);
        return;
      }
    } catch {
      out = null;
    }
    if (out?.error === "already_paid") {
      // An earlier attempt of this cart was paid: start a fresh cart and say so
      // (the reload shows the notice on the now-empty cart page).
      completePaidOrder(orderRef);
      window.location.replace(`/${locale}/b2c/cart?payment=paid`);
      return;
    }
    setPaying(false);
    switch (out?.error) {
      case "total_changed":
        setPayErrorState({ message: t("payTotalChanged", { total: formatQar(out.totalQar ?? payTotal, locale) }), total: payTotal });
        break;
      case "payments_unavailable":
      case "store_unavailable":
        setPayErrorState({ message: t("payUnavailable"), total: payTotal });
        break;
      case "unpriced":
        setPayErrorState({ message: t("payNeedsPricesError"), total: payTotal });
        break;
      case "invalid_fields":
        setPayErrorState({ message: t("fixErrors"), total: payTotal });
        break;
      default:
        setPayErrorState({ message: t("payFailedToStart"), total: payTotal });
    }
  };

  // With nothing priced yet the order value is unknown, so don't lead with the
  // QAR 25 fee — DeliveryProgress below states the free-delivery rule and fee.
  const deliveryValue =
    quote.kind === "pickup" || quote.kind === "free"
      ? t("deliveryFree")
      : quote.kind === "fee"
        ? formatQar(quote.feeQar, locale)
        : totals.pricedLines === 0
          ? t("deliveryOnWhatsApp")
          : t("deliveryProvisional", { fee: formatQar(quote.feeQar, locale) });

  const fulfilmentOptions: { value: Fulfilment; label: string; hint: string; icon: React.ReactNode }[] = [
    {
      value: "delivery",
      label: t("fulfilmentDelivery"),
      hint: t("fulfilmentDeliveryHint"),
      icon: <TruckIcon className="h-4 w-4 text-(--color-brand-deep)" />,
    },
    {
      value: "pickup",
      label: t("fulfilmentPickup"),
      hint: t("fulfilmentPickupHint"),
      icon: <PinIcon className="h-4 w-4 text-(--color-brand-deep)" />,
    },
  ];

  const listSeparator = locale === "ar" ? "، " : ", ";

  const textField = (
    key: "name" | "mobile" | "email" | "address",
    opts: {
      label: string;
      error: string;
      max: number;
      type?: string;
      inputMode?: "tel" | "email" | "text";
      autoComplete: string;
      placeholder?: string;
      hint?: string;
      dir?: "ltr";
    },
  ) => {
    const id = `checkout-${key}`;
    const shown = showError(key);
    // The hint is replaced by the error while one shows, so only point at what is rendered.
    const describedBy = shown ? `${id}-error` : opts.hint ? `${id}-hint` : undefined;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-footnote font-semibold text-(--color-text)">
          {opts.label}{" "}
          <span aria-hidden className="text-(--color-danger)">
            *
          </span>
        </label>
        <input
          id={id}
          ref={inputRefs[key]}
          type={opts.type ?? "text"}
          inputMode={opts.inputMode}
          dir={opts.dir}
          value={details[key]}
          maxLength={opts.max}
          required
          autoComplete={opts.autoComplete}
          placeholder={opts.placeholder}
          aria-invalid={shown || undefined}
          aria-describedby={describedBy}
          onChange={(e) => updateCheckoutDetails({ [key]: e.target.value } as Partial<CheckoutDetails>)}
          onBlur={touch(key)}
          className={`${FIELD} h-11 ${opts.dir === "ltr" ? "rtl:text-right" : ""} ${shown ? FIELD_ERROR : FIELD_OK}`}
        />
        {opts.hint && !shown ? (
          <p id={`${id}-hint`} className="text-caption text-(--color-text-muted)">
            {opts.hint}
          </p>
        ) : null}
        {shown ? (
          <p id={`${id}-error`} className="text-caption font-medium text-(--color-danger)">
            {opts.error}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="checkout-summary"
        className="tile flex flex-col gap-5 p-5 sm:p-6"
        onFocusCapture={beginCheckout}
      >
        <h2 id="checkout-summary" className="text-title-sm font-semibold text-(--color-text)">
          {t("summaryTitle")}
        </h2>

        {/* Items in order with quick size selection */}
        {lines.length > 0 && (
          <div className="flex flex-col divide-y divide-(--color-border-soft) rounded-2xl border border-(--color-border-soft) bg-(--color-fill)/25 px-3.5 py-1">
            {lines.map((l) => {
              const hasVariants = Boolean(l.product.variants && l.product.variants.length > 1);
              return (
                <div key={l.slug} className="flex flex-col gap-1.5 py-2.5 text-caption">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-(--color-text) line-clamp-1">
                      {l.product.name[locale]}
                      <span className="font-normal text-(--color-text-muted)"> × {formatNumber(l.qty, locale)}</span>
                    </span>
                    <span className="shrink-0 font-bold tabular-nums text-(--color-text)">
                      {l.product.priceQar !== undefined
                        ? formatQar(l.product.priceQar * l.qty, locale)
                        : t("priceOnRequest")}
                    </span>
                  </div>
                  {hasVariants && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] font-medium text-(--color-text-muted)">
                        {t("size")}:
                      </span>
                      <div
                        role="radiogroup"
                        aria-label={t("selectSize")}
                        className="inline-flex rounded-lg bg-(--color-surface) p-0.5 shadow-2xs border border-(--color-border-soft)"
                      >
                        {l.product.variants!.map((v) => {
                          const isCurrent =
                            v.slug === l.slug ||
                            (l.slug === (l.product.parentSlug ?? l.product.slug) && v.slug === l.product.slug);
                          return (
                            <button
                              key={v.id}
                              type="button"
                              role="radio"
                              aria-checked={isCurrent}
                              onClick={() => {
                                if (!isCurrent) switchLineVariant("b2c", l.slug, v.slug);
                              }}
                              className={`rounded px-1.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-(--color-brand) text-black shadow-2xs ring-1 ring-black/10"
                                  : "text-(--color-text-muted) hover:text-(--color-text) hover:bg-black/5"
                              }`}
                            >
                              {v.size[locale]} ({v.price[locale]})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2.5 text-footnote">
          {totals.pricedLines > 0 ? (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-(--color-text-muted)">
                {t("subtotalPriced", { count: totals.pricedLines })}
              </span>
              <span className="font-semibold tabular-nums text-(--color-text)">
                {formatQar(totals.pricedSubtotal, locale)}
              </span>
            </div>
          ) : null}
          {discount ? (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-(--color-text-muted)">
                {t("discount", { percent: formatPercent(discount.percent, locale) })}
              </span>
              <span className="font-semibold tabular-nums text-(--color-brand-deep)">
                −{formatQar(discount.amountQar, locale)}
              </span>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-(--color-text-muted)">
              {details.fulfilment === "pickup" ? t("pickupLabel") : t("delivery")}
            </span>
            <span className="text-end font-semibold text-(--color-text)">{deliveryValue}</span>
          </div>
          {totals.unpricedLines > 0 ? (
            <p className="text-caption text-(--color-text-muted)">
              {t("unpricedNote", { count: totals.unpricedLines })}
            </p>
          ) : null}
        </div>

        {totals.pricedLines > 0 ? (
          <div className="-mt-1 flex flex-col gap-1 border-t border-(--color-border-soft) pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-body font-semibold text-(--color-text)">
                {totals.unpricedLines > 0 || totals.fromPricedLines > 0
                  ? t("estimatedTotal")
                  : t("total")}
              </span>
              <span className="text-title-sm font-bold tabular-nums text-(--color-text)">
                {formatQar(payTotal, locale)}
              </span>
            </div>
            {totals.unpricedLines > 0 ? (
              <p className="text-caption text-(--color-text-muted)">{t("totalExcludes")}</p>
            ) : null}
          </div>
        ) : null}

        <CartProgress totals={totals} locale={locale} fulfilment={details.fulfilment} />

        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-footnote font-semibold text-(--color-text)">
            {t("fulfilmentTitle")}
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {fulfilmentOptions.map((option) => (
              <label key={option.value} className={OPTION_CARD}>
                <input
                  type="radio"
                  name="fulfilment"
                  value={option.value}
                  checked={details.fulfilment === option.value}
                  onChange={() => updateCheckoutDetails({ fulfilment: option.value })}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 text-footnote font-semibold text-(--color-text)">
                  {option.icon}
                  {option.label}
                </span>
                <span className="text-caption text-(--color-text-muted)">{option.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {details.fulfilment === "delivery" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-area" className="text-footnote font-semibold text-(--color-text)">
              {t("areaLabel")}{" "}
              <span aria-hidden className="text-(--color-danger)">
                *
              </span>
            </label>
            <select
              id="checkout-area"
              ref={areaRef}
              value={knownArea(details.area) ? details.area : ""}
              required
              aria-invalid={showError("area") || undefined}
              aria-describedby={showError("area") ? "checkout-area-error" : undefined}
              onChange={(e) => updateCheckoutDetails({ area: e.target.value })}
              onBlur={touch("area")}
              className={`${FIELD} h-11 ${showError("area") ? FIELD_ERROR : FIELD_OK}`}
            >
              <option value="" disabled>
                {t("areaPlaceholder")}
              </option>
              {areas.map((area) => (
                <option key={area.key} value={area.key}>
                  {area.name[locale]}
                </option>
              ))}
              <option value={AREA_OTHER}>{t("areaOtherOption")}</option>
            </select>
            {showError("area") ? (
              <p id="checkout-area-error" className="text-caption font-medium text-(--color-danger)">
                {t("areaError")}
              </p>
            ) : null}

            {details.area === AREA_OTHER ? (
              <div className="mt-2 flex flex-col gap-1.5">
                <label
                  htmlFor="checkout-area-other"
                  className="text-footnote font-semibold text-(--color-text)"
                >
                  {t("areaOtherLabel")}{" "}
                  <span aria-hidden className="text-(--color-danger)">
                    *
                  </span>
                </label>
                <input
                  id="checkout-area-other"
                  ref={areaOtherRef}
                  type="text"
                  value={details.areaOther}
                  maxLength={AREA_OTHER_MAX}
                  required
                  autoComplete="address-level3"
                  placeholder={t("areaOtherPlaceholder")}
                  aria-invalid={showError("areaOther") || undefined}
                  aria-describedby={showError("areaOther") ? "checkout-area-other-error" : undefined}
                  onChange={(e) => updateCheckoutDetails({ areaOther: e.target.value })}
                  onBlur={touch("areaOther")}
                  className={`${FIELD} h-11 ${showError("areaOther") ? FIELD_ERROR : FIELD_OK}`}
                />
                {showError("areaOther") ? (
                  <p
                    id="checkout-area-other-error"
                    className="text-caption font-medium text-(--color-danger)"
                  >
                    {t("areaOtherError")}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {onlineOffered ? (
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 text-footnote font-semibold text-(--color-text)">
              {t("payTitle")}
            </legend>
            <div className="grid gap-2.5">
              <label className={OPTION_CARD}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={method === "online"}
                  disabled={!onlineAllowed}
                  aria-describedby={!allPriced ? "checkout-pay-online-note" : undefined}
                  onChange={() => {
                    setPayErrorState(null);
                    updateCheckoutDetails({ payment: "online" });
                  }}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 text-footnote font-semibold text-(--color-text)">
                  <ShieldCheckIcon className="h-4 w-4 text-(--color-brand-deep)" />
                  {t("payOnline")}
                </span>
                <span className="text-caption text-(--color-text-muted)">{t("payOnlineHint")}</span>
                <span aria-hidden className="mt-1.5 flex flex-wrap gap-1">
                  {PAYMENT_MARKS.map((mark) => (
                    <span
                      key={mark}
                      dir="ltr"
                      className="rounded-md border border-(--color-border-soft) bg-(--color-surface) px-1.5 py-0.5 text-[10px] font-semibold text-(--color-text-muted)"
                    >
                      {mark}
                    </span>
                  ))}
                </span>
                {!allPriced ? (
                  <span id="checkout-pay-online-note" className="mt-1 text-caption text-(--color-text-muted)">
                    {t("payOnlineNeedsPrices")}
                  </span>
                ) : null}
              </label>
              <label className={OPTION_CARD}>
                <input
                  type="radio"
                  name="payment"
                  value="whatsapp"
                  checked={method === "whatsapp"}
                  onChange={() => {
                    setPayErrorState(null);
                    updateCheckoutDetails({ payment: "whatsapp" });
                  }}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 text-footnote font-semibold text-(--color-text)">
                  <WhatsAppIcon className="h-4 w-4 text-(--color-brand-deep)" />
                  {t("payWhatsApp")}
                </span>
                <span className="text-caption text-(--color-text-muted)">{t("payWhatsAppHint")}</span>
              </label>
            </div>
          </fieldset>
        ) : null}

        {method === "online" ? (
          <div role="group" aria-labelledby="checkout-details-title" className="flex flex-col gap-3">
            <p id="checkout-details-title" className="text-footnote font-semibold text-(--color-text)">
              {t("detailsTitle")}
            </p>
            {textField("name", {
              label: t("nameLabel"),
              error: t("nameError"),
              max: NAME_MAX,
              autoComplete: "name",
            })}
            {textField("mobile", {
              label: t("mobileLabel"),
              error: t("mobileError"),
              max: MOBILE_MAX,
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel",
              placeholder: t("mobilePlaceholder"),
              dir: "ltr",
            })}
            {textField("email", {
              label: t("emailLabel"),
              error: t("emailError"),
              max: EMAIL_MAX,
              type: "email",
              inputMode: "email",
              autoComplete: "email",
              hint: t("emailHint"),
              dir: "ltr",
            })}
            {details.fulfilment === "delivery"
              ? textField("address", {
                  label: t("addressLabel"),
                  error: t("addressError"),
                  max: ADDRESS_MAX,
                  autoComplete: "street-address",
                  placeholder: t("addressPlaceholder"),
                })
              : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkout-notes" className="text-footnote font-semibold text-(--color-text)">
            {t("notesLabel")}{" "}
            <span className="font-normal text-(--color-text-muted)">({t("optional")})</span>
          </label>
          <textarea
            id="checkout-notes"
            rows={2}
            maxLength={NOTES_MAX}
            value={details.notes}
            placeholder={t("notesPlaceholder")}
            onChange={(e) => updateCheckoutDetails({ notes: e.target.value })}
            className={`${FIELD} ${FIELD_OK} resize-y py-2.5`}
          />
        </div>

        <div className="flex flex-col gap-2">
          {attempted && !valid ? (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-xl bg-(--color-danger)/10 px-3.5 py-2.5 text-caption font-medium text-(--color-danger)"
            >
              <AlertIcon className="h-4 w-4 shrink-0" />
              {t("fixErrors")}
            </p>
          ) : null}
          {payError && method === "online" ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-(--color-danger)/10 px-3.5 py-2.5 text-caption font-medium text-(--color-danger)"
            >
              <AlertIcon className="mt-px h-4 w-4 shrink-0" />
              {payError}
            </p>
          ) : null}
          {method === "online" ? (
            <>
              <Button
                size="lg"
                loading={paying}
                onClick={onPay}
                className="w-full font-semibold active:bg-(--color-brand-deep) active:text-white"
              >
                {paying ? null : <ShieldCheckIcon className="h-5 w-5" />}
                {paying ? t("payOpening") : t("payButton", { total: formatQar(payTotal, locale) })}
              </Button>
              <p className="text-center text-caption text-(--color-text-muted)">{t("payHint")}</p>
            </>
          ) : valid ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSend}
              data-conversion-value={orderValue > 0 ? orderValue : undefined}
              data-conversion-currency={totals.pricedSubtotal > 0 ? "QAR" : undefined}
              data-item-count={totals.units}
              data-order-ref={orderRef}
              data-placement="cart"
              className={`plausible-event-name=cart_whatsapp_send plausible-event-audience=b2c ${buttonClasses("primary", "lg")} w-full font-semibold active:bg-(--color-brand-deep) active:text-white`}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t("send")}
            </a>
          ) : (
            <button
              type="button"
              onClick={onInvalidSend}
              className={`${buttonClasses("primary", "lg")} w-full font-semibold active:bg-(--color-brand-deep) active:text-white`}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t("send")}
            </button>
          )}
          {method === "whatsapp" ? (
            <p className="text-center text-caption text-(--color-text-muted)">{t("sendHint")}</p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="checkout-how" className="tile p-5 sm:p-6">
        <h2 id="checkout-how" className="text-body font-semibold text-(--color-text)">
          {t("howTitle")}
        </h2>
        <ol className="mt-3 flex flex-col gap-3">
          {[t("howStep1"), t("howStep2"), t("howStep3")].map((step, i) => (
            <li key={step} className="flex gap-3 text-footnote text-(--color-text)">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-brand)/15 text-caption font-bold text-(--color-brand-deep)">
                {formatNumber(i + 1, locale)}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-start gap-2 border-t border-(--color-border-soft) pt-4 text-caption text-(--color-text-muted)">
          <ClockIcon className="mt-px h-4 w-4 shrink-0" />
          <span>
            {t("hoursReply")} · {tContact("hoursSatToThu")}{" "}
            <span className="ltr-nums">{SITE.hours.weekdaysMorning}</span>
            {listSeparator}
            <span className="ltr-nums">{SITE.hours.weekdaysEvening}</span> ·{" "}
            {tContact("hoursFri")}: {tContact("hoursClosed")}
          </span>
        </p>
      </section>
    </div>
  );
}
