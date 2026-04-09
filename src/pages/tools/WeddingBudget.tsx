/**
 * 预算管理页面
 */

import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    WeddingEmptyState,
    WeddingFilterChip,
    WeddingPageShell,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";
import { BudgetForm } from "@/wedding/components";
import { BUDGET_STATUSES } from "@/wedding/constants";
import { checkBudgetStatus, formatAmount } from "@/wedding/utils";

const BUDGET_ICONS: Record<string, string> = {
    婚宴酒店: "icon-[mdi--silverware-fork-knife]",
    婚纱摄影: "icon-[mdi--camera-outline]",
    婚礼策划: "icon-[mdi--diamond-stone]",
    礼服婚纱: "icon-[mdi--hanger]",
};

const BUDGET_ICON_TONES: Record<string, string> = {
    婚宴酒店: "bg-pink-500/14 text-pink-500",
    婚纱摄影: "bg-violet-500/14 text-violet-500",
    婚礼策划: "bg-amber-500/14 text-amber-500",
    礼服婚纱: "bg-blue-500/14 text-blue-500",
};

export default function WeddingBudget() {
    const { weddingData } = useWeddingStore();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const budgets = weddingData?.weddingBudgets || [];
    const bookLabel = currentBookName || "当前账本";

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
            <WeddingTopBar
                title="预算管理"
                subtitle={`跟踪${bookLabel}预算与执行情况`}
                backTo="/tools"
            />

            <section className="wedding-hero p-5">
                <div className="text-sm text-white/75">预算总额</div>
                <div className="mt-2 text-[44px] font-black tracking-tight text-white">
                    {formatAmount(totalBudget)}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2.5">
                    <div className="rounded-[16px] bg-white/12 p-3">
                        <div className="text-[11px] text-white/72">已支付</div>
                        <div className="mt-2 text-lg font-bold text-white">
                            {formatAmount(totalPaid)}
                        </div>
                    </div>
                    <div className="rounded-[16px] bg-white/12 p-3">
                        <div className="text-[11px] text-white/72">定金</div>
                        <div className="mt-2 text-lg font-bold text-white">
                            {formatAmount(totalDeposit)}
                        </div>
                    </div>
                    <div className="rounded-[16px] bg-white/12 p-3">
                        <div className="text-[11px] text-white/72">
                            待付尾款
                        </div>
                        <div className="mt-2 text-lg font-bold text-white">
                            {formatAmount(remaining)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex gap-2 overflow-x-auto pb-1">
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
                                ? Math.round(
                                      (budget.spent / budget.budget) * 100,
                                  )
                                : 0;
                        const icon =
                            BUDGET_ICONS[budget.category] ||
                            "icon-[mdi--wallet-outline]";
                        const iconTone =
                            BUDGET_ICON_TONES[budget.category] ||
                            "bg-fuchsia-500/14 text-fuchsia-500";
                        const statusClassName =
                            budget.status === "deposit_paid"
                                ? "bg-blue-500/12 text-blue-500"
                                : budget.status === "completed"
                                  ? "bg-emerald-500/12 text-emerald-500"
                                  : "bg-white/70 text-[color:var(--wedding-text-soft)] dark:bg-white/8";
                        const progressClassName = budgetStatus.isOverBudget
                            ? "bg-gradient-to-r from-rose-400 to-red-500"
                            : budget.status === "completed"
                              ? "bg-gradient-to-r from-emerald-400 to-green-500"
                              : "bg-gradient-to-r from-pink-500 to-fuchsia-500";

                        return (
                            <button
                                key={budget.id}
                                type="button"
                                className="wedding-surface-card cursor-pointer p-4 text-left"
                                onClick={() => {
                                    setEditingBudget(budget);
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconTone}`}
                                        >
                                            <i className={`${icon} text-xl`} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                                                {budget.category}
                                            </div>
                                            <div className="mt-1 text-xs wedding-muted">
                                                <span>
                                                    {budget.dueDate
                                                        ? new Date(
                                                              budget.dueDate,
                                                          )
                                                              .toISOString()
                                                              .slice(0, 10)
                                                        : "未设置日期"}
                                                </span>
                                                {budget.vendor ? (
                                                    <span className="ml-2">
                                                        {budget.vendor}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs ${statusClassName}`}
                                    >
                                        {statusInfo?.name || budget.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-[color:var(--wedding-text-soft)]">
                                        已使用 {progress}%
                                    </span>
                                    <span className="font-semibold text-[color:var(--wedding-text)]">
                                        ¥ {budget.spent.toLocaleString()} / ¥{" "}
                                        {budget.budget.toLocaleString()}
                                    </span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-black/6 dark:bg-white/8">
                                    <div
                                        className={`h-full rounded-full transition-all ${progressClassName}`}
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="mt-3 flex flex-wrap gap-3 text-xs wedding-muted">
                                    {budget.deposit && budget.deposit > 0 ? (
                                        <span>
                                            定金: {formatAmount(budget.deposit)}
                                        </span>
                                    ) : null}
                                    {budget.balance && budget.balance > 0 ? (
                                        <span>
                                            尾款: {formatAmount(budget.balance)}
                                        </span>
                                    ) : null}
                                    {budget.dueDate ? (
                                        <span>
                                            截止:{" "}
                                            {new Date(
                                                budget.dueDate,
                                            ).toLocaleDateString()}
                                        </span>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })
                )}
            </section>

            <button
                type="button"
                className="fixed bottom-[calc(var(--mobile-bottombar-height)+1.25rem+env(safe-area-inset-bottom))] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ef5cab] to-[#cb4dc8] text-white shadow-[0_16px_28px_-16px_rgba(239,92,171,0.95)] sm:bottom-8 sm:right-8"
                onClick={() => {
                    setEditingBudget(undefined);
                    setShowForm(true);
                }}
                aria-label="添加预算项目"
            >
                <i className="icon-[mdi--plus] size-6" />
            </button>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-[80] bg-[rgba(15,12,18,0.56)]" />
                    <div className="fixed inset-0 z-[81] flex items-end justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6">
                        <DialogContent
                            fade
                            className="z-[82] flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-[30px] border border-[#edd6df] bg-[#fffdfd] shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)] dark:border-[#302631] dark:bg-[#181419] sm:max-h-[min(84vh,760px)]"
                            onInteractOutside={() => setShowForm(false)}
                        >
                            <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                                <div className="mb-3 flex justify-center sm:hidden">
                                    <div className="h-1.5 w-12 rounded-full bg-[color:var(--wedding-line-strong)]" />
                                </div>
                                <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                                    {editingBudget ? "编辑预算" : "添加预算"}
                                </DialogTitle>
                                <p className="mt-2 pl-1 text-sm wedding-muted">
                                    记录预算、已付金额和供应商信息，后续会自动计算进度。
                                </p>
                            </DialogHeader>
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
                                <BudgetForm
                                    onClose={() => setShowForm(false)}
                                    editBudget={editingBudget}
                                />
                            </div>
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}
