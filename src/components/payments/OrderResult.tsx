"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, ClockIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { completePaidOrder } from "@/lib/cart";
import { formatNumber, formatPercent, formatQar } from "@/lib/pricing";
import { trackPurchase, type GaItem } from "@/lib/analytics";

/** What the order page shows — built on the server from the stored order. */
export type OrderView = {
  id: string;
  ref: string;
  kind: "shop" | "ppf";
  locale: "en" | "ar";
  status: "paid" | "pending" | "failed" | "review";
  sandbox: boolean;
  transactionNumber: string;
  totalQar: number;
  lines: { key: string; name: string; qty: number; lineQar: number }[];
  subtotalQar: number | null;
  /** online: the PPF pay-online discount rather than the cart's quantity discount. */
  discount: { percent: number; amountQar: number; online?: boolean } | null;
  deliveryFeeQar: number | null;
  fulfilment: "delivery" | "pickup" | null;
  areaLabel: string;
  address: string;
  ppf: { car: string; coverage: string; film: string; preferredDate: string } | null;
  email: string;
  emailConfigured: boolean;
  whatsappUrl: string;
  helpUrl: string;
  gaItems: GaItem[];
};

const POLL_MS = 5000;
const POLL_MAX = 24; // two minutes

export function OrderResult({ order }: { order: OrderView }) {
  const t = useTranslations("Order");
  const router = useRouter();
  const locale = order.locale;
  const qar = (n: number) => formatQar(n, locale);
  const polls = useRef(0);
  // Auto-refresh gives up after two minutes; the copy then stops promising it.
  const [stale, setStale] = useState(false);

  // Paid: empty the cart this order came from and report the purchase once.
  useEffect(() => {
    if (order.status !== "paid") return;
    if (order.kind === "shop") completePaidOrder(order.ref);
    if (!order.sandbox) {
      trackPurchase({
        orderId: order.id,
        ref: order.ref,
        kind: order.kind,
        valueQar: order.totalQar,
        shippingQar: order.deliveryFeeQar ?? 0,
        items: order.gaItems,
      });
    }
  }, [order]);

  // Pending: the webhook usually lands within seconds — re-read the order.
  useEffect(() => {
    if (order.status !== "pending") return;
    const timer = window.setInterval(() => {
      polls.current += 1;
      if (polls.current > POLL_MAX) {
        window.clearInterval(timer);
        setStale(true);
      } else {
        router.refresh();
      }
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [order.status, router]);

  const headline = {
    paid: t("paidTitle"),
    pending: t("pendingTitle"),
    failed: t("failedTitle"),
    review: t("reviewTitle"),
  }[order.status];

  const body =
    order.status === "paid"
      ? order.kind === "ppf"
        ? t("paidPpf", { ref: order.ref })
        : order.fulfilment === "pickup"
          ? t("paidPickup", { ref: order.ref })
          : t("paidDelivery", { ref: order.ref })
      : order.status === "pending"
        ? stale
          ? t("pendingStale")
          : t("pendingBody")
        : order.status === "failed"
          ? t("failedBody")
          : t("reviewBody");

  const tone =
    order.status === "paid"
      ? "bg-(--color-brand)/15 text-(--color-brand-deep)"
      : order.status === "failed"
        ? "bg-(--color-danger)/10 text-(--color-danger)"
        : "bg-(--color-fill) text-(--color-text-muted)";
  const Icon = order.status === "paid" ? CheckIcon : order.status === "failed" ? AlertIcon : ClockIcon;

  const retryHref = order.kind === "ppf" ? "/b2c/ppf-installation" : "/b2c/cart";

  return (
    <section className="pb-16 pt-8 sm:pb-20 sm:pt-12">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col gap-5">
          <div className="tile flex flex-col items-center gap-3 px-6 py-9 text-center sm:px-10">
            <span className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
              <Icon className={`h-7 w-7 ${order.status === "pending" ? "animate-pulse" : ""}`} />
            </span>
            <h1 className="text-title font-semibold text-(--color-text)">{headline}</h1>
            <p className="text-body text-(--color-text-muted)" role="status">
              {body}
            </p>
            {order.sandbox ? (
              <p className="rounded-pill bg-(--color-fill) px-3 py-1 text-caption font-semibold text-(--color-text)">
                {t("testBadge")}
              </p>
            ) : null}
          </div>

          <div className="tile flex flex-col gap-4 p-5 sm:p-6">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-footnote">
              <dt className="text-(--color-text-muted)">
                {order.kind === "ppf" ? t("bookingRefLabel") : t("refLabel")}
              </dt>
              <dd className="ltr-nums text-end font-mono font-semibold text-(--color-text)">{order.ref}</dd>
              {order.transactionNumber ? (
                <>
                  <dt className="text-(--color-text-muted)">{t("txnLabel")}</dt>
                  <dd className="ltr-nums text-end font-mono text-(--color-text)">{order.transactionNumber}</dd>
                </>
              ) : null}
            </dl>

            {order.lines.length > 0 ? (
              <div className="border-t border-(--color-border-soft) pt-4">
                <h2 className="text-footnote font-semibold text-(--color-text)">{t("itemsTitle")}</h2>
                <ul className="mt-2 flex flex-col gap-1.5 text-footnote">
                  {order.lines.map((l) => (
                    <li key={l.key} className="flex items-baseline justify-between gap-3">
                      <span className="text-(--color-text)">
                        {l.name}
                        <span className="text-(--color-text-muted)"> × {formatNumber(l.qty, locale)}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-(--color-text)">{qar(l.lineQar)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {order.ppf ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-(--color-border-soft) pt-4 text-footnote">
                {order.ppf.car ? (
                  <>
                    <dt className="text-(--color-text-muted)">{t("car")}</dt>
                    <dd className="text-end text-(--color-text)">{order.ppf.car}</dd>
                  </>
                ) : null}
                <dt className="text-(--color-text-muted)">{t("coverage")}</dt>
                <dd className="text-end text-(--color-text)">{order.ppf.coverage}</dd>
                <dt className="text-(--color-text-muted)">{t("film")}</dt>
                <dd className="text-end text-(--color-text)">{order.ppf.film}</dd>
                {order.ppf.preferredDate ? (
                  <>
                    <dt className="text-(--color-text-muted)">{t("preferredDate")}</dt>
                    <dd className="ltr-nums text-end text-(--color-text)">{order.ppf.preferredDate}</dd>
                  </>
                ) : null}
              </dl>
            ) : null}

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-(--color-border-soft) pt-4 text-footnote">
              {order.subtotalQar !== null ? (
                <>
                  <dt className="text-(--color-text-muted)">{t("subtotal")}</dt>
                  <dd className="text-end tabular-nums text-(--color-text)">{qar(order.subtotalQar)}</dd>
                </>
              ) : null}
              {order.discount ? (
                <>
                  <dt className="text-(--color-text-muted)">
                    {t(order.discount.online ? "onlineDiscount" : "discount", {
                      percent: formatPercent(order.discount.percent, locale),
                    })}
                  </dt>
                  <dd className="text-end tabular-nums text-(--color-brand-deep)">
                    −{qar(order.discount.amountQar)}
                  </dd>
                </>
              ) : null}
              {order.fulfilment ? (
                <>
                  <dt className="text-(--color-text-muted)">
                    {order.fulfilment === "pickup" ? t("pickup") : t("deliverTo")}
                  </dt>
                  <dd className="text-end text-(--color-text)">
                    {order.fulfilment === "pickup"
                      ? t("pickupPlace")
                      : [order.areaLabel, order.address].filter(Boolean).join(" — ")}
                  </dd>
                  {order.fulfilment === "delivery" ? (
                    <>
                      <dt className="text-(--color-text-muted)">{t("delivery")}</dt>
                      <dd className="text-end tabular-nums text-(--color-text)">
                        {order.deliveryFeeQar ? qar(order.deliveryFeeQar) : t("deliveryFree")}
                      </dd>
                    </>
                  ) : null}
                </>
              ) : null}
              <dt className="pt-1 text-body font-semibold text-(--color-text)">
                {order.status === "paid" ? t("totalPaid") : t("total")}
              </dt>
              <dd className="pt-1 text-end text-body font-bold tabular-nums text-(--color-text)">
                {qar(order.totalQar)}
              </dd>
            </dl>

            {order.status === "paid" ? (
              <div className="flex flex-col gap-1 border-t border-(--color-border-soft) pt-4 text-caption text-(--color-text-muted)">
                {order.emailConfigured && order.email ? (
                  <p>
                    {t.rich("receiptSent", {
                      email: order.email,
                      // An LTR address inside an Arabic sentence needs isolating.
                      addr: (chunks) => <bdi dir="ltr">{chunks}</bdi>,
                    })}
                  </p>
                ) : null}
                {order.kind === "shop" ? (
                  <p>
                    {t("returnsNote")}{" "}
                    <Link href="/terms#returns" className="text-(--color-link) hover:underline">
                      {t("returnsLink")}
                    </Link>
                  </p>
                ) : (
                  <p>{t("cancelNote")}</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {order.status === "paid" ? (
              <>
                <ButtonLink
                  href={order.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  data-order-ref={order.ref}
                  data-placement="order_paid"
                  className="plausible-event-name=whatsapp_click plausible-event-audience=b2c font-semibold"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t("whatsApp")}
                </ButtonLink>
                <Link href="/b2c/products" className={`${buttonClasses("secondary", "lg")}`}>
                  {t("continueShopping")}
                </Link>
              </>
            ) : order.status === "pending" ? (
              <>
                <Button size="lg" variant="secondary" onClick={() => router.refresh()}>
                  {t("refresh")}
                </Button>
                <ButtonLink href={order.helpUrl} target="_blank" rel="noopener noreferrer" size="lg" variant="secondary">
                  <WhatsAppIcon className="h-5 w-5" />
                  {t("whatsApp")}
                </ButtonLink>
              </>
            ) : order.status === "failed" ? (
              <>
                <Link href={retryHref} className={`${buttonClasses("primary", "lg")} font-semibold`}>
                  {t("tryAgain")}
                </Link>
                {/* The whole order goes in the message: sending it IS the order (or booking) on WhatsApp. */}
                <ButtonLink
                  href={order.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="secondary"
                  data-placement={order.kind === "ppf" ? "ppf_booking" : "cart"}
                  data-order-ref={order.ref}
                  data-conversion-value={order.kind === "ppf" ? order.totalQar : order.totalQar - (order.deliveryFeeQar ?? 0)}
                  data-conversion-currency="QAR"
                  className={`plausible-event-name=${order.kind === "ppf" ? "whatsapp_click" : "cart_whatsapp_send"} plausible-event-audience=b2c font-semibold`}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {order.kind === "ppf" ? t("whatsAppBook") : t("whatsAppOrder")}
                </ButtonLink>
              </>
            ) : (
              <ButtonLink href={order.helpUrl} target="_blank" rel="noopener noreferrer" size="lg">
                <WhatsAppIcon className="h-5 w-5" />
                {t("whatsApp")}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
