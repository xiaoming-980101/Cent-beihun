import { useIntl, useLocale } from "@/locale";
import { type LocaleName, locales } from "@/locale/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function LanguageSettingsItem() {
    const t = useIntl();
    const { locale, setLocale } = useLocale();
    return (
        <div className="px-1 py-1">
            <div className="wedding-settings-item rounded-[18px]">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="wedding-settings-item__icon bg-blue-50 text-blue-500 dark:bg-blue-500/12">
                        <i className="icon-[mdi--language] size-5"></i>
                    </div>
                    <div className="min-w-0">
                        <div className="wedding-settings-item__title">
                            {t("language")}
                        </div>
                        <div className="wedding-settings-item__desc">
                            切换界面语言与内容展示习惯
                        </div>
                    </div>
                </div>
                <Select
                    value={locale}
                    onValueChange={(v) => {
                        setLocale(v as LocaleName);
                        setTimeout(() => {
                            location.reload();
                        }, 10);
                    }}
                >
                    <SelectTrigger className="h-9 w-fit rounded-full border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 text-xs">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {locales.map((l) => (
                            <SelectItem key={l.name} value={l.name}>
                                {l.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
