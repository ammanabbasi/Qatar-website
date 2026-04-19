import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { Shell } from "@/components/layout/Shell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "About" });
  // `title.absolute` bypasses the `%s · ABK` template suffix so we don't
  // produce "About ABK · ABK". The title is already brand-inclusive.
  return {
    title: { absolute: t("title") },
    description: t("subtitle"),
    ...pageMeta(locale as Locale, "/about"),
  };
}

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
  const e = await getTranslations({ locale, namespace: "Eyebrows" });

  return (
    <Shell audience={audience} locale={l}>
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={`⸻ ${e("ourStory")}`}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="mt-12 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6 text-lg text-(--color-text-muted) leading-relaxed">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
              <p>{t("paragraph3")}</p>
            </div>
            <aside className="flex flex-col gap-5">
              <h3 className="font-display text-xl">{t("valuesTitle")}</h3>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-(--color-border) bg-(--color-surface)"
                >
                  <h4 className="font-medium mb-1">
                    {t(`value${i}Title`)}
                  </h4>
                  <p className="text-sm text-(--color-text-muted)">
                    {t(`value${i}Desc`)}
                  </p>
                </div>
              ))}
            </aside>
          </div>
        </Container>
      </section>
    </Shell>
  );
}
