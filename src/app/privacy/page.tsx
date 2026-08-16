import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-4xl text-ink mb-8">Privacy Policy</h1>
      <div className="prose-sm font-sans text-ink space-y-4 leading-relaxed">
        <p className="rounded-sm border border-tangerine/40 bg-cream px-5 py-4 text-sm text-stone">
          Placeholder policy. {siteConfig.name} must review and finalize this page with legal
          counsel before launch — see <code className="text-aubergine">CONTENT_NEEDED.md</code>.
        </p>
        <p>
          This placeholder outlines the general structure a finished privacy policy should cover:
          what information is collected through the consultation inquiry form (name, contact
          details, and event information you choose to share), how that information is used
          (solely to respond to your inquiry), and that {siteConfig.name} does not sell personal
          information to third parties.
        </p>
        <p>
          It should also describe any analytics or cookies in use, how long inquiry data is
          retained, and how a visitor can request their information be corrected or deleted.
        </p>
      </div>
    </div>
  );
}
