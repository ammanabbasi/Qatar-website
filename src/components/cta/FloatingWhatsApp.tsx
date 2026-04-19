import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  audience: Audience;
  locale: WALocale;
  label: string;
};

export function FloatingWhatsApp({ audience, locale, label }: Props) {
  const href = buildWhatsAppUrl({ audience, locale });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-plausible-event="whatsapp_floating_click"
      data-plausible-event-audience={audience}
      className="fixed bottom-5 end-5 z-50 group inline-flex items-center gap-3 rounded-full bg-[#25D366] text-black ps-4 pe-5 h-14 shadow-[0_10px_30px_-6px_rgba(37,211,102,0.5)] hover:bg-[#1fbe5c] transition-all"
    >
      <WhatsAppIcon className="w-6 h-6" />
      <span className="text-sm font-semibold hidden sm:inline">{label}</span>
    </a>
  );
}
