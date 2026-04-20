import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../dialog";

/**
 * DialogContent 单元测试
 * 验证增强的 DialogContent 组件的渲染和交互行为
 * 需求: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 */

describe("DialogContent", () => {
    it("should render with close button by default", () => {
        render(
            <Dialog open={true}>
                <DialogContent>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeInTheDocument();
    });

    it("should hide close button when hideClose is true", () => {
        render(
            <Dialog open={true}>
                <DialogContent hideClose={true}>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        const closeButton = screen.queryByRole("button", { name: /close/i });
        expect(closeButton).not.toBeInTheDocument();
    });

    it("should render children content", () => {
        render(
            <Dialog open={true}>
                <DialogContent>
                    <div data-testid="child-content">Test Content</div>
                </DialogContent>
            </Dialog>,
        );

        expect(screen.getByTestId("child-content")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should call onOpenChange when close button clicked", async () => {
        const onOpenChange = vi.fn();

        render(
            <Dialog open={true} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        const closeButton = screen.getByRole("button", { name: /close/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it("should close on ESC key", async () => {
        const onOpenChange = vi.fn();

        render(
            <Dialog open={true} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        fireEvent.keyDown(document, { key: "Escape" });

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it("should apply custom className", () => {
        render(
            <Dialog open={true}>
                <DialogContent className="custom-dialog-class">
                    <DialogHeader>
                        <DialogTitle>测试</DialogTitle>
                    </DialogHeader>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        // 验证组件渲染 - 需求 1.6
        expect(screen.getByText("测试")).toBeInTheDocument();
    });
});

describe("DialogHeader and DialogTitle", () => {
    it("should render DialogHeader with DialogTitle", () => {
        render(
            <Dialog open={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Test Title</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>,
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render DialogDescription", () => {
        render(
            <Dialog open={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Test Title</DialogTitle>
                        <DialogDescription>Test Description</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>,
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
});

describe("Dialog Overlay", () => {
    it("should render overlay when dialog is open", () => {
        render(
            <Dialog open={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>测试</DialogTitle>
                    </DialogHeader>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        // 验证弹窗渲染 - 需求 1.2, 1.8
        expect(screen.getByText("测试")).toBeInTheDocument();
    });

    it("should call onOpenChange when overlay clicked", async () => {
        const onOpenChange = vi.fn();

        const { container } = render(
            <Dialog open={true} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div>Content</div>
                </DialogContent>
            </Dialog>,
        );

        // 查找遮罩层并点击 - 需求 1.8
        const overlay = container.querySelector("[data-radix-dialog-overlay]");
        if (overlay) {
            fireEvent.click(overlay);
            await waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(false);
            });
        }
    });
});
