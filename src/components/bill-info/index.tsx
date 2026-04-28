import { useEffect, useState } from "react";
import type { EditBill } from "@/store/ledger";
import { ResponsiveDialog } from "../ui/dialog/index";
import BillInfo from "./form";

// 事件驱动的弹窗管�?
let resolveCallback: ((value: boolean | null) => void) | null = null;

export const BillInfoProvider = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<EditBill | undefined>();

    useEffect(() => {
        const handleShow: EventListener = (event) => {
            setEditData((event as CustomEvent<EditBill>).detail);
            setOpen(true);
        };

        window.addEventListener("show-bill-info", handleShow);
        return () => {
            window.removeEventListener("show-bill-info", handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value: boolean) => {
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
            title="账单详情"
            description="查看账单详情并进行编辑操作"
            maxWidth="sm"
            className="sm:max-h-[min(75vh,600px)]"
            bodyClassName="py-2"
        >
            <BillInfo
                edit={editData}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ResponsiveDialog>
    );
};

export const showBillInfo = (edit?: EditBill): Promise<boolean | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-bill-info", { detail: edit }),
        );
    });
};

