import "server-only";

export type MailConfig = { apiKey: string; to: string; from: string };

/** Returns null when delivery isn't configured, so the route can answer honestly. */
export function getMailConfig(env: NodeJS.ProcessEnv = process.env): MailConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.INQUIRY_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !to) return null;
  const from = env.INQUIRY_FROM_EMAIL?.trim() || "Radiant Events Planning <onboarding@resend.dev>";
  return { apiKey, to, from };
}

export type SendResult = { ok: true; id: string } | { ok: false; status: number; message: string };

/** Sends through Resend's REST API. `ok` only when Resend returns 2xx with a message id. */
export async function sendMail(
  config: MailConfig,
  msg: { subject: string; text: string; html: string; replyTo: string },
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  try {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: config.from,
        to: config.to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: msg.replyTo,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (res.ok && body.id) return { ok: true, id: body.id };
    return { ok: false, status: res.status, message: body.message ?? res.statusText };
  } catch (err) {
    return { ok: false, status: 0, message: err instanceof Error ? err.message : "network error" };
  }
}
