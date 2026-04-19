"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch({ current }: { current: "en" | "ar" }) {
  const pathname = usePathname();
  const router = useRouter();

  const next: "en" | "ar" = current === "en" ? "ar" : "en";

  const swap = () => {
    if (typeof window !== "undefined" && (window as unknown as { plausible?: (e: string, o?: Record<string, unknown>) => void }).plausible) {
      (window as unknown as { plausible: (e: string, o?: Record<string, unknown>) => void }).plausible("language_switch", {
        props: { to: next },
      });
    }
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      type="button"
      onClick={swap}
      aria-label={`Switch language to ${next === "ar" ? "العربية" : "English"}`}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-(--color-border) text-xs font-semibold tracking-wider hover:border-(--color-gold) hover:text-(--color-gold) transition-colors"
    >
      {next === "ar" ? "ع" : "EN"}
    </button>
  );
}
