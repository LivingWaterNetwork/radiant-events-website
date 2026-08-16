import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-cream-light">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <Image
            src="/brand/radiant-events-logo.png"
            alt={`${siteConfig.name} ${siteConfig.location}`}
            width={220}
            height={140}
            className="h-20 w-auto mb-4 brightness-0 invert opacity-90"
          />
          <p className="font-display italic text-lg text-blush">{siteConfig.tagline}</p>
        </div>

        <div className="font-sans text-sm">
          <h3 className="uppercase tracking-wide-lg text-tangerine mb-4">Explore</h3>
          <ul className="space-y-2 text-cream/90">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-tangerine">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-tangerine">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="font-sans text-sm">
          <h3 className="uppercase tracking-wide-lg text-tangerine mb-4">Get In Touch</h3>
          <ul className="space-y-2 text-cream/90">
            <li>{siteConfig.location}</li>
            {siteConfig.hasContactInfo && siteConfig.contact.email && (
              <li>{siteConfig.contact.email}</li>
            )}
            {siteConfig.hasContactInfo && siteConfig.contact.phone && (
              <li>{siteConfig.contact.phone}</li>
            )}
            <li>
              <Link
                href="/contact"
                className="underline decoration-tangerine underline-offset-4 hover:text-tangerine"
              >
                {siteConfig.primaryCta}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-cream/60 font-sans flex flex-col sm:flex-row justify-between gap-2">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              &copy; {new Date().getFullYear()} {siteConfig.name} {siteConfig.location.split(",")[0]}. All rights reserved.
            </span>
            {siteConfig.footerLegal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-tangerine">
                {link.label}
              </Link>
            ))}
          </span>
          <span>{siteConfig.positioning}</span>
        </div>
      </div>
    </footer>
  );
}
