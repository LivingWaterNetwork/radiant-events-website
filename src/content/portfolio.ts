export type PortfolioProject = {
  slug: string;
  title: string;
  category: "Weddings" | "Corporate" | "Private + Social";
  isPlaceholder: true;
  overview: string;
  challenge: string;
  designDirection: string;
  servicesProvided: string[];
};

// All entries below are clearly-labeled placeholders. Real portfolio
// projects, photography, and case-study copy must be supplied by the
// owner — see CONTENT_NEEDED.md. Nothing here should be presented to
// site visitors as a completed, verified project.
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "placeholder-wedding-reception",
    title: "Placeholder — Wedding Reception",
    category: "Weddings",
    isPlaceholder: true,
    overview: "Sample case-study layout pending a real project and photography.",
    challenge: "To be replaced with the actual planning challenge for this event.",
    designDirection: "To be replaced with the actual design concept and palette.",
    servicesProvided: ["Planning + Coordination", "Design + Room Styling"],
  },
  {
    slug: "placeholder-corporate-launch",
    title: "Placeholder — Corporate Launch",
    category: "Corporate",
    isPlaceholder: true,
    overview: "Sample case-study layout pending a real project and photography.",
    challenge: "To be replaced with the actual planning challenge for this event.",
    designDirection: "To be replaced with the actual design concept and palette.",
    servicesProvided: ["Planning + Coordination"],
  },
  {
    slug: "placeholder-milestone-birthday",
    title: "Placeholder — Milestone Birthday",
    category: "Private + Social",
    isPlaceholder: true,
    overview: "Sample case-study layout pending a real project and photography.",
    challenge: "To be replaced with the actual planning challenge for this event.",
    designDirection: "To be replaced with the actual design concept and palette.",
    servicesProvided: ["Signature Installations"],
  },
  {
    slug: "placeholder-garden-ceremony",
    title: "Placeholder — Garden Ceremony",
    category: "Weddings",
    isPlaceholder: true,
    overview: "Sample case-study layout pending a real project and photography.",
    challenge: "To be replaced with the actual planning challenge for this event.",
    designDirection: "To be replaced with the actual design concept and palette.",
    servicesProvided: ["Design + Room Styling"],
  },
];

export function getProjectBySlug(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}
