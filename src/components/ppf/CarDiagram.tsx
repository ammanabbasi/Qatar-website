"use client";

import { useId } from "react";
import { PRESET_PARTS, type PartKey } from "@/data/ppfInstall";

/**
 * Top-down car, front at the top, drawn as a plan view.
 * Mirrored pairs (fenders, doors, quarters, rockers, mirrors, headlights) are
 * one PartKey each, matching how PPF is sold.
 *
 * Two uses:
 *  - CarDiagram: the interactive control in the quote sheet. Every panel is
 *    tappable; the accessible control is the part list beside it, so the SVG
 *    itself is aria-hidden and only adds touch / mouse shortcuts.
 *  - CarBlueprint: the decorative hero drawing — the front-end zone lit once.
 *
 * All styling (panel fills, hover / pressed / selected) lives in the
 * `.ppf-car` rules in globals.css; prefers-reduced-motion is already
 * neutralised there.
 */
type Shape = {
  part: PartKey;
  /** Visible outline(s); pairs are two sub-paths. */
  paths: string[];
  /** Extra transparent stroke (screen px) around the tap area. */
  pad: number;
  /** Explicit tap geometry when the outline is too thin to hit. */
  hit?: string[];
};

// Drawn big -> small: when tap areas overlap, the later (smaller) part wins,
// so thin parts (mirrors, headlights, rockers) sit last with generous areas.
// Doors, fenders and quarters pad out to a thumb-sized target; the slivers
// (rockers, mirrors) stay tight so they don't steal taps from the doors.
const SHAPES: Shape[] = [
  { part: "rear-bumper", pad: 8, paths: ["M58 422 Q120 432 182 422 L176 446 Q120 460 64 446 Z"] },
  { part: "front-bumper", pad: 8, paths: ["M62 22 Q120 6 178 22 L184 46 Q120 36 56 46 Z"] },
  { part: "boot", pad: 8, paths: ["M84 362 Q120 356 156 362 L156 410 Q120 416 84 410 Z"] },
  { part: "bonnet", pad: 8, paths: ["M72 50 Q120 42 168 50 L162 150 Q120 144 78 150 Z"] },
  { part: "roof", pad: 6, paths: ["M84 206 Q120 198 156 206 L154 318 Q120 324 86 318 Z"] },
  {
    part: "rear-doors",
    pad: 18,
    paths: ["M48 256 L76 254 L76 338 L50 340 Z", "M192 256 L164 254 L164 338 L190 340 Z"],
  },
  {
    part: "front-doors",
    pad: 18,
    paths: ["M50 160 L76 158 L76 250 L48 252 Z", "M190 160 L164 158 L164 250 L192 252 Z"],
  },
  {
    part: "rear-quarters",
    pad: 18,
    paths: ["M50 344 L78 342 L80 410 L58 418 Z", "M190 344 L162 342 L160 410 L182 418 Z"],
  },
  {
    part: "front-fenders",
    pad: 14,
    paths: ["M56 64 L74 52 L80 150 L50 156 Z", "M184 64 L166 52 L160 150 L190 156 Z"],
  },
  {
    part: "rockers",
    pad: 8,
    paths: ["M40 166 L46 164 L46 340 L40 338 Z", "M200 166 L194 164 L194 340 L200 338 Z"],
    // The sliver itself is ~4px wide; the tap area reaches out into the empty margin.
    hit: ["M10 166 L47 164 L47 340 L10 338 Z", "M230 166 L193 164 L193 340 L230 338 Z"],
  },
  {
    part: "headlights",
    pad: 18,
    paths: ["M60 48 L84 44 L82 58 L58 62 Z", "M180 48 L156 44 L158 58 L182 62 Z"],
  },
  {
    part: "mirrors",
    pad: 8,
    paths: [
      "M30 168 Q36 160 50 164 L50 180 Q36 182 30 176 Z",
      "M210 168 Q204 160 190 164 L190 180 Q204 182 210 176 Z",
    ],
    hit: ["M12 154 L52 154 L52 192 L12 192 Z", "M228 154 L188 154 L188 192 L228 192 Z"],
  },
];

const BODY =
  "M60 20 Q120 0 180 20 Q196 60 194 160 L196 340 Q196 420 180 446 Q120 466 60 446 Q44 420 44 340 L46 160 Q44 60 60 20 Z";
// Glass, drawn for shape only.
const GLASS = [
  "M80 156 Q120 148 160 156 L156 202 Q120 194 84 202 Z", // windscreen
  "M86 322 Q120 328 154 322 L156 358 Q120 352 84 358 Z", // rear window
];

type SvgProps = {
  selected: ReadonlySet<PartKey>;
  /** Front-end preset: shade the leading edge of the bonnet and fenders too. */
  frontEdge?: boolean;
  onTogglePart?: (part: PartKey) => void;
  /** "dark" suits the hero; "light" suits the quote sheet. */
  tone?: "light" | "dark";
  /** Hero mode: the selected panels fade in once on load. */
  reveal?: boolean;
  className?: string;
};

function CarSvg({ selected, frontEdge, onTogglePart, tone = "dark", reveal, className = "" }: SvgProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const interactive = Boolean(onTogglePart);
  return (
    <svg
      viewBox="0 0 240 470"
      aria-hidden
      focusable="false"
      className={`ppf-car select-none ${className}`}
      data-tone={tone}
      data-interactive={interactive ? "" : undefined}
      data-reveal={reveal ? "" : undefined}
    >
      <defs>
        <linearGradient id={`${uid}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Widened a touch so side panels are easier to tap; strokes stay 1px. */}
      <g transform="translate(-18 0) scale(1.15 1)">
        <path d={BODY} className="ppf-body" />
        {GLASS.map((d) => (
          <path key={d} d={d} className="ppf-glass" />
        ))}
        {SHAPES.map(({ part, paths, pad, hit }) => {
          const on = selected.has(part);
          return (
            <g key={part} className="ppf-part" data-on={on ? "" : undefined}>
              {paths.map((d) => (
                <path key={d} d={d} className="ppf-vis" />
              ))}
              {interactive
                ? (hit ?? paths).map((d) => (
                    <path
                      key={d}
                      d={d}
                      data-part={part}
                      className="ppf-hit"
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth={pad}
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      pointerEvents="all"
                      onClick={() => onTogglePart?.(part)}
                    />
                  ))
                : null}
            </g>
          );
        })}
        {frontEdge ? (
          // Leading ~40 cm of bonnet and fenders, fading out.
          <path d="M52 50 Q120 40 188 50 L186 92 Q120 86 54 92 Z" fill={`url(#${uid}-edge)`} pointerEvents="none" />
        ) : null}
      </g>
    </svg>
  );
}

type Props = {
  /** Parts drawn as protected. */
  selected: ReadonlySet<PartKey>;
  frontEdge?: boolean;
  onTogglePart: (part: PartKey) => void;
  label: string;
  className?: string;
};

/** The interactive diagram: always tappable. */
export function CarDiagram({ selected, frontEdge, onTogglePart, label, className }: Props) {
  return (
    <figure className="m-0 flex justify-center">
      <figcaption className="sr-only">{label}</figcaption>
      <CarSvg selected={selected} frontEdge={frontEdge} onTogglePart={onTogglePart} tone="light" className={className} />
    </figure>
  );
}

const FRONT_END: ReadonlySet<PartKey> = new Set(PRESET_PARTS["front-end"]);

/** Decorative hero drawing: no interaction, the front-end zone lit once. */
export function CarBlueprint({ className }: { className?: string }) {
  return <CarSvg selected={FRONT_END} frontEdge reveal className={className} />;
}
