import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { amountToNumber } from "@/ledger/bill";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { useWeddingStore } from "@/store/wedding";
import { useBudget } from "./use-budget";
import useCategory from "./use-category";

/**
 * 首页数据聚合 Hook
 * 负责获取和计算首页所需的所有数据
 */
export function useHomeData() {
    const { bills, loading, sync } = useLedgerStore();
    const { categories } = useCategory();
    const currentBook = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((b) => b.id === currentBookId);
        }),
    );
    const { id: userId } = useUserStore();
    const { budgets: allBudgets } = useBudget();
    const { weddingData } = useWeddingStore();

    // 账本信息
    const bookLabel = currentBook?.name || "当前账本";

    // 分类映射
    const categoryById = useMemo(() => {
        return new Map(categories.map((category) => [category.id, category]));
    }, [categories]);

    // 最近账单
    const latestBills = useMemo(() => bills.slice(0, 10), [bills]);

    // Hero 金额
    const heroAmount = useMemo(() => {
        return amountToNumber(
            latestBills.reduce((p, c) => {
                return p + c.amount * (c.type === "income" ? 1 : -1);
            }, 0),
        );
    }, [latestBills]);

    // 最近收支统计
    const recentIncomeExpense = useMemo(() => {
        return latestBills.reduce(
            (acc, bill) => {
                const amount = amountToNumber(bill.amount);
                if (bill.type === "income") {
                    acc.income += amount;
                } else {
                    acc.expense += amount;
                }
                return acc;
            },
            { income: 0, expense: 0 },
        );
    }, [latestBills]);

    // 预算数据
    const budgets = useMemo(() => {
        return allBudgets.filter((b) => {
            return b.joiners.includes(userId) && b.start < Date.now();
        });
    }, [allBudgets, userId]);

    // 婚礼数据统计
    const weddingStats = useMemo(() => {
        if (!weddingData) {
            return null;
        }

        return {
            taskCount: weddingData.tasks.length,
            completedTaskCount: weddingData.tasks.filter(
                (item) => item.status === "completed",
            ).length,
            guestCount: weddingData.guests.length,
            giftCount: weddingData.giftRecords.length,
            budgets: weddingData.weddingBudgets ?? [],
        };
    }, [weddingData]);

    return {
        // 账本信息
        currentBook,
        bookLabel,

        // 账单数据
        bills,
        latestBills,
        loading,
        sync,
        heroAmount,
        recentIncomeExpense,
        categoryById,

        // 预算数据
        budgets,

        // 婚礼数据
        weddingData,
        weddingStats,
    };
}
