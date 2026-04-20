export type Cancelable<T> = T & {
    cancel: () => void;
};

export function debounce<TArgs extends unknown[]>(
    fn: (...args: TArgs) => void,
    wait = 0,
): Cancelable<(...args: TArgs) => void> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const debounced = ((...args: TArgs) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = undefined;
            fn(...args);
        }, wait);
    }) as Cancelable<(...args: TArgs) => void>;

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    return debounced;
}

export function throttle<TArgs extends unknown[]>(
    fn: (...args: TArgs) => void,
    wait = 0,
): Cancelable<(...args: TArgs) => void> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let trailingArgs: TArgs | undefined;

    const throttled = ((...args: TArgs) => {
        if (!timer) {
            fn(...args);
            timer = setTimeout(() => {
                timer = undefined;
                if (trailingArgs) {
                    const latest = trailingArgs;
                    trailingArgs = undefined;
                    throttled(...latest);
                }
            }, wait);
            return;
        }

        trailingArgs = args;
    }) as Cancelable<(...args: TArgs) => void>;

    throttled.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
        trailingArgs = undefined;
    };

    return throttled;
}
