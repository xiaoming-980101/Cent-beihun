import { useEffect, useState } from "react";
import { useLedgerStore } from "@/store/ledger";
import type { EditBill } from "@/store/ledger";
import type { Bill } from "@/ledger/type";
import { FormDialog } from "../ui/dialog/form-dialog";
import EditorForm from "./form";

// 事件驱动的弹窗管理
let resolveCallback: ((value: Omit<Bill, "id" | "creatorId"> | null) => void) | null = null;

export const BillEditorProvider = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<EditBill | undefined>();

    useEffect(() => {
        const handleShow = (event: CustomEvent<EditBill | undefined>) => {
            setEditData(event.detail);
            setOpen(true);
        };

        window.addEventListener("show-bill-editor" as any, handleShow);
        return () => {
            window.removeEventListener("show-bill-editor" as any, handleShow);
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
        <FormDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Edit Bill"
            maxWidth="lg"
            fullScreenOnMobile={true}
            className="sm:max-h-[85vh] sm:w-[90vw] sm:max-w-[600px]"
            bodyClassName="p-0 sm:pt-4"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <EditorForm
                edit={editData}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </FormDialog>
    );
};

export const showBillEditor = (edit?: EditBill): Promise<Omit<Bill, "id" | "creatorId"> | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-bill-editor", { detail: edit })
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
