import * as Switch from "@radix-ui/react-switch";
import dayjs from "dayjs";
import type { EChartsOption } from "echarts";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/shallow";
import { StorageDeferredAPI } from "@/api/storage";
import type { AnalysisResult } from "@/api/storage/analysis";
import {
    BillFilterViewProvider,
    showBillFilterView,
} from "@/components/bill-filter";
import { showBillInfo } from "@/components/bill-info";
import { ChartWrapper } from "@/components/features/statistics/chart-wrapper";
import BillItem from "@/components/ledger/item";
import { showSortableList } from "@/components/sortable";
import { AnalysisCloud } from "@/components/stat/analysic-cloud";
import { AnalysisDetail } from "@/components/stat/analysis-detail";
import AnalysisMap from "@/components/stat/analysis-map";
import { useChartPart } from "@/components/stat/chart-part";
import { DateSliced, useDateSliced } from "@/components/stat/date-slice";
import {
    type FocusType,
    FocusTypeSelector,
    FocusTypes,
} from "@/components/stat/focus-type";
import { TagItem } from "@/components/stat/static-item";
import { Button } from "@/components/ui/button";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useCurrency } from "@/hooks/use-currency";
import {
    DefaultFilterViewId,
    useCustomFilters,
} from "@/hooks/use-custom-filters";
import { useTag } from "@/hooks/use-tag";
import type { BillFilter, BillFilterView } from "@/ledger/extra-type";
import type { Bill } from "@/ledger/type";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { cn } from "@/utils";

export default function Page() {
    const t = useIntl();
    const { id } = useParams();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );

    const { bills } = useLedgerStore();
    const bookLabel = currentBookName || "当前账本";
    const endTime = useMemo(() => Date.now(), []); //bills[0]?.time ?? dayjs();
    const startTime = bills[bills.length - 1]?.time ?? dayjs();

    const customFilters = useLedgerStore(
        useShallow((state) => state.infos?.meta.customFilters),
    );

    const allFilterViews = useMemo(() => {
        if (customFilters?.some((f) => f.id === DefaultFilterViewId)) {
            return customFilters;
        }
        return [
            {
                id: DefaultFilterViewId,
                filter: {},
                name: t("default-filter-name"),
            } as BillFilterView,
            ...(customFilters ?? []),
        ];
    }, [t, customFilters]);

    const [filterViewId, setFilterViewId] = useState(
        id ?? allFilterViews[0].id,
    );

    const selectedFilterView = allFilterViews.find(
        (v) => v.id === filterViewId,
    );
    const selectedFilter = selectedFilterView?.filter;

    const fullRange = [
        selectedFilter?.start ?? startTime,
        selectedFilter?.end ?? endTime,
    ] as [number, number];

    const {
        sliceRange,
        viewType,
        props: dateSlicedProps,
        setSliceId,
    } = useDateSliced({
        range: fullRange,
        selectCustomSliceWhenInitial: Boolean(id),
    });
    const realRange = useMemo(
        () => [
            sliceRange?.[0] ?? selectedFilter?.start ?? startTime,
            sliceRange?.[1] ?? selectedFilter?.end ?? endTime,
        ],
        [
            sliceRange,
            selectedFilter?.start,
            selectedFilter?.end,
            startTime,
            endTime,
        ],
    );

    const navigate = useNavigate();
    const seeDetails = (append?: Partial<BillFilter>) => {
        navigate("/search", {
            state: {
                filter: {
                    ...selectedFilter,
                    start: realRange[0],
                    end: realRange[1],
                    ...append,
                },
            },
        });
    };

    const [filtered, setFiltered] = useState<Bill[]>([]);

    useEffect(() => {
        const book = useBookStore.getState().currentBookId;
        if (!book) {
            return;
        }
        if (!selectedFilter) {
            return;
        }
        StorageDeferredAPI.filter(book, {
            ...selectedFilter,
            start: realRange[0],
            end: realRange[1],
        }).then((result) => {
            setFiltered(result);
        });
    }, [selectedFilter, realRange[0], realRange[1]]);

    const [focusType, setFocusType] = useState<FocusType>("expense");
    const [dimension, setDimension] = useState<"category" | "user">("category");

    const { dataSources, Part, setSelectedCategoryId } = useChartPart({
        viewType,
        seeDetails,
        focusType,
        filtered,
        dimension,
        displayCurrency: selectedFilterView?.displayCurrency,
    });

    const totalMoneys = FocusTypes.map((t) => dataSources.total[t]);
    const trendPreviewOption = useMemo<EChartsOption>(() => {
        const dailyMap = new Map<
            string,
            { income: number; expense: number; net: number }
        >();

        filtered.forEach((bill) => {
            const key = dayjs.unix(bill.time / 1000).format("MM-DD");
            const item = dailyMap.get(key) || { income: 0, expense: 0, net: 0 };
            if (bill.type === "income") {
                item.income += bill.amount;
                item.net += bill.amount;
            } else {
                item.expense += bill.amount;
                item.net -= bill.amount;
            }
            dailyMap.set(key, item);
        });

        const labels = Array.from(dailyMap.keys());
        return {
            grid: {
                left: 8,
                right: 8,
                top: 30,
                bottom: 18,
                containLabel: true,
            },
            legend: {
                data: ["收入", "支出", "净收益"],
            },
            xAxis: {
                type: "category" as const,
                data: labels,
            },
            yAxis: {
                type: "value" as const,
            },
            dataZoom: [
                {
                    type: "inside",
                },
            ],
            series: [
                {
                    name: "收入",
                    type: "line",
                    smooth: true,
                    data: labels.map(
                        (label) => dailyMap.get(label)?.income ?? 0,
                    ),
                },
                {
                    name: "支出",
                    type: "line",
                    smooth: true,
                    data: labels.map(
                        (label) => dailyMap.get(label)?.expense ?? 0,
                    ),
                },
                {
                    name: "净收益",
                    type: "line",
                    smooth: true,
                    data: labels.map((label) => dailyMap.get(label)?.net ?? 0),
                },
            ],
        };
    }, [filtered]);

    const { tags } = useTag();
    const tagStructure = useMemo(
        () =>
            Array.from(dataSources.tagStructure.entries())
                .map(([tagId, struct]) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) {
                        return undefined;
                    }
                    return {
                        ...tag,
                        ...struct,
                    };
                })
                .filter((v) => v !== undefined),
        [dataSources.tagStructure, tags],
    );

    const { incomes: filteredIncomeBills, expenses: filteredExpenseBills } =
        useMemo(() => {
            const incomes: Bill[] = [];
            const expenses: Bill[] = [];
            filtered.forEach((v) => {
                if (v.type === "expense") {
                    expenses.push(v);
                } else {
                    incomes.push(v);
                }
            });
            return {
                incomes,
                expenses,
            };
        }, [filtered]);
    const [analysis, setAnalysis] = useState<AnalysisResult>();
    const analysisUnit =
        viewType === "yearly"
            ? "year"
            : viewType === "monthly"
              ? "month"
              : viewType === "weekly"
                ? "week"
                : "day";
    useEffect(() => {
        const book = useBookStore.getState().currentBookId;
        if (!book || !realRange[0] || !realRange[1]) {
            setAnalysis(undefined);
            return;
        }
        if (!analysisUnit) {
            setAnalysis(undefined);
            return;
        }
        StorageDeferredAPI.analysis(
            book,
            [realRange[0], realRange[1]],
            analysisUnit,
            focusType,
        ).then((v) => {
            setAnalysis(v);
        });
    }, [analysisUnit, focusType, realRange[0], realRange[1]]);

    const { updateFilter, addFilter } = useCustomFilters();
    const toChangeFilter = async () => {
        if (!selectedFilterView) {
            return;
        }
        const id = selectedFilterView.id;
        const action = await showBillFilterView({
            ...selectedFilterView,
            // hideDelete: id === DefaultFilterViewId,
        });
        if (action === "delete") {
            await updateFilter(id);
            setFilterViewId(allFilterViews[0].id);
            return;
        }
        if (!action) {
            return;
        }
        await updateFilter(id, {
            ...action,
            name: action.name ?? selectedFilterView.name,
        });
    };
    const toReOrder = async () => {
        if ((customFilters?.length ?? 0) === 0) {
            return;
        }
        const ordered = await showSortableList(customFilters);
        useLedgerStore.getState().updateGlobalMeta((prev) => {
            prev.customFilters = ordered
                .map((v) => prev.customFilters?.find((c) => c.id === v.id))
                .filter((v) => v !== undefined);
            return prev;
        });
    };
    const toAddFilter = async () => {
        const newFilter = await showBillFilterView({
            name: t("new-filter-name"),
            filter: {},
            hideDelete: true,
        });
        if (!newFilter || newFilter === "delete" || !newFilter.name) {
            return;
        }
        const id = await addFilter(newFilter.name, {
            filter: newFilter.filter,
            displayCurrency: newFilter.displayCurrency,
        });
        if (!id) {
            return;
        }
        setSliceId(undefined);
        setFilterViewId(id);
    };

    const { allCurrencies, baseCurrency } = useCurrency();

    return (
        <WeddingPageShell className="page-show" contentClassName="desktop-grid">
            <WeddingTopBar
                title="统计分析"
                subtitle={`${bookLabel}支出与收入结构总览`}
            />
            <div className="w-full flex flex-col gap-4">
                <div className="rounded-[28px] bg-[linear-gradient(135deg,#fbbcdf,#ddb6f7)] p-4 text-[#3b0d29] shadow-[0_18px_36px_-28px_rgba(244,114,182,0.45)] dark:bg-[linear-gradient(135deg,#3d1030,#1e0d30)] dark:text-white">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium opacity-80">
                                统计分析
                            </div>
                            <div className="mt-1 text-[28px] font-bold leading-none">
                                {filtered.length}
                            </div>
                            <div className="mt-1 text-xs opacity-75">
                                当前筛选范围内账单数
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="rounded-2xl bg-white/40 px-3 py-2 dark:bg-white/10">
                                <div className="text-[10px] opacity-75">
                                    维度
                                </div>
                                <div className="text-sm font-semibold">
                                    {dimension === "category" ? "分类" : "成员"}
                                </div>
                            </div>
                            <div className="rounded-2xl bg-white/40 px-3 py-2 dark:bg-white/10">
                                <div className="text-[10px] opacity-75">
                                    焦点
                                </div>
                                <div className="text-sm font-semibold">
                                    {focusType === "expense"
                                        ? "支出"
                                        : focusType === "income"
                                          ? "收入"
                                          : "结余"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="wedding-surface-card flex p-2">
                        <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hidden">
                            {allFilterViews.map((filter) => {
                                const displayCurrency =
                                    filter.displayCurrency === baseCurrency.id
                                        ? undefined
                                        : allCurrencies.find(
                                              (v) =>
                                                  v.id ===
                                                  filter.displayCurrency,
                                          );
                                return (
                                    <Button
                                        key={filter.id}
                                        size={"sm"}
                                        className={cn(
                                            "rounded-[12px]",
                                            filterViewId !== filter.id
                                                ? "text-[color:var(--wedding-text-soft)]"
                                                : "bg-pink-500/12 text-pink-500",
                                        )}
                                        variant="ghost"
                                        onClick={() => {
                                            setSliceId(undefined);
                                            setFilterViewId(filter.id);
                                        }}
                                    >
                                        {displayCurrency?.symbol}
                                        {filter.name}
                                    </Button>
                                );
                            })}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                className="rounded-[12px]"
                                onClick={toAddFilter}
                                size="sm"
                            >
                                <i className="icon-[mdi--plus] size-4"></i>
                            </Button>
                            <Button
                                variant="ghost"
                                className="rounded-[12px]"
                                onClick={toReOrder}
                                size="sm"
                            >
                                <i className="icon-[mdi--menu] size-4"></i>
                            </Button>
                        </div>
                    </div>
                    <DateSliced
                        {...dateSlicedProps}
                        onClickSettings={toChangeFilter}
                    >
                        <div className="relative flex items-center pr-2">
                            <Switch.Root
                                checked={dimension === "user"}
                                onCheckedChange={() => {
                                    setDimension((v) => {
                                        return v === "category"
                                            ? "user"
                                            : "category";
                                    });
                                }}
                                className="group relative z-[0] h-[29px] w-[54px] cursor-pointer rounded-sm bg-pink-100 outline-none dark:bg-white/10"
                            >
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center gap-2 z-[1]">
                                    <i className="icon-[mdi--view-grid-outline] group-[data-[state=checked]]:text-white"></i>
                                    <i className="icon-[mdi--account-outline]"></i>
                                </div>
                                <Switch.Thumb className="block size-[22px] translate-x-[4px] rounded-sm bg-background transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[28px]" />
                            </Switch.Root>
                        </div>
                    </DateSliced>
                </div>
                <FocusTypeSelector
                    value={focusType}
                    onValueChange={(v) => {
                        setFocusType(v);
                        setSelectedCategoryId(undefined);
                    }}
                    money={totalMoneys}
                />
                <div className="grid gap-3 md:grid-cols-3">
                    {[
                        ["总支出", totalMoneys[1], "text-rose-500"],
                        ["总收入", totalMoneys[0], "text-emerald-500"],
                        ["当前结余", totalMoneys[2], "text-violet-500"],
                    ].map(([label, value, tone]) => (
                        <div
                            key={label}
                            className="wedding-surface-card rounded-[24px] p-5 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)]"
                        >
                            <div className="text-xs wedding-muted">{label}</div>
                            <div
                                className={cn(
                                    "mt-2 text-[34px] font-black tracking-tight",
                                    tone,
                                )}
                            >
                                ¥ {Number(value).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full flex-1 overflow-y-auto px-1">
                <div className="relative flex w-full flex-col items-center gap-4">
                    <ChartWrapper
                        title="收支趋势预览"
                        description="按当前筛选范围聚合展示收入、支出与净收益走势。"
                        option={trendPreviewOption}
                        isLoading={false}
                        isEmpty={filtered.length === 0}
                    />
                    {Part}
                    {tagStructure.length > 0 && (
                        <div className="wedding-surface-card w-full rounded-[24px] p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)] flex flex-col">
                            <h2 className="my-3 text-center text-lg font-medium text-pink-500">
                                {t("tag-details")}
                            </h2>
                            <div className="table w-full border-collapse">
                                <div className="table-row-group divide-y">
                                    {tagStructure.map((struct) => {
                                        const index =
                                            FocusTypes.indexOf(focusType);
                                        const money = [
                                            struct.income,
                                            struct.expense,
                                            struct.income - struct.expense,
                                        ][index];
                                        const total = totalMoneys[index];
                                        return (
                                            <TagItem
                                                key={struct.id}
                                                name={struct.name}
                                                money={money}
                                                total={total}
                                                type={focusType}
                                                onClick={() => {
                                                    seeDetails({
                                                        tags: [struct.id],
                                                    });
                                                }}
                                            ></TagItem>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <AnalysisCloud
                        bills={
                            focusType === "expense"
                                ? filteredExpenseBills
                                : focusType === "income"
                                  ? filteredIncomeBills
                                  : filtered
                        }
                    />
                    <AnalysisMap
                        bills={
                            focusType === "expense"
                                ? filteredExpenseBills
                                : focusType === "income"
                                  ? filteredIncomeBills
                                  : filtered
                        }
                    />
                    {analysis && (
                        <div className="wedding-surface-card w-full rounded-[24px] p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)] flex flex-col">
                            <h2 className="my-3 text-center text-lg font-medium text-pink-500">
                                {t("analysis")}
                            </h2>
                            <AnalysisDetail
                                analysis={analysis}
                                type={focusType}
                                unit={analysisUnit}
                            />
                        </div>
                    )}
                    <div className="w-full flex flex-col gap-4">
                        {dataSources.highestExpenseBill && (
                            <div className="wedding-surface-card rounded-[24px] p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)]">
                                <div className="mb-3 text-sm font-semibold text-rose-500">
                                    {t("highest-expense")}
                                </div>
                                <BillItem
                                    className="w-full"
                                    bill={dataSources.highestExpenseBill}
                                    showTime
                                    onClick={() =>
                                        showBillInfo(
                                            dataSources.highestExpenseBill ??
                                                undefined,
                                        )
                                    }
                                />
                            </div>
                        )}
                        {dataSources.highestIncomeBill && (
                            <div className="wedding-surface-card rounded-[24px] p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)]">
                                <div className="mb-3 text-sm font-semibold text-emerald-500">
                                    {t("highest-income")}
                                </div>
                                <BillItem
                                    className="w-full"
                                    bill={dataSources.highestIncomeBill}
                                    showTime
                                    onClick={() =>
                                        showBillInfo(
                                            dataSources.highestIncomeBill ??
                                                undefined,
                                        )
                                    }
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => seeDetails()}
                            className="text-pink-500 hover:bg-pink-500/10"
                        >
                            {t("see-all-ledgers")}
                            <i className="icon-[mdi--arrow-up-right]"></i>
                        </Button>
                    </div>
                    <div className="w-full h-20 flex-shrink-0"></div>
                </div>
            </div>
            <BillFilterViewProvider />
        </WeddingPageShell>
    );
}
