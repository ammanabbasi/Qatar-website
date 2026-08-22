import { useTranslations } from "next-intl";
import { DownloadIcon, ChevronIcon } from "@/components/ui/Icons";

const FILES = [
  {
    key: "vertek",
    file: "/catalogues/vertek-ppf-catalogue.pdf",
    titleKey: "catalogueVertekTitle",
    descKey: "catalogueVertekDesc",
  },
  {
    key: "autotriz",
    file: "/catalogues/autotriz-catalogue.pdf",
    titleKey: "catalogueAutotrizTitle",
    descKey: "catalogueAutotrizDesc",
  },
] as const;

export function CatalogueDownloads() {
  const t = useTranslations();
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {FILES.map((f) => (
        <a
          key={f.key}
          href={f.file}
          target="_blank"
          rel="noopener noreferrer"
          download
          className={`plausible-event-name=catalogue_download plausible-event-brand=${f.key} tile group flex items-start gap-5 p-6 transition-shadow duration-300 ease-soft hover:shadow-tile-hover`}
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text)">
            <DownloadIcon className="h-5 w-5" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-title-sm font-semibold">{t(`Products.${f.titleKey}`)}</span>
            <span className="text-footnote text-(--color-text-muted)">{t(`Products.${f.descKey}`)}</span>
            <span className="text-link mt-2 text-footnote font-medium">
              {t("Cta.downloadCatalogue")}
              <ChevronIcon className="h-[0.6em] w-[0.6em] rtl:-scale-x-100" />
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
