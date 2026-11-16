# Conversion tracking setup

**Do this before enabling any campaign.** The campaigns launch on Manual CPC,
but you cannot judge a campaign — or ever switch to the target *Maximize
conversions* strategy — without conversion data. No tracking means flying blind.

## What was wrong

The site already loaded the Google Ads tag `AW-18200382552`
(`src/app/[locale]/layout.tsx`), but it only ever called `gtag('config', …)`.
There were **no conversion events at all**. Every WhatsApp click, phone tap and
catalogue download was invisible to Google Ads.

## What was added

| File | Purpose |
|---|---|
| `src/instrumentation-client.ts` | One capture-phase click listener on `document`. Queues unified Google Tag `config` calls synchronously (GA4 primary `G-TYPKQ6L3SB`, GA4 legacy `G-V73K5YVK5T`, Google Ads `AW-18200382552`), defers `gtag.js` network download until after `window.load` + `requestIdleCallback` (or first user interaction / `gtm_debug` Tag Assistant session) to protect mobile LCP/TBT, emits `ai_referral_visit` once per AI-referred session, and instruments every CTA on the site. |
| `src/lib/ads-conversions.ts` | GA4 measurement IDs, Google Ads conversion ID, labels, event names and hostname gate. |
| `src/lib/attribution.ts` | Tab-scoped `sessionStorage` landing attribution (`abk_session_attr_v1`) classifying 12 AI platforms (`chatgpt`, `perplexity`, `gemini`, `claude`, `copilot`, `grok`, `meta_ai`, `deepseek`, `mistral`, `you`, `phind`, `kagi`), 8 organic search engines, paid click IDs (`gclid`, `gbraid`, `wbraid`, `msclkid`), social, referral, and direct traffic across SPA navigations. |

**Why a delegated listener and not `onClick` handlers:** every CTA in this repo
is a Server Component — `WhatsAppButton`, `FloatingWhatsApp`, `ButtonLink`,
`Footer`, `Shell`. Adding `onClick` would mean converting each to a Client
Component and shipping its JS to the browser, purely for an analytics ping.
Next 16's `instrumentation-client.ts` runs before frontend code and needed
**zero changes to any existing component**.

The listener is `passive: true` — it can never call `preventDefault`, so it
cannot break a WhatsApp link even if it throws.

## Preview and localhost are gated off

The Ads tag was the only tracker on the site with **no environment gate** —
Plausible has one, with a comment explaining it exists "so localhost traffic
doesn't pollute production stats". That meant every Vercel preview deployment
and every local dev session reported into the live Ads account. Conversion data
drives Smart Bidding, so polluting it degrades the campaigns directly.

**The tag now loads from `src/instrumentation-client.ts`, not from the layout**,
gated on `isProductionHost(window.location.hostname)`. Nothing Google-related is
requested at all unless the page is being served from `abktradingservice.com`.

An earlier version gated the layout's `<Script>` tags on
`NEXT_PUBLIC_VERCEL_ENV`. That was replaced because it could not be *proven* to
work: the variable only exists when Vercel's "Enable access to System
Environment Variables" setting is on, and from outside a preview deployment
there was no way to tell whether the gate had fired or the `NODE_ENV` fallback
had. `window.location.hostname` is always present, always correct, needs no
Vercel setting, and can be tested locally — which it now is, in both directions:

| Build | Result |
|---|---|
| Production build served on `localhost` | No `gtag-js` script in the DOM, `window.gtag` undefined, `dataLayer` empty, **zero requests to googletagmanager** |
| Same build with `NEXT_PUBLIC_ADS_FORCE_TRACKING=1` | Tag loads, `config` fires first, then the conversion event with its full parameters |

Loading the tag here also removes a subtle bug. The layout loaded gtag.js with
`strategy="afterInteractive"`, and the floating WhatsApp button is
server-rendered — so it was clickable before gtag existed. gtag.js processes
`dataLayer` strictly in order and discards an event that arrives ahead of its
target's `config`, so an early click was silently lost. `js` and `config` are now
queued synchronously before the click listener is even attached, which makes the
ordering structural rather than something to defend against.

To exercise tracking locally, build with `NEXT_PUBLIC_ADS_FORCE_TRACKING=1`.

## Events emitted

| Interaction | Event name | Conversion key | Google Ads Label |
|---|---|---|---|
| `wa.me` link click (general WhatsApp CTA) | `whatsapp_enquiry` | `whatsapp` | `fTHvCNXXr5MdENiYz-ZD` |
| `wa.me` cart / quote-tray send (`data-placement="cart"` / `"quote-tray"`) | `cart_whatsapp_order` | `cart_order` | `K8OHCP_5-p8dENiYz-ZD` |
| Wholesale Dealer Application submit (`/[locale]/b2b/become-a-dealer`) | `dealer_enquiry` | `dealer_enquiry` | `uuVJCKWd9J8dENiYz-ZD` |
| Installed-PPF booking saved / WhatsApp hand-off (`/[locale]/b2c/ppf-installation`) | `ppf_booking_request` | `ppf_booking` | `J9TLCOe7n44dENiYz-ZD` |
| `tel:` link click | `phone_enquiry` | `phone` | `0rdHCL7KqJMdENiYz-ZD` |
| `mailto:` link click | `email_enquiry` | `email` | *(dataLayer only)* |
| `/catalogues/*.pdf` click | `catalogue_download` | `catalogue` | *(dormant)* |
| Landing from ChatGPT, Perplexity, Gemini, Claude, Copilot, etc. (once/session) | `ai_referral_visit` | — | *(GA4 & Plausible)* |

> **The catalogue conversion is dormant as of 2026-09-01, and legacy PDFs are redirected as of 2026-11-16:** commit `1599418`
> removed catalogue download links from product pages, and the two unlinked legacy PDFs (`/catalogues/vertek-ppf-catalogue.pdf`
> and `/catalogues/autotriz-catalogue.pdf`, which carried the former Ariane City address) were deleted and permanently `308`-redirected
> to `/en/b2c/brands/vtek` and `/en/b2c/brands/autotriz`. The click listener stays in place if an updated PDF is ever published.

Each conversion event carries `page_path`, `link_url`, `locale` (`en`/`ar`), `traffic_channel` (`ai_referral` / `organic_search` / `paid_search` / `social` / `referral` / `direct`), plus `ai_platform` or `search_engine` when classified, and where the
markup provides them, `audience` (`b2c`/`b2b`), `product`, and
`placement: "floating"` for the floating bubble. Those dimensions are read from
the **existing Plausible class-name tags** and `src/lib/attribution.ts`.

### GA4 Custom Dimensions to Register (`Admin → Data display → Custom definitions`)

Register these four event-scoped custom dimensions in GA4 property `abk (554936266)` so AI referrals and organic search conversions break down cleanly in Explorations:

| Dimension name | Scope | Event parameter |
|---|---|---|
| Traffic Channel | Event | `traffic_channel` |
| AI Platform | Event | `ai_platform` |
| Search Engine | Event | `search_engine` |
| Landing Page | Event | `landing_page` |

### Cart orders & Wholesale Dealer Applications (updated 2026-10-17)

Retail shoppers build a cart and send the whole order from `/[locale]/b2c/cart`;
wholesale buyers send their quote tray from the drawer. Both send buttons carry
`data-placement="cart"` or `data-placement="quote-tray"`, which routes the click
to the dedicated `cart_order` conversion key (`cart_whatsapp_order`, Google Ads
action **ABK — WhatsApp Cart Order**, `AW-18200382552/K8OHCP_5-p8dENiYz-ZD`),
preventing double-counting with generic `whatsapp_enquiry` while passing dynamic
order value in QAR:

| Param | Cart page (`placement: "cart"`) | Quote tray (`placement: "quote-tray"`) |
|---|---|---|
| `value` + `currency` | priced subtotal in QAR (omitted when every line is price-on-request) | — |
| `item_count` | units in the cart | units in the tray |
| `order_ref` | `ABK-XXXX`, also sent as the Ads `transaction_id` so a double-tapped send counts once | — |

Wholesale dealer applications submitted on `/[locale]/b2b/become-a-dealer`
call `trackDealerEnquiry` in `src/lib/analytics.ts`, firing `dealer_enquiry` to
GA4, Plausible, and the dedicated primary Google Ads conversion action
**ABK — Wholesale Dealer Application** (`AW-18200382552/uuVJCKWd9J8dENiYz-ZD`).

Plausible sees cart/tray sends as the `cart_whatsapp_send` goal (split by the
`audience` prop). The cart page only renders the `wa.me` link once the
checkout is valid — until then Send is a plain button that shows the missing
field — so an incomplete form can never report a conversion.

GA4 (`abk`, Property ID `554936266`, Measurement ID `G-TYPKQ6L3SB`) is linked
directly to Google Ads (`502-538-6770`) with auto-tagging and personalised
advertising enabled, and receives the standard ecommerce events from
`src/lib/analytics.ts`:

| Event | Fires when |
|---|---|
| `add_to_cart` | Add to cart on a card, shelf tile, product page, sticky bar or add-on; Undo after a removal |
| `remove_from_cart` | a line is removed from the drawer or cart page |
| `view_cart` | the drawer opens, or the cart page loads |
| `begin_checkout` | first interaction with the cart page's checkout form |

### Verified working

Tested against a production build (`next build` + `next start`), clicking real
elements with navigation blocked, then reading `window.dataLayer`:

```
["event","whatsapp_enquiry",{"link_url":"https://wa.me/97430838355?text=…",
  "page_path":"/ar/b2c/products/vtek-ppf-weather-armor-ultimate",
  "audience":"b2c","locale":"ar"}]
["event","cart_whatsapp_order",{"link_url":"https://wa.me/97430838355?text=…",
  "page_path":"/en/b2c/cart","value":280,"currency":"QAR","item_count":1,"order_ref":"ABK-4821","placement":"cart"}]
["event","dealer_enquiry",{"company_name":"Doha Detailing Studio","business_type":"Detailing / PPF Studio","audience":"b2b","locale":"en","value":200,"currency":"QAR"}]
["event","phone_enquiry",{"link_url":"tel:+97430838355",…}]
```

## Status (2026-10-17 — All 5 Primary Conversion Loops Closed)

GA4 property `abk (554936266)` is linked to Google Ads account `502-538-6770`
(`Admin → Product links → Google Ads links`). All five primary website
conversion actions are active and hardcoded in `src/lib/ads-conversions.ts`:

| Conversion action | Category | Count | Label | Where it lives |
|---|---|---|---|---|
| **WhatsApp enquiry** (`whatsapp_enquiry`) | Contact (Primary) | One | `fTHvCNXXr5MdENiYz-ZD` | `src/lib/ads-conversions.ts` (`NEXT_PUBLIC_ADS_LABEL_WHATSAPP`) |
| **Phone click** (`phone_enquiry`) | Contact (Primary) | One | `0rdHCL7KqJMdENiYz-ZD` | `src/lib/ads-conversions.ts` (`NEXT_PUBLIC_ADS_LABEL_PHONE`) |
| **PPF booking request** (`ppf_booking_request`) | Submit lead form (Primary) | One | `J9TLCOe7n44dENiYz-ZD` | `src/lib/ads-conversions.ts` (`NEXT_PUBLIC_ADS_LABEL_PPF_BOOKING`) |
| **ABK — WhatsApp Cart Order** (`cart_whatsapp_order`, `ctId=7851654399`) | Submit lead form (Primary) | One | `K8OHCP_5-p8dENiYz-ZD` | `src/lib/ads-conversions.ts` (`NEXT_PUBLIC_ADS_LABEL_CART_ORDER`) |
| **ABK — Wholesale Dealer Application** (`dealer_enquiry`, `ctId=7851544229`) | Submit lead form (Primary) | One | `uuVJCKWd9J8dENiYz-ZD` | `src/lib/ads-conversions.ts` (`NEXT_PUBLIC_ADS_LABEL_DEALER_ENQUIRY`) |

Email and catalogue remain `dataLayer`-only (`""`).

**The PPF booking hand-off counts as the booking.** The "Send on WhatsApp"
button on the configurator's result screen (`data-placement="ppf_booking"`)
reports as `ppf_booking_request` with the quoted price as value and the booking
ref as `transaction_id` — not as a WhatsApp enquiry, so one booking is never
counted by two primary actions, and a booking that was saved and then sent is
deduplicated by the shared ref.

## Known gap: WhatsApp clicks are not sales

A `wa.me` click means the user opened WhatsApp — not that they messaged you, and
certainly not that they bought. Expect the reported conversion count to
overstate real enquiries. Two options once there is volume:

- Keep it as-is and treat it as a *relative* signal. Fine for bidding.
- Use a WhatsApp Business API provider that reports message-received webhooks
  back as offline conversions. More accurate, more setup.

Start with the first.

