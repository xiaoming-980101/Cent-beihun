import dayjs from "dayjs";
import { useMemo } from "react";
import type { WeddingData } from "@/wedding/type";
import { formatAmount } from "@/wedding/utils";

export interface ActivityItem {
    key: string;
    icon: string;
    color: string;
    text: string;
    sub: string;
    path: string;
}

/**
 * 婚礼活动动态 Hook
 * 负责聚合和格式化首页显示的最近活动
 */
export function useWeddingActivities(weddingData?: WeddingData) {
    const homeActivities = useMemo(() => {
        if (!weddingData) return [];

        // 任务活动（最近 2 条）
        const taskActivities = (weddingData.tasks || [])
            .slice()
            .sort(
                (a, b) =>
                    (b.completedAt || b.createdAt) -
                    (a.completedAt || a.createdAt),
            )
            .slice(0, 2)
            .map((task) => ({
                key: `task-${task.id}`,
                icon: "icon-[mdi--clipboard-check-outline]",
                color: "#A855F7",
                text: `${task.title} ${task.status === "completed" ? "已完成" : "进行中"}`,
                sub: task.completedAt
                    ? dayjs(task.completedAt).format("MM-DD HH:mm")
                    : dayjs(task.createdAt).format("MM-DD HH:mm"),
                path: "/tasks",
            }));

        // 礼金活动（最近 1 条）
        const giftActivities = (weddingData.giftRecords || [])
            .slice()
            .sort((a, b) => b.date - a.date)
            .slice(0, 1)
            .map((record) => ({
                key: `gift-${record.id}`,
                icon: "icon-[mdi--gift-outline]",
                color: "#F472B6",
                text: `${record.guestName || "礼金记录"} ${record.type === "received" ? "收礼" : "送礼"} ${formatAmount(record.amount)}`,
                sub: dayjs(record.date).format("MM-DD HH:mm"),
                path: "/tools/gift-book",
            }));

        // 宾客活动（最近 1 条已确认）
        const guestActivities = (weddingData.guests || [])
            .filter((guest) => guest.inviteStatus === "confirmed")
            .slice(0, 1)
            .map((guest) => ({
                key: `guest-${guest.id}`,
                icon: "icon-[mdi--account-group-outline]",
                color: "#22C55E",
                text: `${guest.name} 已确认出席`,
                sub: guest.phone || "宾客状态更新",
                path: "/tools/guests",
            }));

        return [...taskActivities, ...giftActivities, ...guestActivities].slice(
            0,
            4,
        );
    }, [weddingData]);

    // 礼金汇总
    const giftSummary = useMemo(() => {
        if (!weddingData) {
            return { count: 0, received: 0, sent: 0 };
        }

        const records = weddingData.giftRecords || [];
        const received = records
            .filter((item) => item.type === "received")
            .reduce((sum, item) => sum + item.amount, 0);
        const sent = records
            .filter((item) => item.type === "sent")
            .reduce((sum, item) => sum + item.amount, 0);

        return {
            count: records.length,
            received,
            sent,
        };
    }, [weddingData]);

    return {
        homeActivities,
        giftSummary,
    };
}
