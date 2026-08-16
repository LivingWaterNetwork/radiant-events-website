# Brand Implementation Notes

Source: `Radiant_Events_Brand_Identity_System.pptx` (client-supplied brand deck).

## Color Tokens

Defined in `src/app/globals.css` and exposed as Tailwind utilities (`bg-aubergine`,
`text-tangerine`, etc.):

| Token | Hex | Usage |
| --- | --- | --- |
| `aubergine` | `#6B183F` | Primary / structure / CTAs (dark) |
| `cream` | `#F7E7C6` | Section backgrounds |
| `cream-light` | `#FFF8EA` | Page background |
| `tangerine` | `#F28A2E` | Primary CTA accent |
| `blush` | `#E5ACBF` | Emotional accent |
| `coral` | `#F28266` | Secondary accent, hover states |
| `ink` | `#21171B` | Dark backgrounds, body text |
| `ink-deep` | `#2A101B` | Darkest hover state |
| `taupe` | `#DCC5B9` | Borders, dividers |
| `stone` | `#7B6F72` | Muted/secondary text |

Target ratio from the brand deck: ~60% cream/neutral, 25% aubergine/ink, 10% tangerine,
5% coral/blush. Gradients are used only on `PlaceholderMedia` (temporary photography
placeholders) — real photography should replace these blocks, not be layered under gradients.

## Typography

- Display: **Cormorant Garamond** (`font-display` utility) — headlines, pull quotes, italic
  accents.
- Body/UI: **Montserrat** (default `font-sans`) — body copy, navigation, forms.
- Loaded via `next/font/google` in `src/app/layout.tsx` for automatic optimization and
  self-hosting (no external font requests at runtime).

## Motion System

- `src/components/motion/Reveal.tsx` exports `Reveal`, `Stagger`, and `StaggerItem` — the shared
  entrance-animation primitives used across every page.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` throughout, matching the brand's calm/assured voice.
- All motion respects `prefers-reduced-motion` via Framer Motion's `useReducedMotion()` — when
  reduced motion is requested, elements render in their final state with no animation.
- The homepage hero (`src/components/sections/HomeHero.tsx`) is the most elaborate sequence:
  masked image scale-in, staggered headline/CTA entrance.
- Interior pages use `PageHero` for a lighter, consistent version of the same reveal pattern.

## Logo Usage

- Source file extracted directly from the brand deck: `public/brand/radiant-events-logo.png`.
- Used as-is in the header (light background) and inverted via CSS filter
  (`brightness-0 invert`) in the dark footer — this is a display-only filter, not a re-export or
  recoloring of the source asset.
- Do not crop, stretch, recolor, shadow, or outline the logo file itself.

## Imagery Placeholders

- `src/components/PlaceholderMedia.tsx` renders brand-colored gradient blocks with a subtle
  botanical line motif — standing in for real photography until it's supplied (see
  `CONTENT_NEEDED.md`). These are intentionally abstract rather than stock photography, so
  nothing resembling a real event is implied before real photography exists.

## Voice

Copy throughout the site follows the brand's four pillars — Gracious, Assured, Refined,
Specific — and avoids generic event-industry language ("your dream event," "where dreams come
true") per the brand deck's explicit guidance.
