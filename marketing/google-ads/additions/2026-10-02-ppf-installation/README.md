# PPF Installation campaigns — applied 2026-10-02

## What the live account actually contains

Account 502-538-6770 (USD) held **one** campaign before this change:
`Campaign #1` (Search, Maximize clicks, US$2/day, broad PPF and ceramic
keywords). The 12-campaign build in `../../import/` has **never been
imported**. If it ever is, import it fresh rather than as an update.

## What was applied

These five files are Google Ads **web bulk-upload** files, generated
from `build/campaigns/ppf-installation.json` (QAR converted to USD at 3.64).
They were uploaded through Tools → Bulk actions → Uploads, in number order.
Each one previewed with 0 errors and was then applied:

| File | Rows | Created |
|---|---|---|
| `1-campaigns.csv` | 2 | `ABK \| Search \| EN \| PPF Installation` (ID 24319728682, US$16.48/day) and `… AR …` (ID 24319728847, US$6.87/day). Both **Paused**, Manual CPC, Google Search only, Qatar, English + Arabic |
| `2-ad-groups.csv` | 5 | 3 EN + 2 AR ad groups with max CPCs |
| `3-keywords.csv` | 43 | Phrase-match installation keywords |
| `4-negative-keywords.csv` | 38 | Ad-group negatives (roll, wholesale, DIY, tint, Dubai …) |
| `5-responsive-search-ads.csv` | 5 | One RSA per ad group (15 headlines / 4 descriptions) → `/b2c/ppf-installation` |

Set by hand in the UI:

- **Location option:** Presence (people in or regularly in Qatar), on both campaigns.
- **Callouts at campaign level:** 6 on EN, 5 on AR (from `build/assets.json` → `scopedCallouts`).
- **Ad schedule:** none (all hours). The booking form captures leads 24/7.
- **Already correct by default:** automatically created assets off, broad match off, AI Max off, asset optimisation off.
- **Conversion action:** "PPF booking request" (Submit lead form, website, count one, value from the event). Label `J9TLCOe7n44dENiYz-ZD` is set in Vercel as `NEXT_PUBLIC_ADS_LABEL_PPF_BOOKING` and live since the 2026-10-02 redeploy. It's the account-default goal, so all three campaigns report against it.

## Not done (owner decisions)

- **Both campaigns stay Paused** (owner, 2026-10-02). The account also shows "Your ads aren't running — overdue balance", so nothing serves until billing is settled.
- **Campaign #1 launch-day negatives (prepared, NOT applied):** the day the installation campaigns are enabled, upload `6-campaign1-negatives-APPLY-ON-PPF-LAUNCH.csv` (Tools → Bulk actions → Uploads). It adds campaign negatives `installation`, `install`, `تركيب` (broad) and `"near me"` (phrase) to Campaign #1, so its broad PPF keywords stop competing for installation searches. Revert: remove those four from Campaign #1 → Keywords → Negative keywords.
- **Bookings Sheet:** the "ABK PPF Bookings" Sheet and its Apps Script project ("ABK PPF Bookings webhook") exist in the owner account. The script code was updated on 2026-10-06, but `setup()` has not been authorized and the web app has not been deployed. Until it is, bookings fall back to WhatsApp only, and the API logs every unsaved booking on one `UNSAVED PPF BOOKING` line (Vercel → Logs; Hobby keeps logs for **1 hour**). See `abk-private/ppf-bookings-apps-script.gs` for the remaining steps.

## Changes made 2026-10-06 (with old values, for revert)

| Change | Old value | New value | Revert |
|---|---|---|---|
| Campaign #1 campaign-level negatives | none | `"car painting"`, `"paint job"`, `"car painters"`, `"car wash"` (phrase), `[car]` (exact), `siota` (broad) | Campaign #1 → Keywords → Negative keywords → remove |
| Account call asset | `0316 4532980` (Disapproved: unverified phone number, added 31 May 2026) | `+974 3083 8355`, Qatar, account level, call reporting on (Pending review at time of change) | Assets → Call → remove new one, re-add old one with "Use existing" |

Checked, not changed: all five PPF RSAs show **Pending** review (campaigns paused; Google typically finishes review once a campaign can serve). Both PPF campaigns use the account-default goals **Submit lead forms** (PPF booking request) and **Contacts** (WhatsApp enquiry, Phone click). The Contacts goal shows "Needs attention" only because Phone click is **Inactive**: no phone tap has been recorded since the action was created. It clears on the first tracked `tel:` tap.

## Offline "paid installation" import: staff runbook

The "Ads import" tab in the bookings Sheet builds Google's click-conversion file from the Bookings tab: `Google Click ID`, `Conversion Name`, `Conversion Time` (`yyyy-MM-dd HH:mm:ss+0300`; Google accepts only four-digit offsets, never `+03:00`), `Conversion Value`, `Conversion Currency` (QAR). A booking appears there only when it has a gclid **and** a Paid amount **and** a Paid at date.

One-time (owner): in Google Ads, Goals → Conversions → **New conversion action → Import → Track conversions from clicks**, named exactly `PPF paid installation`. Set it as a **secondary** action for now so it reports without steering bids. Create it **before** PPF spend starts, and wait 4-6 hours before the first upload.

Weekly (staff):

1. **Mark the job paid.** In the Bookings tab, find the row by Booking ref, then fill **Paid amount (QAR)** (number only, e.g. `3999`) and **Paid at (Doha time)** (date and time of payment, e.g. `2026-10-14 16:30`). The Sheet rejects anything that isn't a number or a date. Set Status to `Paid`.
2. **Check the Ads import tab.** Every paid booking that came from a Google ad appears there automatically. Paid bookings without a gclid (organic, WhatsApp-only) correctly do not appear.
3. **Download.** With the Ads import tab open: File → Download → Comma-separated values (.csv), current sheet.
4. **Upload.** Google Ads → Goals → Conversions → Uploads → **+** → Source: Upload a file → choose the CSV → Preview → Apply. Upload conversions at least 24 hours after the click. Clicks older than 90 days are rejected.
5. **Check the result** an hour later in Uploads (status and any row errors), and note the date of the last upload in the Sheet so the next week only adds new rows. Re-uploading a row Google already has is reported as a duplicate, not double-counted.
