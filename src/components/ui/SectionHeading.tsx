type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  accent?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  accent = true,
}: Props) {
  const alignCls = align === "center" ? "text-center items-center" : "text-start";
  return (
    <div
      className={`flex flex-col gap-4 ${alignCls} max-w-3xl ${
        align === "center" ? "mx-auto" : ""
      }`}
    >
      {eyebrow && (
        <span className="eyebrow text-[0.68rem] uppercase tracking-[0.32em] text-(--color-gold)/90 font-medium">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.02] tracking-[-0.022em] font-medium">
        {accent ? (
          <>
            <span>{title}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-(--color-text-muted) leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
