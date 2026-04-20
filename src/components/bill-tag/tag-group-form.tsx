import { useState, useEffect } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import { EditTagGroupForm, type EditTagGroup } from "./tag-group";

type EditTagGroupResult = EditTagGroup | "delete";
type ShowEditTagGroupDetail = { edit?: EditTagGroup };
type ResolveEditTagGroupDetail = {
    resolve: (value?: EditTagGroupResult) => void;
};

export function EditTagGroupProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<EditTagGroup | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: EditTagGroupResult) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: Event) => {
            const event = e as CustomEvent<ShowEditTagGroupDetail>;
            setEdit(event.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((e: Event) => {
            const event = e as CustomEvent<ResolveEditTagGroupDetail>;
            setResolveRef({ resolve: event.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-edit-tag-group", handleShow);
        window.addEventListener("store-edit-tag-group-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-edit-tag-group", handleShow);
            window.removeEventListener("store-edit-tag-group-resolve", handleStoreResolve);
        };
    }, []);

    const handleConfirm = (value?: EditTagGroupResult) => {
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

export function showEditTagGroup(
    edit?: EditTagGroup,
): Promise<EditTagGroupResult | undefined> {
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
