import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

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
    <Container className="px-0">
      <div className="grid sm:grid-cols-2 gap-5">
        {FILES.map((f) => (
          <a
            key={f.key}
            href={f.file}
            target="_blank"
            rel="noopener noreferrer"
            download
            data-plausible-event="catalogue_download"
            data-plausible-event-brand={f.key}
            className="card-gold-hover block rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-(--color-gold)/10 border border-(--color-gold)/40 inline-flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-(--color-gold)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg">
                  {t(`Products.${f.titleKey}`)}
                </h3>
                <p className="text-sm text-(--color-text-muted)">
                  {t(`Products.${f.descKey}`)}
                </p>
                <span className="text-xs text-(--color-gold) mt-2">
                  {t("Cta.downloadCatalogue")} →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Container>
  );
}
