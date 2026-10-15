import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  phone: z.string().trim().max(40).optional(),
  eventType: z.enum(["Milestone celebration", "Shower or intimate gathering", "Wedding", "Brand or community gathering", "Something else"]),
  eventDate: z.string().max(100),
  venueOrCity: z.string().trim().min(2, "Tell us the city or venue.").max(250),
  guestCount: z.string().max(50),
  servicesOfInterest: z.string().min(1, "Choose the support you need.").max(150),
  budget: z.string().min(1, "Choose a range, or ask for guidance.").max(100),
  message: z
    .string()
    .trim()
    .min(10, "Share a little more about your vision.")
    .max(4000),
  referral: z.string().max(150).optional(),
  consent: z.literal(true, {
    error: "Please confirm we can contact you about your inquiry.",
  }),
  // Honeypot — should stay empty. Bots that fill every field will trip this.
  company: z.string().max(0).optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
