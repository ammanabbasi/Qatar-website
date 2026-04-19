// Minimal legal-section component. The editorial feel is retained by the gold
// eyebrow rule + serif heading, matching the rest of the site. Kept separate
// from the page components so Privacy and Terms share the same rhythm.
export function LegalSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden
          className="h-px w-8 bg-(--color-gold)/60"
        />
        <h2 className="font-display text-xl sm:text-2xl text-(--color-text) tracking-tight">
          {title}
        </h2>
      </div>
      <p className="text-base leading-relaxed">{body}</p>
    </section>
  );
}
