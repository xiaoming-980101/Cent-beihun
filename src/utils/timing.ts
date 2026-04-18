type AnyFn = (...args: any[]) => void;

export type Cancelable<T extends AnyFn> = T & {
    cancel: () => void;
};

export function debounce<T extends AnyFn>(
    fn: T,
    wait = 0,
): Cancelable<(...args: Parameters<T>) => void> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const debounced = ((...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = undefined;
            fn(...args);
        }, wait);
    }) as Cancelable<(...args: Parameters<T>) => void>;

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    return debounced;
}

export function throttle<T extends AnyFn>(
    fn: T,
    wait = 0,
): Cancelable<(...args: Parameters<T>) => void> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let trailingArgs: Parameters<T> | undefined;

    const throttled = ((...args: Parameters<T>) => {
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
    }) as Cancelable<(...args: Parameters<T>) => void>;

    throttled.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
        trailingArgs = undefined;
    };

    return throttled;
}
