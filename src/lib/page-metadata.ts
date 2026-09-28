import type { Metadata } from "next";
import type { PageSeo } from "@/content/site";

type Og = { url: string; width: number; height: number; alt: string };

export function pageMetadata(page: PageSeo, image?: Og): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      ...(image ? { images: [image.url] } : {}),
    },
  };
}
