import type { Metadata } from "next";
import Picture from "@/components/Picture";
import { Container, InquiryBand, Reveal, SectionHeading } from "@/components/sections";
import { aboutCopy, getFounder } from "@/content/about";
import { getImage } from "@/content/media";
import { seo, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(seo.about);

export default function AboutPage() {
  const c = aboutCopy;
  const founder = getFounder();
  const portrait = founder.portraitId ? getImage(founder.portraitId) : undefined;
  const meetImage = portrait ?? getImage(c.meet.fallbackImageId);

  return (
    <>
      {/* Hero: the tagline section */}
      <section aria-labelledby="about-title" className="border-b border-sand">
        <Container className="py-16 md:py-24">
          <p className="eyebrow">{c.title}</p>
          <h1 id="about-title" className="tagline mt-4 text-5xl md:text-7xl">
            {site.tagline}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink md:text-xl">{c.intro}</p>
        </Container>
      </section>

      <section aria-labelledby="meet" className="py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {meetImage && (
            <Reveal className="overflow-hidden bg-sand">
              <Picture
                image={meetImage}
                alt={portrait ? (founder.portraitAlt ?? meetImage.alt) : meetImage.alt}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="block aspect-[4/5]"
                imgClassName="h-full w-full object-cover"
              />
            </Reveal>
          )}
          <Reveal>
            <SectionHeading id="meet" title={c.meet.title} />
            <p className="mt-6 text-lg leading-relaxed text-ink">{c.meet.opening}</p>
            {founder.story?.map((para) => (
              <p key={para.slice(0, 32)} className="mt-5 text-lg leading-relaxed text-ink">
                {para}
              </p>
            ))}
            {founder.quote && (
              <blockquote className="mt-8 border-l-2 border-olive pl-6">
                <p className="h-display text-2xl">{founder.quote}</p>
              </blockquote>
            )}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="pillars" className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading id="pillars" title={c.pillarsTitle} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.05} className="border-t-2 border-olive bg-ivory p-7">
                <h3 className="h-display text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <InquiryBand title={c.ctaBand} />
    </>
  );
}
