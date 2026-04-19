import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Home404");
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-5 px-6 text-center bg-(--color-bg) text-(--color-text)">
      <h1 className="font-display text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="text-(--color-text-muted) max-w-md">{t("message")}</p>
      <Link
        href="/b2c"
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-(--color-gold) text-(--color-bg) px-6 h-11 text-sm font-medium"
      >
        {t("cta")} →
      </Link>
    </div>
  );
}
