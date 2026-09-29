import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const valid = {
  name: "Test Person", email: "test@example.org", eventDate: "Spring 2027", venueOrCity: "Atlanta",
  guestCount: "50–150", eventType: "Birthday or milestone", services: ["Tablescapes"],
  message: "A candlelit dinner for twelve.", consent: true, website: "",
};

const post = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/inquiry", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });

describe("POST /api/inquiry", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("answers 503 unavailable when delivery isn't configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const { POST } = await import("@/app/api/inquiry/route");
    const res = await POST(post(valid));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, reason: "unavailable" });
  });

  it("returns field errors for an invalid payload", async () => {
    const { POST } = await import("@/app/api/inquiry/route");
    const res = await POST(post({ ...valid, email: "x" }, "2.2.2.2"));
    expect(res.status).toBe(400);
    expect((await res.json()).fieldErrors.email).toBeTruthy();
  });

  it("never reports success for a honeypot hit", async () => {
    const { POST } = await import("@/app/api/inquiry/route");
    const res = await POST(post({ ...valid, website: "bot" }, "3.3.3.3"));
    expect(res.status).toBe(400);
  });

  it("succeeds only when the provider confirms, and rate-limits bursts", async () => {
    vi.stubEnv("RESEND_API_KEY", "k");
    vi.stubEnv("INQUIRY_NOTIFICATION_EMAIL", "owner@example.org");
    const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ id: "m1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { POST } = await import("@/app/api/inquiry/route");
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(post(valid, "4.4.4.4"))).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);

    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ message: "nope" }), { status: 500 }));
    const failed = await POST(post(valid, "5.5.5.5"));
    expect(failed.status).toBe(502);
    expect((await failed.json()).ok).toBe(false);
  });
});
