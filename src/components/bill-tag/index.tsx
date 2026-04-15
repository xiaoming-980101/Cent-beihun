import { useIntl } from "@/locale";
import createConfirmProvider from "../confirm";
import { Button } from "../ui/button";
import TagList from "./list";

export const [TagListProvider, showTagList] = createConfirmProvider(TagList, {
    dialogTitle: "Edit Tag",
    dialogModalClose: true,
    contentClassName:
        "h-full w-full max-h-full max-w-full rounded-none sm:rounded-md sm:max-h-[55vh] sm:w-[90vw] sm:max-w-[500px] overflow-hidden",
});

export default function TagSettingsItem() {
    const t = useIntl();
    return (
        <div className="edit-tag">
            <Button
                onClick={() => {
                    showTagList();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-orange-50 text-orange-500 dark:bg-orange-500/12">
                            <i className="icon-[mdi--tag-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("edit-tags")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                自定义标签与筛选条件维护
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
        </div>
    );
}
