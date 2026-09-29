"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "@/content/media";

/**
 * Muted decorative loop layered over the hero still. It only mounts when the
 * visitor allows motion and isn't on Save-Data, and always has a pause control.
 * The still (rendered by the server beneath this) stays the LCP element.
 */
export default function HeroVideo({ video, pauseLabel, playLabel }: { video: VideoAsset; pauseLabel: string; playLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const update = () => setAllowed(!motion.matches && !saveData);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  if (!allowed) return null;

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={video.poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center bg-ivory/90 text-ink"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5l11 7-11 7z" />}
        </svg>
      </button>
    </>
  );
}
