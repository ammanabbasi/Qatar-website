import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

// Typed PWA manifest. `icons` references Next.js file-convention routes
// (icon.svg, apple-icon) — the framework resolves the fingerprinted URLs at
// build time. Start URL is `/en/b2c` because that's the canonical home.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.tagline,
    start_url: "/en/b2c",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0908",
    theme_color: "#0b0908",
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
