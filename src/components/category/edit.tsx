import { useState, useEffect } from "react";
import type { BillCategory, BillType } from "@/ledger/type";
import { FormDialog } from "../ui/dialog/form-dialog";
import CategoryEditForm from "./form";

type CategoryEditInput =
    | BillCategory
    | { id: undefined; parent?: string; type: BillType };
type CategoryEditResult = string | undefined;
type ShowCategoryEditDetail = { edit?: CategoryEditInput };
type ResolveCategoryEditDetail = { resolve: (value?: CategoryEditResult) => void };

export function CategoryEditFormProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<CategoryEditInput | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: CategoryEditResult) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: Event) => {
            const event = e as CustomEvent<ShowCategoryEditDetail>;
            setEdit(event.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((e: Event) => {
            const event = e as CustomEvent<ResolveCategoryEditDetail>;
            setResolveRef({ resolve: event.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-category-edit", handleShow);
        window.addEventListener("store-category-edit-resolve", handleStoreResolve);

        return () => {
            window.removeEventListener("show-category-edit", handleShow);
            window.removeEventListener("store-category-edit-resolve", handleStoreResolve);
        };
    }, []);

    const handleConfirm = (value?: CategoryEditResult) => {
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

export function showCategoryEdit(
    edit?: CategoryEditInput,
): Promise<CategoryEditResult | undefined> {
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
