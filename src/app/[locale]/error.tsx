"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SITE } from "@/lib/constants";

// `error.tsx` MUST be a Client Component. useTranslations from next-intl is
// available here via NextIntlClientProvider in the [locale]/layout, but we
// deliberately avoid depending on translation messages loading — the error
// might itself be a message-loading failure. Inline EN/AR copy keeps the
// fallback resilient.
const COPY = {
  en: {
    title: "Something went wrong",
    subtitle:
      "We hit an unexpected error. The team has been notified. Try again, or reach us on WhatsApp.",
    retry: "Try again",
    whatsapp: "Message us on WhatsApp",
    home: "Back to home",
  },
  ar: {
    title: "حدث خطأ ما",
    subtitle:
      "واجهنا خطأً غير متوقع. تم إعلام الفريق. أعد المحاولة، أو تواصل معنا عبر واتساب.",
    retry: "حاول مرة أخرى",
    whatsapp: "راسلنا على واتساب",
    home: "العودة للرئيسية",
  },
};

export default function LocaleError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const t = COPY[locale];

  useEffect(() => {
    console.error("[ABK] Route error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center py-20">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.32em] text-(--color-gold) mb-6">
          ⸻ Error
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-5">
          {t.title}
        </h1>
        <p className="text-(--color-text-muted) text-base sm:text-lg leading-relaxed mb-10">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-(--color-gold) text-(--color-bg) font-medium uppercase tracking-[0.18em] text-xs hover:brightness-110 transition"
          >
            {t.retry}
          </button>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-(--color-border) hover:border-(--color-gold) hover:text-(--color-gold) uppercase tracking-[0.18em] text-xs transition"
          >
            {t.whatsapp}
          </a>
          <a
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 text-(--color-text-muted) hover:text-(--color-gold) uppercase tracking-[0.18em] text-xs transition"
          >
            {t.home}
          </a>
        </div>
        {error.digest && (
          <p className="mt-10 text-[10px] uppercase tracking-[0.24em] text-(--color-text-muted)/60">
            Ref: <span className="ltr-nums">{error.digest}</span>
          </p>
        )}
      </div>
    </main>
  );
}
