import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { Container } from "@/components/sections";
import { inquiryCopy } from "@/content/inquiry";
import { seo } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(seo.contact);

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <h1 className="h-display text-4xl md:text-6xl">{inquiryCopy.title}</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink">{inquiryCopy.intro}</p>
      </div>
      <InquiryForm />
    </Container>
  );
}
