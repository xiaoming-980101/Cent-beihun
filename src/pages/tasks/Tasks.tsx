/**
 * 任务列表页
 */

import { useState } from "react";
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
import {
    WeddingEmptyState,
    WeddingPageShell,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { TaskForm } from "@/wedding/components";
import {
    TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUSES,
} from "@/wedding/constants";
import type { TaskStatus, WeddingTask } from "@/wedding/type";
import { getCategoryIcon } from "@/wedding/utils";

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

    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<WeddingTask | null>(null);

    const filteredTasks = tasks.filter((task) => {
        if (filterCategory !== "all" && task.category !== filterCategory)
            return false;
        if (filterStatus !== "all" && task.status !== filterStatus)
            return false;
        return true;
    });

    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const totalCount = tasks.length;
    const progress =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <WeddingPageShell>
            <WeddingTopBar title="Cent" subtitle={`${bookLabel}任务进度`} />

            <section className="wedding-surface-card p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-base font-semibold text-[color:var(--wedding-text)]">
                            任务进度
                        </div>
                        <div className="mt-1 text-xs wedding-muted">
                            当前已完成 {completedCount} 项，继续把计划往前推。
                        </div>
                    </div>
                    <span className="rounded-full bg-pink-50 px-3 py-1.5 text-sm font-semibold text-pink-500 dark:bg-pink-500/10">
                        {completedCount}/{totalCount} ({progress}%)
                    </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-[color:var(--wedding-surface-muted)]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#f05cab] to-[#d64dc8] transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </section>

            <section className="flex items-center gap-2">
                <select
                    className="h-11 min-w-0 flex-1 rounded-[14px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 text-sm text-[color:var(--wedding-text)] outline-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">所有分类</option>
                    {TASK_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    className="h-11 min-w-0 flex-1 rounded-[14px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 text-sm text-[color:var(--wedding-text)] outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">状态</option>
                    {TASK_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.name}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text)]"
                    onClick={() => navigate("/tasks/calendar")}
                    aria-label="打开日历视图"
                >
                    <i className="icon-[mdi--calendar-month-outline] size-5" />
                </button>
            </section>

            <section className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <WeddingEmptyState
                        icon="icon-[mdi--party-popper]"
                        title={`开始整理${bookLabel}任务`}
                        description="每一个小任务的完成，都会让计划更清晰、更接近完成。"
                    />
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleStatus={() => {
                                const newStatus: TaskStatus =
                                    task.status === "pending"
                                        ? "in_progress"
                                        : task.status === "in_progress"
                                          ? "completed"
                                          : "pending";
                                updateTask(task.id, { status: newStatus });
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
                className="fixed bottom-[calc(var(--mobile-bottombar-height)+1.25rem+env(safe-area-inset-bottom))] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ef5cab] to-[#cb4dc8] text-white shadow-[0_16px_28px_-16px_rgba(239,92,171,0.95)] sm:bottom-8 sm:right-8"
                onClick={() => {
                    setEditingTask(null);
                    setShowForm(true);
                }}
                aria-label="添加任务"
            >
                <i className="icon-[mdi--plus] size-6" />
            </button>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-[80] bg-[rgba(15,12,18,0.56)]" />
                    <div className="fixed inset-0 z-[81] flex items-end justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6">
                        <DialogContent
                            fade
                            className="z-[82] flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-[30px] border border-[#edd6df] bg-[#fffdfd] shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)] dark:border-[#302631] dark:bg-[#181419] sm:max-h-[min(84vh,760px)]"
                            onInteractOutside={() => setShowForm(false)}
                        >
                            <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                                <div className="mb-3 flex justify-center sm:hidden">
                                    <div className="h-1.5 w-12 rounded-full bg-[color:var(--wedding-line-strong)]" />
                                </div>
                                <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                                    {editingTask ? "编辑任务" : "添加任务"}
                                </DialogTitle>
                                <p className="mt-2 pl-1 text-sm wedding-muted">
                                    把待办、负责人和截止时间整理进当前账本计划里。
                                </p>
                            </DialogHeader>
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
                                <TaskForm
                                    onClose={() => setShowForm(false)}
                                    editTask={editingTask ?? undefined}
                                />
                            </div>
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}

function TaskItem({
    task,
    onToggleStatus,
    onEdit,
}: {
    task: WeddingTask;
    onToggleStatus: () => void;
    onEdit: () => void;
}) {
    const priorityInfo = TASK_PRIORITIES.find((p) => p.id === task.priority);
    const statusInfo = TASK_STATUSES.find((s) => s.id === task.status);

    return (
        /* biome-ignore lint/a11y/useSemanticElements: card layout keeps flexible inner content */
        <div
            className="wedding-surface-card border border-[color:var(--wedding-line)] p-4 transition-shadow hover:shadow-[var(--wedding-shadow-soft)]"
            role="button"
            tabIndex={0}
            onClick={onEdit}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onEdit();
                }
            }}
        >
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleStatus();
                    }}
                    className={cn(
                        "mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white dark:bg-transparent",
                        task.status === "completed" &&
                            "border-green-500 bg-green-500",
                        task.status === "in_progress" &&
                            "border-pink-400 bg-pink-400",
                        task.status === "pending" && "border-pink-200",
                    )}
                >
                    {task.status === "completed" && (
                        <i className="icon-[mdi--check] text-white text-sm" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <i
                                    className={`${getCategoryIcon(task.category)} text-lg text-pink-400`}
                                />
                                <span
                                    className={`text-lg font-semibold text-[color:var(--wedding-text)] ${
                                        task.status === "completed"
                                            ? "line-through text-[color:var(--wedding-text-mute)]"
                                            : ""
                                    }`}
                                >
                                    {task.title}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs wedding-muted">
                                <i className="icon-[mdi--calendar-month-outline] size-3.5" />
                                {task.deadline ? (
                                    <span>
                                        截止日期{" "}
                                        {new Date(
                                            task.deadline,
                                        ).toLocaleDateString()}
                                    </span>
                                ) : (
                                    <span>暂未设置日期</span>
                                )}
                            </div>
                        </div>
                        <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                                task.priority === "high"
                                    ? "bg-rose-100 text-rose-500 dark:bg-rose-500/12"
                                    : task.priority === "medium"
                                      ? "bg-amber-100 text-amber-500 dark:bg-amber-500/12"
                                      : "bg-emerald-100 text-emerald-500 dark:bg-emerald-500/12"
                            }`}
                        >
                            {priorityInfo?.name || task.priority}
                        </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs wedding-muted">
                        <span className={cn("font-medium", statusInfo?.color)}>
                            {statusInfo?.name || task.status}
                        </span>
                        {task.assignee ? (
                            <span className="rounded-full bg-[color:var(--wedding-surface-muted)] px-2 py-1">
                                {task.assignee === "groom"
                                    ? "男方负责"
                                    : "女方负责"}
                            </span>
                        ) : null}
                    </div>

                    {task.notes ? (
                        <div className="mt-2 text-sm wedding-muted line-clamp-2">
                            {task.notes}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
