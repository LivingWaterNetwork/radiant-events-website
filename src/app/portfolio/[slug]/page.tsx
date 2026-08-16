import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import { Reveal } from "@/components/motion/Reveal";
import { portfolioProjects, getProjectBySlug } from "@/content/portfolio";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title };
}

export default async function PortfolioCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div>
      <PageHero eyebrow={project.category} title={project.title} mediaIndex={3} />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 rounded-sm border border-tangerine/40 bg-cream px-5 py-4 font-sans text-xs text-stone">
          This is a placeholder case study demonstrating the page layout. Real project details,
          photography, and outcomes will replace this content — see{" "}
          <code className="text-aubergine">CONTENT_NEEDED.md</code>.
        </div>
        <Reveal>
          <h2 className="font-display text-2xl text-aubergine mb-3">Overview</h2>
          <p className="font-sans text-ink leading-relaxed mb-8">{project.overview}</p>

          <h2 className="font-display text-2xl text-aubergine mb-3">The Challenge</h2>
          <p className="font-sans text-ink leading-relaxed mb-8">{project.challenge}</p>

          <h2 className="font-display text-2xl text-aubergine mb-3">Design Direction</h2>
          <p className="font-sans text-ink leading-relaxed mb-8">{project.designDirection}</p>

          <h2 className="font-display text-2xl text-aubergine mb-3">Services Provided</h2>
          <ul className="space-y-2">
            {project.servicesProvided.map((s) => (
              <li key={s} className="flex items-start gap-2 font-sans text-sm text-ink">
                <span className="mt-2 h-1 w-1 rounded-full bg-tangerine flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <PlaceholderMedia key={i} index={i} className="aspect-[4/5] rounded-sm" />
          ))}
        </div>
      </section>

      <section className="bg-aubergine text-cream-light">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl mb-6">Planning something similar?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-tangerine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-ink hover:bg-coral transition-colors"
            >
              {siteConfig.primaryCta}
            </Link>
            <Link
              href="/portfolio"
              className="inline-block rounded-full border border-cream-light/50 px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-cream-light hover:bg-cream-light/10 transition-colors"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
