import { useEffect, useState } from "react";
import type { BillFilter } from "@/ledger/type";
import { ResponsiveDialog } from "../ui/dialog/index";
import BillFilterView from "./filter-view";
import BillFilterForm from "./form";

export default BillFilterForm;

// 事件驱动的弹窗管理
type BillFilterEdit = {
    filter: BillFilter;
    name?: string;
    displayCurrency?: string;
    hideDelete?: boolean;
};

type BillFilterResult =
    | "delete"
    | { filter: BillFilter; name?: string; displayCurrency?: string };

let resolveCallback: ((value: BillFilterResult | null) => void) | null = null;

export const BillFilterViewProvider = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<BillFilterEdit | undefined>();

    useEffect(() => {
        const handleShow: EventListener = (event) => {
            setEditData((event as CustomEvent<BillFilterEdit>).detail);
            setOpen(true);
        };

        window.addEventListener("show-bill-filter-view", handleShow);
        return () => {
            window.removeEventListener("show-bill-filter-view", handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value: BillFilterResult) => {
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
            title="Edit Bill Filter"
            description="保存筛选条件并设置统计展示币种"
            maxWidth="sm"
            className="overflow-hidden sm:max-h-[72vh]"
        >
            <BillFilterView
                edit={editData}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ResponsiveDialog>
    );
};

export const showBillFilterView = (
    edit?: BillFilterEdit,
): Promise<BillFilterResult | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-bill-filter-view", { detail: edit }),
        );
    });
};
