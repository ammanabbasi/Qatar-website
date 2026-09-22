"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import {
  buildDealerApplicationWhatsAppUrl,
  type WALocale,
} from "@/lib/whatsapp";

type Props = {
  locale: WALocale;
};

const AVAILABLE_BRANDS = [
  "VTEK PPF",
  "Autotriz Ceramic",
  "Briller Car Care",
  "Grizzly USA",
  "Insta Finish",
  "Getsun & Sitrett",
];

export function DealerApplicationForm({ locale }: Props) {
  const t = useTranslations("DealerPage");

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState(t("formTypeStudio"));
  const [location, setLocation] = useState(
    locale === "ar" ? "الدوحة، قطر" : "Doha, Qatar",
  );
  const [estimatedVolume, setEstimatedVolume] = useState(t("formVolume2"));
  const [selectedBrands, setSelectedBrands] = useState<string[]>([
    "VTEK PPF",
    "Autotriz Ceramic",
  ]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !phone.trim() || !contactName.trim()) {
      setError(
        locale === "ar"
          ? "يرجى تعبئة اسم الشركة واسم المسؤول ورقم الجوال للمتابعة."
          : "Please provide your company name, contact person, and mobile number.",
      );
      return;
    }
    setError("");

    const url = buildDealerApplicationWhatsAppUrl({
      locale,
      companyName,
      contactName,
      phone,
      businessType,
      location,
      estimatedVolume,
      priorityBrands: selectedBrands,
      notes,
    });

    window.open(url, "_blank");
  };

  return (
    <section id="apply-form" className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Form Header */}
          <div className="text-center">
            <span className="text-caption font-bold uppercase tracking-[0.16em] text-(--color-brand-deep)">
              {t("formEyebrow")}
            </span>
            <h2 className="mt-2 text-title sm:text-headline font-bold text-(--color-text)">
              {t("formTitle")}
            </h2>
            <p className="mt-3 text-footnote sm:text-body text-(--color-text-muted) leading-relaxed">
              {t("formSubtitle")}
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="tile mt-10 p-6 sm:p-10 shadow-md border border-(--color-border)"
          >
            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-footnote font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Company Name */}
              <div className="sm:col-span-2">
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formCompany")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t("formCompanyPlaceholder")}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-white/5"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formContact")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={t("formContactPlaceholder")}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-white/5"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formPhone")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("formPhonePlaceholder")}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-white/5"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formBusinessType")}
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-black/40"
                >
                  <option value={t("formTypeStudio")}>{t("formTypeStudio")}</option>
                  <option value={t("formTypeCarwash")}>{t("formTypeCarwash")}</option>
                  <option value={t("formTypeRetail")}>{t("formTypeRetail")}</option>
                  <option value={t("formTypeBodyShop")}>{t("formTypeBodyShop")}</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formLocation")}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("formLocationPlaceholder")}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-white/5"
                />
              </div>

              {/* Estimated Monthly Volume */}
              <div className="sm:col-span-2">
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formVolume")}
                </label>
                <select
                  value={estimatedVolume}
                  onChange={(e) => setEstimatedVolume(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-black/40"
                >
                  <option value={t("formVolume1")}>{t("formVolume1")}</option>
                  <option value={t("formVolume2")}>{t("formVolume2")}</option>
                  <option value={t("formVolume3")}>{t("formVolume3")}</option>
                </select>
              </div>

              {/* Brands of Interest */}
              <div className="sm:col-span-2">
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formBrands")}
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AVAILABLE_BRANDS.map((brand) => {
                    const isSelected = selectedBrands.includes(brand);
                    return (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`rounded-full px-4 py-2 text-footnote font-semibold transition-all ${
                          isSelected
                            ? "bg-(--color-brand) text-black shadow-xs"
                            : "border border-black/12 bg-(--color-fill) text-(--color-text-muted) hover:text-(--color-text) dark:border-white/15"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="sm:col-span-2">
                <label className="text-caption font-bold uppercase tracking-wider text-(--color-text)">
                  {t("formNotes")}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("formNotesPlaceholder")}
                  className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-body text-(--color-text) outline-hidden transition-all focus:border-(--color-brand) focus:ring-2 focus:ring-(--color-brand)/20 dark:border-white/15 dark:bg-white/5"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-(--color-border-soft)">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-(--color-brand) px-8 py-4 text-headline-sm font-bold text-black shadow-md transition-all hover:bg-(--color-brand-hover) hover:scale-[1.01] active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-6 w-6" />
                <span>{t("formSubmit")}</span>
              </button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
