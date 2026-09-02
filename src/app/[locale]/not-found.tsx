import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "@/components/ui/Icons";

// Rendered without the Shell, so the dark ground + gold CTA are inlined to
// match the site's dark page openers.
export default async function NotFound() {
  const t = await getTranslations("Home404");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-(--color-hero-dark) px-6 text-center text-white">
      <h1 className="text-headline font-bold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-body text-white/70">
        {t("message")}
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-(--color-brand) px-[22px] text-body font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand-hover)"
      >
        {t("cta")}
        <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
      </Link>
    </div>
  );
}
