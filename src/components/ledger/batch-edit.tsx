import { useState, useEffect } from "react";
import type { BatchEditOptions } from "./batch-edit-form";
import BatchEditForm from "./batch-edit-form";

export type { BatchEditOptions };

export function BatchEditProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<BatchEditOptions | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: BatchEditOptions) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: BatchEditOptions }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{ resolve: (value?: BatchEditOptions) => void }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-batch-edit", handleShow);
        window.addEventListener("store-batch-edit-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-batch-edit", handleShow);
            window.removeEventListener("store-batch-edit-resolve", handleStoreResolve);
        };
    }, []);

    const handleConfirm = (value?: BatchEditOptions) => {
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
        <BatchEditForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={edit}
            onConfirm={handleConfirm}
        />
    );
}

export function showBatchEdit(
    edit?: BatchEditOptions,
): Promise<BatchEditOptions | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-batch-edit", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-batch-edit-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
