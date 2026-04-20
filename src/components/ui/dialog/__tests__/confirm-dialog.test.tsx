import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "../confirm-dialog";

/**
 * ConfirmDialog 单元测试
 * 验证 ConfirmDialog 组件的行为
 * 需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

// 每个测试后清理 DOM
afterEach(() => {
    cleanup();
});

describe("ConfirmDialog", () => {
    it("should render title and description", () => {
        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认删除"
                description="此操作无法撤销"
                onConfirm={() => {}}
            />,
        );

        // 验证标题和描述渲染 - 需求 3.2
        expect(screen.getByText("确认删除")).toBeInTheDocument();
        expect(screen.getByText("此操作无法撤销")).toBeInTheDocument();
    });

    it("should call onConfirm when confirm button clicked", async () => {
        const onConfirm = vi.fn();

        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认操作"
                onConfirm={onConfirm}
            />,
        );

        // 使用 role 查找按钮，避免标题和按钮文本冲突
        const buttons = screen.getAllByRole("button");
        const confirmButton = buttons.find((btn) => btn.textContent === "确认");

        if (confirmButton) {
            fireEvent.click(confirmButton);
        }

        // 验证确认回调 - 需求 3.3
        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalled();
        });
    });

    it("should call onCancel when cancel button clicked", () => {
        const onCancel = vi.fn();

        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认操作"
                onConfirm={() => {}}
                onCancel={onCancel}
            />,
        );

        const cancelButton = screen.getByRole("button", { name: /取消/i });
        fireEvent.click(cancelButton);

        // 验证取消回调 - 需求 3.3
        expect(onCancel).toHaveBeenCalled();
    });

    it("should show destructive variant styling", () => {
        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认删除"
                variant="destructive"
                onConfirm={() => {}}
            />,
        );

        // 验证危险操作样式 - 需求 3.6
        const buttons = screen.getAllByRole("button");
        const confirmButton = buttons.find((btn) => btn.textContent === "确认");
        expect(confirmButton?.className).toContain("destructive");
    });

    it("should handle async onConfirm", async () => {
        const onConfirm = vi.fn().mockResolvedValue(undefined);
        const onOpenChange = vi.fn();

        render(
            <ConfirmDialog
                open={true}
                onOpenChange={onOpenChange}
                title="确认操作"
                onConfirm={onConfirm}
            />,
        );

        const buttons = screen.getAllByRole("button");
        const confirmButton = buttons.find((btn) => btn.textContent === "确认");

        if (confirmButton) {
            fireEvent.click(confirmButton);
        }

        // 验证异步操作支持 - 需求 3.7
        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalled();
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it("should show loading state during async operation", async () => {
        const onConfirm = vi
            .fn()
            .mockImplementation(
                () => new Promise((resolve) => setTimeout(resolve, 100)),
            );

        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认操作"
                onConfirm={onConfirm}
            />,
        );

        const buttons = screen.getAllByRole("button");
        const confirmButton = buttons.find((btn) => btn.textContent === "确认");

        if (confirmButton) {
            fireEvent.click(confirmButton);
        }

        // 验证 loading 状态 - 需求 3.7
        await waitFor(() => {
            expect(screen.getByText("处理中...")).toBeInTheDocument();
        });
    });

    it("should use custom button text", () => {
        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认操作"
                confirmText="删除"
                cancelText="放弃"
                onConfirm={() => {}}
            />,
        );

        // 验证自定义按钮文本 - 需求 3.4
        expect(screen.getByText("删除")).toBeInTheDocument();
        expect(screen.getByText("放弃")).toBeInTheDocument();
    });

    it("should render without description", () => {
        render(
            <ConfirmDialog
                open={true}
                onOpenChange={() => {}}
                title="确认操作"
                onConfirm={() => {}}
            />,
        );

        // 验证只有标题，没有描述
        expect(screen.getByText("确认操作")).toBeInTheDocument();
    });
});
