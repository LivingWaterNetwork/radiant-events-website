import type { NextConfig } from "next";
import { legacyServiceRedirects } from "./src/content/services";

const isProduction = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/journal", destination: "/helpful-reads", statusCode: 301 as const },
      { source: "/journal/:slug", destination: "/helpful-reads/:slug", statusCode: 301 as const },
      ...Object.entries(legacyServiceRedirects).map(([from, anchor]) => ({
        source: `/services/${from}`,
        destination: `/services#${anchor}`,
        statusCode: 301 as const,
      })),
      { source: "/services/:slug", destination: "/services", statusCode: 301 },
    ];
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: isProduction ? base : [...base, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/privacy", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/terms", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
