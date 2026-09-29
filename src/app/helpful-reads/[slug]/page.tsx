import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Picture from "@/components/Picture";
import { Container } from "@/components/sections";
import { getArticleBySlug, getArticles, getRelatedArticles, helpfulReadsCopy } from "@/content/helpful-reads";
import { getImages } from "@/content/media";
import { projectTitleSuffix, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/helpful-reads/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) return {};
  return pageMetadata({ title: `${a.title}${projectTitleSuffix}`, description: a.excerpt, path: `/helpful-reads/${a.slug}` });
}

export default async function ArticlePage({ params }: PageProps<"/helpful-reads/[slug]">) {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) notFound();
  const c = helpfulReadsCopy;
  const images = getImages(a.imageIds);
  const related = getRelatedArticles(a.slug);

  return (
    <article>
      <Container className="max-w-3xl pb-10 pt-12 md:pt-16" data-re-hero>
        <Link href="/helpful-reads" className="btn-link">
          <span aria-hidden="true">←&nbsp;</span>
          {c.back}
        </Link>
        <p className="eyebrow mt-8">
          {a.category} · {a.readingTime}
        </p>
        <h1 className="h-display mt-4 text-4xl md:text-5xl">{a.title}</h1>
      </Container>

      {images.length > 0 && (
        <Container className="max-w-5xl">
          <div className="grid grid-cols-2 gap-4">
            {images.map((img) => (
              <figure key={img.id} className="overflow-hidden bg-sand">
                <Picture image={img} sizes="(min-width: 1024px) 480px, 50vw" className="block aspect-[4/5]" imgClassName="h-full w-full object-cover" />
              </figure>
            ))}
          </div>
        </Container>
      )}

      <Container className="max-w-3xl py-12">
        <div className="space-y-8">
          {a.body.map((b, i) => (
            <div key={i}>
              {b.heading && <h2 className="h-display mb-3 text-2xl">{b.heading}</h2>}
              <p className="text-lg leading-relaxed text-ink">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-5 border-y border-sand py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="h-display text-2xl">{c.closing.text}</p>
          <Link href={site.inquiryCta.href} className="btn btn-primary">
            {c.closing.cta}
          </Link>
        </div>

        {related.length > 0 && (
          <nav aria-labelledby="related" className="mt-12">
            <h2 id="related" className="eyebrow">
              {c.related}
            </h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/helpful-reads/${r.slug}`} className="inline-flex min-h-11 items-center text-lg text-ink underline decoration-olive underline-offset-4 hover:text-olive-deep">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </article>
  );
}
