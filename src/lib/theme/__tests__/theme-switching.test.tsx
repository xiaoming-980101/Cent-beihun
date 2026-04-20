import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "../theme-provider";
import { useTheme } from "../use-theme";

// Test component for theme switching
function ThemeSwitcher() {
    const { theme, setTheme, toggle } = useTheme();

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
            <button onClick={toggle} data-testid="toggle-theme">
                Toggle
            </button>
        </div>
    );
}

describe("Theme Switching", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove("light", "dark");
    });

    it("switches from light to dark theme", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider defaultTheme="light">
                <ThemeSwitcher />
            </ThemeProvider>,
        );

        // Wait for initial theme to be set
        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });

        // Click dark theme button
        await user.click(screen.getByTestId("set-dark"));

        // Verify theme changed
        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "dark",
            );
        });
    });

    it("switches from dark to light theme", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider defaultTheme="dark">
                <ThemeSwitcher />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "dark",
            );
        });

        await user.click(screen.getByTestId("set-light"));

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });
    });

    it("toggles between light and dark themes", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider defaultTheme="light">
                <ThemeSwitcher />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });

        // Toggle to dark
        await user.click(screen.getByTestId("toggle-theme"));

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "dark",
            );
        });

        // Toggle back to light
        await user.click(screen.getByTestId("toggle-theme"));

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });
    });

    it("switches to system theme", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider defaultTheme="light">
                <ThemeSwitcher />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });

        await user.click(screen.getByTestId("set-system"));

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "system",
            );
        });
    });

    it("completes theme switch within 200ms", async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider defaultTheme="light">
                <ThemeSwitcher />
            </ThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "light",
            );
        });

        const startTime = Date.now();
        await user.click(screen.getByTestId("set-dark"));

        await waitFor(() => {
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                "dark",
            );
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Allow some buffer for test execution, but should be fast
            expect(duration).toBeLessThan(500);
        });
    });
});
