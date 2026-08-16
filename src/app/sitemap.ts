import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/content/services";
import { portfolioProjects } from "@/content/portfolio";
import { journalArticles } from "@/content/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/process",
    "/journal",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const dynamicRoutes = [
    ...services.map((s) => `/services/${s.slug}`),
    ...portfolioProjects.map((p) => `/portfolio/${p.slug}`),
    ...journalArticles.map((a) => `/journal/${a.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(0),
  }));
}
