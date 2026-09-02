import { useTranslations } from "next-intl";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import type { Audience, WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
  /** Every page opens with a dark band (HomeHero or PageHero), so the
      dark glass header is the default; "light" remains for one-offs. */
  headerTone?: "light" | "dark";
  children: React.ReactNode;
};

export function Shell({ audience, locale, headerTone = "dark", children }: Props) {
  const t = useTranslations("Cta");
  return (
    <>
      <Header audience={audience} tone={headerTone} />
      <main id="main" className="flex-1">
        {children}
        {/* Inside <main> so every piece of page content sits in a landmark;
            it is position: fixed, so DOM order doesn't change where it shows. */}
        <FloatingWhatsApp
          audience={audience}
          locale={locale}
          label={t("whatsAppUs")}
        />
      </main>
      <Footer audience={audience} />
    </>
  );
}
