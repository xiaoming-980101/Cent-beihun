import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDebouncedSearch } from "../use-debounced-search";

describe("useDebouncedSearch", () => {
    it("updates value after debounce delay", () => {
        vi.useFakeTimers();
        const { result, rerender } = renderHook(
            ({ value }) => useDebouncedSearch(value, 300),
            { initialProps: { value: "a" } },
        );

        rerender({ value: "abc" });
        expect(result.current).toBe("a");

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current).toBe("abc");
        vi.useRealTimers();
    });
});

