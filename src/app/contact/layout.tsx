import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Begin a consultation with Radiant Events for your next celebration.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
