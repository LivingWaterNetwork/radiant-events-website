import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/colorful-backdrop.webp",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Radiant Events`,
      description,
      url: path,
      type: "website",
      images: [
        {
          url: image,
          alt: "Radiant Events Planning and event design in Atlanta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Radiant Events`,
      description,
      images: [image],
    },
  };
}
export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).href;
}
