import ArrowIcon from "@/components/ArrowIcon";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import HomeHero from "@/components/sections/HomeHero";
import DesignStudio from "@/components/sections/DesignStudio";
import { siteConfig } from "@/lib/site-config";
import MeetRickya from "@/components/sections/MeetRickya";
import CollectionCarousel from "@/components/sections/CollectionCarousel";
export const metadata: Metadata = {
  title: { absolute: "Radiant Events | Atlanta Event Planning & Design" },
  description: siteConfig.oneLiner,
  alternates: { canonical: "/" },
};
export default function Home() {
  return (
    <div>
      <HomeHero />
      <div className="occasion-strip" aria-label="Celebrations we design">
        <span>Birthdays &amp; milestones</span>
        <span>Showers &amp; celebrations</span>
        <span>Brand &amp; community gatherings</span>
      </div>
      <nav className="experience-nav" aria-label="Explore Radiant">
        <a href="#meet-rickya">Meet Rickya</a>
        <a href="#design-studio">Find your feeling</a>
        <a href="#the-collection">The collection</a>
        <a href="#your-journey">Your journey</a>
        <Link href="/contact">Begin your celebration</Link>
      </nav>
      <section className="section-wrap occasion-intro">
        <p className="eyebrow">Your reason to gather</p>
        <h2>What are you celebrating?</h2>
        <div className="support-grid">
          {[
            [
              "Milestones & private celebrations",
              "Birthday moments, anniversaries, and the people you love.",
              "milestone-celebrations",
            ],
            [
              "Showers & intimate gatherings",
              "A beautiful beginning, surrounded by your people.",
              "showers-intimate-gatherings",
            ],
            [
              "Brand & community gatherings",
              "Spaces that bring people around a shared purpose.",
              "brand-community-gatherings",
            ],
          ].map(([title, copy, slug]) => (
            <Link key={slug} href={`/occasions/${slug}`}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="text-link">
                Explore the occasion <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <MeetRickya />
      <DesignStudio />
      <section
        className="detail-editorial section-wrap"
        data-enter
        aria-labelledby="detail-title"
      >
        <div className="detail-portrait">
          <Image
            src="/images/styled-table-detail.webp"
            alt="A pink acrylic table sign, shimmering runner, and golden rose detail"
            fill
            sizes="(max-width:767px) 80vw, 35vw"
          />
        </div>
        <div className="detail-narrative">
          <p className="eyebrow">The details make the difference</p>
          <h2 id="detail-title">
            Not just a backdrop.
            <br />
            <em>A world of little details.</em>
          </h2>
          <p>
            A palette that carries through. A table with personality. A welcome
            that feels considered. Beautiful moments come together when the
            details speak the same language.
          </p>
          <Link href="/services/design-room-styling" className="text-link">
            Explore design &amp; room styling <ArrowIcon />
          </Link>
          <div className="detail-landscape">
            <Image
              src="/images/celebration-detail.webp"
              alt="A coordinated pink celebration display with styled books and accessories"
              fill
              sizes="(max-width:767px) 90vw, 45vw"
            />
          </div>
        </div>
      </section>
      <section className="section-wrap introduction" data-enter>
        <p className="eyebrow">Beauty without the burden</p>
        <div>
          <h2>
            More than a beautiful room.
            <br />
            <em>A feeling you remember.</em>
          </h2>
          <p>
            Your celebration has a story. We help tell it through a palette, a
            focal moment, and the small details that make the whole space feel
            like you. From the first idea to the final placement, our approach
            is thoughtful, personal, and full of care.
          </p>
          <Link href="/about" className="text-link">
            The heart behind Radiant <ArrowIcon />
          </Link>
        </div>
      </section>
      <section className="work-section" id="the-collection" data-enter>
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / A closer look</p>
              <h2>
                Little details.
                <br />
                <em>Lasting impressions.</em>
              </h2>
            </div>
            <Link href="/portfolio" className="text-link">
              View the collection <ArrowIcon />
            </Link>
          </div>
          <p className="collection-hint">
            Three real installations. Three different personalities.{" "}
            <span>Swipe to explore.</span>
          </p>
          <CollectionCarousel />
        </div>
      </section>
      <section className="section-wrap services-editorial" data-enter>
        <div>
          <p className="eyebrow">03 / Bring it together</p>
          <h2>
            Your vision.
            <br />
            <em>Our thoughtful touch.</em>
          </h2>
          <p>
            One statement piece or a space brought together. Choose the support
            your celebration needs.
          </p>
          <Link href="/services" className="text-link">
            Explore services <ArrowIcon />
          </Link>
        </div>
        <div className="service-lines">
          {[
            [
              "01",
              "Signature Installations",
              "Custom balloons, backdrops, and photo moments that bring your celebration's personality into focus.",
              "signature-installations",
            ],
            [
              "02",
              "Design + Room Styling",
              "A cohesive palette, tablescape, and room design, thoughtfully arranged around your vision.",
              "design-room-styling",
            ],
            [
              "03",
              "Planning + Coordination",
              "Tell us the details you need help bringing together. We'll recommend support for your event and scope.",
              "planning-coordination",
            ],
          ].map(([n, t, c, s]) => (
            <Link key={s} href={"/services/" + s}>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{c}</p>
              </div>
              <ArrowIcon />
            </Link>
          ))}
        </div>
      </section>
      <section id="your-journey" className="process-home" data-enter>
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / Enjoy the journey</p>
              <h2>
                From an idea
                <br />
                <em>to “it&apos;s perfect.”</em>
              </h2>
            </div>
            <Link href="/process" className="text-link">
              Our process <ArrowIcon />
            </Link>
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "Share the occasion",
                "Tell us your date, your space, and what you're imagining. Inspiration is welcome; a finished plan isn't required.",
              ],
              [
                "02",
                "Make it personal",
                "We shape the design and scope around your celebration, with a custom proposal and clear next steps.",
              ],
              [
                "03",
                "Enjoy the moment",
                "We bring the agreed details to life so you can welcome your guests and be present for the celebration.",
              ],
            ].map(([n, t, c]) => (
              <div key={n}>
                <span className="step-number">{n}</span>
                <h3>{t}</h3>
                <p>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-wrap faq-home" data-enter>
        <div>
          <p className="eyebrow">Before we begin</p>
          <h2>
            A few things
            <br />
            <em>you might wonder.</em>
          </h2>
        </div>
        <div>
          {[
            [
              "Can I book just balloons or a backdrop?",
              "Yes. Signature installations can be the whole project. Tell us your palette, venue, and the focal moment you have in mind.",
            ],
            [
              "Do I need to know exactly what I want?",
              "No. Bring a few inspiration images, a color you love, or simply the occasion. We can help you shape the direction.",
            ],
            [
              "Where do you work?",
              "Radiant is based in Atlanta and serves surrounding areas. Include your venue location so we can confirm availability and travel details.",
            ],
            [
              "How much will my event cost?",
              "Every proposal is scoped to your design, materials, location, and setup needs. Share a comfortable budget in your inquiry so we can guide the conversation.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="section-wrap service-choice">
        <div>
          <p className="eyebrow">Clear from the beginning</p>
          <h2>
            A personal proposal.
            <br />
            <em>A confident next step.</em>
          </h2>
        </div>
        <div>
          <p>
            Your scope is shaped around your priorities, design, venue, and
            setup needs. We’ll help you understand what belongs in the plan
            before you book.
          </p>
          <Link href="/investment" className="text-link">
            Explore your investment <ArrowIcon />
          </Link>
          <br />
          <Link href="/faq" className="text-link">
            More questions, thoughtfully answered <ArrowIcon />
          </Link>
        </div>
      </section>
      <section className="closing-cta" data-enter>
        <span className="closing-script" aria-hidden="true">
          with purpose, with grace
        </span>
        <p className="eyebrow">Let&apos;s make something meaningful</p>
        <h2>
          You bring the occasion.
          <br />
          <em>We&apos;ll bring the radiance.</em>
        </h2>
        <p>Start with a few details. We&apos;ll take it from there.</p>
        <Link href="/contact" className="button-light">
          Start your event inquiry <ArrowIcon />
        </Link>
      </section>
    </div>
  );
}
