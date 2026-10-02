# Additions — PPF Installation campaigns (2026-10-02)

The account is already live, so this is an **additions-only** import: the two
new campaigns plus the few rows existing campaigns need. Never re-import the
full `import/` folder over the live account.

Source of truth: `build/campaigns/ppf-installation.json`. These files are the
row-level difference between the build before and after that theme was added.

| File | What it adds |
|---|---|
| `01-campaigns.csv` | `ABK \| Search \| EN \| PPF Installation` (QAR 60/day ≈ $16.48) and `… AR …` (QAR 25/day ≈ $6.87), both **Paused** |
| `02-ad-groups.csv` | 5 ad groups (3 EN, 2 AR) |
| `03-keywords.csv` | 43 installation-intent keywords |
| `04-negative-keywords.csv` | 38 ad-group negatives on the new campaigns + 122 campaign negatives on existing campaigns (the 8 terms below, moved off the shared list) |
| `05-responsive-search-ads.csv` | 5 RSAs, 15 headlines / 4 descriptions each |
| `07-callouts.csv` | Campaign-level callouts for the 2 new campaigns (they override the account-level wholesale callouts) |
| `remove-from-shared-negative-list.txt` | 8 terms to delete from the live shared list — **not** a CSV import |

## Order — this matters

1. **Shared list first.** Tools → Shared library → Negative keyword lists →
   open the account list → delete the 8 terms in
   `remove-from-shared-negative-list.txt` (`ppf installation`, `installation`,
   `near me`, `تركيب فيلم` …). They would block the new campaign's own keywords.
   Each is re-added as a campaign negative on every other campaign by `04`.
2. **Import** `01` → `02` → `03` → `04` → `05` → `07` in Google Ads Editor
   (Account → Import → From file), review, Post.
3. **Apply the shared list** to the two new campaigns (they are not attached
   automatically).
4. **Settings by hand** (not importable) for both new campaigns:
   - Locations: Qatar · Location option: **Presence** (people in or regularly in)
   - Ad schedule: Sat–Thu 09:30–13:30 and 15:30–22:30; Friday off
   - Automatically created assets: **Off**
5. **Conversion action:** Goals → Conversions → New → Website → manual event
   `ppf_booking_request`, category *Submit lead form*, value: use the event
   value, count **One**. Paste its label into Vercel as
   `NEXT_PUBLIC_ADS_LABEL_PPF_BOOKING` and redeploy. In both new campaigns,
   set this as the campaign's goal (campaign-specific goals) so Smart Bidding
   later optimises on bookings, not generic WhatsApp clicks.
6. **Enable** the EN campaign first. Add the AR one after a native Arabic
   read-through of `05-responsive-search-ads.csv`.

## Measuring paid installations (offline import)

Every booking row in the "ABK PPF Bookings" Google Sheet carries `gclid` /
`gbraid` / `wbraid`. When a job is paid, fill **Paid amount (QAR)** and
**Paid at**. Weekly, upload paid rows through **Google Ads Data Manager**
(Goals → Conversions → Uploads / Data Manager → Google Sheets source) to an
offline conversion action named `PPF installation paid` — columns: Google
Click ID, Conversion Name, Conversion Time, Conversion Value, Conversion
Currency (QAR). Since 15 June 2026 these uploads go through Data Manager; the
Google Ads API path is blocked. Judge the campaign on cost per **paid**
installation, not cost per booking request.

## Not included (deliberately)

- **Sitelinks:** the only change is the "Shop All Products" description, now
  "54 car care products in stock" (the live one says 43 — an understatement,
  not a false claim). Edit it in the UI if you like; importing would add a
  duplicate sitelink instead of editing it.
