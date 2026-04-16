import { expect, test } from "@playwright/test";

test("home page renders on multiple viewports", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
});

test("tools page renders", async ({ page }) => {
    await page.goto("/tools");
    await expect(page.locator("body")).toBeVisible();
});

