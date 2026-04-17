import { useState } from "react";
import { toast } from "sonner";
import { StorageAPI } from "@/api/storage";
import { useCreators } from "@/hooks/use-creator";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { FormDialog } from "../ui/dialog/form-dialog";
import { prompt } from "../ui/dialog/utils";
import Deletable from "../deletable";
import { Button } from "../ui/button";

function UserManagementDialog({ 
    open, 
    onOpenChange 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
}) {
    const t = useIntl();
    const { id, avatar_url, name: myName } = useUserStore();
    const { currentBookId } = useBookStore();
    const creators = useCreators();
    const collaboratorSettingsUrl =
        StorageAPI.type === "github"
            ? `https://github.com/${currentBookId}/settings/access`
            : StorageAPI.type === "gitee"
              ? `https://gitee.com/${currentBookId}/team`
              : undefined;

    const toEditName = async (user: { id: string }) => {
        const newName = await prompt({
            title: t("please-enter-nickname"),
            inputType: "text",
            placeholder: "请输入昵称",
            validate: (value) => value.trim().length > 0 || "昵称不能为空"
        });
        
        if (!newName) {
            return;
        }
        
        await useLedgerStore.getState().updatePersonalMeta((prev) => {
            if (!prev.names) {
                prev.names = {};
            }
            prev.names[user.id] = newName;
            return prev;
        });
    };
    
    const toRecoverName = async (user: { id: string }) => {
        await useLedgerStore.getState().updatePersonalMeta((prev) => {
            if (!prev.names) {
                prev.names = {};
            }
            delete prev.names[user.id];
            return prev;
        });
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("user-management")}
            maxWidth="md"
            fullScreenOnMobile={true}
        >
            <div className="space-y-4">
                <div>
                    <div className="mb-2 text-sm text-[color:var(--wedding-text-mute)]">{t("me")}</div>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={avatar_url}
                                alt={myName}
                                className="h-12 w-12 rounded-full border"
                            />
                            <div>
                                <div className="font-semibold text-[color:var(--wedding-text)]">{myName}</div>
                                <div className="text-sm text-[color:var(--wedding-text-mute)]">{id}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-2 text-sm text-[color:var(--wedding-text-mute)]">
                        {t("collaborators")}
                    </div>
                    <div className="space-y-2">
                        {creators
                            .filter((u) => u.id !== id)
                            .map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between gap-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="h-12 w-12 rounded-full border"
                                        />
                                        <div>
                                            {user.name !== user.originalName ? (
                                                <Deletable
                                                    className="[&_.delete-button]:bg-stone-800"
                                                    onDelete={() => {
                                                        toRecoverName(user);
                                                    }}
                                                    icon={
                                                        <i className="icon-[mdi--reload] size-3 text-white"></i>
                                                    }
                                                >
                                                    <div className="font-semibold text-[color:var(--wedding-text)]">
                                                        {user.name}
                                                    </div>
                                                </Deletable>
                                            ) : (
                                                <div className="font-semibold text-[color:var(--wedding-text)]">
                                                    {user.name}
                                                </div>
                                            )}
                                            <div className="text-sm text-[color:var(--wedding-text-mute)]">
                                                {user.id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => {
                                                toEditName(user);
                                            }}
                                        >
                                            <i className="icon-[mdi--pencil]" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                if (!collaboratorSettingsUrl) {
                                                    toast.info(
                                                        "当前同步方式不支持在线协作者管理，请在对应平台手动处理",
                                                    );
                                                    return;
                                                }
                                                window.open(
                                                    collaboratorSettingsUrl,
                                                    "_blank",
                                                    "noopener,noreferrer",
                                                );
                                            }}
                                        >
                                            <i className="icon-[mdi--settings]" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </FormDialog>
    );
}

export default function UserSettingsItem() {
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
                        <div className="wedding-settings-item__icon bg-sky-50 text-sky-500 dark:bg-sky-500/12">
                            <i className="icon-[mdi--account-supervisor-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("user-management")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                协作者、昵称与访问设置
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
            <UserManagementDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
