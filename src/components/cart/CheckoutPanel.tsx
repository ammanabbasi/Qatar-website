"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/Button";
import { AlertIcon, ClockIcon, PinIcon, TruckIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { AREA_OTHER, QATAR_AREAS, findArea } from "@/data/qatarAreas";
import {
  AREA_OTHER_MAX,
  NOTES_MAX,
  markCartSent,
  switchLineVariant,
  updateCheckoutDetails,
  type CheckoutDetails,
} from "@/lib/cart";
import {
  estimatedFee,
  formatNumber,
  formatQar,
  isFromPrice,
  quoteDelivery,
  type CartTotals,
  type Fulfilment,
  type ResolvedLine,
} from "@/lib/pricing";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";
import { gaItem, trackCartEvent } from "@/lib/analytics";
import { SITE } from "@/lib/constants";
import { useCartUi } from "./CartProvider";
import { DeliveryProgress } from "./DeliveryProgress";

type Errors = { area?: true; areaOther?: true };

/** A stored key that no longer matches the area list counts as "not chosen". */
function knownArea(area: string): boolean {
  return area === AREA_OTHER || findArea(area) !== undefined;
}

function validate(details: CheckoutDetails): Errors {
  if (details.fulfilment !== "delivery") return {};
  if (!knownArea(details.area)) return { area: true };
  if (details.area === AREA_OTHER && !details.areaOther.trim()) return { areaOther: true };
  return {};
}

const FIELD =
  "w-full rounded-xl bg-(--color-surface) px-3.5 text-footnote text-(--color-text) placeholder:text-(--color-text-subtle) focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-(--color-brand-deep)";
const FIELD_OK = "shadow-[0_0_0_1px_var(--color-border)]";
const FIELD_ERROR = "shadow-[0_0_0_2px_var(--color-danger)]";

/**
 * Order summary + the one checkout step (pickup or delivery area) + the
 * WhatsApp hand-off.
 *
 * The send control is a real wa.me <a> only while the form is valid: the
 * analytics listener counts anchor clicks in the capture phase, before any
 * preventDefault could run, so an invalid tap must not be an anchor at all or
 * it would report a conversion that never happened.
 */
export function CheckoutPanel({
  lines,
  totals,
  details,
  orderRef,
}: {
  lines: ResolvedLine[];
  totals: CartTotals;
  details: CheckoutDetails;
  orderRef: string;
}) {
  const t = useTranslations("Cart");
  const tContact = useTranslations("Contact");
  const { locale } = useCartUi();
  const [touched, setTouched] = useState({ area: false, areaOther: false });
  const [attempted, setAttempted] = useState(false);
  const areaRef = useRef<HTMLSelectElement>(null);
  const areaOtherRef = useRef<HTMLInputElement>(null);
  const checkoutStarted = useRef(false);

  const areas = useMemo(
    () => [...QATAR_AREAS].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale)),
    [locale],
  );

  const quote = quoteDelivery(totals, details.fulfilment);
  const errors = validate(details);
  const valid = !errors.area && !errors.areaOther;
  const showAreaError = Boolean(errors.area && (touched.area || attempted));
  const showAreaOtherError = Boolean(errors.areaOther && (touched.areaOther || attempted));

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

  const beginCheckout = () => {
    if (checkoutStarted.current) return;
    checkoutStarted.current = true;
    trackCartEvent(
      "begin_checkout",
      lines.map((l) => gaItem(l.product, l.qty)),
    );
  };

  const onInvalidSend = () => {
    setAttempted(true);
    beginCheckout();
    (errors.area ? areaRef.current : areaOtherRef.current)?.focus();
  };

  const onSend = () => {
    beginCheckout();
    // Let the browser follow the link before the page swaps to "Order sent?".
    window.setTimeout(() => markCartSent("b2c"), 600);
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
                      <span className="font-normal text-(--color-text-muted)"> × {l.qty}</span>
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
                {formatQar(totals.pricedSubtotal + estimatedFee(quote), locale)}
              </span>
            </div>
            {totals.unpricedLines > 0 ? (
              <p className="text-caption text-(--color-text-muted)">{t("totalExcludes")}</p>
            ) : null}
          </div>
        ) : null}

        {details.fulfilment === "delivery" ? (
          <DeliveryProgress totals={totals} locale={locale} />
        ) : null}

        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-footnote font-semibold text-(--color-text)">
            {t("fulfilmentTitle")}
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {fulfilmentOptions.map((option) => (
              <label
                key={option.value}
                className="relative flex cursor-pointer flex-col gap-0.5 rounded-xl bg-(--color-surface) p-3.5 shadow-[0_0_0_1px_var(--color-border)] transition-shadow duration-150 ease-soft hover:shadow-[0_0_0_1px_var(--color-text-subtle)] has-[:checked]:bg-(--color-brand)/8 has-[:checked]:shadow-[0_0_0_2px_var(--color-brand-deep)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--color-brand-deep)"
              >
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
              aria-invalid={showAreaError || undefined}
              aria-describedby={showAreaError ? "checkout-area-error" : undefined}
              onChange={(e) => updateCheckoutDetails({ area: e.target.value })}
              onBlur={() => setTouched((s) => ({ ...s, area: true }))}
              className={`${FIELD} h-11 ${showAreaError ? FIELD_ERROR : FIELD_OK}`}
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
            {showAreaError ? (
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
                  aria-invalid={showAreaOtherError || undefined}
                  aria-describedby={showAreaOtherError ? "checkout-area-other-error" : undefined}
                  onChange={(e) => updateCheckoutDetails({ areaOther: e.target.value })}
                  onBlur={() => setTouched((s) => ({ ...s, areaOther: true }))}
                  className={`${FIELD} h-11 ${showAreaOtherError ? FIELD_ERROR : FIELD_OK}`}
                />
                {showAreaOtherError ? (
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
          {valid ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSend}
              data-conversion-value={totals.pricedSubtotal > 0 ? totals.pricedSubtotal : undefined}
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
          <p className="text-center text-caption text-(--color-text-muted)">{t("sendHint")}</p>
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
