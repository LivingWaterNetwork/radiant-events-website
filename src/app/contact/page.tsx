import PageHero from "@/components/sections/PageHero";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Begin a Consultation"
        subtitle="Tell us a little about your celebration and we'll be in touch within two business days."
        mediaIndex={1}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-6 text-center font-sans text-sm text-stone">
          Complete the inquiry below, or email us at{" "}
          <a className="text-aubergine underline" href={"mailto:" + siteConfig.contact.bookingsEmail}>
            {siteConfig.contact.bookingsEmail}
          </a>.
        </p>
        <iframe
          title="Radiant Events consultation inquiry"
          src={siteConfig.contact.inquiryFormUrl + "?embedded=true"}
          className="w-full rounded-sm border-0"
          height="1300"
          loading="lazy"
        />
        <p className="mt-6 text-center font-sans text-sm text-stone">
          <a className="text-aubergine underline" href={siteConfig.contact.inquiryFormUrl} target="_blank" rel="noopener noreferrer">
            Open the inquiry form in a new tab
          </a>
        </p>
      </section>
      <section className="bg-cream px-6 py-16 text-center font-sans text-sm text-stone">
        <p>{siteConfig.location}</p>
        <a className="text-aubergine underline" href={"mailto:" + siteConfig.contact.bookingsEmail}>
          {siteConfig.contact.bookingsEmail}
        </a>
      </section>
    </div>
  );
}
