import dayjs from "dayjs";
import type { WeddingData } from "./type";

export type PlannerSuggestion = {
    id: string;
    title: string;
    detail: string;
    tone: "accent" | "info" | "warning" | "success";
    actionLabel: string;
    actionPath: string;
};

export function getWeddingReadiness(data: WeddingData | null) {
    if (!data) {
        return 0;
    }

    const taskWeight = data.tasks.length
        ? (data.tasks.filter((item) => item.status === "completed").length /
              data.tasks.length) *
          55
        : 0;
    const guestWeight = data.guests.length
        ? (data.guests.filter((item) => item.inviteStatus === "confirmed")
              .length /
              data.guests.length) *
          20
        : 0;
    const budgetWeight = data.weddingBudgets.length
        ? (data.weddingBudgets.filter((item) => item.spent > 0).length /
              data.weddingBudgets.length) *
          15
        : 0;
    const dateWeight = data.weddingDate ? 10 : 0;

    return Math.max(
        0,
        Math.min(100, Math.round(taskWeight + guestWeight + budgetWeight + dateWeight)),
    );
}

export function getPlannerSuggestions(
    data: WeddingData | null,
): PlannerSuggestion[] {
    if (!data) {
        return [];
    }

    const upcomingTasks = data.tasks.filter((task) => {
        if (!task.deadline || task.status === "completed") {
            return false;
        }

        const diff = dayjs(task.deadline).diff(dayjs(), "day");
        return diff >= 0 && diff <= 14;
    });
    const missingDeadlineTasks = data.tasks.filter((task) => {
        return (
            task.status !== "completed" &&
            task.priority === "high" &&
            !task.deadline
        );
    });
    const pendingGuests = data.guests.filter((guest) => {
        return guest.inviteStatus === "pending" || guest.inviteStatus === "invited";
    });
    const confirmedGuests = data.guests.filter((guest) => {
        return guest.inviteStatus === "confirmed";
    });
    const budgetsWithBalance = data.weddingBudgets.filter((budget) => {
        return (budget.balance ?? budget.budget - budget.spent) > 0;
    });
    const nearDueBudgets = budgetsWithBalance.filter((budget) => {
        if (!budget.dueDate) {
            return false;
        }
        const diff = dayjs(budget.dueDate).diff(dayjs(), "day");
        return diff >= 0 && diff <= 21;
    });
    const noDate = !data.weddingDate;

    const suggestions: PlannerSuggestion[] = [];

    if (noDate) {
        suggestions.push({
            id: "set-date",
            title: "先补上婚期，时间线会更准确",
            detail:
                "当前还没有设置婚期，任务推荐、预算节奏和宾客提醒都会受影响。",
            tone: "accent",
            actionLabel: "打开设置",
            actionPath: "/settings",
        });
    }

    if (missingDeadlineTasks.length > 0) {
        suggestions.push({
            id: "task-deadline",
            title: "高优先级任务还缺少截止日期",
            detail: `有 ${missingDeadlineTasks.length} 项重要待办尚未排期，建议先给它们补上时间。`,
            tone: "warning",
            actionLabel: "查看任务",
            actionPath: "/tasks",
        });
    }

    if (upcomingTasks.length > 0) {
        suggestions.push({
            id: "upcoming-task",
            title: "最近两周有关键任务即将到期",
            detail: `共有 ${upcomingTasks.length} 项任务临近截止，优先推进能避免最后阶段堆积。`,
            tone: "info",
            actionLabel: "查看日历",
            actionPath: "/tasks/calendar",
        });
    }

    if (pendingGuests.length > 0) {
        suggestions.push({
            id: "guest-followup",
            title: "宾客确认还可以再推进一轮",
            detail: `当前 ${confirmedGuests.length} 位已确认，仍有 ${pendingGuests.length} 位亲友待跟进。`,
            tone: "accent",
            actionLabel: "管理亲友",
            actionPath: "/tools/guests",
        });
    }

    if (nearDueBudgets.length > 0) {
        suggestions.push({
            id: "budget-due",
            title: "有预算项目接近付款节点",
            detail: `有 ${nearDueBudgets.length} 项预算将在 3 周内到期，建议提前确认尾款安排。`,
            tone: "warning",
            actionLabel: "查看预算",
            actionPath: "/tools/wedding-budget",
        });
    }

    if (data.giftRecords.length === 0 && data.guests.length > 0) {
        suggestions.push({
            id: "gift-book",
            title: "礼金簿还没开始记录",
            detail: "如果已经开始和亲友往来，可以先建立礼金台账，后续对账会轻松很多。",
            tone: "success",
            actionLabel: "打开礼金簿",
            actionPath: "/tools/gift-book",
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            id: "healthy",
            title: "当前筹备节奏很稳，可以继续细化体验项",
            detail: "核心数据已经比较完整，接下来更适合优化流程细节、宾客体验和预算平衡。",
            tone: "success",
            actionLabel: "查看工具箱",
            actionPath: "/tools",
        });
    }

    return suggestions.slice(0, 5);
}
