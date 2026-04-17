import { useCallback, useState } from "react";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { useIntl } from "@/locale";
import { Button } from "../ui/button";
import { type SortableItem, SortableList } from "./list";

interface SortableFormDialogProps<T extends SortableItem> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edit?: T[];
    onConfirm?: (v: T[]) => void;
}

export default function Form<T extends SortableItem>({
    open,
    onOpenChange,
    edit,
    onConfirm,
}: SortableFormDialogProps<T>) {
    const [list, setList] = useState([...(edit ?? [])]);
    const onReorder: typeof setList = useCallback((v) => {
        setList(v);
    }, []);
    const t = useIntl();
    
    const handleConfirm = () => {
        onConfirm?.(list);
        onOpenChange(false);
    };
    
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("sort")}
            maxWidth="md"
            fullScreenOnMobile={true}
        >
            <div className="flex flex-col gap-4">
                <div className="w-full overflow-hidden">
                    <SortableList
                        items={list}
                        onReorder={onReorder}
                        className="h-full max-h-[400px]"
                    />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleConfirm}>
                        {t("confirm")}
                    </Button>
                </div>
            </div>
        </FormDialog>
    );
}
