// Portfolio content. Source: 04-PORTFOLIO-REGISTRY.csv (rank order), 03 Portfolio copy.
import { getImage, getImages, getVideo, getVideos, type ImageAsset, type VideoAsset } from "./media";

export const eventTypes = [
  "Birthdays & Milestones",
  "Weddings",
  "Ministry & Conferences",
  "Brand & Author Events",
  "Dinners & Tablescapes",
] as const;

export type EventType = (typeof eventTypes)[number];

export type Project = {
  id: string;
  slug: string;
  title: string;
  eventType: EventType;
  servicesDelivered: string[];
  heroAsset: string;
  galleryAssets: string[];
  videoAssets: string[];
  /** Posters from these videos may stand in as the hero still. */
  heroFromVideo?: string;
  locationNote?: string;
  featuredOnHome?: number;
  designStory: string;
  published: boolean;
  rank: number;
};

export const projects: Project[] = [
  {
    id: "E01",
    slug: "pink-sweet-16-garden-celebration",
    title: "A Pink Sweet 16 Garden Celebration",
    eventType: "Birthdays & Milestones",
    servicesDelivered: [
      "Organic balloon hoop arch",
      "Pink and white ribbon-fringe backdrop",
      "Balloon accents along the balcony",
      "Styled cocktail tables",
    ],
    heroAsset: "E01-01",
    // Registry order; E01-02 is withheld because an identifiable person is visible behind the arch.
    galleryAssets: ["E01-01", "E01-03", "E01-05", "E01-07", "E01-04", "E01-06", "E01-09", "E01-08"],
    videoAssets: ["E01-V1", "E01-V2"],
    locationNote: "A private residence in the Atlanta area",
    featuredOnHome: 1,
    designStory:
      "Sixteen deserved a moment. We built an organic balloon arch in layered shades of pink, softened it with a ribbon-fringe backdrop, and carried the color up to the balcony so the whole garden felt like part of the celebration.",
    published: true,
    rank: 1,
  },
  {
    id: "E03",
    slug: "guest-experience-ministry-backdrop",
    title: "A Welcome Wall for a Ministry Gathering",
    eventType: "Ministry & Conferences",
    servicesDelivered: [
      "Teal and lime organic balloon garlands",
      "Purple sequin shimmer wall",
      "Custom panel",
    ],
    heroAsset: "E03-01",
    galleryAssets: ["E03-01", "E03-02", "E03-03"],
    videoAssets: ["E03-V1"],
    featuredOnHome: 2,
    designStory:
      "A bright, welcoming photo moment for a ministry gathering: playful teal and lime garlands framing a shimmering purple wall, designed to greet guests the moment they walked in.",
    published: true,
    rank: 2,
  },
  {
    id: "E02",
    slug: "level-29-game-night",
    title: "Level 29: A Game Night Birthday",
    eventType: "Birthdays & Milestones",
    servicesDelivered: [
      "Balloon column in black, silver, purple and pink",
      "Playing-card accents",
      "Oversized dice",
      "Welcome sign styling",
    ],
    heroAsset: "E02-01",
    galleryAssets: ["E02-01", "E02-02"],
    videoAssets: ["E02-V1"],
    featuredOnHome: 3,
    designStory:
      "For a 29th-birthday game night, the welcome did the talking: a bold balloon column dealt with playing cards, stacked oversized dice, and a sign that set the tone before the first round.",
    published: true,
    rank: 3,
  },
  {
    id: "E04",
    slug: "she-rose-author-event",
    title: "She Rose: An Author Celebration",
    eventType: "Brand & Author Events",
    servicesDelivered: ["Event décor and styling: tables, signage styling, floral wall backdrop"],
    heroAsset: "E04-01",
    galleryAssets: ["E04-01", "E04-02", "E04-03", "E04-04"],
    videoAssets: [],
    designStory:
      "A vivid pink celebration for an author event: sequin-draped tables, arched signage, and a lush rose wall made for photos.",
    published: true,
    rank: 4,
  },
  {
    id: "E05",
    slug: "candlelit-tablescape",
    title: "A Candlelit Tablescape",
    eventType: "Dinners & Tablescapes",
    servicesDelivered: ["Tablescape design: linens, taper candles, chargers and place settings"],
    heroAsset: "E05-V1",
    heroFromVideo: "E05-V1",
    galleryAssets: [],
    videoAssets: ["E05-V1"],
    designStory:
      "An evening table set for lingering: rich linens, tall taper candles and layered place settings that glow as the light goes down.",
    published: true,
    rank: 5,
  },
];

export const portfolioCopy = {
  intro: {
    title: "Celebrations we've brought to life.",
    body: "A closer look at the details behind each event, from custom backdrops and balloon installations to styled rooms and full events.",
  },
  allFilter: "All",
  filterLabel: "Filter projects by event type",
  whatWeDid: "What we did",
  gallery: "Gallery",
  video: "On site",
  closing: { text: "Planning something similar?", cta: "Start Your Event Inquiry" },
  viewProject: "View project",
  galleryLabels: {
    open: "Open image",
    dialog: "Project gallery",
    close: "Close gallery",
    prev: "Previous image",
    next: "Next image",
    counter: "Image {i} of {n}",
  },
  location: "Location",
  back: "All projects",
};

export type HeroMedia =
  | { kind: "image"; image: ImageAsset }
  | { kind: "poster"; video: VideoAsset };

export type ResolvedProject = Project & {
  hero: HeroMedia;
  gallery: ImageAsset[];
  videos: VideoAsset[];
  summary: string;
};

function firstSentence(text: string) {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

function resolveHero(p: Project): HeroMedia | undefined {
  const img = getImage(p.heroAsset);
  if (img) return { kind: "image", image: img };
  if (p.heroFromVideo) {
    const v = getVideo(p.heroFromVideo);
    if (v) return { kind: "poster", video: v };
  }
  // Fall back to the first exported gallery image.
  const first = getImages(p.galleryAssets)[0];
  return first ? { kind: "image", image: first } : undefined;
}

function resolve(p: Project): ResolvedProject | undefined {
  const hero = resolveHero(p);
  if (!hero) return undefined;
  return {
    ...p,
    hero,
    gallery: getImages(p.galleryAssets),
    videos: getVideos(p.videoAssets),
    summary: firstSentence(p.designStory),
  };
}

/** Published projects that have real media, in registry rank order. */
export function getPublishedProjects(source: Project[] = projects): ResolvedProject[] {
  return source
    .filter((p) => p.published)
    .sort((a, b) => a.rank - b.rank)
    .map(resolve)
    .filter((p): p is ResolvedProject => Boolean(p));
}

export function getFeaturedProjects(source: Project[] = projects): ResolvedProject[] {
  return getPublishedProjects(source)
    .filter((p) => p.featuredOnHome)
    .sort((a, b) => (a.featuredOnHome ?? 0) - (b.featuredOnHome ?? 0));
}

export function getProjectBySlug(slug: string, source: Project[] = projects) {
  return getPublishedProjects(source).find((p) => p.slug === slug);
}

/** "All" plus one tab per event type that has at least one published project, in canonical order. */
export function getPortfolioFilters(source: Project[] = projects): string[] {
  const present = new Set(getPublishedProjects(source).map((p) => p.eventType));
  return [portfolioCopy.allFilter, ...eventTypes.filter((t) => present.has(t))];
}

export { filterSlug } from "@/lib/slug";
