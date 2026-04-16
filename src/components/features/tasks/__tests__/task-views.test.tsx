import dayjs from "dayjs";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskCalendarView } from "../task-calendar-view";
import { TaskListView } from "../task-list-view";

const tasks = [
    {
        id: "task-1",
        title: "确认婚礼场地",
        category: "venue",
        priority: "high",
        status: "pending",
        deadline: Date.now(),
        createdAt: Date.now(),
    },
] as any;

describe("Task Views", () => {
    it("renders task list and triggers callbacks", () => {
        const onEdit = vi.fn();
        const onToggle = vi.fn();
        render(
            <TaskListView tasks={tasks} onEdit={onEdit} onToggleStatus={onToggle} />,
        );

        fireEvent.click(screen.getByLabelText("切换任务状态"));
        expect(onToggle).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole("button", { name: /确认婚礼场地/ }));
        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("renders calendar and allows selecting date", () => {
        const onSelectDate = vi.fn();
        render(
            <TaskCalendarView
                tasks={tasks}
                selectedDate={dayjs()}
                onSelectDate={onSelectDate}
            />,
        );

        const dayButton = screen.getAllByRole("button")[0];
        fireEvent.click(dayButton);
        expect(onSelectDate).toHaveBeenCalled();
    });
});
