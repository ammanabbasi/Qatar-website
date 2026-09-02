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
}: {
  current: Audience;
  /** "dark" matches the dark hero header. */
  tone?: "light" | "dark";
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
      className={`inline-flex h-8 items-center rounded-pill p-0.5 text-caption font-medium ${
        dark ? "bg-white/12" : "bg-(--color-fill)"
      }`}
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
            className={`h-7 rounded-pill px-3.5 transition-colors duration-200 ease-soft ${
              active
                ? "bg-white text-(--color-text) shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
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
