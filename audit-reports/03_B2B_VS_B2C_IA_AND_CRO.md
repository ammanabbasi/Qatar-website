# ABK Trading & Service — B2B vs. B2C Information Architecture & Conversion Rate Optimization (CRO)

**Business Model:** Dual B2C (Direct Consumer Retail Car Care) & B2B (Wholesale Supply, Detailing Studio & Tint Shop Trade Distribution)  
**Primary Region:** State of Qatar (Doha, Mesaimeer, Al Rayyan, Industrial Area, Lusail) & GCC  
**Primary Conversion Channels:** WhatsApp Direct Deep-links, WhatsApp Multi-Item Order Tray, Trade RFQ Dealer Onboarding Form, Click-to-Call Telephony  

---

## 1. Audience Intent Segregation & Mental Models

ABK operates a bifurcated commercial model serving two audiences with distinct buying motives, qualification criteria, and conversion expectations.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ABK AUDIENCE SEGREGATION                                     │
├────────────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│ Dimension                      │ B2C (Retail Consumer)         │ B2B (Commercial Trade)        │
├────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Buyer Persona                  │ Luxury car owner, DIYer,      │ Detailing studio owner, tint  │
│                                │ weekend detailer in Doha      │ shop installer, fleet manager │
├────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Primary Need                   │ Immediate product for personal│ Reliable bulk supply, margin  │
│                                │ vehicle; climate protection   │ potential, warranty backing   │
├────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Decision Metric                │ Verified price, ease of order,│ Trade pricing tiers, roll     │
│                                │ fast Mesaimeer pickup/delivery│ dimensions, TDS, carton counts│
├────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Purchase Cycle                 │ Immediate (minutes to hours)  │ Evaluation (days to weeks)    │
├────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Primary CTA                    │ "Order on WhatsApp" (طلب واتساب)│ "Request Wholesale Quote"     │
│                                │                               │ (طلب عرض أسعار جملة)          │
└────────────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

---

## 2. Friction Points & UX Breakdown

### Friction Point 1: Single-Bottle Retail Anchoring on Wholesale Views
* **Problem:** In `ProductPurchasePanel.tsx` (lines 152–163), when a commercial buyer views a product under `/b2b/products/[slug]`, the interface displays the retail single-bottle price struck through as "MSRP" (e.g. *QAR 50*).
* **Friction:** For commercial buyers seeking 20-litre drums or 24-piece master cartons, showing a single 60ml or 500ml retail unit creates cognitive friction. They want to know master packaging units, minimum order quantities (MOQ), and volume discount tiers (e.g. 5+ rolls, 10+ cartons).

### Friction Point 2: Severed Technical Data Sheets (TDS) and Safety Documentation
* **Problem:** Commit `1599418` completely stripped PDF catalogue and specification downloads from the product detail page.
* **Friction:** Professional PPF and tint installers in Qatar (especially those outfitting high-end vehicles in Lusail and The Pearl) require Technical Data Sheets (TDS) detailing:
  - Tensile strength (MPa) & elongation percentage
  - VLT (Visible Light Transmission) & Infrared Heat Rejection (IRR %)
  - UV rejection percentage (99%+)
  - Top-coat self-healing activation temperature
  Without downloadable spec sheets, commercial buyers must repeatedly ask basic technical questions on WhatsApp, delaying deal closures.

### Friction Point 3: Form-Submit Telemetry Blind Spot in Dealer Onboarding
* **Problem:** In `DealerApplicationForm.tsx` (lines 49–74), form submission triggers:
  ```typescript
  const url = buildDealerApplicationWhatsAppUrl({...});
  window.open(url, "_blank");
  ```
* **Friction & Data Loss:**
  1. `src/instrumentation-client.ts` only listens to click events on `<a>` tags.
  2. Submitting this high-value B2B form fires **zero Google Ads conversions, zero GA4 events, and zero Plausible goals**.
  3. Mobile browsers (Safari iOS and Chrome Android) frequently block `window.open()` invoked after asynchronous state updates or form validations as untrusted popups, stranding the user.

---

## 3. Redesigned Information Architecture & Navigation Hierarchy

### 3.1 Navigation Structure

```
ABK TRADING SITE ARCHITECTURE
│
├── B2C (Retail Consumer)
│   ├── /en (Home — Showcase & Best Sellers)
│   ├── /en/b2c/products (Retail Catalogue & DIY Guides)
│   │   └── /en/b2c/products/[slug] (PDP with Verified QAR Price & WhatsApp Order)
│   └── /en/b2c/blog (Qatar Climate Car Care Guides & Tutorials)
│
├── B2B (Wholesale & Trade Supply)
│   ├── /en/b2b (Wholesale Hub & Studio Supply Overview)
│   ├── /en/b2b/products (Trade Catalogue — Roll & Carton Specs)
│   │   └── /en/b2b/products/[slug] (PDP with Trade Specs, TDS Downloads & RFQ)
│   └── /en/b2b/become-a-dealer (Dealer & Distributor Onboarding Application)
│
└── Shared Institutional (100% Static SSG)
    ├── /en/about (Company Story, Brand Distributorships & 12-item FAQ)
    ├── /en/contact (Showroom Address, Maps Embed, WhatsApp & Phone NAP)
    ├── /en/privacy (Qatar PDPPL Privacy Policy)
    └── /en/terms (Trade & Retail Terms of Service)
```

### 3.2 Audience Switcher UX Wireframe

The audience switch control in `src/components/layout/AudienceSwitch.tsx` must clearly indicate context and preserve user location during transitions:

```
[ Light Mode / Dark Mode Glass Bar ]
┌────────────────────────────────────────────────────────┐
│  [ABK Logo]   Home  Products  Blog  About  Contact     │
│                                                        │
│  ┌──────────────────────┐  ┌───────┐  ┌─────────────┐  │
│  │ ● Retail │ Wholesale │  │ EN/AR │  │ [Tray] (2)  │  │
│  └──────────────────────┘  └───────┘  └─────────────┘  │
└────────────────────────────────────────────────────────┘
```

**Switching Logic Enhancements:**
1. Deep-linking state retention: Switching from `/b2c/products/vtek-ppf-weather-armor-ultimate` seamlessly routes to `/b2b/products/vtek-ppf-weather-armor-ultimate`.
2. Instant Visual Cue: B2B pages display a subtle gold top-border accent or "Trade Portal" badge, preventing commercial buyers from mistakenly thinking they are in the retail store.

---

## 4. Conversion Mechanisms: Qatar & GCC WhatsApp Funnels

In the GCC market, WhatsApp is the definitive closing channel. Credit card checkout is rarely preferred for wholesale trade supply, where volume orders, payment terms, and custom delivery logistics require conversational interaction.

### 4.1 B2C Retail Conversion Funnel

```
[B2C Catalogue / PDP]
        │
        ├── 1. Instant Single-Item Order
        │       └── Click "Order on WhatsApp" (طلب عبر واتساب)
        │             └── Pre-filled message with product name, price (QAR), and PDP URL
        │
        └── 2. Multi-Item Order Tray
                └── Click "Add to Order Tray" (إضافة إلى السلة)
                      └── Open Order Tray Drawer
                            └── Pre-filled multi-item manifest with quantity totals
                                  └── WhatsApp Dispatch to Sales Desk (+974 3083 8355)
```

**Optimized B2C WhatsApp Dispatch Template:**
```text
مرحباً ABK للتجارة، أرغب في طلب المنتجات التالية:
- ABK Rejuvenate Plastic Restorer (الكمية: 2) — 100 ر.ق
- Briller Glass Cleaner (الكمية: 1) — 45 ر.ق
الإجمالي التقريبي: 145 ر.ق
رابط الطلب: https://abktradingservice.com/en/b2c/products/abk-rejuvenate-plastic-restorer
يرجى تأكيد التوصيل داخل الدوحة.
```

---

### 4.2 B2B Wholesale RFQ Funnel

```
[B2B Wholesale PDP / Dealer Page]
        │
        ├── 1. Direct Roll / Carton Quote
        │       └── Click "Request Wholesale Quote" (طلب تسعير جملة)
        │             └── Pre-filled trade inquiry: Studio Name, Roll Count, Delivery Zone
        │
        ├── 2. Commercial Inquiry Sheet (Tray)
        │       └── Add multiple rolls/cases to Commercial Tray
        │             └── Add Commercial Reg (CR) / Detailing Studio Name
        │                   └── Direct WhatsApp Dispatch to Wholesale Desk
        │
        └── 3. Authorized Dealer Onboarding
                └── Complete Dealer Form (Tiers, Volume, Priority Brands)
                      └── Instant WhatsApp Business Submission + CRM Telemetry
```

**Optimized B2B WhatsApp Dispatch Template:**
```text
طلب تسعير جملة / توريد تجاري — ABK Trading
اسم المركز / المغسلة: مركز الميزان للتلميع (Al Mizan Detailing)
المنطقة: المنطقة الصناعية، الدوحة، قطر
المنتجات المطلوبة:
- VTEK PPF Weather Armor ULTIMATE (رول 1.52m × 15m) — الكمية: 3 رولات
- Autotriz Rich Foam Shampoo 20L Trade Pack — الكمية: 5 درام
ملاحظات: يرجى تزويدنا بأسعار الجملة وجدول التوصيل المتاح.
```

---

## 5. Analytics & Conversion Event Tracking Specification

### 5.1 Telemetry Bug Fixes (Production-Ready)

#### Fix A: `src/components/product/ProductPurchasePanel.tsx`
Add Plausible tracking classes and GA4 dataLayer triggers to the primary WhatsApp CTA button:

```diff
@@ -244,7 +244,9 @@
         {/* Primary WhatsApp Order / Quote CTA */}
         <a
           href={whatsappUrl}
           target="_blank"
           rel="noopener noreferrer"
+          className={`plausible-event-name=whatsapp_click plausible-event-audience=${audience} plausible-event-product=${encodeURIComponent(product.slug)} flex w-full items-center justify-center gap-2 rounded-full bg-(--color-brand) px-6 py-3.5 text-body font-bold text-black shadow-md transition-all hover:bg-(--color-brand-hover) active:scale-[0.99]`}
         >
```

#### Fix B: `src/components/cart/OrderTray.tsx`
Add Plausible classes and audience attributes to the Tray WhatsApp dispatch button:

```diff
@@ -299,7 +299,9 @@
                 <a
                   href={whatsappUrl}
                   target="_blank"
                   rel="noopener noreferrer"
+                  className={`plausible-event-name=order_tray_whatsapp_dispatch plausible-event-audience=${audience} flex w-full items-center justify-center gap-2 rounded-full bg-(--color-brand) px-6 py-3.5 text-body font-bold text-black shadow-md transition-colors hover:bg-(--color-brand-hover) active:scale-[0.99]`}
                 >
```

#### Fix C: `src/components/dealer/DealerApplicationForm.tsx`
Instrument form submission to notify Google Ads and GA4 before opening WhatsApp:

```diff
@@ -70,6 +70,16 @@
     });

+    // Track B2B Lead Conversion
+    if (typeof window !== "undefined") {
+      const w = window as unknown as { gtag?: (...args: unknown[]) => void; plausible?: (e: string, o?: unknown) => void };
+      w.gtag?.("event", "dealer_application_submit", {
+        company_name: companyName,
+        business_type: businessType,
+        location: location,
+      });
+      w.plausible?.("dealer_application_submit", { props: { businessType, location } });
+    }
+
     window.open(url, "_blank");
   };
```

---

### 5.2 Unified GA4 & Google Ads Event Dictionary

| Trigger Location | Event Name (`dataLayer`) | Google Ads Action | Parameters Sent |
|---|---|---|---|
| Product PDP WhatsApp CTA | `whatsapp_enquiry` | `AW-18200382552/{LABEL}` | `audience`, `product`, `page_path`, `locale` |
| Order Tray Dispatch | `order_tray_dispatch` | `AW-18200382552/{LABEL}` | `audience`, `item_count`, `locale` |
| Dealer Application Submit | `dealer_application_submit`| `AW-18200382552/{LABEL}` | `business_type`, `volume`, `location` |
| Floating WhatsApp Click | `whatsapp_floating_click` | `AW-18200382552/{LABEL}` | `placement: "floating"`, `audience`, `locale` |
| Telephone Number Tap | `phone_enquiry` | `AW-18200382552/{LABEL}` | `phone_number`, `page_path`, `locale` |
| Email Link Tap | `email_enquiry` | Secondary Conversion | `link_url`, `page_path` |
| TDS / Spec Sheet Download | `catalogue_download` | Secondary Conversion | `file_name`, `product_slug` |

This specification restores complete, end-to-end attribution across Google Ads Smart Bidding, GA4 exploratory funnels, and Plausible privacy-first dashboards.
