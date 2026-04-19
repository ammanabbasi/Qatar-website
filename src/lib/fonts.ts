import {
  Manrope,
  Bodoni_Moda,
  Noto_Kufi_Arabic,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

// Manrope — utility sans. Kept intentionally neutral so the display
// serif carries the brand personality.
export const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Bodoni Moda — razor-thin hairlines, neoclassical high-contrast serif.
// Reads like a watch catalog or a vintage car-magazine spread. Restricted
// to h1/h2 only so the tension with body sans stays sharp.
export const fontDisplay = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Arabic display — Noto Kufi for headings. Authoritative, Gulf-market
// contemporary feel. Never used for body (see fontArabic below).
export const fontArabicDisplay = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Arabic body — IBM Plex Sans Arabic. Naskh-based sans with strong
// readability at paragraph scale. Used for everything below h2.
export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
