import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useWeddingStore } from "@/store/wedding";
import { formatAmount } from "@/wedding/utils";

export function QuickStatsGrid() {
    const navigate = useNavigate();
    const { weddingData } = useWeddingStore();

    const stats = useMemo(() => {
        const tasks = weddingData?.tasks ?? [];
        const guests = weddingData?.guests ?? [];
        const giftRecords = weddingData?.giftRecords ?? [];
        const budgets = weddingData?.weddingBudgets ?? [];

        const totalGift = giftRecords
            .filter((item) => item.type === "received")
            .reduce((sum, item) => sum + item.amount, 0);
        const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
        const spentBudget = budgets.reduce((sum, item) => sum + item.spent, 0);
        const remainingBudget = Math.max(totalBudget - spentBudget, 0);
        const todayTaskCount = tasks.filter((task) => {
            if (!task.deadline || task.status === "completed") {
                return false;
            }
            const today = new Date();
            const deadline = new Date(task.deadline);
            return (
                today.getFullYear() === deadline.getFullYear() &&
                today.getMonth() === deadline.getMonth() &&
                today.getDate() === deadline.getDate()
            );
        }).length;

        return [
            {
                title: "礼金总额",
                value: formatAmount(totalGift),
                hint: `${giftRecords.length} 笔记录`,
                color: "text-pink-500",
                path: "/tools/gift-book",
            },
            {
                title: "预算剩余",
                value: formatAmount(remainingBudget),
                hint: `总预算 ${formatAmount(totalBudget)}`,
                color: "text-violet-500",
                path: "/tools/wedding-budget",
            },
            {
                title: "今日待办",
                value: `${todayTaskCount} 项`,
                hint: `${tasks.length} 项总任务`,
                color: "text-orange-500",
                path: "/tasks",
            },
            {
                title: "确认宾客",
                value: `${guests.filter((item) => item.inviteStatus === "confirmed").length} 位`,
                hint: `${guests.length} 位宾客`,
                color: "text-blue-500",
                path: "/tools/guests",
            },
        ];
    }, [weddingData]);

    return (
        <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => (
                <button
                    key={item.title}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="wedding-surface-card wedding-card-interactive p-4 text-left"
                >
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--wedding-text-mute)]">
                        {item.title}
                    </div>
                    <div className={`mt-2 text-xl font-bold ${item.color}`}>
                        {item.value}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--wedding-text-soft)]">
                        {item.hint}
                    </div>
                </button>
            ))}
        </div>
    );
}
