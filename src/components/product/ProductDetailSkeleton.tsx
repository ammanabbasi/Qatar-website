import { Container } from "@/components/ui/Container";

// Low-JS, server-rendered skeleton that mirrors `ProductDetail` layout so
// above-the-fold content doesn't shift when the real page streams in. Pulse
// is driven by Tailwind's `animate-pulse` — no additional CSS.
export function ProductDetailSkeleton() {
  return (
    <section className="py-12 sm:py-16" aria-busy="true" aria-live="polite">
      <Container>
        {/* Breadcrumbs placeholder */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-16 rounded bg-(--color-surface) animate-pulse" />
          <div className="h-3 w-1 bg-(--color-border)" />
          <div className="h-3 w-20 rounded bg-(--color-surface) animate-pulse" />
          <div className="h-3 w-1 bg-(--color-border)" />
          <div className="h-3 w-32 rounded bg-(--color-surface) animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) overflow-hidden">
            <div className="aspect-[4/5] animate-pulse bg-(--color-surface-2)" />
            <div className="p-4 flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl animate-pulse bg-(--color-surface-2)"
                />
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-5">
            <div className="h-3 w-24 rounded bg-(--color-surface) animate-pulse" />
            <div className="space-y-3">
              <div className="h-10 w-4/5 rounded-lg bg-(--color-surface) animate-pulse" />
              <div className="h-10 w-2/3 rounded-lg bg-(--color-surface) animate-pulse" />
            </div>
            <div className="h-4 w-32 rounded bg-(--color-surface) animate-pulse" />
            <div className="space-y-2 mt-2">
              <div className="h-4 w-full rounded bg-(--color-surface) animate-pulse" />
              <div className="h-4 w-full rounded bg-(--color-surface) animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-(--color-surface) animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-(--color-surface) animate-pulse" />
            </div>

            <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 space-y-3">
              <div className="h-5 w-48 rounded bg-(--color-surface-2) animate-pulse" />
              <div className="h-4 w-full rounded bg-(--color-surface-2) animate-pulse" />
              <div className="h-11 w-full sm:w-60 rounded-full bg-(--color-gold-dim)/40 animate-pulse mt-2" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
