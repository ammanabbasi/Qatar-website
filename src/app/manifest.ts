import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

// Typed PWA manifest. `icons` references Next.js file-convention routes
// (icon.png, apple-icon.png) — the framework resolves the fingerprinted URLs
// at build time. Start URL is `/en` — the canonical home (B2C) renders at the
// locale root; the old `/en/b2c` route was removed and only 308-redirects.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.tagline,
    start_url: "/en",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f5f7",
    theme_color: "#f5f5f7",
    icons: [
      {
        src: "/icon.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
