import { expect, test, type Page } from "@playwright/test";

async function fill(page: Page) {
  await page.getByLabel(/^Full name/).fill("QA Test");
  await page.getByLabel(/^Email/).fill("qa@example.org");
  await page.getByLabel(/^Event date or timing/).fill("Spring 2027");
  await page.getByLabel(/^Venue or city/).fill("Atlanta");
  await page.getByLabel(/^Estimated guest count/).selectOption("50–150");
  await page.getByLabel(/^Event type/).selectOption("Birthday or milestone");
  await page.getByLabel("Balloon & backdrop installations").check();
  await page.getByLabel(/^Tell us about your celebration/).fill("Automated QA check of the inquiry form.");
  await page.getByLabel(/I agree to Radiant Events Planning/).check();
}

test("empty submit announces errors tied to their fields", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send My Inquiry" }).click();
  const summary = page.getByRole("alert").filter({ hasText: "Please check the highlighted fields." });
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  const name = page.getByLabel(/^Full name/);
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "name-error");
  await expect(page.locator("#name-error")).toHaveText("Please enter your full name.");
  await expect(page.locator("#services-error")).toBeVisible();
  await expect(page.locator("#consent-error")).toBeVisible();
});

test("every field has a label and required fields say so in text", async ({ page }) => {
  await page.goto("/contact");
  for (const id of ["name", "email", "phone", "eventDate", "venueOrCity", "guestCount", "eventType", "budget", "inspiration", "message", "referral", "consent"]) {
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  }
  await expect(page.locator('label[for="name"]')).toContainText("(required)");
  await expect(page.locator('label[for="phone"]')).toContainText("(optional)");
});

test("success message appears only after a confirmed send (mocked 200)", async ({ page }) => {
  await page.route("/api/inquiry", (r) => r.fulfill({ status: 200, json: { ok: true } }));
  await page.goto("/contact");
  await fill(page);
  await page.getByRole("button", { name: "Send My Inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Thank you. Your inquiry is on its way." })).toBeVisible();
});

test("provider failure shows the error, never success (mocked 502)", async ({ page }) => {
  await page.route("/api/inquiry", (r) => r.fulfill({ status: 502, json: { ok: false, reason: "error" } }));
  await page.goto("/contact");
  await fill(page);
  await page.getByRole("button", { name: "Send My Inquiry" }).click();
  await expect(page.getByText("Something went wrong sending your inquiry. Please try again in a moment.")).toBeVisible();
  await expect(page.getByText("Thank you. Your inquiry is on its way.")).toHaveCount(0);
});

test("real route without mail env is honest: temporarily unavailable", async ({ page }) => {
  await page.goto("/contact");
  await fill(page);
  await page.getByRole("button", { name: "Send My Inquiry" }).click();
  await expect(page.getByText("Inquiries are temporarily unavailable. Please try again soon.")).toBeVisible();
  await expect(page.getByText("Thank you. Your inquiry is on its way.")).toHaveCount(0);
});

test("honeypot is hidden from people and assistive tech", async ({ page }) => {
  await page.goto("/contact");
  const hp = page.locator("#website");
  await expect(hp).toHaveAttribute("tabindex", "-1");
  expect(await hp.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
});
