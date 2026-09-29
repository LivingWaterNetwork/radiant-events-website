import Link from "next/link";
import type { ReactNode } from "react";
import type { ResolvedProject } from "@/content/portfolio";
import { site } from "@/content/site";
import Picture from "./Picture";
import { Reveal } from "./motion/Reveal";

export function Container({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement> & { "data-re-hero"?: boolean }) {
  return (
    <div {...rest} className={`mx-auto max-w-7xl px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function PageIntro({ eyebrow, title, body, children }: { eyebrow?: string; title: string; body?: string; children?: ReactNode }) {
  return (
    <Container className="pb-12 pt-14 md:pb-16 md:pt-20">
      <div data-re-hero className="max-w-3xl">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="h-display text-4xl md:text-6xl">{title}</h1>
        {body && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">{body}</p>}
        {children}
      </div>
    </Container>
  );
}

export function SectionHeading({ title, body, id, as = "h2" }: { title: string; body?: string; id?: string; as?: "h2" | "h3" }) {
  const H = as;
  return (
    <div className="max-w-2xl">
      <span className="rule-leaf mb-5" aria-hidden="true" />
      <H id={id} className="h-display text-3xl md:text-4xl">
        {title}
      </H>
      {body && <p className="mt-4 text-base leading-relaxed text-ink md:text-lg">{body}</p>}
    </div>
  );
}

export function InquiryBand({ title }: { title: string }) {
  return (
    <section aria-labelledby="inquiry-band" className="border-t border-sand bg-white">
      <Container className="flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <h2 id="inquiry-band" className="h-display max-w-2xl text-3xl md:text-4xl">
          {title}
        </h2>
        <Link href={site.inquiryCta.href} className="btn btn-primary shrink-0">
          {site.inquiryCta.label}
        </Link>
      </Container>
    </section>
  );
}

export function ProjectCard({
  project,
  sizes,
  priority = false,
  aspect = "aspect-[4/5]",
  headingLevel = "h3",
}: {
  project: ResolvedProject;
  sizes: string;
  priority?: boolean;
  aspect?: string;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <article className="group relative">
      <div className={`zoom-media relative overflow-hidden bg-sand ${aspect}`}>
        {project.hero.kind === "image" ? (
          <Picture image={project.hero.image} sizes={sizes} priority={priority} imgClassName="h-full w-full object-cover" className="block h-full w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- pipeline poster frame
          <img
            src={project.hero.video.poster}
            alt={project.hero.video.alt}
            width={project.hero.video.width}
            height={project.hero.video.height}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <p className="eyebrow mt-5">{project.eventType}</p>
      <H className="h-display mt-2 text-2xl">
        <Link href={`/portfolio/${project.slug}`} className="after:absolute after:inset-0 hover:text-olive-deep">
          {project.title}
        </Link>
      </H>
      <p className="mt-2 text-sm leading-relaxed text-ink">{project.summary}</p>
    </article>
  );
}

export { Reveal };
