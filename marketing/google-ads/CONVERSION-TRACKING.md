# Conversion tracking setup

**Do this before enabling any campaign.** Every campaign in `import/` uses
*Maximize conversions* bidding. Smart Bidding with zero conversion signal is
just expensive random bidding — the campaigns will burn budget and learn nothing.

## What was wrong

The site already loaded the Google Ads tag `AW-18200382552`
(`src/app/[locale]/layout.tsx`), but it only ever called `gtag('config', …)`.
There were **no conversion events at all**. Every WhatsApp click, phone tap and
catalogue download was invisible to Google Ads.

## What was added

| File | Purpose |
|---|---|
| `src/instrumentation-client.ts` | One capture-phase click listener on `document`. Instruments every CTA on the site. |
| `src/lib/ads-conversions.ts` | Conversion IDs, labels and event names. |

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

| Interaction | Event name | Conversion key |
|---|---|---|
| `wa.me` link click (any WhatsApp CTA) | `whatsapp_enquiry` | `whatsapp` |
| `tel:` link click | `phone_enquiry` | `phone` |
| `mailto:` link click | `email_enquiry` | `email` |
| `/catalogues/*.pdf` click | `catalogue_download` | `catalogue` |

Each event carries `page_path`, `link_url`, `locale` (`en`/`ar`), and where the
markup provides them, `audience` (`b2c`/`b2b`), `product`, and
`placement: "floating"` for the floating bubble. Those dimensions are read from
the **existing Plausible class-name tags**, so both analytics tools share one
source of truth.

### Verified working

Tested against a production build (`next build` + `next start`), clicking real
elements with navigation blocked, then reading `window.dataLayer`:

```
["event","whatsapp_enquiry",{"link_url":"https://wa.me/97430838355?text=…",
  "page_path":"/ar/b2c/products/vtek-ppf-weather-armor-ultimate",
  "audience":"b2c","locale":"ar"}]
["event","catalogue_download",{"link_url":"/catalogues/vertek-ppf-catalogue.pdf",…}]
["event","phone_enquiry",{"link_url":"tel:+97430838355",…}]
["event","email_enquiry",{"link_url":"mailto:sales@abktradingservice.com",…}]
```

## What you must do in Google Ads

The code is live but reports **no conversions yet**, because a conversion needs
a *label* that only Google can issue. This is deliberate: the site ships and
keeps measuring regardless, and the Ads conversion switches on the moment you
paste the labels.

### 1. Create four conversion actions

Google Ads → **Goals → Conversions → New conversion action → Website**.
When it asks for the tracking method choose **"Use Google tag"** (already
installed), then set each up manually:

| Name | Category | Value | Count | Primary? |
|---|---|---|---|---|
| WhatsApp enquiry | Contact | assign a value, e.g. 40 QAR | One | **Primary** |
| Phone click | Contact | 40 QAR | One | **Primary** |
| Email click | Contact | 20 QAR | One | Secondary |
| Catalogue download | Other | 15 QAR | One | Secondary |

Set **Email** and **Catalogue** to *Secondary* so they are measured but do not
drive bidding — they are far weaker buying signals than a WhatsApp message.

The values are relative, not real revenue. They tell Smart Bidding that a
WhatsApp enquiry is worth roughly twice a catalogue download. Adjust once you
know your actual close rate.

### 2. Copy each conversion label

After creating an action, open it → **Tag setup → Use Google tag → See event
snippet**. You will see:

```js
gtag('event', 'conversion', {'send_to': 'AW-18200382552/AbC-D_efGhIjKlMnOpQ'});
```

The part after the slash (`AbC-D_efGhIjKlMnOpQ`) is the label.

### 3. Add the labels

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_ADS_LABEL_WHATSAPP` | label from *WhatsApp enquiry* |
| `NEXT_PUBLIC_ADS_LABEL_PHONE` | label from *Phone click* |
| `NEXT_PUBLIC_ADS_LABEL_EMAIL` | label from *Email click* |
| `NEXT_PUBLIC_ADS_LABEL_CATALOGUE` | label from *Catalogue download* |

`NEXT_PUBLIC_*` values are inlined at build time, so **redeploy** after adding
them. (Alternatively paste them straight into the fallback strings in
`src/lib/ads-conversions.ts` and push — same effect, one less place to look.)

### 4. Verify

Install the **Google Tag Assistant** Chrome extension, open
`abktradingservice.com`, click the WhatsApp button, and confirm a `conversion`
event fires with the right `send_to`. Conversions then appear in the Google Ads
UI within ~3 hours (sometimes up to 24).

## Known gap: WhatsApp clicks are not sales

A `wa.me` click means the user opened WhatsApp — not that they messaged you, and
certainly not that they bought. Expect the reported conversion count to
overstate real enquiries. Two options once there is volume:

- Keep it as-is and treat it as a *relative* signal. Fine for bidding.
- Use a WhatsApp Business API provider that reports message-received webhooks
  back as offline conversions. More accurate, more setup.

Start with the first.
