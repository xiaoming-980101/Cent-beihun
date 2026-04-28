import { useTheme as useNextTheme } from "next-themes";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
    const { theme, setTheme, systemTheme } = useNextTheme();

    return {
        theme: theme as Theme,
        setTheme: (newTheme: Theme) => setTheme(newTheme),
        systemTheme: systemTheme as "light" | "dark" | undefined,
        toggle: () => {
            const currentTheme = theme === "system" ? systemTheme : theme;
            setTheme(currentTheme === "dark" ? "light" : "dark");
        },
    };
}
