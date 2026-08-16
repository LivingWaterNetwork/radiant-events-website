"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import PlaceholderMedia from "@/components/PlaceholderMedia";
import { siteConfig } from "@/lib/site-config";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  const imageVariants = shouldReduceMotion
    ? {}
    : {
        initial: { scale: 1.08, opacity: 0 },
        animate: {
          scale: 1,
          opacity: 1,
          transition: { duration: 1.4, ease: EASE },
        },
      };

  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE },
    }),
  };

  return (
    <section className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={imageVariants.initial}
        animate={imageVariants.animate}
      >
        <PlaceholderMedia index={0} className="h-full w-full" label="Hero photography" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/40" />

      <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44 text-center text-cream-light">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={item}
          className="font-sans uppercase tracking-wide-lg text-sm text-tangerine mb-6"
        >
          {siteConfig.location} &middot; Event Planning &amp; Design
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={item}
          className="font-display text-5xl md:text-7xl leading-tight mb-3"
        >
          {siteConfig.name}
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={item}
          className="font-display italic text-2xl md:text-3xl text-blush mb-8"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={item}
          className="font-sans text-base md:text-lg max-w-2xl mx-auto text-cream-light/90 mb-10"
        >
          {siteConfig.oneLiner}
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-block rounded-full bg-tangerine px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-ink hover:bg-coral transition-colors"
          >
            {siteConfig.primaryCta}
          </Link>
          <Link
            href="/portfolio"
            className="inline-block rounded-full border border-cream-light/50 px-8 py-4 font-sans uppercase tracking-wide-lg text-sm text-cream-light hover:bg-cream-light/10 transition-colors"
          >
            {siteConfig.secondaryCta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
