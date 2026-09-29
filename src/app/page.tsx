import Link from "next/link";
import type { Metadata } from "next";
import { SplitWords } from "@/components/BrandIntro";
import HeroVideo from "@/components/HeroVideo";
import Picture from "@/components/Picture";
import { Container, InquiryBand, ProjectCard, Reveal, SectionHeading } from "@/components/sections";
import { getFounder } from "@/content/about";
import { homeCopy } from "@/content/home";
import { getImage, getVideo } from "@/content/media";
import { getFeaturedProjects } from "@/content/portfolio";
import { getServices } from "@/content/services";
import { seo, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...pageMetadata(seo.home),
  title: { absolute: seo.home.title },
};

export default function HomePage() {
  const c = homeCopy;
  const heroImage = getImage(c.hero.imageId);
  const heroVideo = getVideo(c.hero.videoId);
  const aboutImage = getImage(c.about.imageId);
  const featured = getFeaturedProjects();
  const founder = getFounder();
  const [lead, ...rest] = featured;

  return (
    <>
      {/* 1. Hero */}
      <section aria-labelledby="hero-title" className="border-b border-sand">
        <div className="mx-auto grid max-w-[1600px] lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_1.1fr]">
          <div data-re-hero className="order-2 flex flex-col justify-center px-5 py-12 md:px-8 lg:order-1 lg:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
            <p className="eyebrow mb-5">{c.hero.eyebrow}</p>
            <h1 id="hero-title" data-re-split className="h-display text-[2.6rem] sm:text-5xl xl:text-7xl">
              <SplitWords text={c.hero.title} />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink">{c.hero.support}</p>
            <p className="tagline mt-6">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={site.inquiryCta.href} className="btn btn-primary">
                {site.inquiryCta.label}
              </Link>
              <Link href={site.workCta.href} className="btn-link">
                {site.workCta.label}
              </Link>
            </div>
          </div>
          {heroImage && (
            <div className="relative order-1 aspect-[4/5] overflow-hidden bg-sand md:aspect-[3/2] lg:order-2 lg:aspect-auto">
              <Picture
                image={heroImage}
                desktop={heroImage.variants["hero-desktop"]}
                mobile={heroImage.variants["hero-mobile"]}
                mobileQuery="(max-width: 767px), (min-width: 1024px)"
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              {heroVideo && <HeroVideo video={heroVideo} pauseLabel={c.hero.pauseLabel} playLabel={c.hero.playLabel} />}
            </div>
          )}
        </div>
      </section>

      {/* 2. About Radiant */}
      <section aria-labelledby="home-about" className="py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {aboutImage && (
            <Reveal className="zoom-media overflow-hidden bg-sand">
              <Picture image={aboutImage} sizes="(min-width: 768px) 45vw, 100vw" imgClassName="h-full w-full object-cover" className="block aspect-[4/5]" />
            </Reveal>
          )}
          <Reveal>
            <SectionHeading id="home-about" title={c.about.title} />
            <p className="mt-6 text-lg leading-relaxed text-ink">{c.about.body}</p>
            <Link href={c.about.link.href} className="btn-link mt-6">
              {c.about.link.label} <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* 3. What we do */}
      <section aria-labelledby="home-services" className="bg-white/60 py-20 md:py-24">
        <Container>
          <h2 id="home-services" className="sr-only">
            {c.whatWeDo.title}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {getServices().map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 0.05} className="relative border-t-2 border-olive bg-white p-7">
                <h3 className="h-display text-2xl">
                  <Link href={`/services#${s.id}`} className="after:absolute after:inset-0 hover:text-olive-deep">
                    {s.title}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink">{s.cardSummary}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 4. Our work */}
      {lead && (
        <section aria-labelledby="home-work" className="py-20 md:py-28">
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading id="home-work" title={c.work.title} body={c.work.body} />
              <Link href={c.work.link.href} className="btn-link">
                {c.work.link.label}
              </Link>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-12">
              <Reveal>
                <ProjectCard project={lead} sizes="(min-width: 768px) 55vw, 100vw" />
              </Reveal>
              <div className="grid gap-10">
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={0.05 * (i + 1)}>
                    <ProjectCard project={p} sizes="(min-width: 768px) 40vw, 100vw" aspect="aspect-[3/2]" />
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 5. Range strip */}
      <section aria-label={c.range.label} className="border-y border-sand bg-white py-8">
        <Container>
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-olive-deep md:text-sm">
            {c.range.items.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {item}
                {i < c.range.items.length - 1 && (
                  <span aria-hidden="true" className="text-olive">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6. Experience */}
      <section aria-labelledby="home-experience" className="py-20 md:py-28">
        <Container>
          <SectionHeading id="home-experience" title={c.experience.title} />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {c.experience.steps.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 0.04} className="border-t border-taupe pt-5">
                <span className="h-display block text-3xl text-olive-deep" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="sr-only">
                  {site.stepLabel} {i + 1}:{" "}
                </span>
                <span className="mt-3 block text-base leading-snug text-ink">{step}</span>
              </Reveal>
            ))}
          </ol>
          <Link href={c.experience.link.href} className="btn-link mt-10">
            {c.experience.link.label}
          </Link>
        </Container>
      </section>

      {/* 7. Values moment */}
      <section aria-label={site.tagline} className="bg-sand/60 py-20 md:py-24">
        <Container className="text-center">
          <p className="tagline text-4xl md:text-5xl">{site.tagline}</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink">{founder.quote ?? c.values.line}</p>
        </Container>
      </section>

      {/* 8. Inquiry band */}
      <InquiryBand title={c.inquiryBand.title} />
    </>
  );
}
