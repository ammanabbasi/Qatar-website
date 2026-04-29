import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ } from "@/data/faq";

type Props = {
  locale: "en" | "ar";
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

/**
 * FAQ rendered as native <details>/<summary> — no JS, accessible by default,
 * matches the site's "no client-side library bloat" pattern. The Q/A text
 * here MUST match what's emitted in the FAQPage JSON-LD on the same page,
 * or Google flags it as cloaking.
 */
export function FaqSection({ locale, title, subtitle, eyebrow }: Props) {
  return (
    <section className="py-16 sm:py-24 border-t border-(--color-border)">
      <Container>
        <SectionHeading
          eyebrow={eyebrow ? `⸻ ${eyebrow}` : undefined}
          title={title}
          subtitle={subtitle}
        />
        <div className="mt-10 sm:mt-14 max-w-3xl flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 text-base sm:text-lg font-medium hover:bg-(--color-gold)/5 transition-colors">
                <span>{item.q[locale]}</span>
                <span
                  className="text-(--color-gold) transition-transform duration-300 group-open:rotate-45 text-2xl leading-none"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-(--color-text-muted) leading-relaxed">
                {item.a[locale]}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
