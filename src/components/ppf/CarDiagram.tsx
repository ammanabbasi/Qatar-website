"use client";

import type { PartKey } from "@/data/ppfInstall";

type Props = {
  /** Parts drawn as protected. */
  selected: ReadonlySet<PartKey>;
  /** Front-end preset: shade the leading edge of the bonnet and fenders too. */
  frontEdge?: boolean;
  /** When set, panels are clickable (custom-parts mode). */
  onToggle?: (part: PartKey) => void;
  label: string;
  frontLabel: string;
  rearLabel: string;
};

/**
 * Top-down car, front at the top. Mirrored pairs (fenders, doors, quarters,
 * rockers, mirrors, headlights) are one PartKey each, matching how PPF is sold.
 *
 * The SVG is a visual mirror of the checkbox list beside it — that list is
 * the accessible control, so the drawing is aria-hidden and only adds mouse
 * and touch shortcuts. Fill changes ride the global transition rules, which
 * prefers-reduced-motion already neutralises in globals.css.
 */
const SHAPES: Array<{ part: PartKey; d: string }> = [
  // Front bumper
  { part: "front-bumper", d: "M62 22 Q120 6 178 22 L184 46 Q120 36 56 46 Z" },
  // Headlights
  { part: "headlights", d: "M60 48 L84 44 L82 58 L58 62 Z M180 48 L156 44 L158 58 L182 62 Z" },
  // Bonnet
  { part: "bonnet", d: "M72 50 Q120 42 168 50 L162 150 Q120 144 78 150 Z" },
  // Front fenders
  { part: "front-fenders", d: "M56 64 L74 52 L80 150 L50 156 Z M184 64 L166 52 L160 150 L190 156 Z" },
  // Mirrors
  { part: "mirrors", d: "M30 168 Q36 160 50 164 L50 180 Q36 182 30 176 Z M210 168 Q204 160 190 164 L190 180 Q204 182 210 176 Z" },
  // Front doors
  { part: "front-doors", d: "M50 160 L76 158 L76 250 L48 252 Z M190 160 L164 158 L164 250 L192 252 Z" },
  // Rear doors
  { part: "rear-doors", d: "M48 256 L76 254 L76 338 L50 340 Z M192 256 L164 254 L164 338 L190 340 Z" },
  // Rockers / side skirts
  { part: "rockers", d: "M40 166 L46 164 L46 340 L40 338 Z M200 166 L194 164 L194 340 L200 338 Z" },
  // Roof & pillars
  { part: "roof", d: "M84 206 Q120 198 156 206 L154 318 Q120 324 86 318 Z" },
  // Rear quarter panels
  { part: "rear-quarters", d: "M50 344 L78 342 L80 410 L58 418 Z M190 344 L162 342 L160 410 L182 418 Z" },
  // Boot / tailgate
  { part: "boot", d: "M84 362 Q120 356 156 362 L156 410 Q120 416 84 410 Z" },
  // Rear bumper
  { part: "rear-bumper", d: "M58 422 Q120 432 182 422 L176 446 Q120 460 64 446 Z" },
];

// Glass and non-filmed areas, drawn for shape only.
const GLASS = [
  "M80 156 Q120 148 160 156 L156 202 Q120 194 84 202 Z", // windscreen
  "M86 322 Q120 328 154 322 L156 358 Q120 352 84 358 Z", // rear window
];

export function CarDiagram({ selected, frontEdge, onToggle, label, frontLabel, rearLabel }: Props) {
  const interactive = Boolean(onToggle);
  return (
    <figure className="relative mx-auto w-full max-w-[260px]">
      <figcaption className="sr-only">{label}</figcaption>
      <p className="mb-2 text-center text-caption font-semibold uppercase tracking-[0.14em] text-(--color-text-subtle)">
        {frontLabel}
      </p>
      <svg viewBox="0 0 240 470" aria-hidden className="h-auto w-full select-none">
        <defs>
          <linearGradient id="ppf-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Body silhouette */}
        <path
          d="M60 20 Q120 0 180 20 Q196 60 194 160 L196 340 Q196 420 180 446 Q120 466 60 446 Q44 420 44 340 L46 160 Q44 60 60 20 Z"
          fill="var(--color-fill)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />
        {GLASS.map((d) => (
          <path key={d} d={d} fill="var(--color-tile-dark)" opacity="0.85" />
        ))}
        {SHAPES.map(({ part, d }) => {
          const on = selected.has(part);
          return (
            <path
              key={part}
              d={d}
              data-part={part}
              onClick={onToggle ? () => onToggle(part) : undefined}
              className={`transition-[fill,stroke] duration-300 ease-soft ${
                interactive ? "cursor-pointer hover:stroke-(--color-brand-deep)" : ""
              }`}
              fill={on ? "var(--color-brand)" : "var(--color-surface)"}
              fillOpacity={on ? 0.9 : 1}
              stroke={on ? "var(--color-brand-deep)" : "var(--color-border)"}
              strokeWidth="1.5"
            />
          );
        })}
        {frontEdge ? (
          // Leading ~40 cm of bonnet and fenders, fading out.
          <path
            d="M52 50 Q120 40 188 50 L186 92 Q120 86 54 92 Z"
            fill="url(#ppf-edge)"
            className="pointer-events-none"
          />
        ) : null}
      </svg>
      <p className="mt-2 text-center text-caption font-semibold uppercase tracking-[0.14em] text-(--color-text-subtle)">
        {rearLabel}
      </p>
    </figure>
  );
}
