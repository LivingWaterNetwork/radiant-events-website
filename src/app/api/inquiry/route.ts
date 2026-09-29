import { fieldErrorsFrom, formatInquiryEmail, inquirySchema, type InquiryResult } from "@/lib/inquiry";
import { getMailConfig, sendMail } from "@/lib/mailer";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function json(body: InquiryResult, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  const rl = limiter(clientIp(request.headers));
  if (!rl.allowed) {
    const retry = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return json({ ok: false, reason: "rate_limited" }, 429, { "Retry-After": String(retry) });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, reason: "invalid", fieldErrors: {} }, 400);
  }

  // Honeypot: answer like a success would look to a bot, but never send and never
  // tell a human visitor it worked (humans can't reach this field).
  if (payload && typeof payload === "object" && "website" in payload && (payload as { website?: unknown }).website) {
    return json({ ok: false, reason: "invalid", fieldErrors: {} }, 400);
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, reason: "invalid", fieldErrors: fieldErrorsFrom(parsed.error) }, 400);
  }

  const config = getMailConfig();
  if (!config) return json({ ok: false, reason: "unavailable" }, 503);

  const result = await sendMail(config, { ...formatInquiryEmail(parsed.data), replyTo: parsed.data.email });
  if (!result.ok) {
    console.error("inquiry delivery failed", result.status, result.message);
    return json({ ok: false, reason: "error" }, 502);
  }
  return json({ ok: true }, 200);
}
