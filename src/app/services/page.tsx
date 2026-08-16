import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Planning + Coordination, Design + Room Styling, and Signature Installations for celebrations across Atlanta.",
};

const FAQS = [
  {
    question: "How do custom proposals work?",
    answer:
      "After an initial consultation, we scope your event and put together a proposal specific to your date, venue, and the services you need — there's no fixed package pricing.",
  },
  {
    question: "Can I combine multiple services?",
    answer:
      "Yes — most full-scale celebrations combine Planning + Coordination with Design + Room Styling. Signature Installations can also stand alone.",
  },
  {
    question: "Do you travel outside Atlanta?",
    answer:
      "We're based in Atlanta and primarily serve the surrounding area. Reach out with your location and we'll confirm availability.",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="How We Help"
        subtitle="Three ways to work with Radiant Events — chosen individually or combined into one fully considered experience."
        mediaIndex={1}
      />

      <section className="mx-auto max-w-5xl px-6 py-20 space-y-24">
        {services.map((service, i) => (
          <div
            key={service.slug}
            className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <PlaceholderMedia index={i + 1} className="aspect-[4/5] rounded-sm" />
            <Reveal>
              <p className="font-display italic text-lg text-tangerine mb-2">{service.tagline}</p>
              <h2 className="font-display text-3xl md:text-4xl text-aubergine mb-4">
                {service.title}
              </h2>
              <p className="font-sans text-sm text-stone leading-relaxed mb-6">
                {service.summary}
              </p>
              <ul className="space-y-2 mb-6">
                {service.includes.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2 font-sans text-sm text-ink">
                    <span className="mt-2 h-1 w-1 rounded-full bg-tangerine flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${service.slug}`}
                className="font-sans text-sm uppercase tracking-wide-lg text-aubergine border-b border-tangerine hover:text-tangerine"
              >
                Learn More
              </Link>
            </Reveal>
          </div>
        ))}
      </section>

      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-4xl text-ink">Common Questions</h2>
          </Reveal>
          <div className="space-y-8">
            {FAQS.map((faq) => (
              <Reveal key={faq.question}>
                <h3 className="font-display text-xl text-aubergine mb-2">{faq.question}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{faq.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-aubergine text-cream-light">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl mb-6">Not sure which fits?</h2>
          <p className="font-sans text-cream-light/90 mb-8">
            Tell us about your celebration and we&rsquo;ll recommend the right level of support.
          </p>
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
