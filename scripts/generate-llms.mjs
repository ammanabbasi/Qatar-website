import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { registerHooks } from "module";

const repoRoot = path.resolve(import.meta.dirname, "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const full = path.join(repoRoot, "src", specifier.slice(2));
      return nextResolve(
        pathToFileURL(path.extname(full) ? full : `${full}.ts`).href,
        context,
      );
    }
    if (specifier.startsWith(".") && !path.extname(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { SITE } = await import(pathToFileURL(path.join(repoRoot, "src/lib/constants.ts")).href);
const { DELIVERY, DISCOUNT_ENTRY, DISCOUNT_TOP } = await import(
  pathToFileURL(path.join(repoRoot, "src/lib/pricing.ts")).href
);
const { PRODUCTS, isTradePack } = await import(
  pathToFileURL(path.join(repoRoot, "src/data/products.ts")).href
);
const { ARTICLES } = await import(pathToFileURL(path.join(repoRoot, "src/data/articles.ts")).href);
const { FAQ, PPF_INSTALL_FAQ } = await import(
  pathToFileURL(path.join(repoRoot, "src/data/faq.ts")).href
);
const { CATEGORY_LANDING_PAGES, BRAND_LANDING_PAGES } = await import(
  pathToFileURL(path.join(repoRoot, "src/data/categoriesAndBrands.ts")).href
);
const {
  BODY_TYPES,
  CUSTOM_MINIMUM_QAR,
  FILMS,
  PRICES_UPDATED_AT,
  ULTIMATE_WARRANTY_YEARS,
  fromPrice,
  quotePpf,
} = await import(pathToFileURL(path.join(repoRoot, "src/data/ppfInstall.ts")).href);
const {
  CLAIM_STEPS,
  EVIDENCE_CHECKED_AT,
  GOOGLE_REVIEWS,
  INSTALLER_POINTS,
  TRUST_PROOFS,
  VERIFY_STEPS,
  VTEK_URLS,
} = await import(pathToFileURL(path.join(repoRoot, "src/data/ppfEvidence.ts")).href);
const { PPF_MARKET, PPF_MARKET_CHECKED_AT } = await import(
  pathToFileURL(path.join(repoRoot, "src/data/ppfMarket.ts")).href
);

const CATEGORY_LABELS = {
  film: "Category 1: Paint Protection Films (PPF), Window Tint & Installation Aids",
  ceramic: "Category 2: Nano Ceramic Coatings & Surface Sealants",
  shampoo: "Category 3: Car Wash Shampoos & Snow Foams",
  polish: "Category 4: Polishing Compounds & German Foam/Wool Pads",
  dressing: "Category 5: Waxes, Dressings & Plastic Restorers",
  tyre: "Category 6: Wheel Cleaners & Tyre Care",
  interior: "Category 7: Interior, Leather & Glass Care",
  cleaners: "Category 8: Degreasers, Engine Cleaners & Adhesive Removers",
  tools: "Category 9: Microfibre Towels, Sponges, Sprayers & Detailing Tools",
  fragrance: "Category 10: Car & Home Fragrances",
};

const BRAND_LABELS = {
  VTEK: "VTEK (formerly Vertek)",
  Vertek: "VTEK (formerly Vertek)",
  Autotriz: "Autotriz (Germany)",
  Briller: "Briller Car Care (Canada)",
  Grizzly: "Grizzly (USA)",
  GrunesAuto: "GrünesAuto (Germany)",
  ABK: "ABK",
  InstaFinish: "Insta Finish (USA)",
  Getsun: "Getsun",
  SmartCar: "Smart Car",
  Other: "Workshop Consumables",
};

function formatPrice(p) {
  if (p.variants && p.variants.length > 0) {
    return p.variants.map((v) => `${v.size.en}: QAR ${v.priceQar}`).join(" | ");
  }
  if (p.priceQar) {
    if (p.originalPriceQar && p.originalPriceQar > p.priceQar) {
      return `QAR ${p.priceQar} (promotional price, was QAR ${p.originalPriceQar})`;
    }
    return `QAR ${p.priceQar}`;
  }
  return `Trade / wholesale quote via WhatsApp (${SITE.phone})`;
}

function minPriceOfProduct(p) {
  if (p.variants && p.variants.length > 0) {
    return Math.min(...p.variants.map((v) => v.priceQar));
  }
  return p.priceQar ?? null;
}

function maxPriceOfProduct(p) {
  if (p.variants && p.variants.length > 0) {
    return Math.max(...p.variants.map((v) => v.priceQar));
  }
  return p.priceQar ?? null;
}

function summarizePriceRange(items) {
  const mins = items.map(minPriceOfProduct).filter((n) => n !== null);
  const maxs = items.map(maxPriceOfProduct).filter((n) => n !== null);
  if (mins.length === 0) {
    return items.length > 0 ? "wholesale/roll quote on WhatsApp" : "showroom & trade enquiry";
  }
  const lo = Math.min(...mins);
  const hi = Math.max(...maxs);
  return lo === hi ? `QAR ${lo}` : `QAR ${lo}–${hi}`;
}

// Installed-PPF prices are READ from src/data/ppfInstall.ts, never typed here,
// so the llms files cannot drift from the quote builder.
const qar = (n) => `QAR ${n.toLocaleString("en-US")}`;
const longDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
const quote = (filmKey, coverage, body) =>
  quotePpf({ body, coverage, parts: [], film: filmKey }).priceQar;
const sizeRow = (filmKey, coverage) => BODY_TYPES.map((b) => qar(quote(filmKey, coverage, b.key)));
const FINISH = { pro: "Gloss", "pro-plus": "Step-up gloss", matte: "Satin matte" };
const yrsOf = (k) => FILMS.find((f) => f.key === k).warrantyYears;
const filmLong = (k) =>
  `${FILMS.find((f) => f.key === k).name.en} · ${FINISH[k]} · ${yrsOf(k)}-yr VTEK warranty`;
const COVER_ORDER = ["full-body", "full-front", "front-end"];
const COVER_SHORT = {
  "full-body": "Full body (all 12 painted zones)",
  "full-front": "Full front (5 zones)",
  "front-end": "Front-end partial kit",
};
const FILM_ORDER = ["pro", "pro-plus", "matte"];

const ppfTable = `### Installed prices (QAR, updated ${longDate(PRICES_UPDATED_AT)})

| Coverage | Film | Sedan / Coupe | Midsize SUV / Crossover | Large SUV / 4x4 / Pickup |
|---|---|---|---|---|
${COVER_ORDER.flatMap((cov) =>
  FILM_ORDER.map(
    (k) =>
      `| **${COVER_SHORT[cov]}** | ${filmLong(k)} | ${sizeRow(k, cov)
        .map((p) => `**${p}**`)
        .join(" | ")} |`,
  ),
).join("\n")}`;

const evidenceDate = longDate(EVIDENCE_CHECKED_AT);
const ppfEvidence = `Checkable evidence (sources read ${evidenceDate}):
${TRUST_PROOFS.map((p) => `- **${p.title.en}.** ${p.body.en} ${p.proof.internal ? `${SITE.url}/en${p.proof.href}` : p.proof.href}`).join("\n")}
- Rating basis: ${GOOGLE_REVIEWS.rating} stars from ${GOOGLE_REVIEWS.count} Google reviews of the Mesaimeer showroom (${evidenceDate}); it is the showroom's overall rating, not a PPF-only rating.

How to check the VTEK e-warranty yourself:
${VERIFY_STEPS.map((v, i) => `${i + 1}. ${v.en}`).join("\n")}

Who fits the car:
${INSTALLER_POINTS.map((v) => `- ${v.en}`).join("\n")}

If something goes wrong:
${CLAIM_STEPS.map((v, i) => `${i + 1}. ${v.en}`).join("\n")}`;

const marketNote =
  "Each figure is a provider's own published statement; ABK does not estimate competitors' prices. Providers price by vehicle, film brand, thickness and scope, so compare the film line, warranty terms and coverage as well as the headline price.";
const marketTable = `### Doha PPF — published starting prices (read ${longDate(PPF_MARKET_CHECKED_AT)})

${marketNote}

| Provider | Published price | Film, warranty and notes | Source |
|---|---|---|---|
| **ABK Trading & Service** | Fixed installed prices by car size and film (table above); from ${qar(fromPrice("front-end"))} front end and ${qar(fromPrice("full-body"))} full body (sedan, PRO film) | VTEK NFC e-Warranty: PRO ${yrsOf("pro")} years, PRO PLUS ${yrsOf("pro-plus")} years, MATTE and PRISM ${yrsOf("matte")} years; 12-month ABK workmanship guarantee; film and fitting included | ${SITE.url}/en/b2c/ppf-installation |
${PPF_MARKET.map((r) => `| ${r.provider} | ${r.published.en} | ${r.caveat.en} | ${r.sourceUrl} |`).join("\n")}`;

// Deterministic "last synchronized": the newest date any input carries.
const SYNC_DATE = [
  PRICES_UPDATED_AT,
  PPF_MARKET_CHECKED_AT,
  ...ARTICLES.map((a) => a.updated ?? a.date),
  ...PRODUCTS.map((p) => p.updatedAt).filter(Boolean),
]
  .sort()
  .at(-1);

// Strictly conforms to llmstxt.org & Lighthouse Agentic Browsing (llms-txt):
// 1. Single H1 title
// 2. Concise `>` summary blockquote
// 3. Factual entity overview paragraphs BEFORE the first H2
// 4. Every `##` section consists solely of `- [Title](URL): description` Markdown links
// 5. Zero robots.txt-disallowed query URLs (`?pack=trade` excluded)
const llmsTxt = `# ${SITE.name}

> Authorized Qatar distributor, importer, and retailer of automotive paint protection film (VTEK PPF), solar window film, German nano-ceramic coatings (Autotriz), 20L commercial wash chemicals (Briller), German foam pads (GrünesAuto), and detailing supplies in Mesaimeer, Doha, Qatar — plus fixed-price installed VTEK PPF packages fitted at a VTEK-authorised partner centre in Doha.

${SITE.name} (Google Business Profile: "${SITE.gbpName}") operates a retail showroom and wholesale warehouse at ${SITE.address.full} (GPS ${SITE.geo.latitude}, ${SITE.geo.longitude}; phone & WhatsApp ${SITE.phone}; landline ${SITE.phoneLandline}; email ${SITE.email}). Opening hours: Saturday–Thursday ${SITE.hours.weekdaysMorning} & ${SITE.hours.weekdaysEvening}; Friday ${SITE.hours.friday}. Every page is published in English (\`/en\`) and Arabic (\`/ar\`).

ABK stocks ${PRODUCTS.length} active SKUs across retail bottles, 20-litre workshop drums, and 1.52m × 15m master film rolls. Website cart orders receive automatic tiered discounts (${DISCOUNT_ENTRY.percent}% off from QAR ${DISCOUNT_ENTRY.minSubtotalQar}; ${DISCOUNT_TOP.percent}% off from QAR ${DISCOUNT_TOP.minSubtotalQar}) and free delivery across Doha, Lusail, Al Rayyan, Al Wakrah, and Al Khor from QAR ${DELIVERY.freeThresholdQar} (QAR ${DELIVERY.feeQar} below; showroom pickup free).

ABK is a product distributor and store, not a detailing workshop. The one installed service ABK sells is fixed-price VTEK Weather Armor PPF installation in Doha (PRO ${yrsOf("pro")}-yr: front-end ${sizeRow("pro", "front-end").join(" / ")}, full front ${sizeRow("pro", "full-front").join(" / ")}, full body ${sizeRow("pro", "full-body").join(" / ")} for Sedan / Mid SUV / Large SUV; PRO PLUS ${yrsOf("pro-plus")}-yr & MATTE ${yrsOf("matte")}-yr full body ${sizeRow("pro-plus", "full-body").join(" / ")}; custom panels from ${qar(CUSTOM_MINIMUM_QAR)}), backed by VTEK NFC e-Warranty registration and ABK's 12-month fitting guarantee. Window tint, ceramic coatings, and detailing chemicals are sold as products only.

## Storefront & Services

- [ABK Storefront Home (English)](${SITE.url}/en): Retail & wholesale car care storefront, Doha showroom details, and featured products.
- [ABK Storefront Home (Arabic)](${SITE.url}/ar): الصفحة الرئيسية لمعرض ومنتجات شركة ABK للتجارة والخدمات في مسيمير، الدوحة.
- [All Detailing & Film Products (${PRODUCTS.length} SKUs)](${SITE.url}/en/b2c/products): Complete online catalogue with live QAR retail prices, variant selectors, and WhatsApp trade quotes.
- [Installed VTEK PPF in Doha — Fixed Prices & Calculator](${SITE.url}/en/b2c/ppf-installation): Instant quote calculator and booking for installed VTEK PPF (from ${qar(fromPrice("front-end"))} front-end, ${qar(fromPrice("full-body"))} full-body sedan).
- [Become an Authorized Wholesale Partner (B2B)](${SITE.url}/en/b2b/become-a-dealer): Trade account application for detailing studios, car washes, tint shops, and GCC distributors.

## Product Categories

${CATEGORY_LANDING_PAGES.map((c) => {
  const items = PRODUCTS.filter((p) => p.category === c.slug);
  return `- [${c.h1.en}](${SITE.url}/en/b2c/categories/${c.slug}): ${items.length} SKUs (${summarizePriceRange(items)}) — ${c.description.en}`;
}).join("\n")}

## Official Brand Hubs

${BRAND_LANDING_PAGES.map((b) => {
  const items = PRODUCTS.filter((p) => b.matchBrandKeys.includes(p.brand));
  const countNote =
    items.length > 0
      ? `${items.length} online SKUs (${summarizePriceRange(items)})`
      : "Showroom & wholesale batch enquiry";
  return `- [${b.h1.en}](${SITE.url}/en/b2c/brands/${b.slug}): ${countNote} — ${b.description.en}`;
}).join("\n")}

## Qatar Car Care & PPF Guides

- [Qatar Car Care & PPF Editorial Hub](${SITE.url}/en/b2c/blog): Bilingual buying guides, Doha price comparisons, and traffic-regulation summaries.
${ARTICLES.map((a) => `- [${a.title.en}](${SITE.url}/en/b2c/blog/${a.slug}): ${a.description.en}`).join("\n")}

## Optional

- [Complete Product & Technical Manifest (llms-full.txt)](${SITE.url}/llms-full.txt): Exhaustive SKU-by-SKU specifications, QAR prices, PPF price tables, and FAQs.
- [About ABK Trading & Service](${SITE.url}/en/about): Company profile, authorized brand distributorships, and store FAQs.
- [Mesaimeer Showroom Location & Contact](${SITE.url}/en/contact): Map coordinates, opening hours, phone numbers, and enquiry form.
- [Terms of Use & PPF Booking Terms](${SITE.url}/en/terms): Retail, wholesale, cancellation, and 12-month PPF fitting guarantee terms.
- [Privacy Policy](${SITE.url}/en/privacy): Customer data handling for orders, PPF bookings, and dealer applications.
- [XML Sitemap](${SITE.url}/sitemap.xml): Canonical bilingual EN/AR URL index with hreflang alternates.
`;

const categoriesOrder = [
  "film",
  "ceramic",
  "shampoo",
  "polish",
  "dressing",
  "tyre",
  "interior",
  "cleaners",
  "tools",
  "fragrance",
];

const productSections = categoriesOrder
  .map((cat) => {
    const items = PRODUCTS.filter((p) => p.category === cat);
    const lines = items
      .map((p, idx) => {
        const specStr =
          p.specs && p.specs.length > 0
            ? p.specs.map((s) => `${s.label.en}: ${s.value.en}`).join(" | ")
            : "";
        const trade = isTradePack(p);
        return `#### ${idx + 1}. ${p.name.en} (${p.name.ar})
- **SKU:** \`${p.slug}\`
- **URL (EN):** ${SITE.url}/en/b2c/products/${p.slug}
- **URL (AR):** ${SITE.url}/ar/b2c/products/${p.slug}
- **Brand:** ${BRAND_LABELS[p.brand] || p.brand}
- **Pack Tier:** ${trade ? "Trade / Workshop Bulk (also available for individual purchase)" : "Retail & Professional"}
- **Price:** ${formatPrice(p)}
- **Summary:** ${p.shortDesc.en}
- **Description:** ${p.longDesc.en}${specStr ? `\n- **Technical Specs:** ${specStr}` : ""}`;
      })
      .join("\n\n");

    return `### ${CATEGORY_LABELS[cat]} (${items.length} SKUs)\n\n${lines}`;
  })
  .join("\n\n---\n\n");

const brandPortfolioSections = BRAND_LANDING_PAGES.map((b) => {
  const items = PRODUCTS.filter((p) => b.matchBrandKeys.includes(p.brand));
  const skuList =
    items.length > 0
      ? items.map((p) => `\`${p.name.en}\` (${formatPrice(p)})`).join("; ")
      : `Batch-stocked via Mesaimeer showroom & trade desk (${SITE.phone})`;
  return `### ${b.h1.en}
- **Origin:** ${b.origin.en} | **Role:** ${b.roleBadge.en}
- **Hub URL:** ${SITE.url}/en/b2c/brands/${b.slug} (Arabic: ${SITE.url}/ar/b2c/brands/${b.slug})
- **Summary:** ${b.subtitle.en}
- **Active SKUs (${items.length}):** ${skuList}`;
}).join("\n\n");

const otherItems = PRODUCTS.filter((p) => p.brand === "Other" || p.brand === "SmartCar");
const otherPortfolioSection = `### Smart Car & Workshop Consumables (${otherItems.length} SKUs)
- **Active SKUs:** ${otherItems.map((p) => `\`${p.name.en}\` (${formatPrice(p)})`).join("; ")}`;

const llmsFullTxt = `# ${SITE.name} — Complete Machine-Readable Knowledge Base & Product Manifest

> **Entity:** ${SITE.name} (ABK Trading Service / ABK للتجارة والخدمات)  
> **Google Business Profile:** "${SITE.gbpName}"  
> **Headquarters:** ${SITE.address.full}  
> **GPS Coordinates:** ${SITE.geo.latitude}, ${SITE.geo.longitude} | Google Maps: ${SITE.mapsUrl}  
> **Primary Communications:** WhatsApp / Sales: ${SITE.phone} | Mobile: ${SITE.phoneSecondary} | Landline: ${SITE.phoneLandline}  
> **Email:** ${SITE.email}  
> **Website:** ${SITE.url} (English: /en, Arabic: /ar)  
> **Last Synchronized:** ${SYNC_DATE} (${PRODUCTS.length} products, ${ARTICLES.length} guides)  
> **Operational Mandate:** ABK is a product distributor, importer, and wholesale supplier. ABK supplies genuine products to detailing studios, workshops, commercial carwashes, dealerships, and retail DIY car owners. ABK is not a workshop. The one installed service ABK sells is VTEK paint protection film for car owners in Qatar: ABK quotes, books and guarantees the job, and the film is fitted at a VTEK-authorised partner centre in Doha (${SITE.url}/en/b2c/ppf-installation — from ${qar(fromPrice("front-end"))} front-end, ${qar(fromPrice("full-front"))} full front, ${qar(fromPrice("full-body"))} full body). ABK does not perform window tinting, ceramic coating application or detailing services.

---

## 1. Brand Portfolio & Live SKU Summary

${brandPortfolioSections}

${otherPortfolioSection}

---

## 2. Exhaustive Product Catalog & Technical Specifications (${PRODUCTS.length} SKUs)

- **Main Catalogue (EN):** ${SITE.url}/en/b2c/products
- **Main Catalogue (AR):** ${SITE.url}/ar/b2c/products
- **Wholesale & Dealer Program:** ${SITE.url}/en/b2b/become-a-dealer

${productSections}

---

## 3. Qatar Climate Adaptation & Detailing Challenges

Every chemical and film distributed by ABK is selected to withstand the extreme environmental conditions of the Arabian Gulf:
1. **Extreme Ambient Heat (45°C–50°C+):** Cheap PVC/TPH films can yellow, crack, and harden rapidly in Doha summer heat. TPU films such as VTEK Weather Armor carry a written manufacturer warranty of 5 to ${ULTIMATE_WARRANTY_YEARS} years by film.
2. **Desert Sandstorm Abrasion:** Airborne sand acts as an abrasive grit on highways such as Al Shamal Road and Salwa Road. VTEK Weather Armor self-healing top layers close light swirl marks under heat.
3. **Hard Tap Water & Mineral Etching:** Doha desalinated tap water carries dissolved minerals. Autotriz polysilazane and graphene-hybrid ceramic coatings create hydrophobic surfaces so rinse water beads and rolls off before baking into mineral rings.
4. **Intense Solar UV Radiation:** High UV exposure fades exterior plastics and heats vehicle cabins. VTEK Solar Armor window films reject 99%+ UV and up to 95%–98% infrared heat (permitted on rear side doors with a QR 20 Traffic Department permit), while French-made ABK Rejuvenate restores sun-faded exterior trims for up to 6 months.

---

## 4. Retail Cart Discounts & Wholesale B2B Terms

- **Retail Online Cart & Walk-In Showroom:**
  - Free local delivery across Doha, Lusail, Al Rayyan, Al Wakrah, and Al Khor on orders of QAR ${DELIVERY.freeThresholdQar}+ (flat QAR ${DELIVERY.feeQar} below; showroom pickup free).
  - Automatic cart discounts: ${DISCOUNT_ENTRY.percent}% off orders from QAR ${DISCOUNT_ENTRY.minSubtotalQar} and ${DISCOUNT_TOP.percent}% off orders from QAR ${DISCOUNT_TOP.minSubtotalQar}.
- **Wholesale Trade Accounts:**
  - Target accounts: Detailing studios, tint shops, commercial car washes, dealerships, and fleet operators across Qatar and the GCC.
  - Apply at ${SITE.url}/en/b2b/become-a-dealer or message the Wholesale Trade Desk on WhatsApp (${SITE.phone}).

---

## 5. Installed PPF Service for Car Owners in Qatar (Full-Body From ${qar(fromPrice("full-body"))})

ABK sells installed VTEK paint protection film. ABK quotes, books, takes payment and stands behind the job; a VTEK-authorised installer in Doha does the fitting. ABK supplies the film from its own stock as VTEK's authorised distributor in Qatar (Mesaimeer showroom).

${ppfTable}

- **Full body (all 12 painted zones):** whole bonnet, front bumper, rear bumper, left & right front fenders, all 4 doors, roof, boot/tailgate, rear quarter panels & rocker sills, side mirrors, headlights, and A-pillars.
- **Full front (5 zones):** whole bonnet (edge-to-edge), front bumper, both front fenders, side mirrors, and headlights.
- **Front-end partial kit:** front bumper, leading ~40 cm of the bonnet and front fenders, side mirrors, and headlights.
- **Individual panels:** live estimate in the quote builder, from ${qar(CUSTOM_MINIMUM_QAR)}, capped at the full-body price; confirmed on WhatsApp.
- **PRISM colour-change PPF (${yrsOf("prism")}-yr VTEK warranty):** priced per car (enquire on WhatsApp). **Old film or wrap removal:** quoted upfront and added to the confirmed price.

${marketTable}

### What every installation includes (verification steps)
1. Genuine VTEK film from ABK's own stock as VTEK's authorised Qatar distributor (never sourced from a third party). VTEK film descriptions: ${VTEK_URLS.films}
2. Fitting by a VTEK-authorised installer in Doha.
3. Condition photos at drop-off; pre-existing paint defects recorded.
4. ABK inspection of the finish before handover.
5. VTEK manufacturer NFC e-Warranty registered to the car, checkable with the plate number and phone number at ${VTEK_URLS.eWarrantyCheck}: PRO ${yrsOf("pro")} years, PRO PLUS ${yrsOf("pro-plus")} years, MATTE ${yrsOf("matte")} years, PRISM ${yrsOf("prism")} years, ULTIMATE ${ULTIMATE_WARRANTY_YEARS} years (special roll order), against manufacturing defects such as bubbling, cracking, peeling and fading (${VTEK_URLS.warranty}).
6. ABK fitting guarantee for 12 months from handover (lifting, bubbles, edge failure). It does not cover accidents, stone impacts, improper washing or pressure-washing the film edges, repairs done elsewhere or paint defects recorded at drop-off.

${ppfEvidence}

### Booking terms
- Typical fitting time: front-end same day (5–7 hrs); full front 1 day; full body 2–3 days.
- Payment: 100% by bank transfer or cash after ABK confirms the slot.
- Cancellation: full refund up to 48 hours before the slot; one free reschedule.
- Quote builder and booking: ${SITE.url}/en/b2c/ppf-installation (Arabic: ${SITE.url}/ar/b2c/ppf-installation). WhatsApp: ${SITE.phone}.

---

## 6. Qatar Car Care & PPF Editorial Guides (${ARTICLES.length} Bilingual Guides)

- **Blog Hub (EN):** ${SITE.url}/en/b2c/blog
- **Blog Hub (AR):** ${SITE.url}/ar/b2c/blog

${ARTICLES.map(
  (a, i) => `### ${i + 1}. ${a.title.en}
- **Arabic Title:** ${a.title.ar}
- **URL (EN):** ${SITE.url}/en/b2c/blog/${a.slug}
- **URL (AR):** ${SITE.url}/ar/b2c/blog/${a.slug}
- **Published:** ${a.date}${a.updated ? ` (Updated: ${a.updated})` : ""}
- **Summary:** ${a.description.en}
- **Related Product SKUs:** ${a.relatedProducts.map((s) => `\`${s}\``).join(", ")}`,
).join("\n\n")}

---

## 7. Frequently Asked Questions (Store, Products & Wholesale)

${FAQ.map((f, i) => `### Q${i + 1}: ${f.q.en}\n${f.a.en}`).join("\n\n")}

---

## 8. Frequently Asked Questions (Installed VTEK PPF in Doha)

${PPF_INSTALL_FAQ.map((f, i) => `### PPF Q${i + 1}: ${f.q.en}\n${f.a.en}`).join("\n\n")}
`;

const norm = (s) => s.replace(/\r\n/g, "\n");
const llmsPath = path.join(repoRoot, "public/llms.txt");
const llmsFullPath = path.join(repoRoot, "public/llms-full.txt");

if (process.argv.includes("--check")) {
  const curLlms = fs.existsSync(llmsPath) ? norm(fs.readFileSync(llmsPath, "utf8")) : "";
  const curFull = fs.existsSync(llmsFullPath) ? norm(fs.readFileSync(llmsFullPath, "utf8")) : "";
  if (curLlms !== norm(llmsTxt) || curFull !== norm(llmsFullTxt)) {
    console.error("public/llms.txt or public/llms-full.txt is out of sync. Run `npm run llms:sync`.");
    process.exit(1);
  }
  console.log("llms.txt & llms-full.txt are in sync with live data.");
} else {
  fs.writeFileSync(llmsPath, llmsTxt, "utf8");
  fs.writeFileSync(llmsFullPath, llmsFullTxt, "utf8");
  console.log(
    `Successfully wrote public/llms.txt (${llmsTxt.length} chars) and public/llms-full.txt (${llmsFullTxt.length} chars) with ${PRODUCTS.length} products and ${ARTICLES.length} articles.`,
  );
}
