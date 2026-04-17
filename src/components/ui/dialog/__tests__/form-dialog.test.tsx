import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormDialog } from "../form-dialog";

/**
 * FormDialog 单元测试
 * 验证 FormDialog 组件的渲染和交互行为
 * 需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

describe("FormDialog", () => {
    it("should render with title", () => {
        render(
            <FormDialog open={true} onOpenChange={() => {}} title="测试标题">
                <div>内容</div>
            </FormDialog>
        );

        // 验证标题渲染 - 需求 2.5
        expect(screen.getByText("测试标题")).toBeInTheDocument();
    });

    it("should render children content", () => {
        render(
            <FormDialog open={true} onOpenChange={() => {}} title="测试">
                <div data-testid="child">子组件内容</div>
            </FormDialog>
        );

        // 验证子组件渲染 - 需求 2.2
        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(screen.getByText("子组件内容")).toBeInTheDocument();
    });

    it("should call onOpenChange when close button clicked", async () => {
        const onOpenChange = vi.fn();

        render(
            <FormDialog open={true} onOpenChange={onOpenChange} title="测试">
                <div>内容</div>
            </FormDialog>
        );

        const closeButton = screen.getByRole("button", { name: /close/i });
        fireEvent.click(closeButton);

        // 验证 onOpenChange 回调 - 需求 2.1
        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it("should close on ESC key", async () => {
        const onOpenChange = vi.fn();

        render(
            <FormDialog open={true} onOpenChange={onOpenChange} title="测试">
                <div>内容</div>
            </FormDialog>
        );

        fireEvent.keyDown(document, { key: "Escape" });

        // 验证 ESC 键关闭 - 需求 2.1
        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it("should hide close button when hideClose is true", () => {
        render(
            <FormDialog
                open={true}
                onOpenChange={() => {}}
                title="测试"
                hideClose={true}
            >
                <div>内容</div>
            </FormDialog>
        );

        const closeButton = screen.queryByRole("button", { name: /close/i });
        expect(closeButton).not.toBeInTheDocument();
    });

    it("should render with different maxWidth variants", () => {
        const { rerender } = render(
            <FormDialog
                open={true}
                onOpenChange={() => {}}
                title="测试"
                maxWidth="sm"
            >
                <div>内容</div>
            </FormDialog>
        );

        // 验证组件渲染 - 需求 2.7
        expect(screen.getByText("测试")).toBeInTheDocument();

        // 测试其他 maxWidth 变体
        rerender(
            <FormDialog
                open={true}
                onOpenChange={() => {}}
                title="测试"
                maxWidth="lg"
            >
                <div>内容</div>
            </FormDialog>
        );
        expect(screen.getByText("测试")).toBeInTheDocument();

        rerender(
            <FormDialog
                open={true}
                onOpenChange={() => {}}
                title="测试"
                maxWidth="xl"
            >
                <div>内容</div>
            </FormDialog>
        );
        expect(screen.getByText("测试")).toBeInTheDocument();
    });

    it("should render with custom className", () => {
        render(
            <FormDialog
                open={true}
                onOpenChange={() => {}}
                title="测试"
                className="custom-class"
            >
                <div>内容</div>
            </FormDialog>
        );

        // 验证组件渲染 - 需求 2.7
        expect(screen.getByText("测试")).toBeInTheDocument();
    });

    it("should render with scrollable content", () => {
        render(
            <FormDialog open={true} onOpenChange={() => {}} title="测试">
                <div>
                    <p>内容1</p>
                    <p>内容2</p>
                    <p>内容3</p>
                </div>
            </FormDialog>
        );

        // 验证可滚动内容区域 - 需求 2.3
        expect(screen.getByText("内容1")).toBeInTheDocument();
        expect(screen.getByText("内容2")).toBeInTheDocument();
        expect(screen.getByText("内容3")).toBeInTheDocument();
    });

    it("should not emit description warning when no description is provided", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => {});

        render(
            <FormDialog open={true} onOpenChange={() => {}} title="测试">
                <div>内容</div>
            </FormDialog>
        );

        expect(warnSpy).not.toHaveBeenCalledWith(
            expect.stringContaining("Missing `Description`"),
        );

        warnSpy.mockRestore();
    });
});
