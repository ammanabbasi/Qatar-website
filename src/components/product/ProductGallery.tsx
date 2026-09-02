"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  images: string[];
  alt: string;
};

/** Main photo + selectable thumbnails. Server renders the first photo. */
export function ProductGallery({ images, alt }: Props) {
  const t = useTranslations("Products");
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div className="flex flex-col gap-3" role="group" aria-label={t("detailGallery")}>
      <div className="relative aspect-square overflow-hidden rounded-tile bg-(--color-surface) shadow-tile">
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          // The hero of the page and its LCP element — preload from <head>.
          preload={index === 0}
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={src}
                type="button"
                aria-label={t("thumbnailLabel", { n: i + 1 })}
                aria-pressed={active}
                onClick={() => setIndex(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-[12px] bg-(--color-surface) transition-shadow duration-200 ease-soft ${
                  active
                    ? "shadow-[0_0_0_2px_var(--color-brand-deep)]"
                    : "shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_2px_var(--color-border)]"
                }`}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
