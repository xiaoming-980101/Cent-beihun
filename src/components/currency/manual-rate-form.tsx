import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/ui/dialog/index";
import { useIntl } from "@/locale";
import { Button } from "../ui/button";
import RateInput from "./rate-input";

export type ManualRateEdit = {
    baseCurrencyLabel: string;
    targetCurrencyLabel: string;
    initialRate: number;
};

interface ManualRateFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edit?: ManualRateEdit;
    onConfirm?: (v: number | null) => void;
}

function ManualRateForm({
    open,
    onOpenChange,
    edit,
    onConfirm,
}: ManualRateFormProps) {
    const t = useIntl();
    const [rate, setRate] = useState<number | undefined>(edit?.initialRate);

    useEffect(() => {
        setRate(edit?.initialRate);
    }, [edit?.initialRate]);

    if (!edit) {
        return null;
    }

    const handleConfirm = () => {
        if (rate === undefined) {
            onConfirm?.(null);
            onOpenChange(false);
            return;
        }
        if (rate <= 0 || Number.isNaN(rate)) {
            toast.error(t("rate-must-positive"));
            return;
        }
        onConfirm?.(rate);
        onOpenChange(false);
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("manually-update-rate")}
            description={t("manually-update-rate-desc")}
            maxWidth="sm"
        >
            <div className="flex flex-col gap-3">
                <RateInput
                    baseCurrencyLabel={edit.baseCurrencyLabel}
                    targetCurrencyLabel={edit.targetCurrencyLabel}
                    value={rate}
                    onChange={setRate}
                />
                <div className="flex gap-2 justify-end pt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("cancel")}
                    </Button>
                    <Button size="sm" onClick={handleConfirm}>
                        {t("confirm")}
                    </Button>
                </div>
            </div>
        </ResponsiveDialog>
    );
}

export function ManualRateProvider() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<ManualRateEdit | undefined>(undefined);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value: number | null | undefined) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: ManualRateEdit }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{
                resolve: (value: number | null | undefined) => void;
            }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-manual-rate-update", handleShow);
        window.addEventListener(
            "store-manual-rate-resolve",
            handleStoreResolve,
        );

        return () => {
            window.removeEventListener("show-manual-rate-update", handleShow);
            window.removeEventListener(
                "store-manual-rate-resolve",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = (value: number | null) => {
        resolveRef?.resolve(value);
        setOpen(false);
        setEdit(undefined);
        setResolveRef(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveRef?.resolve(undefined);
            setResolveRef(null);
            setEdit(undefined);
        }
        setOpen(newOpen);
    };

    return (
        <ManualRateForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={edit}
            onConfirm={handleConfirm}
        />
    );
}

export function showManualRateUpdate(
    edit?: ManualRateEdit,
): Promise<number | null | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-manual-rate-update", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-manual-rate-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}
