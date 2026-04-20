/**
 * 预算表单业务逻辑 Hook
 * 从 BudgetFormDialog 中提取的业务逻辑
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWeddingStore } from "@/store/wedding";
import type { BudgetStatus, WeddingBudget } from "@/wedding/type";

export function useBudgetForm(editBudget?: WeddingBudget, open?: boolean) {
    const { addBudget, updateBudget } = useWeddingStore();

    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [spent, setSpent] = useState("0");
    const [deposit, setDeposit] = useState("");
    const [balance, setBalance] = useState("");
    const [vendor, setVendor] = useState("");
    const [vendorPhone, setVendorPhone] = useState("");
    const [status, setStatus] = useState<BudgetStatus>("planned");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    // 当弹窗打开或 editBudget 变化时，重置表单
    useEffect(() => {
        if (open) {
            if (editBudget) {
                setCategory(editBudget.category || "");
                setBudget(editBudget.budget?.toString() || "");
                setSpent(editBudget.spent?.toString() || "0");
                setDeposit(editBudget.deposit?.toString() || "");
                setBalance(editBudget.balance?.toString() || "");
                setVendor(editBudget.vendor || "");
                setVendorPhone(editBudget.vendorPhone || "");
                setStatus(editBudget.status || "planned");
                setDueDate(
                    editBudget.dueDate
                        ? new Date(editBudget.dueDate)
                        : undefined,
                );
                setNotes(editBudget.notes || "");
            } else {
                // 重置为空表单
                setCategory("");
                setBudget("");
                setSpent("0");
                setDeposit("");
                setBalance("");
                setVendor("");
                setVendorPhone("");
                setStatus("planned");
                setDueDate(undefined);
                setNotes("");
            }
        }
    }, [open, editBudget]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const budgetNum = parseFloat(budget);
            if (!category.trim()) {
                toast.error("请输入分类名称");
                return false;
            }
            if (!budget || budgetNum <= 0) {
                toast.error("请输入有效预算金额");
                return false;
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

            if (editBudget) {
                await updateBudget(editBudget.id, budgetData);
                toast.success("更新成功");
            } else {
                await addBudget(budgetData);
                toast.success("添加成功");
            }
            return true;
        } catch (_err) {
            toast.error("操作失败");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        // 状态
        category,
        budget,
        spent,
        deposit,
        balance,
        vendor,
        vendorPhone,
        status,
        dueDate,
        notes,
        loading,

        // 设置函数
        setCategory,
        setBudget,
        setSpent,
        setDeposit,
        setBalance,
        setVendor,
        setVendorPhone,
        setStatus,
        setDueDate,
        setNotes,

        // 提交函数
        handleSubmit,
    };
}
