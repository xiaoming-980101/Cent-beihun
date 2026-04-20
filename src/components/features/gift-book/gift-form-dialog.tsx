import { ResponsiveDialog } from "@/components/ui/dialog/index";
import type { GiftRecord } from "@/wedding/type";
import { AmountDetailsSection } from "./components/amount-details-section";
import { GiftTypeSection } from "./components/gift-type-section";
import { GuestRelationSection } from "./components/guest-relation-section";
import { NotesSection } from "./components/notes-section";
import { useGiftForm } from "./hooks/use-gift-form";

export interface GiftFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editRecord?: GiftRecord;
}

export function GiftFormDialog({
    open,
    onOpenChange,
    editRecord,
}: GiftFormDialogProps) {
    const {
        guests,
        loading,
        handleSubmit,
        watch,
        setValue,
        formState,
        onSubmit,
        EMPTY_SELECT_VALUE,
    } = useGiftForm(editRecord);

    const handleFormSubmit = async () => {
        try {
            await handleSubmit(onSubmit)();
            onOpenChange(false);
        } catch (error) {
            // 表单验证失败或提交失败，不关闭弹窗
            console.error("Form submission failed:", error);
        }
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={editRecord ? "编辑礼金记录" : "添加礼金记录"}
            fullScreenOnMobile={true}
            maxWidth="md"
            actions={{
                cancelText: "取消",
                confirmText: editRecord ? "保存更新" : "添加记录",
                onConfirm: handleFormSubmit,
                loading: loading,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                    <GiftTypeSection
                        value={watch("type")}
                        onChange={(value) => setValue("type", value)}
                    />

                    <div className="wedding-soft-card space-y-5 p-4">
                        <GuestRelationSection
                            guests={guests}
                            selectedGuestId={watch("guestId") || ""}
                            guestName={watch("guestName")}
                            relation={watch("relation")}
                            onGuestIdChange={(guestId) =>
                                setValue("guestId", guestId)
                            }
                            onGuestNameChange={(name) =>
                                setValue("guestName", name)
                            }
                            onRelationChange={(relation) =>
                                setValue("relation", relation)
                            }
                            emptySelectValue={EMPTY_SELECT_VALUE}
                        />
                    </div>

                    <AmountDetailsSection
                        amount={watch("amount")}
                        date={watch("date")}
                        event={watch("event")}
                        method={watch("method")}
                        amountError={formState.errors.amount?.message}
                        onAmountChange={(amount) => setValue("amount", amount)}
                        onDateChange={(date) => setValue("date", date)}
                        onEventChange={(event) => setValue("event", event)}
                        onMethodChange={(method) => setValue("method", method)}
                        emptySelectValue={EMPTY_SELECT_VALUE}
                    />

                    <NotesSection
                        note={watch("note")}
                        onNoteChange={(note) => setValue("note", note)}
                    />
                </div>
            </form>
        </ResponsiveDialog>
    );
}
