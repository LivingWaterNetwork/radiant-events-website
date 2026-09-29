// Services content. Source: 03 Services + Home "What we do"; status: 02-SERVICE-TRUTH-MATRIX.md.
// Image pairings: 06-ASSET-MANIFEST.md "Suggested Services-page images".

export type Service = {
  id: string;
  title: string;
  /** Home "What we do" card copy. */
  cardSummary: string;
  lede: string;
  deliverables: string[];
  imageId: string;
};

export const services: Service[] = [
  {
    id: "planning-coordination",
    title: "Event Planning & Coordination",
    cardSummary:
      "Full planning or focused coordination, with timelines, vendors, and event-day details held with calm and care.",
    lede: "Calm leadership behind the scenes, whether it's a family milestone or a multi-day conference.",
    deliverables: [
      "Full-service planning, from concept through event day",
      "Partial planning and month-of or day-of coordination",
      "Timelines, run-of-show, and vendor coordination",
      "Event-day management and on-site direction",
    ],
    imageId: "E03-01",
  },
  {
    id: "balloon-backdrop-installations",
    title: "Balloon & Backdrop Installations",
    cardSummary:
      "Organic arches, garlands, columns, and backdrops, designed for your space and built on site.",
    lede: "Organic balloon arches, garlands, and columns, plus custom backdrops, designed in your colors and installed on site.",
    deliverables: [
      "Arches, garlands, and columns",
      "Ribbon-fringe, shimmer-wall, and floral backdrops",
      "Photo moments and entry statements",
    ],
    imageId: "E01-05",
  },
  {
    id: "event-decor-styling",
    title: "Event Décor & Styling",
    cardSummary: "Tablescapes, florals, draping, and styled details that tie the whole room together.",
    lede: "Tablescapes, florals, draping, and styled details that carry your theme through every surface.",
    deliverables: [
      "Tablescapes and place settings",
      "Floral styling and flower walls",
      "Draping and room transformation",
      "Signage styling and themed accents",
    ],
    imageId: "E04-02",
  },
  {
    id: "custom-design-details",
    title: "Custom Design Details",
    cardSummary: "Signage, themed accents, and one-of-a-kind touches made for your celebration.",
    lede: "Something specific in mind? We love a creative brief. Tell us the idea and we'll bring it to life.",
    deliverables: [],
    imageId: "E02-01",
  },
];

export const servicesCopy = {
  intro: {
    title: "Planning, design, and installations, together or on their own.",
    body: "Choose the support you need, or combine services into one considered experience. Tell us what you have in mind, and we'll shape a plan for your date, venue, and priorities.",
  },
  quoteCta: "Request a Custom Quote",
  included: {
    title: "What's included",
    body: "Delivery, setup, and installation are included. Takedown or pickup is provided when included in your approved proposal.",
  },
  faqTitle: "Questions we're often asked",
  faq: [
    {
      q: "How does pricing work?",
      a: "Every event is quoted to your date, venue, guest count, and scope, so there are no fixed packages. Share your details and a budget range, and we'll recommend what fits.",
    },
    {
      q: "Can I combine services?",
      a: "Yes. Many clients pair planning with design and installations, and any service can also stand alone.",
    },
    {
      q: "Do you handle large events?",
      a: "Yes. We've supported everything from intimate gatherings to church conferences and events of 5,000 guests.",
    },
    { q: "Do you do weddings?", a: "Yes. Tell us about your date, venue, and vision." },
    {
      q: "Where do you work?",
      a: "We're based in the Atlanta area. Share your location and we'll confirm availability.",
    },
  ],
};

export function getServices() {
  return services;
}

export function getServiceById(id: string) {
  return services.find((s) => s.id === id);
}

/** Old /services/:slug sub-pages → anchors on /services. */
export const legacyServiceRedirects: Record<string, string> = {
  "planning-coordination": "planning-coordination",
  "design-room-styling": "event-decor-styling",
  "signature-installations": "balloon-backdrop-installations",
};
