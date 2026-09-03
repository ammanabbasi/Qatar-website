"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ChevronIcon } from "@/components/ui/Icons";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
  audience: Audience;
  locale: WALocale;
};

export function BestSellerCard({ products, audience, locale }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!products || products.length === 0) return null;

  const current = products[currentIndex] ?? products[0];
  const l = locale === "ar" ? "ar" : "en";
  const name = current.name[l];
  const desc = current.shortDesc[l];
  const isAr = locale === "ar";

  const prev = () => {
    setCurrentIndex((prevIdx) =>
      prevIdx === 0 ? products.length - 1 : prevIdx - 1,
    );
  };

  const next = () => {
    setCurrentIndex((prevIdx) =>
      prevIdx === products.length - 1 ? 0 : prevIdx + 1,
    );
  };

  const waHref = buildWhatsAppUrl({
    audience,
    locale,
    productName: name,
    productUrl: `https://abktradingservice.com/${locale}/${audience}/products/${current.slug}`,
  });

  return (
    <section className="bg-white py-8 sm:py-12 border-b border-(--color-border-soft)">
      <Container>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-(--color-bg) border border-(--color-border-soft) p-6 sm:p-10 shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            {/* Text details */}
            <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-7">
              <span className="inline-block text-caption font-bold uppercase tracking-[0.2em] text-(--color-brand-deep)">
                {isAr ? "الأكثر مبيعاً" : "BEST-SELLER"}
              </span>

              <h2 className="mt-2 text-title font-bold tracking-tight text-(--color-text) sm:text-headline">
                {name}
              </h2>

              <p className="mt-3 text-footnote text-(--color-text-muted) sm:text-body line-clamp-3">
                {desc}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-(--color-brand-deep) hover:underline text-body"
                >
                  <span>{isAr ? "استفسر الآن" : "Inquire now"}</span>
                  <ChevronIcon className="h-4 w-4 rtl:-scale-x-100" />
                </a>

                <Link
                  href={`/${audience}/products/${current.slug}`}
                  className="text-caption font-medium text-(--color-text-subtle) hover:text-(--color-text)"
                >
                  {isAr ? "عرض التفاصيل" : "View specs"}
                </Link>
              </div>
            </div>

            {/* Product image */}
            <div className="order-1 flex items-center justify-center md:order-2 md:col-span-5">
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 transition-transform duration-300 hover:scale-105">
                <Image
                  src={current.images[0]}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 256px, 288px"
                  className="object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Carousel pager controls */}
          <div className="mt-6 flex items-center justify-center gap-4 pt-4 border-t border-black/5">
            <button
              type="button"
              onClick={prev}
              aria-label={isAr ? "السابق" : "Previous"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-(--color-text) shadow-sm border border-black/10 hover:bg-(--color-fill) transition-colors cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 rotate-180 rtl:rotate-0" />
            </button>

            <span className="text-caption font-semibold tracking-wider text-(--color-text-muted)">
              {currentIndex + 1} / {products.length}
            </span>

            <button
              type="button"
              onClick={next}
              aria-label={isAr ? "التالي" : "Next"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-(--color-text) shadow-sm border border-black/10 hover:bg-(--color-fill) transition-colors cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
