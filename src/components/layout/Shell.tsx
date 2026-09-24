import { useTranslations } from "next-intl";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";
import { getCartCatalogue } from "@/data/cartCatalogue";
import type { Audience, WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
  /** Every page opens with a dark band (HomeHero or PageHero), so the
      dark glass header is the default; "light" remains for one-offs. */
  headerTone?: "light" | "dark";
  /** Off on the cart page: its generic "Hi ABK" message would bypass the
      order the shopper is building there. */
  floatingWhatsApp?: boolean;
  children: React.ReactNode;
};

export function Shell({
  audience,
  locale,
  headerTone = "dark",
  floatingWhatsApp = true,
  children,
}: Props) {
  const t = useTranslations("Cta");
  return (
    // The slim catalogue projection is built here, on the server, so the cart
    // never pulls the full products.ts into the browser bundle.
    <CartProvider audience={audience} locale={locale} catalogue={getCartCatalogue()}>
      <Header audience={audience} tone={headerTone} />
      <main id="main" className="flex-1">
        {children}
        {/* Inside <main> so every piece of page content sits in a landmark;
            they are position: fixed, so DOM order doesn't change where they show. */}
        {floatingWhatsApp ? (
          <FloatingWhatsApp audience={audience} locale={locale} label={t("whatsAppUs")} />
        ) : null}
        <CartDrawer />
        <CartToast />
      </main>
      <Footer audience={audience} />
    </CartProvider>
  );
}
