import { Container } from "@/components/sections";
import { legalCopy } from "@/content/legal";

export default function LegalDraft({ doc }: { doc: "privacy" | "terms" }) {
  const d = legalCopy[doc];
  return (
    <Container className="max-w-3xl py-16 md:py-24">
      <p className="eyebrow">{legalCopy.draftNotice}</p>
      <h1 className="h-display mt-4 text-4xl md:text-5xl">{d.title}</h1>
      <div className="mt-10 space-y-8">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="h-display text-2xl">{s.heading}</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink">{s.body}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
