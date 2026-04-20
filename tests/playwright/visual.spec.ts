import { expect, test } from "@playwright/test";

const FIXED_TIME = "2026-04-16T08:00:00.000Z";

async function freezeTime(page: import("@playwright/test").Page) {
    await page.addInitScript((isoTime) => {
        const fixedTimestamp = new Date(isoTime).valueOf();
        const NativeDate = Date;
        class MockDate extends NativeDate {
            constructor(...args: ConstructorParameters<typeof Date>) {
                if (args.length === 0) {
                    super(fixedTimestamp);
                    return;
                }
                super(...args);
            }
            static now() {
                return fixedTimestamp;
            }
        }
        Object.setPrototypeOf(MockDate, NativeDate);
        Object.defineProperty(window, "Date", {
            configurable: true,
            writable: true,
            value: MockDate,
        });
    }, FIXED_TIME);
}

async function presetTheme(
    page: import("@playwright/test").Page,
    mode: "light" | "dark",
) {
    await page.addInitScript((themeMode) => {
        localStorage.setItem("theme", themeMode);
        localStorage.setItem("wedding-theme", themeMode);
        document.documentElement.classList.toggle("dark", themeMode === "dark");
    }, mode);
}

async function waitForVisualSettle(page: import("@playwright/test").Page) {
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
}

const pages = [
    "/",
    "/tools",
    "/tools/gift-book",
    "/stat",
    "/tools/guests",
    "/tasks",
    "/search",
    "/tools/wedding-budget",
];

for (const route of pages) {
    test(`visual snapshot light ${route}`, async ({ page }) => {
        await freezeTime(page);
        await presetTheme(page, "light");
        await page.goto(route);
        await waitForVisualSettle(page);
        const maxDiffPixelRatio = route === "/" ? 0.15 : 0.03;
        await expect(page).toHaveScreenshot(
            `light-${route.replaceAll("/", "_") || "home"}.png`,
            { fullPage: true, maxDiffPixelRatio },
        );
    });

    test(`visual snapshot dark ${route}`, async ({ page }) => {
        await freezeTime(page);
        await presetTheme(page, "dark");
        await page.goto(route);
        await waitForVisualSettle(page);
        const maxDiffPixelRatio = route === "/" ? 0.15 : 0.03;
        await expect(page).toHaveScreenshot(
            `dark-${route.replaceAll("/", "_") || "home"}.png`,
            { fullPage: true, maxDiffPixelRatio },
        );
    });
}
