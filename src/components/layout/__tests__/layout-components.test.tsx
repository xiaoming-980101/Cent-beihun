import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BottomNavBar, MainLayout, TopAppBar } from "..";

describe("Layout Components", () => {
    it("switches tab in TopAppBar", () => {
        const onTabChange = vi.fn();
        render(
            <TopAppBar
                title="任务管理"
                tabs={[
                    { label: "列表", value: "list" },
                    { label: "日历", value: "calendar" },
                ]}
                activeTab="list"
                onTabChange={onTabChange}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "日历" }));
        expect(onTabChange).toHaveBeenCalledWith("calendar");
    });

    it("triggers navigate from BottomNavBar click and keyboard", () => {
        const onNavigate = vi.fn();
        render(<BottomNavBar activeId="home" onNavigate={onNavigate} />);

        const toolsButton = screen.getByRole("button", { name: "工具箱" });
        fireEvent.click(toolsButton);
        fireEvent.keyDown(toolsButton, { key: "Enter" });
        fireEvent.keyDown(toolsButton, { key: " " });

        expect(onNavigate).toHaveBeenCalledTimes(3);
        expect(onNavigate).toHaveBeenCalledWith("tools");
    });

    it("applies main layout spacing when top and bottom bars are shown", () => {
        const { container } = render(
            <MainLayout
                topBarProps={{ title: "主页" }}
                navBarProps={{ activeId: "home", onNavigate: () => {} }}
            >
                <div>内容区</div>
            </MainLayout>,
        );

        expect(screen.getByText("内容区")).toBeInTheDocument();
        const main = container.querySelector("main");
        expect(main).toHaveClass("pt-16");
        expect(main).toHaveClass("pb-20");
    });
});
