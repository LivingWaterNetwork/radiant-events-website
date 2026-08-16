export const siteConfig = {
  name: "Radiant Events",
  location: "Atlanta, Georgia",
  tagline: "Planning with Purpose. Serving with Grace.",
  positioning: "Beauty without the burden.",
  oneLiner:
    "Intentional event planning and elevated design for celebrations that feel personal, polished, and effortless.",
  url: "https://radianteventsatl.com",

  // No verified contact details were supplied with the brand package.
  // Fill these in and flip hasContactInfo to true once real values exist.
  hasContactInfo: false,
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },

  // No social handles were supplied.
  social: {
    instagram: null as string | null,
    pinterest: null as string | null,
    facebook: null as string | null,
  },

  // No real client testimonials were supplied — keep this off until
  // genuine, attributable quotes are provided.
  showTestimonials: false,

  // No confirmed starting prices were supplied.
  showPricing: false,

  primaryCta: "Begin a Consultation",
  secondaryCta: "Explore Our Work",

  nav: [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/process", label: "Process" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "About" },
  ],

  footerLegal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],

  budgetRanges: [
    "Under $10,000",
    "$10,000 – $25,000",
    "$25,000 – $50,000",
    "$50,000+",
  ],

  eventTypes: [
    "Wedding",
    "Corporate Event",
    "Private / Social Celebration",
    "Other",
  ],

  servicesOfInterest: [
    "Planning + Coordination",
    "Design + Room Styling",
    "Signature Installations",
    "Not sure yet",
  ],

  referralSources: [
    "Instagram",
    "Pinterest",
    "Google Search",
    "Referral from a friend or vendor",
    "Other",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
