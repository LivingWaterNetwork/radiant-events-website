import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="font-sans uppercase tracking-wide-lg text-xs text-aubergine mb-4">404</p>
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">
        This page hasn&rsquo;t been planned yet.
      </h1>
      <p className="font-sans text-stone mb-10">
        The page you&rsquo;re looking for may have moved. Let&rsquo;s get you back to something
        beautifully resolved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block rounded-full bg-aubergine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-cream-light hover:bg-ink-deep transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/contact"
          className="inline-block rounded-full border border-aubergine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-aubergine hover:bg-cream transition-colors"
        >
          {siteConfig.primaryCta}
        </Link>
      </div>
    </div>
  );
}
