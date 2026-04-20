import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import Tools from "../Tools";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>(
        "react-router",
    );
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

vi.mock("@/components/wedding-ui", () => ({
    WeddingPageShell: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
    WeddingTopBar: ({
        title,
        subtitle,
    }: {
        title?: string;
        subtitle?: string;
    }) => (
        <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    ),
}));

vi.mock("@/store/book", () => ({
    useBookStore: (
        selector: (state: {
            currentBookId: string;
            books: { id: string; name: string }[];
        }) => unknown,
    ) =>
        selector({
            currentBookId: "book-1",
            books: [{ id: "book-1", name: "婚礼主账本" }],
        }),
}));

vi.mock("@/store/wedding", () => ({
    useWeddingStore: () => ({
        weddingData: {
            tasks: [{ id: "t1", title: "确认场地", status: "pending" }],
            guests: [{ id: "g1", inviteStatus: "confirmed" }],
            giftRecords: [{ id: "r1", amount: 2000, type: "received" }],
            weddingBudgets: [{ id: "b1", budget: 8000, spent: 2000 }],
        },
    }),
}));

describe("Tools Page", () => {
    it("renders feature cards and navigates on action click", () => {
        navigateMock.mockReset();

        render(<Tools />);

        expect(screen.getByText("婚礼主账本工具箱")).toBeInTheDocument();
        expect(screen.getByText("礼金簿")).toBeInTheDocument();
        expect(screen.getByText("亲友管理")).toBeInTheDocument();
        expect(screen.getByText("婚礼预算")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "进入工具：礼金簿" }));
        expect(navigateMock).toHaveBeenCalledWith("/tools/gift-book");
    });
});
