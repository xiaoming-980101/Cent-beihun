import { useIntl } from "@/locale";
import { Button } from "../ui/button";
import { CategoryListProvider, showCategoryList } from "./list-form";

export { CategoryListProvider, showCategoryList };

export default function CategorySettingsItem() {
    const t = useIntl();
    return (
        <div className="backup">
            <Button
                onClick={() => {
                    showCategoryList();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-violet-50 text-violet-500 dark:bg-violet-500/12">
                            <i className="icon-[mdi--view-grid-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("edit-categories")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                调整账单分类结构与显示顺序
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
        </div>
    );
}
