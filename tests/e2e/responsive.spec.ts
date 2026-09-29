import { expect, test } from "@playwright/test";
import fs from "node:fs";

const routes = [
  "/", "/services", "/portfolio", "/portfolio/pink-sweet-16-garden-celebration", "/portfolio/she-rose-author-event",
  "/process", "/helpful-reads", "/helpful-reads/how-to-build-a-cohesive-color-palette", "/about", "/contact", "/does-not-exist",
];

test.describe("320px", () => {
  test.use({ viewport: { width: 320, height: 700 } });
  for (const r of routes) {
    test(`no horizontal scroll at 320px: ${r}`, async ({ page }) => {
      await page.goto(r);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test("tap targets are at least 44px (outside running text)", async ({ page, isMobile }, info) => {
  test.skip(!isMobile, "mobile only");
  const report: { route: string; small: string[] }[] = [];
  for (const r of routes) {
    await page.goto(r);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea, summary")]
        .filter((el) => {
          if (el.closest("p, li p, #honeypot") || el.closest('[aria-hidden="true"]')) return false;
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none" || el.classList.contains("sr-only")) return false;
          const b = el.getBoundingClientRect();
          if (b.width === 0 && b.height === 0) return false;
          // Checkbox targets are their whole label; stretched card links cover their card.
          const stretched = /after:absolute/.test(el.className) ? el.closest("article, li") : null;
          const target = stretched ?? el.closest("label") ?? el;
          const t = target.getBoundingClientRect();
          return t.height < 44 || t.width < 24;
        })
        .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || el.id).trim().slice(0, 40)}"`),
    );
    report.push({ route: r, small });
  }
  fs.writeFileSync(`qa/tap-targets-${info.project.name}.json`, JSON.stringify(report, null, 2));
  expect(report.filter((x) => x.small.length)).toEqual([]);
});

test.describe("reduced motion", () => {
  test("no reveal animations and no background video", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // Before any scrolling, every reveal wrapper must already be fully visible and static.
    const states = await page.locator("[data-reveal]").evaluateAll((els) =>
      els.map((el) => { const s = getComputedStyle(el); return `${s.opacity}|${s.transform}`; }),
    );
    expect(states.every((s) => s === "1|none")).toBe(true);
    await expect(page.locator("video")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
  });
});
