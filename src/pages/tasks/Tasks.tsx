/**
 * 任务列表页
 */

import { useWeddingStore } from "@/store/wedding";
import {
    TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUSES,
} from "@/wedding/constants";
import { getCategoryName, getCategoryIcon } from "@/wedding/utils";
import { TaskForm } from "@/wedding/components";
import type {
    WeddingTask,
    TaskCategory,
    TaskPriority,
    TaskStatus,
} from "@/wedding/type";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogPortal,
    DialogOverlay,
} from "@/components/ui/dialog";

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
        <div className="flex flex-col h-full">
            {/* 进度条 */}
            <div className="p-4 border-b">
                <div className="flex justify-between text-sm mb-2">
                    <span>
                        进度: {completedCount}/{totalCount} 完成
                    </span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* 筛选器 */}
            <div className="p-4 border-b flex gap-2 flex-wrap">
                <select
                    className="border rounded px-2 py-1 text-sm"
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
                    className="border rounded px-2 py-1 text-sm"
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
                    <div className="text-center text-gray-500 py-8">
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

    return (
        <div
            className="border rounded-lg p-3 bg-white shadow-sm"
            onClick={onEdit}
        >
            <div className="flex items-start gap-3">
                {/* 状态切换 */}
                <button
                    onClick={onToggleStatus}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${task.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-300"}
          `}
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
                            className={`font-medium ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
                        >
                            {task.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
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
                    className="text-gray-400 hover:text-red-500"
                >
                    <i className="icon-[mdi--delete-outline]" />
                </button>
            </div>
        </div>
    );
}
