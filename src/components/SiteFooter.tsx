import Link from "next/link";
import { getSocialLinks, site } from "@/content/site";

export default function SiteFooter() {
  const social = getSocialLinks();
  const legal = [site.legal.privacy, site.legal.terms].filter(Boolean) as { href: string; label: string }[];
  return (
    <footer className="border-t border-sand bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr] md:px-8">
        <div>
          <p className="h-display text-2xl text-olive-deep">{site.name}</p>
          <p className="tagline mt-2">{site.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink">{site.footer.blurb}</p>
          <p className="mt-2 text-sm text-ink">{site.footer.serviceArea}</p>
          {(site.contact.email || site.contact.phone) && (
            <ul className="mt-4 space-y-1 text-sm">
              {site.contact.email && (
                <li>
                  <a className="underline underline-offset-4" href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                </li>
              )}
              {site.contact.phone && (
                <li>
                  <a className="underline underline-offset-4" href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}>
                    {site.contact.phone}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        <nav aria-label={site.navLabels.footer}>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {[...site.nav, site.inquiryCta].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-sm text-ink underline-offset-4 hover:text-olive-deep hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            {social.map((l) => (
              <li key={l.href}>
                <a href={l.href} rel="noopener" className="inline-flex min-h-11 items-center text-sm text-ink underline-offset-4 hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-sand">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 text-xs text-ink md:px-8">
          <p>{site.footer.copyright}</p>
          {legal.length > 0 && (
            <ul className="flex gap-6">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
