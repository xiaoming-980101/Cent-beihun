/**
 * 任务表单组件
 */

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWeddingStore } from "@/store/wedding";
import { suggestDeadline, TASK_CATEGORIES, TASK_PRIORITIES } from "@/wedding";
import type { TaskCategory } from "@/wedding/type";

interface TaskFormProps {
    onClose?: () => void;
    editTask?: {
        id: string;
        title: string;
        category: string;
        deadline?: number;
        priority: string;
        status: string;
        assignee?: "groom" | "bride";
        notes?: string;
    };
}

export function TaskForm({ onClose, editTask }: TaskFormProps) {
    const { weddingData, addTask, updateTask } = useWeddingStore();

    const [title, setTitle] = useState(editTask?.title || "");
    const [category, setCategory] = useState(editTask?.category || "venue");
    const [deadline, setDeadline] = useState(
        editTask?.deadline
            ? new Date(editTask.deadline).toISOString().split("T")[0]
            : "",
    );
    const [priority, setPriority] = useState(editTask?.priority || "medium");
    const [status, setStatus] = useState(editTask?.status || "pending");
    const [assignee, setAssignee] = useState<"groom" | "bride" | undefined>(
        editTask?.assignee,
    );
    const [notes, setNotes] = useState(editTask?.notes || "");

    // 自动推荐截止日期
    const suggestDeadlineDate = weddingData?.weddingDate
        ? suggestDeadline(category as TaskCategory, weddingData.weddingDate)
        : null;

    const handleSuggestDeadline = () => {
        if (suggestDeadlineDate) {
            setDeadline(
                new Date(suggestDeadlineDate).toISOString().split("T")[0],
            );
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("请输入任务标题");
            return;
        }

        const taskData = {
            title: title.trim(),
            category: category as any,
            deadline: deadline ? new Date(deadline).getTime() : undefined,
            priority: priority as any,
            status: status as any,
            assignee,
            notes: notes.trim() || undefined,
        };

        try {
            if (editTask) {
                await updateTask(editTask.id, taskData);
                toast.success("更新成功");
            } else {
                await addTask(taskData);
                toast.success("添加成功");
            }
            onClose?.();
        } catch (err) {
            toast.error("操作失败");
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* 任务标题 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    任务标题 *
                </label>
                <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="请输入任务标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* 任务分类 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">分类</label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {TASK_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 截止日期 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    截止日期
                </label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="flex-1 border rounded-lg px-3 py-2"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    {suggestDeadlineDate && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSuggestDeadline}
                        >
                            推荐
                        </Button>
                    )}
                </div>
                {suggestDeadlineDate && !deadline && (
                    <div className="text-xs text-gray-500 mt-1">
                        建议截止:{" "}
                        {new Date(suggestDeadlineDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* 优先级 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    优先级
                </label>
                <div className="flex gap-2">
                    {TASK_PRIORITIES.map((p) => (
                        <button
                            key={p.id}
                            className={`flex-1 py-1.5 text-sm rounded-lg ${
                                priority === p.id
                                    ? `${p.bgColor} ${p.color}`
                                    : "bg-gray-100"
                            }`}
                            onClick={() => setPriority(p.id)}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 状态 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">状态</label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">待开始</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已完成</option>
                </select>
            </div>

            {/* 负责人 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    负责人
                </label>
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-1.5 text-sm rounded-lg ${
                            assignee === undefined
                                ? "bg-gray-200"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setAssignee(undefined)}
                    >
                        不指定
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm rounded-lg ${
                            assignee === "groom"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setAssignee("groom")}
                    >
                        男方
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm rounded-lg ${
                            assignee === "bride"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setAssignee("bride")}
                    >
                        女方
                    </button>
                </div>
            </div>

            {/* 备注 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">备注</label>
                <textarea
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                    placeholder="备注信息"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                    取消
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                    {editTask ? "更新" : "添加"}
                </Button>
            </div>
        </div>
    );
}
