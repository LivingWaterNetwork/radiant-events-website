import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import ArrowIcon from "@/components/ArrowIcon";
import Breadcrumbs from "@/components/Breadcrumbs";
import { occasions } from "@/content/occasions";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Celebrations & Event Design in Atlanta",
  "Explore personal milestones, showers, and brand or community gatherings with Radiant Events Planning in Atlanta.",
  "/occasions",
);
export default function Occasions() {
  return (
    <>
      <PageHero
        eyebrow="Your reason to gather"
        title="Every occasion. A feeling all its own."
        subtitle="Start with what you’re celebrating. We’ll help you find the right design and level of care."
      />
      <section className="section-wrap">
        <Breadcrumbs items={[{ label: "Occasions", href: "/occasions" }]} />
        <div className="occasion-cards">
          {occasions.map((o) => (
            <Link
              key={o.slug}
              href={`/occasions/${o.slug}`}
              className="occasion-card"
            >
              <div className="occasion-image">
                <Image
                  src={o.image}
                  alt={o.alt}
                  fill
                  sizes="(max-width:760px) 100vw, 33vw"
                />
              </div>
              <p className="eyebrow">{o.eyebrow}</p>
              <h2>{o.title}</h2>
              <p>{o.summary}</p>
              <span className="text-link">
                Explore this occasion <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="closing-cta">
        <h2>
          Start with the feeling.
          <br />
          <em>We’ll meet you there.</em>
        </h2>
        <Link href="/contact" className="button-light">
          Tell us about your event <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
