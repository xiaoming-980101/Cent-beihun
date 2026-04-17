import { useEffect, useState } from "react";
import { FormDialog } from "../ui/dialog/form-dialog";
import BudgetListForm from "./list";

export function BudgetProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => setOpen(true);
        window.addEventListener("show-budget", handleShow);
        return () => {
            window.removeEventListener("show-budget", handleShow);
        };
    }, []);

    return (
        <FormDialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    window.dispatchEvent(new CustomEvent("budget-closed"));
                }
            }}
            title="预算管理"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <BudgetListForm
                onCancel={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent("budget-closed"));
                }}
            />
        </FormDialog>
    );
}

export function showBudget(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-budget"));
        });
        const handleClose = () => {
            window.removeEventListener("budget-closed", handleClose);
            resolve();
        };
        window.addEventListener("budget-closed", handleClose);
    });
}
