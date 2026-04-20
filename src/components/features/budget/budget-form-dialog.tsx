/**
 * 预算表单弹窗组件 - 使用统一 ResponsiveDialog
 */

import { ResponsiveDialog } from "@/components/ui/dialog/index";
import type { WeddingBudget } from "@/wedding/type";
import { BasicInfoSection } from "./components/basic-info-section";
import { FinancialDetailsSection } from "./components/financial-details-section";
import { NotesSection } from "./components/notes-section";
import { VendorInfoSection } from "./components/vendor-info-section";
import { useBudgetForm } from "./hooks/use-budget-form";

export function BudgetFormDialog({
    open,
    onOpenChange,
    editBudget,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editBudget?: WeddingBudget;
}) {
    const {
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
        handleSubmit,
    } = useBudgetForm(editBudget, open);

    const onConfirm = async () => {
        const success = await handleSubmit();
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={editBudget ? "编辑预算" : "添加预算"}
            fullScreenOnMobile={true}
            maxWidth="md"
            actions={{
                cancelText: "取消",
                confirmText: editBudget ? "保存更新" : "创建预算",
                onConfirm: onConfirm,
                loading: loading,
            }}
        >
            <div className="space-y-5 px-1 pb-1">
                <BasicInfoSection
                    category={category}
                    budget={budget}
                    onCategoryChange={setCategory}
                    onBudgetChange={setBudget}
                />

                <FinancialDetailsSection
                    spent={spent}
                    status={status}
                    deposit={deposit}
                    balance={balance}
                    onSpentChange={setSpent}
                    onStatusChange={setStatus}
                    onDepositChange={setDeposit}
                    onBalanceChange={setBalance}
                />

                <VendorInfoSection
                    vendor={vendor}
                    vendorPhone={vendorPhone}
                    dueDate={dueDate}
                    onVendorChange={setVendor}
                    onVendorPhoneChange={setVendorPhone}
                    onDueDateChange={setDueDate}
                />

                <NotesSection notes={notes} onNotesChange={setNotes} />
            </div>
        </ResponsiveDialog>
    );
}
