import { type Theme, useTheme } from "@/lib/theme/use-theme";
import { useIntl } from "@/locale";
import { cn } from "@/utils";
import { Button } from "../ui/button";

export default function ThemeSettingsItem() {
    const t = useIntl();
    const { theme, setTheme } = useTheme();
    const options: Array<{ value: Theme; label: string }> = [
        { value: "system", label: t("theme-system") },
        { value: "light", label: t("theme-light") },
        { value: "dark", label: t("theme-dark") },
    ];

    return (
        <div className="px-1 py-1">
            <div className="wedding-settings-item rounded-[18px]">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="wedding-settings-item__icon bg-violet-50 text-violet-500 dark:bg-violet-500/12">
                        <i className="icon-[mdi--theme-light-dark] size-5"></i>
                    </div>
                    <div className="min-w-0">
                        <div className="wedding-settings-item__title">
                            {t("theme")}
                        </div>
                        <div className="wedding-settings-item__desc">
                            跟随系统或切换浅色、深色主题
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-1">
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme(option.value)}
                            className={cn(
                                "h-8 rounded-full px-3 text-xs",
                                theme === option.value
                                    ? "bg-[color:var(--wedding-text)] text-white hover:bg-[color:var(--wedding-text)]"
                                    : "text-[color:var(--wedding-text-mute)] hover:bg-white/70 dark:hover:bg-white/10",
                            )}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
