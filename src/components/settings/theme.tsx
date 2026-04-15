import { type Theme, useTheme } from "@/hooks/use-theme";
import { useIntl } from "@/locale";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function ThemeSettingsItem() {
    const t = useIntl();
    const { theme, setTheme } = useTheme();
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
                <Select
                    value={theme}
                    onValueChange={(v) => {
                        setTheme(v as Theme);
                    }}
                >
                    <SelectTrigger className="h-9 w-fit rounded-full border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 text-xs">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="system">
                            {t("theme-system")}
                        </SelectItem>
                        <SelectItem value="light">
                            {t("theme-light")}
                        </SelectItem>
                        <SelectItem value="dark">{t("theme-dark")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
