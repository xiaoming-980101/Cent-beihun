import { useState, useEffect } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import CategoryEditForm from "./form";

export function CategoryEditFormProvider() {
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

        window.addEventListener("show-category-edit", handleShow);
        window.addEventListener("store-category-edit-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-category-edit", handleShow);
            window.removeEventListener("store-category-edit-resolve", handleStoreResolve);
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
        <FormDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="编辑分类"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <CategoryEditForm
                edit={edit}
                onConfirm={handleConfirm}
                onCancel={() => handleOpenChange(false)}
            />
        </FormDialog>
    );
}

export function showCategoryEdit(edit?: any): Promise<any | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-category-edit", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-category-edit-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
