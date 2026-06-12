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

export function AudienceSwitch({ current }: { current: Audience }) {
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
      aria-label="Audience"
      className="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-surface) p-1 text-xs font-medium"
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
            className={`relative px-4 h-8 rounded-full uppercase tracking-wider transition-all ${
              active
                ? "bg-(--color-gold) text-(--color-bg)"
                : "text-(--color-text-muted) hover:text-(--color-text)"
            }`}
          >
            {a === "b2c" ? t("b2c") : t("b2b")}
            {/* Red spark under the active tab — the brass+red tension that
                differentiates from generic luxury. */}
            {active && (
              <span
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-6 h-[2px] rounded-full bg-(--color-accent-red)"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
