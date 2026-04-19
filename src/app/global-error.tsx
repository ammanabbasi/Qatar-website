"use client";

// global-error.tsx is the LAST-RESORT error boundary — it replaces the root
// html/body when the root layout itself throws. It cannot depend on i18n,
// fonts, or message loading (those may be the source of the error). Copy is
// intentionally inlined EN only; RTL would require inspecting the URL.
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0908",
          color: "#e9e4d7",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: 520, padding: "48px 24px", textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#c8a24a",
              marginBottom: 24,
            }}
          >
            — Error
          </p>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              marginBottom: 16,
            }}
          >
            The site is having trouble loading
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(233, 228, 215, 0.7)",
              marginBottom: 32,
            }}
          >
            Please refresh, or reach us directly on WhatsApp — we&apos;re happy to
            help with any product inquiry.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                padding: "12px 28px",
                borderRadius: 9999,
                backgroundColor: "#c8a24a",
                color: "#0b0908",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="https://wa.me/97430838355"
              style={{
                padding: "12px 28px",
                borderRadius: 9999,
                backgroundColor: "transparent",
                color: "#e9e4d7",
                border: "1px solid rgba(233, 228, 215, 0.2)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
