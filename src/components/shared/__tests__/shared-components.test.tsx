import { fireEvent, render, screen } from "@testing-library/react";
import { Moon, Package } from "lucide-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmptyState } from "../empty-state";
import { FeatureCard } from "../feature-card";
import { ThemeToggle } from "../theme-toggle";

const toggleMock = vi.fn();
const mockThemeState = {
    theme: "light" as "light" | "dark" | "system",
    systemTheme: "light" as "light" | "dark" | undefined,
    setTheme: vi.fn(),
    toggle: toggleMock,
};

vi.mock("@/lib/theme/use-theme", () => ({
    useTheme: () => mockThemeState,
}));

describe("Shared Components", () => {
    beforeEach(() => {
        toggleMock.mockReset();
        mockThemeState.theme = "light";
        mockThemeState.systemTheme = "light";
    });

    it("renders FeatureCard with required props", () => {
        render(
            <FeatureCard
                icon={
                    <Package
                        data-testid="feature-icon"
                        className="h-5 w-5 text-purple-600"
                    />
                }
                title="礼金簿"
                description="精准记录每一份礼金"
                onAction={() => {}}
            />,
        );

        expect(screen.getByRole("article")).toBeInTheDocument();
        expect(screen.getByText("礼金簿")).toBeInTheDocument();
        expect(screen.getByText("精准记录每一份礼金")).toBeInTheDocument();
        expect(screen.getByTestId("feature-icon")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "进入工具：礼金簿" }),
        ).toBeInTheDocument();
    });

    it("triggers FeatureCard action when action button is clicked", () => {
        const onAction = vi.fn();
        render(
            <FeatureCard
                icon={<Package className="h-5 w-5 text-blue-600" />}
                iconVariant="blue"
                title="统计分析"
                description="查看收支趋势和分类占比"
                onAction={onAction}
                actionText="查看详情"
            />,
        );

        fireEvent.click(
            screen.getByRole("button", { name: "查看详情：统计分析" }),
        );
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("renders FeatureCard badge when provided", () => {
        render(
            <FeatureCard
                icon={<Package className="h-5 w-5 text-green-600" />}
                iconVariant="green"
                title="任务管理"
                description="婚礼筹备流程可视化追踪"
                badge="hot"
                onAction={() => {}}
            />,
        );

        const badge = screen.getByText("hot");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("uppercase");
    });

    it("renders EmptyState with optional description and action", () => {
        const onAction = vi.fn();
        render(
            <EmptyState
                icon={<Moon className="h-8 w-8" />}
                title="还没有数据"
                description="点击按钮开始添加第一条记录"
                action={{ label: "立即添加", onClick: onAction }}
            />,
        );

        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(screen.getByText("还没有数据")).toBeInTheDocument();
        expect(
            screen.getByText("点击按钮开始添加第一条记录"),
        ).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "立即添加" }));
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("toggles theme when ThemeToggle button is clicked", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button", { name: "切换主题" });
        expect(button).toHaveAttribute("title", "切换到深色模式");

        fireEvent.click(button);
        expect(toggleMock).toHaveBeenCalledTimes(1);
    });

    it("sets next theme title from resolved system theme", () => {
        mockThemeState.theme = "system";
        mockThemeState.systemTheme = "dark";

        render(<ThemeToggle />);

        expect(
            screen.getByRole("button", { name: "切换主题" }),
        ).toHaveAttribute("title", "切换到浅色模式");
    });
});
