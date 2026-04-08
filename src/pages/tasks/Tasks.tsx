/**
 * 任务列表页
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { useWeddingStore } from "@/store/wedding";
import { TaskForm } from "@/wedding/components";
import {
    TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUSES,
} from "@/wedding/constants";
import type {
    TaskCategory,
    TaskPriority,
    TaskStatus,
    WeddingTask,
} from "@/wedding/type";
import { getCategoryIcon, getCategoryName } from "@/wedding/utils";

export default function Tasks() {
    const { weddingData, addTask, updateTask, deleteTask } = useWeddingStore();
    const tasks = weddingData?.tasks || [];

    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);

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
        <div className="flex flex-col h-full bg-background">
            {/* 进度条 */}
            <div className="bg-card rounded-xl border border-border p-4 m-2 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                    <span>
                        进度: {completedCount}/{totalCount} 完成
                    </span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* 筛选器 */}
            <div className="bg-card rounded-xl border border-border p-4 m-2 shadow-sm flex gap-2 flex-wrap">
                <select
                    className="bg-background rounded-lg border border-border px-3 py-2 text-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">全部分类</option>
                    {TASK_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    className="bg-background rounded-lg border border-border px-3 py-2 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">全部状态</option>
                    {TASK_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.name}
                        </option>
                    ))}
                </select>

                <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-purple-400 text-white rounded-lg shadow-md"
                    onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                >
                    <i className="icon-[mdi--plus] mr-1" />
                    添加任务
                </Button>
            </div>

            {/* 任务列表 */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredTasks.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-4 m-2 shadow-sm text-center text-muted-foreground py-8">
                        暂无任务
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredTasks.map((task) => (
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
                        ))}
                    </div>
                )}
            </div>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/50" />
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
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
                                editTask={editingTask}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </div>
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
            className="bg-card rounded-xl border border-border p-3 shadow-sm hover:shadow-md transition-shadow"
            onClick={onEdit}
        >
            <div className="flex items-start gap-3">
                {/* 状态切换 */}
                <button
                    onClick={onToggleStatus}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${getStatusColor(task.status)}`}
                >
                    {task.status === "completed" && (
                        <i className="icon-[mdi--check] text-white text-sm" />
                    )}
                </button>

                {/* 任务内容 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <i
                            className={`${getCategoryIcon(task.category)} text-lg`}
                        />
                        <span
                            className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                            {task.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span
                            className={`px-1.5 py-0.5 rounded ${priorityInfo?.bgColor || ""} ${priorityInfo?.color || ""}`}
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
                    onClick={onDelete}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <i className="icon-[mdi--delete-outline]" />
                </button>
            </div>
        </div>
    );
}
