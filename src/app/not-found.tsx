import Link from "next/link";
import { Container } from "@/components/sections";
import { notFoundCopy } from "@/content/site";

export default function NotFound() {
  return (
    <Container className="py-24 md:py-32" data-re-hero>
      <h1 className="h-display text-4xl md:text-6xl">{notFoundCopy.title}</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink">{notFoundCopy.body}</p>
      <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        {notFoundCopy.links.map((l, i) => (
          <li key={l.href}>
            <Link href={l.href} className={i === 0 ? "btn btn-primary" : "btn-link"}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
