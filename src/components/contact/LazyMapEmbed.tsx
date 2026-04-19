"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

type Props = {
  label: string;
  /** Accessible name for the iframe after load. */
  iframeTitle: string;
  /** Shown in the center of the placeholder — e.g. "View map" */
  ctaLabel: string;
  /** Subtle secondary line on placeholder — e.g. "Tap to load Google Maps" */
  hintLabel: string;
  /** RTL-aware locale for button font-feature. */
  locale: "en" | "ar";
};

/**
 * Click-to-load Google Maps iframe.
 *
 * The raw iframe on contact page blocks the main thread during embed init
 * and pushes LCP well past 3s on mobile 3G. This component renders a static
 * placeholder (same aspect ratio, no network request) and swaps in the real
 * iframe only on user click.
 *
 * CLS note: the `aspect-[4/3]` class MUST match whatever the parent container
 * uses, so the swap doesn't shift surrounding layout.
 */
export function LazyMapEmbed({ label, iframeTitle, ctaLabel, hintLabel, locale }: Props) {
  const [loaded, setLoaded] = useState(false);

  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    SITE.address.full,
  )}&output=embed`;

  return (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-(--color-border) bg-(--color-surface)">
      {loaded ? (
        <iframe
          src={mapEmbed}
          title={iframeTitle}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={label}
          className="group absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 text-center hover:cursor-pointer"
          data-plausible-event-name="map_load"
        >
          {/* Subtle topographic background — evokes a map without loading one. */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(200,162,74,0.15),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(200,162,74,0.1),transparent_45%)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(0deg,transparent_24%,rgba(200,162,74,0.5)_25%,rgba(200,162,74,0.5)_26%,transparent_27%,transparent_74%,rgba(200,162,74,0.5)_75%,rgba(200,162,74,0.5)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(200,162,74,0.5)_25%,rgba(200,162,74,0.5)_26%,transparent_27%,transparent_74%,rgba(200,162,74,0.5)_75%,rgba(200,162,74,0.5)_76%,transparent_77%)] bg-[size:72px_72px]"
          />
          {/* Pin icon */}
          <span
            aria-hidden
            className="relative flex items-center justify-center w-14 h-14 rounded-full border border-(--color-gold)/40 bg-(--color-bg)/60 backdrop-blur-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-(--color-gold)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12Z"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <span className="relative inline-flex items-center gap-2 text-sm font-medium tracking-wide text-(--color-text) group-hover:text-(--color-gold) transition-colors">
            {ctaLabel}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path strokeLinecap="round" d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </span>
          <span
            className="relative text-[10px] uppercase tracking-[0.26em] text-(--color-text-muted)"
            lang={locale}
          >
            {hintLabel}
          </span>
        </button>
      )}
    </div>
  );
}
