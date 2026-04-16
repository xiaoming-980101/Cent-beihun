import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";

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

