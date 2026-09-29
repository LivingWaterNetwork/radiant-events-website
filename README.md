# Radiant Events Planning — website

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion. Built by MMG to Treatment A
("Ivory Garden") from the Radiant Production Package (Sept 28, 2026, revision 2).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (Vitest): content getters, form schema, mailer, rate limit, API route |
| `npm run test:e2e` | Playwright: routes, redirects, nav, filters, lightbox, form, axe, responsive |
| `npm run media` | Media pipeline (needs `_source-media/` and ffmpeg) |

## Content

All copy lives in the typed content layer, `src/content/*.ts`; components contain no copy.

- `site.ts`: name, nav, footer, SEO titles/descriptions, JSON-LD, optional social/contact
- `home.ts`, `services.ts`, `process.ts`, `about.ts`, `helpful-reads.ts`, `inquiry.ts`, `legal.ts`
- `portfolio.ts`: projects from `04-PORTFOLIO-REGISTRY.csv`; filters derive from published projects
- `media-manifest.ts`: **generated** by `scripts/process-media.mjs`, do not edit

Optional "coming" content renders nothing until filled in:
`founder` in `about.ts` (story, portrait, quote), `site.social`, `site.contact`, `site.legal`.
The budget field switches to a dropdown with `inquiryCopy.budget = { mode: "select", label, options }`.

Claims: nothing may be published without a **Yes** row in the package's `11-CLAIMS-REGISTER.md`.
`node qa/claims-audit.mjs` (after a build) checks the rendered pages.

## Media

Originals never enter git. Download the Drive `SOURCE-MEDIA` folder into `_source-media/`
(git-ignored), then run `npm run media`. The script converts HEIC, applies orientation, crops,
blurs, strips all metadata (verified with exiftool) and writes AVIF/WebP/JPG at 800/1600/2400 into
`public/images/portfolio/<project>/`, plus muted ≤ 12 s MP4/WebM loops ≤ 3 MB into `public/video/`.
Videos need a chosen segment (`start`/`duration` in the `VIDEOS` list) after scrubbing each clip.

## Inquiry form

See `.env.example`. Without `RESEND_API_KEY` and `INQUIRY_NOTIFICATION_EMAIL`, the form tells
visitors inquiries are temporarily unavailable; it never shows a success it can't confirm.

See `DEPLOYMENT.md` and `QA-REPORT.md`.
