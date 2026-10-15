import ArrowIcon from "@/components/ArrowIcon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { pageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { portfolioProjects, getProjectBySlug } from "@/content/portfolio";
export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  return p
    ? pageMetadata(p.title, p.overview, "/portfolio/" + slug, p.image)
    : {};
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) notFound();
  return (
    <div>
      <PageHero eyebrow={p.category} title={p.title} subtitle={p.overview} />
      <div className="section-wrap pb-0!">
        <Breadcrumbs
          items={[
            { label: "Collection", href: "/portfolio" },
            { label: p.title, href: "/portfolio/" + slug },
          ]}
        />
      </div>
      <section className="section-wrap story-split">
        <div className="story-image">
          <Image
            src={p.image}
            alt={p.alt}
            fill
            sizes="(max-width:760px) 100vw, 50vw"
            preload
          />
        </div>
        <div>
          <p className="eyebrow">The design details</p>
          <h2>
            A moment,
            <br />
            <em>thoughtfully composed.</em>
          </h2>
          <p className="eyebrow">The design intention</p>
          <p>{p.challenge}</p>
          <p>{p.designDirection}</p>
          <p className="eyebrow">Featured elements</p>
          <ul className="mb-8 space-y-2">
            {p.servicesProvided.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link href="/contact" className="button-primary">
            Create your own moment <ArrowIcon />
          </Link>
        </div>
      </section>
      {p.gallery.length > 1 && (
        <section className="section-wrap pt-0! max-w-3xl!">
          {p.gallery.slice(1).map((src) => (
            <div key={src} className="story-image">
              <Image
                src={src}
                alt={p.alt + " — detail view"}
                fill
                sizes="(max-width:760px) 100vw, 700px"
              />
            </div>
          ))}
        </section>
      )}
      <div className="section-wrap pt-0!">
        <Link href="/portfolio" className="text-link">
          <ArrowIcon direction="left" /> Back to the collection
        </Link>
      </div>
    </div>
  );
}
