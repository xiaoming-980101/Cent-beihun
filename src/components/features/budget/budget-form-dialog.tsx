/**
 * 预算表单弹窗组件 - 使用统一 FormDialog
 */

import { useId, useState } from "react";
import { toast } from "sonner";
import type { WeddingBudget, BudgetStatus } from "@/wedding/type";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { BUDGET_STATUSES } from "@/wedding/constants";
import { formatAmount } from "@/wedding/utils";

export function BudgetFormDialog({
    open,
    onOpenChange,
    editBudget,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editBudget?: WeddingBudget;
}) {
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
            onOpenChange(false);
        } catch (_err) {
            toast.error("操作失败");
        }
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={editBudget ? "编辑预算" : "添加预算"}
            maxWidth="md"
            fullScreenOnMobile={true}
            saveButtonText={editBudget ? "保存更新" : "创建预算"}
            onSave={handleSubmit}
        >
            <div className="space-y-5 px-1 pb-1">
                <div className="wedding-soft-card space-y-5 p-4">
                    <div>
                        <label
                            htmlFor={categoryInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            分类名称
                        </label>
                        <Input
                            id={categoryInputId}
                            type="text"
                            className="wedding-input"
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
                        <Input
                            id={totalInputId}
                            type="number"
                            className="wedding-input"
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
                            <Input
                                id={spentInputId}
                                type="number"
                                className="wedding-input"
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
                        <Select
                            value={status}
                            onValueChange={(value) =>
                                setStatus(value as BudgetStatus)
                            }
                        >
                                <SelectTrigger id={statusSelectId} className="wedding-input">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {BUDGET_STATUSES.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            <Input
                                id={depositInputId}
                                type="number"
                                className="wedding-input"
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
                            <Input
                                id={balanceInputId}
                                type="number"
                                className="wedding-input"
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
                            <Input
                                id={vendorInputId}
                                type="text"
                                className="wedding-input"
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
                            <Input
                                id={phoneInputId}
                                type="tel"
                                className="wedding-input"
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
                        <Textarea
                            id={notesInputId}
                            className={cn(
                                "wedding-input",
                                "min-h-[112px] resize-none",
                            )}
                            placeholder="补充记录付款节点、对接人或注意事项"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </FormDialog>
    );
}
