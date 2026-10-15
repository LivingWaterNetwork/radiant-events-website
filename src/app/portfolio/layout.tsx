import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Portfolio",
  "Explore authentic Radiant Events balloon installations, backdrops, and styled focal moments in our event design collection.",
  "/portfolio",
);

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
