import type { Metadata, Viewport } from "next";
import { Allura, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocalBusinessJsonLd, seo, site } from "@/content/site";
import { isProductionDeploy } from "@/lib/env";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["500"], display: "swap" });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
// Tagline only: not worth a preload competing with the hero image.
const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400", display: "swap", preload: false });

const ogImage = { url: "/images/portfolio/e01/E01-01-og-1200.jpg", width: 1200, height: 630, alt: "Pink balloon arch and ribbon fringe backdrop with light-up 16 numbers on a sunny patio" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.home.title, template: "%s" },
  description: seo.home.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: seo.home.title,
    description: seo.home.description,
    url: "/",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: seo.home.title, description: seo.home.description, images: [ogImage.url] },
  robots: isProductionDeploy() ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#F8F6EE" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${allura.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-olive focus:px-4 focus:py-3 focus:text-ivory"
        >
          {site.skipLink}
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
