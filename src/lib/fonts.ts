import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";

// Inter — the closest open-licence match to SF Pro. One family for every
// size; hierarchy comes from weight, size and tracking, not a second face.
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Arabic — IBM Plex Sans Arabic for body AND headings so the RTL site stays
// as restrained as the LTR one. Not preloaded: this module is shared by both
// locales, so preloading put four Arabic files in the <head> of every English page.
export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});
