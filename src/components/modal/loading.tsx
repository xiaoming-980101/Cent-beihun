import { type ReactNode, useEffect, useState } from "react";
import { ResponsiveDialog } from "@/components/ui/dialog/index";
import { useIntl } from "@/locale";
import { Button } from "../ui/button";

type LoadingState = {
    target: EventTarget;
    onCancel?: () => void;
    label?: ReactNode;
};

interface LoadingFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edit?: LoadingState;
    onConfirm?: (v?: LoadingState) => void;
}

const LoadingForm = ({
    open,
    onOpenChange,
    edit,
    onConfirm,
}: LoadingFormProps) => {
    const t = useIntl();
    useEffect(() => {
        const onClose = () => {
            onConfirm?.();
            onOpenChange(false);
        };
        edit?.target.addEventListener("close", onClose);
        return () => {
            edit?.target?.removeEventListener("close", onClose);
        };
    }, [edit?.target, onConfirm, onOpenChange]);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("loading")}
            maxWidth="xs"
        >
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <i className="icon-[mdi--loading] animate-spin size-10"></i>
                {edit?.label}
                {edit?.onCancel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            edit.onCancel?.();
                            onOpenChange(false);
                        }}
                    >
                        {t("cancel")}
                    </Button>
                )}
            </div>
        </ResponsiveDialog>
    );
};

export function LoadingProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<LoadingState | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: LoadingState) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: LoadingState }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{ resolve: (value?: LoadingState) => void }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-loading", handleShow);
        window.addEventListener("store-loading-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-loading", handleShow);
            window.removeEventListener(
                "store-loading-resolve",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = (value?: LoadingState) => {
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
        <LoadingForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={edit}
            onConfirm={handleConfirm}
        />
    );
}

export function showLoading(
    edit?: LoadingState,
): Promise<LoadingState | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-loading", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-loading-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}

export const loading = (v?: Omit<LoadingState, "target">) => {
    const target = new EventTarget();
    const loaded = showLoading({ ...v, target });
    return [
        () => {
            target.dispatchEvent(new CustomEvent("close"));
        },
        loaded,
    ] as const;
};
