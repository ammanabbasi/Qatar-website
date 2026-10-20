# PPF installation page — claims and evidence (read 20 October 2026)

Page: `/en|ar/b2c/ppf-installation`. Code: `src/data/ppfEvidence.ts` (sources and copy), `src/data/ppfInstall.ts`
(prices, warranty terms), `src/components/ppf/Ppf{TrustStrip,FilmChoice,Warranty,PriceList}.tsx`.
The repository is public: no cost, margin or installer-fee data belongs here.

Rule for this page: a claim stays only if (a) a visitor can open a third-party source that says it, or (b) it is a
commitment ABK makes in its own booking terms. Everything else was removed (section 3).

## 1. What the page claims, and where it is checked

| Claim on the page | Evidence | Status |
|---|---|---|
| VTEK lists ABK's showroom address and phone as its Qatar contact | vtekfilms.com/contact-us, Qatar block: "Zone 56, Shop 2, Building 1306 Street 70, Mesaimer, Qatar", +974 3083 8355 | Verified. The page does not name ABK and does not use "distributor", "official" or "authorised". |
| VTEK warranty covers film "professionally installed by authorized film installers" against "manufacturing defects such as bubbling, cracking, peeling and fading" | vtekfilms.com/warranty | Verified |
| Terms by film: PRO 10, MATTE 5, PRISM 5, ULTIMATE 15 (NEX 5, not sold) | vtekfilms.com/warranty table | Verified. **PRO PLUS is not on the chart** (section 4, decision 1). |
| Claims start with the original installer; VTEK makes the final decision | vtekfilms.com/warranty, "Claim Process" | Verified |
| Each job is registered on the NFC e-Warranty; the record shows vehicle, product installed, installation date, installer details, warranty terms and status | vtekfilms.com/warranty, "Your digital warranty" | Verified |
| The portal checks coverage with plate number + phone number | nfc.vtekfilms.com/verify (form read live; nothing was entered) | Verified |
| Warranty can pass to a new owner with proof of purchase | vtekfilms.com/faq | Verified, but that FAQ still uses the old "VERTEK" name; re-check periodically |
| Wait about 7 days before automatic or pressure washing; keep the jet off the edges; no wax or sealant on the film; PPF-specific coating (Autotriz PPF & Vinyl Wrap Coating) once a year; coat after fitting, not before | vtekfilms.com/faq | Verified |
| Fit on a new car; wait about 2 months after a respray | vtekfilms.com/faq | Verified |
| Self-healing top layer; a scratch through it will not heal | vtekfilms.com/faq (layer about 13 microns) | Verified |
| Finish descriptions (PRO balance of protection, gloss, flexibility; MATTE non-reflective satin; PRISM colour options) | vtekfilms.com/weather-armor | Verified (paraphrased) |
| 4.9 on Google from 11 reviews | Google Maps listing for ABK (`SITE.mapsUrl`) | Verified. Shown as text with a link, dated; not marked up as review schema. |
| 12-month ABK fitting guarantee, its exclusions, full refund up to 48 h before, one free reschedule, pay after slot is confirmed | ABK booking terms (`Terms.section4Body`, `/terms#ppf-bookings`) | ABK's own commitment |
| Installed prices | `src/data/ppfInstall.ts` (owner-confirmed, updated 2026-10-04) | Owner data |
| Published competitor prices | `src/data/ppfMarket.ts` (provider-published statements only, read 2026-10-20) | Sourced |

## 2. How to refresh

Open each URL, compare it with the copy, then bump `EVIDENCE_CHECKED_AT` in `src/data/ppfEvidence.ts` (the page, the
WebPage `lastReviewed` date and `llms*.txt` all read it) and run `npm run llms:sync`. A source that no longer says it
means the copy goes. Update `GOOGLE_REVIEWS` from the Maps listing at the same time.

## 3. Claims removed, and why

| Removed | Why |
|---|---|
| "Installation photo": Toyota Land Cruiser in a Doha clean booth, "QAR 5,499 installed" | The file (`products/vertek/vertek-landcruiser-installation.webp`) is a stylised render of a Vertek film box, not a photo of a job. Removed from the page and from the Service schema. |
| Film thickness (7.5 / 8.0 / 8.5 mil), "aliphatic", "100% PVC-free", "99% gloss", "stable to 105°C", "UV index 11+", "repels desalinated tap water" | VTEK publishes none of these for its current films. Its FAQ says PRO is 8.0 mil and Ultra/Matte/Black 6.5 mil, which contradicts the page. |
| "Dust-filtered, climate-controlled clean booth", "VTEK-trained technicians", "VPC 2.0 plotted patterns, zero blade on paint", "Certified Installation Studio Network" | Nothing shows how the partner centre is equipped. VPC 2.0 is a real VTEK product, but nothing shows the centre uses it. These were added by the 4 and 17 October SEO passes, not by the owner. |
| "Official" / "exclusive" distributor, "no middleman", "zero reseller markup", "climate-controlled warehouse" | VTEK's pages use none of these words, and ABK is the middleman between customer and installer. The page now says "authorised distributor" and links the VTEK contact listing. The Arabic copy said "exclusive" (الحصري) while English said "official". |
| "Check your roll UID on nfc.vtekfilms.com/verify" | The portal asks for plate number and phone number. |
| "Wait 48 to 72 hours before the first wash" | VTEK says about 7 days before an automatic or pressure wash. |
| "9H ceramic over PPF is the gold standard" | VTEK says only a PPF-specific coating goes on the film, and coatings go on after fitting. |
| "5–12 year" warranty range, "12 years" for PRO PLUS | See decision 1. Now 5–15 by film, PRO PLUS 10. |

## 4. Decisions only the owner can make

1. **PRO PLUS warranty (10 years on the site now).** For 12: the pack artwork in the repo
   (`public/products/vtek/vtek-weather-armor-pro-plus.webp`, `…-lineup-v2.webp`) shows "12 YEARS e-WARRANTY", but its
   provenance is unknown. Against: VTEK's chart and film page list no 12-year film ("PRO+" shows 10 years), and the
   PRO PLUS line replaced the owner's original 15-year ULTIMATE offer on 4 Oct (commit 1005835) with a 12-year term and
   no source. Customers can read the term on VTEK's portal, so an overstated number is found out there. If you hold a
   VTEK document that names PRO PLUS and gives 12 years, set `warrantyYears: 12` for `pro-plus` in `ppfInstall.ts`
   (drives the page, FAQ, promos and llms), restore the PRO PLUS strings in `products.ts` and `categoriesAndBrands.ts`,
   and keep the document. If not, the pack photo should be replaced, and it is worth asking VTEK what PRO PLUS adds
   over PRO (the page says only "step-up gloss grade, priced higher").
2. **Installer proof.** The partner centres stay unnamed, so the page points to what VTEK's own record shows (installer
   details on the e-warranty). To go further, ask VTEK for an authorisation letter or a crawlable installer listing, and
   decide whether a redacted certificate can be shown.
3. **Real photographs.** No image in the repo is proven to be a real job or showroom photo, so the page shows none as
   evidence. Send handover photos, a photo of a registered NFC tag, and a screenshot of an e-warranty record
   (plate number blurred) and a "recent jobs" strip can be added.
4. **Process the new copy now promises.** The page says every job is registered on VTEK's e-warranty before the car
   leaves, that the installer's details appear on it, and that you can check it with plate number and phone number.
   Make sure the centre registers each job with the customer's plate and mobile.
5. **Still on other pages (not changed here).** Product pages and the VTEK brand hub still carry thickness, "aliphatic" and
   hydrophobic-coat claims; the brand hub says "exclusive authorized distributor" and "climate-controlled warehouse",
   and the Arabic gateway says "الموزع الحصري". See section 3 for why these are unsupported.
6. **Google Business Profile.** The listing name still carries "Vertek & Autotriz" (see the 20 Oct traffic audit).
