import type { MetadataRoute } from "next";
import { getArticles } from "@/content/helpful-reads";
import { getPublishedProjects } from "@/content/portfolio";
import { site } from "@/content/site";

// Public routes only: privacy/terms drafts are noindex and excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/services", "/portfolio", "/process", "/helpful-reads", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p === "/" ? "" : p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...getPublishedProjects().map((p) => ({ url: `${site.url}/portfolio/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...getArticles().map((a) => ({ url: `${site.url}/helpful-reads/${a.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
