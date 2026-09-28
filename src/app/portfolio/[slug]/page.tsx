import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import Picture from "@/components/Picture";
import { Container, Reveal, SectionHeading } from "@/components/sections";
import { getProjectBySlug, getPublishedProjects, portfolioCopy } from "@/content/portfolio";
import { projectTitleSuffix, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return {};
  const og =
    p.hero.kind === "image"
      ? p.hero.image.variants.og
        ? { url: `${p.hero.image.variants.og.base}-1200.jpg`, width: 1200, height: 630, alt: p.hero.image.alt }
        : { url: `${p.hero.image.base}-1600.jpg`, width: 1600, height: Math.round((1600 * p.hero.image.height) / p.hero.image.width), alt: p.hero.image.alt }
      : { url: p.hero.video.poster, width: p.hero.video.width, height: p.hero.video.height, alt: p.hero.video.alt };
  return pageMetadata({ title: `${p.title}${projectTitleSuffix}`, description: p.summary, path: `/portfolio/${p.slug}` }, og);
}

export default async function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) notFound();
  const c = portfolioCopy;

  return (
    <>
      <Container className="pt-10 md:pt-14">
        <Link href="/portfolio" className="btn-link">
          <span aria-hidden="true">←&nbsp;</span>
          {c.back}
        </Link>
      </Container>

      <section aria-labelledby="project-title">
        <Container className="grid gap-10 pb-16 pt-8 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:pb-24">
          <div>
            <p className="eyebrow">{p.eventType}</p>
            <h1 id="project-title" className="h-display mt-4 text-4xl md:text-5xl">
              {p.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink">{p.designStory}</p>
            {p.locationNote && <p className="mt-4 text-sm text-ink">{p.locationNote}</p>}
            <h2 className="eyebrow mt-10">{c.whatWeDid}</h2>
            <ul className="mt-4 space-y-3">
              {p.servicesDelivered.map((s) => (
                <li key={s} className="flex gap-3 leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-olive" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden bg-sand">
            {p.hero.kind === "image" ? (
              <Picture image={p.hero.image} sizes="(min-width: 768px) 50vw, 100vw" priority className="block aspect-[4/5]" imgClassName="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- pipeline poster frame
              <img src={p.hero.video.poster} alt={p.hero.video.alt} width={p.hero.video.width} height={p.hero.video.height} className="aspect-[4/5] w-full object-cover" fetchPriority="high" />
            )}
          </div>
        </Container>
      </section>

      {p.gallery.length > 1 && (
        <section aria-labelledby="gallery" className="border-t border-sand py-16 md:py-24">
          <Container>
            <SectionHeading id="gallery" title={c.gallery} />
            <div className="mt-10">
              <Gallery images={p.gallery} labels={c.galleryLabels} />
            </div>
          </Container>
        </section>
      )}

      {p.videos.length > 0 && (
        <section aria-labelledby="video" className="border-t border-sand py-16 md:py-24">
          <Container>
            <SectionHeading id="video" title={c.video} />
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {p.videos.map((v) => (
                <Reveal key={v.id}>
                  <video
                    controls
                    muted
                    playsInline
                    preload="none"
                    poster={v.poster}
                    width={v.width}
                    height={v.height}
                    className="h-auto w-full bg-sand"
                    aria-label={v.alt || p.title}
                  >
                    <source src={v.webm} type="video/webm" />
                    <source src={v.mp4} type="video/mp4" />
                  </video>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section aria-labelledby="project-cta" className="border-t border-sand bg-white">
        <Container className="flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <h2 id="project-cta" className="h-display text-3xl">
            {c.closing.text}
          </h2>
          <Link href={site.inquiryCta.href} className="btn btn-primary">
            {c.closing.cta}
          </Link>
        </Container>
      </section>
    </>
  );
}
