import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { buildWhatsAppUrl, buildMailto, type Audience, type WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
  productName?: string;
  productUrl?: string;
  label: string;
  emailFallbackLabel: string;
  size?: "md" | "lg";
  variant?: "primary" | "outline" | "ghost";
  showEmailFallback?: boolean;
};

export function WhatsAppButton({
  audience,
  locale,
  productName,
  productUrl,
  label,
  emailFallbackLabel,
  size = "md",
  variant = "primary",
  showEmailFallback = true,
}: Props) {
  const href = buildWhatsAppUrl({ audience, locale, productName, productUrl });
  const subject = productName
    ? `Inquiry: ${productName}`
    : audience === "b2b"
      ? "Wholesale inquiry"
      : "Product inquiry";

  return (
    <div className="flex flex-col gap-2 items-start rtl:items-end">
      <ButtonLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        size={size}
        variant={variant}
        data-plausible-event="whatsapp_click"
        data-plausible-event-audience={audience}
        data-plausible-event-product={productName ?? ""}
      >
        <WhatsAppIcon className="w-5 h-5" />
        <span>{label}</span>
      </ButtonLink>
      {showEmailFallback && (
        <a
          href={buildMailto(subject)}
          className="text-xs text-(--color-text-muted) hover:text-(--color-gold) transition-colors"
        >
          {emailFallbackLabel}{" "}
          <span className="text-(--color-text) ltr-nums">
            ceo.abktrading@gmail.com
          </span>
        </a>
      )}
    </div>
  );
}
