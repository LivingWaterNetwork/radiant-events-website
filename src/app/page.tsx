import Link from "next/link";
import type { Metadata } from "next";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import HomeHero from "@/components/sections/HomeHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Radiant Events | Atlanta Event Planning & Design",
  description: siteConfig.oneLiner,
};

const SERVICES = [
  {
    title: "Planning + Coordination",
    href: "/services/planning-coordination",
    copy: "Full-service planning or month-of coordination — timelines, vendors, and logistics handled with calm precision.",
  },
  {
    title: "Design + Room Styling",
    href: "/services/design-room-styling",
    copy: "Concept, palette, and room design carried through to a cohesive, elevated finished space.",
  },
  {
    title: "Signature Installations",
    href: "/services/signature-installations",
    copy: "Balloon installations, luxury tablescapes, draping, and custom backdrops built for a single, striking moment.",
  },
];

export default function Home() {
  return (
    <div>
      <HomeHero />

      {/* One-liner / positioning */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <p className="font-display italic text-2xl md:text-3xl text-aubergine leading-snug">
            &ldquo;Radiance is not excess. It is the feeling that everything has been
            considered.&rdquo;
          </p>
        </Reveal>
      </section>

      {/* Services teaser */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-14">
            <p className="font-sans uppercase tracking-wide-lg text-xs text-aubergine mb-3">
              What We Do
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink">Our Services</h2>
          </Reveal>
          <Stagger className="grid gap-10 md:grid-cols-3">
            {SERVICES.map((service) => (
              <StaggerItem key={service.title} className="text-center">
                <Link href={service.href} className="group">
                  <h3 className="font-display text-2xl text-aubergine mb-3 group-hover:text-tangerine transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-stone leading-relaxed">{service.copy}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="text-center mt-14">
            <Link
              href="/services"
              className="font-sans text-sm uppercase tracking-wide-lg text-aubergine border-b border-tangerine hover:text-tangerine"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio teaser */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="text-center mb-14">
          <p className="font-sans uppercase tracking-wide-lg text-xs text-aubergine mb-3">
            Recent Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">Celebrations We&rsquo;ve Held</h2>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <StaggerItem key={i}>
              <PlaceholderMedia index={i} className="aspect-[3/4] rounded-sm" />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="text-center mt-14">
          <Link
            href="/portfolio"
            className="font-sans text-sm uppercase tracking-wide-lg text-aubergine border-b border-tangerine hover:text-tangerine"
          >
            View Full Portfolio
          </Link>
        </div>
      </section>

      {/* Process teaser */}
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-center gap-x-14 gap-y-4 text-cream-light/70 font-display italic text-xl text-center">
          <span>Purpose</span>
          <span className="hidden md:inline text-tangerine">&bull;</span>
          <span>Radiance</span>
          <span className="hidden md:inline text-tangerine">&bull;</span>
          <span>Grace</span>
          <span className="hidden md:inline text-tangerine">&bull;</span>
          <span>Precision</span>
        </div>
      </section>

      {/* Testimonials — withheld until real, attributable client quotes are supplied. See CONTENT_NEEDED.md */}
      {siteConfig.showTestimonials && (
        <section className="mx-auto max-w-5xl px-6 py-20">
          <Reveal className="text-center mb-14">
            <p className="font-sans uppercase tracking-wide-lg text-xs text-aubergine mb-3">
              Kind Words
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink">From Our Clients</h2>
          </Reveal>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-aubergine text-cream-light">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              You bring the reason to celebrate.
            </h2>
            <p className="font-sans text-cream-light/90 mb-10">
              We bring the plan, the polish, and the calm presence that lets you enjoy it.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-tangerine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-ink hover:bg-coral transition-colors"
            >
              {siteConfig.primaryCta}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
