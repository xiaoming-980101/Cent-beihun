import dayjs from "dayjs";
import {
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
import { showBillInfo } from "@/components/bill-info";
import { showBookGuide } from "@/components/book/util";
import BudgetCard from "@/components/budget/card";
import CategoryIcon from "@/components/category/icon";
import { HintTooltip } from "@/components/hint";
import { PaginationIndicator } from "@/components/indicator";
import Loading from "@/components/loading";
import { Promotion } from "@/components/promotion";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import WeddingDatePicker from "@/components/ui/wedding-date-picker";
import WeddingEasterEgg from "@/components/wedding-easter-egg";
import {
    WeddingPageShell,
    WeddingSectionTitle,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBudget } from "@/hooks/use-budget";
import useCategory from "@/hooks/use-category";
import { useSnap } from "@/hooks/use-snap";
import { amountToNumber } from "@/ledger/bill";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { denseDate } from "@/utils/time";
import {
    ProgressOverview,
    QuickStatsGrid,
    TodayTasksCard,
    UpcomingTasks,
} from "@/wedding/components";
import { calculateCountdown, formatAmount } from "@/wedding/utils";

export default function Page() {
    const t = useIntl();
    const navigate = useNavigate();

    const { bills, loading, sync } = useLedgerStore();
    const { categories } = useCategory();
    const currentBook = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((b) => b.id === currentBookId);
        }),
    );
    const bookLabel = currentBook?.name || "当前账本";
    const { id: userId } = useUserStore();
    const syncIconClassName =
        sync === "wait"
            ? "icon-[mdi--cloud-minus-outline]"
            : sync === "syncing"
              ? "icon-[line-md--cloud-alt-print-loop]"
              : sync === "success"
                ? "icon-[mdi--cloud-check-outline]"
                : "icon-[mdi--cloud-remove-outline] text-red-600";
    const categoryById = useMemo(() => {
        return new Map(categories.map((category) => [category.id, category]));
    }, [categories]);
    const latestBills = useMemo(() => bills.slice(0, 10), [bills]);
    const heroAmount = useMemo(() => {
        return amountToNumber(
            latestBills.reduce((p, c) => {
                return p + c.amount * (c.type === "income" ? 1 : -1);
            }, 0),
        );
    }, [latestBills]);

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
        updateWeddingDate,
        updateEngagementDate,
        updatePartnerName,
    } = useWeddingStore();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [engagementDateDraft, setEngagementDateDraft] = useState<
        number | undefined
    >(undefined);
    const [weddingDateDraft, setWeddingDateDraft] = useState<
        number | undefined
    >(undefined);
    const [partnerNameDraft, setPartnerNameDraft] = useState("");
    const [nowTick, setNowTick] = useState(Date.now());
    const [eggOpen, setEggOpen] = useState<{
        kind: "engagement" | "wedding";
        title: string;
        target: number;
    } | null>(null);
    const [tapProgress, setTapProgress] = useState({
        engagement: 0,
        wedding: 0,
    });
    const [finalCountdownSeconds, setFinalCountdownSeconds] = useState<
        number | null
    >(null);

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

    useEffect(() => {
        if (!weddingInitialized) {
            initWedding();
        }
    }, [weddingInitialized, initWedding]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowTick(Date.now());
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const tryAutoOpenEgg = (
            kind: "engagement" | "wedding",
            title: string,
            target?: number,
        ) => {
            if (!target || !dayjs(target).isSame(dayjs(), "day")) {
                return;
            }
            const key = `wedding-egg-auto-${kind}-${dayjs().format("YYYY-MM-DD")}`;
            if (localStorage.getItem(key) === "1") {
                return;
            }
            localStorage.setItem(key, "1");
            setEggOpen({ kind, title, target });
        };
        tryAutoOpenEgg("engagement", "订婚彩蛋", weddingData?.engagementDate);
        tryAutoOpenEgg("wedding", "结婚彩蛋", weddingData?.weddingDate);
    }, [weddingData?.engagementDate, weddingData?.weddingDate]);

    useEffect(() => {
        if (!eggOpen) {
            setFinalCountdownSeconds(null);
            return;
        }
        if (!dayjs(eggOpen.target).isSame(dayjs(), "day")) {
            setFinalCountdownSeconds(null);
            return;
        }
        setFinalCountdownSeconds(10);
        const timer = window.setInterval(() => {
            setFinalCountdownSeconds((prev) => {
                if (prev === null) {
                    return null;
                }
                if (prev <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, [eggOpen]);

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

    useEffect(() => {
        if (!showDatePicker) {
            return;
        }
        setEngagementDateDraft(weddingData?.engagementDate || undefined);
        setWeddingDateDraft(weddingData?.weddingDate || undefined);
        setPartnerNameDraft(weddingData?.partnerName || "");
    }, [
        showDatePicker,
        weddingData?.engagementDate,
        weddingData?.weddingDate,
        weddingData?.partnerName,
    ]);

    const recentIncomeExpense = useMemo(() => {
        return latestBills.reduce(
            (acc, bill) => {
                const amount = amountToNumber(bill.amount);
                if (bill.type === "income") {
                    acc.income += amount;
                } else {
                    acc.expense += amount;
                }
                return acc;
            },
            { income: 0, expense: 0 },
        );
    }, [latestBills]);
    const engagementDays = useMemo(() => {
        if (!weddingData?.engagementDate) return null;
        return Math.abs(dayjs(weddingData.engagementDate).startOf("day").diff(dayjs().startOf("day"), "day"));
    }, [weddingData?.engagementDate]);
    const weddingDays = useMemo(() => {
        if (!weddingData?.weddingDate) return null;
        return Math.abs(dayjs(weddingData.weddingDate).startOf("day").diff(dayjs().startOf("day"), "day"));
    }, [weddingData?.weddingDate]);
    const heartParticles = useMemo(() => {
        return Array.from({ length: 18 }, (_, index) => ({
            id: index,
            left: `${8 + ((index * 11) % 84)}%`,
            delay: `${(index % 7) * 0.36}s`,
            duration: `${3.4 + (index % 4) * 0.55}s`,
            scale: 0.86 + (index % 3) * 0.2,
            opacity: 0.26 + (index % 6) * 0.1,
        }));
    }, []);

    const formatPreciseCountdown = (target: number, tick: number) => {
        void tick;
        const countdown = calculateCountdown(target);
        const dd = Math.abs(countdown.days);
        const hh = String(countdown.hours).padStart(2, "0");
        const mm = String(countdown.minutes).padStart(2, "0");
        const ss = String(countdown.seconds).padStart(2, "0");
        return countdown.days < 0
            ? `已过去 ${dd}天 ${hh}:${mm}:${ss}`
            : `剩余 ${dd}天 ${hh}:${mm}:${ss}`;
    };

    const onCountdownTap = (
        kind: "engagement" | "wedding",
        title: string,
        target?: number,
    ) => {
        if (!target) {
            return;
        }
        setTapProgress((prev) => {
            const next = prev[kind] + 1;
            if (next >= 5) {
                setEggOpen({ kind, title, target });
                return { ...prev, [kind]: 0 };
            }
            return { ...prev, [kind]: next };
        });
    };

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
                                {denseDate(dayjs())}
                            </p>
                            <AnimatedNumber
                                value={heroAmount}
                                className="mt-2 text-[46px] font-black tracking-[-0.04em] text-white dark:text-white"
                            />
                        </div>
                        <button
                            type="button"
                            className="rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur"
                            onClick={() => setShowDatePicker(true)}
                        >
                            {weddingData?.weddingDate
                                ? `${dayjs(weddingData.weddingDate).format("YYYY.MM.DD")}`
                                : "设置婚期"}
                        </button>
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
                    <div className="grid grid-cols-2 gap-2.5">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                                onCountdownTap(
                                    "engagement",
                                    "订婚彩蛋",
                                    weddingData?.engagementDate,
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    onCountdownTap(
                                        "engagement",
                                        "订婚彩蛋",
                                        weddingData?.engagementDate,
                                    );
                                }
                            }}
                            className="rounded-2xl border border-cyan-200/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.32),rgba(34,211,238,0.18))] px-3 py-2.5 text-left backdrop-blur"
                        >
                            <div className="flex items-center gap-1 text-[10px] text-cyan-50/90">
                                <i className="icon-[mdi--ring] size-3.5" />
                                订婚倒计时
                            </div>
                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-2xl font-black leading-none text-cyan-50">
                                    {engagementDays ?? "--"}
                                </span>
                                <span className="text-[11px] font-semibold text-cyan-50/80">
                                    天
                                </span>
                            </div>
                            <div className="mt-1 text-[10px] text-cyan-50/75">
                                {weddingData?.engagementDate
                                    ? dayjs(weddingData.engagementDate).format(
                                          "YYYY.MM.DD",
                                      )
                                    : "未设置"}
                            </div>
                            {weddingData?.engagementDate ? (
                                <div className="mt-2">
                                    <div className="mb-1 flex items-center justify-between text-[10px] text-cyan-50/90">
                                        <span>彩蛋进度 {tapProgress.engagement}/5</span>
                                        <button
                                            type="button"
                                            className="rounded-full border border-cyan-100/35 bg-cyan-500/18 px-2 py-0.5 text-[10px] font-medium text-cyan-50 transition hover:bg-cyan-500/28"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setEggOpen({
                                                    kind: "engagement",
                                                    title: "订婚彩蛋",
                                                    target:
                                                        weddingData.engagementDate!,
                                                });
                                            }}
                                        >
                                            预览彩蛋
                                        </button>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-cyan-900/30">
                                        <div
                                            className="h-full rounded-full bg-[linear-gradient(90deg,#67e8f9,#22d3ee)] shadow-[0_0_14px_rgba(34,211,238,0.7)] transition-all duration-300"
                                            style={{
                                                width: `${(tapProgress.engagement / 5) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                                onCountdownTap(
                                    "wedding",
                                    "结婚彩蛋",
                                    weddingData?.weddingDate,
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    onCountdownTap(
                                        "wedding",
                                        "结婚彩蛋",
                                        weddingData?.weddingDate,
                                    );
                                }
                            }}
                            className="rounded-2xl border border-pink-200/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.32),rgba(244,114,182,0.2))] px-3 py-2.5 text-left backdrop-blur"
                        >
                            <div className="flex items-center gap-1 text-[10px] text-pink-50/90">
                                <i className="icon-[mdi--heart] size-3.5" />
                                结婚倒计时
                            </div>
                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-2xl font-black leading-none text-pink-50">
                                    {weddingDays ?? "--"}
                                </span>
                                <span className="text-[11px] font-semibold text-pink-50/80">
                                    天
                                </span>
                            </div>
                            <div className="mt-1 text-[10px] text-pink-50/75">
                                {weddingData?.weddingDate
                                    ? dayjs(weddingData.weddingDate).format(
                                          "YYYY.MM.DD",
                                      )
                                    : "未设置"}
                            </div>
                            {weddingData?.weddingDate ? (
                                <div className="mt-2">
                                    <div className="mb-1 flex items-center justify-between text-[10px] text-pink-50/90">
                                        <span>彩蛋进度 {tapProgress.wedding}/5</span>
                                        <button
                                            type="button"
                                            className="rounded-full border border-pink-100/35 bg-pink-500/18 px-2 py-0.5 text-[10px] font-medium text-pink-50 transition hover:bg-pink-500/28"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setEggOpen({
                                                    kind: "wedding",
                                                    title: "结婚彩蛋",
                                                    target: weddingData.weddingDate!,
                                                });
                                            }}
                                        >
                                            预览彩蛋
                                        </button>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-pink-900/30">
                                        <div
                                            className="h-full rounded-full bg-[linear-gradient(90deg,#f9a8d4,#f472b6)] shadow-[0_0_14px_rgba(244,114,182,0.7)] transition-all duration-300"
                                            style={{
                                                width: `${(tapProgress.wedding / 5) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
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

            {showWeddingSection ? (
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
            ) : null}

            {showWeddingSection ? (
                <section className="grid gap-3">
                    <QuickStatsGrid />
                    <ProgressOverview />
                    <TodayTasksCard />
                    <UpcomingTasks />
                </section>
            ) : (
                <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="wedding-surface-card p-5">
                        <WeddingSectionTitle title="欢迎回来" />
                        <p className="mt-3 text-sm leading-7 wedding-muted">
                            这里保留了原项目的账本能力，并把任务、礼金与预算工具整合到同一套视觉系统里。
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

            <section className="overflow-hidden rounded-[28px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_20px_36px_-28px_rgba(15,23,42,0.28)]">
                <div className="bg-[linear-gradient(135deg,#fff1f7,#f6efff)] px-4 pb-4 pt-4 dark:bg-[linear-gradient(135deg,rgba(61,16,48,0.85),rgba(30,13,48,0.78))]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[16px] font-semibold text-[color:var(--wedding-text)]">
                                收支明细
                            </div>
                            <div className="mt-1 text-[11px] text-[color:var(--wedding-text-mute)]">
                                最近 10 条账单 · 共 {latestBills.length} 笔
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-pink-500 shadow-sm dark:bg-white/10"
                            onClick={() => navigate("/search")}
                        >
                            查看全部
                        </button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-white/10">
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                最近收入
                            </div>
                            <div className="mt-1 text-sm font-semibold text-emerald-500">
                                {formatAmount(recentIncomeExpense.income)}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-white/10">
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                最近支出
                            </div>
                            <div className="mt-1 text-sm font-semibold text-orange-500">
                                {formatAmount(recentIncomeExpense.expense)}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-white/10">
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                最近结余
                            </div>
                            <div className="mt-1 text-sm font-semibold text-pink-500">
                                {formatAmount(
                                    recentIncomeExpense.income -
                                        recentIncomeExpense.expense,
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-3 pb-3 pt-2">
                    <Timeline
                        showScrollArea
                        scrollHeight="420px"
                        items={latestBills.map((bill) => {
                            const category = categoryById.get(bill.categoryId);
                            const amount = amountToNumber(bill.amount);
                            return {
                                id: bill.id,
                                icon: category?.icon ? (
                                    <CategoryIcon icon={category.icon} />
                                ) : (
                                    <i className="icon-[mdi--receipt-text-outline] size-4" />
                                ),
                                iconColor: "var(--wedding-text-soft)",
                                title:
                                    bill.comment ||
                                    category?.name ||
                                    "未命名账单",
                                time: dayjs(bill.time).format("HH:mm"),
                                description: category?.name || "未分类",
                                amount: `${bill.type === "income" ? "+" : "-"}${formatAmount(amount)}`,
                                amountColor:
                                    bill.type === "income"
                                        ? "text-emerald-500"
                                        : "text-orange-500",
                                onClick: async () => {
                                    await showBillInfo(bill);
                                },
                            };
                        })}
                    />
                    {latestBills.length === 0 && !loading && (
                        <div className="flex h-[420px] items-center justify-center rounded-[16px] border border-dashed border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-6 text-center text-sm wedding-muted">
                            还没有账单，先添加一条明细吧。
                        </div>
                    )}
                    {loading && (
                        <div className="flex h-[420px] items-center justify-center">
                            <Loading />
                        </div>
                    )}
                </div>
            </section>

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
                </div>
            </section>

            {eggOpen ? (
                <WeddingEasterEgg
                    kind={eggOpen.kind}
                    title={eggOpen.title}
                    target={eggOpen.target}
                    partnerName={weddingData?.partnerName}
                    nowTick={nowTick}
                    finalCountdownSeconds={finalCountdownSeconds}
                    onClose={() => setEggOpen(null)}
                />
            ) : null}

            {/* 婚期设置弹窗 */}
            <FormDialog
                open={showDatePicker}
                onOpenChange={setShowDatePicker}
                title="设置婚礼日期"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/12">
                                <i className="icon-[mdi--account-heart] size-4 text-rose-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    伴侣昵称
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    用于彩蛋等个性化显示
                                </div>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={partnerNameDraft}
                            onChange={(e) => setPartnerNameDraft(e.target.value)}
                            placeholder="例如：宝贝、佳佳"
                            className="w-full rounded-xl border border-rose-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,241,247,0.9))] px-3 py-2 text-sm text-rose-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-800/50 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(244,114,182,0.08))] dark:text-rose-300"
                        />
                    </div>

                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/12">
                                <i className="icon-[mdi--ring] size-4 text-cyan-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    订婚日期
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    记录订婚的美好时刻
                                </div>
                            </div>
                        </div>
                        <WeddingDatePicker
                            value={engagementDateDraft}
                            onChange={setEngagementDateDraft}
                            tone="cyan"
                        />
                    </div>

                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/12">
                                <i className="icon-[mdi--heart] size-4 text-pink-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    婚礼日期
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    设定人生中最重要的一天
                                </div>
                            </div>
                        </div>
                        <WeddingDatePicker
                            value={weddingDateDraft}
                            onChange={setWeddingDateDraft}
                            tone="pink"
                        />
                    </div>
                </div>

                <div className="mt-5 flex gap-3">
                    <Button
                        onClick={() => setShowDatePicker(false)}
                        variant="outline"
                        className="flex-1 rounded-full border-[color:var(--wedding-line)] text-[color:var(--wedding-text-mute)] hover:bg-[color:var(--wedding-surface-muted)]"
                    >
                        取消
                    </Button>
                    <Button
                        onClick={() => {
                            if (partnerNameDraft.trim()) {
                                updatePartnerName(partnerNameDraft.trim());
                            }
                            if (engagementDateDraft) {
                                updateEngagementDate(engagementDateDraft);
                            }
                            if (weddingDateDraft) {
                                updateWeddingDate(weddingDateDraft);
                            }
                            setShowDatePicker(false);
                        }}
                        className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.6)] hover:shadow-[0_12px_28px_-8px_rgba(236,72,153,0.7)]"
                    >
                        <i className="icon-[mdi--check] mr-1 size-4" />
                        确定
                    </Button>
                </div>
            </FormDialog>
        </WeddingPageShell>
    );
}
