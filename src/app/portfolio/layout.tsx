import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A selection of weddings, corporate events, and private celebrations designed and produced across Atlanta.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
