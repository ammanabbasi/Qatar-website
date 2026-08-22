"use client";

// global-error.tsx is the LAST-RESORT error boundary — it replaces the root
// html/body when the root layout itself throws. It cannot depend on i18n,
// fonts, message loading, or the stylesheet (any of those may be the source
// of the error), so the design system is reproduced here with inline styles.
// Copy is intentionally inlined EN only; RTL would require inspecting the URL.
const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "Helvetica Neue", Arial, sans-serif';

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
          backgroundColor: "#f5f5f7",
          color: "#1d1d1f",
          fontFamily: FONT_STACK,
        }}
      >
        <div style={{ maxWidth: 520, padding: "48px 24px", textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.3333,
              color: "#6e6e73",
              margin: "0 0 16px",
            }}
          >
            Error
          </p>
          <h1
            style={{
              fontSize: 36,
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.022em",
              margin: "0 0 16px",
            }}
          >
            The site is having trouble loading
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.4706,
              letterSpacing: "-0.013em",
              color: "#6e6e73",
              margin: "0 0 32px",
            }}
          >
            Please refresh, or reach us directly on WhatsApp &mdash; we&apos;re
            happy to help with any product inquiry.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 44,
                padding: "0 22px",
                borderRadius: 980,
                backgroundColor: "#0071e3",
                color: "#ffffff",
                border: "none",
                fontFamily: FONT_STACK,
                fontSize: 17,
                letterSpacing: "-0.013em",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="https://wa.me/97430838355"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 44,
                padding: "0 22px",
                borderRadius: 980,
                backgroundColor: "#ffffff",
                color: "#1d1d1f",
                border: "1px solid #d2d2d7",
                fontFamily: FONT_STACK,
                fontSize: 17,
                letterSpacing: "-0.013em",
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
