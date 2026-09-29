import { expect, test } from "@playwright/test";

test("skip link is first in tab order and moves focus to main", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "WebKit needs full keyboard access enabled for links");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("primary navigation reaches every section", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "desktop nav");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [label, h1] of [
    ["Services", "Planning, design, and installations"],
    ["Portfolio", "Celebrations we've brought to life."],
    ["Process", "Our Process"],
    ["Helpful Reads", "Helpful Reads"],
    ["About", "Planning with Purpose"],
  ]) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page.locator("h1")).toContainText(h1);
  }
  await nav.getByRole("link", { name: "Start Your Event Inquiry" }).click();
  await expect(page.locator("h1")).toHaveText("Start Your Event Inquiry");
});

test("mobile menu traps focus, closes on Esc and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile menu");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  const links = await dialog.getByRole("link").allTextContents();
  expect(links.slice(1)).toEqual(["Services", "Portfolio", "Process", "Helpful Reads", "About", "Start Your Event Inquiry"]);
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("portfolio filters show only populated event types and filter the grid", async ({ page }) => {
  await page.goto("/portfolio");
  const group = page.getByRole("group", { name: "Filter projects by event type" });
  await expect(group.getByRole("button")).toHaveText(["All", "Birthdays & Milestones", "Ministry & Conferences", "Brand & Author Events"]);
  const cards = page.locator("main ul.grid > li");
  await expect(cards).toHaveCount(4);
  await group.getByRole("button", { name: "Birthdays & Milestones" }).click();
  await expect(cards).toHaveCount(2);
  await expect(group.getByRole("button", { name: "Birthdays & Milestones" })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/#birthdays-and-milestones$/);
  await page.reload();
  await expect(cards).toHaveCount(2);
  await group.getByRole("button", { name: "All" }).click();
  await expect(cards).toHaveCount(4);
});

test("lightbox works with keyboard and returns focus", async ({ page }) => {
  await page.goto("/portfolio/pink-sweet-16-garden-celebration");
  const trigger = page.getByRole("button", { name: /^Open image:/ }).nth(1);
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Project gallery" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Image 2 of 8")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("Image 3 of 8")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("Image 1 of 8")).toBeVisible();
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("lightbox responds to swipe", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch");
  await page.goto("/portfolio/pink-sweet-16-garden-celebration");
  await page.getByRole("button", { name: /^Open image:/ }).first().click();
  const dialog = page.getByRole("dialog", { name: "Project gallery" });
  const swipe = (from: number, to: number) =>
    dialog.evaluate((el, [a, b]) => {
      const t = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 300 });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [t(a)], changedTouches: [t(a)], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [t(b)], bubbles: true }));
    }, [from, to]);
  await swipe(300, 100);
  await expect(dialog.getByText("Image 2 of 8")).toBeVisible();
  await swipe(100, 300);
  await expect(dialog.getByText("Image 1 of 8")).toBeVisible();
});

test("services cards on Home link to their anchors", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Custom Design Details" }).click();
  await expect(page).toHaveURL(/\/services#custom-design-details$/);
  await expect(page.locator("#custom-design-details")).toBeInViewport();
});
