/**
 * 高阶函数：为异步方法添加单例缓存。
 * @param fn 需要添加缓存的异步函数。
 * @returns 带有缓存逻辑的新函数。
 */
export function asyncSingleton<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
    // 每个被包装的函数都拥有自己的独立缓存
    const cache = new Map<string, Promise<TResult>>();

    // 返回一个新的函数，它将包含缓存逻辑
    return (...args: TArgs) => {
        // 使用参数的 JSON 字符串作为缓存键
        const key = JSON.stringify(args);

        // 如果缓存中存在，直接返回缓存的 Promise
        if (cache.has(key)) {
            return cache.get(key)!;
        }

        // 调用原始函数并获取 Promise
        const promise = fn(...args);

        // 将 Promise 存入缓存
        cache.set(key, promise);

        // 等待 Promise 完成（无论成功或失败），然后从缓存中清除
        promise.finally(() => {
            cache.delete(key);
        });

        // 返回原始 Promise
        return promise;
    };
}
