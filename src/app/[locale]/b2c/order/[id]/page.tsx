import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { OrderResult, type OrderView } from "@/components/payments/OrderResult";
import { getCartCatalogue } from "@/data/cartCatalogue";
import { findProduct } from "@/lib/pricing";
import { isValidOrderToken, orderCookieName, orderLinkPath, orderPagePath } from "@/lib/payments/config";
import { isOrderId, readOrder, type Order } from "@/lib/payments/orders";
import { buildPaidOrderWhatsAppUrl, buildPaymentHelpWhatsAppUrl } from "@/lib/whatsapp";

/**
 * /[locale]/b2c/order/[id] — where SADAD's callback lands the customer.
 * Rendered per request from the stored order. Opening it needs the order's key
 * (an HMAC of the order id, see src/lib/payments/config.ts), so knowing an
 * order id from a WhatsApp message is not enough. The key arrives as a private
 * cookie (set by the callback or /api/orders/open); a link that carries it as
 * `?t=` is traded for that cookie and the plain address, so the page normally
 * never renders with the key in its address, where analytics, history and
 * shared links would see it. Only a browser that refuses the cookie (`c=1`
 * came back without it) is shown the page at the keyed address.
 */
export const dynamic = "force-dynamic";

type Params = Promise<{ locale: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Order" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

function statusFor(order: Order): OrderView["status"] {
  if (order.status === "paid") return "paid";
  if (order.status === "failed") return "failed";
  if (order.status === "review") return "review";
  return "pending";
}

function toView(order: Order, locale: "en" | "ar"): OrderView {
  const catalogue = getCartCatalogue();
  const shop = order.shop;
  const ppf = order.ppf;
  const lines = (shop?.lines ?? []).map((l) => ({
    key: l.slug,
    name: l.size ? `${l.name[locale]} (${l.size[locale]})` : l.name[locale],
    qty: l.qty,
    lineQar: l.lineQar,
  }));
  const areaLabel = shop?.area[locale] ?? "";
  const ppfSummary = ppf
    ? [ppf.car, ppf.coverageLabel[locale], ppf.filmLabel[locale]].filter(Boolean).join(" · ")
    : undefined;

  const gaItems = shop
    ? shop.lines.map((l) => {
        const product = findProduct(catalogue, l.slug);
        return {
          item_id: l.slug,
          item_name: l.name.en,
          item_brand: product?.brand ?? "",
          item_category: product?.category ?? "",
          price: l.unitQar,
          quantity: l.qty,
        };
      })
    : [
        {
          item_id: `ppf-${ppf?.coverage ?? "job"}-${ppf?.film ?? ""}`,
          item_name: `PPF installation: ${ppf?.coverageLabel.en ?? ""} ${ppf?.filmLabel.en ?? ""}`.trim(),
          item_brand: "VTEK",
          item_category: "ppf-installation",
          price: order.totalQar,
          quantity: 1,
        },
      ];

  return {
    id: order.id,
    ref: order.ref,
    kind: order.kind,
    locale,
    status: statusFor(order),
    sandbox: order.payment?.sandbox ?? order.events.some((e) => e.sandbox),
    transactionNumber: order.payment?.transactionNumber ?? order.events.at(-1)?.transactionNumber ?? "",
    totalQar: order.totalQar,
    lines,
    subtotalQar: shop?.subtotalQar ?? null,
    discount: shop?.discount ?? null,
    deliveryFeeQar: shop ? shop.deliveryFeeQar : null,
    fulfilment: shop?.fulfilment ?? null,
    areaLabel,
    address: shop?.address ?? "",
    ppf: ppf
      ? {
          car: ppf.car,
          coverage: ppf.coverageLabel[locale],
          film: ppf.filmLabel[locale],
          preferredDate: ppf.preferredDate,
        }
      : null,
    email: order.customer.email,
    emailConfigured: Boolean(process.env.SMTP_PASS?.trim()),
    whatsappUrl: buildPaidOrderWhatsAppUrl({
      locale,
      kind: order.kind,
      ref: order.ref,
      totalQar: order.totalQar,
      transactionNumber: order.payment?.transactionNumber,
      name: order.customer.name,
      lines: lines.map((l) => ({ name: l.name, qty: l.qty })),
      fulfilment: shop?.fulfilment,
      areaLabel,
      address: shop?.address,
      ppfSummary,
    }),
    helpUrl: buildPaymentHelpWhatsAppUrl({
      locale,
      ref: order.ref,
      transactionNumber: order.payment?.transactionNumber ?? order.events.at(-1)?.transactionNumber,
    }),
    gaItems,
  };
}

/**
 * This order page can't be opened here: no key (a browser that blocks
 * cookies, an expired cookie, a link without it) or no such order. The
 * customer may have just paid, so it says the payment is safe and where the
 * confirmation is, and shows nothing about any order. Rendered by the page
 * itself (not notFound()) so it is in the customer's language.
 */
async function OrderUnavailable({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "Order" });
  return (
    <Shell audience="b2c" locale={locale} headerTone="light" floatingWhatsApp={false}>
      <Container className="py-20 text-center">
        <h1 className="text-headline font-bold tracking-tight text-(--color-text)">{t("notFoundTitle")}</h1>
        <p className="mx-auto mt-3 max-w-md text-body text-(--color-text-muted)">{t("notFoundMessage")}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildPaymentHelpWhatsAppUrl({ locale })}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClasses("primary", "lg")} font-semibold`}
          >
            {t("notFoundWhatsApp")}
          </a>
          <Link href="/b2c/products" className={buttonClasses("secondary", "lg")}>
            {t("notFoundShop")}
          </Link>
        </div>
      </Container>
    </Shell>
  );
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  if (!isOrderId(id)) notFound();
  const { t: token, c: cookieOffered } = await searchParams;
  const cookieOk = isValidOrderToken(id, (await cookies()).get(orderCookieName(id))?.value);
  if (isValidOrderToken(id, token)) {
    // The browser holds the cookie: take the key out of the address.
    if (cookieOk) redirect(orderPagePath(l, id));
    // Not offered yet (an old-style link): /api/orders/open sets it and comes back with c=1.
    if (cookieOffered === undefined) redirect(orderLinkPath(l, id));
    // Offered and not kept: this browser blocks cookies, so the key stays in the address.
  } else if (!cookieOk) {
    return <OrderUnavailable locale={l} />;
  }

  const found = await readOrder(id).catch((err: unknown) => {
    console.error(`[order-page] ${id}: ${err instanceof Error ? err.message : err}`);
    return null;
  });
  if (!found) return <OrderUnavailable locale={l} />;

  // The layout only ships shared namespaces to the browser; this page's own
  // strings travel with it, as PpfInstall does on the installation page.
  const allMessages = await getMessages();

  return (
    <Shell audience="b2c" locale={l} headerTone="light" floatingWhatsApp={false}>
      <NextIntlClientProvider messages={{ Order: allMessages.Order }}>
        <OrderResult order={toView(found.order, l)} />
      </NextIntlClientProvider>
    </Shell>
  );
}
