import { useIntl } from "@/locale";
import { cn } from "@/utils";
import { Button } from "../ui/button";
import { ScheduledProvider, showScheduled } from "./list-form";
import { ScheduledEditProvider, showScheduledEdit } from "./scheduled-form";

export {
    ScheduledEditProvider,
    ScheduledProvider,
    showScheduled,
    showScheduledEdit,
};

export default function Scheduled() {
    const t = useIntl();
    const betaClassName = `relative after:content-['beta'] after:rounded after:bg-yellow-400 after:px-[2px] after:text-[8px] after:block after:absolute after:top-0 after:right-0 after:translate-x-[calc(100%+4px)]`;

    return (
        <div className="scheduled">
            <Button
                onClick={() => {
                    showScheduled();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div
                        className={cn("flex items-center gap-3", betaClassName)}
                    >
                        <div className="wedding-settings-item__icon bg-cyan-50 text-cyan-500 dark:bg-cyan-500/12">
                            <i className="icon-[mdi--calendar-clock] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("scheduled-manager")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                管理周期记账模板与自动生成规则
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
        </div>
    );
}
