"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { buildWhatsAppUrl, type Audience, type WALocale } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { BagIcon, CheckIcon } from "@/components/ui/Icons";
import { buttonClasses } from "@/components/ui/Button";
import { useCartUi } from "@/components/cart/CartProvider";
import { MAX_QTY } from "@/lib/cart";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { StickyAddToCart } from "./StickyAddToCart";
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
  const tc = useTranslations("Cart");
  const { add, openDrawer } = useCartUi();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 4000);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  const isB2b = audience === "b2b";
  const name = product.name[locale];
  const priceDisplay = product.price ? product.price[locale] : undefined;
  const originalPriceDisplay = product.originalPrice ? product.originalPrice[locale] : undefined;

  const variants = product.variants;
  const hasVariants = Boolean(variants && variants.length > 0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    hasVariants ? variants![0].id : "",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sizeParam = params.get("size")?.toLowerCase();
    if (!sizeParam || !product.variants) return;
    const match = product.variants.find(
      (v) =>
        v.id.toLowerCase() === sizeParam ||
        v.size.en.toLowerCase().replace(/\s+/g, "") === sizeParam.replace(/\s+/g, ""),
    );
    if (match) {
      window.requestAnimationFrame(() => setSelectedVariantId(match.id));
    }
  }, [product.variants]);

  const selectedVariant = hasVariants
    ? variants!.find((v) => v.id === selectedVariantId) ?? variants![0]
    : undefined;

  const currentSlug = selectedVariant?.slug ?? product.slug;
  const currentPriceDisplay = selectedVariant
    ? selectedVariant.price[locale]
    : priceDisplay;
  const currentOriginalPriceDisplay = selectedVariant?.originalPrice
    ? selectedVariant.originalPrice[locale]
    : originalPriceDisplay;
  const currentName = selectedVariant
    ? `${product.name[locale]} (${selectedVariant.size[locale]})`
    : name;

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariantId(variantId);
    setJustAdded(false);
  };

  const changeQuantity = (next: number) => {
    setQuantity(next);
    setJustAdded(false);
  };

  // Right after adding, the same button reads "Added — View cart" and opens
  // the drawer; changing the quantity makes it an add button again.
  const handleAdd = () => {
    if (justAdded) {
      openDrawer();
      return;
    }
    if (add(currentSlug, quantity)) setJustAdded(true);
  };

  const retailWaUrl = buildWhatsAppUrl({
    audience: "b2c",
    locale,
    productName: currentName,
    productPrice: currentPriceDisplay,
    productUrl: `${productUrl}${selectedVariant ? `?size=${selectedVariant.id}` : ""}`,
    quantity,
  });
  const retailWaTag = `plausible-event-name=whatsapp_click plausible-event-product=${currentSlug}`;

  const wholesaleWaUrl = buildWhatsAppUrl({
    audience: "b2b",
    locale,
    productName: currentName,
    productPrice: currentPriceDisplay,
    productUrl: `${productUrl}${selectedVariant ? `?size=${selectedVariant.id}` : ""}`,
    quantity,
  });
  const wholesaleWaTag = `plausible-event-name=whatsapp_wholesale_click plausible-event-product=${currentSlug}`;

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
      {/* ── PRICE HEADER ── */}
      {currentPriceDisplay ? (
        <div className="flex items-baseline justify-between border-b border-(--color-border-soft) pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-caption font-bold uppercase tracking-wider text-(--color-text-muted)">
              {currentOriginalPriceDisplay ? t("specialOfferPrice") : t("retailOfficialPrice")}
            </span>
            {currentOriginalPriceDisplay && (
              <span className="inline-flex w-fit items-center rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                {t("saleBadge")}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-title font-bold text-(--color-brand-deep) sm:text-display">
              {currentPriceDisplay}
            </span>
            {currentOriginalPriceDisplay && (
              <span className="text-footnote font-semibold text-(--color-text-muted) line-through">
                {t("wasPrice", { price: currentOriginalPriceDisplay })}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 border-b border-(--color-border-soft) pb-4">
          <span className="text-title-sm font-bold text-(--color-text)">
            {tc("priceOnRequest")}
          </span>
          <span className="text-footnote text-(--color-text-muted)">
            {tc("priceOnRequestHint")}
          </span>
        </div>
      )}

      {/* Stock & Delivery Status */}
      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 px-3.5 py-2.5 text-footnote font-medium text-emerald-800 dark:text-emerald-300">
        <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
        <span>{t("stockAvailable")}</span>
      </div>

      {/* DIY Application Tip (for retail items) */}
      {currentPriceDisplay && (
        <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3.5 text-footnote">
          <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>{t("diyTipsTitle")}</span>
          </div>
          <p className="mt-1 text-caption leading-relaxed text-(--color-text-muted)">
            {diyTip}
          </p>
        </div>
      )}

      {/* Commercial Packaging Specification */}
      {!currentPriceDisplay && (
        <div className="rounded-xl border border-black/8 bg-black/3 p-3.5 text-footnote">
          <div className="flex items-center gap-2 font-semibold text-(--color-text)">
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 text-(--color-brand-deep)" fill="none" stroke="currentColor" strokeWidth="2">
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
      )}

      {/* ── SIZE / VARIANT SELECTOR ── */}
      {hasVariants && (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-(--color-border-soft) bg-(--color-fill)/30 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold uppercase tracking-wider text-(--color-text-muted)">
              {t("size")}
            </span>
            <span className="text-footnote font-bold text-(--color-brand-deep)">
              {selectedVariant?.size[locale]} · {selectedVariant?.price[locale]}
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label={t("selectSize")}
            className="grid grid-cols-2 gap-2.5"
          >
            {variants!.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const badgeLabel = v.badge ? v.badge[locale] : (v.id === "500ml" ? t("bestValue") : null);
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectVariant(v.id)}
                  className={`group relative flex flex-col items-start justify-between rounded-xl p-3 text-start transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-2 border-(--color-brand) bg-(--color-surface) shadow-sm ring-1 ring-(--color-brand)"
                      : "border border-(--color-border-soft) bg-(--color-surface) hover:border-(--color-border) hover:bg-(--color-fill)/50 active:scale-[0.98]"
                  }`}
                >
                  {badgeLabel && (
                    <span className="absolute -top-2.5 end-2.5 rounded-full bg-(--color-brand-deep) px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                      {badgeLabel}
                    </span>
                  )}
                  <div className="flex w-full items-center justify-between gap-1">
                    <span
                      className={`text-body font-bold transition-colors ${
                        isSelected ? "text-(--color-brand-deep)" : "text-(--color-text)"
                      }`}
                    >
                      {v.size[locale]}
                    </span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-(--color-brand-deep) bg-(--color-brand-deep) text-white"
                          : "border-(--color-border) bg-transparent"
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-callout font-bold text-(--color-text)">
                      {v.price[locale]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── QUANTITY SELECTOR ── */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-footnote font-semibold text-(--color-text)">{t("quantity")}</span>
        <QuantityStepper
          value={quantity}
          onChange={changeQuantity}
          name={currentName}
          max={MAX_QTY[audience]}
        />
      </div>

      {/* ── ACTION CTAS ── */}
      <div className="flex flex-col gap-3 pt-2">
        {currentPriceDisplay ? (
          <>
            <button
              ref={addButtonRef}
              type="button"
              onClick={handleAdd}
              className={`${buttonClasses("primary", "lg")} w-full font-semibold active:bg-(--color-brand-deep) active:text-white`}
            >
              {justAdded ? <CheckIcon className="h-5 w-5" /> : <BagIcon className="h-5 w-5" />}
              <span>{justAdded ? tc("addedViewCart") : tc("addToCart")}</span>
            </button>
            <a
              href={retailWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${retailWaTag} inline-flex min-h-11 items-center justify-center gap-2 rounded-pill text-footnote font-medium text-(--color-link) underline-offset-2 transition-colors duration-150 ease-soft hover:bg-(--color-fill) hover:underline`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>{t("orderJustThis")}</span>
            </a>
            <StickyAddToCart
              targetRef={addButtonRef}
              name={currentName}
              priceLabel={currentPriceDisplay}
              image={product.images[0]}
              added={justAdded}
              onAdd={handleAdd}
            />
          </>
        ) : null}

        {/* ── WHOLESALE INQUIRY SECTION ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-brand) text-[11px] font-extrabold text-black">
                %
              </span>
              <h3 className="text-footnote sm:text-subhead font-bold uppercase tracking-wide text-amber-950 dark:text-amber-300">
                {t("wholesaleTradePricing")}
              </h3>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              B2B / Trade
            </span>
          </div>
          <p className="text-caption leading-relaxed text-(--color-text-muted)">
            {t("wholesaleTradeDesc")}
          </p>
          <a
            href={wholesaleWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${wholesaleWaTag} flex w-full items-center justify-center gap-2.5 rounded-full bg-(--color-brand) px-6 py-3.5 text-body font-bold text-black shadow-md transition-all hover:bg-(--color-brand-hover) active:scale-[0.99]`}
          >
            <WhatsAppIcon className="h-5 w-5 text-black" />
            <span>{t("inquireWholesale")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
