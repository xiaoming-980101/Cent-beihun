import { useEffect, useState } from "react";
import ScheduledListForm from "./list";

export function ScheduledProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => setOpen(true);
        window.addEventListener("show-scheduled", handleShow);
        return () => {
            window.removeEventListener("show-scheduled", handleShow);
        };
    }, []);

    return (
        <ScheduledListForm
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    window.dispatchEvent(new CustomEvent("scheduled-closed"));
                }
            }}
        />
    );
}

export function showScheduled(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-scheduled"));
        });
        const handleClose = () => {
            window.removeEventListener("scheduled-closed", handleClose);
            resolve();
        };
        window.addEventListener("scheduled-closed", handleClose);
    });
}
