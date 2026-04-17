import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { TaskListView } from "@/components/features/tasks/task-list-view";
import { EmptyState, FloatingActionButton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";
import { TaskForm, type TaskFormHandle } from "@/wedding/components";
import type { TaskStatus, WeddingTask } from "@/wedding/type";
import { getCategoryName } from "@/wedding/utils";

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
    const taskFormRef = useRef<TaskFormHandle>(null);

    const categories = useMemo(() => {
        return [
            "全部",
            ...new Set(tasks.map((task) => getCategoryName(task.category))),
        ];
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
            <WeddingTopBar
                title="Cent"
                subtitle={`${bookLabel}任务进度`}
                backTo="/tools"
            />

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

            <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-[16px] bg-[color:var(--wedding-surface-muted)] p-1">
                    <TabsTrigger
                        value="list"
                        className="flex items-center justify-center gap-2 rounded-[12px] data-[state=active]:bg-[color:var(--wedding-surface)] data-[state=active]:text-pink-500 data-[state=active]:shadow-[0_4px_14px_-10px_rgba(236,72,153,0.35)]"
                    >
                        <i className="icon-[mdi--format-list-checkbox] size-4" />
                        列表
                    </TabsTrigger>
                    <TabsTrigger
                        value="calendar"
                        onClick={() => navigate("/tasks/calendar")}
                        className="flex items-center justify-center gap-2 rounded-[12px] data-[state=active]:bg-[color:var(--wedding-surface)] data-[state=active]:text-pink-500 data-[state=active]:shadow-[0_4px_14px_-10px_rgba(236,72,153,0.35)]"
                    >
                        <i className="icon-[mdi--calendar-month-outline] size-4" />
                        日历
                    </TabsTrigger>
                </TabsList>
            </Tabs>

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
                {[
                    { label: "全部", icon: "icon-[mdi--view-grid-outline]" },
                    { label: "进行中", icon: "icon-[mdi--progress-clock]" },
                    { label: "待办", icon: "icon-[mdi--checkbox-blank-circle-outline]" },
                    { label: "已完成", icon: "icon-[mdi--check-circle]" },
                ].map((item) => (
                    <Badge
                        key={item.label}
                        onClick={() => setActiveFilter(item.label)}
                        className="shrink-0 cursor-pointer gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase-none transition-all hover:scale-105"
                        style={{
                            background:
                                activeFilter === item.label
                                    ? "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)"
                                    : "var(--wedding-surface-muted)",
                            color: activeFilter === item.label ? "#fff" : "#F472B6",
                            border: activeFilter === item.label ? "none" : "1px solid var(--wedding-line)",
                            boxShadow: activeFilter === item.label ? "0 4px 14px -6px rgba(236, 72, 153, 0.4)" : "none",
                        }}
                    >
                        <i className={`${item.icon} size-3.5`} />
                        {item.label}
                    </Badge>
                ))}
            </section>

            <section className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                    <Badge
                        key={item}
                        onClick={() => setActiveCategory(item)}
                        variant="outline"
                        className="shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase-none transition-all hover:scale-105"
                        style={{
                            background:
                                activeCategory === item
                                    ? "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)"
                                    : "transparent",
                            borderColor:
                                activeCategory === item
                                    ? "#A855F7"
                                    : "var(--wedding-line)",
                            color:
                                activeCategory === item
                                    ? "#A855F7"
                                    : "var(--wedding-text-soft)",
                            boxShadow: activeCategory === item ? "0 4px 14px -6px rgba(168, 85, 247, 0.3)" : "none",
                        }}
                    >
                        {item}
                    </Badge>
                ))}
            </section>

            <section className="space-y-2.5 pb-4">
                {filteredTasks.length === 0 ? (
                    <EmptyState
                        title="当前筛选下没有任务"
                        description="可以切换分类、状态，或者直接新建一项待办。"
                    />
                ) : (
                    <TaskListView
                        tasks={filteredTasks}
                        onToggleStatus={(task) => {
                            const nextStatus: TaskStatus =
                                task.status === "pending"
                                    ? "in_progress"
                                    : task.status === "in_progress"
                                      ? "completed"
                                      : "pending";
                            updateTask(task.id, { status: nextStatus });
                        }}
                        onEdit={(task) => {
                            setEditingTask(task);
                            setShowForm(true);
                        }}
                    />
                )}
            </section>

            <FormDialog
                open={showForm}
                onOpenChange={setShowForm}
                title={editingTask ? "编辑任务" : "添加任务"}
                maxWidth="md"
                fullScreenOnMobile={true}
                saveButtonText={editingTask ? "保存更新" : "创建任务"}
                onSave={async () => {
                    await taskFormRef.current?.submit();
                }}
            >
                <TaskForm
                    ref={taskFormRef}
                    editTask={editingTask ?? undefined}
                    onClose={() => setShowForm(false)}
                />
            </FormDialog>
        </WeddingPageShell>
    );
}
