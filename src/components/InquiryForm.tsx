"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquiryCopy as c } from "@/content/inquiry";
import { inquirySchema, type Inquiry, type InquiryInput, type InquiryResult } from "@/lib/inquiry";

type Status = "idle" | "sent" | "unavailable" | "error" | "rate_limited";

const inputBase =
  "mt-2 block min-h-11 w-full border bg-white px-4 py-3 text-base text-ink focus:border-olive-deep focus:outline-2 focus:outline-offset-0 focus:outline-olive-deep";

function Label({ htmlFor, text, required }: { htmlFor: string; text: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
      {text} <span className="font-normal text-olive-deep">({required ? c.requiredMark : c.optionalMark})</span>
    </label>
  );
}

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<InquiryInput, unknown, Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { services: [], consent: undefined as unknown as true, website: "" },
    shouldFocusError: false,
  });

  const errorEntries = Object.entries(errors).filter(([, v]) => v?.message) as [string, { message?: string }][];

  async function onSubmit(values: Inquiry) {
    setStatus("idle");
    let result: InquiryResult;
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      result = (await res.json()) as InquiryResult;
    } catch {
      result = { ok: false, reason: "error" };
    }
    if (result.ok) {
      setStatus("sent");
    } else if (result.reason === "invalid") {
      for (const [k, message] of Object.entries(result.fieldErrors)) {
        setError(k as keyof InquiryInput, { message });
      }
      if (!Object.keys(result.fieldErrors).length) setStatus("error");
    } else {
      setStatus(result.reason);
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  function onInvalid() {
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  if (status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t-2 border-olive bg-white p-8 focus:outline-none md:p-12">
        <h2 className="h-display text-3xl">{c.success.title}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink">{c.success.body}</p>
      </div>
    );
  }

  const describedBy = (name: string, hint?: boolean) =>
    [hint ? `${name}-hint` : null, errors[name as keyof typeof errors] ? `${name}-error` : null].filter(Boolean).join(" ") || undefined;

  const fieldError = (name: keyof InquiryInput) =>
    errors[name]?.message ? (
      <p id={`${name}-error`} className="mt-2 text-sm font-medium text-[#8a2c1f]">
        {String(errors[name]?.message)}
      </p>
    ) : null;


  const border = (name: keyof InquiryInput) => (errors[name] ? "border-[#8a2c1f]" : "border-taupe");
  const b = c.budget;

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit, onInvalid)(e)} noValidate className="grid gap-7" aria-describedby="required-note">
      <p id="required-note" className="text-sm text-ink">
        {c.requiredNote}
      </p>

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="focus:outline-none">
        {status !== "idle" && (
          <p role="alert" className="border-l-2 border-[#8a2c1f] bg-white px-5 py-4 text-ink">
            {status === "unavailable" ? c.unavailable : status === "rate_limited" ? c.rateLimited : c.error}
          </p>
        )}
      </div>

      {submitCount > 0 && errorEntries.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-l-2 border-[#8a2c1f] bg-white px-5 py-4 focus:outline-none">
          <p className="font-medium text-ink">{c.errorSummary}</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {errorEntries.map(([k, v]) => (
              <li key={k}>
                <a href={`#${k === "services" ? "services-0" : k}`} className="text-[#8a2c1f] underline underline-offset-2">
                  {v.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot — hidden from people and assistive tech. */}
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">{c.labels.honeypot}</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" text={c.labels.name} required />
          <input id="name" autoComplete="name" aria-required="true" aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={`${inputBase} ${border("name")}`} {...register("name")} />
          {fieldError("name")}
        </div>
        <div>
          <Label htmlFor="email" text={c.labels.email} required />
          <input id="email" type="email" autoComplete="email" aria-required="true" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={`${inputBase} ${border("email")}`} {...register("email")} />
          {fieldError("email")}
        </div>
        <div>
          <Label htmlFor="phone" text={c.labels.phone} />
          <input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={`${inputBase} ${border("phone")}`} {...register("phone")} />
          {fieldError("phone")}
        </div>
        <div>
          <Label htmlFor="eventDate" text={c.labels.eventDate} required />
          <input id="eventDate" aria-required="true" aria-invalid={!!errors.eventDate} aria-describedby={describedBy("eventDate")} className={`${inputBase} ${border("eventDate")}`} {...register("eventDate")} />
          {fieldError("eventDate")}
        </div>
        <div>
          <Label htmlFor="venueOrCity" text={c.labels.venueOrCity} required />
          <input id="venueOrCity" autoComplete="address-level2" aria-required="true" aria-invalid={!!errors.venueOrCity} aria-describedby={describedBy("venueOrCity")} className={`${inputBase} ${border("venueOrCity")}`} {...register("venueOrCity")} />
          {fieldError("venueOrCity")}
        </div>
        <div>
          <Label htmlFor="guestCount" text={c.labels.guestCount} required />
          <select id="guestCount" defaultValue="" aria-required="true" aria-invalid={!!errors.guestCount} aria-describedby={describedBy("guestCount")} className={`${inputBase} ${border("guestCount")}`} {...register("guestCount")}>
            <option value="" disabled>
              {c.selectPrompt}
            </option>
            {c.guestCounts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {fieldError("guestCount")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="eventType" text={c.labels.eventType} required />
          <select id="eventType" defaultValue="" aria-required="true" aria-invalid={!!errors.eventType} aria-describedby={describedBy("eventType")} className={`${inputBase} ${border("eventType")}`} {...register("eventType")}>
            <option value="" disabled>
              {c.selectPrompt}
            </option>
            {c.eventTypes.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {fieldError("eventType")}
        </div>
      </div>

      <fieldset aria-describedby={errors.services ? "services-error" : undefined}>
        <legend className="text-sm font-medium text-ink">
          {c.labels.services} <span className="font-normal text-olive-deep">({c.requiredMark})</span>
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {c.services.map((s, i) => (
            <label key={s} htmlFor={`services-${i}`} className="flex min-h-11 cursor-pointer items-center gap-3 border border-taupe bg-white px-4 py-2 text-ink">
              <input id={`services-${i}`} type="checkbox" value={s} className="h-5 w-5 accent-olive" {...register("services")} />
              {s}
            </label>
          ))}
        </div>
        {fieldError("services")}
      </fieldset>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <Label htmlFor="budget" text={b.label} />
          {b.mode === "select" ? (
            <select id="budget" defaultValue="" aria-describedby={describedBy("budget", !!b.hint)} className={`${inputBase} ${border("budget")}`} {...register("budget")}>
              <option value="">{c.selectPrompt}</option>
              {b.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input id="budget" aria-describedby={describedBy("budget", !!b.hint)} className={`${inputBase} ${border("budget")}`} {...register("budget")} />
          )}
          {b.hint && (
            <p id="budget-hint" className="mt-2 text-sm text-ink">
              {b.hint}
            </p>
          )}
          {fieldError("budget")}
        </div>
        <div>
          <Label htmlFor="inspiration" text={c.labels.inspiration} />
          <input id="inspiration" type="url" inputMode="url" aria-invalid={!!errors.inspiration} aria-describedby={describedBy("inspiration")} className={`${inputBase} ${border("inspiration")}`} {...register("inspiration")} />
          {fieldError("inspiration")}
        </div>
      </div>

      <div>
        <Label htmlFor="message" text={c.labels.message} required />
        <textarea id="message" rows={6} aria-required="true" aria-invalid={!!errors.message} aria-describedby={describedBy("message")} className={`${inputBase} ${border("message")}`} {...register("message")} />
        {fieldError("message")}
      </div>

      <div className="sm:max-w-sm">
        <Label htmlFor="referral" text={c.labels.referral} />
        <select id="referral" defaultValue="" className={`${inputBase} border-taupe`} {...register("referral")}>
          <option value="">{c.selectPrompt}</option>
          {c.referrals.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-ink">
          <input
            id="consent"
            type="checkbox"
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 h-5 w-5 shrink-0 accent-olive"
            {...register("consent")}
          />
          <span>
            {c.labels.consent} <span className="text-olive-deep">({c.requiredMark})</span>
          </span>
        </label>
        {fieldError("consent")}
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-70">
          {isSubmitting ? c.submitting : c.submit}
        </button>
      </div>
    </form>
  );
}
