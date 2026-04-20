import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Tasks from "../Tasks";

const navigateMock = vi.fn();
const updateTaskMock = vi.fn();

vi.mock("react-router", async () => {
    const actual =
        await vi.importActual<typeof import("react-router")>("react-router");
    return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/store/book", () => ({
    useBookStore: (
        selector: (state: {
            currentBookId: string;
            books: { id: string; name: string }[];
        }) => unknown,
    ) =>
        selector({
            currentBookId: "1",
            books: [{ id: "1", name: "测试账本" }],
        }),
}));

vi.mock("@/store/wedding", () => ({
    useWeddingStore: () => ({
        weddingData: {
            tasks: [
                {
                    id: "t1",
                    title: "任务A",
                    category: "venue",
                    priority: "high",
                    status: "pending",
                    createdAt: Date.now(),
                },
            ],
        },
        updateTask: updateTaskMock,
    }),
}));

describe("Tasks Page", () => {
    it("renders and switches to calendar", () => {
        render(<Tasks />);
        expect(screen.getByText("婚礼任务")).toBeInTheDocument();
        fireEvent.click(screen.getByText("日历"));
        expect(navigateMock).toHaveBeenCalledWith("/tasks/calendar");
    });
});
