import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QuickStatsGrid } from "../QuickStatsGrid";
import { TodayTasksCard } from "../TodayTasksCard";

type MockWeddingData = {
    tasks: Array<{
        id: string;
        title: string;
        status: "pending" | "in_progress" | "completed";
        deadline?: number;
    }>;
    guests: Array<{ inviteStatus: "pending" | "invited" | "confirmed" | "declined" }>;
    giftRecords: Array<{ type: "received" | "sent"; amount: number }>;
    weddingBudgets: Array<{ budget: number; spent: number }>;
};

let mockWeddingData: MockWeddingData | null = null;

vi.mock("@/store/wedding", () => ({
    useWeddingStore: () => ({
        weddingData: mockWeddingData,
    }),
}));

describe("Home Widgets", () => {
    beforeEach(() => {
        const now = new Date();
        now.setHours(18, 0, 0, 0);

        mockWeddingData = {
            tasks: [
                {
                    id: "task-today-1",
                    title: "确认酒店 final 清单",
                    status: "pending",
                    deadline: now.getTime(),
                },
                {
                    id: "task-future-1",
                    title: "安排跟拍师彩排",
                    status: "in_progress",
                    deadline: now.getTime() + 24 * 60 * 60 * 1000,
                },
            ],
            guests: [{ inviteStatus: "confirmed" }, { inviteStatus: "pending" }],
            giftRecords: [
                { type: "received", amount: 2000 },
                { type: "received", amount: 1000 },
                { type: "sent", amount: 500 },
            ],
            weddingBudgets: [{ budget: 10000, spent: 3500 }],
        };
    });

    it("renders quick stats values", () => {
        render(
            <MemoryRouter>
                <QuickStatsGrid />
            </MemoryRouter>,
        );

        expect(screen.getByText("礼金总额")).toBeInTheDocument();
        expect(screen.getByText("¥3,000")).toBeInTheDocument();
        expect(screen.getByText("预算剩余")).toBeInTheDocument();
        expect(screen.getByText("¥6,500")).toBeInTheDocument();
        expect(screen.getByText("今日待办")).toBeInTheDocument();
        expect(screen.getByText("1 项")).toBeInTheDocument();
    });

    it("renders today task list when tasks exist", () => {
        render(
            <MemoryRouter>
                <TodayTasksCard />
            </MemoryRouter>,
        );

        expect(screen.getByText("今日待办任务")).toBeInTheDocument();
        expect(screen.getByText("确认酒店 final 清单")).toBeInTheDocument();
    });

    it("renders empty hint when no task due today", () => {
        mockWeddingData = {
            ...(mockWeddingData as MockWeddingData),
            tasks: [
                {
                    id: "task-future-only",
                    title: "未来任务",
                    status: "pending",
                    deadline: Date.now() + 2 * 24 * 60 * 60 * 1000,
                },
            ],
        };

        render(
            <MemoryRouter>
                <TodayTasksCard />
            </MemoryRouter>,
        );

        expect(screen.getByText("今日暂无待办，继续保持好节奏。")).toBeInTheDocument();
    });
});
