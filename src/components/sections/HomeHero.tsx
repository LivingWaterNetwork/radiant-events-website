import ArrowIcon from "@/components/ArrowIcon";
import Link from "next/link";
export default function HomeHero() {
  return (
    <section className="cinema-hero quiet-hero" aria-label="Welcome to Radiant Events">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="cinema-copy">
        <p className="eyebrow">Atlanta · Planning, design &amp; decor</p>
        <h1>
          <span>Be in the moment.</span>
          <em>We&apos;ll make it beautiful.</em>
        </h1>
        <p className="cinema-description">
          You have a vision for how it should feel. We bring it to life with
          thoughtful design, careful planning, and room for you to simply enjoy
          the people you love.
        </p>
        <div className="hero-actions">
          <Link href="/contact" className="button-primary">
            Let&apos;s create your moment <ArrowIcon />
          </Link>
          <Link href="#the-collection" className="text-link">
            Explore the possibilities <ArrowIcon />
          </Link>
        </div>
        <p className="quiet-signature">Beauty without the burden.</p>
      </div>
      <div className="cinema-bottom">
        <a className="scroll-invitation" href="#meet-rickya">
          <span>Meet the heart behind the details</span>
          <ArrowIcon direction="down" />
        </a>
        <span className="hero-promise">Your people. Your vision. Your moment.</span>
      </div>
    </section>
  );
}
