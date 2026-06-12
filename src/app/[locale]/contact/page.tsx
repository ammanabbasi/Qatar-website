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
import { Link } from "@/i18n/navigation";
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

  return (
    <Shell audience={audience} locale={l}>
      <JsonLd id="ld-localbusiness-contact" data={jsonLd} />
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${t("Eyebrows.visitUs")}`}
            title={t("Contact.title")}
            subtitle={t("Contact.subtitle")}
          />
          <div className="mt-12 grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <InfoRow label={t("Contact.address")} value={t("Contact.addressValue")} />
              <InfoRow
                label={t("Contact.hours")}
                value={
                  <>
                    <p>
                      <span className="text-(--color-text)">
                        {t("Contact.hoursSatToThu")}:
                      </span>{" "}
                      <span className="ltr-nums">
                        {SITE.hours.weekdaysMorning} · {SITE.hours.weekdaysEvening}
                      </span>
                    </p>
                    <p>
                      <span className="text-(--color-text)">
                        {t("Contact.hoursFri")}:
                      </span>{" "}
                      {t("Contact.hoursClosed")}
                    </p>
                  </>
                }
              />
              <InfoRow
                label={t("Contact.phone")}
                value={
                  <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="ltr-nums hover:text-(--color-gold)">
                    {SITE.phone}
                  </a>
                }
              />
              <InfoRow
                label={t("Contact.email")}
                value={
                  <a href={`mailto:${SITE.email}`} className="hover:text-(--color-gold)">
                    {SITE.email}
                  </a>
                }
              />
              <div className="flex flex-wrap gap-3 mt-2">
                <ButtonLink
                  href={SITE.mapsQuery}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  {t("Cta.openMap")}
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  {t("Cta.whatsAppUs")}
                </ButtonLink>
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
          {/* Internal cross-links from Contact — common SEO weakness is that
              Contact is a leaf page with no outbound links. Keyword-rich
              anchors give Google a topical map without disrupting the page's
              "get in touch" intent. */}
          <nav
            aria-label={t("Contact.exploreTitle")}
            className="mt-14 sm:mt-16 pt-8 border-t border-(--color-border) flex flex-col gap-3"
          >
            <h3 className="font-display text-xl">
              {t("Contact.exploreTitle")}
            </h3>
            <ul className="flex flex-col gap-2 text-base">
              <li>
                <Link
                  href="/b2c/services"
                  className="text-(--color-gold) hover:underline underline-offset-4"
                >
                  {t("Contact.exploreServicesLabel")} →
                </Link>
              </li>
              <li>
                <Link
                  href={`/${audience}/products`}
                  className="text-(--color-gold) hover:underline underline-offset-4"
                >
                  {t("Contact.exploreProductsLabel")} →
                </Link>
              </li>
              <li>
                <Link
                  href="/b2b/become-a-dealer"
                  className="text-(--color-gold) hover:underline underline-offset-4"
                >
                  {t("Contact.exploreDealerLabel")} →
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </section>
    </Shell>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-s-2 border-(--color-gold)/40 ps-4 py-1">
      <p className="text-[10px] uppercase tracking-[0.22em] text-(--color-gold) mb-1">
        {label}
      </p>
      <div className="text-base text-(--color-text-muted) leading-relaxed">
        {value}
      </div>
    </div>
  );
}
