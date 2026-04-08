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
            <div className="bg-card rounded-xl border border-border shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                        近期待办
                    </span>
                    <button
                        className="text-xs text-primary"
                        onClick={() => navigate("/tasks")}
                    >
                        查看全部
                    </button>
                </div>
                <div className="text-center text-muted-foreground py-4 text-sm">
                    暂无待办任务
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">近期待办</span>
                <button
                    className="text-xs text-primary"
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
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer"
                            onClick={() => navigate("/tasks")}
                        >
                            <i
                                className={`${getCategoryIcon(task.category)} text-lg text-primary`}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">
                                    {task.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {deadline && deadline.toLocaleDateString()}
                                </div>
                            </div>
                            {daysLeft !== null && daysLeft <= 3 && (
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                        daysLeft <= 1
                                            ? "bg-destructive/10 text-destructive"
                                            : daysLeft <= 2
                                              ? "bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400"
                                              : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
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
