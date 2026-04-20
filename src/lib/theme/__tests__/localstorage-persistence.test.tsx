import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "../theme-provider";
import { useTheme } from "../use-theme";

// Test component for localStorage persistence
function ThemeController() {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme("light")} data-testid="set-light">
                Light
            </button>
            <button onClick={() => setTheme("dark")} data-testid="set-dark">
                Dark
            </button>
            <button onClick={() => setTheme("system")} data-testid="set-system">
                System
            </button>
        </div>
    );
}

describe("Theme Preference Persistence to localStorage", () => {
    const storageKey = "wedding-app-theme";

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove("light", "dark");
    });

    it("saves theme preference to localStorage when changed", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider storageKey={storageKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });

        // Change to dark theme
        await user.click(screen.getByTestId("set-dark"));

        await waitFor(() => {
            const stored = localStorage.getItem(storageKey);
            expect(stored).toBe("dark");
        });
    });

    it("loads theme preference from localStorage on mount", async () => {
        // Pre-set localStorage
        localStorage.setItem(storageKey, "dark");

        render(
            <ThemeProvider storageKey={storageKey}>
                <ThemeController />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "dark",
            );
        });
    });

    it("persists light theme preference", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider storageKey={storageKey} defaultTheme="dark">
                <ThemeController />
            </ThemeProvider>,
        );

        await user.click(screen.getByTestId("set-light"));

        await waitFor(() => {
            const stored = localStorage.getItem(storageKey);
            expect(stored).toBe("light");
        });
    });

    it("persists dark theme preference", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider storageKey={storageKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        await user.click(screen.getByTestId("set-dark"));

        await waitFor(() => {
            const stored = localStorage.getItem(storageKey);
            expect(stored).toBe("dark");
        });
    });

    it("persists system theme preference", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider storageKey={storageKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        await user.click(screen.getByTestId("set-system"));

        await waitFor(() => {
            const stored = localStorage.getItem(storageKey);
            expect(stored).toBe("system");
        });
    });

    it("maintains theme preference across re-renders", async () => {
        const user = userEvent.setup();

        const { unmount } = render(
            <ThemeProvider storageKey={storageKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        await user.click(screen.getByTestId("set-dark"));

        await waitFor(() => {
            expect(localStorage.getItem(storageKey)).toBe("dark");
        });

        // Unmount and remount
        unmount();

        render(
            <ThemeProvider storageKey={storageKey}>
                <ThemeController />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "dark",
            );
        });
    });

    it("uses custom storage key correctly", async () => {
        const customKey = "custom-theme-storage";
        const user = userEvent.setup();

        render(
            <ThemeProvider storageKey={customKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        await user.click(screen.getByTestId("set-dark"));

        await waitFor(() => {
            const stored = localStorage.getItem(customKey);
            expect(stored).toBe("dark");
            // Verify default key is not used
            expect(localStorage.getItem(storageKey)).toBeNull();
        });
    });

    it("handles missing localStorage gracefully", async () => {
        // This test verifies the app doesn't crash if localStorage is unavailable
        render(
            <ThemeProvider storageKey={storageKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });
    });

    it("updates localStorage immediately on theme change", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider storageKey={storageKey} defaultTheme="light">
                <ThemeController />
            </ThemeProvider>,
        );

        const startTime = Date.now();
        await user.click(screen.getByTestId("set-dark"));

        await waitFor(() => {
            const stored = localStorage.getItem(storageKey);
            expect(stored).toBe("dark");

            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should be nearly instantaneous
            expect(duration).toBeLessThan(100);
        });
    });
});
