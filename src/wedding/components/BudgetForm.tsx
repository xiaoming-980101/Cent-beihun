/**
 * 预算表单组件
 */

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { BUDGET_STATUSES } from "@/wedding/constants";
import type { BudgetStatus } from "@/wedding/type";
import { formatAmount } from "@/wedding/utils";

interface BudgetFormProps {
    onClose?: () => void;
    editBudget?: {
        id: string;
        category: string;
        budget: number;
        spent: number;
        deposit?: number;
        balance?: number;
        vendor?: string;
        vendorPhone?: string;
        status: string;
        dueDate?: number;
        notes?: string;
    };
}

export function BudgetForm({ onClose, editBudget }: BudgetFormProps) {
    const { addBudget, updateBudget } = useWeddingStore();
    const categoryInputId = useId();
    const totalInputId = useId();
    const spentInputId = useId();
    const statusSelectId = useId();
    const depositInputId = useId();
    const balanceInputId = useId();
    const vendorInputId = useId();
    const phoneInputId = useId();
    const dueDateInputId = useId();
    const notesInputId = useId();

    const [category, setCategory] = useState(editBudget?.category || "");
    const [budget, setBudget] = useState(editBudget?.budget?.toString() || "");
    const [spent, setSpent] = useState(editBudget?.spent?.toString() || "0");
    const [deposit, setDeposit] = useState(
        editBudget?.deposit?.toString() || "",
    );
    const [balance, setBalance] = useState(
        editBudget?.balance?.toString() || "",
    );
    const [vendor, setVendor] = useState(editBudget?.vendor || "");
    const [vendorPhone, setVendorPhone] = useState(
        editBudget?.vendorPhone || "",
    );
    const [status, setStatus] = useState(editBudget?.status || "planned");
    const [dueDate, setDueDate] = useState<Date | undefined>(
        editBudget?.dueDate ? new Date(editBudget.dueDate) : undefined,
    );
    const [notes, setNotes] = useState(editBudget?.notes || "");

    const baseFieldClassName =
        "w-full rounded-[18px] border border-[color:var(--wedding-line)] bg-white/85 px-4 py-3 text-sm text-[color:var(--wedding-text)] outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200/70 dark:bg-white/6 dark:focus:border-pink-400/60 dark:focus:ring-pink-500/15";

    const handleSubmit = async () => {
        const budgetNum = parseFloat(budget);
        if (!category.trim()) {
            toast.error("请输入分类名称");
            return;
        }
        if (!budget || budgetNum <= 0) {
            toast.error("请输入有效预算金额");
            return;
        }

        const budgetData = {
            category: category.trim(),
            budget: budgetNum,
            spent: parseFloat(spent) || 0,
            deposit: deposit ? parseFloat(deposit) : undefined,
            balance: balance ? parseFloat(balance) : undefined,
            vendor: vendor.trim() || undefined,
            vendorPhone: vendorPhone.trim() || undefined,
            status: status as BudgetStatus,
            dueDate: dueDate ? dueDate.getTime() : undefined,
            notes: notes.trim() || undefined,
        };

        try {
            if (editBudget) {
                await updateBudget(editBudget.id, budgetData);
                toast.success("更新成功");
            } else {
                await addBudget(budgetData);
                toast.success("添加成功");
            }
            onClose?.();
        } catch (_err) {
            toast.error("操作失败");
        }
    };

    return (
        <div className="space-y-5 px-1 pb-1">
            <div className="wedding-soft-card space-y-5 p-4">
                <div>
                    <label
                        htmlFor={categoryInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        分类名称
                    </label>
                    <input
                        id={categoryInputId}
                        type="text"
                        className={baseFieldClassName}
                        placeholder="如：婚纱摄影、婚宴场地"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div>
                    <label
                        htmlFor={totalInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        预算金额
                    </label>
                    <input
                        id={totalInputId}
                        type="number"
                        className={baseFieldClassName}
                        placeholder="请输入预算金额"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                    {budget ? (
                        <div className="mt-2 text-xs wedding-muted">
                            预算总额：{formatAmount(parseFloat(budget))}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="wedding-soft-card space-y-4 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor={spentInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            已花费
                        </label>
                        <input
                            id={spentInputId}
                            type="number"
                            className={baseFieldClassName}
                            placeholder="已花费金额"
                            value={spent}
                            onChange={(e) => setSpent(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={statusSelectId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            状态
                        </label>
                        <select
                            id={statusSelectId}
                            className={baseFieldClassName}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {BUDGET_STATUSES.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor={depositInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            定金
                        </label>
                        <input
                            id={depositInputId}
                            type="number"
                            className={baseFieldClassName}
                            placeholder="定金金额"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={balanceInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            尾款
                        </label>
                        <input
                            id={balanceInputId}
                            type="number"
                            className={baseFieldClassName}
                            placeholder="待付尾款"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="wedding-soft-card space-y-4 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor={vendorInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            供应商
                        </label>
                        <input
                            id={vendorInputId}
                            type="text"
                            className={baseFieldClassName}
                            placeholder="供应商名称"
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={phoneInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            联系电话
                        </label>
                        <input
                            id={phoneInputId}
                            type="tel"
                            className={baseFieldClassName}
                            placeholder="供应商电话"
                            value={vendorPhone}
                            onChange={(e) => setVendorPhone(e.target.value)}
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
                        onDateChange={setDueDate}
                        placeholder="选择截止日期"
                    />
                </div>
            </div>

            <div className="wedding-soft-card space-y-4 p-4">
                <div>
                    <label
                        htmlFor={notesInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        备注
                    </label>
                    <textarea
                        id={notesInputId}
                        className={cn(
                            baseFieldClassName,
                            "min-h-[112px] resize-none",
                        )}
                        placeholder="补充记录付款节点、对接人或注意事项"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-[18px] border-[color:var(--wedding-line)] bg-white/90 text-[color:var(--wedding-text)] hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    onClick={onClose}
                >
                    关闭
                </Button>
                <Button
                    type="button"
                    className="h-12 flex-1 rounded-[18px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-[0_18px_30px_-18px_rgba(217,70,150,0.9)] hover:opacity-95"
                    onClick={handleSubmit}
                >
                    {editBudget ? "保存更新" : "创建预算"}
                </Button>
            </div>
        </div>
    );
}
