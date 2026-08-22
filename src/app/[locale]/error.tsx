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
    <main className="flex min-h-[70vh] items-center py-20">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        <h1 className="text-headline font-semibold">{t.title}</h1>
        <p className="mt-4 text-body text-(--color-text-muted)">{t.subtitle}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-(--color-accent) px-[22px] text-body text-white transition-colors hover:bg-(--color-accent-hover)"
          >
            {t.retry}
          </button>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-(--color-fill) px-[22px] text-body text-(--color-text) transition-colors hover:bg-(--color-fill-hover)"
          >
            {t.whatsapp}
          </a>
          <a href={`/${locale}`} className="text-link text-body">
            {t.home}
          </a>
        </div>
        {error.digest && (
          <p className="mt-10 text-caption text-(--color-text-muted)">
            Ref: <span className="ltr-nums">{error.digest}</span>
          </p>
        )}
      </div>
    </main>
  );
}
