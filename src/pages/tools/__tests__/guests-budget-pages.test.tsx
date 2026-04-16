import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GuestManagement from "../GuestManagement";
import WeddingBudget from "../WeddingBudget";

vi.mock("@/components/wedding-ui", () => ({
    WeddingPageShell: ({ children }: any) => <div>{children}</div>,
    WeddingTopBar: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock("@/store/wedding", () => ({
    useWeddingStore: () => ({
        weddingData: {
            guests: [
                { id: "g1", name: "Alice", relation: "friend", inviteStatus: "confirmed" },
            ],
            weddingBudgets: [
                { id: "b1", category: "摄影", budget: 5000, spent: 2000, status: "planned" },
            ],
        },
        deleteGuest: vi.fn(),
    }),
}));

describe("Guests/Budget Pages", () => {
    it("renders guest page list", () => {
        render(<GuestManagement />);
        expect(screen.getByText("亲友管理")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("renders budget page list", () => {
        render(<WeddingBudget />);
        expect(screen.getByText("婚礼预算")).toBeInTheDocument();
        expect(screen.getByText("摄影")).toBeInTheDocument();
    });
});

