# Local Authority, Manufacturer Verification & Directory Playbook — PPF Installation Doha

**Last Updated:** 20 October 2026 (corrected — see the audit note below)  
**Target URLs:**
- English: `https://abktradingservice.com/en/b2c/ppf-installation`
- Arabic: `https://abktradingservice.com/ar/b2c/ppf-installation`

> **Correction, 20 Oct 2026.** An earlier version of this file described the Google Business Profile with a different
> name and coordinates than the live listing, named competitors as appearing in directory roundups, and gave VTEK
> contact details that could not be verified (the old `vertekfilms.com` domain now redirects to `vtekfilms.com`).
> Those statements are replaced below with what was actually observed. Current facts, the owner decisions that are
> still open and the external actions in priority order are in `2026-10-20-traffic-audit-and-actions.md`.

---

## 1. External Presence & Local Authority Audit (October 2026)

| Platform / Directory | Current Status | Key Finding / Gap | Impact on Search & AI (ChatGPT, Gemini, Perplexity, Copilot) |
|---|---|---|---|
| **Google Business Profile (`ABK Trading and Service — Vertek & Autotriz`)** | Live on Google Maps (CID `9860894303806767987`, pin `25.2040478, 51.5029268`, Mesaimeer), category *Car accessories store*, 4.9★ from 11 reviews (observed 20 Oct 2026). **Not manageable** from the two Chrome profiles available to the SEO tooling (Business Profile Manager shows 0 businesses). | The listed name carries the retired "Vertek" spelling and two brand names (name-stuffing risk). Installed VTEK PPF packages are not listed as Services/Products with links to `/en/b2c/ppf-installation`. | High — Google Local Pack and Gemini ground local service answers in GBP Service & Product entries. |
| **VTEK Official Website (`vtekfilms.com`)** | `vtekfilms.com/weather-armor`, `vtekfilms.com/warranty`, `nfc.vtekfilms.com/verify`, and `vtekfilms.com/vpc` are live. | `https://www.vtekfilms.com/installer-locator` renders an interactive map widget without crawlable static HTML listing **ABK Trading & Service (Qatar Official Distributor)** or linking to `abktradingservice.com`. | Very High — AI models verify "authorised distributor/installer" claims by cross-checking manufacturer domains. |
| **Bing Places for Business** | Synced with GBP | Service menu should explicitly include **VTEK Full-Body PPF Installation Doha (From QAR 3,999)** and **VTEK Front PPF Packages (From QAR 899)** to feed Microsoft Copilot and ChatGPT Search. | High — ChatGPT Search and Copilot rely heavily on Bing Places entity attributes. |
| **Qatar Local Directories (`Qatar Living`, `Marhaba Qatar`, `Yellow Pages Qatar`)** | Not checked in the 20 Oct 2026 pass. | Confirm each listing exists and that name, address and phone match the website exactly (NAP consistency). | Medium-High — Third-party citations reinforce entity association with *"PPF installation Doha"*. |

---

## 2. Showroom vs. Partner Installation Studio Distinction (Compliance Policy)

Per owner policy (`src/data/ppfInstall.ts`, 2 October 2026), **partner installation studios are deliberately not named publicly**. All external profiles must maintain this exact, transparent distinction:
- **ABK Mesaimeer Showroom & Central Warehouse (`Barwa Village / Mesaimeer, Doha`):** Official VTEK Qatar distributor headquarters. Customers can inspect physical VTEK TPU film samples (`PRO`, `PRO PLUS`, `MATTE`, `PRISM`), verify roll serial numbers, and consult in person.
- **VTEK-Authorised Partner Clean Booths (Doha):** Physical film application takes place in dust-controlled, climate-regulated partner bays in Doha using VTEK VPC 2.0 computer-plotted templates. Exact bay drop-off coordinates are sent on WhatsApp once the booking slot is confirmed.

---

## 3. Ready-to-Paste Google Business Profile (GBP) & Bing Places Updates

### A. GBP "Services" Menu Entries (Add under Car Care / Auto Film Services)

1. **Service Name:** Full-Body VTEK PPF Installation (Sedan / Coupe) — 10-Yr Warranty  
   **Price:** Fixed — `QAR 3,999`  
   **Description:** Complete 12-panel installed VTEK Weather Armor PRO aliphatic TPU (7.5 mil / 190 µm, heat self-healing, non-yellowing). Supplied from ABK's official Qatar distributor stock and fitted in a VTEK-authorised Doha clean booth. Includes 10-year VTEK NFC e-Warranty (`nfc.vtekfilms.com/verify`) + 12-month ABK fitting guarantee.  

2. **Service Name:** Full-Body VTEK PPF Installation (Midsize SUV / Crossover) — 10-Yr Warranty  
   **Price:** Fixed — `QAR 4,799`  
   **Description:** Complete 12-panel installed VTEK Weather Armor PRO aliphatic TPU (7.5 mil) for Prado, Cayenne, X5, GLC, Jetour T2, and midsize SUVs. Fitted in a VTEK-authorised Doha clean booth with 10-year VTEK NFC e-Warranty + 12-month ABK fitting guarantee.

3. **Service Name:** Full-Body VTEK PPF Installation (Large SUV / 4x4 / Pickup) — 10-Yr Warranty  
   **Price:** Fixed — `QAR 5,499`  
   **Description:** Complete 12-panel installed VTEK Weather Armor PRO aliphatic TPU (7.5 mil) for Land Cruiser 300, Nissan Patrol, Defender 110/130, LX600, G-Class, Tahoe, and Sierra. Includes 10-year VTEK NFC e-Warranty + 12-month ABK fitting guarantee.

4. **Service Name:** Full-Front VTEK PPF Package (5 Zones) — 10-Yr Warranty  
   **Price:** From `QAR 1,599`  
   **Description:** Whole bonnet (edge-to-edge), front bumper, both front fenders, side mirrors, and headlights in VTEK Weather Armor PRO 7.5 mil TPU (`QAR 1,599` Sedan · `QAR 1,899` Mid SUV · `QAR 2,199` Large SUV). 1-day turnaround in Doha.

5. **Service Name:** Front-End VTEK PPF Highway Kit — 10-Yr Warranty  
   **Price:** From `QAR 899`  
   **Description:** Front bumper, leading ~40 cm of bonnet & fenders, side mirrors, and headlights (`QAR 899` Sedan · `QAR 1,049` Mid SUV · `QAR 1,199` Large SUV). Same-day turnaround in Doha.

### B. GBP "Products" Showcase Entry (High-Visibility Card on Google Maps & Search)
- **Product Name:** Installed Full-Body VTEK PPF (Doha, Qatar) — From QAR 3,999
- **Category:** Paint Protection Film (PPF) Installation
- **Price:** `QAR 3,999`
- **Product Landing Page URL:** `https://abktradingservice.com/en/b2c/ppf-installation`
- **Description:** Looking for full-body PPF in Qatar under QAR 5,000? ABK Trading & Service (Qatar's official VTEK distributor) offers fixed-price Full-Body 12-panel VTEK Weather Armor PRO TPU at QAR 3,999 (Sedan), QAR 4,799 (Mid SUV), and QAR 5,499 (Large 4x4). Fitted in VTEK-authorised Doha clean booths with a 10-year VTEK NFC e-Warranty and 12-month ABK fitting cover.

---

## 4. Manufacturer Outreach Draft — VTEK (`vtekfilms.com/installer-locator`)

Send the following message to VTEK using the contact details shown on `https://www.vtekfilms.com/contact-us` (that page already lists ABK's Mesaimeer showroom in its Qatar block, which is the verifiable proof to build on). Ask for a crawlable text listing/link so search engines and AI crawlers can verify ABK's Qatar status on `vtekfilms.com`:

> **Subject:** Official Qatar Distributor Listing & Backlink on `vtekfilms.com/installer-locator` — ABK Trading & Service
>
> Hi VTEK Team,
>
> Could you please add/update our official Qatar Distributor & Authorised Installation Booking entry on `https://www.vtekfilms.com/installer-locator` in static crawlable text (so Google, Bing, and AI assistants can verify our official Qatar status)?
>
> **Listing Details for Qatar:**
> - **Company Name:** ABK Trading & Service (ABK للتجارة والخدمات)
> - **Role:** Official VTEK Distributor & Authorised Installation Booking Center — State of Qatar
> - **Showroom & Warehouse Address:** Mesaimeer (near Barwa Village), Doha, Qatar
> - **Phone / WhatsApp:** +974 3083 8355 / +974 7105 9790
> - **Email:** info@abktradingservice.com
> - **Website (PPF Installation & Online Quote Builder):** https://abktradingservice.com/en/b2c/ppf-installation
> - **VTEK Brand Catalog (Qatar):** https://abktradingservice.com/en/b2c/brands/vtek
>
> Having a crawlable text link from `vtekfilms.com/installer-locator` to `https://abktradingservice.com/en/b2c/ppf-installation` helps customers in Doha verify genuine VTEK Weather Armor installations and NFC e-Warranty coverage.
>
> Thank you!  
> **ABK Trading & Service — Doha, Qatar**

---

## 5. Qatar Directory & Citation Copy (Consistent Bilingual Descriptions)

Use these exact descriptions when updating **Qatar Living Services**, **Marhaba Qatar Business Directory**, and **Yellow Pages Qatar**:

- **English Summary (160–220 words):**  
  **ABK Trading & Service** is Qatar's official distributor of **VTEK Paint Protection Film (PPF)**, **Grizzly PPF**, **Autotriz Germany** ceramic coatings, and **Briller Canada** car care products, headquartered in Mesaimeer, Doha (`+974 3083 8355`). In addition to retail and wholesale trade supply, ABK offers fixed-price **installed VTEK Weather Armor TPU PPF packages** fitted in VTEK-authorised Doha partner clean booths:
  - **Full-Body 12-Panel PPF (10-Yr VTEK NFC e-Warranty):** `QAR 3,999` (Sedan/Coupe) · `QAR 4,799` (Midsize SUV) · `QAR 5,499` (Large SUV / 4x4)
  - **Full-Front 5-Zone PPF:** `QAR 1,599` (Sedan) · `QAR 1,899` (Mid SUV) · `QAR 2,199` (Large SUV)
  - **Front-End Highway Kit:** `QAR 899` (Sedan) · `QAR 1,049` (Mid SUV) · `QAR 1,199` (Large SUV)
  Every installation includes computer-plotted VTEK VPC 2.0 patterns, drop-off condition photos, ABK handover inspection, a 12-month ABK workmanship guarantee, and official VTEK NFC e-Warranty registration (`nfc.vtekfilms.com/verify`). Compare packages and build an instant quote at `https://abktradingservice.com/en/b2c/ppf-installation`.

- **Arabic Summary:**  
  **شركة ABK للتجارة والخدمات** هي الموزع الرسمي لأفلام حماية الطلاء **VTEK PPF** ومنتجات العناية بالسيارات في الدوحة، قطر (معرض مسيمير — `+974 3083 8355`). نوفر خدمة تركيب أفلام حماية الطلاء الأصلية **VTEK Weather Armor TPU** بأسعار ثابتة ومعلنة في كبائن نظيفة معتمدة بالدوحة:
  - **حماية الهيكل الكامل (12 قطعة — ضمان إلكتروني NFC لمدة 10 سنوات):** `3,999 ر.ق` (سيدان/كوبيه) · `4,799 ر.ق` (SUV متوسطة) · `5,499 ر.ق` (دفع رباعي كبير 4×4)
  - **باقة الواجهة الكاملة (5 مناطق):** تبدأ من `1,599 ر.ق`
  - **باقة الواجهة الأساسية:** تبدأ من `899 ر.ق`
  احسب سعرك الفوري واحجز موعدك عبر `https://abktradingservice.com/ar/b2c/ppf-installation`.
