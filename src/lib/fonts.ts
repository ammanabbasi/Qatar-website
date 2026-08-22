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
// as restrained as the LTR one.
export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
