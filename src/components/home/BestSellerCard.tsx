"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ChevronIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
  audience: Audience;
  locale: WALocale;
};

export function BestSellerCard({ products, audience, locale }: Props) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!products || products.length === 0) return null;

  const current = products[currentIndex] ?? products[0];
  const l = locale === "ar" ? "ar" : "en";
  const name = current.name[l];
  const desc = current.shortDesc[l];

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
    productPrice: current.price ? current.price[l] : undefined,
    productUrl: `${SITE.url}/${locale}/${audience}/products/${current.slug}`,
  });

  return (
    <section className="bg-(--color-bg) py-8 sm:py-12 border-b border-(--color-border-soft)">
      <Container>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white border border-(--color-border-soft) p-6 sm:p-10 shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            {/* Text details */}
            <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-7">
              <div className="flex items-center gap-3">
                <span className="inline-block text-caption font-bold uppercase tracking-[0.2em] text-(--color-brand-deep)">
                  {t("Home.bestSeller")}
                </span>
                {current.price && (
                  <span className="inline-block rounded-full bg-(--color-brand)/12 px-3 py-0.5 text-caption font-bold text-(--color-brand-deep)">
                    {current.price[l]}
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-title font-bold tracking-tight text-(--color-text) sm:text-headline">
                {name}
              </h2>

              <p className="mt-3 text-footnote text-(--color-text-muted) sm:text-body line-clamp-3">
                {desc}
              </p>

              {!current.price ? (
                <p className="mt-2 text-footnote font-medium text-(--color-text-muted)">
                  {t("Cart.priceOnRequest")}
                </p>
              ) : null}

              {/* Cart first; ordering just this one on WhatsApp stays one tap away. */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <AddToCartButton key={current.slug} slug={current.slug} variant="primary" />
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} plausible-event-product=${current.slug} inline-flex min-h-11 items-center gap-2 text-footnote font-semibold text-(--color-link) underline-offset-2 hover:underline`}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>{current.price ? t("Cta.orderWhatsApp") : t("Cta.inquireWhatsApp")}</span>
                </a>
                <Link
                  href={`/${audience}/products/${current.slug}`}
                  className="inline-flex min-h-11 items-center gap-1 text-footnote font-medium text-(--color-text-muted) hover:text-(--color-text)"
                >
                  {t("Products.viewDetails")}
                  <ChevronIcon className="h-3 w-3 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>

            {/* Product image */}
            <div className="order-1 flex items-center justify-center md:order-2 md:col-span-5">
              <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 transition-transform duration-300 hover:scale-105">
                <Image
                  src={current.images[0]}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 224px, 288px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Carousel pager controls */}
          <div className="mt-6 flex items-center justify-center gap-4 pt-4 border-t border-black/5">
            <button
              type="button"
              onClick={prev}
              aria-label={t("Home.bestSellerPrev")}
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
              aria-label={t("Home.bestSellerNext")}
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
