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
    const endTime = useMemo(() => Date.now(), []);
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
        if (!book || !selectedFilter) {
            return;
        }
        StorageDeferredAPI.filter(book, {
            ...selectedFilter,
            start: realRange[0],
            end: realRange[1],
        }).then((result) => {
            setFiltered(result);
        });
    }, [selectedFilter, realRange]);

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
        StorageDeferredAPI.analysis(
            book,
            [realRange[0], realRange[1]],
            analysisUnit,
            focusType,
        ).then((v) => {
            setAnalysis(v);
        });
    }, [analysisUnit, focusType, realRange]);

    const { updateFilter, addFilter } = useCustomFilters();
    const toChangeFilter = async () => {
        if (!selectedFilterView) {
            return;
        }
        const id = selectedFilterView.id;
        const action = await showBillFilterView({
            ...selectedFilterView,
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
        <WeddingPageShell className="bg-[color:var(--wedding-app-bg)]" contentClassName="pb-32 px-4">
            <WeddingTopBar
                title={t("analysis")}
                subtitle={`${bookLabel}收支结构概览`}
                backTo="/"
            />
            
            <div className="flex flex-col gap-6 mt-6">
                {/* 顶部总览卡片 - Apple 风格的高级感 */}
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f05cab] via-[#d64dc8] to-[#9333ea] p-7 text-white shadow-2xl shadow-purple-500/20">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium opacity-80 uppercase tracking-widest">{t("summary")}</span>
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <i className="icon-[mdi--chart-line] size-4"></i>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter">
                                ¥{Number(totalMoneys[focusType === "expense" ? 1 : 0]).toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-1 text-sm font-medium opacity-70">
                            {focusType === "expense" ? "总支出金额" : focusType === "income" ? "总收入金额" : "当前结余金额"}
                        </div>
                        
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                                <div className="text-[10px] uppercase tracking-wider opacity-60">记录总数</div>
                                <div className="mt-1 text-lg font-bold">{filtered.length}</div>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                                <div className="text-[10px] uppercase tracking-wider opacity-60">筛选维度</div>
                                <div className="mt-1 text-lg font-bold">{dimension === "category" ? "分类" : "成员"}</div>
                            </div>
                        </div>
                    </div>
                    {/* 背景装饰 */}
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
                </div>

                {/* 筛选控制器 */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-[color:var(--wedding-text)]">数据筛选</h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toAddFilter}>
                                <i className="icon-[mdi--plus] size-4"></i>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toReOrder}>
                                <i className="icon-[mdi--sort-variant] size-4"></i>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="wedding-surface-card flex items-center gap-2 overflow-x-auto p-1.5 scrollbar-hidden">
                        {allFilterViews.map((filter) => {
                            const isActive = filterViewId === filter.id;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => {
                                        setSliceId(undefined);
                                        setFilterViewId(filter.id);
                                    }}
                                    className={cn(
                                        "flex h-9 min-w-fit items-center rounded-full px-4 text-sm font-medium transition-all whitespace-nowrap",
                                        isActive
                                            ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                                            : "text-[color:var(--wedding-text-soft)] hover:bg-[color:var(--wedding-surface-muted)]"
                                    )}
                                >
                                    {filter.name}
                                </button>
                            );
                        })}
                    </div>

                    <DateSliced {...dateSlicedProps} onClickSettings={toChangeFilter}>
                        <div className="flex items-center pr-1">
                            <button
                                onClick={() => setDimension(d => d === "category" ? "user" : "category")}
                                className={cn(
                                    "flex h-8 w-14 items-center rounded-full bg-[color:var(--wedding-surface-muted)] p-1 transition-all",
                                    dimension === "user" ? "bg-purple-100 dark:bg-purple-900/30" : ""
                                )}
                            >
                                <div className={cn(
                                    "h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center transition-all",
                                    dimension === "user" ? "translate-x-6" : ""
                                )}>
                                    <i className={cn(
                                        "size-3.5",
                                        dimension === "category" ? "icon-[mdi--format-list-bulleted] text-pink-500" : "icon-[mdi--account] text-purple-500"
                                    )}></i>
                                </div>
                            </button>
                        </div>
                    </DateSliced>
                </div>

                {/* 焦点选择器 */}
                <FocusTypeSelector
                    value={focusType}
                    onValueChange={(v) => {
                        setFocusType(v);
                        setSelectedCategoryId(undefined);
                    }}
                    money={totalMoneys}
                />

                {/* 三大核心指标 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        { label: "支出总计", value: totalMoneys[1], color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
                        { label: "收入总计", value: totalMoneys[0], color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                        { label: "收支净额", value: totalMoneys[2], color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
                    ].map((item) => (
                        <div key={item.label} className="wedding-surface-card rounded-[28px] p-5">
                            <div className="text-xs font-semibold uppercase tracking-wider opacity-50">{item.label}</div>
                            <div className={cn("mt-3 text-[28px] font-black tracking-tight", item.color)}>
                                ¥{Number(item.value).toLocaleString()}
                            </div>
                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                                <div className={cn("h-full rounded-full opacity-60", item.bg.replace('bg-', 'bg-').split(' ')[0])} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 趋势图表 */}
                <div className="wedding-surface-card overflow-hidden rounded-[32px] p-0 shadow-sm">
                    <ChartWrapper
                        title="资金走势"
                        description="基于当前筛选范围的收支走势分析"
                        option={trendPreviewOption}
                        isLoading={false}
                        isEmpty={filtered.length === 0}
                    />
                </div>

                {/* 主体分析部分 */}
                <div className="space-y-6">
                    {Part}
                    
                    {tagStructure.length > 0 && (
                        <div className="wedding-surface-card rounded-[32px] p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold text-[color:var(--wedding-text)]">{t("tag-details")}</h2>
                            <div className="space-y-4">
                                {tagStructure.map((struct) => {
                                    const index = FocusTypes.indexOf(focusType);
                                    const money = [struct.income, struct.expense, struct.income - struct.expense][index];
                                    return (
                                        <TagItem
                                            key={struct.id}
                                            name={struct.name}
                                            money={money}
                                            total={totalMoneys[index]}
                                            type={focusType}
                                            onClick={() => seeDetails({ tags: [struct.id] })}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="wedding-surface-card rounded-[32px] p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold text-[color:var(--wedding-text)]">标签云图</h2>
                            <AnalysisCloud bills={focusType === "expense" ? filteredExpenseBills : focusType === "income" ? filteredIncomeBills : filtered} />
                        </div>
                        <div className="wedding-surface-card rounded-[32px] p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold text-[color:var(--wedding-text)]">地域分布</h2>
                            <AnalysisMap bills={focusType === "expense" ? filteredExpenseBills : focusType === "income" ? filteredIncomeBills : filtered} />
                        </div>
                    </div>

                    {analysis && (
                        <div className="wedding-surface-card rounded-[32px] p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold text-[color:var(--wedding-text)]">{t("analysis")}</h2>
                            <AnalysisDetail analysis={analysis} type={focusType} unit={analysisUnit} />
                        </div>
                    )}

                    {/* 最高额记录 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {dataSources.highestExpenseBill && (
                            <div className="wedding-surface-card overflow-hidden rounded-[32px] p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-rose-500">{t("highest-expense")}</span>
                                    <i className="icon-[mdi--arrow-down-thick] text-rose-500"></i>
                                </div>
                                <BillItem
                                    className="p-0 border-none bg-transparent"
                                    bill={dataSources.highestExpenseBill}
                                    showTime
                                    onClick={() => showBillInfo(dataSources.highestExpenseBill ?? undefined)}
                                />
                            </div>
                        )}
                        {dataSources.highestIncomeBill && (
                            <div className="wedding-surface-card overflow-hidden rounded-[32px] p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-emerald-500">{t("highest-income")}</span>
                                    <i className="icon-[mdi--arrow-up-thick] text-emerald-500"></i>
                                </div>
                                <BillItem
                                    className="p-0 border-none bg-transparent"
                                    bill={dataSources.highestIncomeBill}
                                    showTime
                                    onClick={() => showBillInfo(dataSources.highestIncomeBill ?? undefined)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => seeDetails()}
                        className="rounded-full px-8 py-6 text-pink-500 hover:bg-pink-500/5 font-bold"
                    >
                        {t("see-all-ledgers")}
                        <i className="icon-[mdi--arrow-right] ml-2"></i>
                    </Button>
                </div>
            </div>
            <BillFilterViewProvider />
        </WeddingPageShell>
    );
}
