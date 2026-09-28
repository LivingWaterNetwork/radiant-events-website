// Fixed-window limiter keyed by client IP. In-memory, so it holds per server
// instance; good enough to blunt a burst on a preview. Swap for a shared store
// (e.g. Upstash/Vercel KV) before relying on it in production.

type Bucket = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();
  return function check(key: string, now = Date.now()) {
    const b = buckets.get(key);
    if (!b || b.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      if (buckets.size > 5000) {
        for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
      }
      return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
    }
    b.count += 1;
    return { allowed: b.count <= limit, remaining: Math.max(0, limit - b.count), resetAt: b.resetAt };
  };
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
