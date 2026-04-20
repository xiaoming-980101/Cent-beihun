import { useEffect, useState } from "react";
import type { EditBill } from "@/store/ledger";
import ScheduledEditForm from "./form";
import type { Scheduled } from "./type";

type EditScheduled = Omit<Scheduled, "id"> & { id?: string };

export function ScheduledEditProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<EditScheduled | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: EditScheduled & { needBills?: EditBill[] }) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: EditScheduled }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{
                resolve: (
                    value?: EditScheduled & { needBills?: EditBill[] },
                ) => void;
            }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-scheduled-edit", handleShow);
        window.addEventListener(
            "store-scheduled-edit-resolve",
            handleStoreResolve,
        );

        return () => {
            window.removeEventListener("show-scheduled-edit", handleShow);
            window.removeEventListener(
                "store-scheduled-edit-resolve",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = (
        value?: EditScheduled & { needBills?: EditBill[] },
    ) => {
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
        <ScheduledEditForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={edit}
            onConfirm={handleConfirm}
        />
    );
}

export function showScheduledEdit(
    edit?: EditScheduled,
): Promise<(EditScheduled & { needBills?: EditBill[] }) | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-scheduled-edit", { detail: { edit } }),
        );
        // Store resolve function for later use
        setTimeout(() => {
            const event = new CustomEvent("store-scheduled-edit-resolve", {
                detail: { resolve },
            });
            window.dispatchEvent(event);
        }, 0);
    });
}
