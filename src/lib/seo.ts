import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
export const shareImage = {
  url: siteConfig.url + "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: "Radiant Events Planning logo",
};
export function pageMetadata(
  title: string,
  description: string,
  path: string,
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
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Radiant Events`,
      description,
      images: [shareImage],
    },
  };
}
export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).href;
}
