// Shared rhythm for the Privacy and Terms pages: a plain heading over a
// muted body paragraph, inside the pages' reading column.
export function LegalSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-title-sm font-semibold">{title}</h2>
      <p className="mt-2 text-body text-(--color-text-muted)">{body}</p>
    </section>
  );
}
