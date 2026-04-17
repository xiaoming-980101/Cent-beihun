import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLongPress } from "@/hooks/use-long-press";
import { t } from "@/locale";
import { useLedgerStore } from "@/store/ledger";
import { parseTextToBill } from "../assistant/text-to-bill";
import { FormDialog } from "../ui/dialog/form-dialog";
import { BaseButton } from "./base";
import { startRecognize } from "./recognize";
import VoiceForm, { VoiceFormContext, type VoiceFormState } from "./voice-form";

// 事件驱动的弹窗管理
let resolveCallback: (() => void) | null = null;

export const VoiceFormProvider = ({ formState }: { formState: VoiceFormState }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => {
            setOpen(true);
        };

        window.addEventListener("show-voice-form" as any, handleShow);
        return () => {
            window.removeEventListener("show-voice-form" as any, handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.();
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleCancel = () => {
        resolveCallback?.();
        resolveCallback = null;
        setOpen(false);
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={handleOpenChange}
            title={t("voice-recording-dialog-title")}
            maxWidth="md"
        >
            <VoiceForm onCancel={handleCancel} />
        </FormDialog>
    );
};

export const showVoiceForm = (): { promise: Promise<void>; cancel: () => void } => {
    const promise = new Promise<void>((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(new CustomEvent("show-voice-form"));
    });
    
    const cancel = () => {
        resolveCallback?.();
        resolveCallback = null;
    };
    
    return { promise, cancel };
};

export function VoiceAddButton({
    onClick,
    className,
}: {
    onClick?: () => void;
    className?: string;
}) {
    const cancelRef = useRef<(() => void) | undefined>(undefined);
    const stopRef = useRef<(() => void) | undefined>(undefined);

    const [formState, setFormState] = useState<VoiceFormState>({
        text: "",
        phase: "listening",
    });

    const presses = useLongPress({
        onClick,
        onLongPressStart: useCallback(() => {
            // 长按开始：显示弹窗并开始录音
            const { promise: dialogClosed, cancel: closeDialog } =
                showVoiceForm();
            const {
                finished,
                cancel: cancelRecognizing,
                stop: stopRecognizing,
            } = startRecognize((text) => {
                setFormState((prev) => ({ ...prev, text }));
            });

            // 如果弹窗被关闭，取消录音
            dialogClosed.catch((error) => {
                console.warn(error);
                cancelRecognizing();
            });

            cancelRef.current = closeDialog;
            stopRef.current = stopRecognizing;

            // 处理识别结果
            finished.then(async (value) => {
                try {
                    const text = value.trim();
                    if (text.length === 0) {
                        closeDialog();
                        setFormState({
                            text: "",
                            phase: "listening",
                        });
                        return;
                    }
                    setFormState((prev) => ({ ...prev, phase: "parsing" }));
                    const bills = await parseTextToBill(text);
                    if (bills.length === 0) {
                        toast.error("无法识别账单信息");
                        return;
                    }
                    await useLedgerStore.getState().addBills(bills);
                    toast.success(t("voice-add-success", { count: bills.length }));
                } catch (error) {
                    console.error(error);
                    const errorMessage =
                        error instanceof Error ? error.message : "";
                    if (errorMessage.includes("aborted")) {
                        return;
                    }
                    toast.error(
                        t("voice-recognition-failed", {
                            error: error instanceof Error ? error.message : "",
                        }),
                    );
                } finally {
                    closeDialog();
                    setFormState({
                        text: "",
                        phase: "listening",
                    });
                }
            }).catch((error) => {
                console.error(error);
                closeDialog();
                setFormState({
                    text: "",
                    phase: "listening",
                });
            });
        }, []),
        onLongPressEnd: useCallback(() => {
            // 松手：停止录音并开始识别
            console.log("松手，停止录音并开始识别");
            stopRef.current?.();
            stopRef.current = undefined;
        }, []),
        onLongPressCancel: useCallback(() => {
            // 取消（上滑或移开）：取消录音并关闭弹窗
            console.log("取消录音");
            cancelRef.current?.();
            cancelRef.current = undefined;
            stopRef.current = undefined;
        }, []),
    });

    return (
        <VoiceFormContext.Provider value={formState}>
            <BaseButton className={className} {...presses?.()}>
                {/* <i className="icon-[mdi--microphone-plus] text-[white] size-7"></i> */}
                <i className="icon-[mdi--add] text-[white] size-7"></i>
            </BaseButton>
            <VoiceFormProvider formState={formState} />
        </VoiceFormContext.Provider>
    );
}
