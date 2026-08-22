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
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "dark" | "light" | "outline";
  showEmailFallback?: boolean;
  className?: string;
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
  className = "",
}: Props) {
  const href = buildWhatsAppUrl({ audience, locale, productName, productUrl });
  const subject = productName
    ? `Inquiry: ${productName}`
    : audience === "b2b"
      ? "Wholesale inquiry"
      : "Product inquiry";
  // Plausible tagged events are class-based: `plausible-event-name=goal`
  // plus `plausible-event-<prop>=<value>` ("+" stands in for spaces).
  const plausible = `plausible-event-name=whatsapp_click plausible-event-audience=${audience}${
    productName ? ` plausible-event-product=${productName.replace(/\s+/g, "+")}` : ""
  }`;

  return (
    <div className="flex flex-col items-start gap-2.5">
      <ButtonLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        size={size}
        variant={variant}
        className={`${plausible} ${className}`}
      >
        <WhatsAppIcon className="h-5 w-5" />
        <span>{label}</span>
      </ButtonLink>
      {showEmailFallback && (
        <a
          href={buildMailto(subject)}
          className="text-caption text-(--color-text-muted) transition-colors hover:text-(--color-text)"
        >
          {emailFallbackLabel}{" "}
          <span className="ltr-nums underline underline-offset-2">sales@abktradingservice.com</span>
        </a>
      )}
    </div>
  );
}
