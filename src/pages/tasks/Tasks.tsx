/**
 * 任务列表页
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    WeddingActionButton,
    WeddingEmptyState,
    WeddingPageShell,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
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
    const { weddingData, updateTask, deleteTask } = useWeddingStore();
    const tasks = weddingData?.tasks || [];

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
            <WeddingTopBar title="Cent" subtitle="婚礼任务进度" />

            <section className="wedding-surface-card p-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[color:var(--wedding-text)]">婚礼任务进度</span>
                    <span className="font-semibold text-pink-500">
                        {completedCount}/{totalCount} ({progress}%)
                    </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-pink-100 dark:bg-white/8">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-500 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </section>

            <section className="wedding-surface-card flex flex-wrap gap-2 p-4">
                <WeddingActionButton
                    className="h-11 rounded-2xl px-5 text-sm"
                    onClick={() => navigate("/tasks/calendar")}
                >
                    <i className="icon-[mdi--calendar-month-outline] mr-1 size-4" />
                    日历视图
                </WeddingActionButton>

                <select
                    className="rounded-2xl border border-[color:var(--wedding-line)] bg-white/80 px-4 py-2.5 text-sm text-[color:var(--wedding-text)] outline-none dark:bg-white/6"
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
                    className="rounded-2xl border border-[color:var(--wedding-line)] bg-white/80 px-4 py-2.5 text-sm text-[color:var(--wedding-text)] outline-none dark:bg-white/6"
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

                <WeddingActionButton
                    className="ml-auto h-11 rounded-2xl px-5 text-sm"
                    onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                >
                    <i className="icon-[mdi--plus] mr-1 size-4" />
                    添加任务
                </WeddingActionButton>
            </section>

            <section className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <WeddingEmptyState
                        icon="icon-[mdi--party-popper]"
                        title="开始筹备您的婚礼"
                        description="每一个小任务的完成，都是通往完美婚礼的一大步。"
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
                            onDelete={() => deleteTask(task.id)}
                        />
                    ))
                )}
            </section>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/50" />
                    <div className="fixed top-0 left-0 z-[61] flex h-full w-full items-center justify-center pointer-events-none">
                        <DialogContent
                            className="pointer-events-auto bg-background w-[90vw] max-w-[500px] rounded-md overflow-y-auto max-h-[80vh]"
                            onInteractOutside={() => setShowForm(false)}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold border-b pb-3 mb-4 pt-2 pl-1">
                                    {editingTask ? "编辑任务" : "添加任务"}
                                </DialogTitle>
                            </DialogHeader>
                            <TaskForm
                                onClose={() => setShowForm(false)}
                                editTask={editingTask ?? undefined}
                            />
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
    onDelete,
}: {
    task: WeddingTask;
    onToggleStatus: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const priorityInfo = TASK_PRIORITIES.find((p) => p.id === task.priority);
    const statusInfo = TASK_STATUSES.find((s) => s.id === task.status);

    const getStatusColor = (status: TaskStatus) => {
        if (status === "completed") return "bg-green-500 border-green-500";
        if (status === "in_progress") return "bg-pink-500 border-pink-500";
        return "bg-purple-400 border-purple-400";
    };

    return (
        <div
            className="wedding-surface-card p-4 transition-shadow hover:shadow-[var(--wedding-shadow-soft)]"
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
                {/* 状态切换 */}
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleStatus();
                    }}
                    className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${getStatusColor(task.status)}`}
                >
                    {task.status === "completed" && (
                        <i className="icon-[mdi--check] text-white text-sm" />
                    )}
                </button>

                {/* 任务内容 */}
                <div className="flex-1 min-w-0">
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
                        <span
                            className="rounded-full bg-white/80 px-2 py-1 dark:bg-white/8"
                        >
                            {priorityInfo?.name || task.priority}
                        </span>
                        <span className={statusInfo?.color}>
                            {statusInfo?.name || task.status}
                        </span>
                        {task.deadline && (
                            <span>
                                截止:{" "}
                                {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* 删除按钮 */}
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    className="text-[color:var(--wedding-text-mute)] hover:text-destructive"
                >
                    <i className="icon-[mdi--delete-outline]" />
                </button>
            </div>
        </div>
    );
}
