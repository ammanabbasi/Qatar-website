import { ImageResponse } from "next/og";

// Satori-rendered 180x180 PNG. iOS/iPadOS Safari requests this exact size for
// the home-screen icon; SVG isn't reliably honoured, so we generate a PNG.
// The image is cached by Next.js based on file contents.

export const size = { width: 180, height: 180 };

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0b0908 0%, #161310 100%)",
          position: "relative",
        }}
      >
        {/* Brass sweep arc evoking polish & sheen */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{ position: "absolute", inset: 10 }}
        >
          <defs>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f4d06f" />
              <stop offset="100%" stopColor="#8a7226" />
            </linearGradient>
          </defs>
          <path
            d="M20 110 Q 80 50 140 90"
            fill="none"
            stroke="url(#sweep)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#f5f5f5",
            fontFamily: "serif",
            transform: "translateY(12px)",
          }}
        >
          ABK
        </div>
      </div>
    ),
    { ...size },
  );
}
