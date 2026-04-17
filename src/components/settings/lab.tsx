import { useState } from "react";
import { useIntl } from "@/locale";
import { getEnableHashMode, usePreference } from "@/store/preference";
import { cn } from "@/utils";
import { FormDialog } from "../ui/dialog/form-dialog";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { AssetsSettings } from "./assets";
import KeyboardHeightSettings from "./keyboard";
import { PredictSettings } from "./predict";

function LabSettingsDialog({ 
    open, 
    onOpenChange 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
}) {
    const t = useIntl();

    const [autoLocateWhenAddBill, setAutoLocateWhenAddBill] = usePreference(
        "autoLocateWhenAddBill",
    );

    const [
        enterAddBillWhenReduceMotionChanged,
        setEnterAddBillWhenReduceMotionChanged,
    ] = usePreference("enterAddBillWhenReduceMotionChanged");

    const [
        readClipboardWhenReduceMotionChanged,
        setReadClipboardWhenReduceMotionChanged,
    ] = usePreference("readClipboardWhenReduceMotionChanged");

    const [multiplyKey, setMultiplyKey] = usePreference("multiplyKey");

    const [
        disableHashModeOnAndroidStandaloneMode,
        setDisableHashModeOnAndroidStandaloneMode,
    ] = usePreference("disableHashModeOnAndroidStandaloneMode");

    const hashModeStatus = getEnableHashMode();
    
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("more-functions")}
            maxWidth="md"
            fullScreenOnMobile={true}
        >
            <div className="space-y-4">
                {/* 账单记录设置 */}
                <div>
                    <div className="mb-2 text-sm font-medium text-[color:var(--wedding-text-mute)]">
                        {t("bill-record-settings")}
                    </div>
                    <div className="space-y-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                        <PredictSettings />
                        
                        <div className="flex items-start justify-between gap-4 border-t border-[color:var(--wedding-line)] pt-2">
                            <div className="flex-1">
                                <div className="font-medium text-[color:var(--wedding-text)]">
                                    {t("auto-locate-when-add-bill")}
                                </div>
                                <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                    {t("auto-locate-when-add-bill-description")}
                                </div>
                            </div>
                            <Switch
                                checked={autoLocateWhenAddBill}
                                onCheckedChange={setAutoLocateWhenAddBill}
                            />
                        </div>
                        
                        <div className="flex items-start justify-between gap-4 border-t border-[color:var(--wedding-line)] pt-2">
                            <div className="flex-1">
                                <div className="font-medium text-[color:var(--wedding-text)]">
                                    {t("multiply-key")}
                                </div>
                                <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                    {t("multiply-key-tip")}
                                </div>
                            </div>
                            <Select
                                value={multiplyKey ?? "off"}
                                onValueChange={setMultiplyKey}
                            >
                                <SelectTrigger>
                                    <SelectValue></SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="off">{t("off")}</SelectItem>
                                    <SelectItem value="double-zero">00</SelectItem>
                                    <SelectItem value="triple-zero">000</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="border-t border-[color:var(--wedding-line)] pt-2">
                            <KeyboardHeightSettings />
                        </div>
                    </div>
                </div>

                <AssetsSettings />

                {/* 实验功能 */}
                <div>
                    <div className="mb-2 text-sm font-medium text-[color:var(--wedding-text-mute)]">
                        {t("experimental-functions")}
                    </div>
                    <div className="space-y-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="font-medium text-[color:var(--wedding-text)]">
                                    {t("enter-add-bill-when-reduce-motion-changed")}
                                </div>
                                <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                    {t("enter-add-bill-when-reduce-motion-changed-description")}
                                    <a
                                        href="https://glink25.github.io/post/Cent-PWA%E5%B0%8F%E6%8A%80%E5%B7%A7/#%E5%BF%AB%E6%8D%B7%E8%AE%B0%E8%B4%A6"
                                        className="px-2 underline"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        Tips
                                    </a>
                                </div>
                            </div>
                            <Switch
                                checked={enterAddBillWhenReduceMotionChanged}
                                onCheckedChange={setEnterAddBillWhenReduceMotionChanged}
                            />
                        </div>
                        
                        <div className="flex items-start justify-between gap-4 border-t border-[color:var(--wedding-line)] pt-2">
                            <div className="flex-1">
                                <div className="font-medium text-[color:var(--wedding-text)]">
                                    {t("quick-add-when-reduce-motion-changed")}
                                </div>
                                <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                    {t("enter-add-bill-when-reduce-motion-changed-description")}
                                    <a
                                        href="https://glink25.github.io/post/Cent-%E5%B7%B2%E6%94%AF%E6%8C%81%E5%A4%9A%E5%B8%81%E7%A7%8D%E8%87%AA%E5%8A%A8%E8%AE%B0%E8%B4%A6/#iOS%E5%BF%AB%E6%8D%B7%E6%8C%87%E4%BB%A4%E5%BF%AB%E9%80%9F%E8%AE%B0%E8%B4%A6"
                                        className="px-2 underline"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        Tips
                                    </a>
                                </div>
                            </div>
                            <Switch
                                checked={readClipboardWhenReduceMotionChanged}
                                onCheckedChange={setReadClipboardWhenReduceMotionChanged}
                            />
                        </div>
                        
                        <div className="flex items-start justify-between gap-4 border-t border-[color:var(--wedding-line)] pt-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-1 font-medium text-[color:var(--wedding-text)]">
                                    {t("disable-android-hash-mode")}{" "}
                                    <div
                                        className={cn(
                                            "h-2 w-2 rounded-full",
                                            hashModeStatus
                                                ? "bg-green-500"
                                                : "bg-foreground/60",
                                        )}
                                    ></div>
                                </div>
                                <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                    {t("disable-android-hash-mode-description")}
                                </div>
                            </div>
                            <Switch
                                checked={disableHashModeOnAndroidStandaloneMode}
                                onCheckedChange={setDisableHashModeOnAndroidStandaloneMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FormDialog>
    );
}

export default function LabSettingsItem() {
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
                        <div className="wedding-settings-item__icon bg-cyan-50 text-cyan-500 dark:bg-cyan-500/12">
                            <i className="icon-[mdi--flask] size-5"></i>
                        </div>
                        <div className="min-w-0">
                            <div className="wedding-settings-item__title">
                                {t("more-functions")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                查看实验功能和更多扩展能力
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-muted)]"></i>
                </div>
            </Button>
            <LabSettingsDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
