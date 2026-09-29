import { expect, test } from "@playwright/test";

const routes: [string, string][] = [
  ["/", "Event Planning & Curated Designs"],
  ["/services", "Planning, design, and installations, together or on their own."],
  ["/portfolio", "Celebrations we've brought to life."],
  ["/portfolio/pink-sweet-16-garden-celebration", "A Pink Sweet 16 Garden Celebration"],
  ["/portfolio/guest-experience-ministry-backdrop", "A Welcome Wall for a Ministry Gathering"],
  ["/portfolio/level-29-game-night", "Level 29: A Game Night Birthday"],
  ["/portfolio/she-rose-author-event", "She Rose: An Author Celebration"],
  ["/process", "Our Process"],
  ["/helpful-reads", "Helpful Reads"],
  ["/helpful-reads/questions-before-booking-your-venue", "Five Questions to Ask Before Booking Your Venue"],
  ["/helpful-reads/how-to-build-a-cohesive-color-palette", "How to Build a Cohesive Color Palette for Your Celebration"],
  ["/helpful-reads/planning-timeline-first-year", "A Realistic Planning Timeline for Your First Year of Engagement"],
  ["/about", "Planning with Purpose. Serving with Grace."],
  ["/contact", "Start Your Event Inquiry"],
];

for (const [path, h1] of routes) {
  test(`${path} renders with its H1 and full business name in the title`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(h1);
    await expect(page).toHaveTitle(/Radiant Events Planning/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });
}

test("unknown routes return the custom 404", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("This page wandered off.");
});

test("unpublished project slugs 404", async ({ page }) => {
  const res = await page.goto("/portfolio/not-a-project");
  expect(res?.status()).toBe(404);
});

const redirects: [string, string][] = [
  ["/journal", "/helpful-reads"],
  ["/journal/planning-timeline-first-year", "/helpful-reads/planning-timeline-first-year"],
  ["/services/planning-coordination", "/services#planning-coordination"],
  ["/services/design-room-styling", "/services#event-decor-styling"],
  ["/services/signature-installations", "/services#balloon-backdrop-installations"],
  ["/services/anything-else", "/services"],
];

for (const [from, to] of redirects) {
  test(`${from} 301s to ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()["location"]).toBe(to);
  });
}

test("sitemap lists public routes only; robots blocks non-production", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/portfolio/pink-sweet-16-garden-celebration");
  expect(sitemap).not.toContain("/privacy");
  expect(sitemap).not.toContain("/terms");
  expect(sitemap).not.toContain("/journal");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//);
});

test("legal drafts are noindex and not linked", async ({ page }) => {
  const res = await page.goto("/privacy");
  expect(res?.headers()["x-robots-tag"]).toContain("noindex");
  await page.goto("/");
  await expect(page.locator('a[href="/privacy"], a[href="/terms"]')).toHaveCount(0);
});

test("JSON-LD LocalBusiness carries only real fields", async ({ page }) => {
  await page.goto("/");
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld["@type"]).toBe("LocalBusiness");
  expect(ld.name).toBe("Radiant Events Planning");
  expect(ld.areaServed).toBe("Atlanta, GA");
  for (const k of ["address", "telephone", "aggregateRating", "review", "priceRange"]) expect(ld).not.toHaveProperty(k);
});

test("no placeholder images or old logo are served", async ({ request }) => {
  expect((await request.get("/brand/radiant-events-logo.png")).status()).toBe(404);
});

for (const slug of ["pink-sweet-16-garden-celebration", "guest-experience-ministry-backdrop", "level-29-game-night", "she-rose-author-event"]) {
  test(`OG image is 1200x630 for /portfolio/${slug}`, async ({ page, request }) => {
    await page.goto(`/portfolio/${slug}`);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toMatch(/-og-1200\.jpg$/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
    expect((await request.get(new URL(og!).pathname)).status()).toBe(200);
  });
}
