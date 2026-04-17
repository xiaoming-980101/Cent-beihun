import { useEffect, useState } from "react";
import PresetForm from "./form";

export function PresetProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => setOpen(true);
        window.addEventListener("show-preset", handleShow);
        return () => {
            window.removeEventListener("show-preset", handleShow);
        };
    }, []);

    return (
        <PresetForm
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    window.dispatchEvent(new CustomEvent("preset-closed"));
                }
            }}
        />
    );
}

export function showPreset(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-preset"));
        });
        const handleClose = () => {
            window.removeEventListener("preset-closed", handleClose);
            resolve();
        };
        window.addEventListener("preset-closed", handleClose);
    });
}
