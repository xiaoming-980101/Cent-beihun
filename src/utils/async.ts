export const asyncOnce = <TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
): ((...args: TArgs) => Promise<TResult>) => {
    let lastPromise: Promise<unknown> = Promise.resolve();

    const wrapped = (...args: TArgs): Promise<TResult> => {
        // 链接到前一次的 promise，等待其完成或拒绝，然后执行当前调用
        lastPromise = lastPromise
            .catch(() => {}) // 让链保持继续，即使之前发生错误也不会中断队列
            .then(() => fn(...args));
        return lastPromise as Promise<TResult>;
    };

    return wrapped;
};

export const sleep = (ms: number) =>
    new Promise<void>((res) => {
        setTimeout(() => {
            res();
        }, ms);
    });
