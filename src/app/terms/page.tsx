import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-4xl text-ink mb-8">Terms of Service</h1>
      <div className="prose-sm font-sans text-ink space-y-4 leading-relaxed">
        <p className="rounded-sm border border-tangerine/40 bg-cream px-5 py-4 text-sm text-stone">
          Placeholder terms. {siteConfig.name} must review and finalize this page with legal
          counsel before launch — see <code className="text-aubergine">CONTENT_NEEDED.md</code>.
        </p>
        <p>
          This placeholder outlines the general structure a finished terms page should cover: use
          of this website, the fact that submitting the consultation form does not create a
          binding service agreement, and that all engagements are governed by a separate signed
          contract between {siteConfig.name} and the client.
        </p>
        <p>
          It should also address intellectual property in site content and photography, and a
          limitation of liability appropriate to a services business.
        </p>
      </div>
    </div>
  );
}
