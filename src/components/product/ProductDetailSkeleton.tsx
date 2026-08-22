import { Container } from "@/components/ui/Container";

// Server-rendered skeleton mirroring `ProductDetail` so above-the-fold
// content doesn't shift when the real page streams in.
export function ProductDetailSkeleton() {
  const bar = "animate-pulse rounded-md bg-(--color-fill)";
  return (
    <section className="py-8 sm:py-12" aria-busy="true" aria-live="polite">
      <Container>
        <div className="mb-8 flex items-center gap-2">
          <div className={`h-3 w-12 ${bar}`} />
          <div className={`h-3 w-16 ${bar}`} />
          <div className={`h-3 w-32 ${bar}`} />
        </div>

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
            <div>
              <div className={`h-3 w-28 ${bar}`} />
              <div className={`mt-3 h-9 w-4/5 ${bar}`} />
              <div className={`mt-2 h-9 w-3/5 ${bar}`} />
              <div className="mt-5 space-y-2">
                <div className={`h-4 w-full ${bar}`} />
                <div className={`h-4 w-full ${bar}`} />
                <div className={`h-4 w-5/6 ${bar}`} />
              </div>
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
  );
}
