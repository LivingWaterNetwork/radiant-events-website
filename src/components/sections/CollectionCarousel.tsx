"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import { portfolioProjects } from "@/content/portfolio";

export default function CollectionCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const index = useRef(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  function goTo(next: number) {
    const el = track.current;
    if (!el) return;
    const position =
      (next + portfolioProjects.length) % portfolioProjects.length;
    const card = el.children[position] as HTMLElement;
    el.scrollTo({
      left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  useEffect(() => {
    if (paused || engaged) return;
    const timer = setInterval(() => {
      if (
        document.hidden ||
        document.activeElement?.closest(".collection-carousel") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const el = track.current;
      if (!el) return;
      const position = (index.current + 1) % portfolioProjects.length;
      const card = el.children[position] as HTMLElement;
      el.scrollTo({
        left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
        behavior: "smooth",
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, engaged]);
  return (
    <div
      className="collection-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Radiant event collection"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false);
      }}
    >
      <div className="carousel-controls">
        <span>Explore at your own pace.</span>
        <div>
          <button
            onClick={() => setPaused(!paused)}
            aria-label={
              paused
                ? "Resume automatic collection scrolling"
                : "Pause automatic collection scrolling"
            }
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            aria-label="Previous event"
            onClick={() => goTo(index.current - 1)}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            aria-label="Next event"
            onClick={() => goTo(index.current + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="collection-track"
        onTouchStart={() => setPaused(true)}
        onScroll={() => {
          const el = track.current;
          if (!el) return;
          const first = (el.children[0] as HTMLElement).offsetLeft;
          let nearest = 0;
          Array.from(el.children).forEach((card, i) => {
            if (
              Math.abs(
                (card as HTMLElement).offsetLeft - first - el.scrollLeft,
              ) <
              Math.abs(
                (el.children[nearest] as HTMLElement).offsetLeft -
                  first -
                  el.scrollLeft,
              )
            )
              nearest = i;
          });
          index.current = nearest;
          setActive(nearest);
        }}
      >
        {portfolioProjects.map((p, i) => (
          <Link
            href={"/portfolio/" + p.slug}
            key={p.slug}
            className="work-card carousel-card"
            aria-label={`${p.category} ${p.title} — ${i + 1} of ${portfolioProjects.length}`}
          >
            <div className="work-image">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width:767px) 85vw, 50vw"
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
      <div className="carousel-position" aria-label="Choose an event">
        {portfolioProjects.map((p, i) => (
          <button
            key={p.slug}
            aria-label={`Go to ${p.title}`}
            aria-pressed={active === i}
            onClick={() => goTo(i)}
          >
            <span />
          </button>
        ))}
        <span>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(portfolioProjects.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
