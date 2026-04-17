import { useIntl } from "@/locale";
import { Button } from "../ui/button";
import { BudgetEditProvider, showBudgetEdit } from "./budget-form";
import { BudgetProvider, showBudget } from "./list-form";

export { BudgetProvider, showBudget };

export { BudgetEditProvider, showBudgetEdit };

export default function Budget() {
    const t = useIntl();
    return (
        <div className="backup">
            <Button
                onClick={() => {
                    showBudget();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-fuchsia-50 text-fuchsia-500 dark:bg-fuchsia-500/12">
                            <i className="icon-[mdi--calculator] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("budget-manager")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                设置预算规则并查看执行进度
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
        </div>
    );
}
