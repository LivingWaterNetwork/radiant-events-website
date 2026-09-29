// zod/mini keeps the same rules with a much smaller client bundle; this schema
// runs in the browser (react-hook-form) and again on the server route.
import * as z from "zod/mini";
import { inquiryCopy } from "@/content/inquiry";

const e = inquiryCopy.errors;
const text = (max: number, min = 0, minMessage = e.tooLong) =>
  z.string().check(z.trim(), z.maxLength(max, e.tooLong), ...(min ? [z.minLength(min, minMessage)] : []));
const optionalText = (max: number) => z.optional(text(max));
const oneOf = (options: readonly string[], message: string) =>
  z.string().check(z.refine((v) => options.includes(v), { error: message }));
const optionalOneOf = (options: readonly string[]) =>
  z.optional(z.string().check(z.refine((v) => v === "" || options.includes(v), { error: e.tooLong })));

const budget = inquiryCopy.budget.mode === "select" ? optionalOneOf(inquiryCopy.budget.options) : optionalText(120);

export const inquirySchema = z.object({
  name: text(120, 2, e.name),
  email: z.pipe(text(200), z.email({ error: e.email })),
  phone: z.optional(text(40).check(z.refine((v) => v === "" || /^[+()\d\s.-]{7,}$/.test(v), { error: e.phone }))),
  eventDate: text(120, 1, e.eventDate),
  venueOrCity: text(200, 1, e.venueOrCity),
  guestCount: oneOf(inquiryCopy.guestCounts, e.guestCount),
  eventType: oneOf(inquiryCopy.eventTypes, e.eventType),
  services: z.array(oneOf(inquiryCopy.services, e.services)).check(z.minLength(1, e.services)),
  budget,
  inspiration: z.optional(text(500).check(z.refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), { error: e.inspiration }))),
  message: text(5000, 10, e.message),
  referral: optionalOneOf(inquiryCopy.referrals),
  consent: z.literal(true, { error: e.consent }),
  // Honeypot: real visitors never see or fill this.
  website: z.optional(z.string().check(z.maxLength(0))),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

export type InquiryResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; fieldErrors: Record<string, string> }
  | { ok: false; reason: "unavailable" | "rate_limited" | "error" };

export function fieldErrorsFrom(error: { issues: { path: PropertyKey[]; message: string }[] }): Record<string, string> {
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
