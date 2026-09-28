"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import Wordmark from "./Wordmark";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-8">
        <Wordmark onClick={() => setOpen(false)} />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="inline-flex min-h-11 items-center text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-ink underline-offset-8 hover:text-olive-deep hover:underline aria-[current=page]:text-olive-deep aria-[current=page]:underline"
            >
              {link.label}
            </Link>
          ))}
          <Link href={site.inquiryCta.href} className="btn btn-primary">
            {site.inquiryCta.label}
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          aria-label={open ? site.menuLabels.close : site.menuLabels.open}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ivory lg:hidden"
        >
          <div className="flex items-center justify-between px-5 py-3">
            <Wordmark onClick={() => close(false)} />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-ink"
              aria-label={site.menuLabels.close}
              onClick={() => close()}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-8 pb-16">
            {site.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => close(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="h-display py-2 text-3xl aria-[current=page]:text-olive-deep"
              >
                {link.label}
              </Link>
            ))}
            <Link href={site.inquiryCta.href} onClick={() => close(false)} className="btn btn-primary mt-8 self-start">
              {site.inquiryCta.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
