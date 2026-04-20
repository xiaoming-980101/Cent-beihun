import { useMemo, useState } from "react";
import { BudgetFormDialog } from "@/components/features/budget/budget-form-dialog";
import { EmptyState, FloatingActionButton } from "@/components/shared";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
import { BUDGET_STATUSES } from "@/wedding/constants";
import {
    checkBudgetStatus,
    formatAmount,
    formatShortDate,
} from "@/wedding/utils";

const STATUS_STYLE = {
    planned: { color: "#F97316", bg: "rgba(249,115,22,0.12)" },
    deposit_paid: { color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
    completed: { color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
} as const;

export default function WeddingBudget() {
    const { weddingData } = useWeddingStore();
    const budgets = weddingData?.weddingBudgets || [];
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState<
        undefined | (typeof budgets)[number]
    >(undefined);

    const filtered = useMemo(() => {
        if (filterStatus === "all") return budgets;
        return budgets.filter((item) => item.status === filterStatus);
    }, [budgets, filterStatus]);

    const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
    const totalPaid = budgets.reduce((sum, item) => sum + item.spent, 0);
    const totalBalance = budgets.reduce(
        (sum, item) =>
            sum + (item.balance ?? Math.max(item.budget - item.spent, 0)),
        0,
    );
    const paidPct =
        totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0;

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="婚礼预算"
                subtitle="供应商与付款管理"
                backTo="/tools"
            />

            <section className="rounded-[28px] border border-purple-200 bg-[linear-gradient(135deg,#f5f0ff,#e9d5ff)] p-5 shadow-[0_18px_36px_-28px_rgba(168,85,247,0.45)] dark:border-purple-900/70 dark:bg-[linear-gradient(135deg,#2d1a45,#1a0d30)]">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-[11px] font-medium text-purple-900/70 dark:text-purple-200/80">
                            婚礼总预算
                        </div>
                        <div className="mt-1 text-[28px] font-bold leading-none text-purple-950 dark:text-white">
                            ¥{totalBudget.toLocaleString()}
                        </div>
                    </div>
                    <div className="rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-purple-800 dark:bg-white/10 dark:text-purple-200">
                        {paidPct}% 已付
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/50 p-3 dark:bg-black/15">
                        <div className="text-[10px] text-purple-900/70 dark:text-purple-200/70">
                            已支付
                        </div>
                        <div className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                            ¥{totalPaid.toLocaleString()}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white/50 p-3 dark:bg-black/15">
                        <div className="text-[10px] text-purple-900/70 dark:text-purple-200/70">
                            待支付
                        </div>
                        <div className="mt-1 text-lg font-bold text-orange-500">
                            ¥{totalBalance.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/50 dark:bg-white/10">
                    <div
                        className="h-full rounded-full bg-[#7C3AED]"
                        style={{ width: `${paidPct}%` }}
                    />
                </div>
                <div className="mt-1 text-[10px] text-purple-900/70 dark:text-purple-200/70">
                    {budgets.length} 个项目 ·{" "}
                    {
                        budgets.filter((item) => item.status === "completed")
                            .length
                    }{" "}
                    个已结清
                </div>
            </section>

            <section className="flex gap-2 overflow-x-auto pb-1">
                {["all", ...BUDGET_STATUSES.map((item) => item.id)].map(
                    (status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFilterStatus(status)}
                            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium"
                            style={{
                                background:
                                    filterStatus === status
                                        ? "#A855F7"
                                        : "var(--wedding-surface-muted)",
                                color:
                                    filterStatus === status
                                        ? "#fff"
                                        : "#A855F7",
                            }}
                        >
                            {status === "all"
                                ? "全部"
                                : BUDGET_STATUSES.find(
                                      (item) => item.id === status,
                                  )?.name}
                        </button>
                    ),
                )}
            </section>

            <section className="space-y-3">
                {filtered.length === 0 ? (
                    <EmptyState
                        title="还没有预算项目"
                        description="添加供应商与预算后，这里会自动汇总付款进度。"
                        action={{
                            label: "添加预算",
                            onClick: () => {
                                setEditingBudget(undefined);
                                setShowForm(true);
                            },
                        }}
                    />
                ) : (
                    filtered.map((budget) => {
                        const progress =
                            budget.budget > 0
                                ? Math.round(
                                      (budget.spent / budget.budget) * 100,
                                  )
                                : 0;
                        const statusStyle = STATUS_STYLE[budget.status];
                        const budgetState = checkBudgetStatus(budget);
                        return (
                            <button
                                key={budget.id}
                                type="button"
                                onClick={() => {
                                    setEditingBudget(budget);
                                    setShowForm(true);
                                }}
                                className="w-full rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                            {budget.category}
                                        </div>
                                        <div className="mt-1 text-[11px] wedding-muted">
                                            {budget.vendor || "待定供应商"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                            style={{
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                            }}
                                        >
                                            {BUDGET_STATUSES.find(
                                                (item) =>
                                                    item.id === budget.status,
                                            )?.name || budget.status}
                                        </span>
                                        <div className="text-base font-bold text-[color:var(--wedding-text)]">
                                            ¥{budget.budget.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="rounded-2xl bg-[color:var(--wedding-surface-muted)] p-2.5">
                                        <div className="text-[9px] text-[color:var(--wedding-text-mute)]">
                                            定金/已付
                                        </div>
                                        <div className="text-[13px] font-semibold text-green-600 dark:text-green-400">
                                            ¥{budget.spent.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-[color:var(--wedding-surface-muted)] p-2.5">
                                        <div className="text-[9px] text-[color:var(--wedding-text-mute)]">
                                            尾款/待付
                                        </div>
                                        <div className="text-[13px] font-semibold text-orange-500">
                                            ¥
                                            {(
                                                budget.balance ??
                                                Math.max(
                                                    budget.budget -
                                                        budget.spent,
                                                    0,
                                                )
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:var(--wedding-line)]">
                                    <div
                                        className={`h-full rounded-full ${
                                            budgetState.isOverBudget
                                                ? "bg-rose-500"
                                                : "bg-green-500"
                                        }`}
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--wedding-text-mute)]">
                                    <span>
                                        已用 {Math.min(progress, 999)}% ·{" "}
                                        {formatAmount(budget.spent)}
                                    </span>
                                    {budget.vendorPhone ? (
                                        <span>{budget.vendorPhone}</span>
                                    ) : budget.dueDate ? (
                                        <span>
                                            {formatShortDate(budget.dueDate)}
                                        </span>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })
                )}
            </section>

            <FloatingActionButton
                onClick={() => {
                    setEditingBudget(undefined);
                    setShowForm(true);
                }}
                className="bg-[#A855F7] text-white"
                aria-label="新增预算"
            >
                <i className="icon-[mdi--plus] size-6" />
            </FloatingActionButton>

            <BudgetFormDialog
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open);
                    if (!open) {
                        setEditingBudget(undefined);
                    }
                }}
                editBudget={editingBudget}
            />
        </WeddingPageShell>
    );
}
