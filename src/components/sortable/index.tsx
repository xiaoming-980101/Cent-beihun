import { type ReactNode, useEffect, useState } from "react";
import Form from "./form";
import type { SortableItem } from "./list";

let sortableListResolveCallback: ((list: any[] | null) => void) | null = null;
let sortableListEditData: any[] | undefined = undefined;

export function showSortableList<T extends SortableItem>(value?: T[]): Promise<T[]> {
    return new Promise((resolve) => {
        sortableListResolveCallback = resolve as any;
        sortableListEditData = value;
        window.dispatchEvent(new CustomEvent("open-sortable-list"));
    });
}

export function SortableListProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setOpen(true);
        };
        window.addEventListener("open-sortable-list", handleOpen);
        return () => {
            window.removeEventListener("open-sortable-list", handleOpen);
        };
    }, []);

    const handleConfirm = (list: any[]) => {
        if (sortableListResolveCallback) {
            sortableListResolveCallback(list);
            sortableListResolveCallback = null;
        }
        sortableListEditData = undefined;
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && sortableListResolveCallback) {
            sortableListResolveCallback(null);
            sortableListResolveCallback = null;
        }
        if (!newOpen) {
            sortableListEditData = undefined;
        }
    };

    return (
        <Form
            open={open}
            onOpenChange={handleOpenChange}
            onConfirm={handleConfirm}
            edit={sortableListEditData}
        />
    );
}
