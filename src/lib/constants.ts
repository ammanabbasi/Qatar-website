export const SITE = {
  name: "ABK Trading & Service",
  shortName: "ABK",
  domain: "abktradingservice.com",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://abktradingservice.com",
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
  // Map search URL — opens Google Maps to the address query; user can pin location after launch.
  mapsQuery:
    "https://www.google.com/maps/search/?api=1&query=ABK+Trading+and+Service+Mesaimeer+Doha+Qatar",
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
