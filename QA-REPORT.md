# QA report: Radiant Events Planning, first-pass build

**Date:** September 29, 2026 · **Branch:** `claude/nifty-clarke-ban1kt` · **Standard:** `10-MMG-QA-STANDARD.md` (8 gates)
**Scope:** Vercel preview for Rickya's first-pass review. No production deploy, no domain/DNS changes, no merge.

## Summary

| Gate | Result | Notes |
| --- | --- | --- |
| 1 · Truth and content integrity | **Pass** | Claims audit and placeholder scan clean on all 18 rendered pages |
| 2 · Functional | **Pass, with one blocked item** | Real end-to-end test inquiry blocked: no Resend key or inbox configured in Vercel |
| 3 · Accessibility | **Pass** | axe: 0 violations of any severity on 17 routes × 2 widths |
| 4 · Performance and media | **Partial** | Lighthouse 90–99 / 100 / 100 / 100. LCP over 2.5 s (simulated) on 4 of 5 pages. 8 source files not downloadable (videos, 3 JPGs) |
| 5 · SEO and sharing | **Pass** | Rich Results Test not reachable from the build environment; JSON-LD validated by test |
| 6 · Visual and responsive | **Partial** | Chromium only. Firefox and WebKit aren't installed in this environment; the Playwright projects are ready |
| 7 · Code quality | **Pass** | tsc, eslint and `next build` clean. 30 unit tests and 142 e2e tests pass |
| 8 · Release discipline | **Pass, with one deviation** | Session branch `claude/nifty-clarke-ban1kt` is used in place of `feat/first-pass-build-2026-09-28` |

Nothing is marked N/A. Every partial or blocked item states its reason below.

---

## Gate 1: Truth and content integrity (Pass)

**Claims audit** (`node qa/claims-audit.mjs`). This scans the visible text, `alt`/`aria-label`/meta attributes, `<title>` and JSON-LD of every prerendered page.

```
Claims found (all trace to Yes rows in 11-CLAIMS-REGISTER.md):
  C1   Business name                            17 page(s)
  C2   Tagline                                  17 page(s)
  C3   Founder                                  2 page(s)
  C4   Planning & coordination offered          17 page(s)
  C5   Service lines offered                    16 page(s)
  C6   Weddings                                 4 page(s)
  C7   Events of 5,000 guests                   3 page(s)
  C8   Church conferences (generic)             4 page(s)
  C9   Delivery/setup/installation included     1 page(s)
  C10  Atlanta area                             17 page(s)
  C11  Two-business-day reply                   1 page(s)
  C12  Portfolio projects                       7 page(s)

Forbidden-claim scan over 18 pages: 0 hit(s)
```

The forbidden patterns cover:
- prices, deposits and minimums (C13)
- testimonials, ratings and stars (C14)
- year, event or client counts, and awards (C15)
- named churches or Scripture (C16)
- ® and ™ (C17)
- street addresses, phone numbers and email addresses
- "5,000+" and "5,000 events"

**Placeholder scan.** Pattern: `placeholder | lorem | TODO | TBD | CONTENT_NEEDED | coming soon | pending | [ | example.com | 555-`.

- **`src/`** (`grep -rniE`, excluding the generated media manifest): **0 hits**.
- **Rendered output** (`node qa/visible-text.mjs`, visible text and attributes of every `.next` HTML page): `18 pages scanned, 0 placeholder hits`.
- `PlaceholderMedia.tsx`, `CONTENT_NEEDED.md`, the old journal and service routes, and the old placeholder projects are deleted.

**Images.** Only approved sources are used: 15 of the 23 selected assets are exported. E01-02 is withheld (see Gate 4). `public/` holds only pipeline output: 139 files, with no stock images, inspiration screenshots or logo. The old logo PNG and the default Next.js favicon are deleted. The e2e test "no placeholder images or old logo are served" confirms the logo path returns 404.

**Business name.** "Radiant Events Planning" appears in every `<title>`, the OG `site_name`, the JSON-LD `name`, the footer, the wordmark, and the web manifest (`name` and `short_name`). Every route is asserted by e2e (`toHaveTitle(/Radiant Events Planning/)`).

---

## Gate 2: Functional (Pass, one item blocked)

**Routes.** All 14 public routes return 200 with the expected H1 and a canonical link. Unknown routes, and unpublished project slugs such as `/portfolio/not-a-project`, return the custom 404 ("This page wandered off.").

**Route and redirect table**

| Route | Status |
| --- | --- |
| `/` | 200 |
| `/services` (anchors `#planning-coordination`, `#balloon-backdrop-installations`, `#event-decor-styling`, `#custom-design-details`) | 200 |
| `/portfolio` | 200 |
| `/portfolio/pink-sweet-16-garden-celebration` | 200 |
| `/portfolio/guest-experience-ministry-backdrop` | 200 |
| `/portfolio/level-29-game-night` | 200 |
| `/portfolio/she-rose-author-event` | 200 |
| `/portfolio/candlelit-tablescape` | 404 until the E05 video is processed (no media, so not published) |
| `/process` | 200 |
| `/helpful-reads` and its 3 articles | 200 |
| `/about` | 200 |
| `/contact` | 200 |
| `/privacy`, `/terms` | 200, `noindex` (header and meta), not in nav, footer or sitemap |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon.svg` | 200 |
| `/journal` | **301** → `/helpful-reads` |
| `/journal/:slug` | **301** → `/helpful-reads/:slug` |
| `/services/planning-coordination` | **301** → `/services#planning-coordination` |
| `/services/design-room-styling` | **301** → `/services#event-decor-styling` |
| `/services/signature-installations` | **301** → `/services#balloon-backdrop-installations` |
| `/services/:anything-else` | **301** → `/services` |
| `/weddings` | Not added: no such route existed on the old site or the live site |

**Internal links.** `linkinator` crawl, recursive from `/`: `checked 165, ok 165, broken 0` (`qa/linkinator.json`).

**Inquiry form**
- Uses the fields from 03 exactly. Budget is optional free text, and `inquiryCopy.budget.mode = "select"` switches it to a dropdown.
- The same Zod schema (`zod/mini`) runs on the client (react-hook-form) and on the server (`/api/inquiry`).
- The honeypot field `website` is `aria-hidden`, has `tabindex=-1`, and is rejected by the server.
- Rate limit: 5 submissions per IP per 10 minutes, then 429 with `Retry-After`. The limiter is in memory (per instance), so it needs a shared store before production; this is noted in DEPLOYMENT.md.
- Errors are announced: an error summary with `role="alert"` receives focus, and each field has `aria-invalid` plus `aria-describedby` pointing at its message.
- Delivery goes through Resend's REST API to `INQUIRY_NOTIFICATION_EMAIL`, with `reply_to` set to the visitor's address.
- **Success is shown only on a 2xx response with a Resend message id.**
  - Unit tests cover 2xx without an id, 403 and 500 → not success.
  - Route tests cover 503 when unconfigured, 400 for invalid input, 400 for a honeypot hit, 502 on provider failure, and 429 on a burst.
  - The e2e run against the real route with no env set shows "Inquiries are temporarily unavailable. Please try again soon." and never the success message.

**Real end-to-end test inquiry: blocked.** The Vercel project has no environment variables (checked through the Vercel API on Sept 29). No `RESEND_API_KEY` or `INQUIRY_NOTIFICATION_EMAIL` has been supplied, so no real email could be sent. The preview therefore shows the honest "temporarily unavailable" message.

To close this item:
1. Add the three variables in `.env.example` to the Vercel **Preview** environment.
2. Redeploy the preview.
3. Submit one inquiry.
4. Record the receiving inbox and timestamp here.

**Portfolio filters and lightbox**
- Filters are derived from published projects: All · Birthdays & Milestones · Ministry & Conferences · Brand & Author Events.
- "Dinners & Tablescapes" appears once E05 has media. "Weddings" appears once a wedding project is published (unit-tested).
- Filters deep-link through the URL hash and survive a reload (e2e).
- The lightbox supports Esc, ← and →, a focus trap, focus return to the thumbnail, and swipe on touch (all e2e).

---

## Gate 3: Accessibility (Pass)

**axe** (`@axe-core/playwright`, axe-core 4.13, tags wcag2a/2aa/21a/21aa) on 17 routes (every public route, the legal drafts and the 404):

| Width | Routes | Violations (any impact) | Checks passed |
| --- | --- | --- | --- |
| Desktop Chrome (1280) | 17 | **0** | 383 |
| Pixel 7 (412) | 17 | **0** | 401 |

Raw output: `qa/axe-chromium.json`, `qa/axe-mobile-chromium.json`. One critical issue was found and fixed during QA: `aria-required` on a `<fieldset>`.

**Keyboard** (e2e)
- The skip link is the first tab stop, is visible on focus, and moves to `#main-content`.
- The visible focus ring is 2 px olive-deep.
- The full-screen mobile menu traps focus, closes on Esc and returns focus to its toggle.
- The lightbox traps focus and returns it. One bug was found and fixed during QA: focus wasn't returning after Esc.
- The FAQ uses native `<details>` elements.

**Contrast.** Only the tokens from 07 are used for text: ink, olive, olive-deep and ivory on olive. Taupe and sage are used only for lines and surfaces. The one extra colour is the error red `#8A2C1F`, which is 8.5:1 on white and 7.9:1 on ivory. axe's `color-contrast` rule passes on all 34 route runs.

**Alt text.** Every content image uses the alt text from 06. Gallery thumbnails use `alt=""` inside buttons labelled "Open image: {alt}", so the alt text isn't announced twice.

**Motion**
- Reveal animations fade and rise in 250 ms. `LazyMotion` / `m` renders static markup under reduced motion.
- A CSS rule under `prefers-reduced-motion` forces reveal wrappers to be fully visible from first paint, even before hydration. This is verified by e2e: every wrapper has computed `opacity: 1` and `transform: none` with no scrolling.
- There is a `<noscript>` fallback.
- `HeroVideo` is built but idle, because the source videos are pending. It mounts only when motion is allowed and Save-Data is off, is muted, has no audio track (the pipeline asserts this), uses `playsInline`, and has a 44 px pause/play button with `aria-pressed`.

**Form.** Every input has a `<label for>`. "(required)" and "(optional)" appear as text, not just colour. Errors are tied to fields with `aria-describedby`.

---

## Gate 4: Performance and media (Partial)

**Lighthouse 13.5** (mobile, simulated throttling, production build). Each figure is the median of 3 runs. HTML reports are in `qa/lighthouse/`.

| Page | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Perf (3 runs) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | **93** | 100 | 100 | 100 | 3.1 s | 0 | 20 ms | 92 / 93 / 94 |
| `/services` | **97** | 100 | 100 | 100 | 2.6 s | 0 | 20 ms | 94 / 97 / 97 |
| `/portfolio` | **91** | 100 | 100 | 100 | 3.5 s | 0 | 20 ms | 91 / 91 / 91 |
| `/portfolio/pink-sweet-16-garden-celebration` | **90** | 100 | 100 | 100 | 3.6 s | 0 | 30 ms | 90 / 90 / 92 |
| `/contact` | **99** | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 99 / 99 / 99 |

- **Pass:** Performance ≥ 90, Accessibility 100, Best Practices ≥ 95 and SEO 100 on all five pages. CLS is 0 everywhere, well under 0.05.
- **Short of MMG's 95+ target:** on three pages (90–93).
- **Fail: LCP ≤ 2.5 s** on 4 of 5 pages, at 2.6–3.6 s simulated. The observed (unthrottled) LCP is about 0.2 s.
- **Diagnosis:**
  - The LCP element is the hero or first project photo. It is discoverable in the HTML, eager, `fetchpriority=high`, and about 80 KB AVIF.
  - As an experiment, I replaced the home hero with a 29 KB file. Simulated LCP stayed at **3.1 s**, so image weight isn't the bottleneck.
  - The simulation is bound by the JavaScript it models alongside the image: about 140 KB gzipped of React/Next runtime, plus 25 KB of Framer Motion, which the brief requires.
- **Fixes applied during QA:**
  - `LazyMotion`.
  - `zod/mini`: the contact page bundle dropped from 76 KB to 23 KB and its LCP from 2.9 s to 2.2 s.
  - Allura is no longer preloaded.
  - The phone image-size cap described below.
  - The default favicon (26 KB) was removed.
  - Inlining the CSS was tried, made results worse, and was reverted.
- **Further options** (not taken without sign-off): drop Framer Motion for CSS scroll-driven reveals, or remove client JS from the header.
- **INP** can't be measured in the lab. Total blocking time of 20–30 ms is the proxy.

**Images**
- The pipeline outputs AVIF, WebP and JPG at 800/1600/2400 (JPG q80, AVIF q55, WebP q75).
- They are served through a `<picture>` component with explicit width and height and a responsive `sizes`, not the `next/image` optimizer. The files are already sized and metadata-free, so re-encoding them at runtime would only add cost. This is a deliberate deviation from the "via `next/image`" wording.
- Phones are capped to the 800w files, which is about 2x density on a 390 px screen. The largest file a phone can receive is **163 KB** (`E01-04-800.jpg` as a JPG fallback), under the 400 KB limit.
- The hero is served eagerly with `fetchpriority=high`. The art-directed crops are 3:2 for tablet and 4:5 for phones and desktop. The full arch and the light-up "16" are kept in every crop.

**Video: blocked.** The five source videos (58–157 MB) and three She Rose JPGs (11–14 MB) couldn't be downloaded. The Google Drive connector refuses files over 10 MB, and the `SOURCE-MEDIA` folder is private, so direct download returns a sign-in page.
- The pipeline for them is written and tested up to that point. Encoding settings: H.264 and VP9, audio removed, long edge ≤ 1080, ≤ 12 s, a bitrate ladder until each file is ≤ 3 MB, and an asserted "no audio stream" check.
- Each clip still needs its segment chosen (`start`/`duration`) after scrubbing.
- Until then, Home uses the E01-01 still, E04 uses E04-02 as its hero (its only exported photo), and E05 is unpublished.
- No `.MOV`, `.HEIC` or original filenames exist in `public/` or anywhere in git history (checked with `git log --all --name-only`).

**EXIF/GPS: pass.** Output of `exiftool -r -if '$GPSLatitude or $GPSLongitude or $GPSPosition or $Make or $Model or $DateTimeOriginal or $SerialNumber' public/`:

```
files with GPS/EXIF: 0      (of 139 media files)
```

The pipeline repeats this check with `exiftool-vendored` on every run: `exiftool: 139 files checked, 0 with GPS/EXIF`. A full tag dump of `E01-01-1600.jpg` shows only file-structure tags: type, dimensions, encoding and subsampling.

**Privacy review of each photo** (every frame checked at full resolution)

| Asset | Finding | Action |
| --- | --- | --- |
| E01-02 | An identifiable person is visible through the doorway behind the arch, mid-frame | **Skipped** (can't be cropped out) |
| E01-01/03/04/05/06/07/08/09 | Décor only. Glass shows dark, unidentifiable silhouettes (the photographer) | Kept |
| E02-01, E02-02 | The honoree's first name is legible on the welcome sign | **Blurred** (the whole name line) |
| E03-01/02/03 | The panel shows only the team name ("Guest Experience Ministry"), no church | Kept. 4:5 instead of 3:2 (the portrait source would have cut the garlands) |
| E04-02 | A partial guest at the left edge | **Cropped** (left 8%, including the OG crop) |
| E04-01/03/04 | Not downloaded (over 10 MB) | Pending. E04-03 is marked in 05 as showing an identifiable adult, so it needs review at export |

**Fonts.** Playfair Display 500, Montserrat 400/500/600 and Allura 400, all loaded through `next/font` (self-hosted, `display: swap`). CLS is 0.

---

## Gate 5: SEO and sharing (Pass)

- Each page has a unique title and meta description from 03, a canonical URL, and OG and Twitter tags.
- **OG images at 1200×630:** Home (E01 arch) and all four published projects. E02 includes the blur; E04 is cropped to remove the guest. The e2e test checks that each exists, is 1200×630 and returns 200.
- `sitemap.xml` holds the 7 public pages, 4 projects and 3 articles. Privacy, Terms and the old journal URLs are excluded (e2e).
- `robots.txt` is `Disallow: /` everywhere except `VERCEL_ENV=production`.
- **Previews are `noindex`** through the `X-Robots-Tag` header and the robots meta tag.
- Lighthouse SEO scores of 100 were measured on a `VERCEL_ENV=production` build, because the audit counts `noindex` as a failure.
- **JSON-LD `LocalBusiness`** has exactly: `name`, `url`, `areaServed: "Atlanta, GA"` and `slogan`. `email`, `telephone` and `sameAs` are added automatically only once real values exist. The e2e test asserts there is no address, telephone, rating, review or price range.
- Google's Rich Results Test couldn't be reached from the build environment. **Run it on the preview URL** at review.

---

## Gate 6: Visual and responsive (Partial)

**Screenshots.** Full-page JPEGs at 375, 768, 1280 and 1440, from the production build:
- **After:** `qa/screenshots/after/` holds 68 images, 17 routes × 4 widths.
- **Before:** `qa/screenshots/before/` holds 48 images: the previous build (commit `e2833da`, aubergine/Cormorant with placeholders), 12 routes × 4 widths.

| Route | After | Before |
| --- | --- | --- |
| Home | [375](qa/screenshots/after/home-375.jpg) · [768](qa/screenshots/after/home-768.jpg) · [1280](qa/screenshots/after/home-1280.jpg) · [1440](qa/screenshots/after/home-1440.jpg) | [375](qa/screenshots/before/home-375.jpg) · [1440](qa/screenshots/before/home-1440.jpg) |
| Services | [375](qa/screenshots/after/services-375.jpg) · [768](qa/screenshots/after/services-768.jpg) · [1280](qa/screenshots/after/services-1280.jpg) · [1440](qa/screenshots/after/services-1440.jpg) | [375](qa/screenshots/before/services-375.jpg) · [1440](qa/screenshots/before/services-1440.jpg) |
| Portfolio | [375](qa/screenshots/after/portfolio-375.jpg) · [768](qa/screenshots/after/portfolio-768.jpg) · [1280](qa/screenshots/after/portfolio-1280.jpg) · [1440](qa/screenshots/after/portfolio-1440.jpg) | [375](qa/screenshots/before/portfolio-375.jpg) · [1440](qa/screenshots/before/portfolio-1440.jpg) |
| Sweet 16 | [375](qa/screenshots/after/portfolio_pink-sweet-16-garden-celebration-375.jpg) · [1440](qa/screenshots/after/portfolio_pink-sweet-16-garden-celebration-1440.jpg) | n/a (new) |
| Ministry wall | [375](qa/screenshots/after/portfolio_guest-experience-ministry-backdrop-375.jpg) · [1440](qa/screenshots/after/portfolio_guest-experience-ministry-backdrop-1440.jpg) | n/a (new) |
| Level 29 | [375](qa/screenshots/after/portfolio_level-29-game-night-375.jpg) · [1440](qa/screenshots/after/portfolio_level-29-game-night-1440.jpg) | n/a (new) |
| She Rose | [375](qa/screenshots/after/portfolio_she-rose-author-event-375.jpg) · [1440](qa/screenshots/after/portfolio_she-rose-author-event-1440.jpg) | n/a (new) |
| Process | [375](qa/screenshots/after/process-375.jpg) · [1440](qa/screenshots/after/process-1440.jpg) | [375](qa/screenshots/before/process-375.jpg) · [1440](qa/screenshots/before/process-1440.jpg) |
| Helpful Reads | [375](qa/screenshots/after/helpful-reads-375.jpg) · [1440](qa/screenshots/after/helpful-reads-1440.jpg) | Journal: [375](qa/screenshots/before/journal-375.jpg) · [1440](qa/screenshots/before/journal-1440.jpg) |
| About | [375](qa/screenshots/after/about-375.jpg) · [1440](qa/screenshots/after/about-1440.jpg) | [375](qa/screenshots/before/about-375.jpg) · [1440](qa/screenshots/before/about-1440.jpg) |
| Contact | [375](qa/screenshots/after/contact-375.jpg) · [1440](qa/screenshots/after/contact-1440.jpg) | [375](qa/screenshots/before/contact-375.jpg) · [1440](qa/screenshots/before/contact-1440.jpg) |
| 404 | [375](qa/screenshots/after/does-not-exist-375.jpg) · [1440](qa/screenshots/after/does-not-exist-1440.jpg) | [375](qa/screenshots/before/does-not-exist-375.jpg) · [1440](qa/screenshots/before/does-not-exist-1440.jpg) |

All four widths exist for every route in both folders. The table links a subset.

- **No horizontal scroll at 320 px** on 11 representative routes (e2e).
- **Tap targets ≥ 44 px** on every mobile route (`qa/tap-targets-mobile-chromium.json`: 0 undersized). Stretched card links count their whole card as the target.
- **No text on photos:** the layout never overlays text on imagery.
- **Treatment A:** ivory ground, white cards with a 2 px olive top rule, an olive button, and a text wordmark with a Montserrat descriptor. Playfair is used for headings, Montserrat for body and UI, and Allura for the tagline only, at 28 px or larger and at most once per view.
- **Cross-browser: partial.** This build environment ships only Chromium, and installing browsers isn't permitted here. Desktop Chrome and Pixel 7 (mobile Chromium) pass. Firefox, desktop Safari and iPhone WebKit projects are already defined in `playwright.config.ts`. Run `npx playwright install firefox webkit && PW_ALL_BROWSERS=1 npm run test:e2e` on any machine, or spot-check the preview on an iPhone at review.

---

## Gate 7: Code quality (Pass)

```
$ npx tsc --noEmit          → 0 errors
$ npx eslint .              → 0 errors, 0 warnings
$ npx next build            → ✓ Compiled successfully, 22 routes, no warnings
$ npm test                  → Test Files 3 passed · Tests 30 passed
$ npm run test:e2e          → 142 passed, 4 skipped (device-specific: desktop-only nav and swipe on the other project), 0 failed
```

- **Unit tests** (`tests/unit/`):
  - Published-only filtering, rank order, media-less projects dropped, hero fallback.
  - Filters derived from data, including the automatic Weddings tab.
  - Featured order E01 → E03 → E02, E01-02 never published, summary sentence.
  - Schema: required fields, service list, consent, honeypot, email/phone/URL, free-text budget, HTML escaping.
  - Mailer: success only on 2xx with an id, `reply_to`.
  - Rate limiter.
  - API route: 503, 400, honeypot, 200 then 429, 502.
- **E2E tests** (`tests/e2e/`): routes, 404, redirects, sitemap/robots, noindex drafts, JSON-LD, OG images, navigation, mobile menu, filters, lightbox (keyboard and swipe), form validation, mocked success, mocked failure, real unconfigured submit, honeypot, axe, 320 px, tap targets, reduced motion.
  - The "real run" of the form is the honest-unavailable path. A real send needs the Resend variables.
- **Content layer.** All copy is in `src/content/*.ts` (site, home, services, portfolio, process, about, helpful-reads, inquiry, legal, focal-points, plus the generated media-manifest). Components hold no copy, and even the aria and screen-reader labels come from content.
- **Secrets.** Secrets are read only from env vars and documented in `.env.example`. No credentials are committed.

---

## Gate 8: Release discipline (Pass, one deviation)

- The work is on a feature branch and opened as a PR with this report and the screenshots. It is **deployed as a Vercel preview only.**
- **Deviation:** the branch is `claude/nifty-clarke-ban1kt`, the branch this Claude Code session is permitted to push, instead of `feat/first-pass-build-2026-09-28`.
- The package docs weren't copied into `docs/radiant-package/`. The environment's permission check blocked committing them, so they were read from a local copy. Add them later if wanted.
- Not done: merge, production deploy, domain or DNS changes, or any change to `lwn-website`.

---

## Changed files (vs `e2833da`)

96 files: 57 added, 15 deleted, 25 modified. This excludes the 139 generated media files in `public/images/portfolio/` and the 116 screenshots.

- **Added:**
  - `scripts/process-media.mjs`
  - `src/content/{site,home,process,about,helpful-reads,inquiry,legal,media,media-manifest,focal-points}.ts`
  - `src/lib/{inquiry,mailer,rate-limit,env,slug,page-metadata}.ts`
  - `src/app/api/inquiry/route.ts`
  - `src/app/helpful-reads/**`
  - `src/app/{manifest.ts,icon.svg}`
  - `src/components/{Picture,Wordmark,HeroVideo,PortfolioGrid,Gallery,InquiryForm,LegalDraft,sections}.tsx`
  - `tests/**`, `vitest.config.ts`, `playwright.config.ts`
  - `qa/**` (scripts and evidence), `.env.example`, `QA-REPORT.md`
- **Modified:**
  - `src/app/{layout,page,globals.css,not-found,sitemap,robots}`
  - `src/app/{services,portfolio,portfolio/[slug],process,about,contact,privacy,terms}/page.tsx`
  - `src/components/{SiteHeader,SiteFooter,motion/Reveal}.tsx`
  - `src/content/{portfolio,services}.ts`
  - `next.config.ts`, `package.json`, `.gitignore`, `README.md`, `DEPLOYMENT.md`
- **Deleted:**
  - `public/brand/radiant-events-logo.png`, `src/app/favicon.ico`
  - `src/components/PlaceholderMedia.tsx`, `src/components/sections/{HomeHero,PageHero}.tsx`
  - `src/app/journal/**`, `src/app/services/[slug]/page.tsx`
  - `src/app/{portfolio,contact}/layout.tsx`
  - `src/lib/{site-config,inquiry-schema}.ts`, `src/content/journal.ts`
  - `CONTENT_NEEDED.md`, `BRAND_IMPLEMENTATION.md`

---

## Client review checklist (Omar with Rickya)

1. **Founder story, portrait and quote.** Rickya will send these. The slots are built (`src/content/about.ts`) and render nothing until filled.
2. **Reply window.** Keep "two business days" (C11), or change it.
3. **Budget field.** Keep it as open text, or switch to a dropdown (Rickya supplies the ranges; it's a config change).
4. **Inquiry destination email, and whether the test inquiry arrived.** Not yet possible: the Resend key and inbox need adding in Vercel first.
5. **Social links, and whether a public email or phone number should appear.** Each renders automatically once added to `site.ts`.
6. **Naming.** Whether any church or conference should be named in the copy. It's currently generic.
7. **She Rose photographer credit,** if wanted. Also confirm Radiant's exact scope wording for E04.
8. **Travel radius and fee wording.** The FAQ currently says "Share your location and we'll confirm availability."
9. **The final Privacy Policy and Terms before production.** The drafts are at `/privacy` and `/terms` (noindex, unlinked).
10. **Overall look, photo order, and hero video versus still.** The still is live. The video is pending the source files.

**Also for the review:**
- **Pending media.** The She Rose JPGs E04-01, E04-03 and E04-04, and the five videos, are waiting on the `SOURCE-MEDIA` folder being link-shared, or on the files being placed in `_source-media/`. After that, `npm run media` handles everything. The E05 tablescape project and its filter appear automatically once its video is processed.
- **E01 wording.** Confirm the "16" marquee numbers and the cocktail-table styling were Radiant-supplied (a pending fact in 04).
- **Withheld photo.** E01-02 is withheld because it shows an identifiable person in the doorway.
