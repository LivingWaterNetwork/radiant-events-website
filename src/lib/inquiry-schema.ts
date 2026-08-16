import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  venueOrCity: z.string().trim().optional(),
  guestCount: z.string().optional(),
  servicesOfInterest: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().trim().optional(),
  referral: z.string().optional(),
  consent: z.literal(true, {
    error: "Please confirm we can contact you about your inquiry.",
  }),
  // Honeypot — should stay empty. Bots that fill every field will trip this.
  company: z.string().max(0).optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
