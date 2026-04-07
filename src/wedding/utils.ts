/**
 * 婚礼筹备助手 - 工具函数
 */

import dayjs from "dayjs";
import { SCHEDULE_RULES } from "./constants";
import type {
    GiftRecord,
    TaskCategory,
    WeddingBudget,
    WeddingTask,
} from "./type";

/**
 * 计算倒计时
 * @param targetDate 目标日期时间戳
 * @returns 剩余时间对象（可为负数表示已过）
 */
export function calculateCountdown(targetDate: number): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
} {
    const target = dayjs(targetDate);
    const now = dayjs();
    const diffMs = target.valueOf() - now.valueOf();

    const absMs = Math.abs(diffMs);
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absMs % (1000 * 60)) / 1000);

    return {
        days: diffMs >= 0 ? days : -days,
        hours,
        minutes,
        seconds,
        totalMs: diffMs,
    };
}

/**
 * 计算礼金统计
 * @param records 礼金记录列表
 * @returns 统计结果
 */
export function calculateGiftStats(records: GiftRecord[]): {
    receivedTotal: number;
    sentTotal: number;
    netIncome: number;
    byGuest: Map<
        string,
        { received: number; sent: number; guestName?: string }
    >;
} {
    const receivedTotal = records
        .filter((r) => r.type === "received")
        .reduce((sum, r) => sum + r.amount, 0);

    const sentTotal = records
        .filter((r) => r.type === "sent")
        .reduce((sum, r) => sum + r.amount, 0);

    const netIncome = receivedTotal - sentTotal;

    const byGuest = new Map<
        string,
        { received: number; sent: number; guestName?: string }
    >();

    records.forEach((r) => {
        const guestKey = r.guestId || r.guestName || "unknown";
        const existing = byGuest.get(guestKey) || {
            received: 0,
            sent: 0,
            guestName: r.guestName,
        };
        if (r.type === "received") {
            existing.received += r.amount;
        } else {
            existing.sent += r.amount;
        }
        byGuest.set(guestKey, existing);
    });

    return { receivedTotal, sentTotal, netIncome, byGuest };
}

/**
 * 简化版自动排期：根据婚期推荐截止日期
 * @param category 任务分类
 * @param weddingDate 婚期时间戳
 * @returns 推荐的截止日期时间戳
 */
export function suggestDeadline(
    category: TaskCategory,
    weddingDate: number,
): number {
    const daysBefore = SCHEDULE_RULES[category] || 30;
    return dayjs(weddingDate).subtract(daysBefore, "day").valueOf();
}

/**
 * 任务进度统计
 * @param tasks 任务列表
 * @returns 进度统计结果
 */
export function calculateTaskProgress(tasks: WeddingTask[]): {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    percentage: number;
    byCategory: Record<string, { total: number; completed: number }>;
} {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byCategory = tasks.reduce(
        (acc, t) => {
            acc[t.category] = acc[t.category] || { total: 0, completed: 0 };
            acc[t.category].total++;
            if (t.status === "completed") acc[t.category].completed++;
            return acc;
        },
        {} as Record<string, { total: number; completed: number }>,
    );

    return { total, completed, pending, inProgress, percentage, byCategory };
}

/**
 * 预算状态检查
 * @param budget 预算项
 * @returns 预算状态信息
 */
export function checkBudgetStatus(budget: WeddingBudget): {
    isOverBudget: boolean;
    overAmount: number;
    remaining: number;
    depositPaid: boolean;
    needsBalancePayment: boolean;
} {
    const remaining = budget.budget - budget.spent;
    const isOverBudget = budget.spent > budget.budget;
    const overAmount = isOverBudget ? budget.spent - budget.budget : 0;
    const depositPaid = budget.deposit !== undefined && budget.deposit > 0;
    const needsBalancePayment =
        budget.balance !== undefined && budget.balance > 0;

    return {
        isOverBudget,
        overAmount,
        remaining,
        depositPaid,
        needsBalancePayment,
    };
}

/**
 * 格式化金额显示
 * @param amount 金额
 * @returns 格式化后的金额字符串
 */
export function formatAmount(amount: number): string {
    return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * 格式化日期显示
 * @param timestamp 时间戳
 * @param format 格式化模式
 * @returns 格式化后的日期字符串
 */
export function formatDate(
    timestamp: number,
    format: string = "YYYY-MM-DD",
): string {
    return dayjs(timestamp).format(format);
}

/**
 * 获取最近N天截止的任务
 * @param tasks 任务列表
 * @param days 天数
 * @returns 筛选后的任务列表
 */
export function getUpcomingTasks(
    tasks: WeddingTask[],
    days: number = 7,
): WeddingTask[] {
    const now = dayjs();
    const endDate = now.add(days, "day");

    return tasks
        .filter((t) => {
            if (!t.deadline || t.status === "completed") return false;
            const deadline = dayjs(t.deadline);
            return deadline.isAfter(now) && deadline.isBefore(endDate);
        })
        .sort((a, b) => (a.deadline || 0) - (b.deadline || 0));
}

/**
 * 获取任务分类名称
 * @param categoryId 分类ID
 * @returns 分类名称
 */
export function getCategoryName(categoryId: string): string {
    const categoryMap: Record<string, string> = {
        venue: "场地",
        photo: "摄影",
        dress: "婚纱",
        planning: "婚庆",
        dining: "餐饮",
    };
    return categoryMap[categoryId] || categoryId;
}

/**
 * 获取任务分类图标
 * @param categoryId 分类ID
 * @returns 图标类名
 */
export function getCategoryIcon(categoryId: string): string {
    const iconMap: Record<string, string> = {
        venue: "icon-[mdi--building]",
        photo: "icon-[mdi--camera]",
        dress: "icon-[mdi--hanger]",
        planning: "icon-[mdi--party-popper]",
        dining: "icon-[mdi--food]",
    };
    return iconMap[categoryId] || "icon-[mdi--checkbox-marked]";
}
