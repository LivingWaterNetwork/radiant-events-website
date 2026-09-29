# Deployment

Vercel project: `radiant-events-website`. **First-pass review is preview-only.** Production deploys,
domain and DNS changes wait for Rickya's approval of the review.

## Preview

Every push to a non-production branch builds a Vercel preview. Previews are always `noindex`
(`X-Robots-Tag` header, robots meta and a disallow-all `robots.txt`), because only
`VERCEL_ENV=production` enables indexing (`src/lib/env.ts`).

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Needed for | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Inquiry delivery | Set for Preview (and Production later) |
| `INQUIRY_NOTIFICATION_EMAIL` | Inquiry delivery | Where inquiries go; comma-separate for several |
| `INQUIRY_FROM_EMAIL` | Inquiry delivery | Sender on a domain verified in Resend. Without it Resend's test sender is used, which only delivers to the Resend account owner |

After setting them, redeploy the preview and send one real test inquiry; record the inbox and
time in `QA-REPORT.md`.

## Before production (blocked on the client review)

- [ ] Rickya approves the first-pass review (checklist in `QA-REPORT.md`)
- [ ] Inquiry email confirmed, test inquiry received, Privacy Policy approved (decision D10)
- [ ] Final Privacy Policy and Terms, then add them to `site.legal` so the footer links them
- [ ] Remaining media processed (She Rose photographer JPGs and the five videos)
- [ ] Rate limiting moved to a shared store (the in-memory limiter is per instance)
- [ ] `site.url` matches the production domain (`https://www.radianteventsplanning.com`)
