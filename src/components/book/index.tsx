import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useIsLogin } from "@/store/user";
import { cn } from "@/utils";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ui/dialog/index";
import { BookForm } from "./form";
import { showBookGuide } from "./util";

export default function BookGuide() {
    const t = useIntl();
    const isLogin = useIsLogin();
    const { currentBookId } = useBookStore();
    if (!isLogin) {
        return null;
    }
    if (currentBookId !== undefined) {
        return null;
    }

    return (
        <Dialog.Root open={currentBookId === undefined}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed z-[2] inset-0 bg-black/50 data-[state=open]:animate-overlay-show"></Dialog.Overlay>
                <Dialog.Content>
                    <VisuallyHidden.Root>
                        <Dialog.Title>{t("select-a-book")}</Dialog.Title>
                        <Dialog.Description>
                            {t("select-a-book")}
                        </Dialog.Description>
                    </VisuallyHidden.Root>
                    <div className="fixed z-[3] top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
                        <Dialog.Content
                            className={cn(
                                "bg-background max-h-[55vh] w-fit max-w-[500px] rounded-md data-[state=open]:animate-content-show",
                            )}
                        >
                            <VisuallyHidden.Root>
                                <Dialog.Title>
                                    {t("select-a-book")}
                                </Dialog.Title>
                                <Dialog.Description>
                                    {t("select-a-book")}
                                </Dialog.Description>
                            </VisuallyHidden.Root>
                            <BookForm />
                        </Dialog.Content>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function BookSettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const t = useIntl();

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("ledger-books")}
            maxWidth="md"
            fullScreenOnMobile={true}
        >
            <BookForm />
        </ResponsiveDialog>
    );
}

export function BookSettings() {
    const t = useIntl();
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-pink-50 text-pink-500 dark:bg-pink-500/12">
                            <i className="icon-[mdi--book-cog-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("ledger-books")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                管理账本、切换当前数据空间
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
            <BookSettingsDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
