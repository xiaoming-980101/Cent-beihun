import { useEffect, useState } from "react";
import { useIntl } from "@/locale";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ui/dialog/index";
import TagList from "./list";

export function TagListProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => setOpen(true);
        window.addEventListener("show-tag-list", handleShow);
        return () => {
            window.removeEventListener("show-tag-list", handleShow);
        };
    }, []);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    window.dispatchEvent(new CustomEvent("tag-list-closed"));
                }
            }}
            title="标签管理"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <TagList
                onCancel={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent("tag-list-closed"));
                }}
            />
        </ResponsiveDialog>
    );
}

export function showTagList(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-tag-list"));
        });
        const handleClose = () => {
            window.removeEventListener("tag-list-closed", handleClose);
            resolve();
        };
        window.addEventListener("tag-list-closed", handleClose);
    });
}

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
