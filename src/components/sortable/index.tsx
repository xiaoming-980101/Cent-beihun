import { type ReactNode, useEffect, useState } from "react";
import Form from "./form";
import type { SortableItem } from "./list";

let sortableListResolveCallback: ((list: SortableItem[]) => void) | null = null;
let sortableListEditData: SortableItem[] | undefined;

export function showSortableList<T extends SortableItem>(
    value?: T[],
): Promise<T[]> {
    return new Promise((resolve) => {
        sortableListResolveCallback = (list) => {
            resolve(list as T[]);
        };
        sortableListEditData = value as SortableItem[] | undefined;
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

    const handleConfirm = (list: SortableItem[]) => {
        if (sortableListResolveCallback) {
            sortableListResolveCallback(list);
            sortableListResolveCallback = null;
        }
        sortableListEditData = undefined;
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && sortableListResolveCallback) {
            sortableListResolveCallback(sortableListEditData ?? []);
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
