import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import Chart, { type ECOption } from "@/components/chart";
import { EmptyState } from "@/components/shared";
import { cn } from "@/utils";

export interface ChartWrapperProps {
    option: EChartsOption;
    isLoading?: boolean;
    isEmpty?: boolean;
    title?: string;
    description?: string;
    className?: string;
    heightClassName?: string;
}

export function ChartWrapper({
    option,
    isLoading = false,
    isEmpty = false,
    title,
    description,
    className,
    heightClassName = "h-[320px]",
}: ChartWrapperProps) {
    const themedOption = useMemo<EChartsOption>(() => {
        const isDark = document.documentElement.classList.contains("dark");
        return {
            textStyle: {
                color: isDark ? "#d1d5db" : "#4b5563",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "line",
                },
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                borderColor: isDark ? "#374151" : "#e5e7eb",
                textStyle: {
                    color: isDark ? "#f3f4f6" : "#111827",
                },
            },
            legend: {
                textStyle: {
                    color: isDark ? "#d1d5db" : "#4b5563",
                },
            },
            ...option,
        };
    }, [option]);

    return (
        <section className={cn("wedding-surface-card rounded-[24px] p-4", className)}>
            {title ? (
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[color:var(--wedding-text)]">
                        {title}
                    </h3>
                    {description ? (
                        <p className="mt-1 text-xs text-[color:var(--wedding-text-mute)]">
                            {description}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div className={cn("w-full", heightClassName)}>
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm wedding-muted">
                        图表加载中...
                    </div>
                ) : null}
                {!isLoading && isEmpty ? (
                    <EmptyState
                        title="暂无图表数据"
                        description="调整筛选条件后可查看趋势变化。"
                    />
                ) : null}
                {!isLoading && !isEmpty ? (
                    <Chart className="h-full w-full" option={themedOption as ECOption} />
                ) : null}
            </div>
        </section>
    );
}
