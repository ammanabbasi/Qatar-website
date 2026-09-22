"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addToTray, openTray } from "@/lib/orderTray";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  audience: Audience;
  locale: WALocale;
  productUrl: string;
};

function getDiyTip(category: string, locale: "en" | "ar"): string {
  switch (category) {
    case "ppf":
    case "tint":
      return locale === "ar"
        ? "لأفضل نتائج، يُنصح بالتركيب في مكان مغلق وخالٍ من الغبار باستخدام محلول الانزلاق (Slip Solution) وممسحة سيليكونية مرنة مع الحفاظ على ترطيب السطح."
        : "For best results, install in a clean dust-free indoor area using slip solution and a flexible felt squeegee. Keep the film surface uniformly lubricated.";
    case "ceramic":
      return locale === "ar"
        ? "نظف الطلاء جيداً واستخدم الطين الصناعي (Clay Bar) ومسحة إزالة الزيوت قبل التطبيق. انتظر دقيقتين إلى ثلاث للجفاف ثم امسح بفوطة مايكروفايبر ناعمة."
        : "Thoroughly decontaminate paint with a clay bar and panel wipe before application. Allow 2-3 minutes flash time before buffing with a clean microfibre towel.";
    case "shampoo":
      return locale === "ar"
        ? "استخدم طريقة الدلوين (غسيل وشطف) لتفادي الخدوش الدائرية. اغسل السيارة من الأعلى إلى الأسفل ثم اشطفها وجففها بفوطة مايكروفايبر فائقة الامتصاص."
        : "Use the two-bucket method to prevent swirl marks. Wash from the roof down and rinse thoroughly before drying with a plush microfibre drying towel.";
    case "polish":
      return locale === "ar"
        ? "اعمل على أقسام صغيرة (٥٠×٥٠ سم) بسرعة دوران معتدلة باستخدام جهاز التلميع الدوار أو المداري. تجنب العمل تحت أشعة الشمس المباشرة أو على طلاء ساخن."
        : "Work on small 50×50cm sections using moderate speed on a dual-action polisher. Never apply on hot paintwork or under direct desert sunlight.";
    case "dressing":
    case "interior":
      return locale === "ar"
        ? "ضع كمية معتدلة على إسفنجة مخصصة ووزعها بانتظام على الأسطح البلاستيكية والجلدية، ثم امسح الزوائد للحصول على مظهر وكالة مطفأ غير زيتي."
        : "Apply a small amount to a foam applicator pad. Spread evenly and buff off any excess for a clean, non-greasy OEM satin finish.";
    case "tyre":
      return locale === "ar"
        ? "تأكد من تنظيف الإطار جيداً وتجفيفه تماماً قبل وضع الملمع لضمان ثبات اللمعان ومقاومة التصاق الرمال والغبار."
        : "Ensure tyre sidewalls are thoroughly scrubbed and bone-dry before application to maximize sling-free durability and dust repellency.";
    case "wax":
      return locale === "ar"
        ? "ضع طبقة رقيقة متساوية، واتركها تجف لمدة ٥ إلى ١٠ دقائق حتى تتشكل طبقة ضبابية خفيفة، ثم امسحها بفوطة مايكروفايبر لمنح لمعان عميق وحماية تدوم."
        : "Apply a thin, uniform coat. Allow 5-10 minutes to haze, then buff to a deep, reflective shine using a plush microfibre towel.";
    default:
      return locale === "ar"
        ? "يُرجى اتباع إرشادات الاستخدام الموضحة على العبوة وتجربة المنتج على جزء غير ظاهر أولاً لضمان أفضل توافق وحماية."
        : "Follow the application instructions on the bottle. Test on an inconspicuous area first for optimal compatibility and surface finish.";
  }
}

export function ProductPurchasePanel({
  product,
  audience,
  locale,
  productUrl,
}: Props) {
  const t = useTranslations("Products");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isB2b = audience === "b2b";
  const name = product.name[locale];
  const priceDisplay = product.price ? product.price[locale] : undefined;

  const handleAddToTray = () => {
    addToTray(
      {
        slug: product.slug,
        name,
        brand: product.brand,
        category: product.category,
        price: priceDisplay,
        priceQar: product.priceQar,
        audience,
        url: productUrl,
        image: product.images[0],
      },
      quantity,
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const whatsappUrl = buildWhatsAppUrl({
    audience,
    locale,
    productName: name,
    productPrice: priceDisplay,
    productUrl,
    quantity,
  });

  const diyTip = getDiyTip(product.category, locale);

  const packagingInfo =
    product.category === "ppf" || product.category === "tint"
      ? t("commercialPackagingRoll")
      : product.category === "shampoo" ||
          product.category === "degreaser" ||
          product.category === "heavy-duty"
        ? t("commercialPackagingDrum")
        : t("commercialPackagingCarton");

  return (
    <div className="tile flex flex-col gap-5 p-6 shadow-sm">
      {/* ── B2C RETAIL PURCHASE PANEL ── */}
      {!isB2b && (
        <>
          {/* Verified Official Price */}
          {product.price && (
            <div className="flex items-baseline justify-between border-b border-(--color-border-soft) pb-4">
              <span className="text-caption font-bold uppercase tracking-wider text-(--color-text-muted)">
                {t("retailOfficialPrice")}
              </span>
              <span className="text-title sm:text-display font-bold text-(--color-brand-deep)">
                {priceDisplay}
              </span>
            </div>
          )}

          {/* Stock & Delivery Status */}
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 px-3.5 py-2.5 text-footnote font-medium text-emerald-800 dark:text-emerald-300">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("stockAvailable")}</span>
          </div>

          {/* DIY Application Tip */}
          <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3.5 text-footnote dark:bg-blue-500/10">
            <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>{t("diyTipsTitle")}</span>
            </div>
            <p className="mt-1 text-caption text-(--color-text-muted) leading-relaxed">
              {diyTip}
            </p>
          </div>
        </>
      )}

      {/* ── B2B WHOLESALE TRADE PANEL ── */}
      {isB2b && (
        <>
          {/* MSRP / Retail Reference if price exists */}
          {product.price && (
            <div className="flex items-baseline justify-between border-b border-(--color-border-soft) pb-3">
              <span className="text-caption font-bold uppercase tracking-wider text-(--color-text-muted)">
                {t("wholesaleMsrp")}
              </span>
              <span className="text-callout font-semibold text-(--color-text-muted) line-through">
                {priceDisplay}
              </span>
            </div>
          )}

          {/* Trade & Volume Discount Badge */}
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--color-brand) text-[11px] font-extrabold text-black">
                %
              </span>
              <h3 className="text-subhead font-bold uppercase tracking-wide">
                {t("tradePricingBadge")}
              </h3>
            </div>
            <p className="mt-1.5 text-caption leading-relaxed text-amber-900 dark:text-amber-100">
              {t("tradePricingDesc")}
            </p>
          </div>

          {/* Commercial Packaging Specification */}
          <div className="rounded-xl border border-black/8 bg-black/3 p-3.5 text-footnote dark:border-white/10 dark:bg-white/4">
            <div className="flex items-center gap-2 font-semibold text-(--color-text)">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--color-brand-deep)" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              <span>{t("commercialPackaging")}</span>
            </div>
            <p className="mt-1 text-caption font-medium text-(--color-text-muted)">
              {packagingInfo}
            </p>
          </div>

          {/* Trade Partner Benefits */}
          <div className="flex flex-col gap-2 rounded-xl bg-(--color-fill) p-3 text-caption text-(--color-text-muted)">
            <p className="font-semibold text-(--color-text)">{t("commercialServicesTitle")}:</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8.5l3 3 7-7" /></svg>
              <span>{t("commercialService1")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8.5l3 3 7-7" /></svg>
              <span>{t("commercialService2")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8.5l3 3 7-7" /></svg>
              <span>{t("commercialService3")}</span>
            </div>
          </div>
        </>
      )}

      {/* ── QUANTITY SELECTOR ── */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-footnote font-semibold text-(--color-text)">
          {t("quantity")}:
        </span>
        <div className="flex items-center rounded-pill border border-black/12 bg-(--color-fill) p-0.5 dark:border-white/15">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-caption font-bold text-(--color-text) hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span className="w-8 text-center text-footnote font-bold text-(--color-text)">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-caption font-bold text-(--color-text) hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* ── ACTION CTAS ── */}
      <div className="flex flex-col gap-2.5 pt-2">
        {/* Primary WhatsApp Order / Quote CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-(--color-brand) px-6 py-3.5 text-body font-bold text-black shadow-md transition-all hover:bg-(--color-brand-hover) active:scale-[0.99]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span>
            {isB2b
              ? t("detailAskForB2b")
                ? locale === "ar"
                  ? "طلب عرض أسعار جملة"
                  : "Request Wholesale Quote"
                : "Request Wholesale Quote"
              : locale === "ar"
                ? "طلب فوري عبر واتساب"
                : "Order on WhatsApp"}
          </span>
        </a>

        {/* Secondary: Add to Multi-Item WhatsApp Order Tray */}
        <button
          type="button"
          onClick={justAdded ? openTray : handleAddToTray}
          className={`flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-(--color-fill) px-5 py-3 text-footnote font-semibold transition-all hover:bg-(--color-fill-secondary) active:scale-[0.99] dark:border-white/12 ${
            justAdded ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "text-(--color-text)"
          }`}
        >
          {justAdded ? (
            <>
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8.5l3 3 7-7" />
              </svg>
              <span>{t("addedToTray")}</span>
              <span className="text-caption font-bold underline ms-1 opacity-90">
                {locale === "ar" ? "(عرض السلة)" : "(View Sheet)"}
              </span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--color-text-muted)" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>
                {isB2b
                  ? locale === "ar"
                    ? "إضافة إلى سلة الاستفسار التجاري"
                    : "Add to Commercial Tray"
                  : t("addToTray")}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
