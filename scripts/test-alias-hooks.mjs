/**
 * Lets `node --test` load app modules directly: resolves the `@/…` path alias
 * to src/ and extensionless relative imports to their .ts/.tsx files, the way
 * Next.js and TypeScript do. Used by `npm run test:payments` (--import).
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function resolveFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (existsSync(candidate) && !candidate.endsWith(path.sep)) {
      try {
        if (path.extname(candidate)) return pathToFileURL(candidate).href;
      } catch {
        // fall through
      }
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const url = resolveFile(path.join(src, specifier.slice(2)));
      if (url) return nextResolve(url, context);
    }
    const parent = context.parentURL?.startsWith("file:") ? fileURLToPath(context.parentURL) : null;
    if (parent?.startsWith(src) && (specifier.startsWith("./") || specifier.startsWith("../")) && !path.extname(specifier)) {
      const url = resolveFile(path.resolve(path.dirname(parent), specifier));
      if (url) return nextResolve(url, context);
    }
    return nextResolve(specifier, context);
  },
});
