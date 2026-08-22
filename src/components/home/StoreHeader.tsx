import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { ChatIcon, PinIcon } from "@/components/ui/Icons";
import { SITE } from "@/lib/constants";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";

type Props = {
  audience: Audience;
  locale: WALocale;
};

/**
 * "Store. The best way to buy the products you love." — headline left,
 * specialist / visit links right.
 */
export function StoreHeader({ audience, locale }: Props) {
  const t = useTranslations("Home");
  const waHref = buildWhatsAppUrl({ audience, locale });
  const b2c = audience === "b2c";

  return (
    <section className="pb-4 pt-10 sm:pt-14 lg:pb-6 lg:pt-20">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        {/* The tagline carries the search terms (paint protection film,
            ceramic coatings, Doha…) so it stays INSIDE the h1 as a block —
            the page's primary heading is never just "Car care." */}
        <h1 className="two-tone text-display font-bold lg:text-display-lg">
          <span>{b2c ? t("storeTitleB2c") : t("storeTitleB2b")}</span>
          <span className="mt-3 block max-w-2xl text-title-sm font-semibold sm:mt-4 lg:text-title">
            {b2c ? t("storeTaglineB2c") : t("storeTaglineB2b")}
          </span>
        </h1>

        <ul className="flex flex-col gap-3 lg:items-end">
          <li className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
              <ChatIcon className="h-[18px] w-[18px]" />
            </span>
            <p className="text-footnote">
              <span className="text-(--color-text-muted)">{t("helpChoosing")}</span>{" "}
              <TextLink
                external
                icon="external"
                size="footnote"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience}`}
              >
                {t("chatSpecialist")}
              </TextLink>
            </p>
          </li>
          <li className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
              <PinIcon className="h-[18px] w-[18px]" />
            </span>
            <p className="text-footnote">
              <TextLink
                external
                icon="external"
                size="footnote"
                href={SITE.mapsQuery}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("visitStore")}
              </TextLink>
            </p>
          </li>
        </ul>
      </Container>
    </section>
  );
}
