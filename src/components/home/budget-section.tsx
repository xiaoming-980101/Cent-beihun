import { useRef } from "react";
import { useNavigate } from "react-router";
import { StorageAPI } from "@/api/storage";
import BudgetCard from "@/components/budget/card";
import type { Budget } from "@/components/budget/type";
import { HintTooltip } from "@/components/hint";
import { PaginationIndicator } from "@/components/indicator";
import { EmptyState } from "@/components/shared";
import { WeddingStat } from "@/components/wedding-ui";
import { useSnap } from "@/hooks/use-snap";
import { formatAmount } from "@/wedding/utils";

interface BudgetSectionProps {
    budgets: Budget[];
    weddingBudgets: Array<{ budget: number; spent: number }>;
    bookLabel: string;
    syncStatus: "wait" | "syncing" | "success" | "failed";
}

export function BudgetSection({
    budgets,
    weddingBudgets,
    bookLabel,
    syncStatus,
}: BudgetSectionProps) {
    const navigate = useNavigate();
    const budgetContainer = useRef<HTMLDivElement>(null);
    const { count: budgetCount, index: curBudgetIndex } = useSnap(
        budgetContainer,
        0,
    );

    return (
        <div className="space-y-3">
            {/* 预算概览 */}
            <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                            预算概览
                        </div>
                        <div className="mt-1 text-[11px] text-[color:var(--wedding-text-mute)]">
                            当前账本的预算与支付进度
                        </div>
                    </div>
                    <button
                        type="button"
                        className="text-[11px] text-pink-500"
                        onClick={() => navigate("/tools/wedding-budget")}
                    >
                        详情
                    </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                        [
                            "总预算",
                            formatAmount(
                                weddingBudgets.reduce(
                                    (sum, item) => sum + item.budget,
                                    0,
                                ),
                            ),
                        ],
                        [
                            "已支付",
                            formatAmount(
                                weddingBudgets.reduce(
                                    (sum, item) => sum + item.spent,
                                    0,
                                ),
                            ),
                        ],
                        ["项目数", `${weddingBudgets.length} 项`],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-2xl bg-[color:var(--wedding-surface-muted)] px-3 py-3 text-center"
                        >
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                {label}
                            </div>
                            <div className="mt-1 text-[13px] font-semibold text-[color:var(--wedding-text)]">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 gap-3">
                <WeddingStat
                    label="进行中预算"
                    value={`${weddingBudgets.length} 项`}
                    hint={`${bookLabel}相关项目`}
                />
                <div className="wedding-soft-card flex min-w-0 flex-col gap-1 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-[0.12em] wedding-muted">
                            同步状态
                        </span>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 transition-colors hover:bg-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400 dark:hover:bg-pink-500/30"
                            onClick={() => {
                                StorageAPI.toSync();
                            }}
                            title="立即同步"
                        >
                            {syncStatus === "syncing" ? (
                                <i className="icon-[mdi--loading] size-4 animate-spin" />
                            ) : (
                                <i className="icon-[mdi--sync] size-4" />
                            )}
                        </button>
                    </div>
                    <span className="truncate text-lg font-semibold text-[color:var(--wedding-text)]">
                        {syncStatus === "success"
                            ? "已同步"
                            : syncStatus === "syncing"
                              ? "同步中"
                              : syncStatus === "wait"
                                ? "待同步"
                                : "异常"}
                    </span>
                    <span className="text-xs wedding-muted">
                        点击图标可立即同步
                    </span>
                </div>
            </div>

            {/* 预算卡片列表 */}
            <div
                ref={budgetContainer}
                className="flex gap-3 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
            >
                {budgets.length > 0 ? (
                    budgets.map((budget) => (
                        <BudgetCard
                            className="snap-start rounded-[22px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] shadow-none"
                            key={budget.id}
                            budget={budget}
                        />
                    ))
                ) : (
                    <div className="wedding-soft-card flex min-h-[160px] w-full items-center justify-center px-6 text-center">
                        <EmptyState
                            icon={
                                <i className="icon-[mdi--wallet-outline] size-12 text-[color:var(--wedding-text-mute)]" />
                            }
                            title="还没有预算"
                            description="先去工具箱添加预算项目吧"
                        />
                    </div>
                )}
            </div>
            {budgetCount > 1 ? (
                <div className="flex justify-center">
                    <PaginationIndicator
                        count={budgetCount}
                        current={curBudgetIndex}
                    />
                </div>
            ) : null}
        </div>
    );
}
