"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Restrained motion (07): a short fade-and-rise, ≤ 250 ms, off under reduced motion.
const DURATION = 0.25;

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const Component = m[as];
  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  return (
    <LazyMotion features={domAnimation} strict>
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DURATION, delay: Math.min(delay, 0.15), ease: "easeOut" }}
    >
      {children}
    </Component>
    </LazyMotion>
  );
}
