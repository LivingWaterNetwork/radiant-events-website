"use client";

import Link from "next/link";
import { useState } from "react";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import PageHero from "@/components/sections/PageHero";
import { portfolioProjects } from "@/content/portfolio";

const CATEGORIES = ["All", "Weddings", "Corporate", "Private + Social"] as const;

export default function PortfolioPage() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    filter === "All"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === filter);

  return (
    <div>
      <PageHero
        eyebrow="Portfolio"
        title="Celebrations We've Held"
        subtitle="A selection of weddings, corporate events, and private celebrations designed and produced across Atlanta."
        mediaIndex={2}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`rounded-full px-5 py-2 font-sans text-xs uppercase tracking-wide-lg transition-colors ${
                filter === cat
                  ? "bg-aubergine text-cream-light"
                  : "bg-cream text-ink hover:bg-blush"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((project, i) => (
            <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group block">
              <PlaceholderMedia
                index={i}
                label={project.category}
                className="aspect-[4/5] rounded-sm mb-3"
              />
              <h3 className="font-display text-xl text-aubergine group-hover:text-tangerine transition-colors">
                {project.title}
              </h3>
              <p className="font-sans text-xs uppercase tracking-wide-lg text-stone">
                {project.category}
              </p>
            </Link>
          ))}
        </div>

        <p className="text-center font-sans text-xs text-stone mt-16">
          Placeholder projects and imagery shown — real portfolio work will replace these entries
          as it becomes available. See CONTENT_NEEDED.md.
        </p>
      </section>
    </div>
  );
}
