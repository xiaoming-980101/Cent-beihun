/**
 * 任务日历视图页面
 */

import dayjs from "dayjs";
import { Solar } from "lunar-javascript";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { ResponsiveDialog } from "@/components/ui/dialog/index";
import {
    WeddingBadge,
    WeddingFloatingActionButton,
    WeddingPageShell,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { TaskForm } from "@/wedding/components";
import {
    getCategoryEmoji,
    getCategoryName,
    getTaskPriorityLabel,
} from "@/wedding/utils";

type CalendarCell = {
    date: dayjs.Dayjs;
    key: string;
    isCurrentMonth: boolean;
};

type HolidayInfoMap = Record<string, string>;

type CalendarNote = {
    label: string;
    emphasis: boolean;
};

const WEEK_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const WEEKDAY_LABELS = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
];

function getDateKey(date: dayjs.Dayjs) {
    return date.format("YYYY-MM-DD");
}

function isWeekName(value: string) {
    return /^周[一二三四五六日天]$/.test(value);
}

function getCalendarNote(
    date: dayjs.Dayjs,
    holidayName?: string,
): CalendarNote {
    const solar = Solar.fromDate(date.toDate());
    const lunar = solar.getLunar();
    const solarFestival = solar.getFestivals()[0];
    const lunarFestival =
        lunar.getFestivals()[0] || lunar.getOtherFestivals()[0] || "";
    const jieQi = lunar.getJieQi();
    const officialHoliday =
        holidayName && !isWeekName(holidayName) ? holidayName : "";
    const lunarDay = lunar.getDayInChinese();
    const lunarLabel =
        lunarDay === "初一" ? `${lunar.getMonthInChinese()}月` : lunarDay;
    const label =
        officialHoliday ||
        solarFestival ||
        lunarFestival ||
        jieQi ||
        lunarLabel;

    return {
        label,
        emphasis: Boolean(
            officialHoliday || solarFestival || lunarFestival || jieQi,
        ),
    };
}

function buildCalendarCells(currentMonth: dayjs.Dayjs) {
    const monthStart = currentMonth.startOf("month");
    const monthEnd = currentMonth.endOf("month");
    const calendarStart = monthStart.startOf("week");
    const calendarEnd = monthEnd.endOf("week");

    const cells: CalendarCell[] = [];
    let cursor = calendarStart;

    while (cursor.isBefore(calendarEnd) || cursor.isSame(calendarEnd, "day")) {
        cells.push({
            date: cursor,
            key: getDateKey(cursor),
            isCurrentMonth: cursor.isSame(currentMonth, "month"),
        });
        cursor = cursor.add(1, "day");
    }

    return cells;
}

export default function TaskCalendar() {
    const { weddingData } = useWeddingStore();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const tasks = weddingData?.tasks || [];
    const bookLabel = currentBookName || "当前账本";

    const today = useMemo(() => dayjs(), []);
    const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));
    const [selectedDate, setSelectedDate] = useState(today);
    const [collapsed, setCollapsed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [monthHolidayMap, setMonthHolidayMap] = useState<HolidayInfoMap>({});

    useEffect(() => {
        if (!selectedDate.isSame(currentMonth, "month")) {
            setSelectedDate(currentMonth.startOf("month"));
        }
    }, [currentMonth, selectedDate]);

    useEffect(() => {
        const controller = new AbortController();
        const monthKey = currentMonth.format("YYYY-MM");

        const loadHolidays = async () => {
            try {
                const response = await fetch(
                    `https://timor.tech/api/holiday/year/${monthKey}?type=Y&week=Y`,
                    { signal: controller.signal },
                );
                const data = (await response.json()) as {
                    holiday?: Record<
                        string,
                        { name?: string; holiday?: boolean } | null
                    >;
                };

                const nextMap = Object.entries(
                    data.holiday || {},
                ).reduce<HolidayInfoMap>((acc, [monthDay, value]) => {
                    if (!value?.name) {
                        return acc;
                    }

                    const fullKey = `${currentMonth.format("YYYY")}-${monthDay}`;
                    acc[fullKey] = value.name;
                    return acc;
                }, {});

                setMonthHolidayMap(nextMap);
            } catch (_error) {
                if (!controller.signal.aborted) {
                    setMonthHolidayMap({});
                }
            }
        };

        loadHolidays();

        return () => {
            controller.abort();
        };
    }, [currentMonth]);

    const tasksByDate = useMemo(() => {
        return tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
            if (!task.deadline) {
                return acc;
            }

            const key = dayjs(task.deadline).format("YYYY-MM-DD");
            const current = acc[key] || [];
            acc[key] = [...current, task];
            return acc;
        }, {});
    }, [tasks]);

    const calendarCells = useMemo(() => {
        return buildCalendarCells(currentMonth);
    }, [currentMonth]);

    const weeks = useMemo(() => {
        const grouped: CalendarCell[][] = [];
        for (let index = 0; index < calendarCells.length; index += 7) {
            grouped.push(calendarCells.slice(index, index + 7));
        }
        return grouped;
    }, [calendarCells]);

    const visibleWeeks = useMemo(() => {
        if (!collapsed) {
            return weeks;
        }

        const selectedKey = getDateKey(selectedDate);
        const selectedWeek = weeks.find((week) =>
            week.some((cell) => cell.key === selectedKey),
        );

        return selectedWeek ? [selectedWeek] : weeks.slice(0, 1);
    }, [collapsed, selectedDate, weeks]);

    const selectedTasks = useMemo(() => {
        return tasksByDate[getDateKey(selectedDate)] || [];
    }, [selectedDate, tasksByDate]);

    const currentMonthTaskCount = useMemo(() => {
        return tasks.filter((task) => {
            if (!task.deadline) {
                return false;
            }
            return dayjs(task.deadline).isSame(currentMonth, "month");
        }).length;
    }, [currentMonth, tasks]);
    const selectedCompletedCount = selectedTasks.filter(
        (item) => item.status === "completed",
    ).length;

    const selectedDateNote = useMemo(() => {
        return getCalendarNote(
            selectedDate,
            monthHolidayMap[getDateKey(selectedDate)],
        );
    }, [monthHolidayMap, selectedDate]);

    const handleMonthChange = (offset: number) => {
        const nextMonth = currentMonth.add(offset, "month").startOf("month");
        setCurrentMonth(nextMonth);
        setSelectedDate(nextMonth);
    };

    const handleSelectDate = (date: dayjs.Dayjs) => {
        setSelectedDate(date);
        if (!date.isSame(currentMonth, "month")) {
            setCurrentMonth(date.startOf("month"));
        }
    };

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="任务日历"
                subtitle={`按日期查看${bookLabel}待办`}
                backTo="/tasks"
            />

            <section className="overflow-hidden rounded-[28px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-0 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.2)]">
                <div className="flex items-center justify-between bg-[linear-gradient(135deg,#fff0f7,#f3e8ff)] px-4 pb-3 pt-4 dark:bg-[linear-gradient(135deg,rgba(61,16,48,0.75),rgba(30,13,48,0.75))]">
                    <button
                        type="button"
                        onClick={() => handleMonthChange(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--wedding-text-soft)] transition hover:bg-white/70 dark:hover:bg-white/8"
                        aria-label="上个月"
                    >
                        <i className="icon-[mdi--chevron-left] size-5" />
                    </button>
                    <div className="text-center">
                        <div className="text-[28px] font-semibold text-[color:var(--wedding-text)]">
                            {currentMonth.format("M月")}
                        </div>
                        <div className="mt-1 text-xs wedding-muted">
                            本月 {currentMonthTaskCount} 项任务
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleMonthChange(1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--wedding-text-soft)] transition hover:bg-white/70 dark:hover:bg-white/8"
                        aria-label="下个月"
                    >
                        <i className="icon-[mdi--chevron-right] size-5" />
                    </button>
                </div>

                <div className="border-t border-[color:var(--wedding-line)] px-3 pt-3">
                    <div className="mb-2 grid grid-cols-7 text-center text-xs wedding-muted">
                        {WEEK_LABELS.map((label) => (
                            <div key={label} className="py-1">
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1">
                        {visibleWeeks.map((week, weekIndex) => (
                            <div
                                key={`${week[0]?.key ?? weekIndex}-row`}
                                className="grid grid-cols-7 gap-1"
                            >
                                {week.map((cell) => {
                                    const cellTasks =
                                        tasksByDate[cell.key] || [];
                                    const note = getCalendarNote(
                                        cell.date,
                                        monthHolidayMap[cell.key],
                                    );
                                    const isSelected = cell.date.isSame(
                                        selectedDate,
                                        "day",
                                    );
                                    const isToday = cell.date.isSame(
                                        today,
                                        "day",
                                    );

                                    return (
                                        <button
                                            key={cell.key}
                                            type="button"
                                            className={cn(
                                                "flex min-h-[58px] flex-col items-center justify-center rounded-[18px] px-1 py-2 text-center transition",
                                                isSelected
                                                    ? "bg-gradient-to-br from-[#f48370] to-[#ef5cab] text-white shadow-[0_18px_28px_-20px_rgba(244,131,112,0.95)]"
                                                    : "text-[color:var(--wedding-text)] hover:bg-white/70 dark:hover:bg-white/6",
                                                !cell.isCurrentMonth &&
                                                    !isSelected &&
                                                    "text-[color:var(--wedding-text-mute)]",
                                                isToday &&
                                                    !isSelected &&
                                                    "bg-pink-50 text-pink-500 dark:bg-pink-500/10",
                                            )}
                                            onClick={() =>
                                                handleSelectDate(cell.date)
                                            }
                                        >
                                            <span className="text-lg leading-none">
                                                {cell.date.date()}
                                            </span>
                                            <span
                                                className={cn(
                                                    "mt-1 text-[10px] leading-none",
                                                    isSelected
                                                        ? "text-white/80"
                                                        : note.emphasis
                                                          ? "text-emerald-500"
                                                          : "wedding-muted",
                                                )}
                                            >
                                                {note.label}
                                            </span>
                                            {cellTasks.length > 0 ? (
                                                <span
                                                    className={cn(
                                                        "mt-1 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px]",
                                                        isSelected
                                                            ? "bg-white/20 text-white"
                                                            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10",
                                                    )}
                                                >
                                                    {cellTasks.length}
                                                </span>
                                            ) : (
                                                <span className="mt-1 h-[14px]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center py-2">
                        <button
                            type="button"
                            className="flex h-8 w-14 items-center justify-center rounded-full text-[color:var(--wedding-text-mute)] transition hover:bg-white/80 dark:hover:bg-white/8"
                            onClick={() => setCollapsed((value) => !value)}
                            aria-label={collapsed ? "展开月历" : "收起到周视图"}
                        >
                            <i
                                className={cn(
                                    "icon-[mdi--chevron-down] size-5 transition-transform",
                                    collapsed && "rotate-180",
                                )}
                            />
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-3 gap-2">
                {[
                    [
                        "本月任务",
                        `${currentMonthTaskCount} 项`,
                        currentMonth.format("YYYY年M月"),
                        "#F472B6",
                    ],
                    [
                        "选中日期",
                        `${selectedTasks.length} 项`,
                        selectedDate.format("M月D日"),
                        "#3B82F6",
                    ],
                    [
                        "已完成",
                        `${selectedCompletedCount} 项`,
                        "仅统计当前日期",
                        "#22C55E",
                    ],
                ].map(([label, value, hint, color]) => (
                    <div
                        key={label}
                        className="rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-3 py-3 text-center shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                    >
                        <div className="text-[10px] wedding-muted">{label}</div>
                        <div
                            className="mt-1 text-lg font-bold leading-none"
                            style={{ color }}
                        >
                            {value}
                        </div>
                        <div className="mt-1 text-[10px] text-[color:var(--wedding-text-mute)]">
                            {hint}
                        </div>
                    </div>
                ))}
            </section>

            <section className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="wedding-topbar-title text-[28px] text-[color:var(--wedding-text)]">
                            {selectedDate.format("M月D日")}
                        </h2>
                        <div className="mt-1 text-sm wedding-muted">
                            {WEEKDAY_LABELS[selectedDate.day()]} · 共{" "}
                            {selectedTasks.length} 项日程
                        </div>
                    </div>
                    <WeddingBadge
                        tone={selectedDateNote.emphasis ? "accent" : "neutral"}
                    >
                        {selectedDateNote.label}
                    </WeddingBadge>
                </div>

                <div className="mt-4 space-y-3">
                    {selectedTasks.length > 0 ? (
                        selectedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-3 rounded-[22px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] p-4"
                            >
                                <div className="flex min-h-14 w-12 flex-col items-center justify-center rounded-[16px] bg-white/80 text-xs text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                                    <span className="font-semibold">日程</span>
                                    <span className="mt-1">全天</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="truncate text-lg font-semibold text-[color:var(--wedding-text)]">
                                                    {getCategoryEmoji(
                                                        task.category,
                                                    )}{" "}
                                                    {task.title}
                                                </div>
                                            </div>
                                            {task.notes ? (
                                                <div className="mt-2 text-sm wedding-muted">
                                                    {task.notes}
                                                </div>
                                            ) : null}
                                        </div>
                                        <WeddingBadge
                                            tone={
                                                task.status === "completed"
                                                    ? "success"
                                                    : task.status ===
                                                        "in_progress"
                                                      ? "accent"
                                                      : "info"
                                            }
                                        >
                                            {task.status === "completed"
                                                ? "已完成"
                                                : task.status === "in_progress"
                                                  ? "进行中"
                                                  : "待开始"}
                                        </WeddingBadge>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full bg-white px-2.5 py-1 text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                                            {getTaskPriorityLabel(
                                                task.priority,
                                            )}
                                            优先级
                                        </span>
                                        <span className="rounded-full bg-white px-2.5 py-1 text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                                            {getCategoryName(task.category)}
                                        </span>
                                        {task.assignee ? (
                                            <span className="rounded-full bg-white px-2.5 py-1 text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                                                {task.assignee === "groom"
                                                    ? "男方负责"
                                                    : "女方负责"}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-[22px] border border-dashed border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] px-5 py-10 text-center">
                            <div className="text-base font-semibold text-[color:var(--wedding-text)]">
                                这一天还没有安排任务
                            </div>
                            <div className="mt-2 text-sm wedding-muted">
                                可以回到任务列表新增待办，或者切换其他日期查看。
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <WeddingFloatingActionButton
                className="bg-[linear-gradient(135deg,#f48370_0%,#ef5cab_100%)]"
                onClick={() => setShowForm(true)}
                aria-label="新增任务"
            >
                <i className="icon-[mdi--plus] size-7" />
            </WeddingFloatingActionButton>

            <ResponsiveDialog
                open={showForm}
                onOpenChange={setShowForm}
                title="添加任务"
                description={`默认截止日期为 ${selectedDate.format("M月D日")}，你也可以在表单里修改`}
                maxWidth="md"
                fullScreenOnMobile={true}
                actions={{
                    cancelText: "取消",
                    confirmText: "创建任务",
                    onConfirm: async () => {
                        // TaskForm组件会处理提交逻辑，这里只需要关闭弹窗
                        setShowForm(false);
                    },
                    loading: formLoading,
                }}
            >
                <TaskForm
                    initialDeadline={selectedDate.valueOf()}
                    onClose={() => setShowForm(false)}
                />
            </ResponsiveDialog>
        </WeddingPageShell>
    );
}
