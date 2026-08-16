import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Process",
  description: "A calm, considered client journey from first inquiry to final celebration.",
};

const STEPS = [
  {
    number: "01",
    title: "Inquiry",
    copy: "You reach out through the consultation form with the shape of your celebration — event type, date, and vision.",
  },
  {
    number: "02",
    title: "Consultation",
    copy: "We talk through your vision, your guests, your budget, and what a resolved celebration feels like to you.",
  },
  {
    number: "03",
    title: "Concept + Scope",
    copy: "We recommend the right services and put together a proposal specific to your event.",
  },
  {
    number: "04",
    title: "Planning + Design",
    copy: "We translate the concept into a plan: palette, layout, vendors, and the specific details that will carry your day.",
  },
  {
    number: "05",
    title: "Production + Installation",
    copy: "Vendors are booked, timelines built, and every logistical thread held so nothing is left to chance.",
  },
  {
    number: "06",
    title: "Celebration",
    copy: "On the day itself, we lead quietly behind the scenes so you can be fully present in the room.",
  },
];

export default function ProcessPage() {
  return (
    <div>
      <PageHero
        eyebrow="Process"
        title="How We Work Together"
        subtitle="A calm, considered path from first inquiry to final toast."
        mediaIndex={0}
      />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="space-y-16">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.number}
              delay={Math.min(i * 0.05, 0.2)}
              className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
            >
              <span className="font-display text-6xl text-blush leading-none">{step.number}</span>
              <div>
                <h2 className="font-display text-3xl text-aubergine mb-3">{step.title}</h2>
                <p className="font-sans text-stone leading-relaxed max-w-xl">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-aubergine text-cream-light">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl mb-6">Ready to begin?</h2>
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
