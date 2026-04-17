import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { useIntl } from "@/locale";
import { useLedgerStore } from "@/store/ledger";
import { decodeApiKey, encodeApiKey } from "@/utils/api-key";
import { FormDialog } from "../ui/dialog/form-dialog";
import { confirm } from "../ui/dialog/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// 地图配置表单
function MapConfigDialog({ 
    open, 
    onOpenChange 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
}) {
    const t = useIntl();

    // 获取当前配置
    const mapConfig = useLedgerStore(
        useShallow((state) => state.infos?.meta.map),
    );

    const [amapKey, setAmapKey] = useState(
        mapConfig?.amapKey ? decodeApiKey(mapConfig.amapKey) : "",
    );
    const [amapSecurityCode, setAmapSecurityCode] = useState(
        mapConfig?.amapSecurityCode
            ? decodeApiKey(mapConfig.amapSecurityCode)
            : "",
    );
    const [showAmapKey, setShowAmapKey] = useState(false);
    const [showAmapSecurityCode, setShowAmapSecurityCode] = useState(false);

    const handleSave = useCallback(async () => {
        // 验证
        if (!amapKey.trim()) {
            toast.error(t("amap-key-required"));
            return;
        }
        if (!amapSecurityCode.trim()) {
            toast.error(t("amap-security-code-required"));
            return;
        }

        // 保存配置
        await useLedgerStore.getState().updateGlobalMeta((prev) => {
            if (!prev.map) {
                prev.map = {};
            }

            prev.map.amapKey = encodeApiKey(amapKey.trim());
            prev.map.amapSecurityCode = encodeApiKey(amapSecurityCode.trim());

            return prev;
        });

        toast.success(t("map-config-saved"));
        onOpenChange(false);
    }, [amapKey, amapSecurityCode, onOpenChange, t]);

    const handleClear = useCallback(async () => {
        const confirmed = await confirm({
            title: t("are-you-sure-to-clear-map-config"),
            variant: "destructive",
            confirmText: t("confirm"),
            cancelText: t("cancel")
        });
        
        if (!confirmed) {
            return;
        }
        
        // 清除配置
        await useLedgerStore.getState().updateGlobalMeta((prev) => {
            if (prev.map) {
                delete prev.map.amapKey;
                delete prev.map.amapSecurityCode;
            }
            return prev;
        });

        setAmapKey("");
        setAmapSecurityCode("");
        toast.success(t("map-config-cleared"));
        onOpenChange(false);
    }, [onOpenChange, t]);

    const hasConfig = mapConfig?.amapKey || mapConfig?.amapSecurityCode;
    const mapHelpTemplate = t("map-settings-help");
    const mapHelpPrefix = mapHelpTemplate.replace(/<a>.*<\/a>/, "").trim();
    const mapHelpLinkLabel = mapHelpTemplate.includes("<a>")
        ? mapHelpTemplate.split("<a>")[1]?.split("</a>")[0]
        : "View AMap documentation";

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("map-settings")}
            maxWidth="md"
            fullScreenOnMobile={true}
        >
            <div className="space-y-4">
                {/* 说明文本 */}
                <div className="rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="text-sm text-[color:var(--wedding-text-mute)]">
                        {t("map-settings-description")}
                    </div>
                </div>

                {/* 高德地图 Key */}
                <div className="space-y-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="font-medium text-[color:var(--wedding-text)]">
                        {t("amap-key")}
                    </div>
                    <div className="relative">
                        <Input
                            name="amap-key"
                            type={showAmapKey ? "text" : "password"}
                            placeholder={t("amap-key-placeholder")}
                            value={amapKey}
                            onChange={(e) =>
                                setAmapKey(e.currentTarget.value)
                            }
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowAmapKey(!showAmapKey)}
                            className="absolute right-0 top-0 flex h-full items-center px-3 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showAmapKey ? (
                                <i className="icon-[mdi--eye-off] size-4"></i>
                            ) : (
                                <i className="icon-[mdi--eye] size-4"></i>
                            )}
                        </button>
                    </div>
                    <div className="text-sm text-[color:var(--wedding-text-mute)]">
                        {t("amap-key-description")}
                    </div>
                </div>

                {/* 高德地图安全密钥 */}
                <div className="space-y-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="font-medium text-[color:var(--wedding-text)]">
                        {t("amap-security-code")}
                    </div>
                    <div className="relative">
                        <Input
                            name="amap-security-code"
                            type={
                                showAmapSecurityCode ? "text" : "password"
                            }
                            placeholder={t(
                                "amap-security-code-placeholder",
                            )}
                            value={amapSecurityCode}
                            onChange={(e) =>
                                setAmapSecurityCode(e.currentTarget.value)
                            }
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowAmapSecurityCode(
                                    !showAmapSecurityCode,
                                )
                            }
                            className="absolute right-0 top-0 flex h-full items-center px-3 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showAmapSecurityCode ? (
                                <i className="icon-[mdi--eye-off] size-4"></i>
                            ) : (
                                <i className="icon-[mdi--eye] size-4"></i>
                            )}
                        </button>
                    </div>
                    <div className="text-sm text-[color:var(--wedding-text-mute)]">
                        {t("amap-security-code-description")}
                    </div>
                </div>

                {/* 帮助链接 */}
                <div className="rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="text-sm text-[color:var(--wedding-text-mute)]">
                        {mapHelpPrefix}{" "}
                        <a
                            href="https://lbs.amap.com/api/jsapi-v2/guide/abc/prepare"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-600"
                        >
                            {mapHelpLinkLabel}
                        </a>
                    </div>
                </div>

                {/* 按钮组 */}
                <div className="flex flex-col gap-2">
                    {hasConfig && (
                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="w-full text-red-500 hover:text-red-600"
                        >
                            {t("clear-map-config")}
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleSave}
                            className="flex-1"
                        >
                            {t("save")}
                        </Button>
                    </div>
                </div>
            </div>
        </FormDialog>
    );
}

export default function MapSettingsItem() {
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
                        <div className="wedding-settings-item__icon bg-emerald-50 text-emerald-500 dark:bg-emerald-500/12">
                            <i className="icon-[mdi--map-outline] size-5"></i>
                        </div>
                        <div className="min-w-0">
                            <div className="wedding-settings-item__title">
                                {t("map-settings")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                配置地图密钥，用于婚礼地点与导航能力
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-muted)]"></i>
                </div>
            </Button>
            <MapConfigDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
