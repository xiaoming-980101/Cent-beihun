/**
 * 婚礼预算页面
 */

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    WeddingActionButton,
    WeddingEmptyState,
    WeddingFilterChip,
    WeddingPageShell,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
import { BudgetForm } from "@/wedding/components";
import { BUDGET_STATUSES } from "@/wedding/constants";
import { checkBudgetStatus, formatAmount } from "@/wedding/utils";

export default function WeddingBudget() {
    const { weddingData } = useWeddingStore();
    const budgets = weddingData?.weddingBudgets || [];

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState<
        undefined | (typeof budgets)[number]
    >(undefined);

    const filteredBudgets =
        filterStatus === "all"
            ? budgets
            : budgets.filter((b) => b.status === filterStatus);

    // 统计
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalPaid = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalDeposit = budgets.reduce((sum, b) => sum + (b.deposit || 0), 0);
    const remaining = totalBudget - totalPaid;

    return (
        <WeddingPageShell>
            <WeddingTopBar title="婚礼预算" subtitle="跟踪定金、尾款与执行情况" backTo="/tools" />

            <section className="wedding-hero p-5">
                <div className="text-sm text-white/80">预算总额</div>
                <div className="mt-2 text-5xl font-black tracking-tight text-white">
                    {formatAmount(totalBudget)}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-[18px] bg-white/12 p-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-white/75">
                            已支付
                        </div>
                        <div className="mt-2 text-lg font-bold text-white">
                            {formatAmount(totalPaid)}
                        </div>
                    </div>
                    <div className="rounded-[18px] bg-white/12 p-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-white/75">
                            定金
                        </div>
                        <div className="mt-2 text-lg font-bold text-white">
                            {formatAmount(totalDeposit)}
                        </div>
                    </div>
                    <div className="rounded-[18px] bg-white/12 p-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-white/75">
                            待付尾款
                        </div>
                        <div className="mt-2 text-lg font-bold text-white">
                            {formatAmount(remaining)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="wedding-surface-card p-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {(["all", ...BUDGET_STATUSES.map((s) => s.id)] as const).map(
                        (status) => (
                            <WeddingFilterChip
                                key={status}
                                active={filterStatus === status}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status === "all"
                                    ? "全部"
                                    : BUDGET_STATUSES.find((s) => s.id === status)
                                          ?.name || status}
                            </WeddingFilterChip>
                        ),
                    )}
                </div>
            </section>

            <section className="space-y-3">
                {filteredBudgets.length === 0 ? (
                    <WeddingEmptyState
                        icon="icon-[mdi--wallet-outline]"
                        title="还没有预算项目"
                        description="添加婚宴、摄影、策划等预算后，这里会自动计算进度与付款状态。"
                    />
                ) : (
                    filteredBudgets.map((budget) => {
                        const statusInfo = BUDGET_STATUSES.find(
                            (s) => s.id === budget.status,
                        );
                        const budgetStatus = checkBudgetStatus(budget);
                        const progress =
                            budget.budget > 0
                                ? Math.round((budget.spent / budget.budget) * 100)
                                : 0;

                        return (
                            <div
                                key={budget.id}
                                className="wedding-surface-card cursor-pointer p-4"
                                onClick={() => {
                                    setEditingBudget(budget);
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-500 dark:bg-fuchsia-500/10">
                                            <i className="icon-[mdi--wallet-giftcard] text-xl" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                                                {budget.category}
                                            </div>
                                            <div className="mt-1 text-sm wedding-muted">
                                                {budget.vendor ? `${budget.vendor}` : "未设置供应商"}
                                                {budget.vendorPhone ? ` · ${budget.vendorPhone}` : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                                        {statusInfo?.name || budget.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="wedding-muted">
                                        ¥ {budget.spent.toLocaleString()} / ¥{" "}
                                        {budget.budget.toLocaleString()}
                                    </span>
                                    <span className="font-semibold text-[color:var(--wedding-text)]">
                                        {progress}%
                                    </span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-black/6 dark:bg-white/8">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            budgetStatus.isOverBudget
                                                ? "bg-gradient-to-r from-rose-400 to-red-500"
                                                : budgetStatus.remaining < budget.budget * 0.1
                                                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                                  : "bg-gradient-to-r from-pink-500 to-violet-500"
                                        }`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="mt-3 flex flex-wrap gap-3 text-xs wedding-muted">
                                    {budget.deposit && budget.deposit > 0 ? (
                                        <span>定金: {formatAmount(budget.deposit)}</span>
                                    ) : null}
                                    {budget.balance && budget.balance > 0 ? (
                                        <span>尾款: {formatAmount(budget.balance)}</span>
                                    ) : null}
                                    {budget.dueDate ? (
                                        <span>
                                            截止:{" "}
                                            {new Date(budget.dueDate).toLocaleDateString()}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            <WeddingActionButton
                className="h-14 w-full rounded-[20px] text-base"
                onClick={() => {
                    setEditingBudget(undefined);
                    setShowForm(true);
                }}
            >
                <i className="icon-[mdi--plus] mr-1 size-5" />
                添加预算项目
            </WeddingActionButton>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/50" />
                    <div className="fixed top-0 left-0 z-[61] flex h-full w-full items-center justify-center pointer-events-none">
                        <DialogContent
                            className="pointer-events-auto bg-background w-[90vw] max-w-[500px] rounded-md overflow-y-auto max-h-[80vh]"
                            onInteractOutside={() => setShowForm(false)}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold border-b border-pink-100/50 dark:border-white/10 pb-3 mb-4 pt-2 pl-1 text-[#544249] dark:text-white">
                                    {editingBudget ? "编辑预算" : "添加预算"}
                                </DialogTitle>
                            </DialogHeader>
                            <BudgetForm
                                onClose={() => setShowForm(false)}
                                editBudget={editingBudget}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}
