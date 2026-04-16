import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChartWrapper } from "../chart-wrapper";

vi.mock("@/components/chart", () => ({
    default: ({ className }: { className?: string }) => (
        <div data-testid="chart" className={className}>
            mock chart
        </div>
    ),
}));

describe("ChartWrapper", () => {
    it("renders loading state", () => {
        render(
            <ChartWrapper
                option={{}}
                title="测试图表"
                isLoading
                isEmpty={false}
            />,
        );

        expect(screen.getByText("图表加载中...")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        render(
            <ChartWrapper
                option={{}}
                title="测试图表"
                isLoading={false}
                isEmpty
            />,
        );

        expect(screen.getByText("暂无图表数据")).toBeInTheDocument();
    });

    it("renders chart when data is available", () => {
        render(
            <ChartWrapper
                option={{ xAxis: { type: "category", data: ["A"] } }}
                title="测试图表"
                isLoading={false}
                isEmpty={false}
            />,
        );

        expect(screen.getByTestId("chart")).toBeInTheDocument();
    });
});
