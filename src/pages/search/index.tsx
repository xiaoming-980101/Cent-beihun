import { orderBy } from "lodash-es";
import { Collapsible } from "radix-ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { StorageDeferredAPI } from "@/api/storage";
import BillFilterForm from "@/components/bill-filter";
import Clearable from "@/components/clearable";
import { HintTooltip } from "@/components/hint";
import Ledger from "@/components/ledger";
import {
    type BatchEditOptions,
    BatchEditProvider,
    showBatchEdit,
} from "@/components/ledger/batch-edit";
import { prompt } from "@/components/ui/dialog/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    WeddingPageShell,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { EmptyState } from "@/components/shared";
import useCategory from "@/hooks/use-category";
import { useCurrency } from "@/hooks/use-currency";
import { useCustomFilters } from "@/hooks/use-custom-filters";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import type { Bill, BillFilter } from "@/ledger/type";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { usePreferenceStore } from "@/store/preference";
import { cn } from "@/utils";

const SORTS = [
    // 最近的在最上面
    {
        by: "time",
        order: "desc",
        icon: "icon-[mdi--sort-clock-ascending-outline]",
        label: "newest",
    },
    // 最早的在最上面
    {
        by: "time",
        order: "asc",
        icon: "icon-[mdi--sort-clock-descending-outline]",
        label: "oldest",
    },
    // 数额最大的在最上面
    {
        by: "amount",
        order: "desc",
        icon: "icon-[mdi--sort-descending]",
        label: "highest-amount",
    },
    // 数额最小的在最上面
    {
        by: "amount",
        order: "asc",
        icon: "icon-[mdi--sort-ascending]",
        label: "lowest-amount",
    },
] as const;

export default function Page() {
    const t = useIntl();

    const { baseCurrency } = useCurrency();
    const { categories } = useCategory();
    const { state } = useLocation();
    const [form, setForm] = useState<BillFilter>(() => {
        const filter = state?.filter as BillFilter;
        if (filter) {
            return {
                baseCurrency: baseCurrency.id,
                ...filter,
                // 如果传入的参数只有父级分类，则需要同时选择子级分类
                categories: categories
                    .filter((c) =>
                        filter.categories?.some(
                            (v) => v === c.id || v === c.parent,
                        ),
                    )
                    .map((c) => c.id),
            };
        }
        return {};
    });
    const [filterOpen, setFilterOpen] = useState(false);
    const debouncedComment = useDebouncedSearch(form.comment ?? "", 300);

    const toReset = useCallback(() => {
        setForm({});
    }, []);

    const showAssets = usePreferenceStore(
        useShallow((state) => state.showAssetsInLedger),
    );

    const [list, setList] = useState<Bill[]>([]);
    const [searched, setSearched] = useState(false);
    const toSearch = useCallback(async () => {
        const book = useBookStore.getState().currentBookId;
        if (!book) {
            return;
        }
        setEnableSelect(false);
        setSelectedIds([]);
        const result = await StorageDeferredAPI.filter(book, form);
        setList(result);
    }, [form]);

    const navigate = useNavigate();
    const { addFilter } = useCustomFilters();
    const toSaveFilter = useCallback(async () => {
        const name = await prompt({
            title: t("please-enter-a-name-for-current-filter"),
            inputType: "text",
        });
        if (!name) {
            return;
        }
        const book = useBookStore.getState().currentBookId;
        if (!book) {
            return;
        }
        const id = await addFilter(name, { filter: form });
        navigate(`/stat/${id}`);
    }, [addFilter, form, navigate, t]);

    const hasFilter = useRef(Boolean(state?.filter));
    useEffect(() => {
        if (hasFilter.current) {
            // setFilterOpen(true);
            toSearch();
            hasFilter.current = false;
        }
    }, [toSearch]);

    useEffect(() => {
        if (debouncedComment === undefined) {
            return;
        }
        if ((debouncedComment ?? "").length === 0) {
            return;
        }
        toSearch();
    }, [debouncedComment, toSearch]);

    const [sortIndex, setSortIndex] = useState(0);
    const sorted = useMemo(() => {
        const sort = SORTS[sortIndex] ?? SORTS[0];
        return orderBy(list, [sort.by], [sort.order]);
    }, [list, sortIndex]);

    const [enableSelect, setEnableSelect] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const hasActiveFilters = useMemo(() => {
        return Object.values(form).some((value) => {
            if (value === undefined || value === null) return false;
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === "string") return value.length > 0;
            return true;
        });
    }, [form]);
    const onSelectChange = (id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((v) => v !== id);
            }
            return [...prev, id];
        });
    };
    const allSelected =
        selectedIds.length === 0
            ? false
            : selectedIds.length === sorted.length
              ? true
              : "indeterminate";

    const toBatchDelete = async () => {
        const confirmed = await prompt({
            title: t("batch-delete-confirm", {
                n: selectedIds.length,
            }),
        });
        if (!confirmed) {
            return;
        }
        setEnableSelect(false);
        await useLedgerStore.getState().removeBills(selectedIds);
        await toSearch();
    };
    const toBatchEdit = async () => {
        const initial = selectedIds.reduce(
            (prev, id, index) => {
                const bill = sorted.find((v) => v.id === id);
                if (!bill) {
                    return prev;
                }
                if (index === 0) {
                    return {
                        type: bill.type,
                        categoryId: bill.categoryId,
                    };
                }
                return {
                    type: bill.type === prev.type ? bill.type : undefined,
                    categoryId:
                        bill.categoryId === prev.categoryId
                            ? bill.categoryId
                            : undefined,
                };
            },
            {
                type: undefined,
                categoryId: undefined,
            } as BatchEditOptions,
        );
        const edit = await showBatchEdit(initial);
        const updatedEntries = selectedIds
            .map((id) => {
                const bill = { ...sorted.find((v) => v.id === id) } as Bill;
                if (!bill) {
                    return undefined;
                }
                if (edit.type !== undefined) {
                    const isTypeChanged = bill.type !== edit.type;
                    bill.type = edit.type;
                    if (edit.categoryId !== undefined) {
                        bill.categoryId = edit.categoryId;
                    } else if (isTypeChanged) {
                        const firstCategoryId = categories.find(
                            (c) => c.type === edit.type,
                        )?.id;
                        if (!firstCategoryId) {
                            return undefined;
                        }
                        bill.categoryId = firstCategoryId;
                    }
                }
                if (edit.tagIds !== undefined) {
                    bill.tagIds = edit.tagIds;
                }
                return {
                    id: bill.id,
                    entry: bill,
                };
            })
            .filter((v) => v !== undefined);
        await useLedgerStore.getState().updateBills(updatedEntries);
        await toSearch();
    };
    return (
        <WeddingPageShell className="page-show">
            <WeddingTopBar
                title="搜索记录"
                subtitle="按备注、分类、金额和标签筛选账单"
            />
            <div className="flex w-full flex-1 flex-col gap-4 lg:grid lg:grid-cols-[0.92fr_1.08fr]">
                <div className="space-y-4">
                    <div className="rounded-[28px] bg-[linear-gradient(135deg,#fbbcdf,#ddb6f7)] p-4 text-[#3b0d29] shadow-[0_18px_36px_-28px_rgba(244,114,182,0.45)] dark:bg-[linear-gradient(135deg,#3d1030,#1e0d30)] dark:text-white">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-sm font-medium opacity-80">
                                    搜索筛选
                                </div>
                                <div className="mt-1 text-[28px] font-bold leading-none">
                                    {sorted.length}
                                </div>
                                <div className="mt-1 text-xs opacity-75">
                                    当前结果数 {searched ? "已更新" : "等待筛选"}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="rounded-2xl bg-white/40 px-3 py-2 dark:bg-white/10">
                                    <div className="text-[10px] opacity-75">
                                        已筛选
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {Object.keys(form).filter(Boolean).length}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-white/40 px-3 py-2 dark:bg-white/10">
                                    <div className="text-[10px] opacity-75">
                                        选中
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {selectedIds.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[11px]">
                            <span className="rounded-full bg-white/40 px-3 py-1 dark:bg-white/10">
                                {hasActiveFilters ? "已启用筛选" : "未启用筛选"}
                            </span>
                            <span className="rounded-full bg-white/40 px-3 py-1 dark:bg-white/10">
                                排序: {t(SORTS[sortIndex].label)}
                            </span>
                        </div>
                    </div>
                    <div className="wedding-surface-card w-full p-4">
                        <div className="flex h-12 items-center gap-3 rounded-[14px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-4">
                            <i className="icon-[mdi--magnify] size-5 text-[color:var(--wedding-text-mute)]" />
                            <div className="flex-1">
                                <Clearable
                                    visible={Boolean(form.comment?.length)}
                                    onClear={() =>
                                        setForm((v) => ({
                                            ...v,
                                            comment: undefined,
                                        }))
                                    }
                                >
                                    <input
                                        value={form.comment ?? ""}
                                        type="text"
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--wedding-text-mute)]"
                                        placeholder="搜索备注、分类、金额和标签..."
                                        onChange={(e) => {
                                            setForm((v) => ({
                                                ...v,
                                                comment: e.target.value,
                                            }));
                                        }}
                                    />
                                </Clearable>
                            </div>
                            <button
                                type="button"
                                className="flex h-9 min-w-[68px] items-center justify-center rounded-[10px] bg-gradient-to-r from-[#f05cab] to-[#d64dc8] px-4 text-sm text-white"
                                onClick={() => {
                                    toSearch();
                                    setTimeout(() => {
                                        setSearched(true);
                                    }, 1000);
                                }}
                            >
                                搜索
                            </button>
                        </div>
                    </div>
                </div>
                <Collapsible.Root
                    open={filterOpen}
                    onOpenChange={setFilterOpen}
                    className="group flex flex-col text-xs font-medium md:text-sm"
                >
                    <Collapsible.Content className="data-[state=open]:animate-collapse-open data-[state=closed]:animate-collapse-close data-[state=closed]:overflow-hidden">
                        <div className="wedding-surface-card mb-2 p-3">
                            <BillFilterForm form={form} setForm={setForm} />
                        </div>
                    </Collapsible.Content>
                    <div className="wedding-surface-card flex w-full justify-between px-3 py-2">
                        <Button
                            variant="ghost"
                            className="rounded-lg text-pink-500 hover:bg-pink-500/10 transition-colors"
                            onClick={toReset}
                        >
                            {t("reset")}
                        </Button>
                        {searched && (
                            <Button
                                className="animate-content-show rounded-lg text-xs text-pink-500 underline hover:bg-pink-500/10 transition-colors"
                                variant="ghost"
                                size="sm"
                                onClick={toSaveFilter}
                            >
                                <i className="icon-[mdi--coffee-to-go-outline]" />
                                {t("save-for-analyze")}
                            </Button>
                        )}

                        <HintTooltip
                            persistKey="filterHintShows"
                            content={"点击展开详细筛选面板"}
                        >
                            <Collapsible.Trigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-lg text-pink-500 hover:bg-pink-500/10 transition-colors"
                                >
                                    <i className="group-[[data-state=open]]:icon-[mdi--filter-variant-minus] group-[[data-state=closed]]:icon-[mdi--filter-variant-plus]"></i>
                                    {t("filter")}
                                </Button>
                            </Collapsible.Trigger>
                        </HintTooltip>
                    </div>
                </Collapsible.Root>
                <div
                    className={cn(
                        "mx-1 flex items-center justify-between px-1 py-1 text-xs text-[color:var(--wedding-text)]",
                        enableSelect && "pl-2",
                    )}
                >
                    <div className="flex gap-2 items-center">
                        {!enableSelect ? (
                            <>
                                {sorted.length > 0 && (
                                    <Button
                                        className="h-fit rounded-lg p-1 text-[#7c86ff] hover:bg-[#7c86ff]/10 transition-colors"
                                        variant={"ghost"}
                                        size="sm"
                                        onClick={() => {
                                            setEnableSelect(true);
                                        }}
                                    >
                                        {t("multi-select")}
                                    </Button>
                                )}
                                <span className="text-muted-foreground">
                                    {t("total-records", { n: sorted.length })}
                                </span>
                            </>
                        ) : (
                            <>
                                <Checkbox
                                    checked={
                                        selectedIds.length === 0
                                            ? false
                                            : selectedIds.length ===
                                                sorted.length
                                              ? true
                                              : "indeterminate"
                                    }
                                    onClick={() => {
                                        if (allSelected === true) {
                                            setSelectedIds([]);
                                        } else {
                                            setSelectedIds(
                                                sorted.map((v) => v.id),
                                            );
                                        }
                                    }}
                                ></Checkbox>
                                <Button
                                    className="p-1 h-fit hover:bg-muted transition-colors rounded-lg"
                                    variant={"ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setEnableSelect(false);
                                        setSelectedIds([]);
                                    }}
                                >
                                    {t("cancel")}
                                </Button>
                                <span className="text-primary font-medium">
                                    {" "}
                                    {selectedIds.length}/{sorted.length}
                                </span>
                                {selectedIds.length > 0 && (
                                    <>
                                        <Button
                                            className="h-fit rounded-lg p-1 text-pink-500 hover:bg-pink-500/10 transition-colors"
                                            variant={"ghost"}
                                            size="sm"
                                            onClick={toBatchEdit}
                                        >
                                            {t("edit")}
                                        </Button>
                                        <Button
                                            className="h-fit rounded-lg p-1 text-destructive hover:bg-destructive/10 transition-colors"
                                            variant={"ghost"}
                                            size="sm"
                                            onClick={toBatchDelete}
                                        >
                                            {t("delete")}
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg text-[color:var(--wedding-text-soft)] hover:bg-pink-500/10 transition-colors"
                            onClick={() => {
                                setSortIndex((v) => {
                                    if (v === SORTS.length - 1) {
                                        return 0;
                                    }
                                    return v + 1;
                                });
                            }}
                        >
                            <i className={cn(SORTS[sortIndex].icon)}></i>
                            {t(SORTS[sortIndex].label)}
                        </Button>
                    </div>
                </div>
                <div className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)]">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <div>
                            <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                {form.comment ? `“${form.comment}” 的搜索结果` : "最近记录"}
                            </div>
                            <div className="mt-1 text-[11px] text-[color:var(--wedding-text-mute)]">
                                共 {sorted.length} 条结果
                            </div>
                        </div>
                        {hasActiveFilters ? (
                            <span className="rounded-full bg-pink-50 px-3 py-1 text-[10px] font-medium text-pink-500 dark:bg-pink-500/12">
                                已应用筛选
                            </span>
                        ) : null}
                    </div>
                <div className="min-h-[320px] overflow-hidden">
                    {sorted.length > 0 ? (
                        <Ledger
                            bills={sorted}
                            showTime
                            selectedIds={enableSelect ? selectedIds : undefined}
                            onSelectChange={onSelectChange}
                            afterEdit={toSearch}
                            showAssets={showAssets}
                        />
                    ) : (
                        <EmptyState
                            title="还没有搜索结果"
                            description="输入关键字或展开筛选面板，账本记录会在这里展示。"
                        />
                    )}
                </div>
                </div>
            </div>
            <BatchEditProvider />
        </WeddingPageShell>
    );
}
