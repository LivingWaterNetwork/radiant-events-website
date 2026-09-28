import Link from "next/link";
import type { Metadata } from "next";
import Picture from "@/components/Picture";
import { Container, PageIntro, Reveal } from "@/components/sections";
import { getImage, getVideo } from "@/content/media";
import { processCopy } from "@/content/process";
import { seo, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(seo.process);

export default function ProcessPage() {
  const c = processCopy;
  const img = getImage(c.imageId);
  const video = getVideo(c.videoId);
  return (
    <>
      <PageIntro eyebrow={site.nav[2].label} title={c.title} body={c.intro} />
      <Container className="grid gap-14 pb-20 md:grid-cols-[1fr_0.8fr] md:gap-20 md:pb-28">
        <ol className="space-y-10">
          {c.steps.map((s, i) => (
            <Reveal as="li" key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-taupe pt-6">
              <span className="h-display text-3xl text-olive-deep" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h2 className="h-display text-2xl">
                  <span className="sr-only">{i + 1}. </span>
                  {s.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="space-y-8 md:sticky md:top-28 md:self-start">
          {img && (
            <div className="overflow-hidden bg-sand">
              <Picture image={img} sizes="(min-width: 768px) 40vw, 100vw" className="block aspect-[4/5]" imgClassName="h-full w-full object-cover" />
            </div>
          )}
          {video && (
            <video controls muted playsInline preload="none" poster={video.poster} width={video.width} height={video.height} className="h-auto w-full bg-sand" aria-label={video.alt}>
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>
          )}
          <Link href={site.inquiryCta.href} className="btn btn-primary">
            {site.inquiryCta.label}
          </Link>
        </div>
      </Container>
    </>
  );
}
