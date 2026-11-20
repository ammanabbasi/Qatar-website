/**
 * The WhatsApp way out of a page that crashed (error.tsx, global-error.tsx).
 * The message says the site failed and on which page, and carries the
 * shopper's cart straight from storage — product slugs and quantities — so an
 * error never costs an order. Deliberately dependency-free: it runs in error
 * pages, where the app's own modules (cart store, catalogue, translations)
 * may be what broke.
 */

const PHONE = "97430838355";
/** The retail cart's storage key (CART_KEYS.b2c in src/lib/cart.ts). */
const CART_KEY = "abk_cart_b2c";

export function rescueWhatsAppMessage(locale: "en" | "ar", path: string, rawCart: string | null): string {
  const ar = locale === "ar";
  const out = [
    ar ? "السلام عليكم ABK، ظهر خطأ في الموقع أثناء طلبي." : "Hi ABK, the website showed an error while I was ordering.",
  ];
  if (path) out.push(ar ? `الصفحة: ${path}` : `Page: ${path}`);
  try {
    const cart = rawCart ? (JSON.parse(rawCart) as { lines?: unknown; ref?: unknown } | null) : null;
    const lines: unknown[] = Array.isArray(cart?.lines) ? cart.lines : [];
    const items = lines
      .filter(
        (l): l is { slug: string; qty: number } =>
          typeof (l as { slug?: unknown } | null)?.slug === "string" &&
          typeof (l as { qty?: unknown }).qty === "number" &&
          (l as { qty: number }).qty > 0,
      )
      .slice(0, 40);
    if (items.length > 0) {
      if (typeof cart?.ref === "string" && cart.ref) out.push(ar ? `رقم الطلب: ${cart.ref}` : `Order ref: ${cart.ref}`);
      out.push(ar ? "سلتي:" : "My cart:");
      for (const l of items) out.push(`• ${l.slug} × ${l.qty}`);
    }
  } catch {
    // An unreadable cart: the message still says what happened and where.
  }
  out.push(ar ? "يرجى مساعدتي في إتمام الطلب. شكراً لكم!" : "Please help me complete my order. Thank you!");
  return out.join("\n");
}

/** Reads the page and the stored cart in the browser; a plain chat link if anything is unavailable. */
export function rescueWhatsAppUrl(locale?: "en" | "ar"): string {
  let path = "";
  let raw: string | null = null;
  try {
    path = window.location.pathname;
  } catch {
    // no window: the message goes without the page
  }
  try {
    raw = window.localStorage.getItem(CART_KEY);
  } catch {
    // storage blocked: the message goes without the cart
  }
  const lang = locale ?? (path === "/ar" || path.startsWith("/ar/") ? "ar" : "en");
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(rescueWhatsAppMessage(lang, path, raw))}`;
}
