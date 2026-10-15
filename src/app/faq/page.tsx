import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import ArrowIcon from "@/components/ArrowIcon";
import Breadcrumbs from "@/components/Breadcrumbs";
import { faqs } from "@/content/faqs";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Event Planning Questions",
  "Answers about Radiant Events services, custom proposals, Atlanta venues, booking, setup, and deposits.",
  "/faq",
);
export default function FAQ() {
  return (
    <>
      <PageHero
        eyebrow="Clarity before the celebration"
        title="Good questions. Thoughtful answers."
        subtitle="The details that help you take the first step with confidence."
      />
      <section className="section-wrap">
        <Breadcrumbs items={[{ label: "Questions", href: "/faq" }]} />
        {[...new Set(faqs.map((f) => f.group))].map((group) => (
          <div className="faq-category" key={group}>
            <h2>{group}</h2>
            <div>
              {faqs
                .filter((f) => f.group === group)
                .map((f) => (
                  <details key={f.question}>
                    <summary>
                      {f.question}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
            </div>
          </div>
        ))}
      </section>
      <section className="closing-cta">
        <h2>Something more personal?</h2>
        <p>
          Tell us about your occasion. We’ll help you work through the details.
        </p>
        <Link className="button-light" href="/contact">
          Begin the conversation <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
