"use client";

import { useEffect, useState } from "react";
import type { ResolvedProject } from "@/content/portfolio";
import { filterSlug } from "@/lib/slug";
import { ProjectCard } from "./sections";

export default function PortfolioGrid({
  projects,
  filters,
  allLabel,
  filterLabel,
}: {
  projects: ResolvedProject[];
  filters: string[];
  allLabel: string;
  filterLabel: string;
}) {
  const [active, setActive] = useState(allLabel);

  // Deep link: /portfolio#birthdays-and-milestones
  useEffect(() => {
    const fromHash = filters.find((f) => filterSlug(f) === window.location.hash.slice(1));
    if (fromHash) setActive(fromHash);
  }, [filters]);

  function choose(f: string) {
    setActive(f);
    const hash = f === allLabel ? "" : `#${filterSlug(f)}`;
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }

  const visible = active === allLabel ? projects : projects.filter((p) => p.eventType === active);

  return (
    <>
      {filters.length > 2 && (
        <div role="group" aria-label={filterLabel} className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => choose(f)}
              className="min-h-11 border border-olive px-4 text-sm font-medium text-olive-deep transition-colors hover:bg-olive/10 aria-pressed:bg-olive aria-pressed:text-ivory"
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <li key={p.id}>
            <ProjectCard project={p} priority={i < 2} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" headingLevel="h2" />
          </li>
        ))}
      </ul>
    </>
  );
}
