import {
    forwardRef,
    type ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { cn } from "@/utils";

type UseSnapResult = {
    count: number;
    index: number;
    scrollTo: (i: number, behavior?: ScrollBehavior) => void;
    isHorizontal: boolean | undefined;
};

type SnapContainerElement = HTMLDivElement & {
    onscrollend?: ((this: GlobalEventHandlers, ev: Event) => void) | null;
    __useSnap_onScroll?: EventListener;
};

/**
 * useSnap
 * - containerRef: 支持 scroll-snap 的容器 ref
 * - initialIndex: 初始化应该滚动到的索引
 * - debounceMs: 回退到 debounce 的等待毫秒（用于不支持 scrollend 的浏览器）
 * - initialWaitMs: 等待子元素第一次变动的超时回退（ms）。设为 0 表示不使用回退（可能永远不滚动）
 */
export function useSnap(
    containerRef: React.RefObject<HTMLElement | null | undefined>,
    initialIndex = 0,
    debounceMs = 120,
    initialWaitMs = 1000,
): UseSnapResult {
    const [count, setCount] = useState(0);
    const [index, setIndex] = useState(() =>
        Math.max(0, Math.floor(initialIndex)),
    );
    const isHorizontalRef = useRef<boolean | undefined>(undefined);

    const mutationRef = useRef<MutationObserver | null>(null);
    const debounceTimer = useRef<number | null>(null);
    const initialTimer = useRef<number | null>(null);
    const initialScrollDoneRef = useRef(false);
    const latestIndexRef = useRef<number>(index);
    latestIndexRef.current = index;

    const getChildren = useCallback(() => {
        const el = containerRef.current;
        if (!el) return [] as HTMLElement[];
        return Array.from(el.children).filter(
            (n): n is HTMLElement => n instanceof HTMLElement,
        );
    }, [containerRef]);

    const detectOrientation = useCallback(() => {
        const el = containerRef.current;
        if (!el) return undefined;
        const horizontal = el.scrollWidth > el.clientWidth;
        isHorizontalRef.current = horizontal;
        return horizontal;
    }, [containerRef]);

    const computeIndexByCenter = useCallback(() => {
        const el = containerRef.current;
        if (!el) return null;
        const children = getChildren();
        if (children.length === 0) return null;

        const horizontal = detectOrientation();
        let bestIdx = 0;
        let bestDist = Infinity;

        if (horizontal) {
            const center = el.scrollLeft + el.clientWidth / 2;
            children.forEach((c, i) => {
                const cCenter = c.offsetLeft + c.clientWidth / 2;
                const d = Math.abs(cCenter - center);
                if (d < bestDist) {
                    bestDist = d;
                    bestIdx = i;
                }
            });
        } else {
            const center = el.scrollTop + el.clientHeight / 2;
            children.forEach((c, i) => {
                const cCenter = c.offsetTop + c.clientHeight / 2;
                const d = Math.abs(cCenter - center);
                if (d < bestDist) {
                    bestDist = d;
                    bestIdx = i;
                }
            });
        }

        return Math.max(0, Math.min(children.length - 1, bestIdx));
    }, [containerRef, getChildren, detectOrientation]);

    const onScrollEndCompute = useCallback(() => {
        const newIndex = computeIndexByCenter();
        if (newIndex === null) return;
        if (newIndex !== latestIndexRef.current) {
            latestIndexRef.current = newIndex;
            setIndex(newIndex);
        }
    }, [computeIndexByCenter]);

    const scrollTo = useCallback(
        (i: number, behavior: ScrollBehavior = "smooth") => {
            const children = getChildren();
            const container = containerRef.current;
            if (children.length === 0 || !container) return;
            const clamped = Math.max(
                0,
                Math.min(children.length - 1, Math.floor(i)),
            );
            const target = children[clamped];
            if (!target) return;

            const horizontal = detectOrientation();
            const left = Math.max(
                0,
                target.offsetLeft -
                    Math.max(
                        0,
                        (container.clientWidth - target.clientWidth) / 2,
                    ),
            );
            const top = Math.max(
                0,
                target.offsetTop -
                    Math.max(
                        0,
                        (container.clientHeight - target.clientHeight) / 2,
                    ),
            );

            container.scrollTo({
                left: horizontal ? left : container.scrollLeft,
                top: horizontal ? container.scrollTop : top,
                behavior,
            });
        },
        [containerRef, detectOrientation, getChildren],
    );

    const syncIndexImmediately = useCallback((clamped: number) => {
        latestIndexRef.current = clamped;
        setIndex(clamped);
    }, []);

    const scrollToIndex = useCallback(
        (i: number, behavior: ScrollBehavior = "smooth") => {
            const children = getChildren();
            if (children.length === 0) return;
            const clamped = Math.max(
                0,
                Math.min(children.length - 1, Math.floor(i)),
            );
            scrollTo(clamped, behavior);

            if (behavior === "auto") {
                syncIndexImmediately(clamped);
            }
        },
        [getChildren, scrollTo, syncIndexImmediately],
    );

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const snapEl = el as SnapContainerElement;

        // 初始 count & orientation
        detectOrientation();
        const children = getChildren();
        setCount(children.length);

        // ---- 初始滚动逻辑：等待“子元素第一次变动”后再滚动 ----
        // 标准流程：当 MutationObserver 首次观察到 childList 变动且 initialScroll 尚未执行时进行滚动
        // 为了避免永远等待，提供一个可配置的回退超时 initialWaitMs（设为 0 表示关闭超时回退）
        initialScrollDoneRef.current = false;

        const doInitialScrollIfNeeded = () => {
            if (initialScrollDoneRef.current) return;
            const ch = getChildren();
            if (ch.length === 0) {
                // 没有子元素则不滚，但我们仍视为已尝试过（避免重复）
                initialScrollDoneRef.current = true;
                return;
            }
            // clamp
            const clampedInitial = Math.max(
                0,
                Math.min(ch.length - 1, Math.floor(initialIndex)),
            );
            // 在下一帧确保布局稳定后滚动（使用 auto 确保准确）
            requestAnimationFrame(() => {
                scrollToIndex(clampedInitial, "auto");
                initialScrollDoneRef.current = true;
            });
        };

        // MutationObserver: 监听子元素变化 -> 首次变动时触发初始滚动（并持续更新 count）
        if ("MutationObserver" in window) {
            mutationRef.current = new MutationObserver((mutations) => {
                // 有子节点添加/删除时认为发生了“第一次变动”
                const childChange = mutations.some(
                    (m) =>
                        m.type === "childList" &&
                        (m.addedNodes.length > 0 || m.removedNodes.length > 0),
                );
                const ch = getChildren();
                setCount(ch.length);

                if (!initialScrollDoneRef.current && childChange) {
                    doInitialScrollIfNeeded();
                }
            });
            mutationRef.current.observe(el, {
                childList: true,
                subtree: false,
            });
        }

        // 超时回退：如果在 initialWaitMs 内没有检测到变动，仍然做一次初始滚动（初始等待可配置）
        if (initialWaitMs > 0) {
            // only set timeout if initialScroll not done yet
            initialTimer.current = window.setTimeout(() => {
                if (!initialScrollDoneRef.current) {
                    doInitialScrollIfNeeded();
                }
                initialTimer.current = null;
            }, initialWaitMs);
        }

        // ---- 滚动结束计算 index：优先 scrollend，否则 debounce onscroll ----
        let supportsScrollEnd = false;
        try {
            supportsScrollEnd = typeof snapEl.onscrollend !== "undefined";
        } catch {
            supportsScrollEnd = false;
        }

        const handleScrollEnd = () => {
            if (debounceTimer.current) {
                window.clearTimeout(debounceTimer.current);
                debounceTimer.current = null;
            }
            onScrollEndCompute();
        };

        if (supportsScrollEnd) {
            (el as HTMLElement).addEventListener(
                "scrollend",
                handleScrollEnd as EventListener,
                { passive: true },
            );
        } else {
            const onScroll = () => {
                if (debounceTimer.current) {
                    window.clearTimeout(debounceTimer.current);
                }
                debounceTimer.current = window.setTimeout(() => {
                    debounceTimer.current = null;
                    onScrollEndCompute();
                }, debounceMs);
            };
            el.addEventListener("scroll", onScroll, { passive: true });
            snapEl.__useSnap_onScroll = onScroll;
        }

        // cleanup
        return () => {
            if (mutationRef.current) {
                mutationRef.current.disconnect();
                mutationRef.current = null;
            }
            if (initialTimer.current) {
                window.clearTimeout(initialTimer.current);
                initialTimer.current = null;
            }
            if (debounceTimer.current) {
                window.clearTimeout(debounceTimer.current);
                debounceTimer.current = null;
            }

            if (supportsScrollEnd) {
                try {
                    snapEl.removeEventListener(
                        "scrollend",
                        handleScrollEnd as EventListener,
                    );
                } catch {
                    /* noop */
                }
            } else {
                const stored = snapEl.__useSnap_onScroll;
                if (stored) {
                    el.removeEventListener("scroll", stored);
                    delete snapEl.__useSnap_onScroll;
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        containerRef,
        initialIndex,
        scrollToIndex,
        detectOrientation,
        getChildren,
        debounceMs,
        initialWaitMs,
        onScrollEndCompute,
    ]);

    // 保证当 containerRef 变更时更新 count
    useEffect(() => {
        const ch = getChildren();
        setCount(ch.length);
    }, [getChildren]);

    return {
        count,
        index,
        scrollTo: scrollToIndex,
        isHorizontal: isHorizontalRef.current,
    };
}

type SnapDivProps = {
    className?: string;
    children?: ReactNode;
    onActiveIndexChange?: (activeIndex: number) => void;
    initialIndex?: number;
};

export type SnapDivInstance = {
    el: HTMLDivElement | null;
    scrollTo: (i: number, behavior?: ScrollBehavior | undefined) => void;
};

export const SnapDiv = forwardRef<SnapDivInstance, SnapDivProps>(
    function useSnapDiv(
        {
            className,
            children,
            initialIndex,
            onActiveIndexChange,
        }: SnapDivProps,
        ref,
    ) {
        const divRef = useRef<HTMLDivElement | null>(null);
        const { index, scrollTo } = useSnap(divRef, initialIndex, 10, 10);
        useImperativeHandle(ref, () => ({ el: divRef.current, scrollTo }));

        const prevIndexRef = useRef(index);

        const onActiveIndexChangeRef = useRef(onActiveIndexChange);
        onActiveIndexChangeRef.current = onActiveIndexChange;
        useEffect(() => {
            if (prevIndexRef.current !== index) {
                onActiveIndexChangeRef.current?.(index);
                prevIndexRef.current = index;
            }
        }, [index]);

        return (
            <div ref={divRef} className={cn(className)}>
                {children}
            </div>
        );
    },
);
