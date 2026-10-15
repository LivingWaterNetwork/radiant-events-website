import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact",
  "Begin a consultation with Radiant Events for your next celebration.",
  "/contact",
);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
