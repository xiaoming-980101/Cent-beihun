import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/mini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { useWeddingStore } from "@/store/wedding";
import { GIFT_EVENTS, PAYMENT_METHODS, RELATION_GROUPS } from "@/wedding/constants";
import type { GiftRecord } from "@/wedding/type";

const EMPTY_SELECT_VALUE = "__EMPTY__";

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
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={editRecord ? "编辑礼金记录" : "添加礼金记录"}
            maxWidth="md"
            fullScreenOnMobile={true}
            saveButtonText={editRecord ? "保存更新" : "添加记录"}
            onSave={handleSubmit(onSubmit)}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                    {/* 往来类型 */}
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

                        {/* 关联亲友 */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                关联亲友
                            </label>
                            <Select
                                value={watch("guestId") || ""}
                                onValueChange={(value) =>
                                    setValue(
                                        "guestId",
                                        value === EMPTY_SELECT_VALUE ? "" : value,
                                    )
                                }
                            >
                                <SelectTrigger className="wedding-input">
                                    <SelectValue placeholder="选择亲友（可选）" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY_SELECT_VALUE}>
                                        选择亲友（可选）
                                    </SelectItem>
                                    {guests.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {!selectedGuestId ? (
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                    <Input
                                        type="text"
                                        className="wedding-input"
                                        placeholder="未关联亲友时，输入姓名"
                                        {...register("guestName")}
                                    />
                                    <Select
                                        value={watch("relation")}
                                        onValueChange={(value: any) =>
                                            setValue("relation", value)
                                        }
                                    >
                                        <SelectTrigger className="wedding-input">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RELATION_GROUPS.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* 金额和日期 */}
                    <div className="wedding-soft-card space-y-4 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                    金额
                                </label>
                                <Input
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
                                <Input
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
                                <Select
                                    value={watch("event")}
                                    onValueChange={(value: any) => setValue("event", value)}
                                >
                                    <SelectTrigger className="wedding-input">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GIFT_EVENTS.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                    支付方式
                                </label>
                                <Select
                                    value={watch("method") || ""}
                                    onValueChange={(value) =>
                                        setValue(
                                            "method",
                                            value === EMPTY_SELECT_VALUE ? "" : value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="wedding-input">
                                        <SelectValue placeholder="选择支付方式（可选）" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={EMPTY_SELECT_VALUE}>
                                            选择支付方式（可选）
                                        </SelectItem>
                                        {PAYMENT_METHODS.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 备注 */}
                    <div className="wedding-soft-card space-y-4 p-4">
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                备注
                            </label>
                            <Textarea
                                className="wedding-input min-h-[112px] resize-none"
                                rows={3}
                                placeholder="记录红包来源、回礼情况或补充说明"
                                {...register("note")}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </FormDialog>
    );
}
