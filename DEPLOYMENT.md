# Deployment Guide

## Deploying to Vercel

1. Push this repository to GitHub (see project root for git setup).
2. In Vercel: **Add New Project** → import the GitHub repo.
3. Framework preset: **Next.js** (auto-detected). No build settings need to change —
   `npm run build` / `npm start` work out of the box.
4. No environment variables are required for a first deploy — the site builds and runs fully
   with local typed content (see `.env.example` for optional integrations).
5. Deploy. Vercel will assign a `*.vercel.app` preview URL immediately.

## Custom Domain

1. In the Vercel project → **Settings → Domains**, add the production domain
   (e.g. `radianteventsatl.com`).
2. Update DNS at the domain registrar per Vercel's instructions (typically an `A`/`ALIAS` record
   or `CNAME` to `cname.vercel-dns.com`).
3. Update `siteConfig.url` in `src/lib/site-config.ts` to match the final domain — this feeds
   the sitemap, robots.txt, and Open Graph metadata.

## Wiring the Contact Form to Send Email

The form currently validates and logs client-side only (`src/app/contact/page.tsx`). To make it
actually deliver inquiries:

1. Create a [Resend](https://resend.com) account and API key.
2. Add `RESEND_API_KEY` and `INQUIRY_NOTIFICATION_EMAIL` in Vercel → **Settings →
   Environment Variables**.
3. Add a server action or route handler (e.g. `src/app/contact/actions.ts`) that:
   - Re-validates the payload server-side with `inquirySchema` (never trust client validation
     alone)
   - Rejects submissions where the honeypot `company` field is non-empty
   - Sends via Resend to `INQUIRY_NOTIFICATION_EMAIL`
4. Call that action from the form's `onSubmit` instead of the current `console.log`.
5. Consider basic rate-limiting (e.g. Vercel's Edge Config or a simple IP-based check) if the
   form becomes a spam target.

## Optional: CMS Migration

Content currently lives in typed files under `src/content/`. If the business later wants
non-developer content editing:

1. Provision a CMS (Sanity is a good fit for this content shape).
2. Mirror the existing types (`ServiceDetail`, `PortfolioProject`, `JournalArticle`) as CMS
   schemas.
3. Replace the typed getters (`getServiceBySlug`, etc.) with CMS fetch calls — page components
   don't need to change since they only consume the getters.

## Launch Checklist

- [ ] Real contact info added to `site-config.ts`, `hasContactInfo` flipped to `true`
- [ ] Real portfolio photography and case studies replace placeholders
- [ ] Real testimonials added and `showTestimonials` flipped to `true` (or left off)
- [ ] Privacy Policy and Terms reviewed by legal counsel
- [ ] Contact form wired to Resend (or equivalent) and tested end-to-end
- [ ] `siteConfig.url` matches the final production domain
- [ ] Custom domain connected and SSL issued (automatic on Vercel)
- [ ] Run `npm run build` one final time with zero errors/warnings
- [ ] Spot-check all routes on desktop and mobile after the real domain is live
