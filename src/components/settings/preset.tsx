import { useIntl } from "@/locale";
import { cn } from "@/utils";
import { PresetProvider, showPreset } from "../preset";
import { Button } from "../ui/button";

const betaClassName = `relative after:content-['beta'] after:rounded after:bg-yellow-400 after:px-[2px] after:text-[8px] after:block after:absolute after:top-0 after:right-0 after:translate-x-[calc(100%+4px)]`;

export default function PresetSettingsItem() {
    const t = useIntl();
    return (
        <div className="preset">
            <Button
                onClick={() => {
                    showPreset();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div
                        className={cn(betaClassName, "flex items-center gap-3")}
                    >
                        <div className="wedding-settings-item__icon bg-fuchsia-50 text-fuchsia-500 dark:bg-fuchsia-500/12">
                            <i className="icon-[mdi--palette-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("preset")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                配置模板与快捷初始化能力
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
            <PresetProvider />
        </div>
    );
}
