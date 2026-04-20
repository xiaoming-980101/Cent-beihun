import { useEffect, useState } from "react";
import type { Bill } from "@/ledger/type";
import type { EditBill } from "@/store/ledger";
import { useLedgerStore } from "@/store/ledger";
import { ResponsiveDialog } from "../ui/dialog/index";
import EditorForm from "./form";

// 事件驱动的弹窗管理
let resolveCallback:
    | ((value: Omit<Bill, "id" | "creatorId"> | null) => void)
    | null = null;

export const BillEditorProvider = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<EditBill | undefined>();

    useEffect(() => {
        const handleShow: EventListener = (event) => {
            setEditData((event as CustomEvent<EditBill | undefined>).detail);
            setOpen(true);
        };

        window.addEventListener("show-bill-editor", handleShow);
        return () => {
            window.removeEventListener("show-bill-editor", handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value: Omit<Bill, "id" | "creatorId">) => {
        resolveCallback?.(value);
        resolveCallback = null;
        setOpen(false);
    };

    const handleCancel = () => {
        resolveCallback?.(null);
        resolveCallback = null;
        setOpen(false);
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Edit Bill"
            fullScreenOnMobile={true}
            maxWidth="lg"
            className="sm:max-h-[85vh] sm:w-[90vw] sm:max-w-[600px]"
            bodyClassName="p-0 sm:pt-4"
        >
            <EditorForm
                edit={editData}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ResponsiveDialog>
    );
};

export const showBillEditor = (
    edit?: EditBill,
): Promise<Omit<Bill, "id" | "creatorId"> | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-bill-editor", { detail: edit }),
        );
    });
};

export const goAddBill = async () => {
    // Defer opening to next frame to avoid same-click close race with overlay.
    await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
    });
    const newBill = await showBillEditor();
    if (newBill) {
        await useLedgerStore.getState().addBill(newBill);
    }
};
