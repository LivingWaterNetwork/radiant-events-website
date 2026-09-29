import type { Metadata } from "next";
import LegalDraft from "@/components/LegalDraft";
import { legalCopy } from "@/content/legal";
import { projectTitleSuffix } from "@/content/site";

export const metadata: Metadata = {
  title: `${legalCopy.privacy.title}${projectTitleSuffix}`,
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <LegalDraft doc="privacy" />;
}
