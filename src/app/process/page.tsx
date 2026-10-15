import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata(
  "Process",
  "A calm, considered client journey from first inquiry to final celebration.",
  "/process",
);

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
    title: "Booking + Planning",
    copy: "Once the scope and booking terms are agreed, we translate the concept into your plan: design direction, responsibilities, venue needs, and the details that will carry your day.",
  },
  {
    number: "05",
    title: "Production + Installation",
    copy: "The agreed vendor, setup, and coordination arrangements are confirmed against your venue access and event timeline.",
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
              <span className="font-display text-6xl text-blush leading-none">
                {step.number}
              </span>
              <div>
                <h2 className="font-display text-3xl text-aubergine mb-3">
                  {step.title}
                </h2>
                <p className="font-sans text-stone leading-relaxed max-w-xl">
                  {step.copy}
                </p>
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
            className="inline-block rounded-full bg-tangerine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-cream-light hover:bg-coral transition-colors"
          >
            {siteConfig.primaryCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
