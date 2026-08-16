export type ServiceDetail = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  idealFor: string;
  outcomes: string[];
  includes: string[];
  process: string[];
  faq: { question: string; answer: string }[];
};

export const services: ServiceDetail[] = [
  {
    slug: "planning-coordination",
    title: "Planning + Coordination",
    tagline: "Calm leadership behind the scenes.",
    summary:
      "From save-the-date to send-off, we build the timeline, manage the vendor team, and hold every logistical thread so you don't have to.",
    idealFor:
      "Hosts who want a trusted partner to manage logistics — whether from the very first booking or starting a month out from the event.",
    outcomes: [
      "A clear, protected timeline everyone actually follows",
      "A vendor team that communicates through one point of contact",
      "A day that runs on schedule without you managing it",
    ],
    includes: [
      "Full-service planning, from concept through event day",
      "Month-of / day-of coordination",
      "Vendor sourcing, contracting, and management",
      "Budget tracking and timeline management",
      "On-site lead coordination and run-of-show",
    ],
    process: [
      "Initial consultation to understand your vision and scope",
      "Planning framework and vendor recommendations",
      "Ongoing check-ins as details are confirmed",
      "Final walkthrough and timeline lock",
      "On-site coordination on the day itself",
    ],
    faq: [
      {
        question: "How far in advance should we book?",
        answer:
          "Full-service planning works best starting 9–12 months out; month-of coordination is typically booked 4–6 weeks before the event.",
      },
      {
        question: "Do you work with our existing vendors?",
        answer:
          "Yes. We're happy to coordinate with vendors you've already booked, or recommend trusted partners from our network.",
      },
    ],
  },
  {
    slug: "design-room-styling",
    title: "Design + Room Styling",
    tagline: "The room, resolved.",
    summary:
      "We develop a concept and palette specific to your celebration and carry it through every surface — florals, linens, lighting, and layout — into one cohesive, elevated space.",
    idealFor:
      "Clients who have a venue and vision but want a designer's eye to unify the details into one considered look.",
    outcomes: [
      "A cohesive design language across every surface in the room",
      "A floor plan that supports both flow and photography",
      "A space that photographs as intentionally as it feels in person",
    ],
    includes: [
      "Concept development and mood boards",
      "Color palette and material selection",
      "Floor plans and room layout design",
      "Floral, linen, and rental sourcing",
      "On-site styling and final walkthrough",
    ],
    process: [
      "Design consultation and inspiration review",
      "Concept presentation with palette and mood board",
      "Vendor and rental sourcing against the approved concept",
      "On-site styling and final detail pass before guest arrival",
    ],
    faq: [
      {
        question: "Can this be paired with planning services?",
        answer:
          "Yes — many clients combine design with full planning. It can also stand alone if you're managing logistics yourself.",
      },
      {
        question: "Do you provide rentals directly?",
        answer:
          "We source and manage rentals through our trusted vendor network rather than holding inventory ourselves.",
      },
    ],
  },
  {
    slug: "signature-installations",
    title: "Signature Installations",
    tagline: "One striking moment, built to spec.",
    summary:
      "For clients who need a single showpiece rather than full planning — a balloon installation, a luxury tablescape, dramatic draping, or a custom backdrop, designed and installed with precision.",
    idealFor:
      "Clients who have a planner already, or need one exceptional focal moment rather than full-scope design.",
    outcomes: [
      "A single, photograph-ready focal moment",
      "Professional installation and clean breakdown",
      "A custom piece built to your event's exact dimensions and palette",
    ],
    includes: [
      "Balloon installations and sculptural pieces",
      "Luxury tablescapes and place settings",
      "Draping and room transformation",
      "Custom backdrops and photo moments",
      "Delivery, install, and breakdown",
    ],
    process: [
      "Scope and site details confirmed (dimensions, access, timing)",
      "Concept and material approval",
      "Installation ahead of guest arrival",
      "Same-day or next-day breakdown",
    ],
    faq: [
      {
        question: "How much lead time do installations need?",
        answer:
          "Most signature installations are booked 3–6 weeks out, depending on materials and scale.",
      },
      {
        question: "Can you install at any venue?",
        answer:
          "In most cases, yes — we'll confirm venue access, load-in timing, and any restrictions during scoping.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
