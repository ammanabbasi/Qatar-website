import { SITE } from "./constants";

/**
 * LocalBusiness / AutomotiveBusiness structured data for Qatar GEO SEO.
 * Note: geo (lat/long) intentionally OMITTED until Google Business pin is captured.
 * Wrong coordinates actively harm Google Maps ranking — address alone is sufficient for now.
 */
export function localBusinessJsonLd(locale: "en" | "ar" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `${SITE.url}#business`,
    name: SITE.name,
    alternateName: "ABK",
    url: SITE.url,
    // Satori-rendered opengraph-image.tsx produces the actual PNG at /{locale}/opengraph-image.
    // Consumers (Google Knowledge Graph, Meta, WhatsApp) fetch it — relative path fine because
    // structured-data fetchers resolve against @id.
    image: `${SITE.url}/en/opengraph-image`,
    logo: `${SITE.url}/logo.webp`,
    description:
      locale === "ar"
        ? "الموزع والبائع للمنتجات الفاخرة للعناية بالسيارات في قطر — أفلام حماية الطلاء، الطلاءات السيراميكية، شامبو السيارات، التلميع والمزيد."
        : "Qatar's distributor and retailer of premium automotive care — PPF, ceramic coatings, car shampoos, detailing compounds and more.",
    telephone: SITE.phoneE164,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
      addressLocality: "Mesaimeer",
      addressRegion: "Doha",
      addressCountry: SITE.address.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "13:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "16:00",
        closes: "22:00",
      },
    ],
    areaServed: { "@type": "Country", name: "Qatar" },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.tiktok],
  };
}

export function productJsonLd(opts: {
  name: string;
  description: string;
  brand: string;
  image: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    brand: { "@type": "Brand", name: opts.brand },
    image: opts.image,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "QAR",
      seller: { "@type": "Organization", name: SITE.name },
      url: opts.url,
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
