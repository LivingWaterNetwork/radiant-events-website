import { z } from "zod";
import { inquiryCopy } from "@/content/inquiry";

const e = inquiryCopy.errors;
const text = (max: number) => z.string().trim().max(max, e.tooLong);
const optionalText = (max: number) => text(max).optional().or(z.literal(""));
const oneOf = (options: readonly string[], message: string) =>
  z.string().refine((v) => options.includes(v), { message });

const budget =
  inquiryCopy.budget.mode === "select"
    ? z.union([z.literal(""), oneOf(inquiryCopy.budget.options, e.tooLong)]).optional()
    : optionalText(120);

export const inquirySchema = z.object({
  name: text(120).min(2, e.name),
  email: text(200).pipe(z.email(e.email)),
  phone: z
    .string()
    .trim()
    .max(40, e.tooLong)
    .refine((v) => v === "" || /^[+()\d\s.-]{7,}$/.test(v), e.phone)
    .optional(),
  eventDate: text(120).min(1, e.eventDate),
  venueOrCity: text(200).min(1, e.venueOrCity),
  guestCount: oneOf(inquiryCopy.guestCounts, e.guestCount),
  eventType: oneOf(inquiryCopy.eventTypes, e.eventType),
  services: z.array(oneOf(inquiryCopy.services, e.services)).min(1, e.services),
  budget,
  inspiration: z
    .string()
    .trim()
    .max(500, e.tooLong)
    .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), e.inspiration)
    .optional(),
  message: text(5000).min(10, e.message),
  referral: z.union([z.literal(""), oneOf(inquiryCopy.referrals, e.tooLong)]).optional(),
  consent: z.literal(true, { error: e.consent }),
  // Honeypot: real visitors never see or fill this.
  website: z.string().max(0).optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

export type InquiryResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; fieldErrors: Record<string, string> }
  | { ok: false; reason: "unavailable" | "rate_limited" | "error" };

export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function formatInquiryEmail(i: Inquiry) {
  const L = inquiryCopy.labels;
  const rows: [string, string][] = [
    [L.name, i.name],
    [L.email, i.email],
    [L.phone, i.phone || "—"],
    [L.eventDate, i.eventDate],
    [L.venueOrCity, i.venueOrCity],
    [L.guestCount, i.guestCount],
    [L.eventType, i.eventType],
    [L.services, i.services.join(", ")],
    [inquiryCopy.budget.label, i.budget || "—"],
    [L.inspiration, i.inspiration || "—"],
    [L.referral, i.referral || "—"],
    [L.message, i.message],
  ];
  const subject = `New event inquiry: ${i.eventType} · ${i.name}`;
  const textBody = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top" style="color:#4A5539">${escape(k)}</th><td style="white-space:pre-wrap">${escape(v)}</td></tr>`,
    )
    .join("")}</table>`;
  return { subject, text: textBody, html };
}
