import { useEffect, useState } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import CategoryList from "./list";

export function CategoryListProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<any>(undefined);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: any }>) => {
            setEdit(e.detail?.edit);
            setOpen(true);
        }) as EventListener;
        window.addEventListener("show-category-list", handleShow);
        return () => {
            window.removeEventListener("show-category-list", handleShow);
        };
    }, []);

    return (
        <FormDialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    setEdit(undefined);
                    window.dispatchEvent(new CustomEvent("category-list-closed"));
                }
            }}
            title="分类设置"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <CategoryList
                edit={edit}
                onCancel={() => {
                    setOpen(false);
                    setEdit(undefined);
                    window.dispatchEvent(new CustomEvent("category-list-closed"));
                }}
            />
        </FormDialog>
    );
}

export function showCategoryList(edit?: any): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(
                new CustomEvent("show-category-list", { detail: { edit } }),
            );
        });
        const handleClose = () => {
            window.removeEventListener("category-list-closed", handleClose);
            resolve();
        };
        window.addEventListener("category-list-closed", handleClose);
    });
}
