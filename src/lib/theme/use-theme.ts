import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
    const { theme, setTheme, systemTheme } = useNextTheme();

    return {
        theme: theme as "light" | "dark" | "system",
        setTheme: (newTheme: "light" | "dark" | "system") => setTheme(newTheme),
        systemTheme: systemTheme as "light" | "dark" | undefined,
        toggle: () => {
            const currentTheme = theme === "system" ? systemTheme : theme;
            setTheme(currentTheme === "dark" ? "light" : "dark");
        },
    };
}
