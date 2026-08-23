import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { PinIcon, ClockIcon, PhoneIcon, MailIcon } from "@/components/ui/Icons";
import { LazyMapEmbed } from "@/components/contact/LazyMapEmbed";
import { SITE } from "@/lib/constants";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: meta("contactTitle"),
    description: meta("contactDescription"),
    ...pageMeta(locale as Locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as "en" | "ar";
  const store = await cookies();
  const audience = store.get("abk_audience")?.value === "b2b" ? "b2b" : "b2c";
  const t = await getTranslations({ locale });

  // LocalBusiness JSON-LD lives here (NAP-rich page) so Google has a single
  // canonical source per-locale for address/phone/hours. Also on audience
  // homepages. Removed from every other page to reduce duplicate-schema noise.
  const jsonLd = localBusinessJsonLd(l);
  const waHref = `https://wa.me/${SITE.whatsapp}`;

  return (
    <Shell audience={audience} locale={l}>
      <JsonLd id="ld-localbusiness-contact" data={jsonLd} />

      <section className="pb-8 pt-10 sm:pt-14 lg:pt-20">
        <Container>
          <SectionHeading
            as="h1"
            size="display"
            title={t("Contact.heading")}
            subtitle={t("Contact.subtitle")}
          />
          <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="tile flex flex-col gap-5 p-6">
                <InfoRow
                  icon={<PinIcon className="h-[18px] w-[18px]" />}
                  label={t("Contact.address")}
                  value={t("Contact.addressValue")}
                />
                <InfoRow
                  icon={<ClockIcon className="h-[18px] w-[18px]" />}
                  label={t("Contact.hours")}
                  value={
                    <>
                      <p>
                        {t("Contact.hoursSatToThu")}:{" "}
                        <span className="ltr-nums">
                          {SITE.hours.weekdaysMorning} &middot; {SITE.hours.weekdaysEvening}
                        </span>
                      </p>
                      <p className="text-(--color-text-muted)">
                        {t("Contact.hoursFri")}: {t("Contact.hoursClosed")}
                      </p>
                    </>
                  }
                />
                <InfoRow
                  icon={<PhoneIcon className="h-[18px] w-[18px]" />}
                  label={t("Contact.phone")}
                  value={
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ltr-nums transition-colors hover:text-(--color-link)"
                    >
                      {SITE.phone}
                    </a>
                  }
                />
                <InfoRow
                  icon={<MailIcon className="h-[18px] w-[18px]" />}
                  label={t("Contact.email")}
                  value={
                    <a
                      href={`mailto:${SITE.email}`}
                      className="transition-colors hover:text-(--color-link)"
                    >
                      {SITE.email}
                    </a>
                  }
                />
                <div className="flex flex-wrap gap-3 border-t border-(--color-border-soft) pt-5">
                  <ButtonLink
                    href={SITE.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    {t("Cta.openMap")}
                  </ButtonLink>
                  <ButtonLink
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                  >
                    {t("Cta.whatsAppUs")}
                  </ButtonLink>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <LazyMapEmbed
                label={t("Contact.mapLoadAria")}
                iframeTitle={t("Contact.directionsLabel")}
                ctaLabel={t("Contact.mapLoadCta")}
                hintLabel={t("Contact.mapLoadHint")}
                locale={l}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Internal cross-links from Contact — common SEO weakness is that
          Contact is a leaf page with no outbound links. Keyword-rich
          anchors give Google a topical map without disrupting the page's
          "get in touch" intent. */}
      <section className="py-6 lg:py-8">
        <Container>
          <nav aria-label={t("Contact.exploreTitle")} className="tile p-6">
            <h2 className="text-title-sm font-semibold">{t("Contact.exploreTitle")}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <TextLink href="/b2c/services">
                  {t("Contact.exploreServicesLabel")}
                </TextLink>
              </li>
              <li>
                <TextLink href={`/${audience}/products`}>
                  {t("Contact.exploreProductsLabel")}
                </TextLink>
              </li>
              <li>
                <TextLink href="/b2b/become-a-dealer">
                  {t("Contact.exploreDealerLabel")}
                </TextLink>
              </li>
            </ul>
          </nav>
        </Container>
      </section>
    </Shell>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-caption font-semibold text-(--color-text-muted)">{label}</p>
        <div className="mt-0.5 text-body text-(--color-text)">{value}</div>
      </div>
    </div>
  );
}
