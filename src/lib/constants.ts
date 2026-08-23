export const SITE = {
  name: "ABK Trading & Service",
  shortName: "ABK",
  domain: "abktradingservice.com",
  url:
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://abktradingservice.com")
      .trim()
      .replace(/\/$/, ""),
  tagline: "Your One-Stop Supplier for Premium Car Care & PPF Solutions",
  phone: "+974 30838355",
  phoneE164: "+97430838355",
  whatsapp: "97430838355",
  email: "sales@abktradingservice.com",
  address: {
    line1: "Shop 2 & 3, Building 1306",
    line2: "Street 70, Zone 56, Mesaimeer",
    city: "Doha",
    country: "Qatar",
    countryCode: "QA",
    full: "Shop 2 & 3, Building 1306, Street 70, Zone 56, Mesaimeer, Doha, Qatar",
  },
  // Google Business Profile: "ABK Trading and Service — Vertek & Autotriz"
  // (car accessories store, 4.9★). Pin + CID captured from Google Maps on
  // 2026-08-22. `mapsUrl` opens the listing itself (reviews, hours, Directions)
  // on web and in the Maps app; `geo` feeds the LocalBusiness JSON-LD and the
  // geo.* meta tags — keep both in sync with the GBP pin if the shop moves.
  gbpName: "ABK Trading and Service — Vertek & Autotriz",
  mapsUrl: "https://maps.google.com/?cid=9860894303806767987",
  geo: { latitude: 25.2040478, longitude: 51.5029268 },
  social: {
    facebook: "https://www.facebook.com/share/1L9drK6k4n/",
    instagram: "https://www.instagram.com/abk.trading",
    tiktok: "https://www.tiktok.com/@abk.trading",
  },
  hours: {
    weekdays: "Sat – Thu",
    weekdaysMorning: "10:00 – 13:00",
    weekdaysEvening: "16:00 – 22:00",
    friday: "Closed",
  },
} as const;
