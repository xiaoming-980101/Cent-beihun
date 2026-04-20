import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { toast } from "sonner";
import { v4 } from "uuid";
import { useShallow } from "zustand/shallow";
import { getQuickCurrencies } from "@/hooks/use-currency";
import { useIntl } from "@/locale";
import { useLedgerStore } from "@/store/ledger";
import { usePreferenceStore } from "@/store/preference";
import { generateSymmetricKey } from "@/utils/encrypt";
import {
    getCategoriesStr,
    textToBillSystemPrompt,
} from "../assistant/text-to-bill";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ui/dialog/index";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

/**
 * 生成随机字符串（用于 passcode）
 */
function generateRandomPasscode(): string {
    return `relayr-${v4()}`;
}

function QuickEntrySettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const t = useIntl();

    // 获取 relayr 配置
    const relayrConfig = usePreferenceStore(
        useShallow((state) => state.relayr),
    );

    const [enable, setEnable] = useState(relayrConfig?.enable ?? false);
    const [secret, setSecret] = useState(relayrConfig?.passcode ?? "");
    const [showSecret, setShowSecret] = useState(false);
    const [configText, setConfigText] = useState<string>("");

    // 同步 store 的值到本地状态
    useEffect(() => {
        setEnable(relayrConfig?.enable ?? false);
        setSecret(relayrConfig?.passcode ?? "");
    }, [relayrConfig]);

    const handleEnableChange = async (checked: boolean) => {
        setEnable(checked);

        if (checked) {
            // 开启服务：生成新的对称加密密钥和 passcode
            try {
                const newPasscode = generateRandomPasscode();
                const encryptKey = generateSymmetricKey();

                // 立即更新本地状态
                setSecret(newPasscode);

                usePreferenceStore.setState((prev) => ({
                    ...prev,
                    relayr: {
                        enable: true,
                        passcode: newPasscode,
                        encryptKey: encryptKey,
                    },
                }));

                toast.success(t("relayr-enabled"));
            } catch (error) {
                console.error("开启 Relayr 服务失败:", error);
                toast.error(t("relayr-enable-failed"));
                setEnable(false);
            }
        } else {
            // 关闭服务：清空所有 relayr 相关配置
            usePreferenceStore.setState((prev) => {
                return Object.fromEntries(
                    Object.entries(prev).filter(([key]) => key !== "relayr"),
                ) as typeof prev;
            });
            setSecret("");
            toast.success(t("relayr-disabled"));
        }
    };

    const [, copy] = useCopyToClipboard();
    const handleSecretChange = (value: string) => {
        setSecret(value);
        usePreferenceStore.setState((prev) => ({
            ...prev,
            relayr: {
                ...(prev.relayr ?? {}),
                passcode: value,
            },
        }));
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("quick-entry-settings")}
            fullScreenOnMobile={true}
            maxWidth="md"
        >
            <div className="space-y-4">
                {/* Relayr 开关 */}
                <div className="flex items-start justify-between gap-4 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="flex-1">
                        <div className="font-medium text-[color:var(--wedding-text)]">
                            {t("enable-relayr")}
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                            {t("enable-relayr-description")}
                        </div>
                    </div>
                    <Switch
                        checked={enable}
                        onCheckedChange={handleEnableChange}
                    />
                </div>

                {/* Secret 输入框 */}
                {enable && (
                    <div className="space-y-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                        <div>
                            <div className="font-medium text-[color:var(--wedding-text)]">
                                {t("relayr-secret")}
                            </div>
                            <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                {t("relayr-secret-description")}
                            </div>
                        </div>
                        <div className="relative">
                            <Input
                                type={showSecret ? "text" : "password"}
                                value={secret}
                                onChange={(e) =>
                                    handleSecretChange(e.target.value)
                                }
                                disabled
                                placeholder={t("relayr-secret-placeholder")}
                                className="w-full pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSecret(!showSecret)}
                                className="absolute right-0 top-0 flex h-full items-center px-3 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showSecret ? (
                                    <i className="icon-[mdi--eye-off] size-4"></i>
                                ) : (
                                    <i className="icon-[mdi--eye] size-4"></i>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* For：iOS 区域 */}
                {enable && secret && (
                    <div className="space-y-3 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                        <div className="font-medium text-[color:var(--wedding-text)]">
                            {t("ios")}
                        </div>

                        {/* 第一步：复制快捷指令配置 */}
                        <div className="space-y-2">
                            <div className="text-sm text-[color:var(--wedding-text-mute)]">
                                {t("step-1")}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    const prompt = textToBillSystemPrompt(
                                        getCategoriesStr(),
                                        false,
                                    );
                                    const configTextValue = JSON.stringify({
                                        passcode: secret,
                                        prompt,
                                        relayrURL: import.meta.env
                                            .VITE_RELAYR_URL,
                                        encryptKey: relayrConfig?.encryptKey,
                                        version: "1.0",
                                        tags: useLedgerStore
                                            .getState()
                                            .infos?.meta.tags?.map(
                                                (v) => v.name,
                                            )
                                            .join(","),
                                        currencies: getQuickCurrencies().map(
                                            (v) => v.label,
                                        ),
                                    });
                                    setConfigText(configTextValue);
                                    copy(configTextValue);
                                    toast.success(
                                        t("quick-entry-config-copied"),
                                        { duration: 2000 },
                                    );
                                }}
                                className="w-full"
                            >
                                <i className="icon-[mdi--content-copy] mr-2 size-4"></i>
                                {t("copy-quick-entry-config")}
                            </Button>
                            {configText && (
                                <div className="mt-2 h-[70px] overflow-y-auto break-all rounded border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-600 !select-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                    {configText}
                                </div>
                            )}
                        </div>

                        {/* 第二步：安装快捷指令Relayr版 */}
                        <div className="space-y-2">
                            <div className="text-sm text-[color:var(--wedding-text-mute)]">
                                {t("step-2")}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    window.open(
                                        "https://www.icloud.com/shortcuts/31529bde07134e5d931b51ed158ea303",
                                        "_blank",
                                        "noopener,noreferrer",
                                    );
                                }}
                                className="w-full"
                            >
                                {t("install-shortcut")}
                            </Button>
                        </div>
                    </div>
                )}

                {/* For：Android 区域 */}
                {enable && secret && (
                    <div className="rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                        <div className="mb-3 font-medium text-[color:var(--wedding-text)]">
                            {t("android")}
                        </div>
                        <div className="text-sm text-[color:var(--wedding-text-mute)]">
                            {t("to-be-continued")}
                        </div>
                    </div>
                )}

                {/* 帮助链接 */}
                <div className="flex justify-center">
                    <a
                        href={t("quick-entry-help-url")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-500 underline transition-opacity hover:text-blue-600 hover:opacity-80"
                    >
                        <i className="icon-[mdi--help-circle-outline] size-4"></i>
                        {t("quick-entry-help-link")}
                    </a>
                </div>
            </div>
        </ResponsiveDialog>
    );
}

export default function QuickEntrySettingsItem() {
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
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="wedding-settings-item__icon bg-amber-50 text-amber-500 dark:bg-amber-500/12">
                            <i className="icon-[mdi--lightning-bolt-outline] size-5"></i>
                        </div>
                        <div className="min-w-0">
                            <div className="wedding-settings-item__title">
                                {t("quick-entry-settings")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                配置快捷指令和跨设备快速记账入口
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-muted)]"></i>
                </div>
            </Button>
            <QuickEntrySettingsDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
