import dayjs from "dayjs";
import { CalendarClock, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useWeddingStore } from "@/store/wedding";

export function TodayTasksCard() {
    const navigate = useNavigate();
    const { weddingData } = useWeddingStore();

    const todayTasks = useMemo(() => {
        const tasks = weddingData?.tasks ?? [];
        const today = dayjs();
        return tasks
            .filter((task) => {
                if (task.status === "completed" || !task.deadline) {
                    return false;
                }
                return dayjs(task.deadline).isSame(today, "day");
            })
            .sort((a, b) => (a.deadline ?? 0) - (b.deadline ?? 0));
    }, [weddingData?.tasks]);

    return (
        <div className="wedding-surface-card wedding-card-interactive wedding-section-enter p-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-[color:var(--wedding-accent)]" />
                    <span className="text-sm font-medium text-[color:var(--wedding-text)]">
                        今日待办任务
                    </span>
                </div>
                <button
                    type="button"
                    className="wedding-link text-xs"
                    onClick={() => navigate("/tasks")}
                >
                    查看全部
                </button>
            </div>

            {todayTasks.length === 0 ? (
                <div className="rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] px-3 py-4 text-center text-sm wedding-muted">
                    今日暂无待办，继续保持好节奏。
                </div>
            ) : (
                <div className="space-y-2">
                    {todayTasks.slice(0, 3).map((task) => (
                        <button
                            key={task.id}
                            type="button"
                            onClick={() => navigate("/tasks")}
                            className="flex w-full items-center gap-3 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] px-3 py-3 text-left transition hover:border-[color:var(--wedding-line-strong)] hover:bg-[color:var(--wedding-surface)]"
                        >
                            <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--wedding-warning)]" />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-[color:var(--wedding-text)]">
                                    {task.title}
                                </div>
                                <div className="mt-0.5 text-xs text-[color:var(--wedding-text-mute)]">
                                    截止 {dayjs(task.deadline).format("HH:mm")}
                                </div>
                            </div>
                            <ChevronRight
                                className="h-4 w-4 text-[color:var(--wedding-text-mute)]"
                                aria-hidden="true"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
