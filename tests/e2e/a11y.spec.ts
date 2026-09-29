import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import fs from "node:fs";

const routes = [
  "/", "/services", "/portfolio", "/portfolio/pink-sweet-16-garden-celebration", "/portfolio/guest-experience-ministry-backdrop",
  "/portfolio/level-29-game-night", "/portfolio/she-rose-author-event", "/process", "/helpful-reads",
  "/helpful-reads/questions-before-booking-your-venue", "/helpful-reads/how-to-build-a-cohesive-color-palette",
  "/helpful-reads/planning-timeline-first-year", "/about", "/contact", "/privacy", "/terms", "/does-not-exist",
];

test.describe.configure({ mode: "serial" });
const summary: Record<string, unknown>[] = [];

for (const route of routes) {
  test(`axe: ${route}`, async ({ page }, info) => {
    await page.goto(route);
    // Reveal-on-scroll content must be in its final state before scanning.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    summary.push({
      project: info.project.name, route,
      violations: results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      passes: results.passes.length,
    });
    expect(serious, JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), null, 1)).toEqual([]);
  });
}

test.afterAll(async ({}, info) => {
  fs.mkdirSync("qa", { recursive: true });
  fs.writeFileSync(`qa/axe-${info.project.name}.json`, JSON.stringify(summary, null, 2));
});
