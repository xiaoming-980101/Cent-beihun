import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import type { WeddingTask } from "@/wedding/type";
import {
    getCategoryEmoji,
    getCategoryName,
    getTaskPriorityLabel,
    getTaskStatusLabel,
} from "@/wedding/utils";

export function TaskListView({
    tasks,
    onEdit,
    onToggleStatus,
}: {
    tasks: WeddingTask[];
    onEdit: (task: WeddingTask) => void;
    onToggleStatus: (task: WeddingTask) => void;
}) {
    if (tasks.length === 0) {
        return (
            <div className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-5 py-10 text-center">
                <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                    当前筛选下没有任务
                </div>
                <div className="mt-2 text-sm wedding-muted">
                    可以切换分类、状态，或者直接新建一项待办。
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: WeddingTask["status"]) => {
        switch (status) {
            case "completed":
                return {
                    icon: "icon-[mdi--check-circle]",
                    color: "text-green-500",
                    bg: "bg-green-50 dark:bg-green-950/30",
                };
            case "in_progress":
                return {
                    icon: "icon-[mdi--progress-clock]",
                    color: "text-blue-500",
                    bg: "bg-blue-50 dark:bg-blue-950/30",
                };
            case "pending":
                return {
                    icon: "icon-[mdi--checkbox-blank-circle-outline]",
                    color: "text-gray-400",
                    bg: "bg-gray-50 dark:bg-gray-950/30",
                };
        }
    };

    const getPriorityStyle = (priority: WeddingTask["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
            case "medium":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
            case "low":
                return "bg-gray-100 text-gray-600 dark:bg-gray-950/30 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-2.5">
            {tasks
                .slice()
                .sort((a, b) => (a.deadline ?? Infinity) - (b.deadline ?? Infinity))
                .map((task) => {
                    const statusIcon = getStatusIcon(task.status);
                    return (
                        <div
                            key={task.id}
                            className="group rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)] transition-all hover:shadow-[0_16px_32px_-20px_rgba(15,23,42,0.28)] hover:scale-[1.01]"
                        >
                            <div className="flex items-start gap-3">
                                <button
                                    type="button"
                                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 ${statusIcon.bg}`}
                                    onClick={() => onToggleStatus(task)}
                                    aria-label="切换任务状态"
                                >
                                    <i className={`${statusIcon.icon} size-5 ${statusIcon.color}`} />
                                </button>
                                <button
                                    type="button"
                                    className="min-w-0 flex-1 text-left"
                                    onClick={() => onEdit(task)}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div
                                            className={`truncate text-[14px] font-medium ${
                                                task.status === "completed"
                                                    ? "text-[color:var(--wedding-text-mute)] line-through"
                                                    : "text-[color:var(--wedding-text)]"
                                            }`}
                                        >
                                            {getCategoryEmoji(task.category)} {task.title}
                                        </div>
                                    </div>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`uppercase-none ${getPriorityStyle(task.priority)}`}
                                        >
                                            {getTaskPriorityLabel(task.priority)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-purple-200 bg-purple-50 text-purple-700 uppercase-none dark:border-purple-900/30 dark:bg-purple-950/30 dark:text-purple-400"
                                        >
                                            {getCategoryName(task.category)}
                                        </Badge>
                                        {task.deadline ? (
                                            <Badge
                                                variant="outline"
                                                className="ml-auto gap-1 border-pink-200 bg-pink-50 text-pink-600 uppercase-none dark:border-pink-900/30 dark:bg-pink-950/30 dark:text-pink-400"
                                            >
                                                <i className="icon-[mdi--calendar-clock] size-3" />
                                                {dayjs(task.deadline).format("MM-DD")}
                                            </Badge>
                                        ) : null}
                                    </div>
                                </button>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

