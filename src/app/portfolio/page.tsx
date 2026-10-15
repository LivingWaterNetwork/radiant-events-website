"use client";
import ArrowIcon from "@/components/ArrowIcon";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PageHero from "@/components/sections/PageHero";
import { portfolioProjects } from "@/content/portfolio";
const categories = ["All", "Balloons + Backdrops", "Styled Moments"] as const;
export default function PortfolioPage() {
  const [filter, setFilter] = useState<string>("All");
  const selected = portfolioProjects.filter(
    (p) => filter === "All" || p.category === filter,
  );
  return (
    <div>
      <PageHero
        eyebrow="The collection"
        title="Celebrations with personality."
        subtitle="A closer look at Radiant's balloon installations, backdrops, and styled focal moments. Real details. Real joy."
      />
      <section className="section-wrap">
        <div className="portfolio-filters" aria-label="Filter portfolio">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {selected.map((p) => (
            <Link
              key={p.slug}
              href={"/portfolio/" + p.slug}
              className="work-card"
            >
              <div className="work-image">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width:760px) 100vw, 33vw"
                />
              </div>
              <div className="work-caption">
                <div>
                  <span className="eyebrow">{p.category}</span>
                  <h3>{p.title}</h3>
                </div>
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="closing-cta">
        <p className="eyebrow">Your occasion, your way</p>
        <h2>
          What will your
          <br />
          <em>moment look like?</em>
        </h2>
        <p>
          Tell us what you&apos;re celebrating. Let&apos;s create something
          personal.
        </p>
        <Link href="/contact" className="button-light">
          Start your event inquiry <ArrowIcon />
        </Link>
      </section>
    </div>
  );
}
