/**
 * 任务日历视图页面
 */

import { useWeddingStore } from "@/store/wedding";
import { getCategoryIcon } from "@/wedding/utils";
import type { WeddingTask } from "@/wedding/type";
import { useState } from "react";

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
            <div className="p-4 border-b flex justify-between items-center">
                <button onClick={prevMonth} className="p-2">
                    <i className="icon-[mdi--chevron-left]" />
                </button>
                <span className="font-medium">
                    {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}
                    月
                </span>
                <button onClick={nextMonth} className="p-2">
                    <i className="icon-[mdi--chevron-right]" />
                </button>
            </div>

            {/* 日历网格 */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* 星期标题 */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm text-gray-500">
                    {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                        <div key={day} className="py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* 日期格子 */}
                <div className="grid grid-cols-7 gap-1">
                    {/* 填充第一天前的空白 */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="min-h-[80px] bg-gray-50 rounded"
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
                            date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={day}
                                className={`min-h-[80px] p-1 rounded border ${
                                    isToday
                                        ? "border-pink-500 bg-pink-50"
                                        : "border-gray-200 bg-white"
                                }`}
                            >
                                <div
                                    className={`text-sm ${isToday ? "text-pink-500 font-bold" : ""}`}
                                >
                                    {day}
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {dayTasks.slice(0, 3).map((task) => (
                                        <div
                                            key={task.id}
                                            className={`text-xs px-1 py-0.5 rounded truncate ${
                                                task.status === "completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : task.status ===
                                                        "in_progress"
                                                      ? "bg-blue-100 text-blue-600"
                                                      : "bg-gray-100 text-gray-600"
                                            }`}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                    {dayTasks.length > 3 && (
                                        <div className="text-xs text-gray-400">
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
    );
}
