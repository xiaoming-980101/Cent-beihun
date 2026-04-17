import {
    type DetailedHTMLProps,
    type InputHTMLAttributes,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { useIntl } from "@/locale";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import IOSUnscrolledInput from "../input";
import { Button } from "../ui/button";

// 简易对话框，调用后弹出对话框，包含取消和确定按钮，点击取消将会reject promise，点击确认则会resolve，值取决于对话框中input的值
type PromptOptions = {
    title: ReactNode;
    // 可以指定input的属性，如果input为undefined，则不会显示input
    input?: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >;
    onConfirm?: (v: HTMLInputElement | null) => Promise<void> | void;
    cancellable?: boolean;
};

interface PromptFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edit?: PromptOptions;
    onConfirm?: (v?: unknown) => void;
}

const PromptForm = ({
    open,
    onOpenChange,
    edit,
    onConfirm,
}: PromptFormProps) => {
    const t = useIntl();
    const inputRef = useRef<HTMLInputElement>(null);
    const autoFocus = edit?.input?.autoFocus !== false;
    useEffect(() => {
        if (autoFocus && open) {
            inputRef.current?.focus();
        }
    }, [autoFocus, open]);
    
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={edit?.title?.toString() || ""}
            maxWidth="sm"
        >
            <div className="flex flex-col gap-4">
                {edit?.title}
                {edit?.input && (
                    <IOSUnscrolledInput
                        ref={inputRef}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...edit.input}
                    />
                )}

                <div className="flex gap-2 justify-end">
                    {edit?.cancellable !== false && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onOpenChange(false);
                            }}
                        >
                            {t("cancel")}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        onClick={async () => {
                            const value = await edit?.onConfirm?.(
                                inputRef.current,
                            );
                            onConfirm?.(value ?? inputRef.current?.value);
                            onOpenChange(false);
                        }}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </div>
        </FormDialog>
    );
};

export function PromptProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<PromptOptions | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: unknown) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: PromptOptions }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{ resolve: (value?: unknown) => void }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-prompt-modal", handleShow);
        window.addEventListener("store-prompt-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-prompt-modal", handleShow);
            window.removeEventListener("store-prompt-resolve", handleStoreResolve);
        };
    }, []);

    const handleConfirm = (value?: unknown) => {
        resolveRef?.resolve(value);
        setOpen(false);
        setEdit(undefined);
        setResolveRef(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveRef?.resolve(undefined);
            setResolveRef(null);
            setEdit(undefined);
        }
        setOpen(newOpen);
    };

    return (
        <PromptForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={edit}
            onConfirm={handleConfirm}
        />
    );
}

export function showPrompt(edit?: PromptOptions): Promise<unknown | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-prompt-modal", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-prompt-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}

export const prompt = (v: PromptOptions) => {
    return showPrompt(v);
};
