import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";
import { TaskForm } from "@/wedding/components";
import type { TaskStatus, WeddingTask } from "@/wedding/type";
import {
    getCategoryEmoji,
    getCategoryName,
    getTaskPriorityLabel,
    getTaskStatusLabel,
} from "@/wedding/utils";

const STATUS_STYLE = {
    completed: { color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
    in_progress: { color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
    pending: { color: "#F97316", bg: "rgba(249,115,22,0.12)" },
} as const;

const PRIORITY_COLOR = {
    high: "#EF4444",
    medium: "#F97316",
    low: "#22C55E",
} as const;

export default function Tasks() {
    const navigate = useNavigate();
    const { weddingData, updateTask } = useWeddingStore();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const tasks = weddingData?.tasks || [];
    const bookLabel = currentBookName || "当前账本";

    const [activeFilter, setActiveFilter] = useState("全部");
    const [activeCategory, setActiveCategory] = useState("全部");
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<WeddingTask | null>(null);

    const categories = useMemo(() => {
        return ["全部", ...new Set(tasks.map((task) => getCategoryName(task.category)))];
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const statusOk =
                activeFilter === "全部" ||
                (activeFilter === "已完成" && task.status === "completed") ||
                (activeFilter === "进行中" && task.status === "in_progress") ||
                (activeFilter === "待办" && task.status === "pending");
            const categoryOk =
                activeCategory === "全部" ||
                getCategoryName(task.category) === activeCategory;
            return statusOk && categoryOk;
        });
    }, [activeCategory, activeFilter, tasks]);

    const doneCount = tasks.filter((task) => task.status === "completed").length;
    const progress =
        tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

    return (
        <WeddingPageShell>
            <WeddingTopBar title="Cent" subtitle={`${bookLabel}任务进度`} />

            <section className="flex items-center justify-between">
                <div>
                    <div className="text-[20px] font-bold text-[color:var(--wedding-text)]">
                        婚礼任务
                    </div>
                    <div className="mt-1 text-xs wedding-muted">
                        {doneCount}/{tasks.length} 项已完成
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#F472B6] to-[#A855F7] text-white"
                >
                    <i className="icon-[mdi--plus] size-4.5" />
                </button>
            </section>

            <section className="rounded-[16px] bg-[color:var(--wedding-surface-muted)] p-1">
                <div className="grid grid-cols-2 gap-1">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-[12px] bg-[color:var(--wedding-surface)] py-2 text-[13px] font-medium text-pink-500 shadow-[0_4px_14px_-10px_rgba(236,72,153,0.35)]"
                    >
                        <i className="icon-[mdi--format-list-checkbox] size-4" />
                        列表
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/tasks/calendar")}
                        className="flex items-center justify-center gap-2 rounded-[12px] py-2 text-[13px] font-medium text-[color:var(--wedding-text-mute)]"
                    >
                        <i className="icon-[mdi--calendar-month-outline] size-4" />
                        日历
                    </button>
                </div>
            </section>

            <section>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-[color:var(--wedding-text-soft)]">
                        整体完成进度
                    </span>
                    <span className="font-semibold text-pink-500">
                        {progress}%
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[color:var(--wedding-line)]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#F472B6] to-[#A855F7]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </section>

            <section className="flex gap-2 overflow-x-auto pb-1">
                {["全部", "进行中", "待办", "已完成"].map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setActiveFilter(item)}
                        className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium"
                        style={{
                            background:
                                activeFilter === item
                                    ? "#F472B6"
                                    : "var(--wedding-surface-muted)",
                            color:
                                activeFilter === item ? "#fff" : "#F472B6",
                        }}
                    >
                        {item}
                    </button>
                ))}
            </section>

            <section className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setActiveCategory(item)}
                        className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium"
                        style={{
                            background:
                                activeCategory === item
                                    ? "var(--wedding-surface-muted)"
                                    : "transparent",
                            borderColor:
                                activeCategory === item
                                    ? "#A855F7"
                                    : "var(--wedding-line)",
                            color:
                                activeCategory === item
                                    ? "#A855F7"
                                    : "var(--wedding-text-soft)",
                        }}
                    >
                        {item}
                    </button>
                ))}
            </section>

            <section className="space-y-2.5 pb-4">
                {filteredTasks.length === 0 ? (
                    <div className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-5 py-10 text-center">
                        <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                            当前筛选下没有任务
                        </div>
                        <div className="mt-2 text-sm wedding-muted">
                            可以切换分类、状态，或者直接新建一项待办。
                        </div>
                    </div>
                ) : (
                    filteredTasks
                        .slice()
                        .sort((a, b) => {
                            return (a.deadline ?? Infinity) - (b.deadline ?? Infinity);
                        })
                        .map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleStatus={() => {
                                    const nextStatus: TaskStatus =
                                        task.status === "pending"
                                            ? "in_progress"
                                            : task.status === "in_progress"
                                              ? "completed"
                                              : "pending";
                                    updateTask(task.id, { status: nextStatus });
                                }}
                                onEdit={() => {
                                    setEditingTask(task);
                                    setShowForm(true);
                                }}
                            />
                        ))
                )}
            </section>

            <button
                type="button"
                onClick={() => {
                    setEditingTask(null);
                    setShowForm(true);
                }}
                className="fixed bottom-[calc(var(--mobile-bottombar-height)+1.25rem+env(safe-area-inset-bottom))] right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#F472B6] to-[#A855F7] text-white shadow-[0_16px_28px_-16px_rgba(244,114,182,0.85)] sm:bottom-8"
                aria-label="添加任务"
            >
                <i className="icon-[mdi--plus] size-6" />
            </button>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-[80] bg-[rgba(15,12,18,0.56)]" />
                    <div className="fixed inset-0 z-[81] flex items-end justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6">
                        <DialogContent className="z-[82] flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-[30px] border border-[#edd6df] bg-[#fffdfd] shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)] dark:border-[#302631] dark:bg-[#181419] sm:max-h-[min(84vh,760px)]">
                            <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                                <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                                    {editingTask ? "编辑任务" : "添加任务"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
                                <TaskForm
                                    editTask={editingTask ?? undefined}
                                    onClose={() => setShowForm(false)}
                                />
                            </div>
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}

function TaskCard({
    task,
    onToggleStatus,
    onEdit,
}: {
    task: WeddingTask;
    onToggleStatus: () => void;
    onEdit: () => void;
}) {
    const statusStyle = STATUS_STYLE[task.status];
    return (
        <div className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    className="mt-0.5 text-lg"
                    onClick={onToggleStatus}
                    aria-label="切换任务状态"
                >
                    {task.status === "completed" ? "✅" : "⭕"}
                </button>
                <button type="button" className="min-w-0 flex-1 text-left" onClick={onEdit}>
                    <div className="flex items-center justify-between gap-3">
                        <div
                            className="truncate text-[14px] font-medium"
                            style={{
                                color:
                                    task.status === "completed"
                                        ? "var(--wedding-text-mute)"
                                        : "var(--wedding-text)",
                                textDecoration:
                                    task.status === "completed"
                                        ? "line-through"
                                        : "none",
                            }}
                        >
                            {getCategoryEmoji(task.category)} {task.title}
                        </div>
                        <i className="icon-[mdi--chevron-right] size-4 text-[color:var(--wedding-text-mute)]" />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                                background: statusStyle.bg,
                                color: statusStyle.color,
                            }}
                        >
                            {getTaskStatusLabel(task.status)}
                        </span>
                        <span className="rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-2 py-0.5 text-[10px] text-[color:var(--wedding-text-soft)]">
                            {getCategoryName(task.category)}
                        </span>
                        <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                                background: `${PRIORITY_COLOR[task.priority]}16`,
                                color: PRIORITY_COLOR[task.priority],
                            }}
                        >
                            {getTaskPriorityLabel(task.priority)}
                        </span>
                        {task.deadline ? (
                            <span className="ml-auto text-[10px] text-[color:var(--wedding-text-mute)]">
                                {dayjs(task.deadline).format("MM-DD")}
                            </span>
                        ) : null}
                    </div>
                </button>
            </div>
        </div>
    );
}
