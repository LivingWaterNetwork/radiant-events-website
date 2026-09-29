// Usage: node qa/shoot.mjs <baseUrl> <outDir> <route,...> <width,...>
import { chromium } from "@playwright/test";
const [base, out, routes, widths] = process.argv.slice(2);
const browser = await chromium.launch();
for (const w of widths.split(",").map(Number)) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  for (const r of routes.split(",")) {
    const res = await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); }
      window.scrollTo(0, 0);
    });
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
    await page.waitForTimeout(700);
    const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "_")) + `-${w}.jpg`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true, type: "jpeg", quality: 60 });
    console.log(res?.status(), name);
  }
  await page.close();
}
await browser.close();
