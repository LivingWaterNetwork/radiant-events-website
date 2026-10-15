"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowIcon from "@/components/ArrowIcon";

const directions = [
  {
    name: "Soft & romantic",
    title: "A softer kind of statement.",
    description:
      "Blush tones, sculptural curves, and a little golden warmth. A beautiful starting point for showers, birthdays, and heartfelt celebrations.",
    image: "/images/pink-arch.webp",
    alt: "Soft pink balloons arranged around a gold circle",
    colors: ["#eab3c5", "#cf718f", "#d8be82"],
    details: "Soft pink · Organic forms · Golden accents",
    slug: "pink-balloon-circle",
  },
  {
    name: "Bright & joyful",
    title: "Let your personality take up space.",
    description:
      "Unexpected color and a touch of shimmer. For the gathering that wants to feel playful, expressive, and impossible to overlook.",
    image: "/images/colorful-backdrop.webp",
    alt: "Bright turquoise and lime balloons with a purple sequin backdrop",
    colors: ["#49bcb6", "#b7cf41", "#77528d"],
    details: "Bold color · Shimmer · Playful contrast",
    slug: "colorful-sequin-backdrop",
  },
  {
    name: "Bold & playful",
    title: "Make the entrance part of the party.",
    description:
      "Rich color, themed details, and a focal moment that sets the mood before the first guest arrives. A little drama, with plenty of joy.",
    image: "/images/game-night.webp",
    alt: "A game night entrance styled with purple balloons and oversized dice",
    colors: ["#694d91", "#d474b5", "#2d2d31"],
    details: "Rich tones · Themed details · Big personality",
    slug: "game-night-balloon-moment",
  },
];
export default function DesignStudio() {
  const [selected, setSelected] = useState(0);
  const direction = directions[selected];
  return (
    <section
      id="design-studio"
      className="design-studio section-wrap"
      data-enter
    >
      <div className="studio-heading">
        <p className="eyebrow">01 / Find the feeling</p>
        <h2>
          How do you want
          <br />
          the room to <em>feel?</em>
        </h2>
        <p>
          Start with a feeling. Explore three directions from our own work, then
          let us make the details yours.
        </p>
      </div>
      <div
        className="studio-selector"
        role="group"
        aria-label="Explore design directions"
      >
        {directions.map((d, i) => (
          <button
            key={d.name}
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
          >
            <span className="studio-number">0{i + 1}</span>
            {d.name}
            <ArrowIcon />
          </button>
        ))}
      </div>
      <div className="studio-stage">
        <div className="studio-photo" key={direction.image}>
          <Image
            src={direction.image}
            alt={direction.alt}
            fill
            sizes="(max-width:767px) 100vw, 45vw"
          />
        </div>
        <div
          className="studio-story"
          key={direction.name}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="eyebrow">The direction / {direction.name}</p>
          <h3>{direction.title}</h3>
          <p>{direction.description}</p>
          <div className="palette" aria-label={direction.details}>
            {direction.colors.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
            <small>{direction.details}</small>
          </div>
          <Link href={`/portfolio/${direction.slug}`} className="text-link">
            See this installation <ArrowIcon />
          </Link>
          <Link href="/contact" className="button-primary">
            Make it yours <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
