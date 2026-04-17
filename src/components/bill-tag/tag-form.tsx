import { useState, useEffect } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import { EditTagForm } from "./tag";

export function EditTagProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<any>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: any) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: any }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{ resolve: (value?: any) => void }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-edit-tag", handleShow);
        window.addEventListener("store-edit-tag-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-edit-tag", handleShow);
            window.removeEventListener("store-edit-tag-resolve", handleStoreResolve);
        };
    }, []);

    const handleConfirm = (value?: any) => {
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
        <FormDialog open={open} onOpenChange={handleOpenChange} title="编辑标签" fullScreenOnMobile={true}>
            <EditTagForm
                edit={edit}
                onConfirm={handleConfirm}
                onCancel={() => handleOpenChange(false)}
            />
        </FormDialog>
    );
}

export function showEditTag(edit?: any): Promise<any | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-edit-tag", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-edit-tag-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
