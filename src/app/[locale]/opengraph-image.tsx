import { ImageResponse } from "next/og";

/**
 * Satori-rendered OpenGraph PNG (1200×630) auto-wired to `og:image` +
 * `twitter:image` by Next.js.
 *
 * Why English content on BOTH locales:
 *   Satori's OpenType rendering pipeline does not support the complex GSUB
 *   substitution lookups that Arabic scripts require (`lookupType: 5 /
 *   substFormat: 3` throws at pipe-time). Every modern Arabic font on Google
 *   Fonts — Noto Kufi, Cairo, Amiri, Readex Pro, Alexandria, Tajawal, Almarai —
 *   triggers the same error, so the limitation is Satori itself, not font
 *   choice. Rather than serve a broken/missing OG card to Arabic-locale
 *   visitors, we render the EN copy for both. The brand names (Vertek,
 *   Autotriz, Briller, Insta Finish) are Latin universally, and "ABK Trading &
 *   Service · Qatar" is legible to Arabic readers.
 *
 *   When Satori ships Arabic shaping support, restore per-locale copy + load
 *   `og-arabic-font.ttf` for `isAr` by reverting
 *   https://github.com/vercel/satori/issues/462
 *
 * Other design choices:
 * - Honeycomb hexagon accents mirror the product-brand motif used elsewhere.
 * - Brass + black palette matches site tokens (--color-bg, --color-gold).
 */

export const alt = "ABK Trading & Service — Premium Car Care & PPF · Qatar";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 96px",
          background:
            "linear-gradient(135deg, #0b0908 0%, #131110 50%, #0b0908 100%)",
          color: "#e9e4d7",
          position: "relative",
        }}
      >
        {/* Hex accents — top-right cluster */}
        <svg
          width="420"
          height="360"
          viewBox="0 0 420 360"
          style={{ position: "absolute", top: -40, right: -60, opacity: 0.22 }}
        >
          <g fill="none" stroke="#c8a24a" strokeWidth="1.2">
            <path d="M80 10 L160 56 L160 148 L80 194 L0 148 L0 56 Z" />
            <path d="M220 10 L300 56 L300 148 L220 194 L140 148 L140 56 Z" />
            <path d="M360 10 L440 56 L440 148 L360 194 L280 148 L280 56 Z" />
            <path d="M80 196 L160 242 L160 334 L80 380 L0 334 L0 242 Z" />
            <path d="M220 196 L300 242 L300 334 L220 380 L140 334 L140 242 Z" />
          </g>
        </svg>

        {/* Brass hairline */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 96,
            right: 96,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(200, 162, 74, 0.6), transparent)",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#c8a24a",
            marginBottom: 28,
          }}
        >
          — Qatar · Mesaimeer
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 20,
            color: "#ffffff",
          }}
        >
          ABK Trading &amp; Service
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: "-0.005em",
            color: "rgba(233, 228, 215, 0.88)",
            marginBottom: 56,
            maxWidth: 900,
          }}
        >
          Premium Car Care &amp; PPF Solutions · Qatar
        </div>

        {/* Brand list */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(200, 162, 74, 0.8)",
          }}
        >
          Vertek · Autotriz · Briller · Insta Finish
        </div>

        {/* Brass hairline bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 96,
            right: 96,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(200, 162, 74, 0.6), transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
