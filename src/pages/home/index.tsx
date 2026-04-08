import dayjs from "dayjs";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { StorageAPI } from "@/api/storage";
import CloudLoopIcon from "@/assets/icons/cloud-loop.svg?react";
import AnimatedNumber from "@/components/animated-number";
import { showBookGuide } from "@/components/book/util";
import BudgetCard from "@/components/budget/card";
import { HintTooltip } from "@/components/hint";
import { PaginationIndicator } from "@/components/indicator";
import Ledger from "@/components/ledger";
import Loading from "@/components/loading";
import { Promotion } from "@/components/promotion";
import { Button } from "@/components/ui/button";
import {
    WeddingPageShell,
    WeddingSectionTitle,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBudget } from "@/hooks/use-budget";
import { useSnap } from "@/hooks/use-snap";
import { amountToNumber } from "@/ledger/bill";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { usePreferenceStore } from "@/store/preference";
import { useUserStore } from "@/store/user";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { filterOrderedBillListByTimeRange } from "@/utils/filter";
import { denseDate } from "@/utils/time";
import {
    CountdownCard,
    ProgressOverview,
    QuickEntry,
    UpcomingTasks,
} from "@/wedding/components";

let ledgerAnimationShows = false;

export default function Page() {
    const t = useIntl();
    const navigate = useNavigate();

    const { bills, loading, sync } = useLedgerStore();
    const currentBook = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((b) => b.id === currentBookId);
        }),
    );
    const showAssets = usePreferenceStore(
        useShallow((state) => state.showAssetsInLedger),
    );
    const { id: userId } = useUserStore();
    const syncIconClassName =
        sync === "wait"
            ? "icon-[mdi--cloud-minus-outline]"
            : sync === "syncing"
              ? "icon-[line-md--cloud-alt-print-loop]"
              : sync === "success"
                ? "icon-[mdi--cloud-check-outline]"
                : "icon-[mdi--cloud-remove-outline] text-red-600";

    const [currentDate, setCurrentDate] = useState(dayjs());
    const ledgerRef = useRef<any>(null);

    const currentDateBills = useMemo(() => {
        return filterOrderedBillListByTimeRange(bills, [
            currentDate.startOf("day"),
            currentDate.endOf("day"),
        ]);
    }, [bills, currentDate]);

    const currentDateAmount = useMemo(() => {
        return amountToNumber(
            currentDateBills.reduce((p, c) => {
                return p + c.amount * (c.type === "income" ? 1 : -1);
            }, 0),
        );
    }, [currentDateBills]);

    const { budgets: allBudgets } = useBudget();
    const budgets = allBudgets.filter((b) => {
        return b.joiners.includes(userId) && b.start < Date.now();
    });

    const budgetContainer = useRef<HTMLDivElement>(null);
    const { count: budgetCount, index: curBudgetIndex } = useSnap(
        budgetContainer,
        0,
    );

    const allLoaded = useRef(false);
    useLayoutEffect(() => {
        if (!allLoaded.current && budgets.length > 0) {
            useLedgerStore.getState().refreshBillList();
            allLoaded.current = true;
        }
    }, [budgets.length]);

    const onDateClick = useCallback(
        (date: dayjs.Dayjs) => {
            setCurrentDate(date);
            const index = bills.findIndex((bill) => {
                const billDate = dayjs.unix(bill.time / 1000);
                return billDate.isSame(date, "day");
            });
            if (index >= 0) {
                ledgerRef.current?.scrollToIndex(index);
            }
        },
        [bills],
    );

    const onItemShow = useCallback((index: number) => {
        if (!allLoaded.current && index >= 120) {
            useLedgerStore.getState().refreshBillList();
            allLoaded.current = true;
        }
    }, []);

    const presence = useMemo(() => {
        return !ledgerAnimationShows;
    }, []);

    useEffect(() => {
        ledgerAnimationShows = true;
    }, []);

    const {
        weddingData,
        init: initWedding,
        initialized: weddingInitialized,
    } = useWeddingStore();
    useEffect(() => {
        if (!weddingInitialized) {
            initWedding();
        }
    }, [weddingInitialized, initWedding]);

    const showWeddingSection =
        weddingData && (weddingData.engagementDate || weddingData.weddingDate);
    const shortcutItems = [
        {
            title: "搜索记录",
            icon: "icon-[mdi--text-box-search-outline]",
            path: "/search",
            tone: "from-rose-200/80 to-fuchsia-200/70 dark:from-rose-500/15 dark:to-fuchsia-500/10",
        },
        {
            title: "统计分析",
            icon: "icon-[mdi--chart-donut]",
            path: "/stat",
            tone: "from-sky-200/80 to-indigo-200/70 dark:from-sky-500/15 dark:to-indigo-500/10",
        },
        {
            title: "礼金簿",
            icon: "icon-[mdi--gift-outline]",
            path: "/tools/gift-book",
            tone: "from-violet-200/80 to-pink-200/70 dark:from-violet-500/15 dark:to-pink-500/10",
        },
        {
            title: "婚礼预算",
            icon: "icon-[mdi--wallet-outline]",
            path: "/tools/wedding-budget",
            tone: "from-amber-200/80 to-rose-200/70 dark:from-amber-500/15 dark:to-rose-500/10",
        },
    ];

    return (
        <WeddingPageShell className="page-show">
            <WeddingTopBar subtitle="婚礼账本与筹备中心" />

            <section className="wedding-hero p-5">
                <div className="absolute inset-y-0 right-[-20%] w-1/2 rounded-full bg-white/10 blur-3xl" />
                <div className="relative space-y-3">
                    <div>
                        <p className="text-sm text-white/80">{denseDate(currentDate)}</p>
                        <AnimatedNumber
                            value={currentDateAmount}
                            className="mt-2 text-4xl font-black tracking-tight text-white"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {currentBook ? (
                            <button
                                type="button"
                                className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/90 backdrop-blur"
                                onClick={() => {
                                    showBookGuide();
                                }}
                            >
                                <i className="icon-[mdi--book-open-page-variant-outline] mr-1 inline-block size-4 align-[-3px]"></i>
                                {currentBook.name}
                            </button>
                        ) : null}
                        <Button
                            variant="ghost"
                            className="h-9 rounded-full bg-white/15 px-3 text-xs text-white hover:bg-white/20"
                            onClick={() => navigate("/search")}
                        >
                            搜索记录
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-9 rounded-full bg-white/15 px-3 text-xs text-white hover:bg-white/20"
                            onClick={() => navigate("/stat")}
                        >
                            统计分析
                        </Button>
                    </div>
                </div>
            </section>

            {showWeddingSection ? (
                <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <CountdownCard />
                        <div className="grid gap-4 md:grid-cols-2">
                            <ProgressOverview />
                            <QuickEntry />
                        </div>
                        <UpcomingTasks />
                    </div>
                    <div className="space-y-4">
                        <div className="wedding-surface-card p-4">
                            <WeddingSectionTitle title="常用入口" />
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                {shortcutItems.map((item) => (
                                    <button
                                        key={item.path}
                                        type="button"
                                        className={`rounded-[20px] border border-white/30 bg-gradient-to-br ${item.tone} p-4 text-left shadow-sm transition-transform hover:scale-[1.01]`}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl text-pink-500 dark:bg-white/8">
                                            <i className={item.icon}></i>
                                        </div>
                                        <div className="mt-4 text-sm font-semibold text-[color:var(--wedding-text)]">
                                            {item.title}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Promotion />
                    </div>
                </section>
            ) : (
                <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="wedding-surface-card p-5">
                        <WeddingSectionTitle title="欢迎回来" />
                        <p className="mt-3 text-sm leading-7 wedding-muted">
                            这里保留了原项目的账本能力，并把婚礼任务、礼金与预算工具合并到同一套视觉系统里。
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {shortcutItems.map((item) => (
                                <button
                                    key={item.path}
                                    type="button"
                                    className={`rounded-[20px] border border-white/30 bg-gradient-to-br ${item.tone} p-4 text-left shadow-sm`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-xl text-pink-500 dark:bg-white/8">
                                        <i className={item.icon}></i>
                                    </div>
                                    <div className="mt-3 text-sm font-semibold text-[color:var(--wedding-text)]">
                                        {item.title}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <Promotion />
                </section>
            )}

            <section className="wedding-surface-card p-4">
                <div className="flex items-center justify-between gap-3">
                    <WeddingSectionTitle title="预算与同步" />
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[color:var(--wedding-text-soft)] shadow-sm dark:bg-white/6"
                        onClick={() => {
                            StorageAPI.toSync();
                        }}
                    >
                        {sync === "syncing" ? (
                            <CloudLoopIcon width={18} height={18} />
                        ) : (
                            <i className={cn(syncIconClassName, "size-[18px]")}></i>
                        )}
                    </button>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <WeddingStat
                                label="进行中预算"
                                value={`${budgets.length} 项`}
                                hint="婚礼相关项目"
                            />
                            <HintTooltip
                                persistKey={"cloudSyncHintShows"}
                                content={"等待云同步完成后，其他设备即可获取最新的账单数据"}
                            >
                                <div>
                                    <WeddingStat
                                        label="同步状态"
                                        value={
                                            sync === "success"
                                                ? "已同步"
                                                : sync === "syncing"
                                                  ? "同步中"
                                                  : sync === "wait"
                                                    ? "待同步"
                                                    : "异常"
                                        }
                                        tone={sync === "failed" ? "danger" : "default"}
                                        hint="点击图标可立即同步"
                                    />
                                </div>
                            </HintTooltip>
                        </div>
                        <div
                            ref={budgetContainer}
                            className="flex gap-3 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
                        >
                            {budgets.length > 0 ? (
                                budgets.map((budget) => (
                                    <BudgetCard
                                        className="snap-start rounded-[22px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] shadow-none"
                                        key={budget.id}
                                        budget={budget}
                                    />
                                ))
                            ) : (
                                <div className="wedding-soft-card flex min-h-[160px] w-full items-center justify-center px-6 text-center text-sm wedding-muted">
                                    还没有婚礼预算，先去工具箱添加预算项目吧。
                                </div>
                            )}
                        </div>
                        {budgetCount > 1 ? (
                            <div className="flex justify-center">
                                <PaginationIndicator
                                    count={budgetCount}
                                    current={curBudgetIndex}
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="wedding-soft-card p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                                    账本列表
                                </div>
                                <div className="text-sm wedding-muted">
                                    保留原有滚动、日期定位与同步逻辑
                                </div>
                            </div>
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--wedding-text-soft)] dark:bg-white/6"
                                type="button"
                                onClick={() => {
                                    if (loading) {
                                        return;
                                    }
                                    useLedgerStore.getState().initCurrentBook();
                                }}
                            >
                                <div className={cn("opacity-0", loading && "opacity-100")}>
                                    <Loading className="[&_i]:size-[18px]" />
                                </div>
                            </button>
                        </div>
                        <div className="mt-4 h-[420px] overflow-hidden rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)]">
                            {bills.length > 0 ? (
                                <Ledger
                                    ref={ledgerRef}
                                    bills={bills}
                                    className={cn(bills.length > 0 && "relative")}
                                    enableDivideAsOrdered
                                    showTime
                                    onItemShow={onItemShow}
                                    onVisibleDateChange={setCurrentDate}
                                    onDateClick={onDateClick}
                                    presence={presence}
                                    showAssets={showAssets}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center p-6 text-center text-sm wedding-muted">
                                    {t("nothing-here-add-one-bill")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </WeddingPageShell>
    );
}
