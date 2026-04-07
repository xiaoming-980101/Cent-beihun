/**
 * 预算表单组件
 */

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWeddingStore } from "@/store/wedding";
import { BUDGET_STATUSES } from "@/wedding/constants";
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
    const [dueDate, setDueDate] = useState(
        editBudget?.dueDate
            ? new Date(editBudget.dueDate).toISOString().split("T")[0]
            : "",
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
            status: status as any,
            dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
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
        } catch (err) {
            toast.error("操作失败");
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* 分类名称 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    分类名称 *
                </label>
                <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="如：婚纱摄影、婚宴场地"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>

            {/* 预算金额 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    预算金额 *
                </label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="请输入预算金额"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />
                {budget && (
                    <div className="text-xs text-gray-500 mt-1">
                        {formatAmount(parseFloat(budget))}
                    </div>
                )}
            </div>

            {/* 已花费 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    已花费
                </label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="已花费金额"
                    value={spent}
                    onChange={(e) => setSpent(e.target.value)}
                />
            </div>

            {/* 定金 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">定金</label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="定金金额（可选）"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                />
            </div>

            {/* 尾款 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">尾款</label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="待付尾款（可选）"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                />
            </div>

            {/* 供应商 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    供应商
                </label>
                <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="供应商名称"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                />
            </div>

            {/* 供应商电话 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    供应商电话
                </label>
                <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="供应商电话"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                />
            </div>

            {/* 状态 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">状态</label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
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

            {/* 付款截止日期 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    付款截止日期
                </label>
                <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            {/* 备注 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">备注</label>
                <textarea
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                    placeholder="备注信息"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                    取消
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                    {editBudget ? "更新" : "添加"}
                </Button>
            </div>
        </div>
    );
}
