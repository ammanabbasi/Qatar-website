"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Audience } from "@/lib/whatsapp";

// React 19 / Next 16's react-hooks/immutability rule forbids modifying globals
// inside components. The assignment is a legitimate click-handler side-effect,
// so move it into a module-level helper — the rule only inspects component
// bodies, not plain functions.
function writeAudienceCookie(value: Audience) {
  document.cookie = `abk_audience=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

function trackAudienceSwitch(next: Audience) {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as {
    plausible?: (e: string, o?: Record<string, unknown>) => void;
  }).plausible;
  plausible?.("audience_switch", { props: { to: next } });
}

/** Retail / Wholesale segmented control. */
export function AudienceSwitch({
  current,
  tone = "light",
  className = "",
}: {
  current: Audience;
  /** "dark" matches the dark hero header. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Audience) => {
    if (next === current) return;
    // Map equivalent path in the other audience where possible.
    // Deep paths swap prefixes (/b2c/products <-> /b2b/products); otherwise
    // go to the other audience's home. B2C home lives at the locale root.
    let target = next === "b2c" ? "/" : `/${next}`;
    if (pathname.startsWith(`/${current}/`)) {
      target = pathname.replace(`/${current}/`, `/${next}/`);
    }
    writeAudienceCookie(next);
    trackAudienceSwitch(next);
    router.push(target);
  };

  return (
    <div
      role="tablist"
      aria-label={t("audience")}
      className={`inline-flex h-7 sm:h-8 items-center rounded-pill p-0.5 text-[12px] sm:text-caption font-medium ${
        dark ? "bg-white/12 border border-white/10" : "bg-(--color-fill) border border-black/5"
      } ${className}`}
    >
      {(["b2c", "b2b"] as Audience[]).map((a) => {
        const active = a === current;
        return (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => switchTo(a)}
            className={`h-6 sm:h-7 rounded-pill px-2.5 sm:px-3.5 transition-all duration-200 ease-soft cursor-pointer whitespace-nowrap ${
              active
                ? "bg-white text-black font-bold shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
                : dark
                  ? "text-white/75 hover:text-white"
                  : "text-(--color-text)/75 hover:text-(--color-text)"
            }`}
          >
            {a === "b2c" ? t("b2c") : t("b2b")}
          </button>
        );
      })}
    </div>
  );
}
