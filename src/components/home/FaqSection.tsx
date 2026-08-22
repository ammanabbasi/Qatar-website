import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ } from "@/data/faq";

type Props = {
  locale: "en" | "ar";
  title: string;
  subtitle?: string;
};

/**
 * FAQ rendered as native <details>/<summary> — no JS, accessible by default,
 * matches the site's "no client-side library bloat" pattern. The Q/A text
 * here MUST match what's emitted in the FAQPage JSON-LD on the same page,
 * or Google flags it as cloaking. Styled as Apple's hairline accordion.
 */
export function FaqSection({ locale, title, subtitle }: Props) {
  return (
    <section className="py-10 lg:py-14">
      <Container>
        <SectionHeading title={title} />
        {subtitle && (
          <p className="mt-3 max-w-3xl text-body text-(--color-text-muted)">{subtitle}</p>
        )}
        <div className="mt-8 max-w-3xl divide-y divide-(--color-border) border-y border-(--color-border)">
          {FAQ.map((item, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-body font-semibold text-(--color-text) [&::-webkit-details-marker]:hidden">
                <span>{item.q[locale]}</span>
                <span
                  aria-hidden
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-(--color-text) transition-transform duration-300 ease-soft group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </summary>
              <p className="pb-6 pe-12 text-body text-(--color-text-muted)">{item.a[locale]}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
