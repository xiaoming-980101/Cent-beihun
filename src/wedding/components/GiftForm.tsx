/**
 * 礼金表单组件
 */

import { useState } from "react";
import { useWeddingStore } from "@/store/wedding";
import { GIFT_EVENTS, PAYMENT_METHODS } from "@/wedding/constants";
import { formatAmount } from "@/wedding/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GiftFormProps {
    onClose?: () => void;
    editRecord?: {
        id: string;
        type: string;
        guestId?: string;
        guestName?: string;
        amount: number;
        date: number;
        event: string;
        method?: string;
        note?: string;
    };
}

export function GiftForm({ onClose, editRecord }: GiftFormProps) {
    const { weddingData, addGiftRecord, updateGiftRecord } = useWeddingStore();
    const guests = weddingData?.guests || [];

    const [type, setType] = useState<"received" | "sent">(
        (editRecord?.type as any) || "received",
    );
    const [guestId, setGuestId] = useState(editRecord?.guestId || "");
    const [guestName, setGuestName] = useState(editRecord?.guestName || "");
    const [amount, setAmount] = useState(editRecord?.amount?.toString() || "");
    const [date, setDate] = useState(
        editRecord?.date
            ? new Date(editRecord.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
    );
    const [event, setEvent] = useState(editRecord?.event || "wedding");
    const [method, setMethod] = useState(editRecord?.method || "");
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
            date: new Date(date).getTime(),
            event: event as any,
            method: (method as any) || undefined,
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
        <div className="p-4 space-y-4">
            {/* 类型 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    类型 *
                </label>
                <div className="flex gap-2">
                    <button
                        className={`flex-1 py-2 rounded-lg ${
                            type === "received"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setType("received")}
                    >
                        收礼
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-lg ${
                            type === "sent"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setType("sent")}
                    >
                        送礼
                    </button>
                </div>
            </div>

            {/* 关联亲友 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">亲友</label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={guestId}
                    onChange={(e) => {
                        setGuestId(e.target.value);
                        if (e.target.value) {
                            const guest = guests.find(
                                (g) => g.id === e.target.value,
                            );
                            setGuestName(guest?.name || "");
                        }
                    }}
                >
                    <option value="">选择亲友（可选）</option>
                    {guests.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))}
                </select>
                {!guestId && (
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 mt-2"
                        placeholder="输入姓名（未关联亲友时）"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                    />
                )}
            </div>

            {/* 金额 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    金额 *
                </label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="请输入金额"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                {amount && (
                    <div className="text-xs text-gray-500 mt-1">
                        {formatAmount(parseFloat(amount))}
                    </div>
                )}
            </div>

            {/* 日期 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">日期</label>
                <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {/* 事件类型 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">事件</label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                >
                    {GIFT_EVENTS.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 支付方式 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    支付方式
                </label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="">选择支付方式（可选）</option>
                    {PAYMENT_METHODS.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 备注 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">备注</label>
                <textarea
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                    placeholder="备注信息"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                    取消
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                    {editRecord ? "更新" : "添加"}
                </Button>
            </div>
        </div>
    );
}
