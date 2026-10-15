import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";

export default function MeetRickya() {
  return (
    <section id="meet-rickya" className="section-wrap founder-section" data-enter aria-labelledby="founder-title">
      <div className="founder-portrait">
        <Image src="/images/rickya-fandino.webp" alt="Rickya Fandino, founder of Radiant Events Planning" fill sizes="(max-width:767px) 90vw, 40vw" />
        <span className="founder-signature" aria-hidden="true">Meet Rickya</span>
      </div>
      <div className="founder-copy">
        <p className="eyebrow">A love for people. A heart for celebration.</p>
        <h2 id="founder-title">You deserve to enjoy<br /><em>what you&apos;re creating.</em></h2>
        <p>For Rickya Fandino, a beautiful event begins with the people it brings together. The joy of a milestone. The warmth of a room filled with familiar faces. The relief of knowing someone is thoughtfully caring for the details.</p>
        <p>Her experience planning multisite events and conferences at Victory Church shapes the way she approaches your celebration: with a clear plan, attentive coordination, and a commitment to excellence.</p>
        <p>You bring the feeling you&apos;re imagining. Rickya helps turn it into a celebration that feels like you, while easing the planning stress so you can be present for the moments that matter.</p>
        <Link href="/about" className="text-link">The heart behind Radiant <ArrowIcon /></Link>
      </div>
    </section>
  );
}
