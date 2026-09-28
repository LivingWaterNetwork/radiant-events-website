"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/content/media";
import Picture from "./Picture";

export type GalleryLabels = {
  open: string;
  dialog: string;
  close: string;
  prev: string;
  next: string;
  /** e.g. "Image {i} of {n}" */
  counter: string;
};

export default function Gallery({ images, labels }: { images: ImageAsset[]; labels: GalleryLabels }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const n = images.length;

  const close = useCallback(() => {
    setIndex((i) => {
      if (i !== null) requestAnimationFrame(() => triggerRefs.current[i]?.focus());
      return null;
    });
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (index === null) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab" && dialog) {
        const items = Array.from(dialog.querySelectorAll<HTMLElement>("button"));
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
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // Only re-run when the dialog opens/closes, not on every slide change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null, close, step]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {images.map((img, i) => (
          <li key={img.id} className={i === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""}>
            <button
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setIndex(i)}
              className="zoom-media block h-full w-full overflow-hidden bg-sand"
              aria-label={`${labels.open}: ${img.alt}`}
            >
              <Picture
                image={img}
                alt=""
                sizes={i === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 30vw, 50vw"}
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && index !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={labels.dialog}
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 text-ivory"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <p aria-live="polite" className="text-sm">
              {labels.counter.replace("{i}", String(index + 1)).replace("{n}", String(n))}
            </p>
            <button type="button" data-autofocus onClick={close} aria-label={labels.close} className="inline-flex h-11 w-11 items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 md:px-20">
            <Picture
              key={current.id}
              image={current}
              sizes="100vw"
              priority
              className="flex h-full w-full items-center justify-center"
              imgClassName="max-h-full max-w-full object-contain"
            />
            {n > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className="absolute left-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-ink/60 md:left-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" strokeLinecap="round" />
                  </svg>
                </button>
                <button type="button" onClick={() => step(1)} aria-label={labels.next} className="absolute right-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-ink/60 md:right-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
