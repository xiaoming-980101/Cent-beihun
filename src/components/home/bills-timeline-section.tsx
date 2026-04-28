import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { showBillInfo } from "@/components/bill-info";
import CategoryIcon from "@/components/category/icon";
import Loading from "@/components/loading";
import { EmptyState } from "@/components/shared";
import { Timeline } from "@/components/ui/timeline";
import { amountToNumber } from "@/ledger/bill";
import type { Bill, BillCategory } from "@/ledger/type";
import { formatAmount } from "@/wedding/utils";

interface BillsTimelineSectionProps {
    latestBills: Bill[];
    loading: boolean;
    categoryById: Map<string, BillCategory>;
    recentIncomeExpense: {
        income: number;
        expense: number;
    };
}

export function BillsTimelineSection({
    latestBills,
    loading,
    categoryById,
    recentIncomeExpense,
}: BillsTimelineSectionProps) {
    const navigate = useNavigate();

    return (
        <section className="overflow-hidden rounded-[28px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_20px_36px_-28px_rgba(15,23,42,0.28)]">
            <div className="bg-[linear-gradient(135deg,#fff1f7,#f6efff)] px-4 pb-4 pt-4 dark:bg-[linear-gradient(135deg,rgba(61,16,48,0.85),rgba(30,13,48,0.78))]">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[16px] font-semibold text-[color:var(--wedding-text)]">
                            收支明细
                        </div>
                        <div className="mt-1 text-[11px] text-[color:var(--wedding-text-mute)]">
                            最近 10 条账单 · 共 {latestBills.length} 笔
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-pink-500 shadow-sm dark:bg-white/10"
                        onClick={() => navigate("/search")}
                    >
                        查看全部
                    </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-white/10">
                        <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                            最近收入
                        </div>
                        <div className="mt-1 text-sm font-semibold text-emerald-500">
                            {formatAmount(recentIncomeExpense.income)}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-white/10">
                        <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                            最近支出
                        </div>
                        <div className="mt-1 text-sm font-semibold text-orange-500">
                            {formatAmount(recentIncomeExpense.expense)}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-white/10">
                        <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                            最近结余
                        </div>
                        <div className="mt-1 text-sm font-semibold text-pink-500">
                            {formatAmount(
                                recentIncomeExpense.income -
                                    recentIncomeExpense.expense,
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-3 pb-3 pt-2">
                {loading ? (
                    <div className="flex h-[420px] items-center justify-center">
                        <Loading />
                    </div>
                ) : latestBills.length === 0 ? (
                    <div className="flex h-[420px] items-center justify-center">
                        <EmptyState
                            icon={
                                <i className="icon-[mdi--receipt-text-outline] size-12 text-[color:var(--wedding-text-mute)]" />
                            }
                            title="还没有账单"
                            description="先添加一条明细吧"
                        />
                    </div>
                ) : (
                    <Timeline
                        showScrollArea
                        scrollHeight="420px"
                        items={latestBills.map((bill) => {
                            const category = categoryById.get(bill.categoryId);
                            const amount = amountToNumber(bill.amount);
                            return {
                                id: bill.id,
                                icon: category?.icon ? (
                                    <CategoryIcon icon={category.icon} />
                                ) : (
                                    <i className="icon-[mdi--receipt-text-outline] size-4" />
                                ),
                                iconColor: "var(--wedding-text-soft)",
                                title:
                                    bill.comment ||
                                    category?.name ||
                                    "未命名账单",
                                time: dayjs(bill.time).format("HH:mm"),
                                description: category?.name || "未分类",
                                amount: `${bill.type === "income" ? "+" : "-"}${formatAmount(amount)}`,
                                amountColor:
                                    bill.type === "income"
                                        ? "text-emerald-500"
                                        : "text-orange-500",
                                onClick: async (e) => {
                                    await showBillInfo(bill);
                                },
                            };
                        })}
                    />
                )}
            </div>
        </section>
    );
}
