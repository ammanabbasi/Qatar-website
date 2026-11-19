import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { OrderResult, type OrderView } from "@/components/payments/OrderResult";
import { getCartCatalogue } from "@/data/cartCatalogue";
import { findProduct } from "@/lib/pricing";
import { isValidOrderToken } from "@/lib/payments/config";
import { isOrderId, readOrder, type Order } from "@/lib/payments/orders";
import { buildPaidOrderWhatsAppUrl, buildPaymentHelpWhatsAppUrl } from "@/lib/whatsapp";

/**
 * /[locale]/b2c/order/[id]?t=… — where SADAD's callback lands the customer.
 * Rendered per request from the stored order; the `t` token (an HMAC of the
 * order id, see src/lib/payments/config.ts) is required, so knowing an order
 * id from a WhatsApp message is not enough to open its page.
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
  const { t: token } = await searchParams;
  if (!isOrderId(id) || !isValidOrderToken(id, token)) notFound();

  const found = await readOrder(id).catch((err: unknown) => {
    console.error(`[order-page] ${id}: ${err instanceof Error ? err.message : err}`);
    return null;
  });
  if (!found) notFound();

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
