import { useEffect, useState } from "react";
import { ResponsiveDialog } from "../ui/dialog/index";
import BudgetEditForm from "./form";
import type { EditBudget } from "./type";

type ShowBudgetEditDetail = { edit?: EditBudget };
type ResolveBudgetEditDetail = { resolve: (value?: EditBudget) => void };

export function BudgetEditProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<EditBudget | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: EditBudget) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: Event) => {
            const event = e as CustomEvent<ShowBudgetEditDetail>;
            setEdit(event.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((e: Event) => {
            const event = e as CustomEvent<ResolveBudgetEditDetail>;
            setResolveRef({ resolve: event.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-budget-edit", handleShow);
        window.addEventListener(
            "store-budget-edit-resolve",
            handleStoreResolve,
        );

        return () => {
            window.removeEventListener("show-budget-edit", handleShow);
            window.removeEventListener(
                "store-budget-edit-resolve",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = (value?: EditBudget) => {
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
        <ResponsiveDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="编辑预算"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
        >
            <BudgetEditForm
                edit={edit}
                onConfirm={handleConfirm}
                onCancel={() => handleOpenChange(false)}
            />
        </ResponsiveDialog>
    );
}

export function showBudgetEdit(
    edit?: EditBudget,
): Promise<EditBudget | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-budget-edit", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-budget-edit-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
