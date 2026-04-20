import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import SearchPage from "../index";

vi.mock("@/components/wedding-ui", () => ({
    WeddingPageShell: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
    WeddingTopBar: ({ title }: { title?: string }) => <h1>{title}</h1>,
    WeddingEmptyState: ({ title }: { title?: string }) => <div>{title}</div>,
}));

vi.mock("@/api/storage", () => ({
    StorageAPI: {
        pull: vi.fn().mockResolvedValue(undefined),
        push: vi.fn().mockResolvedValue(undefined),
        loginWith: vi.fn(),
        loginManuallyWith: vi.fn(),
    },
    StorageDeferredAPI: {
        filter: vi.fn().mockResolvedValue([]),
    },
}));

vi.mock("@/store/book", () => ({
    useBookStore: Object.assign(
        (selector?: (state: { currentBookId: string }) => unknown) => {
            const state = { currentBookId: "book-1" };
            return selector ? selector(state) : state;
        },
        {
            getState: () => ({ currentBookId: "book-1" }),
        },
    ),
}));

vi.mock("@/store/ledger", () => ({
    useLedgerStore: Object.assign(
        (
            selector?: (state: {
                infos: {
                    meta: {
                        tags: unknown[];
                        personal: Record<string, unknown>;
                    };
                };
                bills: unknown[];
                removeBills: () => void;
                updateBills: () => void;
            }) => unknown,
        ) => {
            const state = {
                infos: { meta: { tags: [], personal: {} } },
                bills: [],
                removeBills: vi.fn(),
                updateBills: vi.fn(),
            };
            return selector ? selector(state) : state;
        },
        {
            getState: () => ({
                infos: { meta: { tags: [], personal: {} } },
                bills: [],
                removeBills: vi.fn(),
                updateBills: vi.fn(),
            }),
        },
    ),
}));

vi.mock("@/locale", () => ({
    useIntl: () => (key: string) => key,
    t: (key: string) => key,
}));

vi.mock("@/hooks/use-currency", () => ({
    useCurrency: () => ({ baseCurrency: { id: "CNY" } }),
}));

vi.mock("@/hooks/use-category", () => ({
    default: () => ({ categories: [] }),
}));

vi.mock("@/hooks/use-custom-filters", () => ({
    useCustomFilters: () => ({
        addFilter: vi.fn().mockResolvedValue("mock-filter-id"),
    }),
}));

vi.mock("@/store/preference", () => ({
    usePreferenceStore: () => true,
}));

vi.mock("@/store/user", () => ({
    useUserStore: {
        getState: () => ({ id: "user-1" }),
    },
    useIsLogin: () => true,
}));

describe("Search Page", () => {
    it("renders and accepts search input", () => {
        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>,
        );
        const input = screen.getByPlaceholderText(
            "搜索备注、分类、金额和标签...",
        );
        fireEvent.change(input, { target: { value: "婚礼" } });
        expect((input as HTMLInputElement).value).toBe("婚礼");
    });
});
