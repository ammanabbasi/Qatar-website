"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch({ current }: { current: "en" | "ar" }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();

  const next: "en" | "ar" = current === "en" ? "ar" : "en";
  const nextName = t(next === "ar" ? "switchToArabic" : "switchToEnglish");

  const swap = () => {
    if (typeof window !== "undefined" && (window as unknown as { plausible?: (e: string, o?: Record<string, unknown>) => void }).plausible) {
      (window as unknown as { plausible: (e: string, o?: Record<string, unknown>) => void }).plausible("language_switch", {
        props: { to: next },
      });
    }
    router.replace(pathname, { locale: next });
  };

  // Label is written in the TARGET language so the reader who needs it can
  // find it — an Arabic speaker on the English site sees "العربية".
  return (
    <button
      type="button"
      onClick={swap}
      lang={next}
      aria-label={t("switchLanguage", { lang: nextName })}
      className="inline-flex h-8 items-center rounded-pill px-3 text-caption font-medium text-(--color-text) transition-colors duration-200 ease-soft hover:bg-(--color-fill)"
    >
      {nextName}
    </button>
  );
}
