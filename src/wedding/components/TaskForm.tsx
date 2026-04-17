/**
 * 任务表单组件
 */

import { forwardRef, useId, useImperativeHandle, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { suggestDeadline, TASK_CATEGORIES, TASK_PRIORITIES } from "@/wedding";
import type {
    TaskCategory,
    TaskPriority,
    TaskStatus,
    WeddingTask,
} from "@/wedding/type";

interface TaskFormProps {
    onClose?: () => void;
    initialDeadline?: number;
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

export interface TaskFormHandle {
    submit: () => Promise<void>;
}

export const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(function TaskForm({
    onClose,
    initialDeadline,
    editTask,
}, ref) {
    const { weddingData, addTask, updateTask } = useWeddingStore();
    const titleInputId = useId();
    const categorySelectId = useId();
    const statusSelectId = useId();
    const notesInputId = useId();

    const [title, setTitle] = useState(editTask?.title || "");
    const [category, setCategory] = useState(editTask?.category || "venue");
    const [deadline, setDeadline] = useState<Date | undefined>(
        editTask?.deadline
            ? new Date(editTask.deadline)
            : initialDeadline
              ? new Date(initialDeadline)
              : undefined,
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
            setDeadline(new Date(suggestDeadlineDate));
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("请输入任务标题");
            return;
        }

        const taskData = {
            title: title.trim(),
            category: category as TaskCategory,
            deadline: deadline ? deadline.getTime() : undefined,
            priority: priority as TaskPriority,
            status: status as TaskStatus,
            assignee,
            notes: notes.trim() || undefined,
        } satisfies Omit<WeddingTask, "createdAt" | "id">;

        try {
            if (editTask) {
                await updateTask(editTask.id, taskData);
                toast.success("更新成功");
            } else {
                await addTask(taskData);
                toast.success("添加成功");
            }
            onClose?.();
        } catch {
            toast.error("操作失败");
        }
    };

    // 暴露 submit 方法给父组件
    useImperativeHandle(ref, () => ({
        submit: handleSubmit,
    }));

    const baseFieldClassName =
        "w-full rounded-[18px] border border-[color:var(--wedding-line)] bg-white/85 px-4 py-3 text-sm text-[color:var(--wedding-text)] outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200/70 dark:bg-white/6 dark:focus:border-pink-400/60 dark:focus:ring-pink-500/15";

    return (
        <div className="space-y-5 px-1 pb-1">
            <div className="wedding-soft-card space-y-5 p-4">
                <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        任务标题
                    </div>
                    <label className="sr-only" htmlFor={titleInputId}>
                        任务标题
                    </label>
                    <Input
                        id={titleInputId}
                        type="text"
                        className="wedding-input"
                        placeholder="例如：确认婚宴酒店档期"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                            分类
                        </div>
                        <label className="sr-only" htmlFor={categorySelectId}>
                            分类
                        </label>
                        <Select
                            value={category}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger id={categorySelectId} className="wedding-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TASK_CATEGORIES.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                            状态
                        </div>
                        <label className="sr-only" htmlFor={statusSelectId}>
                            状态
                        </label>
                        <Select
                            value={status}
                            onValueChange={setStatus}
                        >
                            <SelectTrigger id={statusSelectId} className="wedding-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">待开始</SelectItem>
                                <SelectItem value="in_progress">进行中</SelectItem>
                                <SelectItem value="completed">已完成</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="wedding-soft-card space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                            截止日期
                        </div>
                        {suggestDeadlineDate && !deadline ? (
                            <div className="mt-1 text-xs wedding-muted">
                                建议截止：
                                {new Date(
                                    suggestDeadlineDate,
                                ).toLocaleDateString()}
                            </div>
                        ) : null}
                    </div>
                    {suggestDeadlineDate ? (
                        <button
                            type="button"
                            className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-semibold text-pink-500 transition hover:bg-pink-500/15"
                            onClick={handleSuggestDeadline}
                        >
                            一键推荐
                        </button>
                    ) : null}
                </div>
                <DatePicker
                    date={deadline}
                    onDateChange={setDeadline}
                    placeholder="选择截止日期"
                />
            </div>

            <div className="wedding-soft-card space-y-5 p-4">
                <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        优先级
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {TASK_PRIORITIES.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                className={cn(
                                    "rounded-[18px] border px-3 py-3 text-sm font-medium transition",
                                    priority === p.id
                                        ? `${p.bgColor} ${p.color} border-transparent shadow-sm`
                                        : "border-[color:var(--wedding-line)] bg-white/80 text-[color:var(--wedding-text-soft)] dark:bg-white/6",
                                )}
                                onClick={() => setPriority(p.id)}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        负责人
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: undefined, label: "不指定", activeClassName: "border-transparent bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-sm dark:from-slate-500 dark:to-slate-600" },
                            { value: "groom" as const, label: "男方", activeClassName: "border-transparent bg-sky-500 text-white shadow-sm" },
                            { value: "bride" as const, label: "女方", activeClassName: "border-transparent bg-pink-500 text-white shadow-sm" },
                        ].map((item) => {
                            const active = assignee === item.value;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    className={cn(
                                        "rounded-[18px] border px-3 py-3 text-sm font-medium transition",
                                        active
                                            ? item.activeClassName
                                            : "border-[color:var(--wedding-line)] bg-white/80 text-[color:var(--wedding-text-soft)] dark:bg-white/6",
                                    )}
                                    onClick={() => setAssignee(item.value)}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="wedding-soft-card space-y-4 p-4">
                <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        备注
                    </div>
                    <label className="sr-only" htmlFor={notesInputId}>
                        备注
                    </label>
                    <Textarea
                        id={notesInputId}
                        className={cn(
                            "wedding-input",
                            "min-h-[112px] resize-none",
                        )}
                        placeholder="可以记录联系人、确认节点或补充说明"
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-[18px] border-[color:var(--wedding-line)] bg-white/90 text-[color:var(--wedding-text)] hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    onClick={onClose}
                >
                    关闭
                </Button>
                <Button
                    type="button"
                    className="h-12 flex-1 rounded-[18px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-[0_18px_30px_-18px_rgba(217,70,150,0.9)] hover:opacity-95"
                    onClick={handleSubmit}
                >
                    {editTask ? "保存更新" : "创建任务"}
                </Button>
            </div>
        </div>
    );
});
