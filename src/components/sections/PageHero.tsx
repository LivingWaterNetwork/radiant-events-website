import PlaceholderMedia from "@/components/PlaceholderMedia";
import { Reveal } from "@/components/motion/Reveal";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  mediaIndex = 0,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  mediaIndex?: number;
}) {
  return (
    <section className="relative overflow-hidden">
      <PlaceholderMedia index={mediaIndex} className="absolute inset-0" />
      <div className="absolute inset-0 bg-ink/50" />
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-cream-light">
        <Reveal>
          <p className="font-sans uppercase tracking-wide-lg text-sm text-tangerine mb-4">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-5xl md:text-6xl mb-4">{title}</h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.2}>
            <p className="font-sans text-cream-light/90 max-w-xl mx-auto">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
