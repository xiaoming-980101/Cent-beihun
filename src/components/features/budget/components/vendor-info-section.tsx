/**
 * 预算供应商信息区块组件
 * 从 BudgetFormDialog 中提取的 UI 组件
 */

import { useId } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";

interface VendorInfoSectionProps {
    vendor: string;
    vendorPhone: string;
    dueDate: Date | undefined;
    onVendorChange: (vendor: string) => void;
    onVendorPhoneChange: (phone: string) => void;
    onDueDateChange: (date: Date | undefined) => void;
}

export function VendorInfoSection({
    vendor,
    vendorPhone,
    dueDate,
    onVendorChange,
    onVendorPhoneChange,
    onDueDateChange,
}: VendorInfoSectionProps) {
    const vendorInputId = useId();
    const phoneInputId = useId();
    const dueDateInputId = useId();

    return (
        <div className="wedding-soft-card space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={vendorInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        供应商
                    </label>
                    <Input
                        id={vendorInputId}
                        type="text"
                        className="wedding-input"
                        placeholder="供应商名称"
                        value={vendor}
                        onChange={(e) => onVendorChange(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor={phoneInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        联系电话
                    </label>
                    <Input
                        id={phoneInputId}
                        type="tel"
                        className="wedding-input"
                        placeholder="供应商电话"
                        value={vendorPhone}
                        onChange={(e) => onVendorPhoneChange(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor={dueDateInputId}
                    className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                >
                    截止日期
                </label>
                <DatePicker
                    date={dueDate}
                    onDateChange={onDueDateChange}
                    placeholder="选择截止日期"
                />
            </div>
        </div>
    );
}
