# Radiant Events — Website

Production website for **Radiant Events**, an Atlanta-based event planning and design company.
Built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check without emitting |

## Project Structure

```
src/
  app/            Routes, layouts, metadata, sitemap/robots
  components/     Header, footer, shared UI
    motion/        Framer Motion reveal/stagger primitives
    sections/      Reusable page sections (hero, etc.)
  content/        Typed local content (services, portfolio, journal)
  lib/            site-config.ts (single source of truth), validation
```

## Content & Configuration

All business details — navigation, contact info, budget ranges, CTAs, feature flags — live in
[`src/lib/site-config.ts`](src/lib/site-config.ts). Update copy and structural content in
[`src/content/`](src/content/) rather than editing page components directly where possible.

See [`CONTENT_NEEDED.md`](CONTENT_NEEDED.md) for what the business owner still needs to supply
before launch (real contact info, portfolio photography, testimonials, legal copy).

See [`BRAND_IMPLEMENTATION.md`](BRAND_IMPLEMENTATION.md) for the brand system (colors, type,
motion rules) as implemented in code.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for deploying to Vercel, environment variables, and a launch
checklist.

## Current State

- All 24 routes build successfully (`npm run build`), lint clean, no TypeScript errors.
- No CMS is wired up — content is typed and local (`src/content/`). It can be migrated to a
  headless CMS later without changing page components, since pages read from typed getters
  (`getServiceBySlug`, `getProjectBySlug`, `getArticleBySlug`).
- The contact form validates client-side with Zod + React Hook Form and includes a honeypot
  field. It does **not** yet send email — see `DEPLOYMENT.md` for wiring a provider like Resend.
- All portfolio projects and testimonials are placeholders, clearly labeled as such in the UI.
  Testimonials are hidden entirely (`siteConfig.showTestimonials = false`) until real,
  attributable client quotes are supplied.
