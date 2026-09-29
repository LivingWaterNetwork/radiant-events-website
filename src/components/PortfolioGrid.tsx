"use client";

import { useSyncExternalStore } from "react";
import type { ResolvedProject } from "@/content/portfolio";
import { filterSlug } from "@/lib/slug";
import { ProjectCard } from "./sections";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export default function PortfolioGrid({
  projects,
  filters,
  allLabel,
  filterLabel,
  countLabel,
}: {
  projects: ResolvedProject[];
  filters: string[];
  allLabel: string;
  filterLabel: string;
  countLabel: { one: string; other: string };
}) {
  // The active filter lives in the URL hash (/portfolio#birthdays-and-milestones),
  // so it deep-links and survives reloads.
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  const active = filters.find((f) => filterSlug(f) === hash) ?? allLabel;

  function choose(f: string) {
    const next = f === allLabel ? "" : `#${filterSlug(f)}`;
    window.history.replaceState(null, "", `${window.location.pathname}${next}`);
    window.dispatchEvent(new Event("hashchange"));
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
        {visible.length} {visible.length === 1 ? countLabel.one : countLabel.other}
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
