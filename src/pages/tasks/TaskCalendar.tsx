/**
 * 任务日历视图页面
 */

import { useState } from "react";
import { useWeddingStore } from "@/store/wedding";
import type { WeddingTask } from "@/wedding/type";
import { getCategoryIcon } from "@/wedding/utils";

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
        <div className="flex flex-col h-full">
            {/* 月份导航 */}
            <div className="backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl p-4 m-2 shadow-sm border border-white/20 dark:border-stone-700/30 flex justify-between items-center">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-full hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
                >
                    <i className="icon-[mdi--chevron-left] text-gray-600 dark:text-gray-300" />
                </button>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                    {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}
                    月
                </span>
                <button
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
                >
                    <i className="icon-[mdi--chevron-right] text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* 日历网格 */}
            <div className="flex-1 overflow-y-auto">
                <div className="backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl p-4 m-2 shadow-sm border border-white/20 dark:border-stone-700/30">
                    {/* 星期标题 */}
                    <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm">
                        {["日", "一", "二", "三", "四", "五", "六"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="py-2 text-gray-500/80 dark:text-gray-400/80 font-medium border-b border-pink-200/30 dark:border-pink-800/30"
                                >
                                    {day}
                                </div>
                            ),
                        )}
                    </div>

                    {/* 日期格子 */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* 填充第一天前的空白 */}
                        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="min-h-[80px] bg-gray-100/50 dark:bg-gray-800/50 rounded-lg"
                            />
                        ))}

                        {/* 日期格子 */}
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
                                date.toDateString() ===
                                new Date().toDateString();

                            return (
                                <div
                                    key={day}
                                    className={`min-h-[80px] p-1.5 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                                        isToday
                                            ? "border-pink-400 dark:border-pink-500 bg-pink-50/50 dark:bg-pink-900/20 hover:bg-pink-100/60 dark:hover:bg-pink-900/30"
                                            : "border-white/20 dark:border-stone-700/30 bg-white/50 dark:bg-stone-800/50 hover:bg-white/70 dark:hover:bg-stone-700/50"
                                    }`}
                                >
                                    <div
                                        className={`text-sm mb-1 ${
                                            isToday
                                                ? "text-pink-500 dark:text-pink-400 font-bold"
                                                : "text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {day}
                                    </div>
                                    <div className="mt-1 space-y-0.5">
                                        {dayTasks.slice(0, 3).map((task) => (
                                            <div
                                                key={task.id}
                                                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                                    task.status === "completed"
                                                        ? "bg-green-100/80 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                        : task.status ===
                                                            "in_progress"
                                                          ? "bg-pink-100/80 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                                                          : "bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                }`}
                                                title={task.title}
                                            >
                                                {task.title}
                                            </div>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <div className="text-xs text-gray-400/80 dark:text-gray-500/80">
                                                +{dayTasks.length - 3}项
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
