import type { ReactNode } from "react";
import { Container } from "./Container";

type Props = {
  /** Gold uppercase label above the title, e.g. "Get in Touch". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Breadcrumb nav rendered above the eyebrow (product / article pages). */
  breadcrumb?: ReactNode;
  /** Extra rows under the subtitle (meta lines, dates). */
  children?: ReactNode;
};

/**
 * Compact dark page opener. Every inner page starts with the same dark
 * band + gold eyebrow the homepage hero established, so navigating never
 * jumps between two visual languages. Pairs with the Shell's dark header
 * tone — the glass bar dissolves into this band exactly as it does into
 * the home hero.
 */
export function PageHero({ eyebrow, title, subtitle, breadcrumb, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-(--color-hero-dark) text-white">
      {/* Soft top-centre gold halo — echoes the showroom lighting of the
          home hero without shipping another photograph. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_130%_at_50%_-30%,rgba(245,166,35,0.14),transparent_60%)]"
      />
      <Container className="pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-14 lg:pb-16">
        {breadcrumb}
        <p
          className={`text-caption font-bold uppercase tracking-[0.16em] text-(--color-brand) ${
            breadcrumb ? "mt-6" : ""
          }`}
        >
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-headline font-bold tracking-tight text-balance sm:text-display">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-[56ch] text-body text-white/70 sm:text-body-lg">
            {subtitle}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
