import { useEffect, useState } from "react";
import { ResponsiveDialog } from "../ui/dialog/index";
import CurrencyListForm from "./list";

export function CurrencyListProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => setOpen(true);
        window.addEventListener("show-currency-list", handleShow);
        return () => {
            window.removeEventListener("show-currency-list", handleShow);
        };
    }, []);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    window.dispatchEvent(
                        new CustomEvent("currency-list-closed"),
                    );
                }
            }}
            title="币种管理"
            fullScreenOnMobile={true}
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <CurrencyListForm
                onCancel={() => {
                    setOpen(false);
                    window.dispatchEvent(
                        new CustomEvent("currency-list-closed"),
                    );
                }}
            />
        </ResponsiveDialog>
    );
}

export function showCurrencyList(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-currency-list"));
        });
        const handleClose = () => {
            window.removeEventListener("currency-list-closed", handleClose);
            resolve();
        };
        window.addEventListener("currency-list-closed", handleClose);
    });
}
