"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHero from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { inquirySchema, type InquiryFormValues } from "@/lib/inquiry-schema";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  async function onSubmit(values: InquiryFormValues) {
    // TODO: wire to a real email/CRM service (e.g. Resend) once an API key
    // is available — see DEPLOYMENT.md. For now this confirms client-side.
    console.log("Consultation inquiry:", values);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("sent");
  }

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Begin a Consultation"
        subtitle="Tell us a little about your celebration and we'll be in touch within two business days."
        mediaIndex={1}
      />

      <section className="mx-auto max-w-3xl px-6 py-20">
        {status === "sent" ? (
          <Reveal className="text-center py-16">
            <h2 className="font-display text-3xl text-aubergine mb-4">Thank you.</h2>
            <p className="font-sans text-stone">
              Your inquiry has been received. We&rsquo;ll follow up soon to begin planning your
              celebration.
            </p>
          </Reveal>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6" noValidate>
            {/* Honeypot field — hidden from real users, visible to bots */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Full Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  className={inputClass(!!errors.name)}
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass(!!errors.email)}
                  aria-invalid={!!errors.email}
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Phone (optional)">
                <input type="tel" {...register("phone")} className={inputClass(false)} />
              </Field>
              <Field label="Event Date (or flexible timing)">
                <input type="text" placeholder="e.g. Spring 2027, or a specific date" {...register("eventDate")} className={inputClass(false)} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Venue or City">
                <input type="text" {...register("venueOrCity")} className={inputClass(false)} />
              </Field>
              <Field label="Estimated Guest Count">
                <input type="text" {...register("guestCount")} className={inputClass(false)} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Event Type">
                <select {...register("eventType")} className={inputClass(false)}>
                  <option value="">Select...</option>
                  {siteConfig.eventTypes.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Services of Interest">
                <select {...register("servicesOfInterest")} className={inputClass(false)}>
                  <option value="">Select...</option>
                  {siteConfig.servicesOfInterest.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Budget Range">
                <select {...register("budget")} className={inputClass(false)}>
                  <option value="">Select...</option>
                  {siteConfig.budgetRanges.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="How did you hear about us?">
                <select {...register("referral")} className={inputClass(false)}>
                  <option value="">Select...</option>
                  {siteConfig.referralSources.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Tell us about your celebration">
              <textarea
                rows={5}
                {...register("message")}
                className={inputClass(false)}
                placeholder="Your vision, or anything else we should know..."
              />
            </Field>

            <div>
              <label className="flex items-start gap-3 font-sans text-sm text-ink">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="mt-1"
                  aria-invalid={!!errors.consent}
                />
                <span>
                  I consent to {siteConfig.name} contacting me about my inquiry. *
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1 font-sans text-xs text-coral">{errors.consent.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="justify-self-center rounded-full bg-aubergine px-10 py-4 font-sans uppercase tracking-wide-lg text-sm text-cream-light hover:bg-ink-deep transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        )}
      </section>

      <section className="bg-cream px-6 py-16 text-center font-sans text-sm text-stone">
        <p>{siteConfig.location}</p>
        {siteConfig.hasContactInfo && siteConfig.contact.email && <p>{siteConfig.contact.email}</p>}
      </section>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-sm border bg-cream-light px-4 py-3 font-sans text-sm text-ink focus:outline-none ${
    hasError ? "border-coral" : "border-taupe focus:border-aubergine"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-sans text-xs uppercase tracking-wide-lg text-aubergine mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 font-sans text-xs text-coral">{error}</p>}
    </div>
  );
}
