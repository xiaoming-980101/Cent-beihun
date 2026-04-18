import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/timing";

export function useDebouncedSearch<T>(value: T, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    const updateDebounced = useMemo(
        () =>
            debounce((nextValue: T) => {
                setDebouncedValue(nextValue);
            }, delay),
        [delay],
    );

    useEffect(() => {
        updateDebounced(value);
        return () => {
            updateDebounced.cancel();
        };
    }, [updateDebounced, value]);

    return debouncedValue;
}
