import { SITE } from "./constants";
import { defaultSocialImage } from "./seo";

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

// Service area for the storefront + workshop nodes: Doha first, then Qatar's
// other population centres. City nodes (not bare strings) let Google match
// "PPF Al Wakrah" style intents to the Mesaimeer shop.
const QATAR = { "@type": "Country", name: "Qatar" } as const;
const QATAR_SERVICE_AREA = [
  QATAR,
  ...["Doha", "Al Rayyan", "Al Wakrah", "Al Wukair", "Lusail", "Umm Salal", "Al Khor"].map(
    (name) => ({ "@type": "City", name, containedInPlace: QATAR }),
  ),
];

/**
 * Top-level Organization for brand identity in the Knowledge Graph.
 * Distinct from `localBusinessJsonLd` (AutoPartsStore) — they live at
 * different @id and serve different roles: Organization carries the brand,
 * AutoPartsStore carries the storefront's NAP. Both are emitted because
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
      {
        "@type": "ContactPoint",
        telephone: SITE.phoneLandlineE164,
        contactType: "customer service",
        areaServed: "QA",
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
 * Local-business node for Qatar GEO SEO. `AutoPartsStore` is the schema.org
 * type closest to the Google Business Profile category ("Car accessories
 * store") and is itself both a Store and an AutomotiveBusiness. `geo` and
 * `hasMap` come from the GBP pin (src/lib/constants.ts) so Search, Maps and
 * the website agree on one location.
 */
export function localBusinessJsonLd(locale: "en" | "ar" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "@id": IDS.business,
    name: SITE.name,
    // Second alternateName matches the Google Business Profile listing name
    // verbatim — helps Google reconcile this site entity with the GBP entity.
    alternateName: ["ABK", SITE.gbpName],
    url: SITE.url,
    hasMap: SITE.mapsUrl,
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    // Google asks for LocalBusiness images in more than one aspect ratio:
    // the 1.91:1 brand card plus the 1:1 product hero.
    image: [defaultSocialImage(locale).url, `${SITE.url}/og/abk-hero-1x1.jpg`],
    logo: `${SITE.url}/logo.webp`,
    slogan: SITE.tagline,
    description:
      locale === "ar"
        ? "الموزع والبائع للمنتجات الفاخرة للعناية بالسيارات في قطر — أفلام حماية الطلاء، الطلاءات السيراميكية، شامبو السيارات، التلميع والمزيد."
        : "Qatar's distributor and retailer of premium automotive care — PPF, ceramic coatings, car shampoos, detailing compounds and more.",
    telephone: [SITE.phoneE164, SITE.phoneLandlineE164],
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
    areaServed: QATAR_SERVICE_AREA,
    currenciesAccepted: "QAR",
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
    // Stocked brands belong HERE, not under `brand` (which would assert that
    // ABK owns them). Same four names as the trust strip (TrustBadges.tsx).
    knowsAbout: [
      "Paint Protection Film",
      "Ceramic Coating",
      "Car Detailing",
      "Window Tinting",
      "Car Care Products",
      "Auto Detailing Supplies",
      "Car Shampoo",
      "Car Polish",
      "VTEK PPF",
      "VTEK Weather Armor",
      "Vertek PPF",
      "Autotriz",
      "Briller Car Care",
      "Grizzly",
      "Grizzly PPF",
      "GrünesAuto",
      "GrünesAuto Detailing Pads",
    ],
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    // Price range indicator for Google Knowledge Panel
    priceRange: "$$",
  };
}

/**
 * Product schema. NOTE on offers: ABK quotes pricing per-WhatsApp inquiry,
 * and Google treats an Offer WITHOUT `price` as a structured-data ERROR
 * ("Missing field 'price'"), so no Offer is emitted at all. Lacking
 * offers/review/aggregateRating only makes the page ineligible for the
 * product-snippet rich result (Search Console shows a warning, not an error)
 * while the Product node still feeds Knowledge Graph and AI shopping surfaces.
 * Add an Offer with a real `price` if/when a public price catalogue ships.
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
    itemCondition: "https://schema.org/NewCondition",
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
