import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { GiftFormDialog } from "../gift-form-dialog";

const addGiftRecordMock = vi.fn();
const updateGiftRecordMock = vi.fn();

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("@/store/wedding", () => ({
    useWeddingStore: () => ({
        weddingData: {
            guests: [{ id: "guest-1", name: "张三", relation: "friend" }],
        },
        addGiftRecord: addGiftRecordMock,
        updateGiftRecord: updateGiftRecordMock,
    }),
}));

describe("GiftFormDialog", () => {
    beforeAll(() => {
        if (!Element.prototype.animate) {
            const animationMock = {
                commitStyles: vi.fn(),
                cancel: vi.fn(),
                finished: Promise.resolve(undefined),
            } as any;
            animationMock.finished = Promise.resolve(animationMock);
            Element.prototype.animate = vi.fn().mockReturnValue({
                ...animationMock,
            } as any);
        }
    });

    beforeEach(() => {
        addGiftRecordMock.mockReset();
        updateGiftRecordMock.mockReset();
    });

    it("shows validation error when amount is invalid", async () => {
        render(<GiftFormDialog open onOpenChange={() => {}} />);

        fireEvent.change(screen.getByPlaceholderText("请输入金额"), {
            target: { value: 0 },
        });
        fireEvent.click(screen.getByRole("button", { name: "添加记录" }));

        expect(await screen.findByText("金额必须大于 0")).toBeInTheDocument();
    });

    it("submits add form successfully", async () => {
        render(<GiftFormDialog open onOpenChange={() => {}} />);

        fireEvent.change(screen.getByPlaceholderText("请输入金额"), {
            target: { value: 520 },
        });
        fireEvent.click(screen.getByRole("button", { name: "添加记录" }));

        await waitFor(() => {
            expect(addGiftRecordMock).toHaveBeenCalledTimes(1);
        });
    });

    it("submits update when editRecord is provided", async () => {
        render(
            <GiftFormDialog
                open
                onOpenChange={() => {}}
                editRecord={{
                    id: "record-1",
                    type: "received",
                    amount: 888,
                    date: Date.now(),
                    event: "wedding",
                }}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText("请输入金额"), {
            target: { value: 999 },
        });
        fireEvent.click(screen.getByRole("button", { name: "保存更新" }));

        await waitFor(() => {
            expect(updateGiftRecordMock).toHaveBeenCalledTimes(1);
        });
    });
});
