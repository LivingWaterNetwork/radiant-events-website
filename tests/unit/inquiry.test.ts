import { afterEach, describe, expect, it, vi } from "vitest";
import { inquirySchema, formatInquiryEmail } from "@/lib/inquiry";
import { getMailConfig, sendMail } from "@/lib/mailer";
import { createRateLimiter } from "@/lib/rate-limit";

const valid = {
  name: "Test Person",
  email: "test@example.org",
  phone: "",
  eventDate: "Spring 2027",
  venueOrCity: "Atlanta",
  guestCount: "50–150",
  eventType: "Birthday or milestone",
  services: ["Balloon & backdrop installations"],
  budget: "",
  inspiration: "",
  message: "A garden birthday with pink balloons.",
  referral: "",
  consent: true,
  website: "",
};

describe("inquiry schema", () => {
  it("accepts a complete inquiry", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it.each(["name", "email", "eventDate", "venueOrCity", "guestCount", "eventType", "message"])("requires %s", (field) => {
    const r = inquirySchema.safeParse({ ...valid, [field]: "" });
    expect(r.success).toBe(false);
    expect(r.error!.issues[0].path[0]).toBe(field);
  });

  it("requires at least one service, from the approved list", () => {
    expect(inquirySchema.safeParse({ ...valid, services: [] }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, services: ["Fireworks"] }).success).toBe(false);
  });

  it("requires consent", () => {
    expect(inquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(inquirySchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("rejects bad email, phone and inspiration link", () => {
    expect(inquirySchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, inspiration: "pinterest" }).success).toBe(false);
  });

  it("keeps budget as optional free text", () => {
    expect(inquirySchema.safeParse({ ...valid, budget: "Around what a backyard party costs" }).success).toBe(true);
  });

  it("escapes HTML in the notification email", () => {
    const r = inquirySchema.parse({ ...valid, message: "<script>alert(1)</script> hello there" });
    expect(formatInquiryEmail(r).html).not.toContain("<script>");
  });
});

describe("mailer", () => {
  afterEach(() => vi.restoreAllMocks());

  it("is unconfigured without key and destination", () => {
    expect(getMailConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(getMailConfig({ RESEND_API_KEY: "k" } as unknown as NodeJS.ProcessEnv)).toBeNull();
  });

  it("reports success only on a 2xx with a message id", async () => {
    const cfg = { apiKey: "k", to: "a@b.c", from: "x <x@y.z>" };
    const msg = { subject: "s", text: "t", html: "h", replyTo: "r@s.t" };
    const ok = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "abc" }), { status: 200 }));
    const noId = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const fail = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "bad" }), { status: 403 }));
    expect((await sendMail(cfg, msg, ok)).ok).toBe(true);
    expect((await sendMail(cfg, msg, noId)).ok).toBe(false);
    expect((await sendMail(cfg, msg, fail)).ok).toBe(false);
    const body = JSON.parse(ok.mock.calls[0][1].body);
    expect(body.reply_to).toBe("r@s.t");
    expect(body.to).toEqual(["a@b.c"]);
  });
});

describe("rate limiter", () => {
  it("allows the limit, then blocks until the window resets", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("ip", 0).allowed).toBe(true);
    expect(check("ip", 1).allowed).toBe(true);
    expect(check("ip", 2).allowed).toBe(false);
    expect(check("ip", 1001).allowed).toBe(true);
  });
});
