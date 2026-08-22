import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";

export default async function NotFound() {
  const t = await getTranslations("Home404");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-(--color-bg) px-6 text-center text-(--color-text)">
      <h1 className="text-headline font-semibold">{t("title")}</h1>
      <p className="max-w-md text-body text-(--color-text-muted)">
        {t("message")}
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-(--color-accent) px-[22px] text-body text-white transition-colors hover:bg-(--color-accent-hover)"
      >
        {t("cta")}
        <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
      </Link>
    </div>
  );
}
