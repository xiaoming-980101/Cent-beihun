import { useCallback, useEffect, useState } from "react";
import { useLongPress } from "@/hooks/use-long-press";
import { FormDialog } from "../ui/dialog/form-dialog";
import { BaseButton } from "./base";
import KeyboardForm from "./keyboard-form";

// 事件驱动的弹窗管理
let resolveCallback: ((value: string | null) => void) | null = null;

export const KeyboardFormProvider = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => {
            setOpen(true);
        };

        window.addEventListener("show-keyboard-form" as any, handleShow);
        return () => {
            window.removeEventListener("show-keyboard-form" as any, handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value: string) => {
        resolveCallback?.(value);
        resolveCallback = null;
        setOpen(false);
    };

    const handleCancel = () => {
        resolveCallback?.(null);
        resolveCallback = null;
        setOpen(false);
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="text input"
            maxWidth="md"
        >
            <KeyboardForm
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </FormDialog>
    );
};

export const showKeyboardForm = (): Promise<string | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(new CustomEvent("show-keyboard-form"));
    });
};

export function KeyboardAddButton({
    onClick,
    className,
}: {
    onClick?: () => void;
    className?: string;
}) {
    const presses = useLongPress({
        onClick,
        onLongPressStart: useCallback(async () => {
            const finished = showKeyboardForm();
            return finished;
        }, []),
    });

    return (
        <>
            <BaseButton className={className ?? "relative"} {...presses?.()}>
                {/* <i className="icon-[mdi--add] text-[white] size-7 -translate-x-1 -translate-y-1"></i>
                <i className="icon-[mdi--keyboard] text-[white] size-4 absolute translate-x-2 translate-y-2"></i> */}
                <i className="icon-[mdi--add] text-[white] size-7"></i>
            </BaseButton>
            <KeyboardFormProvider />
        </>
    );
}
