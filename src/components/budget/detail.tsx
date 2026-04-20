import { useEffect, useState } from "react";
import { ResponsiveDialog } from "../ui/dialog/index";
import { BudgetDetailForm } from "./detail-form";
import type { Budget } from "./type";

type ShowBudgetDetail = { edit?: Budget };
type ResolveBudgetDetail = { resolve: (value?: Budget) => void };

export function BudgetDetailProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<Budget | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: Budget) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: Event) => {
            const event = e as CustomEvent<ShowBudgetDetail>;
            setEdit(event.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((e: Event) => {
            const event = e as CustomEvent<ResolveBudgetDetail>;
            setResolveRef({ resolve: event.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-budget-detail", handleShow);
        window.addEventListener(
            "store-budget-detail-resolve",
            handleStoreResolve,
        );

        return () => {
            window.removeEventListener("show-budget-detail", handleShow);
            window.removeEventListener(
                "store-budget-detail-resolve",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = (value?: Budget) => {
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
            title="预算详情"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <BudgetDetailForm
                edit={edit}
                onCancel={() => handleOpenChange(false)}
            />
        </ResponsiveDialog>
    );
}

export function showBudgetDetail(edit?: Budget): Promise<Budget | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-budget-detail", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-budget-detail-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
