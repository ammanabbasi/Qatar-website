import { Container } from "@/components/ui/Container";

// Server-rendered skeleton mirroring `ProductDetail` so above-the-fold
// content doesn't shift when the real page streams in: dark PageHero band
// (breadcrumb, eyebrow, title, subtitle) then the light gallery grid.
export function ProductDetailSkeleton() {
  const bar = "animate-pulse rounded-md bg-(--color-fill)";
  const darkBar = "animate-pulse rounded-md bg-white/10";
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="bg-(--color-hero-dark)">
        <Container className="pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-14 lg:pb-16">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-12 ${darkBar}`} />
            <div className={`h-3 w-16 ${darkBar}`} />
            <div className={`h-3 w-32 ${darkBar}`} />
          </div>
          <div className={`mt-6 h-3 w-40 ${darkBar}`} />
          <div className={`mt-4 h-9 w-4/5 max-w-xl ${darkBar}`} />
          <div className={`mt-4 h-4 w-3/5 max-w-md ${darkBar}`} />
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div className="flex flex-col gap-3">
              <div className="aspect-square animate-pulse rounded-tile bg-(--color-fill)" />
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 w-16 animate-pulse rounded-[12px] bg-(--color-fill)" />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <div className={`h-4 w-full ${bar}`} />
                <div className={`h-4 w-full ${bar}`} />
                <div className={`h-4 w-5/6 ${bar}`} />
              </div>
              <div className="tile space-y-3 p-6">
                <div className={`h-5 w-48 ${bar}`} />
                <div className={`h-4 w-full ${bar}`} />
                <div className="mt-2 h-12 w-full animate-pulse rounded-pill bg-(--color-fill)" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
