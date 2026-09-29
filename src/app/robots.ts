import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { isProductionDeploy } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy()) {
    // Previews and local builds are never indexed.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/privacy", "/terms"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
