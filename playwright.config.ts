import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/playwright",
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    use: {
        baseURL: "http://127.0.0.1:4173",
        trace: "on-first-retry",
    },
    webServer: {
        command: "pnpm preview --port 4173",
        port: 4173,
        reuseExistingServer: true,
    },
    projects: [
        {
            name: "mobile",
            use: { ...devices["iPhone 12"] },
        },
        {
            name: "tablet",
            use: { ...devices["iPad (gen 7)"] },
        },
        {
            name: "desktop",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
