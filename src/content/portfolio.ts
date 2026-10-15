export type PortfolioProject = {
  slug: string;
  title: string;
  category: "Balloons + Backdrops" | "Styled Moments";
  image: string;
  alt: string;
  gallery: string[];
  overview: string;
  challenge: string;
  designDirection: string;
  servicesProvided: string[];
};
// Authentic photographs supplied in Radiant Events Planning/Balloons. Descriptions cover visible design; no invented clients, venues, or outcomes.
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "pink-balloon-circle",
    title: "A Moment in Pink",
    category: "Balloons + Backdrops",
    image: "/images/pink-arch.webp",
    alt: "Pink balloon clusters framing a gold circular backdrop",
    gallery: ["/images/pink-arch.webp"],
    overview:
      "Soft pink meets a sculptural silhouette. An open circular frame gives this balloon installation a light, playful presence.",
    challenge:
      "Create a defined focal moment while keeping the center open for photographs.",
    designDirection:
      "Pink balloons in varied sizes, gathered asymmetrically around a slender gold circle.",
    servicesProvided: ["Balloon installation", "Circular backdrop styling"],
  },
  {
    slug: "colorful-sequin-backdrop",
    title: "Color, Confetti & Joy",
    category: "Balloons + Backdrops",
    image: "/images/colorful-backdrop.webp",
    alt: "Turquoise and lime balloon clusters beside a purple sequin backdrop",
    gallery: ["/images/colorful-backdrop.webp", "/images/colorful-detail.webp"],
    overview:
      "A bright palette with a little shimmer. Turquoise and lime balloon clusters frame a purple focal wall for a playful, energetic setting.",
    challenge:
      "Bring several bold colors together in one coordinated photo moment.",
    designDirection:
      "Turquoise and lime contrast against purple panels and a reflective sequin surface.",
    servicesProvided: ["Balloon installation", "Backdrop styling"],
  },
  {
    slug: "game-night-balloon-moment",
    title: "Let the Games Begin",
    category: "Styled Moments",
    image: "/images/game-night.webp",
    alt: "Purple, pink, black and silver balloons with oversized dice at a game night display",
    gallery: ["/images/game-night.webp", "/images/game-night-detail.webp"],
    overview:
      "A celebration with personality. Rich purple, pink, black, and silver balloons pair with playful oversized dice and a themed welcome moment.",
    challenge:
      "Make the entrance feel like part of the celebration, with a theme visitors recognize at a glance.",
    designDirection:
      "A vertical balloon composition and graphic game-inspired accents keep the focal area expressive and cohesive.",
    servicesProvided: ["Balloon installation", "Themed focal-area styling"],
  },
];
export function getProjectBySlug(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}
