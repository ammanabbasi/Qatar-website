import { SITE } from "./constants";

/**
 * Single source of truth for the @id values used to link nodes together.
 * Schema.org best practice is for Product/Service nodes to reference the
 * provider/seller via @id rather than redefining the Organization inline —
 * this lets Google reconcile multiple JSON-LD blocks across the site into a
 * single entity graph.
 */
const IDS = {
  organization: `${SITE.url}#organization`,
  business: `${SITE.url}#business`,
  website: `${SITE.url}#website`,
} as const;

/**
 * Top-level Organization for brand identity in the Knowledge Graph.
 * Distinct from `localBusinessJsonLd` (AutomotiveBusiness) — they live at
 * different @id and serve different roles: Organization carries the brand,
 * AutomotiveBusiness carries the storefront's NAP. Both are emitted because
 * Google Search Console treats them as complementary, not duplicate.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": IDS.organization,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/logo.webp`,
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.tiktok],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phoneE164,
        contactType: "sales",
        email: SITE.email,
        areaServed: ["QA", "AE", "SA", "KW", "BH", "OM"],
        availableLanguage: ["en", "ar"],
      },
    ],
  };
}

/**
 * WebSite node — surfaces the canonical site URL and (optionally) a
 * SearchAction for Google sitelinks search box. We omit SearchAction
 * because the site has no `/search` endpoint; advertising one Google
 * can't fulfil downgrades trust.
 */
export function websiteJsonLd(locale: "en" | "ar" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": IDS.website,
    url: SITE.url,
    name: SITE.name,
    inLanguage: locale === "ar" ? "ar-QA" : "en-QA",
    publisher: { "@id": IDS.organization },
  };
}

/**
 * LocalBusiness / AutomotiveBusiness structured data for Qatar GEO SEO.
 * Note: geo (lat/long) intentionally OMITTED until Google Business pin is captured.
 * Wrong coordinates actively harm Google Maps ranking — address alone is sufficient for now.
 */
export function localBusinessJsonLd(locale: "en" | "ar" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    additionalType: "https://schema.org/Store",
    "@id": IDS.business,
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
    parentOrganization: { "@id": IDS.organization },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.tiktok],
    // Offer catalogue link — tells Google this business sells products,
    // improving eligibility for "car care products Qatar" type queries.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name:
        locale === "ar"
          ? "منتجات العناية بالسيارات"
          : "Car Care Products Catalogue",
      url: `${SITE.url}/${locale}/b2c/products`,
    },
    // Topic expertise signals — helps Google/AI understand what ABK knows about.
    knowsAbout: [
      "Paint Protection Film",
      "Ceramic Coating",
      "Car Detailing",
      "Window Tinting",
      "Car Care Products",
      "Auto Detailing Supplies",
      "PPF Installation",
      "Car Shampoo",
      "Car Polish",
    ],
    // Price range indicator for Google Knowledge Panel
    priceRange: "$$",
  };
}

/**
 * Product schema. NOTE on offers: ABK quotes pricing per-WhatsApp inquiry,
 * so the Offer block is intentionally OMITTED. A bare `priceCurrency` without
 * `price` triggers Google Search Console warnings ("missing field price"),
 * and a placeholder price would be misleading. Without offers, the Product
 * remains valid for Knowledge Graph + AI shopping surfaces, just not for
 * "merchant listing" rich results — which require real public pricing
 * anyway. Re-add offers if/when public price catalogue ships.
 */
export function productJsonLd(opts: {
  name: string;
  description: string;
  brand: string;
  category: string;
  sku: string;
  images: string[];
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    sku: opts.sku,
    category: opts.category,
    brand: { "@type": "Brand", name: opts.brand },
    image: opts.images,
    url: opts.url,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: opts.url,
      seller: { "@id": IDS.business },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "QAR",
        valueAddedTaxIncluded: false,
      },
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

/**
 * Service node for one workshop service (PPF install, ceramic coating, etc.).
 * `provider` references the AutomotiveBusiness via @id so Google merges it
 * with the storefront's NAP — important for "PPF installation Doha" type
 * intents.
 */
export function serviceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: opts.url,
    image: opts.image,
    provider: { "@id": IDS.business },
    areaServed: { "@type": "Country", name: "Qatar" },
    audience: { "@type": "Audience", audienceType: "Car owners in Qatar" },
  };
}

/**
 * FAQPage. The Q/A pairs render as expandable items in Google search results
 * (when eligible) and are quoted heavily by AI Overviews / ChatGPT / Perplexity
 * shopping answers. High-leverage for a small Qatar retail site.
 */
export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}

/**
 * ItemList for category/listing pages — helps Google understand the catalogue
 * structure and improves sitelink eligibility.
 */
export function itemListJsonLd(opts: {
  name: string;
  url: string;
  items: Array<{ name: string; url: string; image?: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: opts.url,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      name: it.name,
      ...(it.image ? { image: it.image } : {}),
    })),
  };
}
