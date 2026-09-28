import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageIntro, Reveal } from "@/components/sections";
import { getArticles, helpfulReadsCopy } from "@/content/helpful-reads";
import { seo } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(seo.helpfulReads);

export default function HelpfulReadsPage() {
  const c = helpfulReadsCopy;
  return (
    <>
      <PageIntro title={c.title} body={c.intro} />
      <Container className="pb-24">
        <ul className="grid gap-6 md:grid-cols-3">
          {getArticles().map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 0.05} className="relative flex flex-col border-t-2 border-olive bg-white p-7">
              <p className="eyebrow">
                {a.category} · {a.readingTime}
              </p>
              <h2 className="h-display mt-4 text-2xl">
                <Link href={`/helpful-reads/${a.slug}`} className="after:absolute after:inset-0 hover:text-olive-deep">
                  {a.title}
                </Link>
              </h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink">{a.excerpt}</p>
              <span className="btn-link mt-6" aria-hidden="true">
                {c.readArticle}
              </span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </>
  );
}
