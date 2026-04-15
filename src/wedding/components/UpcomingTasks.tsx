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
            <div className="wedding-surface-card wedding-card-interactive wedding-section-enter p-4">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm wedding-muted">近期待办</span>
                    <button
                        type="button"
                        className="wedding-link text-xs"
                        onClick={() => navigate("/tasks")}
                    >
                        查看全部
                    </button>
                </div>
                <div className="py-4 text-center text-sm wedding-muted">
                    暂无待办任务
                </div>
            </div>
        );
    }

    return (
        <div className="wedding-surface-card wedding-card-interactive wedding-section-enter p-4">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm wedding-muted">近期待办</span>
                <button
                    type="button"
                    className="wedding-link text-xs"
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
                        <button
                            type="button"
                            key={task.id}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] p-3 text-left transition hover:border-[color:var(--wedding-line-strong)] hover:bg-[color:var(--wedding-surface)]"
                            onClick={() => navigate("/tasks")}
                        >
                            <i
                                className={`${getCategoryIcon(task.category)} text-lg text-[color:var(--wedding-accent)]`}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="truncate text-sm font-medium text-[color:var(--wedding-text)]">
                                    {task.title}
                                </div>
                                <div className="text-xs wedding-muted">
                                    {deadline && deadline.toLocaleDateString()}
                                </div>
                            </div>
                            {daysLeft !== null && daysLeft <= 3 && (
                                <span
                                    className={`rounded-full px-2 py-1 text-xs ${
                                        daysLeft <= 1
                                            ? "bg-[color:var(--wedding-danger-soft)] text-[color:var(--wedding-danger)]"
                                            : daysLeft <= 2
                                              ? "bg-[color:var(--wedding-warning-soft)] text-[color:var(--wedding-warning)]"
                                              : "bg-[color:var(--wedding-info-soft)] text-[color:var(--wedding-info)]"
                                    }`}
                                >
                                    {daysLeft === 0
                                        ? "今天"
                                        : daysLeft === 1
                                          ? "明天"
                                          : `${daysLeft}天后`}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
