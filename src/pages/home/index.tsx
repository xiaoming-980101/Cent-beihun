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
import type { LedgerRef } from "@/components/ledger";
import Ledger from "@/components/ledger";
import Loading from "@/components/loading";
import { Promotion } from "@/components/promotion";
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
    UpcomingTasks,
} from "@/wedding/components";
import { formatAmount } from "@/wedding/utils";

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
    const bookLabel = currentBook?.name || "当前账本";
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
    const ledgerRef = useRef<LedgerRef | null>(null);

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
    const {
        weddingData,
        init: initWedding,
        initialized: weddingInitialized,
    } = useWeddingStore();

    const allLoaded = useRef(false);
    useLayoutEffect(() => {
        if (!allLoaded.current && budgets.length > 0) {
            useLedgerStore.getState().refreshBillList();
            allLoaded.current = true;
        }
    }, [budgets.length]);

    useLayoutEffect(() => {
        const shell = document.querySelector<HTMLElement>(".wedding-app-shell");
        if (!shell) {
            return;
        }

        const resetScroll = () => {
            shell.scrollTop = 0;
        };

        resetScroll();
        const frame = window.requestAnimationFrame(resetScroll);
        const timer = window.setTimeout(resetScroll, 450);

        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, []);

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

    useEffect(() => {
        if (!weddingInitialized) {
            initWedding();
        }
    }, [weddingInitialized, initWedding]);

    const showWeddingSection =
        weddingData && (weddingData.engagementDate || weddingData.weddingDate);
    const weddingTaskCount = weddingData?.tasks.length || 0;
    const weddingGuestCount = weddingData?.guests.length || 0;
    const weddingGiftCount = weddingData?.giftRecords.length || 0;
    const completedWeddingTaskCount =
        weddingData?.tasks.filter((item) => item.status === "completed")
            .length || 0;
    const homeActivities = useMemo(() => {
        const taskActivities = (weddingData?.tasks || [])
            .slice()
            .sort((a, b) => (b.completedAt || b.createdAt) - (a.completedAt || a.createdAt))
            .slice(0, 2)
            .map((task) => ({
                key: `task-${task.id}`,
                icon: "icon-[mdi--clipboard-check-outline]",
                color: "#A855F7",
                text: `${task.title} ${task.status === "completed" ? "已完成" : "进行中"}`,
                sub: task.completedAt
                    ? dayjs(task.completedAt).format("MM-DD HH:mm")
                    : dayjs(task.createdAt).format("MM-DD HH:mm"),
                path: "/tasks",
            }));
        const giftActivities = (weddingData?.giftRecords || [])
            .slice()
            .sort((a, b) => b.date - a.date)
            .slice(0, 1)
            .map((record) => ({
                key: `gift-${record.id}`,
                icon: "icon-[mdi--gift-outline]",
                color: "#F472B6",
                text: `${record.guestName || "礼金记录"} ${record.type === "received" ? "收礼" : "送礼"} ${formatAmount(record.amount)}`,
                sub: dayjs(record.date).format("MM-DD HH:mm"),
                path: "/tools/gift-book",
            }));
        const guestActivities = (weddingData?.guests || [])
            .filter((guest) => guest.inviteStatus === "confirmed")
            .slice(0, 1)
            .map((guest) => ({
                key: `guest-${guest.id}`,
                icon: "icon-[mdi--account-group-outline]",
                color: "#22C55E",
                text: `${guest.name} 已确认出席`,
                sub: guest.phone || "宾客状态更新",
                path: "/tools/guests",
            }));

        return [...taskActivities, ...giftActivities, ...guestActivities].slice(
            0,
            4,
        );
    }, [weddingData?.giftRecords, weddingData?.guests, weddingData?.tasks]);
    const giftSummary = useMemo(() => {
        const records = weddingData?.giftRecords || [];
        const received = records
            .filter((item) => item.type === "received")
            .reduce((sum, item) => sum + item.amount, 0);
        const sent = records
            .filter((item) => item.type === "sent")
            .reduce((sum, item) => sum + item.amount, 0);
        return {
            count: records.length,
            received,
            sent,
        };
    }, [weddingData?.giftRecords]);
    const shortcutItems = [
        {
            title: "任务",
            icon: "icon-[mdi--clipboard-text-outline]",
            path: "/tasks",
            tone: "bg-pink-500/12 text-pink-500",
        },
        {
            title: "礼金簿",
            icon: "icon-[mdi--gift-outline]",
            path: "/tools/gift-book",
            tone: "bg-violet-500/12 text-violet-500",
        },
        {
            title: "亲友",
            icon: "icon-[mdi--account-group-outline]",
            path: "/tools/guests",
            tone: "bg-blue-500/12 text-blue-500",
        },
        {
            title: "预算管理",
            icon: "icon-[mdi--wallet-outline]",
            path: "/tools/wedding-budget",
            tone: "bg-emerald-500/12 text-emerald-500",
        },
    ];

    return (
        <WeddingPageShell contentClassName="wedding-home-page">
            <WeddingTopBar subtitle={`${bookLabel}账本与工具中心`} />

            <section className="wedding-hero overflow-hidden rounded-[28px] p-5 shadow-[0_22px_44px_-30px_rgba(236,72,153,0.38)]">
                <div className="absolute inset-y-0 right-[-20%] w-1/2 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -right-4 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <i className="icon-[mdi--heart] size-3.5 text-white/90" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                                YueWed
                            </span>
                        </div>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-white/90 backdrop-blur"
                            onClick={() => navigate("/settings")}
                            aria-label="打开设置"
                        >
                            <i className="icon-[mdi--bell-outline] size-4.5" />
                        </button>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-white/75">
                                你好，欢迎回来
                            </p>
                            <p className="mt-1 text-sm text-white/80">
                                {denseDate(currentDate)}
                            </p>
                            <AnimatedNumber
                                value={currentDateAmount}
                                className="mt-2 text-[46px] font-black tracking-[-0.04em] text-white"
                            />
                        </div>
                        <div className="rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur">
                            {weddingData?.weddingDate
                                ? `${dayjs(weddingData.weddingDate).format("YYYY.MM.DD")}`
                                : "设置婚期"}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            ["任务完成", `${completedWeddingTaskCount}/${weddingTaskCount || 0}`, "已完成", "#F3E8FF", "#A855F7"],
                            ["宾客人数", `${weddingGuestCount}`, "已登记", "#EFF6FF", "#3B82F6"],
                            ["礼金记录", `${weddingGiftCount}`, "当前记录", "#FDE7F3", "#EC4899"],
                        ].map(([label, value, sub, bg, color]) => (
                            <div
                                key={label}
                                className="rounded-2xl px-3 py-2.5 text-center"
                                style={{ background: bg }}
                            >
                                <div className="text-[10px] text-[#7C2D5A]/70">
                                    {label}
                                </div>
                                <div
                                    className="mt-1 text-lg font-bold leading-none"
                                    style={{ color }}
                                >
                                    {value}
                                </div>
                                <div className="mt-1 text-[10px] text-[#7C2D5A]/55">
                                    {sub}
                                </div>
                            </div>
                        ))}
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
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/90">
                            {bookLabel}
                        </span>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-3 text-[13px] font-semibold text-[color:var(--wedding-text)]">
                    快捷入口
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {shortcutItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3 text-center shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                            onClick={() => navigate(item.path)}
                        >
                            <div
                                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-2xl ${item.tone}`}
                            >
                                <i className={`${item.icon} text-xl`} />
                            </div>
                            <div className="mt-2 text-[10px] font-medium text-[color:var(--wedding-text)]">
                                {item.title}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {showWeddingSection ? (
                <section className="grid gap-3">
                    <CountdownCard />
                    <ProgressOverview />
                    <UpcomingTasks />
                    <div className="wedding-surface-card p-4">
                        <div className="flex items-center justify-between">
                            <WeddingSectionTitle title="收支明细" />
                            <button
                                type="button"
                                className="text-sm text-pink-500"
                                onClick={() => navigate("/search")}
                            >
                                查看全部
                            </button>
                        </div>
                        <div className="mt-4 h-[420px] overflow-hidden">
                            {bills.length > 0 ? (
                                <Ledger
                                    ref={ledgerRef}
                                    bills={bills}
                                    className={cn(
                                        bills.length > 0 && "relative",
                                    )}
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
                </section>
            ) : (
                <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="wedding-surface-card p-5">
                        <WeddingSectionTitle title="欢迎回来" />
                        <p className="mt-3 text-sm leading-7 wedding-muted">
                            这里保留了原项目的账本能力，并把任务、礼金与预算工具整合到同一套视觉系统里。
                        </p>
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
                    <Promotion />
                </section>
            )}

            <section className="wedding-surface-card p-4">
                <div className="mb-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                            最近动态
                        </div>
                        <button
                            type="button"
                            className="text-[11px] text-pink-500"
                            onClick={() => navigate("/tasks")}
                        >
                            全部
                        </button>
                    </div>
                    <div className="space-y-2">
                        {homeActivities.length > 0 ? (
                            homeActivities.map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => navigate(item.path)}
                                    className="flex w-full items-center gap-3 rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-3 py-3 text-left transition-transform hover:-translate-y-0.5"
                                >
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                                        style={{ background: `${item.color}18` }}
                                    >
                                        <i
                                            className={`${item.icon} size-4`}
                                            style={{ color: item.color }}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-medium text-[color:var(--wedding-text)]">
                                            {item.text}
                                        </div>
                                        <div className="mt-1 text-[10px] text-[color:var(--wedding-text-mute)]">
                                            {item.sub}
                                        </div>
                                    </div>
                                    <i className="icon-[mdi--chevron-right] size-4 text-[color:var(--wedding-text-mute)]" />
                                </button>
                            ))
                        ) : (
                            <div className="rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-3 py-4 text-center text-xs wedding-muted">
                                还没有婚礼动态，添加任务或礼金后这里会自动更新。
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4 rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-500/12">
                                <i className="icon-[mdi--gift-outline] size-5" />
                            </div>
                            <div>
                                <div className="text-[12px] font-medium text-[color:var(--wedding-text)]">
                                    礼金收支
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    共 {giftSummary.count} 笔记录
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-pink-500">
                                {formatAmount(giftSummary.received)}
                            </div>
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                支出 {formatAmount(giftSummary.sent)}
                            </div>
                        </div>
                    </div>
                </div>

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
                            <i
                                className={cn(syncIconClassName, "size-[18px]")}
                            ></i>
                        )}
                    </button>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                        <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                                        预算概览
                                    </div>
                                    <div className="mt-1 text-[11px] text-[color:var(--wedding-text-mute)]">
                                        当前账本的预算与支付进度
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="text-[11px] text-pink-500"
                                    onClick={() => navigate("/tools/wedding-budget")}
                                >
                                    详情
                                </button>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {[
                                    [
                                        "总预算",
                                        formatAmount(
                                            budgets.reduce(
                                                (sum, item) =>
                                                    sum + item.budget,
                                                0,
                                            ),
                                        ),
                                    ],
                                    [
                                        "已支付",
                                        formatAmount(
                                            budgets.reduce(
                                                (sum, item) =>
                                                    sum + item.spent,
                                                0,
                                            ),
                                        ),
                                    ],
                                    ["项目数", `${budgets.length} 项`],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl bg-[color:var(--wedding-surface-muted)] px-3 py-3 text-center"
                                    >
                                        <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                            {label}
                                        </div>
                                        <div className="mt-1 text-[13px] font-semibold text-[color:var(--wedding-text)]">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <WeddingStat
                                label="进行中预算"
                                value={`${budgets.length} 项`}
                                hint={`${bookLabel}相关项目`}
                            />
                            <HintTooltip
                                persistKey={"cloudSyncHintShows"}
                                content={
                                    "等待云同步完成后，其他设备即可获取最新的账单数据"
                                }
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
                                        tone={
                                            sync === "failed"
                                                ? "danger"
                                                : "default"
                                        }
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
                                    还没有预算，先去工具箱添加预算项目吧。
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
                                    收支明细
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
                                <div
                                    className={cn(
                                        "opacity-0",
                                        loading && "opacity-100",
                                    )}
                                >
                                    <Loading className="[&_i]:size-[18px]" />
                                </div>
                            </button>
                        </div>
                        <div className="mt-4 h-[420px] overflow-hidden rounded-[20px]">
                            {bills.length > 0 ? (
                                <Ledger
                                    ref={ledgerRef}
                                    bills={bills}
                                    className={cn(
                                        bills.length > 0 && "relative",
                                    )}
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
