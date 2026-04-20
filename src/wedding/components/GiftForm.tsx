/**
 * 礼金表单组件
 */

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { GIFT_EVENTS, PAYMENT_METHODS } from "@/wedding/constants";
import type { GiftRecord } from "@/wedding/type";
import { formatAmount } from "@/wedding/utils";

interface GiftFormProps {
    onClose?: () => void;
    editRecord?: {
        id: GiftRecord["id"];
        type: GiftRecord["type"];
        guestId?: GiftRecord["guestId"];
        guestName?: GiftRecord["guestName"];
        amount: GiftRecord["amount"];
        date: GiftRecord["date"];
        event: GiftRecord["event"];
        method?: GiftRecord["method"];
        note?: GiftRecord["note"];
    };
}

export function GiftForm({ onClose, editRecord }: GiftFormProps) {
    const { weddingData, addGiftRecord, updateGiftRecord } = useWeddingStore();
    const guests = weddingData?.guests || [];
    const baseFieldClassName = "wedding-input";

    const [type, setType] = useState<"received" | "sent">(
        editRecord?.type ?? "received",
    );
    const [guestId, setGuestId] = useState(editRecord?.guestId || "");
    const [guestName, setGuestName] = useState(editRecord?.guestName || "");
    const [amount, setAmount] = useState(editRecord?.amount?.toString() || "");
    const [date, setDate] = useState<Date>(
        editRecord?.date ? new Date(editRecord.date) : new Date(),
    );
    const [event, setEvent] = useState<GiftRecord["event"]>(
        editRecord?.event ?? "wedding",
    );
    const [method, setMethod] = useState<GiftRecord["method"] | "">(
        editRecord?.method ?? "",
    );
    const [note, setNote] = useState(editRecord?.note || "");

    const handleSubmit = async () => {
        const amountNum = parseFloat(amount);
        if (!amount || amountNum <= 0) {
            toast.error("请输入有效金额");
            return;
        }

        const recordData = {
            type,
            guestId: guestId || undefined,
            guestName: guestId ? undefined : guestName.trim() || undefined,
            amount: amountNum,
            date: date.getTime(),
            event,
            method: method || undefined,
            note: note.trim() || undefined,
        };

        try {
            if (editRecord) {
                await updateGiftRecord(editRecord.id, recordData);
                toast.success("更新成功");
            } else {
                await addGiftRecord(recordData);
                toast.success("添加成功");
            }
            onClose?.();
        } catch (err) {
            toast.error("操作失败");
        }
    };

    return (
        <div className="space-y-5 px-1 pb-1">
            <div className="wedding-soft-card space-y-5 p-4">
                <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        往来类型
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            {
                                key: "received",
                                label: "收礼",
                                activeClassName:
                                    "border-transparent bg-emerald-500 text-white shadow-sm",
                            },
                            {
                                key: "sent",
                                label: "送礼",
                                activeClassName:
                                    "border-transparent bg-rose-500 text-white shadow-sm",
                            },
                        ].map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={cn(
                                    "rounded-[18px] border px-3 py-3 text-sm font-medium transition",
                                    type === item.key
                                        ? item.activeClassName
                                        : "border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text-soft)]",
                                )}
                                onClick={() =>
                                    setType(item.key as "received" | "sent")
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
                    <select
                        className={baseFieldClassName}
                        value={guestId}
                        onChange={(e) => {
                            setGuestId(e.target.value);
                            if (e.target.value) {
                                const guest = guests.find(
                                    (item) => item.id === e.target.value,
                                );
                                setGuestName(guest?.name || "");
                            }
                        }}
                    >
                        <option value="">选择亲友（可选）</option>
                        {guests.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {!guestId ? (
                        <input
                            type="text"
                            className={cn(baseFieldClassName, "mt-2")}
                            placeholder="未关联亲友时，可直接输入姓名"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
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
                            className={baseFieldClassName}
                            placeholder="请输入金额"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {amount ? (
                            <div className="mt-2 text-xs wedding-muted">
                                {formatAmount(parseFloat(amount))}
                            </div>
                        ) : null}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                            日期
                        </label>
                        <DatePicker
                            date={date}
                            onDateChange={(newDate) =>
                                newDate && setDate(newDate)
                            }
                            placeholder="选择日期"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                            事件
                        </label>
                        <select
                            className={baseFieldClassName}
                            value={event}
                            onChange={(e) =>
                                setEvent(e.target.value as GiftRecord["event"])
                            }
                        >
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
                        <select
                            className={baseFieldClassName}
                            value={method}
                            onChange={(e) =>
                                setMethod(
                                    e.target.value as GiftRecord["method"] | "",
                                )
                            }
                        >
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
                        className={cn(
                            baseFieldClassName,
                            "min-h-[112px] resize-none",
                        )}
                        placeholder="记录红包来源、回礼情况或补充说明"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-[18px] border-[color:var(--wedding-line)] bg-white/90 text-[color:var(--wedding-text)] hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    onClick={onClose}
                >
                    关闭
                </Button>
                <Button
                    className="h-12 flex-1 rounded-[18px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-[0_18px_30px_-18px_rgba(217,70,150,0.9)] hover:opacity-95"
                    onClick={handleSubmit}
                >
                    {editRecord ? "保存更新" : "添加记录"}
                </Button>
            </div>
        </div>
    );
}
