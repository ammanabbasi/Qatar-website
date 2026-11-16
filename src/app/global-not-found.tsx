import type { Metadata } from "next";
import Link from "next/link";
import { fontSans, fontArabic } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Not Found | ABK Trading & Service",
  description:
    "We couldn't find that page. Browse car care products, VTEK PPF installation, and detailing supplies at ABK Trading & Service in Doha, Qatar.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontArabic.variable}`}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-(--color-hero-dark) px-6 text-center text-white antialiased">
        <span className="rounded-pill border border-white/15 bg-white/8 px-3 py-1 text-caption font-bold uppercase tracking-widest text-(--color-brand)">
          404 · ABK Trading &amp; Service
        </span>
        <h1 className="text-headline font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-body text-white/70">
          We couldn&apos;t find that page. Continue to our Qatar car care storefront or installed VTEK PPF calculator:
        </p>
        <p
          lang="ar"
          dir="rtl"
          className="max-w-md font-[family-name:var(--font-arabic)] text-footnote text-white/65"
        >
          لم نتمكن من العثور على هذه الصفحة. انتقل إلى متجر العناية بالسيارات أو حاسبة تركيب أفلام الحماية:
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/en"
            className="inline-flex h-11 items-center justify-center rounded-pill bg-(--color-brand) px-6 text-footnote font-bold text-black transition-colors hover:bg-(--color-brand-hover)"
          >
            English Storefront
          </Link>
          <Link
            href="/ar"
            lang="ar"
            dir="rtl"
            className="inline-flex h-11 items-center justify-center rounded-pill border border-white/20 bg-white/8 px-6 font-[family-name:var(--font-arabic)] text-footnote font-bold text-white transition-colors hover:bg-white/15"
          >
            المتجر بالعربية
          </Link>
          <Link
            href="/en/b2c/ppf-installation"
            className="inline-flex h-11 items-center justify-center rounded-pill border border-(--color-brand)/50 px-5 text-footnote font-semibold text-(--color-brand) transition-colors hover:bg-(--color-brand)/12"
          >
            PPF Installation Doha
          </Link>
        </div>
      </body>
    </html>
  );
}
