/**
 * 近期待办组件
 */

import { useNavigate } from "react-router";
import { useWeddingStore } from "@/store/wedding";
import { getCategoryIcon, getUpcomingTasks } from "@/wedding/utils";

export function UpcomingTasks() {
    const { weddingData } = useWeddingStore();
    const tasks = weddingData?.tasks || [];
    const navigate = useNavigate();

    const upcomingTasks = getUpcomingTasks(tasks, 7);

    if (upcomingTasks.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">近期待办</span>
                    <button
                        className="text-xs text-pink-500"
                        onClick={() => navigate("/tasks")}
                    >
                        查看全部
                    </button>
                </div>
                <div className="text-center text-gray-400 py-4 text-sm">
                    暂无待办任务
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">近期待办</span>
                <button
                    className="text-xs text-pink-500"
                    onClick={() => navigate("/tasks")}
                >
                    查看全部
                </button>
            </div>

            <div className="space-y-2">
                {upcomingTasks.slice(0, 5).map((task) => {
                    const deadline = task.deadline
                        ? new Date(task.deadline)
                        : null;
                    const daysLeft = deadline
                        ? Math.ceil(
                              (deadline.getTime() - Date.now()) /
                                  (1000 * 60 * 60 * 24),
                          )
                        : null;

                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/tasks")}
                        >
                            <i
                                className={`${getCategoryIcon(task.category)} text-lg text-pink-500`}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                    {task.title}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {deadline && deadline.toLocaleDateString()}
                                </div>
                            </div>
                            {daysLeft !== null && daysLeft <= 3 && (
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                        daysLeft <= 1
                                            ? "bg-red-100 text-red-500"
                                            : daysLeft <= 2
                                              ? "bg-orange-100 text-orange-500"
                                              : "bg-yellow-100 text-yellow-600"
                                    }`}
                                >
                                    {daysLeft === 0
                                        ? "今天"
                                        : daysLeft === 1
                                          ? "明天"
                                          : `${daysLeft}天后`}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
