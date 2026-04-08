/**
 * 任务日历视图页面
 */

import { useState } from "react";
import {
    WeddingPageShell,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
import type { WeddingTask } from "@/wedding/type";

export default function TaskCalendar() {
    const { weddingData } = useWeddingStore();
    const tasks = weddingData?.tasks || [];

    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 获取当月所有有截止日期的任务
    const monthTasks = tasks.filter((task) => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return (
            deadline.getMonth() === currentMonth.getMonth() &&
            deadline.getFullYear() === currentMonth.getFullYear()
        );
    });

    // 按日期分组
    const tasksByDate: Record<string, WeddingTask[]> = {};
    monthTasks.forEach((task) => {
        if (task.deadline) {
            const dateKey = new Date(task.deadline).toLocaleDateString();
            if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
            tasksByDate[dateKey].push(task);
        }
    });

    // 获取当月天数和第一天星期
    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
    ).getDate();
    const firstDayOfWeek = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
    ).getDay();

    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
        );
    };

    return (
        <WeddingPageShell>
            <WeddingTopBar title="任务日历" subtitle="按日期查看婚礼待办" backTo="/tasks" />

            <section className="wedding-surface-card flex items-center justify-between p-4">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--wedding-text)] dark:bg-white/6"
                >
                    <i className="icon-[mdi--chevron-left]" />
                </button>
                <span className="text-lg font-semibold text-[color:var(--wedding-text)]">
                    {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--wedding-text)] dark:bg-white/6"
                >
                    <i className="icon-[mdi--chevron-right]" />
                </button>
            </section>

            <section className="wedding-surface-card p-4">
                <div className="mb-3 grid grid-cols-7 gap-2 text-center text-sm">
                    {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                        <div key={day} className="py-2 font-medium wedding-muted">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDayOfWeek }, (_, i) => i).map((offset) => (
                        <div
                            key={`empty-${offset + 1}`}
                            className="min-h-[88px] rounded-2xl bg-black/3 dark:bg-white/5"
                        />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day,
                        );
                        const dateKey = date.toLocaleDateString();
                        const dayTasks = tasksByDate[dateKey] || [];
                        const isToday =
                            date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={day}
                                className={`min-h-[88px] rounded-2xl border p-2 transition-all ${
                                    isToday
                                        ? "border-pink-300 bg-pink-50 dark:border-pink-500/30 dark:bg-pink-500/10"
                                        : "border-[color:var(--wedding-line)] bg-white/60 dark:bg-white/3"
                                }`}
                            >
                                <div
                                    className={`text-sm ${
                                        isToday
                                            ? "font-bold text-pink-500"
                                            : "text-[color:var(--wedding-text)]"
                                    }`}
                                >
                                    {day}
                                </div>
                                <div className="mt-2 space-y-1">
                                    {dayTasks.slice(0, 3).map((task) => (
                                        <div
                                            key={task.id}
                                            className={`truncate rounded-md px-1.5 py-0.5 text-[10px] ${
                                                task.status === "completed"
                                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10"
                                                    : task.status === "in_progress"
                                                      ? "bg-pink-100 text-pink-500 dark:bg-pink-500/10"
                                                      : "bg-violet-100 text-violet-500 dark:bg-violet-500/10"
                                            }`}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                    {dayTasks.length > 3 ? (
                                        <div className="text-[10px] wedding-muted">
                                            +{dayTasks.length - 3}项
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </WeddingPageShell>
    );
}
