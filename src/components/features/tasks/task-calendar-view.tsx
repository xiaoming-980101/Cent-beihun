import dayjs from "dayjs";
import type { WeddingTask } from "@/wedding/type";

export function TaskCalendarView({
    tasks,
    selectedDate,
    onSelectDate,
}: {
    tasks: WeddingTask[];
    selectedDate: dayjs.Dayjs;
    onSelectDate: (date: dayjs.Dayjs) => void;
}) {
    const monthStart = selectedDate.startOf("month").startOf("week");
    const monthEnd = selectedDate.endOf("month").endOf("week");
    const days: dayjs.Dayjs[] = [];

    let cursor = monthStart;
    while (cursor.isBefore(monthEnd) || cursor.isSame(monthEnd, "day")) {
        days.push(cursor);
        cursor = cursor.add(1, "day");
    }

    const taskCountByDate = tasks.reduce<Record<string, number>>((acc, task) => {
        if (!task.deadline) return acc;
        const key = dayjs(task.deadline).format("YYYY-MM-DD");
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <section className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3">
            <div className="grid grid-cols-7 gap-1">
                {days.map((date) => {
                    const key = date.format("YYYY-MM-DD");
                    const isSelected = date.isSame(selectedDate, "day");
                    const count = taskCountByDate[key] ?? 0;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSelectDate(date)}
                            className={`min-h-[52px] rounded-xl p-1 text-center ${
                                isSelected
                                    ? "bg-pink-500 text-white"
                                    : "bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text)]"
                            }`}
                        >
                            <div className="text-xs">{date.date()}</div>
                            <div className="mt-1 text-[10px]">
                                {count > 0 ? `${count}项` : "-"}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

