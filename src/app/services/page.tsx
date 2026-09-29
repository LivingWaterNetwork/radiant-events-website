import Link from "next/link";
import type { Metadata } from "next";
import Picture from "@/components/Picture";
import { Container, InquiryBand, PageIntro, Reveal, SectionHeading } from "@/components/sections";
import { homeCopy } from "@/content/home";
import { getImage } from "@/content/media";
import { getServices, servicesCopy } from "@/content/services";
import { seo, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(seo.services);

export default function ServicesPage() {
  const c = servicesCopy;
  return (
    <>
      <PageIntro eyebrow={site.nav[0].label} title={c.intro.title} body={c.intro.body} />

      <nav aria-label={site.navLabels.servicesOnPage} className="border-y border-sand bg-white">
        <Container>
          <ul className="flex flex-wrap gap-x-8 gap-y-1 py-3">
            {getServices().map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-11 items-center text-sm font-medium text-olive-deep underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {getServices().map((s, i) => {
        const img = getImage(s.imageId);
        return (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24 border-b border-sand py-16 md:py-24">
            <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              {img && (
                <Reveal className={`zoom-media overflow-hidden bg-sand ${i % 2 ? "md:order-2" : ""}`}>
                  <Picture image={img} sizes="(min-width: 768px) 45vw, 100vw" className="block aspect-[4/5]" imgClassName="h-full w-full object-cover" />
                </Reveal>
              )}
              <Reveal>
                <SectionHeading id={`${s.id}-title`} title={s.title} body={s.lede} />
                {s.deliverables.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex gap-3 text-base leading-relaxed text-ink">
                        <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-olive" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={site.inquiryCta.href} className="btn btn-primary mt-8">
                  {c.quoteCta}
                </Link>
              </Reveal>
            </Container>
          </section>
        );
      })}

      <section aria-labelledby="included" className="bg-white py-16 md:py-20">
        <Container className="max-w-4xl">
          <SectionHeading id="included" title={c.included.title} body={c.included.body} />
        </Container>
      </section>

      <section aria-labelledby="faq" className="py-16 md:py-24">
        <Container className="max-w-4xl">
          <SectionHeading id="faq" title={c.faqTitle} />
          <div className="mt-10 divide-y divide-sand border-y border-sand">
            {c.faq.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-3 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-2xl leading-none text-olive-deep transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-10 leading-relaxed text-ink">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <InquiryBand title={homeCopy.inquiryBand.title} />
    </>
  );
}
