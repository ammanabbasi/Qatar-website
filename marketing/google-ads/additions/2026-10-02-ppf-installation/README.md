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
- **Campaign #1 is untouched.** When the installation campaigns are enabled, add campaign negatives to Campaign #1: `installation`, `install`, `near me`, `تركيب`. Otherwise its broad PPF keywords compete for installation searches.
- **Bookings Sheet:** the "ABK PPF Bookings" Sheet and its Apps Script exist (owner account), but the script was never authorized or deployed. Until it is, bookings fall back to WhatsApp only. See `abk-private/ppf-bookings-apps-script.gs` for the remaining two steps.
- **Offline "paid installation" import via Data Manager:** waits for the Sheet to receive bookings.
