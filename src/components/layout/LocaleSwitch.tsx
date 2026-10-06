"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch({
  current,
  tone = "light",
}: {
  current: "en" | "ar";
  /** "dark" matches the dark hero header. */
  tone?: "light" | "dark";
}) {
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
    // Keep the query string (catalogue filters) across the language switch.
    // Read at click time: ProductGrid rewrites the address bar with
    // history.replaceState, so it can be newer than any router state. An
    // object href with an empty query would append a bare "?" to the path.
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace(
      Object.keys(query).length > 0 ? { pathname, query } : pathname,
      { locale: next },
    );
  };

  // Label is written in the TARGET language so the reader who needs it can
  // find it — an Arabic speaker on the English site sees "العربية".
  return (
    <button
      type="button"
      onClick={swap}
      lang={next}
      aria-label={t("switchLanguage", { lang: nextName })}
      className={`inline-flex h-8 items-center rounded-pill px-3 text-caption font-medium transition-colors duration-200 ease-soft ${
        tone === "dark"
          ? "text-white/90 hover:bg-white/10"
          : "text-(--color-text) hover:bg-(--color-fill)"
      }`}
    >
      {nextName}
    </button>
  );
}
