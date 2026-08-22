"use client";

import { useState } from "react";
import { ChevronIcon, PinIcon } from "@/components/ui/Icons";
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
    <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-(--color-surface) shadow-tile">
      {loaded ? (
        <iframe
          src={mapEmbed}
          title={iframeTitle}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={label}
          className="plausible-event-name=map_load group absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 text-center"
          
        >
          {/* Faint street grid — reads as a map without loading one. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(var(--color-border-soft)_1px,transparent_1px),linear-gradient(90deg,var(--color-border-soft)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70"
          />
          <span
            aria-hidden
            className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-(--color-surface) text-(--color-text) shadow-tile transition-shadow duration-300 ease-soft group-hover:shadow-tile-hover"
          >
            <PinIcon className="h-6 w-6" />
          </span>
          <span className="text-link relative text-body font-medium">
            {ctaLabel}
            <ChevronIcon className="h-[0.62em] w-[0.62em] shrink-0 rtl:-scale-x-100" />
          </span>
          <span className="relative text-caption text-(--color-text-muted)" lang={locale}>
            {hintLabel}
          </span>
        </button>
      )}
    </div>
  );
}
