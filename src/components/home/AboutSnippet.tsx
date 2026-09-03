import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";

export function AboutSnippet() {
  const t = useTranslations("HomeAbout");

  const stats = [
    {
      value: t("statProducts"),
      label: t("statProductsLabel"),
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-(--color-brand)"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      ),
    },
    {
      value: t("statBrands"),
      label: t("statBrandsLabel"),
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-(--color-brand)"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      ),
    },
    {
      value: t("statClients"),
      label: t("statClientsLabel"),
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-(--color-brand)"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      ),
    },
    {
      value: t("statRating"),
      label: t("statRatingLabel"),
      icon: (
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-(--color-brand)"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-(--color-hero-dark) py-16 lg:py-24 text-white">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Text details */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center rounded-full border border-(--color-brand)/40 bg-(--color-brand)/15 px-3 py-1 text-caption font-bold tracking-widest text-(--color-brand) uppercase">
              {t("eyebrow")}
            </span>

            <h2 className="mt-4 text-display font-bold tracking-tight text-white sm:text-display-lg">
              {t("title")}
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-body text-white/80 leading-relaxed">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap px-7 h-12 text-body font-bold uppercase tracking-wider bg-(--color-brand) text-black shadow-[0_4px_14px_rgba(245,166,35,0.35)] hover:bg-(--color-brand-hover) transition-all duration-200 cursor-pointer"
              >
                <span>{t("learnMore")}</span>
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Actual Office & Store Photos */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
              {/* Photo 1: Official ABK Branding & Demo Counter */}
              <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#14161a] shadow-xl">
                <Image
                  src="/home/abk-office-branding.webp"
                  alt="ABK Trading & Service Showroom Wall & Testing Counter in Mesaimeer Doha"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4">
                  <span className="inline-block rounded-full bg-black/70 px-2.5 py-1 text-[11px] sm:text-caption font-semibold text-white/90 backdrop-blur-md border border-white/10">
                    ABK Showroom
                  </span>
                </div>
              </div>

              {/* Photo 2: Stocked Warehouse & Retail Shelves */}
              <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#14161a] shadow-xl">
                <Image
                  src="/home/abk-office-shelves.webp"
                  alt="ABK Detailing Products & Chemical Inventory in Mesaimeer Store"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4">
                  <span className="inline-block rounded-full bg-black/70 px-2.5 py-1 text-[11px] sm:text-caption font-semibold text-white/90 backdrop-blur-md border border-white/10">
                    Supply Inventory
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-brand)/10 text-(--color-brand)">
                {stat.icon}
              </span>
              <span className="text-display font-extrabold tracking-tight text-(--color-brand)">
                {stat.value}
              </span>
              <span className="text-footnote font-medium text-white/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
