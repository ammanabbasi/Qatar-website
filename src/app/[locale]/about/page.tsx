import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { BadgeIcon, TruckIcon, SparkleIcon } from "@/components/ui/Icons";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  // `title.absolute` bypasses the `%s · ABK` template suffix so we don't
  // produce "About ABK Trading & Service · ABK". The title is already brand-inclusive.
  return {
    title: { absolute: meta("aboutTitle") },
    description: meta("aboutDescription"),
    ...pageMeta(locale as Locale, "/about"),
  };
}

const VALUES = [
  { i: 1, Icon: BadgeIcon },
  { i: 2, Icon: TruckIcon },
  { i: 3, Icon: SparkleIcon },
] as const;

export default async function AboutPage({
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
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <Shell audience={audience} locale={l}>
      <section className="pb-8 pt-10 sm:pt-14 lg:pt-20">
        <Container>
          <SectionHeading
            as="h1"
            size="display"
            title={t("heading")}
            subtitle={t("subtitle")}
          />
          <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="flex flex-col gap-5">
              <p className="text-body-lg text-(--color-text-muted)">{t("paragraph1")}</p>
              <p className="text-body-lg text-(--color-text-muted)">{t("paragraph2")}</p>
              <p className="text-body-lg text-(--color-text-muted)">{t("paragraph3")}</p>
            </div>
            <aside className="flex flex-col gap-4">
              <h2 className="text-title-sm font-semibold">{t("valuesTitle")}</h2>
              {VALUES.map(({ i, Icon }) => (
                <div key={i} className="tile flex gap-4 p-5">
                  <span
                    aria-hidden
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-body font-semibold">{t(`value${i}Title`)}</h3>
                    <p className="mt-1 text-footnote text-(--color-text-muted)">
                      {t(`value${i}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </Container>
      </section>

      {/* Internal cross-links — keyword-rich anchors so Google sees About
          as a linking hub for products + services + dealer pages, not a
          link-equity dead end. */}
      <section className="py-6 lg:py-8">
        <Container>
          <nav aria-label={t("exploreTitle")} className="tile p-6">
            <h2 className="text-title-sm font-semibold">{t("exploreTitle")}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <TextLink href={`/${audience}/products`}>
                  {t("exploreProductsLabel")}
                </TextLink>
              </li>
              <li>
                <TextLink href="/b2c/services">{t("exploreServicesLabel")}</TextLink>
              </li>
              <li>
                <TextLink href="/b2b/become-a-dealer">{t("exploreDealerLabel")}</TextLink>
              </li>
            </ul>
          </nav>
        </Container>
      </section>
    </Shell>
  );
}
