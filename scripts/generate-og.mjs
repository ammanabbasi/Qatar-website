/**
 * Per-product social cards (og:image / twitter:image), 1200x630 JPEG.
 *
 *   npm run og:products        (Node 22.18+ / 24+ — imports products.ts via
 *                               the built-in, unflagged TypeScript type stripping)
 *
 * One card per product, named by slug: public/og/products/<slug>.jpg. Product
 * detail pages reference them via `pageMeta(..., { image })` in
 * src/lib/seo.ts, so re-run this after adding a product or swapping its first
 * photo. The site-wide brand cards (public/og/abk-og-{en,ar}.jpg) are
 * screenshots of scripts/og/brand-card.html and are NOT produced here.
 *
 * Composition: the product's first photo, letterboxed to full height on a
 * blurred, darkened copy of itself (edges feathered so the square photo melts
 * into the backdrop), plus the ABK mark bottom-start. Landscape + <300 KB is
 * what WhatsApp needs to show the large preview instead of a thumbnail.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "og", "products");
const W = 1200;
const H = 630;
const PAD = 40;
const FEATHER = 72;

const roundedMask = (size, radius) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );

// Alpha mask: opaque centre, fading out over the left/right feather band
// (never more than a third of the width, so the stops can't cross on a
// narrow subject).
const featherMask = (w, h) => {
  const f = Math.min(FEATHER, Math.floor(w / 3));
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="${f / w}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="${1 - f / w}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
    </svg>`,
  );
};

async function renderCard(photo, out, mark) {
  const backdrop = await sharp(photo)
    .resize(W, H, { fit: "cover" })
    .blur(42)
    .modulate({ brightness: 0.55, saturation: 0.85 })
    .toBuffer();

  // Bound BOTH axes — sharp refuses to composite a layer larger than the
  // base, so a wide banner-style photo has to shrink to the width as well.
  const subject = sharp(photo).resize({
    width: W - PAD * 2,
    height: H - PAD * 2,
    fit: "inside",
    withoutEnlargement: false,
  });
  const { width: sw, height: sh } = await subject.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const feathered = await subject
    .ensureAlpha()
    .composite([{ input: featherMask(sw, sh), blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(backdrop)
    .composite([
      { input: feathered, left: Math.round((W - sw) / 2), top: Math.round((H - sh) / 2) },
      { input: mark, left: PAD + 8, top: H - PAD - 8 - 56 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
}

async function main() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 18)) {
    throw new Error(`Node 22.18+ required to import products.ts directly — running ${process.versions.node}`);
  }
  const { PRODUCTS } = await import("../src/data/products.ts");
  await mkdir(OUT_DIR, { recursive: true });
  const mark = await sharp(path.join(ROOT, "public", "logo-mark.webp"))
    .resize(56, 56)
    .ensureAlpha()
    .composite([{ input: roundedMask(56, 14), blend: "dest-in" }])
    .png()
    .toBuffer();

  let largest = 0;
  for (const product of PRODUCTS) {
    const photo = path.join(ROOT, "public", product.images[0]);
    const out = path.join(OUT_DIR, `${product.slug}.jpg`);
    await renderCard(photo, out, mark);
    const { size } = await stat(out);
    largest = Math.max(largest, size);
    if (size > 300 * 1024) {
      throw new Error(`${product.slug}.jpg is ${Math.round(size / 1024)} KB — WhatsApp drops previews over 300 KB`);
    }
  }
  console.log(`${PRODUCTS.length} product cards written to public/og/products (largest ${Math.round(largest / 1024)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
