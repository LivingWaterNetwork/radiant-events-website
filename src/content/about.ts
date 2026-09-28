// About copy. Source: 03 About. Founder story, portrait and quote are [Coming]:
// leave them undefined and the page renders nothing for them.

export type FounderContent = {
  /** Longer story paragraphs, supplied by Rickya. */
  story?: string[];
  /** Portrait image id from the media manifest, once supplied and processed. */
  portraitId?: string;
  portraitAlt?: string;
  /** Replaces the Home values-moment second line once supplied. */
  quote?: string;
};

export const founder: FounderContent = {};

export const aboutCopy = {
  title: "About",
  intro:
    "Radiant Events Planning plans and designs celebrations that should feel personal, polished, and cared for, from birthdays and weddings to church conferences and gatherings of 5,000 guests. We value how the process feels as much as how the room looks. Our goal isn't only a beautiful space; it's a client who feels present and proud on the day it matters.",
  meet: {
    title: "Meet Rickya",
    opening:
      "Radiant grew from a love of gathering people well and creating beauty with meaning. For founder Rickya Fandino, purpose shapes the design, and gracious service shapes the experience.",
    fallbackImageId: "E03-01",
  },
  pillarsTitle: "How we work",
  pillars: [
    { title: "Gracious", body: "Warm and attentive, never overly familiar." },
    { title: "Assured", body: "Clear recommendations, offered without pressure." },
    { title: "Refined", body: "Elegant without ever sounding distant." },
    { title: "Specific", body: "We name the detail, the benefit, and the next step." },
  ],
  ctaBand: "Let's make something beautiful together.",
};

export function getFounder(): FounderContent {
  return founder;
}
