import { useState, useEffect } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import { EditTagGroupForm } from "./tag-group";

export function EditTagGroupProvider() {
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

        window.addEventListener("show-edit-tag-group", handleShow);
        window.addEventListener("store-edit-tag-group-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-edit-tag-group", handleShow);
            window.removeEventListener("store-edit-tag-group-resolve", handleStoreResolve);
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
        <FormDialog open={open} onOpenChange={handleOpenChange} title="编辑标签组" fullScreenOnMobile={true}>
            <EditTagGroupForm
                edit={edit}
                onConfirm={handleConfirm}
                onCancel={() => handleOpenChange(false)}
            />
        </FormDialog>
    );
}

export function showEditTagGroup(edit?: any): Promise<any | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-edit-tag-group", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-edit-tag-group-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
