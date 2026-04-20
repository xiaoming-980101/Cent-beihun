import { useState, useEffect } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import { EditTagForm, type EditTag } from "./tag";

type EditTagResult = EditTag | "delete";
type ShowEditTagDetail = { edit?: EditTag };
type ResolveEditTagDetail = { resolve: (value?: EditTagResult) => void };

export function EditTagProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<EditTag | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: EditTagResult) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: Event) => {
            const event = e as CustomEvent<ShowEditTagDetail>;
            setEdit(event.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((e: Event) => {
            const event = e as CustomEvent<ResolveEditTagDetail>;
            setResolveRef({ resolve: event.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-edit-tag", handleShow);
        window.addEventListener("store-edit-tag-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-edit-tag", handleShow);
            window.removeEventListener("store-edit-tag-resolve", handleStoreResolve);
        };
    }, []);

    const handleConfirm = (value?: EditTagResult) => {
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

export function showEditTag(edit?: EditTag): Promise<EditTagResult | undefined> {
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
