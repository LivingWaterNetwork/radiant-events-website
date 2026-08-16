import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import { Reveal } from "@/components/motion/Reveal";
import { services, getServiceBySlug } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div>
      <PageHero eyebrow="Services" title={service.title} subtitle={service.tagline} mediaIndex={2} />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="font-sans text-ink leading-relaxed mb-6">{service.summary}</p>
          <p className="font-sans text-stone leading-relaxed">
            <span className="font-semibold text-ink">Ideal for: </span>
            {service.idealFor}
          </p>
        </Reveal>
      </section>

      <section className="bg-cream px-6 py-16">
        <div className="mx-auto max-w-3xl grid gap-12 sm:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl text-aubergine mb-4">Outcomes</h2>
            <ul className="space-y-2">
              {service.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 font-sans text-sm text-ink">
                  <span className="mt-2 h-1 w-1 rounded-full bg-tangerine flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl text-aubergine mb-4">What&rsquo;s Included</h2>
            <ul className="space-y-2">
              {service.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 font-sans text-sm text-ink">
                  <span className="mt-2 h-1 w-1 rounded-full bg-tangerine flex-shrink-0" />
                  {inc}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-2xl text-aubergine mb-6">How It Works</h2>
          <ol className="space-y-4">
            {service.process.map((step, i) => (
              <li key={step} className="flex gap-4 font-sans text-sm text-ink">
                <span className="font-display text-xl text-blush flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="bg-cream px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-8">
            <h2 className="font-display text-2xl text-aubergine">Frequently Asked</h2>
          </Reveal>
          <div className="space-y-8">
            {service.faq.map((f) => (
              <Reveal key={f.question}>
                <h3 className="font-display text-lg text-ink mb-1">{f.question}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{f.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <PlaceholderMedia index={0} className="aspect-[3/1] rounded-sm mb-8" label="Related work" />
        <Link
          href="/portfolio"
          className="font-sans text-sm uppercase tracking-wide-lg text-aubergine border-b border-tangerine hover:text-tangerine"
        >
          View Related Portfolio Work
        </Link>
      </section>

      <section className="bg-aubergine text-cream-light">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl mb-6">Ready to talk through your event?</h2>
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
