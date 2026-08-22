import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  audience: Audience;
  locale: WALocale;
  label: string;
};

/** Persistent chat entry point — a circle on phones, a labelled pill from sm up. */
export function FloatingWhatsApp({ audience, locale, label }: Props) {
  const href = buildWhatsAppUrl({ audience, locale });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      // Plausible goals are tagged by CLASS (plausible-event-name=…), not data attributes.
      // z-30 keeps it under the header's z-40 stacking context so the open
      // mobile sheet covers it.
      className={`plausible-event-name=whatsapp_floating_click plausible-event-audience=${audience} fixed bottom-5 end-5 z-30 inline-flex h-14 w-14 items-center justify-center gap-2.5 rounded-pill bg-(--color-accent) text-white shadow-[0_8px_24px_rgba(0,113,227,0.35)] transition-colors duration-200 ease-soft hover:bg-(--color-accent-hover) sm:w-auto sm:ps-4 sm:pe-5`}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-footnote font-medium sm:inline">{label}</span>
    </a>
  );
}
