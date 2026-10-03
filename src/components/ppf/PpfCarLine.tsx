/**
 * Side-on line drawing of a sedan, nose to the right, with the front end
 * shown as the protected zone (hatched gold, dimension line below). Purely
 * decorative — a labelled instance is announced as an image, otherwise it is
 * hidden from assistive tech. No text inside the SVG, so the RTL mirror is safe.
 */
const BODY =
  "M26 112 L22 94 Q22 82 36 79 L96 72 Q128 66 150 46 Q160 38 182 37 L268 37 Q290 37 304 52 L328 72 L418 80 Q452 84 458 98 L460 112 L430 116 L404 116 A34 34 0 0 0 336 116 L144 116 A34 34 0 0 0 76 116 Z";
const NOSE = "M328 72 L418 80 Q452 84 458 98 L460 112 L430 116 L404 116";
const ZONE_X = 322;

const TICKS = Array.from({ length: 45 }, (_, i) => 24 + i * 10);

export function PpfCarLine({
  label,
  id = "ppf-car",
  className = "",
  ruler = true,
}: {
  label?: string;
  /** Unique per page: clip and pattern ids are document-global. */
  id?: string;
  className?: string;
  ruler?: boolean;
}) {
  const white = "rgb(255 255 255)";
  return (
    <svg
      viewBox={`0 0 480 ${ruler ? 182 : 150}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`h-auto w-full select-none rtl:-scale-x-100 ${className}`}
      fill="none"
    >
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={BODY} />
        </clipPath>
        <pattern
          id={`${id}-hatch`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-brand)" strokeWidth="1.5" strokeOpacity="0.6" />
        </pattern>
      </defs>

      <line x1="6" y1="143" x2="474" y2="143" stroke={white} strokeOpacity="0.16" />

      <path d={BODY} fill={white} fillOpacity="0.035" stroke={white} strokeOpacity="0.6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Glasshouse, door shut-lines, beltline */}
      <path d="M156 70 Q166 46 184 45 L224 45 L224 70 Z M232 45 L268 45 Q282 46 292 58 L310 70 L232 70 Z" stroke={white} strokeOpacity="0.38" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M228 70 L228 112 M150 112 L150 74 M96 72 L330 72" stroke={white} strokeOpacity="0.25" strokeWidth="1.1" />

      {/* Protected zone */}
      <g clipPath={`url(#${id}-body)`}>
        <g className="ppf-promo-reveal">
          <rect x={ZONE_X} y="30" width="160" height="120" fill="var(--color-brand)" fillOpacity="0.14" />
          <rect x={ZONE_X} y="30" width="160" height="120" fill={`url(#${id}-hatch)`} />
        </g>
      </g>
      <line x1={ZONE_X} y1="34" x2={ZONE_X} y2="150" stroke="var(--color-brand)" strokeWidth="1.2" strokeDasharray="3 4" strokeOpacity="0.9" />
      <path d={NOSE} stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Headlight */}
      <path d="M436 88 L452 92" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" />

      {/* Wheels */}
      {[110, 370].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="116" r="27" fill="var(--color-tile-dark)" stroke={white} strokeOpacity="0.7" strokeWidth="1.5" />
          <circle cx={cx} cy="116" r="15" stroke={white} strokeOpacity="0.4" strokeWidth="1.2" />
          <circle cx={cx} cy="116" r="3" fill={white} fillOpacity="0.5" />
        </g>
      ))}

      {ruler ? (
        <g>
          {/* Dimension line across the protected zone */}
          <path
            d={`M${ZONE_X} 156 L460 156 M${ZONE_X} 150 L${ZONE_X} 162 M460 150 L460 162`}
            stroke="var(--color-brand)"
            strokeWidth="1.2"
          />
          {/* Measurement ticks */}
          {TICKS.map((x, i) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1="176"
              y2={i % 5 === 0 ? "168" : "172"}
              stroke={white}
              strokeOpacity={i % 5 === 0 ? 0.4 : 0.22}
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
}
