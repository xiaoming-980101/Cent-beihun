/**
 * 金额和详情区块组件
 * 从 GiftFormDialog 中提取的 UI 组件
 */

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GIFT_EVENTS, PAYMENT_METHODS } from "@/wedding/constants";
import type { GiftFormValues } from "../hooks/use-gift-form";

interface AmountDetailsSectionProps {
    amount: number;
    date: string;
    event: GiftFormValues["event"];
    method: string;
    amountError?: string;
    onAmountChange: (amount: number) => void;
    onDateChange: (date: string) => void;
    onEventChange: (event: GiftFormValues["event"]) => void;
    onMethodChange: (method: string) => void;
    emptySelectValue: string;
}

export function AmountDetailsSection({
    amount,
    date,
    event,
    method,
    amountError,
    onAmountChange,
    onDateChange,
    onEventChange,
    onMethodChange,
    emptySelectValue,
}: AmountDetailsSectionProps) {
    return (
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
                        value={amount || ""}
                        onChange={(e) => onAmountChange(Number(e.target.value))}
                    />
                    {amountError ? (
                        <p className="mt-1 text-xs text-red-500">
                            {amountError}
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
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        事件
                    </label>
                    <Select
                        value={event}
                        onValueChange={(value: GiftFormValues["event"]) =>
                            onEventChange(value)
                        }
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
                        value={method || ""}
                        onValueChange={(value) =>
                            onMethodChange(
                                value === emptySelectValue ? "" : value,
                            )
                        }
                    >
                        <SelectTrigger className="wedding-input">
                            <SelectValue placeholder="选择支付方式（可选）" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={emptySelectValue}>
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
    );
}
