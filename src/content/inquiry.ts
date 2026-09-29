// Inquiry form copy and options. Source: 03 Contact / Inquiry.
// Budget is an open item: free text for now; switch `budget.mode` to "select" and
// supply `options` once Rickya provides ranges. No values are hard-coded.

export type BudgetFieldConfig =
  | { mode: "text"; label: string; hint?: string }
  | { mode: "select"; label: string; hint?: string; options: string[] };

export const inquiryCopy = {
  title: "Start Your Event Inquiry",
  intro:
    "Tell us what you're celebrating and what you'd love to create. We'll reply personally within two business days.",
  requiredNote: "Fields marked “required” must be filled in.",
  requiredMark: "required",
  optionalMark: "optional",
  submit: "Send My Inquiry",
  submitting: "Sending…",
  success: {
    title: "Thank you. Your inquiry is on its way.",
    body: "We'll review your details and reply personally. This isn't a booking confirmation yet; your date is reserved once your proposal is approved.",
  },
  error: "Something went wrong sending your inquiry. Please try again in a moment.",
  unavailable: "Inquiries are temporarily unavailable. Please try again soon.",
  rateLimited: "Too many inquiries were sent from this connection. Please wait a few minutes and try again.",
  errorSummary: "Please check the highlighted fields.",
  labels: {
    name: "Full name",
    email: "Email",
    phone: "Phone",
    eventDate: "Event date or timing",
    venueOrCity: "Venue or city",
    guestCount: "Estimated guest count",
    eventType: "Event type",
    services: "Services of interest",
    inspiration: "Inspiration link",
    message: "Tell us about your celebration",
    referral: "How did you hear about us?",
    consent: "I agree to Radiant Events Planning contacting me about this inquiry.",
    honeypot: "Leave this field empty",
  },
  selectPrompt: "Choose one",
  guestCounts: ["Under 50", "50–150", "150–500", "500–1,000", "1,000+"],
  eventTypes: [
    "Birthday or milestone",
    "Wedding or engagement",
    "Shower (baby or bridal)",
    "Church conference or ministry event",
    "Corporate, brand or author event",
    "Holiday or community gathering",
    "Other",
  ],
  services: [
    "Event planning & coordination",
    "Balloon & backdrop installations",
    "Event décor & styling",
    "Tablescapes",
    "Custom design details",
    "Not sure yet",
  ],
  referrals: ["Instagram", "Referral", "Google", "Church or ministry", "Other"],
  errors: {
    name: "Please enter your full name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    eventDate: "Please share your event date or timing.",
    venueOrCity: "Please share your venue or city.",
    guestCount: "Please choose an estimated guest count.",
    eventType: "Please choose an event type.",
    services: "Please choose at least one service.",
    inspiration: "Please enter a full link, starting with http:// or https://.",
    message: "Please tell us a little about your celebration.",
    consent: "Please confirm we can contact you about this inquiry.",
    tooLong: "Please shorten this answer.",
  },
  budget: { mode: "text", label: "Budget range" } as BudgetFieldConfig,
};
