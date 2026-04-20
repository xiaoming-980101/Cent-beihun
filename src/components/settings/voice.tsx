import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useIntl } from "@/locale";
import { useLedgerStore } from "@/store/ledger";
import { usePreference } from "@/store/preference";
import { useUserStore } from "@/store/user";
import { isSpeechRecognitionSupported } from "../add-button/recognize";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ui/dialog/index";
import { Switch } from "../ui/switch";

function VoiceSettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const t = useIntl();
    const { id: userId } = useUserStore();

    // 获取AI配置信息
    const { configs = [], defaultConfigId } = useLedgerStore(
        useShallow((state) => {
            const assistantData =
                state.infos?.meta.personal?.[userId]?.assistant;
            return {
                configs: assistantData?.configs,
                defaultConfigId: assistantData?.defaultConfigId,
            };
        }),
    );

    // 判断是否有可用的AI配置
    const hasAIConfig = configs.length > 0 && defaultConfigId;

    // 语音记账开关状态
    const [voiceEnabled, setVoiceEnabled] = usePreference(
        "voiceRecordingEnabled",
    );

    const [voiceByKeyboard, setVoiceByKeyboard] =
        usePreference("voiceByKeyboard");

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("voice-recording-settings")}
            maxWidth="md"
        >
            <div className="space-y-4">
                {/* 语音记账开关 */}
                <div className="flex items-start justify-between gap-4 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="flex-1">
                        <div className="font-medium text-[color:var(--wedding-text)]">
                            {t("enable-voice-recording")}
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                            {hasAIConfig
                                ? voiceEnabled
                                    ? t("voice-recording-tip")
                                    : t("voice-recording-description")
                                : t("voice-recording-requires-ai-config")}
                        </div>
                    </div>
                    <Switch
                        checked={Boolean(voiceEnabled && hasAIConfig)}
                        onCheckedChange={(checked) => {
                            if (hasAIConfig) {
                                setVoiceEnabled(checked);
                                if (checked) {
                                    const isSupported =
                                        isSpeechRecognitionSupported();
                                    if (!isSupported) {
                                        setVoiceByKeyboard(true);
                                    }
                                }
                            }
                        }}
                        disabled={!hasAIConfig}
                    />
                </div>

                {/* 提示信息 */}
                {!hasAIConfig && (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                        <div className="flex items-start gap-2 text-sm">
                            <i className="icon-[mdi--information-outline] mt-0.5 size-4 flex-shrink-0 text-yellow-600 dark:text-yellow-400"></i>
                            <div className="text-yellow-800 dark:text-yellow-200">
                                {t("voice-recording-setup-tip")}
                            </div>
                        </div>
                    </div>
                )}

                {/* 键盘输入开关 */}
                {voiceEnabled && (
                    <div className="flex items-start justify-between gap-4 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                        <div className="flex-1">
                            <div className="font-medium text-[color:var(--wedding-text)]">
                                {t("use-keyboard-input-instead-of-voice")}
                            </div>
                            <div className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                {t("use-keyboard-input-description")}
                            </div>
                        </div>
                        <Switch
                            checked={Boolean(voiceByKeyboard)}
                            onCheckedChange={(checked) => {
                                setVoiceByKeyboard(checked);
                            }}
                        />
                    </div>
                )}
            </div>
        </ResponsiveDialog>
    );
}

export default function VoiceSettingsItem() {
    const t = useIntl();
    const [open, setOpen] = useState(false);
    const betaClassName = `relative after:content-['beta'] after:rounded after:bg-yellow-400 after:px-[2px] after:text-[8px] after:block after:absolute after:top-0 after:right-0 after:translate-x-[calc(100%+4px)]`;

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className={`${betaClassName} flex items-center gap-3`}>
                        <div className="wedding-settings-item__icon bg-blue-50 text-blue-500 dark:bg-blue-500/12">
                            <i className="icon-[mdi--microphone-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("voice-recording-settings")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                语音转录与键盘输入切换
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
            <VoiceSettingsDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
