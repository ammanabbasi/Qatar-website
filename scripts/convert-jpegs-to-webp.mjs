// One-off: walk public/products/ and convert every .jpeg to .webp (quality 85),
// deleting the .jpeg on successful write. Idempotent — skips when a .webp already exists.
// The new products added from "Other product images/" arrived as .jpeg; project
// convention is .webp. This brings them in line.

import sharp from "sharp";
import { readdir, unlink, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { constants } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const targetDir = resolve(root, "public/products");

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.isFile() && /\.jpe?g$/i.test(e.name)) files.push(full);
  }
  return files;
}

const jpegs = await walk(targetDir);
let converted = 0;
let skipped = 0;

for (const jpg of jpegs) {
  const webp = jpg.replace(/\.jpe?g$/i, ".webp");
  if (await exists(webp)) {
    console.log(`skip (webp exists): ${jpg}`);
    skipped++;
    continue;
  }
  await sharp(jpg).webp({ quality: 85 }).toFile(webp);
  await unlink(jpg);
  console.log(`converted: ${jpg} -> ${webp}`);
  converted++;
}

console.log(`\ndone. converted=${converted} skipped=${skipped}`);
