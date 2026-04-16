import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/mini";
import { Button } from "@/components/ui/button";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { useWeddingStore } from "@/store/wedding";
import { GIFT_EVENTS, PAYMENT_METHODS, RELATION_GROUPS } from "@/wedding/constants";
import type { GiftRecord } from "@/wedding/type";

const giftFormSchema = z.object({
    type: z.enum(["received", "sent"]),
    guestId: z.optional(z.string()),
    guestName: z.string(),
    relation: z.enum(["relative", "friend", "colleague", "classmate", "other"]),
    amount: z.number().check(z.positive({ message: "金额必须大于 0" })),
    date: z.string().check(
        z.minLength(1, { message: "请选择日期" }),
        z.maxLength(32),
    ),
    event: z.enum(["engagement", "wedding", "other"]),
    method: z.string(),
    note: z.string(),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

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
    const { weddingData, addGiftRecord, updateGiftRecord } = useWeddingStore();
    const guests = weddingData?.guests || [];

    const defaultValues = useMemo<GiftFormValues>(() => {
        return {
            type: editRecord?.type || "received",
            guestId: editRecord?.guestId || "",
            guestName: editRecord?.guestName || "",
            relation: "friend",
            amount: editRecord?.amount || 0,
            date: editRecord?.date
                ? new Date(editRecord.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            event: editRecord?.event || "wedding",
            method: editRecord?.method || "",
            note: editRecord?.note || "",
        };
    }, [editRecord]);

    const form = useForm<GiftFormValues>({
        resolver: zodResolver(giftFormSchema) as any,
        defaultValues,
        values: defaultValues,
    });

    const { register, handleSubmit, watch, setValue, formState } = form;
    const selectedGuestId = watch("guestId");
    const focusTrapRef = useFocusTrap(open);

    const onSubmit = async (values: GiftFormValues) => {
        const selectedGuest = guests.find((guest) => guest.id === values.guestId);
        const relationLabel = RELATION_GROUPS.find(
            (item) => item.id === values.relation,
        )?.name;
        const relationNote =
            !selectedGuest && values.guestName.trim()
                ? relationLabel
                    ? `关系：${relationLabel}`
                    : ""
                : "";

        const nextNote = [relationNote, values.note.trim()]
            .filter(Boolean)
            .join(" · ");

        const payload = {
            type: values.type,
            guestId: values.guestId || undefined,
            guestName: values.guestId ? undefined : values.guestName.trim() || undefined,
            amount: values.amount,
            date: new Date(values.date).getTime(),
            event: values.event,
            method: (values.method || undefined) as GiftRecord["method"],
            note: nextNote || undefined,
        };

        try {
            if (editRecord) {
                await updateGiftRecord(editRecord.id, payload);
                toast.success("礼金记录已更新");
            } else {
                await addGiftRecord(payload);
                toast.success("礼金记录已添加");
            }
            onOpenChange(false);
        } catch {
            toast.error("操作失败，请稍后重试");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-[80] bg-[rgba(15,12,18,0.56)]" />
                <div
                    ref={focusTrapRef}
                    className="fixed inset-0 z-[81] flex items-end justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6"
                >
                    <DialogContent className="z-[82] flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-[30px] border border-[#edd6df] bg-[#fffdfd] shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)] dark:border-[#302631] dark:bg-[#181419] sm:max-h-[min(84vh,760px)]">
                        <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                            <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                                {editRecord ? "编辑礼金记录" : "添加礼金记录"}
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="space-y-5 px-1 pb-1">
                                <div className="wedding-soft-card space-y-5 p-4">
                                    <div>
                                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                            往来类型
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { key: "received", label: "收礼" },
                                                { key: "sent", label: "送礼" },
                                            ].map((item) => (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    className={`rounded-[18px] border px-3 py-3 text-sm font-medium transition ${
                                                        watch("type") === item.key
                                                            ? "border-transparent bg-pink-500 text-white shadow-sm"
                                                            : "border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text-soft)]"
                                                    }`}
                                                    onClick={() =>
                                                        setValue(
                                                            "type",
                                                            item.key as "received" | "sent",
                                                        )
                                                    }
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                            关联亲友
                                        </label>
                                        <select className="wedding-input" {...register("guestId")}>
                                            <option value="">选择亲友（可选）</option>
                                            {guests.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {!selectedGuestId ? (
                                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                                <input
                                                    type="text"
                                                    className="wedding-input"
                                                    placeholder="未关联亲友时，输入姓名"
                                                    {...register("guestName")}
                                                />
                                                <select className="wedding-input" {...register("relation")}>
                                                    {RELATION_GROUPS.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="wedding-soft-card space-y-4 p-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                                金额
                                            </label>
                                            <input
                                                type="number"
                                                className="wedding-input"
                                                placeholder="请输入金额"
                                                {...register("amount", { valueAsNumber: true })}
                                            />
                                            {formState.errors.amount ? (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {formState.errors.amount.message}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                                日期
                                            </label>
                                            <input
                                                type="date"
                                                className="wedding-input"
                                                {...register("date")}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                                事件
                                            </label>
                                            <select className="wedding-input" {...register("event")}>
                                                {GIFT_EVENTS.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                                支付方式
                                            </label>
                                            <select className="wedding-input" {...register("method")}>
                                                <option value="">选择支付方式（可选）</option>
                                                {PAYMENT_METHODS.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="wedding-soft-card space-y-4 p-4">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                            备注
                                        </label>
                                        <textarea
                                            className="wedding-input min-h-[112px] resize-none"
                                            rows={3}
                                            placeholder="记录红包来源、回礼情况或补充说明"
                                            {...register("note")}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 flex-1 rounded-[18px] border-[color:var(--wedding-line)] bg-white/80 text-[color:var(--wedding-text)] hover:bg-white dark:bg-white/6 dark:hover:bg-white/10"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        取消
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-12 flex-1 rounded-[18px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-[0_18px_30px_-18px_rgba(217,70,150,0.9)] hover:opacity-95"
                                    >
                                        {editRecord ? "保存更新" : "添加记录"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </div>
            </DialogPortal>
        </Dialog>
    );
}
