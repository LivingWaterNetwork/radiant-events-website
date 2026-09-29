// Global site content. Copy source: 03-APPROVED-WEBSITE-COPY.md (Global, SEO).
// Claims source: 11-CLAIMS-REGISTER.md. Nothing here may be added without a Yes row.

export type NavLink = { href: string; label: string };

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  pinterest?: string;
  tiktok?: string;
};

export type PublicContact = {
  email?: string;
  phone?: string;
};

export type LegalLinks = {
  privacy?: NavLink;
  terms?: NavLink;
};

export const site = {
  name: "Radiant Events Planning",
  shortName: "Radiant Events",
  descriptor: "Atlanta-area event planning & design",
  tagline: "Planning with Purpose. Serving with Grace.",
  url: "https://www.radianteventsplanning.com",
  areaServed: "Atlanta, GA",
  founder: "Rickya Fandino",

  nav: [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/process", label: "Process" },
    { href: "/helpful-reads", label: "Helpful Reads" },
    { href: "/about", label: "About" },
  ] satisfies NavLink[],

  inquiryCta: { href: "/contact", label: "Start Your Event Inquiry" } satisfies NavLink,
  workCta: { href: "/portfolio", label: "Explore Our Work" } satisfies NavLink,

  footer: {
    blurb:
      "Event planning, décor, and custom installations, from intimate celebrations to conferences.",
    serviceArea: "Serving the Atlanta area.",
    copyright: "© 2026 Radiant Events Planning",
  },

  // Open items: render only once real values exist. Leave undefined until supplied.
  social: {} as SocialLinks,
  contact: {} as PublicContact,
  // Privacy and Terms are noindex drafts and stay out of nav/footer until approved.
  legal: {} as LegalLinks,

  skipLink: "Skip to content",
  menuLabels: { open: "Open menu", close: "Close menu", dialog: "Menu" },
  navLabels: { primary: "Primary", mobile: "Mobile", footer: "Footer", servicesOnPage: "Services on this page" },
  stepLabel: "Step",
} as const;

export type PageSeo = { title: string; description: string; path: string };

export const seo = {
  home: {
    title: "Radiant Events Planning · Event Planning & Design in Atlanta",
    description:
      "Event planning, balloon installations, backdrops, and décor for celebrations and conferences across the Atlanta area. Planning with Purpose. Serving with Grace.",
    path: "/",
  },
  services: {
    title: "Services · Radiant Events Planning",
    description:
      "Event planning and coordination, balloon and backdrop installations, event décor, tablescapes, and custom design details.",
    path: "/services",
  },
  portfolio: {
    title: "Portfolio · Radiant Events Planning",
    description:
      "Real celebrations planned and styled by Radiant Events Planning, from Sweet 16 garden parties to ministry gatherings.",
    path: "/portfolio",
  },
  process: {
    title: "Our Process · Radiant Events Planning",
    description:
      "A clear path from your first idea to a beautifully finished event: inquiry, consultation, planning, installation.",
    path: "/process",
  },
  helpfulReads: {
    title: "Helpful Reads · Radiant Events Planning",
    description: "Practical ideas for planning a celebration that looks beautiful and feels like you.",
    path: "/helpful-reads",
  },
  about: {
    title: "About · Radiant Events Planning",
    description:
      "Meet Radiant Events Planning, an Atlanta-area event planning and design studio led by founder Rickya Fandino.",
    path: "/about",
  },
  contact: {
    title: "Start Your Event Inquiry · Radiant Events Planning",
    description:
      "Tell us what you're celebrating. Share your date, venue, and vision, and we'll shape a plan for you.",
    path: "/contact",
  },
} satisfies Record<string, PageSeo>;

export const projectTitleSuffix = " · Radiant Events Planning";

export const notFoundCopy = {
  title: "This page wandered off.",
  body: "The page you're looking for isn't here, but plenty of inspiration is.",
  links: [
    { href: "/portfolio", label: "Explore Our Work" },
    { href: "/contact", label: "Start Your Event Inquiry" },
    { href: "/", label: "Back to Home" },
  ] satisfies NavLink[],
};

/** LocalBusiness JSON-LD with only fields that have real values (11: no address, phone, ratings). */
export function getLocalBusinessJsonLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: site.url,
    areaServed: site.areaServed,
    slogan: site.tagline,
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function getSocialLinks(): NavLink[] {
  const labels: Record<keyof SocialLinks, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    pinterest: "Pinterest",
    tiktok: "TikTok",
  };
  return (Object.keys(labels) as (keyof SocialLinks)[])
    .filter((k) => site.social[k])
    .map((k) => ({ href: site.social[k] as string, label: labels[k] }));
}
