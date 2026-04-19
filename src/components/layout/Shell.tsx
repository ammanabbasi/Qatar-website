import { useTranslations } from "next-intl";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import type { Audience, WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
  children: React.ReactNode;
};

export function Shell({ audience, locale, children }: Props) {
  const t = useTranslations("Cta");
  return (
    <>
      <Header audience={audience} />
      <main id="main" className="flex-1">{children}</main>
      <Footer audience={audience} />
      <FloatingWhatsApp
        audience={audience}
        locale={locale}
        label={t("whatsAppUs")}
      />
    </>
  );
}
