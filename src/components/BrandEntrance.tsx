"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function BrandEntrance() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      const key =
        pathname === "/about"
          ? "radiant-founder-welcome-v3"
          : "radiant-welcome-v3";
      seen = sessionStorage.getItem(key) === "seen";
      sessionStorage.setItem(key, "seen");
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const hide = setTimeout(() => setVisible(false), 0);
      return () => clearTimeout(hide);
    }
    const start = setTimeout(() => setVisible(true), 0);
    const end = setTimeout(() => setVisible(false), 1600);
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    document.addEventListener("keydown", escape);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
      document.removeEventListener("keydown", escape);
    };
  }, [pathname]);
  if (!visible) return null;
  return (
    <div className="brand-intro" aria-label="Welcome to Radiant Events">
      <Image
        src="/brand/radiant-olive-logo.webp"
        alt="Radiant Events Planning · Design and Decor · Psalm 52:8"
        width={440}
        height={440}
        unoptimized
        loading="eager"
        fetchPriority="high"
      />
      <p>A little beauty. A lot of meaning.</p>
      <button onClick={() => setVisible(false)}>Skip welcome</button>
    </div>
  );
}
