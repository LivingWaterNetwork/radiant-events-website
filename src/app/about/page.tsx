import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `The story, philosophy, and people behind ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <div>
      <PageHero eyebrow="About" title="Planning with Purpose. Serving with Grace." mediaIndex={3} />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="font-display italic text-2xl md:text-3xl text-aubergine text-center mb-10 leading-snug">
            &ldquo;Beauty without the burden.&rdquo;
          </p>
          <p className="font-sans text-ink leading-relaxed mb-6">
            {siteConfig.name} creates intentional, elevated celebrations for clients who want the
            finished experience to feel effortless, personal, and beautifully resolved. We exist
            to turn meaningful moments into polished, personal experiences — with calm leadership
            behind the scenes and gracious service at every touchpoint.
          </p>
          <p className="font-sans text-ink leading-relaxed">
            She values how the process feels as much as how the room looks. That belief shapes
            everything we do: our goal isn&rsquo;t just a beautiful room, it&rsquo;s a client who
            feels present, proud, and cared for on the day it matters most.
          </p>
        </Reveal>
      </section>

      {/* Founder bio: placeholder pending real biography copy — see CONTENT_NEEDED.md */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-4xl grid gap-10 md:grid-cols-2 items-center">
          <PlaceholderMedia index={2} className="aspect-[4/5] rounded-sm" label="Founder portrait" />
          <Reveal>
            <p className="font-sans uppercase tracking-wide-lg text-xs text-aubergine mb-3">
              Meet The Team
            </p>
            <h2 className="font-display text-3xl text-ink mb-4">Founder &amp; Lead Planner</h2>
            <p className="font-sans text-sm text-stone leading-relaxed mb-3">
              A founder biography — background, approach to service, and what drew them to event
              planning — belongs here. Placeholder pending real copy from the owner.
            </p>
            <p className="font-sans text-xs text-stone italic">
              See CONTENT_NEEDED.md for what&rsquo;s needed to complete this section.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center mb-14">
            <p className="font-sans uppercase tracking-wide-lg text-xs text-aubergine mb-3">
              Brand Pillars
            </p>
            <h2 className="font-display text-4xl text-ink">How We Work</h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 text-center">
            {[
              { title: "Gracious", copy: "Warm and attentive, never overly familiar." },
              { title: "Assured", copy: "Clear recommendations, offered without pressure." },
              { title: "Refined", copy: "Elegant without ever sounding distant." },
              { title: "Specific", copy: "We name the detail, the benefit, and the next step." },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <h3 className="font-display text-2xl text-aubergine mb-2">{v.title}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{v.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-aubergine text-cream-light">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl mb-6">Let&rsquo;s hold your celebration well.</h2>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-tangerine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-ink hover:bg-coral transition-colors"
          >
            {siteConfig.primaryCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
