type AnyRecord = Record<string, unknown>;

export function isPlainObject(value: unknown): value is AnyRecord {
    if (value === null || typeof value !== "object") {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export function deepClone<T>(value: T): T {
    if (typeof structuredClone === "function") {
        return structuredClone(value);
    }
    if (Array.isArray(value)) {
        return value.map((v) => deepClone(v)) as T;
    }
    if (value instanceof Date) {
        return new Date(value.getTime()) as T;
    }
    if (isPlainObject(value)) {
        const cloned: AnyRecord = {};
        for (const [k, v] of Object.entries(value)) {
            cloned[k] = deepClone(v);
        }
        return cloned as T;
    }
    return value;
}

export function deepEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
        return true;
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i += 1) {
            if (!deepEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (const key of aKeys) {
            if (!Object.hasOwn(b, key)) {
                return false;
            }
            if (!deepEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function deepMerge<T, U>(target: T, source: U): T & U {
    const base =
        target === undefined || target === null
            ? ({} as AnyRecord)
            : (deepClone(target) as AnyRecord);
    if (source === undefined || source === null) {
        return base as T & U;
    }
    return mergeInto(base, source as unknown) as T & U;
}

function mergeInto(target: AnyRecord, source: unknown): AnyRecord {
    if (!isPlainObject(source)) {
        return deepClone(source) as AnyRecord;
    }

    for (const [key, sourceValue] of Object.entries(source)) {
        const targetValue = target[key];
        if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
            target[key] = mergeInto(
                deepClone(targetValue as AnyRecord),
                sourceValue,
            );
            continue;
        }
        target[key] = deepClone(sourceValue);
    }

    return target;
}
