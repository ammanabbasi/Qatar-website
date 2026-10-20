// Shared rhythm for the Privacy and Terms pages: a plain heading over a
// muted body paragraph, inside the pages' reading column.
export function LegalSection({
  title,
  body,
  id,
}: {
  title: string;
  body: string;
  /** Anchor for deep links, e.g. /terms#ppf-bookings. */
  id?: string;
}) {
  return (
    <section id={id} className={id ? "scroll-mt-24" : undefined}>
      <h2 className="text-title-sm font-semibold">{title}</h2>
      <p className="mt-2 text-body text-(--color-text-muted)">{body}</p>
    </section>
  );
}
